// app/forfaits-mobiles/page.tsx
import React from 'react'
import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import { loadMobilePlansFromServer } from '@/lib/mobile-data'
import ClientWrapper from './ClientWrapper'

// Générer les métadonnées pour le SEO
export async function generateMetadata(): Promise<Metadata> {
  try {
    const plans = await loadMobilePlansFromServer()
    const planCount = plans.length
    
    // Extraire les stats pour le SEO
    const minPrice = plans.length > 0 
      ? Math.min(...plans.map(p => parseFloat(p.price) || 999)) 
      : 0;
    
    const operators = [...new Set(plans.map(p => p.operator))].slice(0, 5);
    const with5G = plans.filter(p => p.networkType === '5G').length;
    
    return {
      title: `${planCount} Forfaits Mobile dès ${minPrice.toFixed(2)}€/mois | ComparePrix`,
      description: `Découvrez ${planCount} forfaits mobiles sans engagement. ${operators.join(', ')} et plus. ${with5G} forfaits 5G. Comparez et économisez jusqu'à 50%.`,
      keywords: [
        'forfait mobile pas cher',
        'forfait sans engagement',
        'forfait 5G',
        'B&YOU',
        'Youprice',
        'NRJ Mobile',
        'Auchan Telecom',
        'Lycamobile',
        'comparateur forfait mobile',
        'forfait mobile 2024'
      ].join(', '),
      openGraph: {
        title: `${planCount} Forfaits Mobile - Comparez et économisez`,
        description: `Les meilleurs forfaits mobiles du moment. ${operators.join(', ')}. Sans engagement dès ${minPrice.toFixed(2)}€/mois.`,
        type: 'website',
        url: 'https://compareprix.net/forfaits-mobiles',
        images: [
          {
            url: '/og-mobile.jpg',
            width: 1200,
            height: 630,
            alt: 'Forfaits mobiles - ComparePrix'
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${planCount} Forfaits Mobile dès ${minPrice.toFixed(2)}€`,
        description: `Comparez les meilleurs forfaits mobiles sans engagement.`
      },
      alternates: {
        canonical: 'https://compareprix.net/forfaits-mobiles'
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
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    
    return {
      title: 'Forfaits Mobile - Meilleures offres | ComparePrix',
      description: 'Comparez les meilleurs forfaits mobiles sans engagement. B&YOU, Youprice, NRJ Mobile et plus.',
    }
  }
}

// Revalidation ISR - toutes les 24h
export const revalidate = 86400 

// Données structurées pour le SEO
function generateStructuredData(plans: any[]) {
  const operators = [...new Set(plans.map(p => p.operator))];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Forfaits mobiles disponibles',
    'description': 'Liste des meilleurs forfaits mobiles sans engagement',
    'numberOfItems': plans.length,
    'itemListElement': plans.slice(0, 10).map((plan, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Product',
        'name': plan.name,
        'description': plan.features.join(', '),
        'brand': {
          '@type': 'Brand',
          'name': plan.operator
        },
        'offers': {
          '@type': 'Offer',
          'price': plan.price,
          'priceCurrency': 'EUR',
          'availability': 'https://schema.org/InStock',
          'url': plan.affiliate_url || plan.trackingUrl
        }
      }
    }))
  };
}

// Page Server Component
export default async function ForfaitsMobiles() {
  // Charger les données côté serveur
  const plans = await loadMobilePlansFromServer()
  
  // Statistiques pour affichage (optionnel)
  const stats = {
    total: plans.length,
    operators: [...new Set(plans.map(p => p.operator))].length,
    with5G: plans.filter(p => p.networkType === '5G').length,
    avgPrice: plans.length > 0 
      ? (plans.reduce((sum, p) => sum + parseFloat(p.price), 0) / plans.length).toFixed(2)
      : 0,
    totalCommission: plans.reduce((sum, p) => sum + ((p as any).commission || 0), 0)
  };
  
  console.log('📊 Stats page forfaits:', stats);
  
  return (
    <>
      {/* SEO - Données structurées */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateStructuredData(plans)) 
        }}
      />
      
      {/* Header global */}
      <Header />
      
      {/* Passer les données au wrapper client - Banner est dans ClientWrapper maintenant */}
      <ClientWrapper initialPlans={plans} />
    </>
  )
}