# 家計簿アプリケーション

## プロジェクト概要

このアプリケーションは、個人の家計管理を効率的に行うためのWebアプリケーションです。Next.jsとTypeScriptを使用して開発され、Firebaseをバックエンドとして利用しています。

### 開発背景

短期間でTypeScript・React・Jest・GitHub Actionsといったモダンな開発手法を習得することを目的として開発しました。
Udemyの教材[「【React×TypeScript入門】家計簿アプリ作成でReactとTypeScriptの開発方法を学ぼう」](https://www.udemy.com/course/reacttypescrip-reacttypescript/)で学習用に作成されたアプリケーションを土台とし、
元々create-react-appで構築されていたものをNext.jsが使用できるよう、
パッケージ構成とディレクトリ構成を変更・拡張し、Pages Routerによるファイルベースのルーティングを導入しています。
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

- **Next.js**: 15.3.2
- **React**: 19.1.0
- **TypeScript**: 5.8.3
- **Material-UI**: 7.0.1
- **React Hook Form**: 7.56.0
- **Zod**: 3.24.3
- **Chart.js**: 4.4.9
- **FullCalendar**: 6.1.17

### バックエンド

- **Firebase**: 11.6.0

### 開発ツール

- **ESLint**: 9.26.0
- **Jest**: 29.7.0
- **React Testing Library**: 16.3.0

### CI/CD

- **GitHub Actions**

## 学習成果

- TypeScriptの型システムの理解と実践
- React Hookの活用
- Jestを使用したテスト駆動開発
- GitHub Actionsを使用したCI/CDパイプラインの構築
- create-react-appからNext.jsへの移行経験
  - SSRによる初期データ取得
- Firebase(FireStore)のデータ連携(CSR・SSR)

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
