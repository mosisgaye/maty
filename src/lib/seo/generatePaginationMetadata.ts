// lib/seo/generatePaginationMetadata.ts
import { Metadata } from 'next';

interface PaginationMetadataProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  baseUrl: string;
  pageType: 'telephones' | 'forfaits' | 'internet';
}

export function generatePaginationMetadata({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  baseUrl,
  pageType
}: PaginationMetadataProps): Partial<Metadata> {
  
  const titles = {
    telephones: 'Téléphones avec forfait',
    forfaits: 'Forfaits mobiles',
    internet: 'Box internet'
  };
  
  const title = currentPage === 1 
    ? `${totalItems} ${titles[pageType]} disponibles | ComparePrix`
    : `${titles[pageType]} - Page ${currentPage} sur ${totalPages} | ComparePrix`;
    
  const description = currentPage === 1
    ? `Découvrez nos ${totalItems} ${titles[pageType].toLowerCase()}. Comparez et économisez jusqu'à 300€. Livraison gratuite.`
    : `Page ${currentPage} - ${titles[pageType]} de ${(currentPage - 1) * itemsPerPage + 1} à ${Math.min(currentPage * itemsPerPage, totalItems)}. Suite de notre sélection.`;

  // URLs canoniques et pagination
  const canonicalUrl = currentPage === 1 
    ? baseUrl 
    : `${baseUrl}?page=${currentPage}`;
    
  const prevUrl = currentPage > 1 
    ? currentPage === 2 ? baseUrl : `${baseUrl}?page=${currentPage - 1}`
    : undefined;
    
  const nextUrl = currentPage < totalPages 
    ? `${baseUrl}?page=${currentPage + 1}`
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website'
    },
    other: {
      // Tags de pagination pour Google
      ...(prevUrl && { 'link:rel:prev': prevUrl }),
      ...(nextUrl && { 'link:rel:next': nextUrl })
    },
    robots: {
      index: true,
      follow: true,
      // Éviter le contenu dupliqué sur les pages de pagination
      ...(currentPage > 1 && {
        googleBot: {
          index: true,
          follow: true,
          noimageindex: true
        }
      })
    }
  };
}

// Générer les données structurées pour la pagination
export function generatePaginationSchema({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  baseUrl,
  items
}: PaginationMetadataProps & { items: any[] }) {
  
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `Page ${currentPage}`,
    'position': currentPage,
    'url': currentPage === 1 ? baseUrl : `${baseUrl}?page=${currentPage}`,
    'isPartOf': {
      '@type': 'Collection',
      'name': 'Catalogue complet',
      'url': baseUrl,
      'numberOfItems': totalItems
    },
    'about': {
      '@type': 'ItemList',
      'numberOfItems': endIndex - startIndex + 1,
      'itemListOrder': 'Ascending',
      'itemListElement': items.slice(0, itemsPerPage).map((item, index) => ({
        '@type': 'ListItem',
        'position': startIndex + index,
        'item': {
          '@type': 'Product',
          'name': item.title || item.name,
          'url': item.url || `${baseUrl}/${item.id}`,
          'image': item.image,
          'offers': {
            '@type': 'Offer',
            'price': item.price,
            'priceCurrency': 'EUR'
          }
        }
      }))
    },
    ...(currentPage > 1 && {
      'previousItem': {
        '@type': 'CollectionPage',
        'url': currentPage === 2 ? baseUrl : `${baseUrl}?page=${currentPage - 1}`
      }
    }),
    ...(currentPage < totalPages && {
      'nextItem': {
        '@type': 'CollectionPage',
        'url': `${baseUrl}?page=${currentPage + 1}`
      }
    })
  };
}