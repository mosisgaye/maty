// app/[...slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import ClientWrapper from '@/app/forfaits-mobiles/ClientWrapper'
import { loadMobilePlansFromServer } from '@/lib/mobile-data'
import { JsonLd, generateBreadcrumbSchema } from '@/components/seo/JsonLd'
import { SEO_CONFIG } from '@/lib/seo/config'

// Types pour les pages SEO (Strapi v5)
interface SeoPage {
  id: number
  documentId: string
  slug: string
  title: string
  metaDescription: string
  h1: string
  keywords: string
  contentTop: any[] | null
  contentBottom: any[] | null
  faqTitle: string | null
  faq: Array<{ question: string; answer: string }> | string | null
  filters: any
  pageType: 'forfait-mobile' | 'box-internet' | 'telephone'
  featured: boolean
  bannerMessage?: string | null // Message personnalisé
  showBanner?: boolean // Option pour afficher/masquer la bannière
  bannerColor?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | null // Couleur de bannière
  published: string | null
  publishedAt: string
  createdAt: string
  updatedAt: string
}

// Récupérer une page depuis Strapi
async function getSeoPage(slug: string): Promise<SeoPage | null> {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.compareprix.net'
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN
  
  try {
    const params = new URLSearchParams({
      'filters[slug][$eq]': slug,
      'populate': '*'
    })
    
    const response = await fetch(
      `${STRAPI_URL}/api/seo-pages?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: 3600 } // Revalidate toutes les heures
      }
    )
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    
    if (!data.data || data.data.length === 0) {
      return null
    }
    
    return data.data[0]
  } catch (error) {
    console.error('Erreur lors de la récupération de la page SEO:', error)
    return null
  }
}

// Générer toutes les pages statiques au build
export async function generateStaticParams() {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.compareprix.net'
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN
  
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/seo-pages?fields[0]=slug&pagination[pageSize]=100`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      return []
    }
    
    const data = await response.json()
    
    return data.data.map((page: any) => ({
      slug: page.slug.split('/')
    }))
  } catch (error) {
    console.error('Erreur lors de la génération des params:', error)
    return []
  }
}

// Métadonnées dynamiques
export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const slug = params.slug.join('/')
  const page = await getSeoPage(slug)
  
  if (!page) {
    return {
      title: 'Page non trouvée',
      description: 'La page demandée n\'existe pas.'
    }
  }
  
  // Parser les mots-clés
  const keywords = page.keywords ? page.keywords.split(',').map(k => k.trim()) : []
  
  return {
    title: page.title,
    description: page.metaDescription,
    keywords: keywords.join(', '),
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      type: 'website',
      url: `${SEO_CONFIG.domain}/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.metaDescription,
    },
    alternates: {
      canonical: `${SEO_CONFIG.domain}/${slug}`
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
  }
}

// Parser le contenu de Strapi v5 (format blocks)
function parseRichText(content: any[] | null): string {
  if (!content || !Array.isArray(content)) return ''
  
  return content.map(block => {
    if (block.type === 'paragraph') {
      return `<p>${block.children.map((child: any) => child.text).join('')}</p>`
    } else if (block.type === 'heading') {
      const level = block.level || 2
      const text = block.children.map((child: any) => child.text).join('')
      return `<h${level}>${text}</h${level}>`
    } else if (block.type === 'list') {
      const items = block.children.map((item: any) => 
        `<li>${item.children.map((child: any) => child.text).join('')}</li>`
      ).join('')
      return block.format === 'ordered' ? `<ol>${items}</ol>` : `<ul>${items}</ul>`
    }
    // Ajouter d'autres types selon vos besoins
    return ''
  }).join('\n')
}

// Générer le schema FAQ
function generateFAQSchema(faq: any, pageUrl: string) {
  if (!faq) return null
  
  // Si c'est une string JSON, parser
  let faqItems = []
  if (typeof faq === 'string') {
    try {
      faqItems = JSON.parse(faq)
    } catch {
      return null
    }
  } else if (Array.isArray(faq)) {
    faqItems = faq
  } else {
    return null
  }
  
  if (faqItems.length === 0) return null
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item: any) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }
}

export default async function SeoPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/')
  const page = await getSeoPage(slug)
  
  // Debug
  console.log('Page SEO trouvée:', page)
  
  if (!page) {
    notFound()
  }
  
  // Charger les données selon le type de page
  let plans: any[] = []
  if (page.pageType === 'forfait-mobile') {
    plans = await loadMobilePlansFromServer()
    console.log(`Plans avant filtrage: ${plans.length}`)
    
    // Debug : voir tous les opérateurs disponibles
    const operateurs = [...new Set(plans.map(p => p.operator))]
    console.log('Opérateurs disponibles:', operateurs)
    
    // Appliquer les filtres depuis Strapi si définis
    if (page.filters) {
      const filters = typeof page.filters === 'string' ? JSON.parse(page.filters) : page.filters
      
      if (filters.operator) {
        // Pour l'instant, on affiche tous les plans pour tester
        console.log(`Filtre opérateur désactivé temporairement: ${filters.operator}`)
        // plans = plans.filter(plan => 
        //   plan.operator.toLowerCase() === filters.operator.toLowerCase() ||
        //   // Inclure aussi les sous-marques (ex: Sosh pour Orange)
        //   (filters.operator === 'Orange' && plan.operator === 'Sosh')
        // )
      }
      if (filters.data) {
        plans = plans.filter(plan => plan.data.includes(filters.data))
      }
      // Ajoutez d'autres filtres selon vos besoins
    }
    
    console.log(`Plans après filtrage: ${plans.length}`)
  }
  
  // Breadcrumb
  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: page.pageType === 'forfait-mobile' ? 'Forfaits Mobile' : 'Box Internet', url: page.pageType === 'forfait-mobile' ? '/forfaits-mobiles' : '/box-internet' },
    { name: page.h1, url: `/${slug}` }
  ]
  
  // FAQ Schema
  const faqSchema = generateFAQSchema(page.faq, `${SEO_CONFIG.domain}/${slug}`)
  
  // Générer le message de bannière dynamique
  const getBannerMessage = () => {
    // Si message personnalisé dans Strapi
    if (page.bannerMessage) {
      return page.bannerMessage
    }
    
    // Messages spécifiques par opérateur
    const operatorMessages: Record<string, string> = {
      'Orange': '🎯 Orange trop cher ? Découvrez B&YOU, Free et SFR jusqu\'à 70% moins cher',
      'SFR': '💸 Alternatives à SFR : Économisez jusqu\'à 50% avec RED, B&YOU ou Free',
      'Bouygues': '📱 Comparez Bouygues avec Orange, Free et les MVNO',
      'Free': '🆓 Free Mobile : Comparez avec tous les opérateurs'
    }
    
    // Vérifier d'abord les messages par opérateur
    if (page.filters?.operator && operatorMessages[page.filters.operator]) {
      return operatorMessages[page.filters.operator]
    }
    
    // Sinon, messages par défaut selon le contexte
    if (page.filters?.data === '100') {
      return '💰 Forfaits 100Go à partir de 7,99€/mois • Sans engagement'
    } else if (page.filters?.data === '200') {
      return '🚀 Forfaits 200Go 5G dès 11,99€ • Offres limitées'
    } else if (page.pageType === 'box-internet') {
      return '🏠 Box Internet dès 15,99€ • Installation gratuite • Sans frais cachés'
    } else if (page.featured) {
      return '⭐ Page recommandée • Économisez jusqu\'à 300€/an'
    } else {
      return '🎉 Comparez tous les forfaits et économisez jusqu\'à 50%'
    }
  }
  
  // Obtenir l'icône appropriée pour la bannière
  const getBannerIcon = () => {
    if (page.filters?.operator) return '🎯'
    if (page.filters?.data === '100' || page.filters?.data === '200') return '🚀'
    if (page.pageType === 'box-internet') return '🏠'
    if (page.featured) return '⭐'
    return '⚡'
  }
  
  // Obtenir la classe de couleur pour la bannière
  const getBannerColorClass = () => {
    // Couleur spécifique par opérateur
    if (page.filters?.operator === 'Orange') {
      return 'from-orange-500 via-orange-600 to-orange-700'
    } else if (page.filters?.operator === 'SFR') {
      return 'from-red-600 via-red-700 to-red-800'
    } else if (page.filters?.operator === 'Bouygues') {
      return 'from-blue-600 via-blue-700 to-blue-800'
    } else if (page.filters?.operator === 'Free') {
      return 'from-gray-700 via-gray-800 to-gray-900'
    }
    
    // Ou utiliser la couleur définie dans Strapi
    const colorMap = {
      blue: 'from-blue-600 via-blue-700 to-blue-800',
      green: 'from-green-600 via-green-700 to-green-800',
      orange: 'from-orange-500 via-orange-600 to-orange-700',
      red: 'from-red-600 via-red-700 to-red-800',
      purple: 'from-purple-600 via-purple-700 to-purple-800'
    }
    
    return colorMap[page.bannerColor || 'blue'] || 'from-blue-600 via-purple-600 to-pink-600'
  }
  
  return (
    <>
      {/* Données structurées */}
      <JsonLd data={generateBreadcrumbSchema(breadcrumbItems)} />
      {faqSchema && <JsonLd data={faqSchema} />}
      
      <Header />
      
      {/* Bannière dynamique pour les pages SEO */}
      {page.showBanner !== false && (
        <div className={`bg-gradient-to-r ${getBannerColorClass()} text-white py-3 shadow-lg`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-4">
              <span className="text-xl">{getBannerIcon()}</span>
              <p className="text-sm md:text-base font-medium">
                {getBannerMessage()}
              </p>
              {page.pageType === 'forfait-mobile' && (
                <a 
                  href="#comparateur" 
                  className="hidden md:inline-block bg-white/20 backdrop-blur text-white border border-white/30 px-4 py-1 rounded-full text-sm font-bold hover:bg-white hover:text-blue-600 transition-all"
                >
                  Voir les offres →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section avec contenu SEO */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
            {page.h1}
          </h1>
          
          {/* Contenu top depuis Strapi */}
          {page.contentTop && page.contentTop.length > 0 && (
            <div 
              className="prose prose-lg dark:prose-invert max-w-none text-center mt-6"
              dangerouslySetInnerHTML={{ __html: parseRichText(page.contentTop) }}
            />
          )}
          
          {/* Contenu temporaire si contentTop est vide */}
          {(!page.contentTop || page.contentTop.length === 0) && page.pageType === 'forfait-mobile' && (
            <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Découvrez tous les forfaits {page.filters?.operator || 'mobiles'} disponibles. 
              Comparez les prix, les datas et les options pour trouver l'offre idéale.
            </p>
          )}
        </div>
      </section>
      
      {/* Comparateur pour les pages forfait mobile */}
      {page.pageType === 'forfait-mobile' && (
        <>
          {plans.length > 0 ? (
            <>
              {/* Titre avant le comparateur si filtre opérateur */}
              {page.filters?.operator && (
                <section className="py-8 bg-white dark:bg-gray-800">
                  <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">
                      Alternatives à {page.filters.operator} - Meilleurs prix
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Comparez avec d'autres opérateurs pour économiser jusqu'à 50%
                    </p>
                  </div>
                </section>
              )}
              <div id="comparateur">
                <ClientWrapper initialPlans={plans} />
              </div>
            </>
          ) : (
            <section className="py-16">
              <div className="container mx-auto px-4 text-center">
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  Aucun forfait {page.filters?.operator} trouvé pour le moment.
                </p>
                <a 
                  href="/forfaits-mobiles" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Voir tous les forfaits
                </a>
              </div>
            </section>
          )}
        </>
      )}
      
      {/* Contenu SEO principal */}
      {page.contentBottom && page.contentBottom.length > 0 ? (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-4xl">
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: parseRichText(page.contentBottom) }}
            />
          </div>
        </section>
      ) : page.pageType === 'forfait-mobile' && page.filters?.operator === 'Orange' && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-4xl prose prose-lg dark:prose-invert">
            <h2>Pourquoi choisir Orange ?</h2>
            <p>
              Orange est l'opérateur historique français avec le réseau mobile le plus étendu. 
              Découvrez les avantages des forfaits Orange et les alternatives économiques comme Sosh.
            </p>
            
            <h3>Les forfaits Orange disponibles</h3>
            <ul>
              <li><strong>Forfaits Orange classiques</strong> : De 20€ à 80€/mois avec engagement</li>
              <li><strong>Sosh (by Orange)</strong> : Forfaits sans engagement dès 9,99€</li>
              <li><strong>Options 5G</strong> : Incluse dans la plupart des forfaits</li>
            </ul>
            
            <h3>Alternatives recommandées</h3>
            <p>
              Si les prix Orange vous semblent élevés, considérez ces alternatives avec un excellent rapport qualité/prix :
            </p>
            <ul>
              <li><strong>B&YOU</strong> : Forfaits 100Go dès 11,99€</li>
              <li><strong>Free Mobile</strong> : Forfait illimité à 19,99€</li>
              <li><strong>RED by SFR</strong> : Sans engagement, prix fixes</li>
            </ul>
          </div>
        </section>
      )}
      
      {/* Section FAQ */}
      {page.faq && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {page.faqTitle || 'Questions fréquentes'}
            </h2>
            
            <div className="space-y-6">
              {(() => {
                let faqItems = []
                if (typeof page.faq === 'string') {
                  try {
                    faqItems = JSON.parse(page.faq)
                  } catch {
                    return null
                  }
                } else if (Array.isArray(page.faq)) {
                  faqItems = page.faq
                } else {
                  return null
                }
                
                return faqItems.map((item: any, index: number) => (
                  <details key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <summary className="font-bold text-lg cursor-pointer">
                      {item.question}
                    </summary>
                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                      {item.answer}
                    </p>
                  </details>
                ))
              })()}
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Final */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Prêt à économiser sur votre {page.pageType === 'forfait-mobile' ? 'forfait mobile' : 'box internet'} ?
          </h3>
          <p className="text-lg mb-6">
            Utilisez notre comparateur pour trouver l'offre idéale en moins de 2 minutes
          </p>
          <a 
            href={page.pageType === 'forfait-mobile' ? '/forfaits-mobiles' : '/box-internet'}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Comparer maintenant
          </a>
        </div>
      </section>
    </>
  )
}