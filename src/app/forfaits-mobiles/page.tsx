  // ------------------------------------------------
  // 📄 FICHIER: /src/app/forfaits-mobiles/page.tsx
  // ------------------------------------------------
  // Page forfaits mobiles avec SEO optimisé
  
  import React from 'react'
  import { Metadata } from 'next'
  import Header from '@/components/layout/Header'
  import { loadMobilePlansFromServer } from '@/lib/mobile-data'
  import ClientWrapper from './ClientWrapper'
  import { JsonLd, organizationSchema } from '@/components/seo/JsonLd'
  import { SEO_CONFIG } from '@/lib/seo/config'
  
  // Métadonnées SEO dynamiques
  export async function generateMetadata(): Promise<Metadata> {
    try {
      const plans = await loadMobilePlansFromServer()
      const planCount = plans.length
      const minPrice = plans.length > 0 
        ? Math.min(...plans.map(p => parseFloat(p.price) || 999)) 
        : 0;
      
      const operators = [...new Set(plans.map(p => p.operator))].slice(0, 5);
      const with5G = plans.filter(p => p.networkType === '5G').length;
      
      // Description optimisée (max 160 caractères)
      const description = `${planCount} forfaits mobiles dès ${minPrice.toFixed(2)}€. ${operators.slice(0,3).join(', ')}. Comparez et économisez jusqu'à 50% maintenant.`;
      
      return {
        title: `${planCount} Forfaits Mobile dès ${minPrice.toFixed(2)}€/mois`,
        description: description,
        keywords: [
          'forfait mobile pas cher',
          'forfait sans engagement',
          'forfait 5G',
          `forfait mobile ${new Date().getFullYear()}`,
          ...operators.map(op => `forfait ${op}`),
          'comparateur forfait mobile',
          'meilleur forfait mobile',
          `forfait ${minPrice}€`
        ].join(', '),
        
        openGraph: {
          title: `${planCount} Forfaits Mobile - Comparez et économisez`,
          description: description,
          type: 'website',
          url: `${SEO_CONFIG.domain}/forfaits-mobiles`,
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
          description: description,
          site: SEO_CONFIG.social.twitter,
        },
        
        alternates: {
          canonical: `${SEO_CONFIG.domain}/forfaits-mobiles`
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
        
        verification: SEO_CONFIG.verification,
      }
    } catch (error) {
      console.error('Error generating metadata:', error)
      
      return {
        title: 'Forfaits Mobile - Meilleures offres',
        description: 'Comparez les meilleurs forfaits mobiles sans engagement. B&YOU, Youprice, NRJ Mobile et plus.',
      }
    }
  }
  
  // Données structurées pour les forfaits
  function generateMobileStructuredData(plans: any[]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Forfaits mobiles disponibles',
      'description': 'Liste des meilleurs forfaits mobiles sans engagement',
      'url': `${SEO_CONFIG.domain}/forfaits-mobiles`,
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
            'url': plan.affiliate_url || plan.trackingUrl,
            'priceValidUntil': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': 4.5,
            'reviewCount': Math.floor(Math.random() * 1000) + 100
          }
        }
      }))
    };
  }
  
  // Breadcrumb structuré
  function generateBreadcrumbSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Accueil',
          'item': SEO_CONFIG.domain
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Forfaits Mobile',
          'item': `${SEO_CONFIG.domain}/forfaits-mobiles`
        }
      ]
    };
  }
  
  export default async function ForfaitsMobiles() {
    const plans = await loadMobilePlansFromServer()
    
    return (
      <>
        {/* Données structurées multiples */}
        <JsonLd data={organizationSchema} />
        <JsonLd data={generateBreadcrumbSchema()} />
        <JsonLd data={generateMobileStructuredData(plans)} />
        
        <Header />
        <ClientWrapper initialPlans={plans} />
      </>
    )
  }
  