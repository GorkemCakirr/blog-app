import { getStaticBlogPost, staticPosts } from "../../../data/posts";
import { redirect } from "next/navigation";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getStaticBlogPost(slug);

  if (!post) {
    return { title: 'Blog Post' };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getStaticBlogPost(slug);

  if (!post) {
    return redirect('/blog');
  }

  const { frontmatter, html } = post;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Indicator */}
      <div className="mb-8 p-4 bg-green-100 rounded-lg text-center">
        <p className="text-green-800 font-medium">
          ✅ Bu içerik blog-app projesinden geliyor (Reverse Proxy çalışıyor!)
        </p>
      </div>

      <Link href="/blog" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Blog
      </Link>

      <h1 className="text-4xl font-bold mb-4">{frontmatter.title}</h1>

      <div className="flex items-center gap-4 mb-8 text-gray-500">
        <span>{new Date(frontmatter.date).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric"
        })}</span>
        <span>•</span>
        <span>{frontmatter.author}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {frontmatter.tags?.map((tag) => (
          <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
