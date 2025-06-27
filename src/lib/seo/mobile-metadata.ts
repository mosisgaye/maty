import { Metadata } from 'next';

/**
 * Génère les métadonnées pour la page des forfaits mobiles
 */
export function generateMobilePageMetadata(): Metadata {
  const baseTitle = "Comparateur de forfaits mobiles";
  const baseDescription = "Comparez tous les forfaits mobiles disponibles en France. Trouvez le meilleur forfait mobile selon vos besoins et votre budget.";
  const canonical = "https://compareprix.fr/mobile";

  return {
    title: {
      default: `${baseTitle} | ComparePrix`,
      template: '%s | ComparePrix'
    },
    description: baseDescription,
    keywords: [
      'forfait mobile',
      'comparateur forfait',
      'forfait pas cher',
      'forfait sans engagement',
      'forfait 5G',
      'forfait illimité',
      'Orange',
      'SFR',
      'Bouygues',
      'Free',
      'B&YOU',
      'Sosh',
      'RED',
      'comparaison forfait mobile'
    ],
    authors: [{ name: 'ComparePrix' }],
    creator: 'ComparePrix',
    publisher: 'ComparePrix',
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
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: canonical,
      title: `${baseTitle} - Prix et offres 2025`,
      description: baseDescription,
      siteName: 'ComparePrix',
      images: [
        {
          url: '/images/og/mobile-plans.jpg',
          width: 1200,
          height: 630,
          alt: 'Comparateur de forfaits mobiles - ComparePrix',
          type: 'image/jpeg',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@ComparePrix',
      creator: '@ComparePrix',
      title: `${baseTitle} - Trouvez le meilleur forfait`,
      description: baseDescription,
      images: ['/images/og/mobile-plans.jpg'],
    },
    alternates: {
      canonical: canonical,
      languages: {
        'fr-FR': canonical,
      },
    },
    verification: {
      google: 'votre-google-verification-code',
      // autres codes de vérification si nécessaire
    },
    other: {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
    },
  };
}

/**
 * Génère des métadonnées dynamiques basées sur les filtres actifs
 */
export function generateFilteredMobileMetadata(params: {
  operatorCount?: number;
  minPrice?: number;
  maxPrice?: number;
  dataType?: string;
  networkType?: '4G' | '5G' | 'all';
}): Metadata {
  const { operatorCount = 0, minPrice, maxPrice, dataType, networkType } = params;

  let title = "Forfaits mobiles";
  let description = "Comparez les forfaits mobiles";

  // Personnalisation basée sur les filtres
  if (networkType && networkType !== 'all') {
    title = `Forfaits mobiles ${networkType}`;
    description = `Découvrez tous les forfaits mobiles ${networkType} disponibles`;
  }

  if (minPrice && maxPrice) {
    title += ` de ${minPrice}€ à ${maxPrice}€`;
    description += ` entre ${minPrice}€ et ${maxPrice}€ par mois`;
  } else if (maxPrice) {
    title += ` jusqu'à ${maxPrice}€`;
    description += ` à moins de ${maxPrice}€ par mois`;
  }

  if (dataType) {
    title += ` avec ${dataType}`;
    description += ` incluant ${dataType}`;
  }

  if (operatorCount > 0) {
    description += `. ${operatorCount} opérateurs disponibles`;
  }

  return {
    title: `${title} | ComparePrix`,
    description: description + ". Comparaison gratuite et sans engagement.",
    openGraph: {
      title: `${title} - Comparaison 2025`,
      description,
    },
    twitter: {
      title: `${title} - ComparePrix`,
      description,
    },
  };
}

/**
 * Génère des métadonnées pour une offre spécifique
 */
export function generateOfferMetadata(offer: {
  name: string;
  operator: string;
  price: string;
  data: string;
}): Metadata {
  const title = `${offer.name} - ${offer.operator}`;
  const description = `Forfait ${offer.operator} à ${offer.price}€/mois avec ${offer.data}. Découvrez tous les détails et souscrivez en ligne.`;

  return {
    title: `${title} | ComparePrix`,
    description,
    openGraph: {
      title: `${title} - Offre mobile 2025`,
      description,
      type: 'website',
    },
    twitter: {
      title: `${title} - ComparePrix`,
      description,
    },
  };
}

/**
 * Génère le JSON-LD pour les forfaits mobiles
 */
export function generateMobileStructuredData(offers?: Array<{
  name: string;
  operator: string;
  price: string;
  data: string;
  features: string[];
}>) {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Comparateur de forfaits mobiles",
    "description": "Comparez tous les forfaits mobiles disponibles en France",
    "url": "https://compareprix.fr/mobile",
    "provider": {
      "@type": "Organization",
      "name": "ComparePrix",
      "url": "https://compareprix.fr"
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Forfaits mobiles disponibles",
      "description": "Liste complète des forfaits mobiles en France"
    }
  };

  // Si on a des offres, on peut enrichir les données structurées
  if (offers && offers.length > 0) {
    const itemListElement = offers.slice(0, 10).map((offer, index) => ({
      "@type": "Product",
      "position": index + 1,
      "name": `${offer.name} - ${offer.operator}`,
      "description": `Forfait mobile ${offer.operator} avec ${offer.data}`,
      "brand": {
        "@type": "Brand",
        "name": offer.operator
      },
      "offers": {
        "@type": "Offer",
        "price": parseFloat(offer.price),
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 jours
      },
      "additionalProperty": offer.features.map(feature => ({
        "@type": "PropertyValue",
        "name": "Caractéristique",
        "value": feature
      }))
    }));

    (baseStructuredData.mainEntity as any).itemListElement = itemListElement;
    (baseStructuredData.mainEntity as any).numberOfItems = offers.length;
  }

  return baseStructuredData;
}

/**
 * Génère les métadonnées pour le sitemap
 */
export function generateMobileSitemapData() {
  return {
    url: '/mobile',
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  };
}