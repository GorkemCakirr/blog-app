// S3 Helpers
// Compression upload and download
import { promisify } from "node:util";
import { gzip, gunzip } from "node:zlib";
import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const gzipPromise = promisify(gzip);
const gunzipPromise = promisify(gunzip);

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 7200 * 1000; // 2 hours in ms

function cacheGet(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.value;
}

function cachePut(key, value, ttlSeconds = 7200) {
  cache.set(key, {
    value,
    expiry: Date.now() + ttlSeconds * 1000,
  });
}

// Convert stream to buffer
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function s3Put({ Bucket, Key, Body, ContentEncoding = "gzip", ContentType = "application/json" }) {
  if (!Body || !Key || !Bucket) {
    throw new Error(`Missing required parameters for S3 Put. You provided ${JSON.stringify({ Bucket, Key, Body })}`);
  }
  if (!ContentType) {
    const extension = Key.split(".").pop().toLowerCase();
    switch (extension) {
      case "json":
        ContentType = "application/json";
        break;
      case "pdf":
        ContentType = "application/pdf";
        break;
      case "html":
        ContentType = "text/html";
        break;
      default:
        ContentType = "application/octet-stream";
    }
  }

  let processedBody;
  if (ContentType === "application/json") {
    const stringifiedBody = JSON.stringify(Body);
    const size = Buffer.byteLength(stringifiedBody, "utf-8");
    processedBody = size > 1024 ? await gzipPromise(stringifiedBody) : stringifiedBody;
    ContentEncoding = size > 1024 ? ContentEncoding : undefined;
  } else if (ContentType === "text/html") {
    const size = Buffer.byteLength(Body, "utf-8");
    processedBody = size > 1024 ? await gzipPromise(Body) : Body;
    ContentEncoding = size > 1024 ? ContentEncoding : undefined;
  } else {
    processedBody = Body;
    ContentEncoding = undefined;
  }

  return s3Client.send(
    new PutObjectCommand({
      Bucket,
      Key,
      Body: processedBody,
      ContentType,
      ...(ContentEncoding && { ContentEncoding })
    })
  );
}

export async function s3Get({ Bucket, Key }) {
  if (!Key || !Bucket) {
    throw new Error(`Missing required parameters for S3 Get. You provided ${JSON.stringify({ Bucket, Key })}`);
  }
  const s3Data = await s3Client.send(new GetObjectCommand({ Bucket, Key }));
  const body = await streamToBuffer(s3Data.Body);

  if (s3Data.ContentEncoding === "gzip") {
    const decompressed = await gunzipPromise(body);
    const contentType = s3Data.ContentType || "application/octet-stream";

    if (contentType === "application/json") {
      return JSON.parse(decompressed);
    }

    if (contentType.includes("text/html") || contentType.includes("text/plain")) {
      return decompressed.toString("utf-8");
    }

    return decompressed;
  }

  const contentType = s3Data.ContentType || "application/octet-stream";

  if (contentType === "application/json") {
    return JSON.parse(body.toString());
  }

  if (contentType.includes("text/html") || contentType.includes("text/plain")) {
    return body.toString("utf-8");
  }

  return body;
}

export async function getBlogPostIndex(locale = "en") {
  const cacheKey = `blog_post_index_${locale}`;

  const cachedIndex = cacheGet(cacheKey);
  if (cachedIndex) return cachedIndex;

  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.NEXT_S3_USER_BUCKET_NAME,
      Prefix: `posts/${locale}/`
    });

    const response = await s3Client.send(listCommand);

    const index = (response.Contents || [])
      .filter((file) => file?.Key?.endsWith("-frontmatter.json"))
      .map((file) => {
        const slug = file.Key.replace(`posts/${locale}/`, "").replace("-frontmatter.json", "");
        return {
          slug,
          lastModified: file.LastModified ? new Date(file.LastModified).toISOString() : null
        };
      })
      .sort((a, b) => new Date(b.lastModified || 0) - new Date(a.lastModified || 0));

    cachePut(cacheKey, index, 7200);
    return index;
  } catch (error) {
    console.error("Error building blog index:", error);
    return [];
  }
}

export async function getBlogPosts(locale = "en", options = undefined) {
  const perPage = options?.perPage ?? null;
  const page = options?.page ?? 1;

  const index = await getBlogPostIndex(locale);
  if (!index.length) {
    return perPage ? { posts: [], totalPosts: 0, totalPages: 0, page: 1, perPage: perPage ?? 12 } : [];
  }

  const totalPosts = index.length;
  const totalPages = perPage ? Math.ceil(totalPosts / perPage) : 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const pageCacheKey = `blog_posts_page_${locale}_${currentPage}_${perPage ?? "all"}`;
  const cachedPage = cacheGet(pageCacheKey);
  if (cachedPage) {
    if (perPage) {
      return { ...cachedPage, totalPosts, totalPages };
    }
    return cachedPage;
  }

  const sliceStart = perPage ? (currentPage - 1) * perPage : 0;
  const sliceEnd = perPage ? sliceStart + perPage : index.length;
  const pageItems = index.slice(sliceStart, sliceEnd);

  try {
    const posts = await Promise.all(
      pageItems.map(async ({ slug }) => {
        const postData = await s3Get({
          Bucket: process.env.NEXT_S3_USER_BUCKET_NAME,
          Key: `posts/${locale}/${slug}-frontmatter.json`
        });

        return { ...postData, slug };
      })
    );

    if (perPage) {
      const result = { posts, totalPosts, totalPages, page: currentPage, perPage };
      cachePut(pageCacheKey, result, 7200);
      return result;
    }

    cachePut(pageCacheKey, posts, 7200);
    return posts;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return perPage ? { posts: [], totalPosts: 0, totalPages: 0, page: 1, perPage: perPage ?? 12 } : [];
  }
}
