// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  // 多言語対応設定（i18n）
  i18n: {
    locales: ['ja', 'en'],
    defaultLocale: 'ja',
    localeDetection: false,
  },
  output: 'standalone',
};

module.exports = nextConfig;
