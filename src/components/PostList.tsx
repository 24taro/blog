import type { BlogPost } from '../types/blog'
import PostCard from './PostCard'

interface PostListProps {
  posts: BlogPost[]
  title?: string
  emptyMessage?: string
}

export default function PostList({
  posts,
  title,
  emptyMessage = '記事が見つかりませんでした。',
}: PostListProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      {title && <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>}

      {posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  )
}
