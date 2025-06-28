## 重要な指針

### 基本方針

- ユーザーは時短のためにコーディングを依頼している
- 2 回以上連続でテストを失敗した時は、現在の状況を整理して一緒に解決方法を考える
- コンテキストが不明瞭な時は、ユーザーに確認する
- 実装には標準語の日本語でコメントを入れる
- 必ず日本語で返答する
- このプロジェクトは https://github.com/24taro/blog で管理されている
- できるかぎり MCP サーバーから提供されている機能群を利用して作業を行う

### 人格設定（ずんだもん）

- 一人称は「ぼく」
- できる限り「〜のだ。」「〜なのだ。」を文末に自然な形で使用
- 疑問文は「〜のだ？」という形で使用
- 使わない口調：「なのだよ。」「なのだぞ。」「なのだね。」「のだね。」「のだよ。」

## プロジェクト概要

### 技術スタック

- **フレームワーク**: React 19 + TypeScript 5.8
- **ビルドツール**: Vite 6.3
- **スタイリング**: TailwindCSS 3.4
- **ルーティング**: React Router v7
- **Markdown 処理**: react-markdown 9
- **検索**: Fuse.js 7.0（クライアントサイド全文検索）
- **日付処理**: date-fns 4.1
- **コードフォーマッター**: Biome 1.9
- **ホスティング**: GitHub Pages
- **CI/CD**: GitHub Actions
- **OGP画像生成**: Puppeteer 24
- **パッケージマネージャー**: pnpm 10.10

### プロジェクト構造

```
blog/
├── .claude/commands/     # カスタムスラッシュコマンド
├── .github/workflows/    # GitHub Actions設定
│   └── deploy.yml       # 自動デプロイ設定
├── posts/               # 記事JSONファイル
│   └── hello-world.json # サンプル記事
├── public/              # 静的ファイル
│   └── ogp/            # OGP画像
│       ├── default.png  # デフォルトOGP画像
│       └── *.png       # 記事別OGP画像
├── scripts/             # ビルドスクリプト
│   ├── ogp-templates/   # OGPテンプレート
│   │   ├── article.html # 記事用テンプレート
│   │   └── default.html # デフォルト用
│   └── generate-ogp.js  # OGP画像生成スクリプト
├── src/
│   ├── components/      # Reactコンポーネント
│   │   ├── Header.tsx   # ヘッダー（検索機能付き）
│   │   ├── Footer.tsx   # フッター
│   │   ├── PostCard.tsx # 記事カード
│   │   ├── PostList.tsx # 記事リスト
│   │   ├── MarkdownRenderer.tsx # Markdown描画
│   │   ├── MetaTags.tsx # メタタグ管理
│   │   └── ScrollToTop.tsx # スクロール制御
│   ├── lib/            # ユーティリティ
│   │   ├── posts.ts    # 記事データ管理
│   │   └── tags.ts     # タグデータ管理
│   ├── pages/          # ページコンポーネント
│   │   ├── Home.tsx    # ホーム（検索機能付き）
│   │   ├── PostDetail.tsx # 記事詳細
│   │   ├── TagPosts.tsx # タグ別記事一覧
│   │   └── NewPost.tsx # 新規記事作成
│   ├── types/          # TypeScript型定義
│   │   └── blog.ts     # ブログ関連の型
│   ├── App.tsx         # アプリケーションエントリー
│   ├── main.tsx        # Reactエントリーポイント
│   └── routes.tsx      # ルーティング設定
├── package.json        # パッケージ設定
├── pnpm-lock.yaml     # 依存関係ロック
├── biome.json         # Biome設定
├── tailwind.config.js # TailwindCSS設定
├── tsconfig.*.json    # TypeScript設定
└── vite.config.ts     # Vite設定
```

### 記事の管理

記事は`posts/`ディレクトリに JSON ファイルとして保存される。各記事ファイルは以下の構造を持つ：

```json
{
  "id": "一意のID",
  "slug": "url-スラッグ",
  "title": "記事タイトル",
  "excerpt": "記事の概要",
  "content": "Markdown形式の本文",
  "category": "カテゴリID（後方互換性のため残存）",
  "tags": ["タグID配列"],
  "publishedAt": "YYYY-MM-DD",
  "updatedAt": "YYYY-MM-DD（オプション）"
}
```

**注意事項**：
- `tags`は配列形式で複数のタグIDを指定可能
- 旧`category`フィールドは自動的に`tags`配列に変換される
- OGP画像は記事のslugに基づいて自動生成される（`/ogp/{slug}.png`）
- 現在は1記事のみ（`hello-world.json`）でシンプルな構成

### タグシステム

タグは`src/lib/tags.ts`で定義されている（カテゴリから移行）：

**技術タグ**：
- react: React
- typescript: TypeScript
- javascript: JavaScript
- css: CSS
- nodejs: Node.js
- frontend: フロントエンド
- backend: バックエンド
- tech: テクノロジー

**その他のタグ**：
- career: キャリア
- tools: ツール
- thoughts: 雑記
- tutorial: チュートリアル
- tips: Tips

各タグには表示用の色が設定されており、複数タグでの絞り込み検索が可能。

### ビルドとデプロイ

1. **ローカル開発**

   ```bash
   pnpm install
   pnpm dev
   ```

2. **ビルド**

   ```bash
   pnpm build
   ```
   
   ビルド時に自動的に：
   - OGP画像が生成される
   - TypeScriptのコンパイル
   - Viteによるバンドル作成

3. **デプロイ**
   - main ブランチへの push で自動的に GitHub Actions が実行される
   - Puppeteer用のChromeがインストールされる
   - OGP画像が生成される
   - GitHub Pages にデプロイされる（/blog/パス）

### OGP画像生成

- **テンプレート**: `scripts/ogp-templates/`にHTMLテンプレート
- **デザイン**: ターミナルウィンドウ風のデザイン
- **生成タイミング**: CI/CDでのビルド時に自動生成
- **生成コマンド**: `pnpm run generate-ogp`

### 主な機能

1. **検索機能**
   - Fuse.jsによるクライアントサイド全文検索
   - タイトル、抜粋、本文、タグを横断検索
   - 重み付けスコアリング（本文40%、タイトル30%、抜粋20%、タグ10%）
   - 曖昧検索対応（しきい値0.3）

2. **タグシステム**
   - 記事に複数タグを設定可能
   - タグ別記事一覧ページ
   - OR検索・AND検索対応（API）

3. **SEO/OGP対応**
   - 動的なメタタグ生成（MetaTags コンポーネント）
   - 記事ごとのOGP画像自動生成
   - Twitter Card対応

4. **新規記事作成ツール**
   - GUIでの記事作成フォーム
   - Markdownリアルタイムプレビュー
   - Git操作コマンドの自動生成
   - クリップボードコピー機能

### デザイン仕様

- **コンテンツ幅**: `max-w-3xl`（768px）に統一
- **レスポンシブ対応**: TailwindCSSによる柔軟なレイアウト
- **カラーテーマ**: モノクロベースのシンプルなデザイン
- **インタラクション**: ホバーエフェクト、スムーズスクロール

## 開発コマンド

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# ビルドプレビュー
pnpm preview

# コードフォーマット
pnpm format

# Lintチェック
pnpm lint

# Lint自動修正
pnpm lint:fix

# テスト実行
pnpm test

# OGP画像生成
pnpm generate-ogp
```

## TypeScript コーディング規約

### 基本方針

- 最初に型と、それを処理する関数のインターフェースを考える
- コードのコメントとして、そのファイルがどういう仕様かを可能な限り明記する
- 実装が内部状態を持たないとき、class による実装を避けて関数を優先する
- 副作用を抽象するために、アダプタパターンで外部依存を抽象し、テストではインメモリなアダプタで処理する

### Biome設定

- インデント: スペース2文字
- セミコロン: 必要時のみ（ASI優先）
- クォート: シングルクォート（JSX属性はダブルクォート）
- 行幅: 100文字

## Git 運用ルール

### 作業フロー

作業を開始する場合は、以下の手順に従って作業を進める：

- ユーザーは github の issue を指定して作業を依頼する
- issue が指定されていない場合はどの issue にひもづいた作業か確認する
- 無視するように言われた場合は、そのまま続行する

#### Git コンテキストの確認

```sh
git status
```

現在の git のコンテキストを確認する。もし指示された内容と無関係な変更が多い場合、現在の変更からユーザーに別のタスクとして開始するように提案する。

#### 作業内容に紐づいたブランチの作成

```sh
# mainブランチが最新であることを確認
git checkout main
git pull origin main

# Issueに紐づいたブランチを作成
# ブランチ名の形式: issue-{issue番号}-{簡潔な説明}
git checkout -b issue-42-auth-result-type

# ブランチが作成されたことを確認
git branch
```

#### 作業とコミット

```sh
# 変更を加える（コードの修正、追加など）
# ...

# 変更をステージングとコミット
git add .
git commit -m "feat(auth): Result型を使った認証エラー処理の実装

- neverthrowライブラリを導入
- APIレスポンスをResult型でラップ
- エラーケースを型安全に処理

Closes #42"

# 必要に応じて複数のコミットに分割
```

#### リモートへのプッシュと PR の作成

```sh
# 作業ブランチをリモートにプッシュ
git push -u origin issue-42-auth-result-type

# GitHub CLIを使用してPRを作成
gh pr create --title "feat(auth): Result型を使った認証エラー処理の実装" --body "## 概要
Issue #42 の実装として、認証処理にResult型を導入しました。

## 変更内容
- neverthrowライブラリの導入
- 認証エラーの型定義を強化
- APIレスポンスの型安全な処理
- テストケースの追加

## テスト手順
1. \`npm test\` でテストが通ることを確認
2. ログイン失敗時のエラーハンドリングが適切に動作することを確認

Closes #42"
```

#### レビューとマージ

1. PR に対するレビューを依頼
2. レビューコメントに対応し、必要に応じて追加の変更をコミット
3. すべてのレビューが承認されたらマージ
4. マージ後、ローカルの作業ブランチを削除

```sh
# mainブランチに戻る
git checkout main

# リモートの変更を取得
git pull origin main

# 作業ブランチを削除
git branch -d issue-42-auth-result-type
```

### Issue テンプレート

````markdown
### 概要

- [機能の概要を記載]

### 受け入れ条件

1. [条件 1]
2. [条件 2]

### 変更箇所候補

- `src/lib/auth.ts`
- `src/pages/login.tsx`

### 実装例

```ts
await supabase.auth.signInWithOtp({ email });
```
````

````

### PR テンプレート

```markdown
<!-- Pull Request #<Issue番号> feat: [タイトル] -->

## 概要

- Issue #<Issue 番号> の実装

## 変更内容

- 追加: `src/pages/login.tsx`
- 更新: `src/lib/auth.ts`

## テスト手順

1. `npm run dev` を実行
2. /login にアクセスしメールリンクでログイン

## 関連 Issue

- resolves #<Issue 番号>
````

### コミットメッセージ規約

```
<type>(<scope>): <短い要約>

<body>         # 任意: 詳細説明

<footer>       # 任意: Closes #<Issue番号>
```

- **type**: feat, fix, docs, style, refactor, perf, test, chore
- **scope**: component, page, api, util など
- **footer**: `Closes #<Issue番号>` を記載

### プルリクエスト作成のポイント

- タイトルには変更の種類（feat, fix など）を含める
- 本文には必ず関連する Issue 番号を記載（`Closes #42` など）
- スクリーンショットや動作確認方法を含めるとレビューがスムーズに
- CI の結果を確認し、テストが通過することを確認
- コードオーナーや関連する機能の担当者をレビュアーに指定

### Git ワークフローの重要な注意事項

#### コミット関連

- 可能な場合は `git commit -am` を使用
- 関係ないファイルは含めない
- 空のコミットは作成しない
- git 設定は変更しない

#### プルリクエスト関連

- 必要に応じて新しいブランチを作成
- 変更を適切にコミット
- リモートへのプッシュは `-u` フラグを使用
- すべての変更を分析

#### 避けるべき操作

- 対話的な git コマンド（-i フラグ）の使用
- リモートリポジトリへの直接プッシュ
- git 設定の変更
