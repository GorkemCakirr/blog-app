// Static blog posts for testing (no AWS needed)
export const staticPosts = [
  {
    slug: "test-blog-post",
    title: "Test Blog Post - Reverse Proxy Working!",
    description: "This is a test blog post to verify that the reverse proxy setup is working correctly.",
    date: "2024-01-15",
    image: "https://picsum.photos/800/400",
    tags: ["test", "reverse-proxy", "nextjs"],
    author: "DivMagic Team"
  },
  {
    slug: "getting-started-with-divmagic",
    title: "Getting Started with DivMagic",
    description: "Learn how to use DivMagic to convert any website design into clean, reusable code.",
    date: "2024-01-10",
    image: "https://picsum.photos/800/401",
    tags: ["tutorial", "divmagic", "web-development"],
    author: "DivMagic Team"
  },
  {
    slug: "tailwind-css-tips",
    title: "10 Tailwind CSS Tips for Better Productivity",
    description: "Boost your development speed with these essential Tailwind CSS tips and tricks.",
    date: "2024-01-05",
    image: "https://picsum.photos/800/402",
    tags: ["tailwind", "css", "tips"],
    author: "DivMagic Team"
  }
];

export const staticPostsContent = {
  "test-blog-post": `
    <h2>Welcome to the Test Post</h2>
    <p>If you're seeing this, the reverse proxy is working correctly! This content is being served from the <strong>blog-app</strong> project, not the main DivMagic project.</p>

    <h3>How it works</h3>
    <p>The main DivMagic site uses Next.js rewrites to proxy all <code>/blog</code> requests to this separate blog application. The user sees the same URL but the content comes from a different source.</p>

    <h3>Benefits</h3>
    <ul>
      <li>Separate deployment for blog</li>
      <li>Independent scaling</li>
      <li>Easier maintenance</li>
      <li>Different tech stack if needed</li>
    </ul>

    <blockquote>This is a great way to modularize your application!</blockquote>

    <h3>Next Steps</h3>
    <p>Once you verify this is working, you can connect to your S3 bucket or any other data source to serve real blog posts.</p>
  `,
  "getting-started-with-divmagic": `
    <h2>Introduction to DivMagic</h2>
    <p>DivMagic is a powerful tool that helps developers convert website designs into clean, production-ready code.</p>

    <h3>Key Features</h3>
    <ul>
      <li>Convert any website element to React/Vue/HTML</li>
      <li>Export to Tailwind CSS or plain CSS</li>
      <li>Preserve responsive design</li>
      <li>Clean, semantic output</li>
    </ul>

    <h3>Getting Started</h3>
    <p>To get started with DivMagic, simply install the browser extension and click on any element you want to convert.</p>

    <pre><code>// Example output from DivMagic
const Button = () => (
  &lt;button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"&gt;
    Click me
  &lt;/button&gt;
);</code></pre>
  `,
  "tailwind-css-tips": `
    <h2>Tailwind CSS Tips</h2>
    <p>Here are some tips to boost your productivity with Tailwind CSS.</p>

    <h3>1. Use @apply sparingly</h3>
    <p>While @apply is useful, overusing it defeats the purpose of utility-first CSS.</p>

    <h3>2. Leverage the config file</h3>
    <p>Customize your design system in tailwind.config.js for consistent styling.</p>

    <h3>3. Use arbitrary values</h3>
    <p>When you need a specific value, use square brackets: <code>w-[137px]</code></p>

    <h3>4. Group hover states</h3>
    <p>Use the group and group-hover utilities for complex hover interactions.</p>

    <h3>5. Dark mode support</h3>
    <p>Add dark mode variants easily with the <code>dark:</code> prefix.</p>
  `
};

// Helper functions to replace S3 calls
export function getStaticBlogPosts(locale = "en", options = {}) {
  const perPage = options?.perPage ?? 12;
  const page = options?.page ?? 1;

  const totalPosts = staticPosts.length;
  const totalPages = Math.ceil(totalPosts / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const posts = staticPosts.slice(start, end);

  return {
    posts,
    totalPosts,
    totalPages,
    page: currentPage,
    perPage
  };
}

export function getStaticBlogPost(slug) {
  const frontmatter = staticPosts.find(p => p.slug === slug);
  const html = staticPostsContent[slug];

  if (!frontmatter || !html) {
    return null;
  }

  return { frontmatter, html };
}

export function getStaticBlogPostIndex() {
  return staticPosts.map(p => ({ slug: p.slug, lastModified: p.date }));
}
