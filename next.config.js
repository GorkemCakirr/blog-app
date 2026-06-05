import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

// When proxied via the main site, assets load from /blog-assets/* on the main domain
// and the main app rewrites those requests back to this app.
const assetPrefix =
  process.env.NODE_ENV === "production"
    ? process.env.ASSET_PREFIX || "/blog-assets"
    : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
