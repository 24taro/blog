import { Navigate, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import PostList from '../components/PostList'
import { getTagById } from '../lib/tags'
import { getPostsByTag } from '../lib/posts'

export default function TagPosts() {
  const { tagId } = useParams<{ tagId: string }>()
  const tag = getTagById(tagId!)
  
  if (!tag) {
    return <Navigate to="/" replace />
  }

  const posts = getPostsByTag(tagId!)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <section className="text-center py-8 px-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <span
              className="inline-flex items-center px-6 py-3 rounded-full text-lg font-bold text-white"
              style={{ backgroundColor: tag.color || '#6B7280' }}
            >
              {tag.name}
            </span>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            「{tag.name}」タグの記事一覧
          </p>
        </section>

        <PostList
          posts={posts}
          title=""
          emptyMessage={`「${tag.name}」タグの記事はまだありません。`}
        />
      </main>

      <Footer />
    </div>
  )
}