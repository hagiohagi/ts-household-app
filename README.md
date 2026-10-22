# 家計簿アプリケーション

## プロジェクト概要

このアプリケーションは、個人の家計管理を効率的に行うためのWebアプリケーションです。Next.jsとTypeScriptを使用して開発され、Firebaseをバックエンドとして利用しています。

### 開発背景

短期間でTypeScript・React・Jest・GitHub Actionsといったモダンな開発手法を習得することを目的として開発しました。
Udemyの教材[「【React×TypeScript入門】家計簿アプリ作成でReactとTypeScriptの開発方法を学ぼう」](https://www.udemy.com/course/reacttypescrip-reacttypescript/)で学習用に作成されたアプリケーションを土台とし、
元々create-react-appで構築されていたものをNext.jsが使用できるよう、
パッケージ構成とディレクトリ構成を変更・拡張し、App Routerによるファイルベースのルーティングを導入しています。
（2026年10月にPages RouterからApp Routerへ移行し、各ライブラリを最新版へ更新しました。詳細は [docs/MODERNIZATION.md](docs/MODERNIZATION.md) を参照）
Github ActionsによるCI/CD、Jestによるテスト、Vercel上へのデプロイを導入しています。

### URL

Vercel上にデプロイ
[https://ts-household-app.vercel.app/](https://ts-household-app.vercel.app/)

## 画面上の主な機能

- 日ごとの収入・支出の管理
- 月次レポートの表示
- カレンダーによる収入・支出・収支差の一覧化
- 円グラフによるカテゴリ別の収支の分析
- 棒グラフによる日別の収支の分析
- テーブル形式での月別収支一覧表示
- FireStoreによるデータの永続化

## 使用技術

### フロントエンド

- **Next.js**: 16.4（App Router / 静的エクスポート）
- **React**: 19.3
- **TypeScript**: 6.0
- **Material-UI**: 9.5
- **MUI X Date Pickers**: 9.16
- **React Hook Form**: 7.90
- **Zod**: 4.6
- **Chart.js**: 4.5
- **FullCalendar**: 6.1.22

### バックエンド

- **Firebase (Cloud Firestore)**: 13.1

### 開発ツール

- **Node.js**: 22 以上（CIは 22 / 24 で検証）
- **ESLint**: 10（Flat Config）
- **Jest**: 30
- **React Testing Library**: 16.3

### CI/CD

- **GitHub Actions**

## 学習成果

- TypeScriptの型システムの理解と実践
- React Hookの活用
- Jestを使用したテスト駆動開発
- GitHub Actionsを使用したCI/CDパイプラインの構築
- create-react-appからNext.jsへの移行経験
- Pages RouterからApp Routerへの移行
- Firebase(FireStore)のデータ連携

## 開発方法

```bash
cp .env.example .env.local   # Firebaseの設定値を記入
npm install
npm run dev                  # http://localhost:3000
npm test                     # テスト
npm run lint                 # ESLint
npm run typecheck            # 型チェック
```

## デプロイ

`npm run build` を実行すると、`out/` ディレクトリに静的サイト一式（HTML/CSS/JS）が出力されます。
サーバー側の処理は不要なため、以下のどちらでも公開できます。

- **Vercel**: `main` ブランチへのpushでGitHub Actionsから自動デプロイ
- **ロリポップ等のレンタルサーバー**: `out/` の中身（隠しファイル `.htaccess` を含む）を公開ディレクトリへFTP/SFTPでアップロード
  - GitHub Actionsの各実行結果からも `static-site` という名前で同じファイル一式をダウンロードできます
  - Firebaseの設定値はビルド時に埋め込まれるため、`.env.local` を用意してからビルドしてください

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
