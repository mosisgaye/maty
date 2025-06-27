// ================================================
// 📄 FICHIER: /src/lib/seo/config.ts
// ================================================
// Configuration SEO avec variables d'environnement

export const SEO_CONFIG = {
    // Domaine principal
    domain: process.env.NEXT_PUBLIC_SITE_URL || 'https://compareprix.net',
    siteName: 'ComparePrix',
    
    // Métadonnées par défaut
    defaultTitle: 'ComparePrix - Comparateur de forfaits mobiles et box internet',
    titleTemplate: '%s | ComparePrix',
    defaultDescription: 'Comparez tous les forfaits mobiles et box internet. Économisez jusqu\'à 40% avec notre comparateur 100% indépendant et gratuit.',
    
    // URLs des pages principales
    routes: {
      home: '/',
      mobile: '/forfaits-mobiles',
      phones: '/telephones', 
      internet: '/box-internet',
      blog: '/blog',
      about: '/a-propos',
      contact: '/contact',
      legal: '/mentions-legales',
      privacy: '/politique-confidentialite',
      cookies: '/politique-cookies',
      cgv: '/cgv',
      sitemap: '/sitemap.xml',
    },
    
    // Configuration réseaux sociaux
    social: {
      twitter: '@ComparePrix',
      facebook: 'https://www.facebook.com/compareprix',
      facebookAppId: process.env.NEXT_PUBLIC_FB_APP_ID || '',
      instagram: 'https://www.instagram.com/compareprix',
      linkedin: 'https://www.linkedin.com/company/compareprix',
      youtube: 'https://www.youtube.com/c/compareprix',
    },
    
    // Codes de vérification
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
      bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
      pinterest: process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION || '',
    },
    
    // Configuration Analytics
    analytics: {
      googleId: process.env.NEXT_PUBLIC_GA_ID || '',
      gtmId: process.env.NEXT_PUBLIC_GTM_ID || '',
      facebookPixel: process.env.NEXT_PUBLIC_FB_PIXEL_ID || '',
      hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID || '',
      clarityId: process.env.NEXT_PUBLIC_CLARITY_ID || '',
    },
    
    // Informations de contact
    contact: {
      email: 'contact@compareprix.net',
      phone: '+33 1 23 45 67 89',
      address: {
        street: '123 Rue de la Comparaison',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        countryCode: 'FR',
      },
    },
    
    // Configuration des images par défaut
    images: {
      logo: '/logo.png',
      ogImage: '/og-image.jpg',
      twitterImage: '/twitter-image.jpg',
      favicon: '/favicon.ico',
      appleTouchIcon: '/apple-touch-icon.png',
    },
    
    // Paramètres de langue et région
    locale: {
      default: 'fr-FR',
      supported: ['fr-FR', 'fr'],
      currency: 'EUR',
      country: 'FR',
    },
    
    // Helper pour vérifier si analytics est configuré
    isAnalyticsEnabled: () => {
      return Boolean(
        SEO_CONFIG.analytics.googleId || 
        SEO_CONFIG.analytics.gtmId || 
        SEO_CONFIG.analytics.facebookPixel
      );
    },
  } as const;
  
  // Types TypeScript pour l'autocomplétion
  export type SEOConfig = typeof SEO_CONFIG;
  export type SEORoutes = keyof typeof SEO_CONFIG.routes;
  export type SEOSocial = keyof typeof SEO_CONFIG.social;
  export type SEOAnalytics = keyof typeof SEO_CONFIG.analytics;