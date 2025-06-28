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
