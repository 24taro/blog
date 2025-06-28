import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import { getTagsByIds } from '../lib/tags'
import type { BlogPost } from '../types/blog'

interface PostCardProps {
  post: BlogPost
}

export default function PostCard({ post }: PostCardProps) {
  const postTags = getTagsByIds(post.tags)

  return (
    <Link
      to={`/posts/${post.slug}`}
      className="group block h-40 p-6 bg-white rounded-xl hover:bg-gray-50 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <time className="text-xs text-gray-500">
              {format(new Date(post.publishedAt), 'yyyy年M月d日', { locale: ja })}
            </time>
            <div className="flex items-center gap-1.5">
              {postTags.length > 0 && (
                <>
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                    {postTags[0].name}
                  </span>
                  {postTags.length > 1 && (
                    <span className="text-gray-400 text-xs font-medium">
                      +{postTags.length - 1}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
        </div>

        <div className="ml-4 flex-shrink-0 self-center">
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
