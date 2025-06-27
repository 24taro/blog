import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// 記事データを読み込む
function loadPosts() {
  const postsDir = path.join(__dirname, 'posts')
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.json'))
  
  return files.map(file => {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf-8')
    return JSON.parse(content)
  })
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inject-posts-data',
      transformIndexHtml(html) {
        const posts = loadPosts()
        const script = `<script>window.__POSTS_DATA__ = ${JSON.stringify(posts)};</script>`
        return html.replace('</head>', `${script}</head>`)
      }
    }
  ],
  base: '/blog/', // GitHub Pages用のベースパス
})