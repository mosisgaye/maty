// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Optimisation de la font avec preload et swap
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true // Réduit le CLS
});

export const metadata: Metadata = {
  metadataBase: new URL('https://compareprix.net'),
  title: {
    default: 'ComparePrix - Comparateur de forfaits mobiles et box internet',
    template: '%s | ComparePrix'
  },
  description: 'Comparez et économisez sur vos forfaits mobiles et box internet.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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
        
        {/* Script de thème optimisé - AVANT tout le reste */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement,c=d.classList;var t=localStorage.getItem('theme')||'system';if(t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches)){c.add('dark')}else{c.remove('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}