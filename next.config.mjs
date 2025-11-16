import { execSync } from 'node:child_process';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

function resolveSqlAdapterVersion() {
  try {
    if (process.env.NEXT_PUBLIC_SQL_ADAPTER_VERSION) {
      return process.env.NEXT_PUBLIC_SQL_ADAPTER_VERSION;
    }
    const out = execSync('npm view @framers/sql-storage-adapter version', { stdio: 'pipe' })
      .toString()
      .trim();
    return out || '';
  } catch {
    return '';
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Disable typedRoutes to avoid strict Link route type errors
  // Enable static export for GitHub Pages
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SQL_ADAPTER_VERSION: resolveSqlAdapterVersion(),
  },
};

export default withNextIntl(nextConfig);
