import { getMessages, getTranslations } from "next-intl/server";
import { SafeImage } from "../../../components/safe-image";
import { getStaticBlogPosts } from "../../../data/posts";
import { Link } from "@/i18n/navigation";

export async function generateMetadata() {
  return {
    title: 'Blog - Divmagic',
    description: 'Discover the latest insights on AI, technology, and business.',
  };
}

export default async function BlogPage({ params, searchParams }) {
  const { locale } = await params;
  const blogT = await getTranslations("Blog");

  const currentPage = Math.max(1, Number((await searchParams)?.page ?? 1) || 1);
  const perPage = 12;

  // Use static posts instead of S3
  const { posts: postsList, totalPages } = getStaticBlogPosts(locale, { page: currentPage, perPage });

  const buildPageHref = (page) => `/blog?page=${page}`;

  return (
    <div className="container mx-auto px-4 py-8 my-12 min-h-screen h-full">
      <h1 className="text-center text-4xl font-bold mb-4">{blogT("main")}</h1>
      <p className="text-muted-foreground mb-8 text-center">{blogT("sub")}</p>

      {/* Indicator that this is from blog-app */}
      <div className="mb-8 p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center">
        <p className="text-green-800 dark:text-green-200 font-medium">
          ✅ Bu içerik blog-app projesinden geliyor (Reverse Proxy çalışıyor!)
        </p>
      </div>

      {postsList.length === 0 ? (
        <div className="text-center text-muted-foreground">{blogT("noPosts")}</div>
      ) : (
        <>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {postsList.map((post) => (
              <article
                key={post.slug}
                className="border rounded-lg p-0 hover:shadow-lg flex transition-shadow flex-col h-full"
              >
                <div>
                  <SafeImage src={post.image} alt={post.title} className="w-full h-[150px] object-cover rounded-t-lg" />
                </div>
                <div className="flex-1 mt-1 p-6">
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600 transition-colors">{post.title}</h2>
                  </Link>
                  <div className="text-muted-foreground mb-4">
                    {new Date(post.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </div>
                  <p className="text-muted-foreground mb-4">{post.description}</p>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-sm text-muted-foreground bg-gray-100 px-3 py-1 rounded-full dark:bg-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <div className="flex items-center gap-3 border-t pt-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      D
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{post.author}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-3">
              <Link
                href={buildPageHref(Math.max(1, currentPage - 1))}
                aria-disabled={currentPage <= 1}
                className={`px-4 py-2 rounded-md border ${
                  currentPage <= 1 ? "pointer-events-none opacity-50" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {`← ${blogT("prev")}`}
              </Link>

              <div className="text-sm text-muted-foreground">
                {blogT("page")} <span className="font-medium">{currentPage}</span> / {totalPages}
              </div>

              <Link
                href={buildPageHref(Math.min(totalPages, currentPage + 1))}
                aria-disabled={currentPage >= totalPages}
                className={`px-4 py-2 rounded-md border ${
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {`${blogT("next")} →`}
              </Link>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
