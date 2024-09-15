/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  distDir: 'docs',
  basePath: process.env.NODE_ENV === 'production' ? '/cardealer-app' : '',
  assetPrefix: '/cardealer-app',
};

export default nextConfig;
