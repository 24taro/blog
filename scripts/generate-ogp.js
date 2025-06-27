import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Puppeteerのブラウザインスタンスを保持
let browser = null;

// ブラウザを起動する関数
async function launchBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  return browser;
}

// ブラウザを閉じる関数
async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

// HTMLテンプレートを読み込んで変数を置換する関数
function loadTemplate(templateName, variables = {}) {
  const templatePath = path.join(__dirname, 'ogp-templates', `${templateName}.html`);
  let html = fs.readFileSync(templatePath, 'utf-8');
  
  // 変数を置換
  Object.entries(variables).forEach(([key, value]) => {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), escapeHtml(value));
  });
  
  return html;
}

// HTMLエスケープ処理
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// OGP画像を生成する関数
export async function generateOGPImage(title, slug, category = 'tech') {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  
  try {
    // ビューポートを設定
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 1
    });
    
    // HTMLテンプレートを読み込み
    const html = loadTemplate('article', {
      TITLE: title,
      CATEGORY: category
    });
    
    // HTMLを設定
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });
    
    // 出力ディレクトリを作成
    const outputDir = path.join(__dirname, '..', 'public', 'ogp');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // スクリーンショットを撮影
    const outputPath = path.join(outputDir, `${slug}.png`);
    await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: false
    });
    
    console.log(`✅ OGP画像を生成しました: ${outputPath}`);
    return `/ogp/${slug}.png`;
  } catch (error) {
    console.error(`❌ OGP画像の生成に失敗しました: ${error.message}`);
    throw error;
  } finally {
    await page.close();
  }
}

// デフォルトのOGP画像を生成する関数
export async function generateDefaultOGPImage() {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  
  try {
    // ビューポートを設定
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 1
    });
    
    // HTMLテンプレートを読み込み
    const html = loadTemplate('default');
    
    // HTMLを設定
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });
    
    // 出力ディレクトリを作成
    const outputDir = path.join(__dirname, '..', 'public', 'ogp');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // スクリーンショットを撮影
    const outputPath = path.join(outputDir, 'default.png');
    await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: false
    });
    
    console.log(`✅ デフォルトOGP画像を生成しました: ${outputPath}`);
  } catch (error) {
    console.error(`❌ デフォルトOGP画像の生成に失敗しました: ${error.message}`);
    throw error;
  } finally {
    await page.close();
  }
}

// すべての記事のOGP画像を生成する関数
export async function generateAllOGPImages() {
  try {
    // デフォルトOGP画像を生成
    await generateDefaultOGPImage();
    
    // 記事のOGP画像を生成
    const postsDir = path.join(__dirname, '..', 'posts');
    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.json'));
    
    for (const file of files) {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const post = JSON.parse(content);
      
      if (post.title && post.slug) {
        const ogpImagePath = await generateOGPImage(
          post.ogpTitle || post.title,
          post.slug,
          post.category || 'tech'
        );
        
        // 記事にOGP情報を追加
        const updatedPost = {
          ...post,
          ogpImage: ogpImagePath,
          ogpTitle: post.ogpTitle || post.title,
          ogpDescription: post.ogpDescription || post.excerpt,
          keywords: post.keywords || []
        };
        
        // 記事ファイルを更新
        fs.writeFileSync(filePath, JSON.stringify(updatedPost, null, 2));
      }
    }
    
    console.log('\n🎉 すべてのOGP画像の生成が完了しました！');
  } finally {
    // ブラウザを閉じる
    await closeBrowser();
  }
}

// CLIから実行された場合
if (process.argv[1] === __filename) {
  generateAllOGPImages().catch(console.error);
}