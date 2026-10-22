import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 全ページを静的HTMLとして out/ に出力する。
  // Node.jsが動かないレンタルサーバー（ロリポップ等）にもそのままアップロードできる。
  output: "export",
  // Apacheで /report/ → report/index.html と解決させるため
  trailingSlash: true,
};

export default nextConfig;
