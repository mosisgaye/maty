// components/box/BoxStructuredData.tsx
import React from 'react';
import { Box } from '@/types/box';

interface BoxStructuredDataProps {
  boxes: Box[];
}

const BoxStructuredData: React.FC<BoxStructuredDataProps> = ({ boxes }) => {
  // Génération des données structurées pour le SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Offres Box Internet Bouygues Telecom",
    "description": "Comparaison des meilleures offres box internet et fibre optique",
    "numberOfItems": boxes.length,
    "itemListElement": boxes.slice(0, 10).map((box, index) => ({
      "@type": "Product",
      "position": index + 1,
      "name": box.nom,
      "description": box.description,
      "brand": {
        "@type": "Brand",
        "name": "Bouygues Telecom"
      },
      "offers": {
        "@type": "Offer",
        "price": box.prix_mensuel,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString()
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
};

export default BoxStructuredData;