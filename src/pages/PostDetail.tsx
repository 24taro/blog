import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Link, Navigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { MetaTags } from "../components/MetaTags";
import { getPostBySlug } from "../lib/posts";
import { getTagsByIds } from "../lib/tags";

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug!);

  if (!post) {
    return <Navigate to="/" replace />;
  }

  const postTags = getTagsByIds(post.tags);

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        post={post}
        url={`https://24taro.github.io/blog/posts/${post.slug}`}
      />
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8">
        <article className="bg-white rounded-lg shadow-sm p-2">
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {postTags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/tag/${tag.id}`}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
              <time className="text-sm text-gray-500 ml-auto">
                {format(new Date(post.publishedAt), "yyyy年M月d日", {
                  locale: ja,
                })}
              </time>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>

          <div className="prose-content">
            <MarkdownRenderer content={post.content} />
          </div>

          {post.updatedAt && (
            <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
              最終更新:{" "}
              {format(new Date(post.updatedAt), "yyyy年M月d日", { locale: ja })}
            </div>
          )}
        </article>

        <nav className="mt-12 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
            aria-label="ホームに戻る"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
        </nav>
      </main>

      <Footer />
    </div>
  );
}
