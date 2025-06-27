import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Comparateur Forfaits Mobile | ComparePrix',
    template: '%s | ComparePrix'
  },
  description: 'Comparez les meilleurs forfaits mobiles de tous les opérateurs français. Orange, SFR, Bouygues, Free et MVNO. Trouvez le forfait le moins cher adapté à vos besoins.',
  keywords: [
    'forfait mobile pas cher',
    'comparaison forfait mobile',
    'meilleur forfait mobile 2024',
    'forfait sans engagement',
    'forfait 5G',
    'Orange mobile',
    'SFR mobile',
    'Bouygues mobile',
    'Free mobile',
    'Sosh',
    'RED by SFR',
    'B&YOU',
    'Prixtel',
    'NRJ Mobile',
    'Auchan Télécom'
  ],
  authors: [{ name: 'ComparePrix' }],
  creator: 'ComparePrix',
  publisher: 'ComparePrix',
  metadataBase: new URL('https://compareprix.net'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://compareprix.net/mobile',
    siteName: 'ComparePrix',
    title: 'Comparateur Forfaits Mobile | Les meilleurs prix en 2024',
    description: 'Comparez les meilleurs forfaits mobiles de tous les opérateurs français. Trouvez le forfait le moins cher avec notre comparateur indépendant.',
    images: [
      {
        url: '/og-mobile.jpg',
        width: 1200,
        height: 630,
        alt: 'Comparateur forfaits mobile ComparePrix',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ComparePrix',
    creator: '@ComparePrix',
    title: 'Comparateur Forfaits Mobile | ComparePrix',
    description: 'Comparez les meilleurs forfaits mobiles de tous les opérateurs français.',
    images: ['/twitter-mobile.jpg'],
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
    canonical: 'https://compareprix.net/forfaits-mobiles',
  },
  verification: {
    google: 'votre-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
      
          {/* Header global pour toutes les pages */}
          <Header />
          
          {/* Contenu des pages */}
          <main className="min-h-screen">
            {children}
          </main>
          
          {/* Footer global pour toutes les pages */}
          <Footer />
       
      </body>
    </html>
  );
}