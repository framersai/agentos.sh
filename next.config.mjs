/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    typedRoutes: true,
  },
  // Enable static export for GitHub Pages
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
