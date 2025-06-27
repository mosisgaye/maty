import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 🚀 OPTIMISATIONS DE PERFORMANCE
  
  // Experimental features pour performance
  experimental: {
    // Optimise les bundles
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    
    // Pré-compilation des pages
    ppr: true,
    
    // Lazy loading amélioré
    scrollRestoration: true,
  },

  // 🚀 OPTIMISATIONS DES BUNDLES
  webpack: (config, { dev, isServer }) => {
    // Optimisations de production uniquement
    if (!dev) {
      // Split chunks optimisé
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Vendor chunks séparés
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // UI components
          ui: {
            test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 5,
          },
          // Composants partagés
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 1,
          },
        },
      };

      // Tree shaking agressif
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    return config;
  },

  // 🚀 COMPRESSION ET OPTIMISATIONS
  compress: true,
  
  // Headers pour performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Cache statique agressif
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          // Optimisations réseau
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // Préchargement des ressources
          {
            key: 'Link',
            value: '</fonts/inter.woff2>; rel=preload; as=font; type=font/woff2; crossorigin',
          },
        ],
      },
      // CSV avec cache court
      {
        source: '/lien.csv',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300', // 5 minutes
          },
        ],
      },
    ];
  },

  // 🚀 OPTIMISATIONS DES IMAGES
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 🚀 OPTIMISATIONS DES REDIRECTIONS
  async redirects() {
    return [
      // Redirections optimisées
      {
        source: '/forfait-mobile',
        destination: '/mobile',
        permanent: true,
      },
    ];
  },

  // 🚀 OPTIMISATIONS DU BUILD
  outputFileTracing: true,
  
  // Réduction des polyfills
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 🚀 TYPESCRIPT OPTIMISÉ
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // 🚀 ESLINT OPTIMISÉ
  eslint: {
    dirs: ['src'],
  },

  // 🚀 OPTIMISATIONS PWA
  async generateBuildId() {
    return process.env.GIT_COMMIT_SHA || 'development';
  },
};

export default nextConfig;