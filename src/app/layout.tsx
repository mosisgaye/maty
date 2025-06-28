// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Providers from '@/providers';
import { SEO_CONFIG } from '@/lib/seo/config';
import { JsonLd, organizationSchema, websiteSchema } from '@/components/seo/JsonLd';
import dynamic from 'next/dynamic';

// Lazy load des composants non critiques
const Header = dynamic(() => import('@/components/layout/Header'), {
  ssr: true // Header important pour le SEO
});

const Footer = dynamic(() => import('@/components/layout/Footer'), {
  ssr: false,
  loading: () => <div className="h-64" />
});

// Optimisation de la font avec subset minimal et poids spécifiques
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true,
  weight: ['400', '500', '600', '700'], // Seulement les poids utilisés
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
});

// Métadonnées SEO complètes
export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.domain),
  title: {
    default: SEO_CONFIG.defaultTitle,
    template: SEO_CONFIG.titleTemplate
  },
  description: SEO_CONFIG.defaultDescription,
  keywords: [
    'comparateur forfait mobile',
    'comparateur box internet',
    'forfait mobile pas cher',
    'box internet fibre',
    'comparateur télécom',
    'meilleur forfait mobile',
    'meilleure box internet',
    'compareprix'
  ],
  authors: [{ name: 'ComparePrix' }],
  creator: 'ComparePrix',
  publisher: 'ComparePrix',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SEO_CONFIG.domain,
    siteName: SEO_CONFIG.siteName,
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ComparePrix - Comparateur de forfaits',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: SEO_CONFIG.social.twitter,
    creator: SEO_CONFIG.social.twitter,
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SEO_CONFIG.domain,
    languages: {
      'fr-FR': SEO_CONFIG.domain,
    },
  },
  verification: {
    google: SEO_CONFIG.verification.google,
    yandex: SEO_CONFIG.verification.yandex,
  },
  category: 'technology',
};

// Configuration du viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // IDs Analytics avec fallback
  const GA_ID = SEO_CONFIG.analytics?.googleId;
  const GTM_ID = SEO_CONFIG.analytics?.gtmId;
  const FB_PIXEL_ID = SEO_CONFIG.analytics?.facebookPixel;
  
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* CSS critique inline pour éviter le blocage - OPTIMISÉ */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* CSS critique minimal */
            *{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
            .dark{background:#0f172a;color:#fff}
            /* Préchargement des classes critiques */
            .container{width:100%;max-width:1280px;margin:0 auto;padding:0 1rem}
            @media(min-width:768px){.container{padding:0 2rem}}
          `
        }} />
        
        {/* Préconnexions DNS optimisées - seulement les critiques */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon optimisé avec fallback base64 */}
        <link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Script de thème optimisé - AVANT tout le reste */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){try{var d=document.documentElement,t=localStorage.getItem('theme')||'system';'dark'===t||'system'===t&&matchMedia('(prefers-color-scheme:dark)').matches?d.classList.add('dark'):d.classList.remove('dark')}catch(e){}}();`,
          }}
        />
        
        {/* Données structurées globales */}
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        
        {/* Balises meta supplémentaires pour le SEO */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ComparePrix" />
        <meta name="application-name" content="ComparePrix" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        
        {/* Open Graph supplémentaires */}
        <meta property="og:locale:alternate" content="fr_FR" />
        {SEO_CONFIG.social.facebookAppId && (
          <meta property="fb:app_id" content={SEO_CONFIG.social.facebookAppId} />
        )}
        
        {/* Balises pour les articles */}
        <meta property="article:author" content="ComparePrix" />
        <meta property="article:publisher" content={SEO_CONFIG.social.facebook} />
      </head>
      
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Google Tag Manager (noscript) - seulement si GTM_ID existe */}
        {GTM_ID && (
          <noscript>
            <iframe 
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0" 
              width="0" 
              style={{ display: 'none', visibility: 'hidden' }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        
        {/* Google Analytics 4 - DIFFÉRÉ avec lazyOnload */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                  send_page_view: false
                });
                // Envoyer la page vue après le chargement complet
                window.addEventListener('load', () => {
                  gtag('event', 'page_view', {
                    page_path: window.location.pathname,
                    page_title: document.title
                  });
                });
              `}
            </Script>
          </>
        )}
        
        {/* Facebook Pixel - DIFFÉRÉ avec lazyOnload */}
        {FB_PIXEL_ID && (
          <Script id="facebook-pixel" strategy="lazyOnload">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              
              // Initialiser après le chargement
              window.addEventListener('load', () => {
                fbq('init', '${FB_PIXEL_ID}');
                fbq('track', 'PageView');
              });
            `}
          </Script>
        )}
        
        {/* Script de monitoring des Core Web Vitals - SIMPLIFIÉ */}
        {GA_ID && (
          <Script id="web-vitals" strategy="lazyOnload">
            {`
              // Web Vitals léger et optimisé
              if ('PerformanceObserver' in window && GA_ID) {
                try {
                  // Observer pour LCP
                  new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    gtag && gtag('event', 'LCP', {
                      event_category: 'Web Vitals',
                      value: Math.round(lastEntry.startTime),
                      non_interaction: true
                    });
                  }).observe({ type: 'largest-contentful-paint', buffered: true });
                  
                  // Observer pour FID
                  new PerformanceObserver((list) => {
                    const firstInput = list.getEntries()[0];
                    gtag && gtag('event', 'FID', {
                      event_category: 'Web Vitals',
                      value: Math.round(firstInput.processingStart - firstInput.startTime),
                      non_interaction: true
                    });
                  }).observe({ type: 'first-input', buffered: true });
                } catch (e) {
                  // Silently fail
                }
              }
            `}
          </Script>
        )}
      </body>
    </html>
  );
}