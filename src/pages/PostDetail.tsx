import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Link, Navigate, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import MarkdownRenderer from '../components/MarkdownRenderer'
import { MetaTags } from '../components/MetaTags'
import { getTagsByIds } from '../lib/tags'
import { getPostBySlug } from '../lib/posts'

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>()
  const post = getPostBySlug(slug!)

  if (!post) {
    return <Navigate to="/" replace />
  }

  const postTags = getTagsByIds(post.tags)

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags post={post} url={`https://24taro.github.io/blog/posts/${post.slug}`} />
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8">
        <article className="bg-white rounded-lg shadow-sm p-8">
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
                {format(new Date(post.publishedAt), 'yyyy年M月d日', { locale: ja })}
              </time>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>

            {post.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>
            )}
          </header>

          <div className="prose-content">
            <MarkdownRenderer content={post.content} />
          </div>

          {post.updatedAt && (
            <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
              最終更新: {format(new Date(post.updatedAt), 'yyyy年M月d日', { locale: ja })}
            </div>
          )}
        </article>

        <nav className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            ← ホームに戻る
          </Link>
        </nav>
      </main>

      <Footer />
    </div>
  )
}
