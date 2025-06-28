// src/app/page.tsx - Page d'accueil du comparateur télécom
import type { Metadata } from 'next';
import HomePage from './HomePage';
import BlogSection from '@/components/home/BlogSection';

export const metadata: Metadata = {
  title: 'ComparePrix - Comparateur de forfaits mobiles et box internet',
  description: 'Comparez tous les forfaits mobiles et box internet. Économisez jusqu\'à 40% avec notre comparateur 100% indépendant et gratuit.',
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
  openGraph: {
    title: 'ComparePrix - Comparateur de forfaits mobiles et box internet',
    description: 'Comparez tous les forfaits mobiles et box internet. Économisez jusqu\'à 40% avec notre comparateur.',
    url: 'https://compareprix.net',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ComparePrix - Comparateur de forfaits',
      },
    ],
  },
  alternates: {
    canonical: 'https://compareprix.net',
  },
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ComparePrix',
    description: 'Comparateur de forfaits mobiles et box internet',
    url: 'https://compareprix.net',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://compareprix.net/forfaits-mobiles?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage>
        <BlogSection />
      </HomePage>
    </>
  );
}