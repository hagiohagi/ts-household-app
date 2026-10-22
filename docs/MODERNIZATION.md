# 刷新レポート（2026年10月）

既存コードの解析結果と、最新バージョンへの刷新で行った変更をまとめたものです。

## 1. 解析結果（刷新前の状態）

### 構成

| 項目 | 内容 |
| --- | --- |
| フレームワーク | Next.js 15.3.2（Pages Router）、React 19.1 |
| UI | MUI 7.0、MUI X Date Pickers 8.0、FullCalendar 6.1.17、Chart.js 4.4 |
| フォーム | React Hook Form 7.56 + Zod 3.24 |
| データ | Cloud Firestore（`Transactions` コレクション）にブラウザから直接読み書き |
| テスト | Jest 29 + React Testing Library（23ファイル / 95テスト、全件成功） |
| CI/CD | GitHub Actions（Node 18/20/22でテスト → ビルド → Vercelへデプロイ） |
| 規模 | アプリ本体 約1,500行（ページ3、コンポーネント13） |

### 見つかった問題

**セキュリティ・保守性**

- `npm audit` で脆弱性83件（critical 6件 / high 57件）。Next.js 15.3.2 自体に critical の脆弱性あり
- Node.js 18 は既にサポート終了（CIで使用中）
- テストファイルに型エラー3件（`tsc --noEmit` が失敗する状態）
- テスト用ライブラリが `dependencies` に入っていた（本番依存と開発依存が混在）

**動作上のバグ**

- **SSRが実際には動いていなかった**: `getServerSideProps` が `pages/` ではなく `components/layout/TransactionProvider.tsx` に書かれていたため、Next.js から一度も呼ばれない。全ページが静的生成され、データは常にブラウザから取得されていた。`firebase-admin.ts` もどこからも使われていなかった
- 画面遷移のたびに Firestore から全件を再取得していた（`router.pathname` が依存配列に入っていた）
- レポート画面の集計欄で「残高」の見出しが「収入」と表示されていた
- レポート画面の取引テーブルのローディング表示が、常に `false` の独自stateを見ていて表示されなかった
- 複数件削除時、1件削除するごとに古い state を基に画面を更新していた
- **PRを作るたびに本番(Vercel)へデプロイが走っていた**（deployジョブに条件が無かった）

**その他**

- `next.config.js` に使われていない設定（`styled-components` 用コンパイラ、`fs` のフォールバック、未使用の i18n）
- 未使用の `styles/App.css`（create-react-app の名残）
- `TransactionForm` 内でカテゴリアイコンが `IconComponents` と二重定義
- `jest.setup.js` が MUI の `ThemeProvider` を素通しにモックしており、テーマの検証ができていなかった

### ホスティングについて

README と CI は Vercel へのデプロイを前提としています。一方でロリポップで運用しているとのことなので、
どちらでも動く構成にしました（下記「静的エクスポート化」）。ロリポップの通常プラン（ライト〜ハイスピード等）では
Node.js を常駐させられませんが、このアプリはサーバー処理を一切必要としないため、静的ファイルとして置けば動作します。

## 2. 刷新の方針

アプリが小規模でテストも揃っているため、「作り直し」ではなく **既存の画面・機能・テストを保ったまま、
土台を最新版に載せ替える** 方針を取りました。

- Next.js 16 の **App Router** へ移行（Pages Router は今後の新機能が入らないため）
- `output: "export"` による **静的エクスポート**。`npm run build` で `out/` に HTML 一式が出力され、
  Vercel・ロリポップ・その他の静的ホスティングのどこにでも置ける
- 全依存ライブラリを最新の安定版へ更新

## 3. バージョン対応表

| パッケージ | 旧 | 新 | 備考 |
| --- | --- | --- | --- |
| next | 15.3.2 | 16.4.2 | App Router、Turbopack ビルド |
| react / react-dom | 19.1.0 | 19.3.1 | |
| @mui/material / icons-material | 7.0.2 | 9.5.0 | システム props 廃止 → `sx` へ移行 |
| @mui/x-date-pickers | 8.0.0 | 9.16.0 | |
| @mui/material-nextjs | なし | 9.5.0 | App Router 用の Emotion キャッシュ |
| firebase | 11.6.0 | 13.1.0 | |
| firebase-admin | 13.4.0 | 削除 | 未使用だったため |
| zod | 3.24.3 | 4.6.7 | `message` → `error`、`ZodIssueCode` 廃止対応 |
| @hookform/resolvers | 5.0.1 | 5.9.2 | 6.0 は npm の peer 依存解決で衝突するため 5 系最新 |
| react-hook-form | 7.56.0 | 7.90.0 | `watch()` → `useWatch()` |
| @fullcalendar/* | 6.1.17 | 6.1.22 | 7.x は daygrid 等のプラグインが未対応のため 6 系最新 |
| chart.js / react-chartjs-2 | 4.4.9 / 5.3.0 | 4.5.1 / 5.3.1 | |
| date-fns | 4.1.0 | 4.4.0 | |
| typescript | 5.8.3 | 6.0.3 | 7.0 は typescript-eslint が未対応のため 6 系 |
| eslint / eslint-config-next | 9.26 / 15.3 | 10.13 / 16.4 | Flat Config（`eslint.config.mjs`）へ移行 |
| jest / jest-environment-jsdom | 29.7 | 30.5 | |
| @testing-library/jest-dom | 6.6 | 7.0 | |
| Node.js（CI） | 18 / 20 / 22 | 22 / 24 | |

`npm audit` の結果: **83件 → 本番依存 0件**。
（Firebase が内部で固定している `@grpc/grpc-js` は `overrides` で修正版の 1.14 系に引き上げています。
開発用ツール（ESLint・Jest）の依存に moderate 19件・high 5件が残っていますが、いずれも上流の修正待ちで、本番の配布物には含まれません。）

## 4. 主な変更点

### ディレクトリ構成

```
app/
  layout.tsx        … <html lang="ja">、MUI キャッシュ、共通レイアウト（ヘッダー・サイドバー）
  providers.tsx     … テーマ・AppContext・データ取得（クライアント側）
  page.tsx          … ホーム（旧 pages/index.tsx）
  report/page.tsx   … レポート（旧 pages/report.tsx）
  not-found.tsx     … 404（旧 pages/404.tsx）
public/.htaccess    … ロリポップ（Apache）用。404 ページの指定など
```

- 共通レイアウトを `app/layout.tsx` に置いたため、画面遷移してもサイドバーが再描画されなくなりました
- `next/router` → `next/navigation`（`usePathname`）
- `TransactionProvider` は起動時に1回だけ Firestore から取得する形に整理（無効だった SSR コードを削除）

### バグ修正

- 「残高」見出しの誤表示を修正（回帰テスト追加）
- 取引テーブルのローディング表示を共通の `isLoading` に接続
- 複数件削除を `Promise.all` で並列実行し、state 更新を関数型で1回に
- CI の本番デプロイを `main` への push 時のみに限定

## 5. 動作確認

- `npm run lint` / `npm run typecheck` / `npm test`（23ファイル / 91テスト）すべて成功
- `npm run build` で `out/` に `/`, `/report/`, `/404.html` が出力されることを確認
- ビルド結果をローカルで配信し、Chromium で表示（PC幅・スマホ幅）、入力フォームの開閉とバリデーション表示を確認

※ この環境には Firebase の接続情報が無いため、**実データの読み書きは未確認** です。
デプロイ前にプレビュー環境で、取引の追加・編集・削除を一通り試してください。

## 6. 今後の推奨事項（今回は未対応）

1. **Firestore のアクセス制御（重要）**: 認証機能が無く、ブラウザから直接 `Transactions` を読み書きしています。
   Firestore のセキュリティルールが「誰でも読み書き可」になっていると、URL を知る第三者がデータを閲覧・改ざんできます。
   Firebase Authentication の導入と、ユーザーごとにデータを分けるルール設定をおすすめします。
2. **全件取得の見直し**: 起動時に全期間の取引を取得しています。データが増えたら、表示月で絞り込むクエリにすると軽くなります。
3. **ロリポップへの自動デプロイ**: 現在は `out/` を手動でアップロードする想定です。必要なら GitHub Actions から
   FTP/SFTP でアップロードするジョブを追加できます（接続情報を GitHub Secrets に登録する必要があります）。
4. **スマホ表示のカレンダー**: 幅が狭いとカレンダー内部にスクロールが出ます（刷新前と同じ挙動）。
   `height="auto"` にすると全体がページスクロールになります。
5. **FullCalendar 7 / TypeScript 7 / @hookform/resolvers 6**: 周辺ライブラリが対応し次第、更新を検討してください。
