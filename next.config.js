/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚀 Performance et SEO
  reactStrictMode: true,
  swcMinify: true,
  
  // 🔧 Experimental features pour de meilleures performances
  experimental: {
    scrollRestoration: true,
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB'],
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // 🖼️ Optimisation des images
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 an
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Configuration pour autoriser les images de l'API Strapi
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.compareprix.net',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },

  // 🔄 Redirections pour préserver le SEO
  async redirects() {
    return [
      // Préserver les anciennes URLs si nécessaire
      {
        source: '/mobile-plans',
        destination: '/mobile',
        permanent: true,
      },
      {
        source: '/internet-boxes',
        destination: '/internet',
        permanent: true,
      },
    ];
  },

  // 📋 Headers pour SEO et sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Sécurité
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // Performance
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      // Cache statique
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // 🎯 Optimisation du build
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 📦 Optimisation des bundles
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix',
            priority: 10,
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },

  // 🌍 i18n pour le SEO local (si nécessaire)
  i18n: {
    locales: ['fr'],
    defaultLocale: 'fr',
  },

  // 🔍 Génération de sitemap automatique
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ];
  },
};

module.exports = nextConfig;