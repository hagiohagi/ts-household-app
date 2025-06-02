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

[https://ts-household-app.vercel.app/](https://ts-household-app.vercel.app/)

## 主な機能

- 収支の記録と管理
- 月次レポートの表示
- カレンダーによる支出の可視化
- グラフによる支出分析
- データの永続化（Firebase）

## 使用技術

### フロントエンド

- **Next.js**: 15.3.2
  - サーバーサイドレンダリング
  - Pages Routerによるファイルベースのルーティング
- **React**: 19.1.0
- **TypeScript**: 5.8.3
- **Material-UI**: 7.0.1
  - モダンなUIコンポーネントの実装
  - レスポンシブデザイン
- **React Hook Form**: 7.56.0
  - フォームのバリデーション
- **Zod**: 3.24.3
  - スキーマバリデーション
- **Chart.js**: 4.4.9
  - 支出分析のグラフ表示
- **FullCalendar**: 6.1.17
  - カレンダーによる支出の可視化

### バックエンド

- **Firebase**: 11.6.0
  - データの永続化
  - リアルタイムデータベース

### 開発ツール

- **ESLint**: 9.26.0
- **Jest**: 29.7.0
- **React Testing Library**: 16.3.0
- **TypeScript**: 5.8.3

### CI/CD

- **GitHub Actions**
  - 自動テスト実行
  - 自動ビルド
  - Vercelへの自動デプロイ

## アプリケーションの特徴

1. **モダンなUI/UX**
   - Material-UIを使用した直感的なインターフェース
   - レスポンシブデザインによるマルチデバイス対応

2. **堅牢な型システム**
   - TypeScriptによる型安全性の確保
   - 開発時のエラー検出

3. **データ管理**
   - Firebaseによる安全なデータ保存
   - リアルタイムなデータ更新

4. **データ可視化**
   - グラフによる支出分析
   - カレンダーによる支出の時系列表示

5. **テスト**
   - JestとReact Testing Libraryによる包括的なテスト
   - コンポーネント、ページ、コンテキストのテスト実装

6. **CI/CD**
   - GitHub Actionsによる自動化
   - キャッシュの最適化
   - マルチノードバージョンでのテスト

## 学習成果

- TypeScriptの型システムの理解と実践
- React Hookの活用
- Jestを使用したテスト駆動開発
- GitHub Actionsを使用したCI/CDパイプラインの構築
- create-react-appからNext.jsへの移行経験

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
