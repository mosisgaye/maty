// app/blog/page.tsx
import { Metadata } from 'next';
import { BlogArticle, BlogCategory } from '@/types/blog';
import { blogService } from '@/lib/blog-service';
import BlogListingClient from './BlogListingClient';

// Métadonnées SEO
export const metadata: Metadata = {
  title: 'Blog ComparePrix : Actualités Télécom & Guides d\'Achat',
  description: 'Découvrez nos guides comparatifs, tests produits et bons plans pour économiser sur vos forfaits mobiles, box internet et téléphones en 2025.',
  keywords: [
    'blog télécom',
    'guide achat forfait mobile',
    'comparatif box internet',
    'test smartphone',
    'actualités télécom',
    'bons plans mobile',
    'conseils forfait',
    'avis box internet'
  ],
  openGraph: {
    title: 'Blog ComparePrix - Actualités et Guides Télécom',
    description: 'Guides d\'achat, comparatifs et bons plans pour vos forfaits mobiles, box internet et téléphones.',
    type: 'website',
    url: 'https://compareprix.net/blog',
    images: [
      {
        url: '/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'Blog ComparePrix'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog ComparePrix - Actualités Télécom',
    description: 'Tous nos guides et conseils pour économiser sur vos forfaits et box internet.'
  }
};

// Catégories disponibles
const categories: { value: BlogCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'Box', label: 'Box Internet' },
  { value: 'Mobile', label: 'Forfaits' },
  { value: 'Téléphone', label: 'Téléphones' },
  { value: 'Guide', label: 'Guides' },
  { value: 'Bons plans', label: 'Bons plans' }
];

export default async function BlogPage({ 
  searchParams 
}: { 
  searchParams: { page?: string; category?: string; search?: string } 
}) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const pageSize = 12;

  // Récupérer les articles
  const articlesResponse = await blogService.getArticles({
    page: currentPage,
    pageSize,
    search: searchParams.search
  });

  // Récupérer les articles populaires pour la sidebar
  const popularArticles = await blogService.getPopularArticles(5);

  // Filtrer par catégorie côté client si nécessaire
  let filteredArticles = articlesResponse.data;
  if (searchParams.category && searchParams.category !== 'all') {
    filteredArticles = articlesResponse.data.filter(
      article => article.category === searchParams.category
    );
  }

  // Données structurées pour le SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog ComparePrix',
    description: metadata.description,
    url: 'https://compareprix.net/blog',
    publisher: {
      '@type': 'Organization',
      name: 'ComparePrix',
      logo: {
        '@type': 'ImageObject',
        url: 'https://compareprix.net/logo.png'
      }
    },
    blogPost: filteredArticles.map(article => ({
      '@type': 'BlogPosting',
      headline: article.Titre,
      description: article.Extrait,
      datePublished: article.Date,
      dateModified: article.updatedAt,
      author: {
        '@type': 'Organization',
        name: 'ComparePrix'
      },
      url: `https://compareprix.net/blog/${article.Slug}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="text-sm mb-4">
              <ol className="flex items-center space-x-2">
                <li><a href="/" className="hover:underline opacity-80">Accueil</a></li>
                <li className="opacity-60">/</li>
                <li className="font-medium">Blog</li>
              </ol>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Blog ComparePrix : Actualités Télécom & Guides d'Achat
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl">
              Découvrez nos guides comparatifs, tests produits et bons plans pour économiser sur vos forfaits mobiles, box internet et téléphones.
            </p>
          </div>
        </div>

        {/* Contenu principal - Client Component */}
        <BlogListingClient
          initialArticles={filteredArticles}
          totalPages={articlesResponse.meta.pagination.pageCount}
          currentPage={currentPage}
          categories={categories}
          popularArticles={popularArticles}
          selectedCategory={searchParams.category}
          searchQuery={searchParams.search}
        />
      </div>
    </>
  );
}