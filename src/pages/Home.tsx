import Fuse from 'fuse.js'
import { useMemo, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { MetaTags } from '../components/MetaTags'
import PostList from '../components/PostList'
import { getAllPosts } from '../lib/posts'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const posts = getAllPosts()

  // Fuse.jsによる全文検索の設定
  const fuse = useMemo(() => {
    const options = {
      keys: [
        { name: 'title', weight: 0.3 },
        { name: 'excerpt', weight: 0.2 },
        { name: 'content', weight: 0.4 },
        { name: 'tags', weight: 0.1 },
      ],
      threshold: 0.3,
      includeScore: true,
    }
    return new Fuse(posts, options)
  }, [posts])

  // 検索結果のフィルタリング
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts
    }

    const results = fuse.search(searchQuery)
    return results.map((result) => result.item)
  }, [searchQuery, fuse, posts])

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="24taro's Blog - プログラミングと技術のブログ"
        description="プログラミング、フロントエンド開発、キャリア、便利なツールなどについて発信しています。"
        url="https://24taro.github.io/blog/"
      />
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* 検索バナー */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="タイトル、内容、タグから検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <PostList
            posts={filteredPosts}
            title={searchQuery ? `"${searchQuery}" の検索結果` : ''}
            emptyMessage={
              searchQuery
                ? `"${searchQuery}" に一致する記事が見つかりませんでした。`
                : '記事がまだありません。'
            }
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
