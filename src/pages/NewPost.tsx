import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MarkdownRenderer from '../components/MarkdownRenderer'
import type { BlogPost } from '../types/blog'

export default function NewPost() {
  // 記事データの状態管理
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split('T')[0])
  
  // ID生成（現在の日時を使用）
  const [postId] = useState(() => Date.now().toString())
  
  // 読了時間の自動計算
  
  // Git コマンド表示用の状態
  const [showGitCommand, setShowGitCommand] = useState(false)
  const [gitCommand, setGitCommand] = useState('')
  
  // エディタの表示モード
  const [editorMode, setEditorMode] = useState<'write' | 'preview' | 'both'>('both')
  
  // スラッグの自動生成
  useEffect(() => {
    if (title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setSlug(generatedSlug)
    }
  }, [title, slug])
  
  // 記事データの生成
  const generatePostData = useCallback((): BlogPost => {
    return {
      id: postId,
      slug,
      title,
      excerpt,
      content,
      tags: selectedTags,
      publishedAt,
      ...(thumbnail && { thumbnail }),
    }
  }, [postId, slug, title, excerpt, content, selectedTags, publishedAt, thumbnail])
  
  // Git コマンドの生成
  const generateGitCommands = useCallback(() => {
    const postData = generatePostData()
    const fileName = `${slug}.json`
    const jsonContent = JSON.stringify(postData, null, 2)
    
    // エスケープ処理
    const escapedJsonContent = jsonContent.replace(/'/g, "'\"'\"'")
    const escapedTitle = title.replace(/'/g, "'\"'\"'")
    const escapedExcerpt = excerpt.replace(/'/g, "'\"'\"'").replace(/\n/g, '\\n')
    
    const commands = `git checkout -b add-post-${slug} && echo '${escapedJsonContent}' > posts/${fileName} && git add posts/${fileName} && git commit -m $'feat(posts): 新規記事「${escapedTitle}」を追加\\n\\n- ID: ${postId}\\n- スラッグ: ${slug}\\n- タグ: ${selectedTags.join(', ')}\\n- 公開日: ${publishedAt}' && git push -u origin add-post-${slug} && gh pr create --title "feat(posts): 新規記事「${escapedTitle}」を追加" --body $'## 概要\\n新しい記事を追加しました。\\n\\n### 記事情報\\n- **タイトル**: ${escapedTitle}\\n- **スラッグ**: ${slug}\\n- **タグ**: ${selectedTags.join(', ')}\\n- **公開日**: ${publishedAt}\\n\\n### 内容の概要\\n${escapedExcerpt}\\n\\n### プレビュー\\nマージ後、以下のURLで記事が確認できます：\\nhttps://[your-github-username].github.io/blog/posts/${slug}'`
    
    setGitCommand(commands)
    setShowGitCommand(true)
  }, [generatePostData, slug, title, postId, selectedTags, publishedAt, excerpt])
  
  // バリデーション
  const isValid = title && slug && excerpt && content && selectedTags.length > 0
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              ← ホームに戻る
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-8">新規投稿作成</h1>
          
          {/* 基本情報入力フォーム */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">記事の基本情報</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="記事のタイトルを入力"
                />
              </div>
              
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  スラッグ（URL） *
                </label>
                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="url-slug"
                />
                <p className="text-xs text-gray-500 mt-1">
                  記事のURL: /posts/{slug || 'url-slug'}
                </p>
              </div>
              
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                  概要 *
                </label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="記事の概要を入力（一覧ページに表示されます）"
                />
              </div>
              
              <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                  サムネイル画像URL（任意）
                </label>
                <input
                  id="thumbnail"
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700 mb-1">
                  公開日 *
                </label>
                <input
                  id="publishedAt"
                  type="date"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  タグ * （カンマ区切りで複数入力可）
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value)
                    // カンマ区切りでタグを分割
                    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    setSelectedTags(tags)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例: React, TypeScript, フロントエンド"
                />
                <p className="text-xs text-gray-500 mt-1">
                  入力したタグ: {selectedTags.length > 0 ? selectedTags.join(', ') : 'なし'}
                </p>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>ID: {postId}</span>
              </div>
            </div>
          </div>
          
          {/* マークダウンエディタ */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">記事本文（Markdown）</h2>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditorMode('write')}
                    className={`px-3 py-1 text-sm rounded ${
                      editorMode === 'write' 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('preview')}
                    className={`px-3 py-1 text-sm rounded ${
                      editorMode === 'preview' 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    プレビュー
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('both')}
                    className={`px-3 py-1 text-sm rounded ${
                      editorMode === 'both' 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    両方表示
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`grid ${editorMode === 'both' ? 'grid-cols-2' : 'grid-cols-1'} divide-x divide-gray-200`}>
              {/* エディタ */}
              {(editorMode === 'write' || editorMode === 'both') && (
                <div className="p-4">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-[600px] px-3 py-2 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="# 見出し&#10;&#10;本文をMarkdown形式で入力してください..."
                  />
                </div>
              )}
              
              {/* プレビュー */}
              {(editorMode === 'preview' || editorMode === 'both') && (
                <div className="p-4">
                  <div className="prose prose-sm max-w-none h-[600px] overflow-y-auto">
                    {content ? (
                      <MarkdownRenderer content={content} />
                    ) : (
                      <p className="text-gray-400">プレビューがここに表示されます</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* アクションボタン */}
          <div className="mt-6 flex justify-end space-x-4">
            <Link
              to="/"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </Link>
            <button
              type="button"
              onClick={generateGitCommands}
              disabled={!isValid}
              className={`px-6 py-2 rounded-lg ${
                isValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Gitコマンドを生成
            </button>
          </div>
          
          {/* Git コマンド表示 */}
          {showGitCommand && (
            <div className="mt-8 bg-gray-900 text-white rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">生成されたGitコマンド</h3>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(gitCommand)
                    alert('コマンドをクリップボードにコピーしました！')
                  }}
                  className="px-3 py-1 bg-blue-600 text-sm rounded hover:bg-blue-700"
                >
                  コピー
                </button>
              </div>
              <pre className="overflow-x-auto text-sm font-mono whitespace-pre-wrap break-all">
                {gitCommand}
              </pre>
              <p className="mt-4 text-sm text-gray-300">
                上記のコマンドをターミナルで一度に実行してください。プルリクエストがマージされると、記事がブログに反映されます。
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}