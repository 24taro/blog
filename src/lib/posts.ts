import type { BlogPost } from '../types/blog'

// ビルド時に生成される記事データ
let postsData: BlogPost[] = []

// 開発環境では動的にロード
if (import.meta.env.DEV) {
  const modules = import.meta.glob('/posts/*.json', { eager: true })
  postsData = Object.values(modules).map((mod: any) => {
    const post = mod.default || mod
    // 互換性のため: categoryが存在してtagsが存在しない場合、categoryをtagsに変換
    if (post.category && !post.tags) {
      post.tags = [post.category]
    }
    // tagsが存在しない場合は空配列を設定
    if (!post.tags) {
      post.tags = []
    }
    return post
  })
} else {
  // 本番環境では生成されたデータを使用
  // @ts-ignore
  postsData = (window.__POSTS_DATA__ || []).map((post: any) => {
    // 互換性のため: categoryが存在してtagsが存在しない場合、categoryをtagsに変換
    if (post.category && !post.tags) {
      post.tags = [post.category]
    }
    // tagsが存在しない場合は空配列を設定
    if (!post.tags) {
      post.tags = []
    }
    return post
  })
}

export const posts = postsData

export function getAllPosts(): BlogPost[] {
  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug)
}

export function getPostsByTag(tag: string): BlogPost[] {
  return posts
    .filter((post) => post.tags.includes(tag))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

// 複数のタグのいずれかを持つ記事を取得
export function getPostsByTags(tags: string[]): BlogPost[] {
  if (tags.length === 0) return getAllPosts()

  return posts
    .filter((post) => tags.some((tag) => post.tags.includes(tag)))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

// すべてのタグを持つ記事を取得
export function getPostsByAllTags(tags: string[]): BlogPost[] {
  if (tags.length === 0) return getAllPosts()

  return posts
    .filter((post) => tags.every((tag) => post.tags.includes(tag)))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}
