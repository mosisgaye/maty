// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Providers from '@/providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SEO_CONFIG } from '@/lib/seo/config';
import { JsonLd, organizationSchema, websiteSchema } from '@/components/seo/JsonLd';

// Optimisation de la font avec preload et swap
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true // Réduit le CLS
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
        {/* CSS critique inline pour éviter le blocage */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* CSS critique pour éviter le flash */
            body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
            .dark { background: #0f172a; color: #fff; }
            * { box-sizing: border-box; }
          `
        }} />
        
        {/* Préconnexions DNS pour accélérer les requêtes */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {GA_ID && (
          <>
            <link rel="dns-prefetch" href="https://www.google-analytics.com" />
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          </>
        )}
        
        {/* Favicon et icônes */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        

        
        {/* Script de thème optimisé - AVANT tout le reste */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement,c=d.classList;var t=localStorage.getItem('theme')||'system';if(t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches)){c.add('dark')}else{c.remove('dark')}}catch(e){}})();`,
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
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Open Graph supplémentaires */}
        <meta property="og:locale:alternate" content="fr_FR" />
        {SEO_CONFIG.social.facebookAppId && (
          <meta property="fb:app_id" content={SEO_CONFIG.social.facebookAppId} />
        )}
        
        {/* Balises pour les articles (si applicable) */}
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
        
        {/* Google Analytics 4 - seulement si GA_ID existe */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        
        {/* Facebook Pixel - seulement si FB_PIXEL_ID existe */}
        {FB_PIXEL_ID && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
        
        {/* Script de monitoring des Core Web Vitals */}
        {GA_ID && (
          <Script id="web-vitals" strategy="afterInteractive">
            {`
              // Fonction pour envoyer les Core Web Vitals à Google Analytics
              function sendToGoogleAnalytics({name, delta, value, id}) {
                if (typeof gtag !== 'undefined') {
                  gtag('event', name, {
                    event_category: 'Web Vitals',
                    event_label: id,
                    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
                    non_interaction: true,
                  });
                }
              }
              
              // Charger web-vitals seulement si nécessaire
              if ('PerformanceObserver' in window) {
                import('https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
                  onCLS(sendToGoogleAnalytics);
                  onFID(sendToGoogleAnalytics);
                  onFCP(sendToGoogleAnalytics);
                  onLCP(sendToGoogleAnalytics);
                  onTTFB(sendToGoogleAnalytics);
                });
              }
            `}
          </Script>
        )}
        
        {/* Script de détection AdBlock (optionnel) */}
        <Script id="adblock-detect" strategy="lazyOnload">
          {`
            (function() {
              var adBlockEnabled = false;
              var testAd = document.createElement('div');
              testAd.innerHTML = '&nbsp;';
              testAd.className = 'adsbox';
              testAd.style.position = 'absolute';
              testAd.style.left = '-999px';
              document.body.appendChild(testAd);
              window.setTimeout(function() {
                if (testAd.offsetHeight === 0) {
                  adBlockEnabled = true;
                }
                testAd.remove();
                if (window.gtag && adBlockEnabled) {
                  gtag('event', 'adblock_enabled', {
                    event_category: 'engagement',
                    non_interaction: true,
                  });
                }
              }, 100);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}