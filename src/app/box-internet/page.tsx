// app/box-internet/page.tsx
import { Metadata } from 'next'
import { loadRealBoxesFromCSV } from '@/lib/csv-box-loader'
import ClientWrapper from './ClientWrapper'
import BoxStructuredData from '@/components/box/BoxStructuredData'
import { generatePaginationMetadata, generatePaginationSchema } from '@/lib/seo/generatePaginationMetadata'

const BOXES_PER_PAGE = 30;

// Métadonnées SEO optimisées et naturelles
export async function generateMetadata({ searchParams }: { searchParams: { page?: string } }): Promise<Metadata> {
  try {
    const boxes = await loadRealBoxesFromCSV()
    const currentPage = parseInt(searchParams.page || '1', 10)
    const totalPages = Math.ceil(boxes.length / BOXES_PER_PAGE)
    
    // Données pour les métadonnées
    const minPrice = Math.min(...boxes.map(b => b.prix_mensuel))
    const technologies = [...new Set(boxes.map(b => b.technologie))]
    
    // Titre et description adaptés à la page
    const pageTitle = currentPage === 1 
      ? `Box Internet dès ${minPrice.toFixed(2).replace('.', ',')}€ - Bouygues Telecom`
      : `Box Internet Bouygues - Page ${currentPage} | ComparePrix`
    
    const pageDescription = currentPage === 1
      ? `${boxes.length} offres box internet Bouygues. ${technologies.join(', ')}. Installation gratuite, comparateur indépendant.`
      : `Découvrez plus d'offres box Bouygues Telecom. Page ${currentPage} sur ${totalPages}.`
    
    const baseMetadata: Metadata = {
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        type: 'website',
        url: `https://compareprix.net/box-internet${currentPage > 1 ? `?page=${currentPage}` : ''}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large' as const,
          'max-snippet': -1,
        },
      }
    }
    
    // Ajouter les métadonnées de pagination
    const paginationMetadata = generatePaginationMetadata({
      currentPage,
      totalPages,
      totalItems: boxes.length,
      itemsPerPage: BOXES_PER_PAGE,
      baseUrl: 'https://compareprix.net/box-internet',
      pageType: 'internet'
    })
    
    return {
      ...baseMetadata,
      ...paginationMetadata
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    
    return {
      title: 'Box Internet Bouygues Telecom | ComparePrix',
      description: 'Comparez les offres box internet Bouygues : Bbox Fit, Must, Ultym.',
    }
  }
}

export const revalidate = 86400 // 24h

export default async function BoxInternet({ searchParams }: { searchParams: { page?: string } }) {
  // Charger les données
  const boxes = await loadRealBoxesFromCSV()
  const currentPage = parseInt(searchParams.page || '1', 10)
  const totalPages = Math.ceil(boxes.length / BOXES_PER_PAGE)
  
  // Pagination pour le schema
  const startIndex = (currentPage - 1) * BOXES_PER_PAGE
  const endIndex = startIndex + BOXES_PER_PAGE
  const currentBoxes = boxes.slice(startIndex, endIndex)
  
  // Schema de pagination
  const paginationSchema = generatePaginationSchema({
    currentPage,
    totalPages,
    totalItems: boxes.length,
    itemsPerPage: BOXES_PER_PAGE,
    baseUrl: 'https://compareprix.net/box-internet',
    pageType: 'internet',
    items: currentBoxes
  })
  
  return (
    <>
      {/* Données structurées */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(paginationSchema) 
        }}
      />
      
      {/* Données structurées des produits (première page seulement) */}
      {currentPage === 1 && <BoxStructuredData boxes={boxes} />}
      
      {/* SOLUTION: Wrapper avec padding-top pour compenser le header fixed */}
      <div className="pt-16 md:pt-20 lg:pt-24">
        <ClientWrapper 
          initialBoxes={boxes}
          currentPage={currentPage}
          itemsPerPage={BOXES_PER_PAGE}
        />
      </div>
      
      {/* Contenu SEO naturel et concis */}
      {currentPage === 1 && (
        <section className="container px-4 py-12 prose prose-lg max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            Trouvez votre box internet idéale chez Bouygues Telecom
          </h2>
          <p className="text-gray-700 mb-4">
            Avec {boxes.length} offres disponibles allant de {Math.min(...boxes.map(b => b.prix_mensuel))}€ 
            à {Math.max(...boxes.map(b => b.prix_mensuel))}€ par mois, Bouygues Telecom propose 
            des solutions adaptées à tous les besoins et budgets.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">
            Technologies disponibles
          </h3>
          <p className="text-gray-700">
            Choisissez entre la fibre optique jusqu'à 2 Gb/s, la 5G Box nomade, 
            ou l'ADSL pour les zones non fibrées. Toutes nos offres incluent 
            l'installation gratuite et un Wi-Fi dernière génération.
          </p>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">
              💡 <strong>Astuce :</strong> Utilisez nos filtres pour affiner votre recherche 
              selon votre budget, le débit souhaité et les services inclus.
            </p>
          </div>
        </section>
      )}
    </>
  )
}