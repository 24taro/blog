export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category?: string // 互換性のために一時的に残す
  tags: string[]
  publishedAt: string
  updatedAt?: string
  thumbnail?: string
  // OGP関連のメタ情報
  ogpTitle?: string // OGP用のタイトル（指定がない場合はtitleを使用）
  ogpDescription?: string // OGP用の説明（指定がない場合はexcerptを使用）
  ogpImage?: string // OGP画像のパス
  keywords?: string[] // SEO用のキーワード
}

export interface Category {
  id: string
  name: string
  description?: string
  color?: string
}

export interface Tag {
  id: string
  name: string
  color?: string
}

export interface SearchResult {
  item: BlogPost
  score?: number
}
