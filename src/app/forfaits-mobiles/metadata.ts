import type { Metadata } from 'next';

// 🎯 SEO: Métadonnées optimisées pour la page mobile
export const metadata: Metadata = {
  title: 'Comparateur Forfaits Mobile | ComparePrix',
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
    'Auchan Télécom',
    'Youprice'
  ],

  // Open Graph optimisé
  openGraph: {
    title: 'Comparateur Forfaits Mobile | Les meilleurs prix en 2024',
    description: 'Comparez les meilleurs forfaits mobiles de tous les opérateurs français. Trouvez le forfait le moins cher avec notre comparateur indépendant.',
    url: 'https://compareprix.net/mobile',
    type: 'website',
    images: [
      {
        url: '/og-mobile.jpg',
        width: 1200,
        height: 630,
        alt: 'Comparateur forfaits mobile ComparePrix',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Comparateur Forfaits Mobile | ComparePrix',
    description: 'Comparez les meilleurs forfaits mobiles de tous les opérateurs français.',
    images: ['/twitter-mobile.jpg'],
  },

  // URL canonique
  alternates: {
    canonical: 'https://compareprix.net/mobile',
  },

  // Autres métadonnées SEO
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
};

// 📊 Données structurées pour la page mobile
export const mobileStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Comparateur Forfaits Mobile",
  "description": "Comparez les meilleurs forfaits mobiles de tous les opérateurs français",
  "url": "https://compareprix.net/mobile",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://compareprix.net"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Forfaits Mobile",
        "item": "https://compareprix.net/mobile"
      }
    ]
  },
  "mainEntity": {
    "@type": "Service",
    "name": "Comparateur de forfaits mobiles",
    "description": "Service de comparaison des forfaits mobiles français",
    "provider": {
      "@type": "Organization",
      "name": "ComparePrix"
    }
  }
};

export const mobileOffersStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Forfaits Mobile Comparés",
  "description": "Liste des forfaits mobiles disponibles en France",
  "url": "https://compareprix.net/mobile",
  "numberOfItems": "{{DYNAMIC_COUNT}}",
  "itemListElement": "{{DYNAMIC_OFFERS}}"
};