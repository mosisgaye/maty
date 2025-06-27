// src/app/page.tsx
import type { Metadata } from 'next';
import HomePage from './HomePage';

export const metadata: Metadata = {
  title: 'Accueil - Comparateur de forfaits mobiles et box internet',
  description: 'Comparez tous les forfaits mobiles et box internet en France. Économisez jusqu\'à 40% sur vos factures télécoms avec notre comparateur indépendant.',
  openGraph: {
    title: 'ComparePrix - Trouvez le meilleur forfait mobile et box internet',
    description: 'Comparez facilement tous les forfaits mobiles et box internet. Économisez jusqu\'à 40% sur vos factures télécoms.',
    url: 'https://compareprix.net',
    images: [
      {
        url: 'https://compareprix.net/og-homepage.jpg',
        width: 1200,
        height: 630,
        alt: 'ComparePrix - Comparateur de forfaits mobiles',
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
    url: 'https://compareprix.net',
    name: 'ComparePrix',
    description: 'Comparateur de forfaits mobiles et box internet en France',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://compareprix.net/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage />
    </>
  );
}