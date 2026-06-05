import { staticPosts } from "../../data/posts";
import Link from "next/link";

export const metadata = {
  title: 'Blog - Divmagic',
  description: 'Discover the latest insights on AI, technology, and business.',
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-center text-4xl font-bold mb-4">Blog</h1>
      <p className="text-gray-600 mb-8 text-center">Discover the latest insights on AI, technology, and business.</p>

      {/* Indicator that this is from blog-app */}
      <div className="mb-8 p-4 bg-green-100 rounded-lg text-center">
        <p className="text-green-800 font-medium">
          ✅ Bu içerik blog-app projesinden geliyor (Reverse Proxy çalışıyor!)
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {staticPosts.map((post) => (
          <article
            key={post.slug}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[150px] object-cover"
            />
            <div className="p-6">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-500 text-sm mb-3">
                {new Date(post.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
              <p className="text-gray-600 mb-4">{post.description}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-gray-100 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
