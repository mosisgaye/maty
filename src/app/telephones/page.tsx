// app/telephones/page.tsx
import React from 'react'
import { Metadata } from 'next'
import { loadPhonesFromServer } from '@/lib/phone-data'
import ClientWrapper from './ClientWrapper'
import PhoneStructuredData from '@/components/phones/PhoneStructuredData'

// Générer les métadonnées pour le SEO
export async function generateMetadata(): Promise<Metadata> {
  try {
    const phones = await loadPhonesFromServer()
    const phoneCount = phones.length
    const minPrice = phones.length > 0 ? Math.min(...phones.map(p => p.price)) : 0
    const brands = [...new Set(phones.map(p => p.trademark))].slice(0, 3)
    
    return {
      title: `${phoneCount} Téléphones avec forfait dès ${minPrice}€ | ComparePrix`,
      description: `Découvrez ${phoneCount} téléphones avec forfait inclus. ${brands.join(', ')} à partir de ${minPrice}€. Comparez et économisez jusqu'à 300€.`,
      keywords: [
        'téléphone avec forfait',
        'smartphone pas cher',
        'iPhone avec forfait',
        'Samsung avec forfait',
        'comparateur téléphone',
        'mobile avec abonnement'
      ].join(', '),
      openGraph: {
        title: `${phoneCount} Téléphones avec forfait - Meilleurs prix garantis`,
        description: `Économisez jusqu'à 300€ sur votre téléphone avec forfait. ${brands.join(', ')} disponibles.`,
        type: 'website',
        url: 'https://compareprix.fr/telephones',
        images: [
          {
            url: '/og-phones.jpg',
            width: 1200,
            height: 630,
            alt: 'Téléphones avec forfait - ComparePrix'
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${phoneCount} Téléphones avec forfait dès ${minPrice}€`,
        description: `Comparez les meilleures offres de téléphones avec forfait inclus.`
      },
      alternates: {
        canonical: 'https://compareprix.fr/telephones'
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
      title: 'Téléphones avec forfait - Meilleures offres | ComparePrix',
      description: 'Comparez les meilleures offres de téléphones avec forfait inclus. iPhone, Samsung, Xiaomi aux meilleurs prix.',
    }
  }
}

// Revalidation ISR - toutes les 24h
export const revalidate = 86400 

// Page Server Component
export default async function Telephones() {
  // Charger les données côté serveur
  const phones = await loadPhonesFromServer()
  
  return (
    <>
      {/* SEO - Données structurées */}
      <PhoneStructuredData phones={phones} />
      
      {/* Passer les données au wrapper client */}
      <ClientWrapper initialPhones={phones} />
    </>
  )
}