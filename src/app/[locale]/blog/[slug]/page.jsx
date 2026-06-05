import { getTranslations } from "next-intl/server";
import BlogContent from "../../../../components/BlogContent";
import { redirect } from "next/navigation";
import { getStaticBlogPost, getStaticBlogPostIndex } from "../../../../data/posts";
import { formatLocaleDate } from "../../../../helpers/utils";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getStaticBlogPost(slug);

  if (!post) {
    return {
      title: 'Blog Post',
      description: 'Blog post content',
    };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default async function BlogPostPage({ params }) {
  const { locale, slug } = await params;
  const blogT = await getTranslations("Blog");

  const post = getStaticBlogPost(slug);

  if (!post) {
    return redirect('/blog');
  }

  const { frontmatter, html } = post;
  const formattedDate = formatLocaleDate(frontmatter.date);

  // Get previous/next posts
  const index = getStaticBlogPostIndex();
  const activePostIndex = index.findIndex((p) => p.slug === slug);
  const previousSlug = activePostIndex > 0 ? index[activePostIndex - 1]?.slug : null;
  const nextSlug = activePostIndex < index.length - 1 ? index[activePostIndex + 1]?.slug : null;

  const previousPost = previousSlug ? getStaticBlogPost(previousSlug)?.frontmatter : null;
  const nextPost = nextSlug ? getStaticBlogPost(nextSlug)?.frontmatter : null;

  if (previousPost) previousPost.slug = previousSlug;
  if (nextPost) nextPost.slug = nextSlug;

  return (
    <article className="max-w-4xl p-4 mb-10 mx-auto">
      {/* Indicator that this is from blog-app */}
      <div className="mb-8 p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center">
        <p className="text-green-800 dark:text-green-200 font-medium">
          ✅ Bu içerik blog-app projesinden geliyor (Reverse Proxy çalışıyor!)
        </p>
      </div>

      <BlogContent
        sourceHTML={html}
        sourceFrontmatter={frontmatter}
        formattedDate={formattedDate}
      />

      {/* Tags */}
      <div className="mt-8">
        <div className="text-base font-bold mb-2">{blogT("tags")}</div>
        <div className="flex flex-wrap gap-2">
          {frontmatter?.tags?.map((tag) => (
            <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm dark:bg-gray-800">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-4 text-sm text-muted-foreground">
        <span className="font-bold">{blogT("lastUpdated")}:</span> {formattedDate}
      </div>

      {/* Previous/Next Navigation */}
      <div className="mt-12 flex justify-between flex-col md:flex-row border-t border-gray-200 dark:border-gray-700 pt-8 gap-4">
        {previousPost ? (
          <Link
            href={`/blog/${previousPost.slug}`}
            className="flex-1 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="text-sm text-muted-foreground mb-1">← {blogT("previousPost")}</div>
            <div className="font-semibold">{previousPost.title}</div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="flex-1 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-right"
          >
            <div className="text-sm text-muted-foreground mb-1">{blogT("nextPost")} →</div>
            <div className="font-semibold">{nextPost.title}</div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </article>
  );
}
