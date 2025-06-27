// app/telephones/page.tsx
import React from 'react'
import { Metadata } from 'next'
import { loadPhonesFromServer } from '@/lib/phone-data'
import ClientWrapper from './ClientWrapper'
import PhoneStructuredData from '@/components/phones/PhoneStructuredData'
import { generatePaginationMetadata, generatePaginationSchema } from '@/lib/seo/generatePaginationMetadata'

const PHONES_PER_PAGE = 30;

// Générer les métadonnées pour le SEO avec pagination
export async function generateMetadata({ searchParams }: { searchParams: { page?: string } }): Promise<Metadata> {
  try {
    const phones = await loadPhonesFromServer()
    const currentPage = parseInt(searchParams.page || '1', 10)
    const totalPages = Math.ceil(phones.length / PHONES_PER_PAGE)
    const phoneCount = phones.length
    const minPrice = phones.length > 0 ? Math.min(...phones.map(p => p.price)) : 0
    const brands = [...new Set(phones.map(p => p.trademark))].slice(0, 3)
    
    // Metadata de base
    const baseMetadata = {
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
        url: 'https://compareprix.net/telephones',
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
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large' as const,
          'max-snippet': -1,
        },
      }
    }
    
    // Ajouter les métadonnées de pagination
    const paginationMetadata = generatePaginationMetadata({
      currentPage,
      totalPages,
      totalItems: phoneCount,
      itemsPerPage: PHONES_PER_PAGE,
      baseUrl: 'https://compareprix.net/telephones',
      pageType: 'telephones'
    })
    
    return {
      ...baseMetadata,
      ...paginationMetadata
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
export default async function Telephones({ searchParams }: { searchParams: { page?: string } }) {
  // Charger les données côté serveur
  const phones = await loadPhonesFromServer()
  const currentPage = parseInt(searchParams.page || '1', 10)
  const totalPages = Math.ceil(phones.length / PHONES_PER_PAGE)
  
  // Calculer les téléphones pour la page actuelle (pour le schema)
  const startIndex = (currentPage - 1) * PHONES_PER_PAGE
  const endIndex = startIndex + PHONES_PER_PAGE
  const currentPhones = phones.slice(startIndex, endIndex)
  
  // Générer le schema de pagination
  const paginationSchema = generatePaginationSchema({
    currentPage,
    totalPages,
    totalItems: phones.length,
    itemsPerPage: PHONES_PER_PAGE,
    baseUrl: 'https://compareprix.net/telephones',
    pageType: 'telephones',
    items: currentPhones
  })
  
  return (
    <>
      {/* SEO - Données structurées avec pagination */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(paginationSchema) 
        }}
      />
      
      {/* Données structurées des produits (première page seulement) */}
      {currentPage === 1 && <PhoneStructuredData phones={phones} />}
      
      {/* Passer TOUTES les données au wrapper client pour que les filtres fonctionnent */}
      <ClientWrapper 
        initialPhones={phones}
        currentPage={currentPage}
        itemsPerPage={PHONES_PER_PAGE}
      />
      
      {/* Navigation cachée pour le SEO */}
      <nav aria-label="Pagination" className="sr-only">
        <h2>Pages de navigation</h2>
        {currentPage > 1 && (
          <a href={currentPage === 2 ? '/telephones' : `/telephones?page=${currentPage - 1}`}>
            Page précédente
          </a>
        )}
        {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(page => (
          <a key={page} href={page === 1 ? '/telephones' : `/telephones?page=${page}`}>
            Page {page}
          </a>
        ))}
        {currentPage < totalPages && (
          <a href={`/telephones?page=${currentPage + 1}`}>
            Page suivante
          </a>
        )}
      </nav>
    </>
  )
}