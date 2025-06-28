import type { Tag } from '../types/blog'

// タグデータ（静的）
export const tags: Tag[] = [
  {
    id: 'react',
    name: 'React',
    color: '#61DAFB',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    color: '#3178C6',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    color: '#F7DF1E',
  },
  {
    id: 'css',
    name: 'CSS',
    color: '#1572B6',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    color: '#339933',
  },
  {
    id: 'frontend',
    name: 'フロントエンド',
    color: '#10B981',
  },
  {
    id: 'backend',
    name: 'バックエンド',
    color: '#6366F1',
  },
  {
    id: 'tech',
    name: 'テクノロジー',
    color: '#3B82F6',
  },
  {
    id: 'career',
    name: 'キャリア',
    color: '#8B5CF6',
  },
  {
    id: 'tools',
    name: 'ツール',
    color: '#F59E0B',
  },
  {
    id: 'thoughts',
    name: '雑記',
    color: '#EF4444',
  },
  {
    id: 'tutorial',
    name: 'チュートリアル',
    color: '#EC4899',
  },
  {
    id: 'tips',
    name: 'Tips',
    color: '#14B8A6',
  },
]

// IDからタグを取得
export function getTagById(id: string): Tag | undefined {
  return tags.find((tag) => tag.id === id)
}

// 複数のIDからタグを取得
export function getTagsByIds(ids: string[]): Tag[] {
  return ids.map((id) => getTagById(id)).filter((tag): tag is Tag => tag !== undefined)
}
