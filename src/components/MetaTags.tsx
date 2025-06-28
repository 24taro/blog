import { useEffect } from 'react'
import type { BlogPost } from '../types/blog'

interface MetaTagsProps {
  post?: BlogPost
  title?: string
  description?: string
  url?: string
}

export const MetaTags = ({ post, title, description, url }: MetaTagsProps) => {
  useEffect(() => {
    // 基本的なメタ情報
    const pageTitle = post?.title || title || "24taro's Blog"
    const pageDescription = post?.excerpt || description || 'プログラミングと技術に関するブログ'
    const pageUrl = url || window.location.href
    const ogImage = post?.slug ? `/ogp/${post.slug}.png` : '/ogp/default.png'

    // タイトルの更新
    document.title = pageTitle

    // メタタグの更新または作成
    const updateOrCreateMeta = (property: string, content: string, isProperty = true) => {
      const attrName = isProperty ? 'property' : 'name'
      let meta = document.querySelector(`meta[${attrName}="${property}"]`) as HTMLMetaElement

      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attrName, property)
        document.head.appendChild(meta)
      }

      meta.content = content
    }

    // 通常のメタタグ
    updateOrCreateMeta('description', pageDescription, false)

    // OGPメタタグ
    updateOrCreateMeta('og:title', pageTitle)
    updateOrCreateMeta('og:description', pageDescription)
    updateOrCreateMeta('og:type', post ? 'article' : 'website')
    updateOrCreateMeta('og:url', pageUrl)
    updateOrCreateMeta('og:image', `https://24taro.github.io/blog${ogImage}`)
    updateOrCreateMeta('og:site_name', "24taro's Blog")
    updateOrCreateMeta('og:locale', 'ja_JP')

    // Twitter Card メタタグ
    updateOrCreateMeta('twitter:card', 'summary_large_image', false)
    updateOrCreateMeta('twitter:title', pageTitle, false)
    updateOrCreateMeta('twitter:description', pageDescription, false)
    updateOrCreateMeta('twitter:image', `https://24taro.github.io/blog${ogImage}`, false)

    // 記事の場合は追加のメタタグ
    if (post) {
      updateOrCreateMeta('article:published_time', post.publishedAt)
      if (post.updatedAt) {
        updateOrCreateMeta('article:modified_time', post.updatedAt)
      }
      if (post.tags && post.tags.length > 0) {
        for (const tag of post.tags) {
          updateOrCreateMeta('article:tag', tag)
        }
      }
    }

    // クリーンアップ（コンポーネントがアンマウントされたときの処理）
    return () => {
      // タイトルをデフォルトに戻す
      document.title = "24taro's Blog"
    }
  }, [post, title, description, url])

  return null
}
