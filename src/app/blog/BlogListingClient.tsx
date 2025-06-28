// app/blog/BlogListingClient.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { BlogArticle, BlogCategory, formatDate, getImageUrl } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Clock, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Mail,
  Tag
} from 'lucide-react';

interface BlogListingClientProps {
  initialArticles: BlogArticle[];
  totalPages: number;
  currentPage: number;
  categories: { value: BlogCategory | 'all'; label: string }[];
  popularArticles: BlogArticle[];
  selectedCategory?: string;
  searchQuery?: string;
}

const categoryColors: Record<string, string> = {
  'Box': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'Mobile': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'Téléphone': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'Guide': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'Bons plans': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
};

export default function BlogListingClient({
  initialArticles,
  totalPages,
  currentPage,
  categories,
  popularArticles,
  selectedCategory = 'all',
  searchQuery = ''
}: BlogListingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.delete('page');
    router.push(`/blog?${params.toString()}`);
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    params.delete('page');
    router.push(`/blog?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="pt-20"> {/* Fix pour le header */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-3">
            {/* Barre de recherche */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Rechercher un article..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-32 py-3 w-full text-base"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Rechercher
                </Button>
              </div>
            </form>

            {/* Filtres par catégorie - BOUTONS VISIBLES */}
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryChange(category.value)}
                  className={`
                    px-5 py-2.5 rounded-lg font-medium transition-all duration-200
                    ${selectedCategory === category.value
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                    }
                  `}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Grille d'articles */}
            {initialArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {initialArticles.map((article) => (
                  <Link key={article.id} href={`/blog/${article.Slug}`} className="block group">
                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                      {/* Image */}
                      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={getImageUrl(article.Image, 'medium')}
                          alt={article.Titre}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Badge catégorie */}
                        <div className="absolute top-3 left-3">
                          <Badge className={`${categoryColors[article.category || 'Guide']} text-xs font-medium`}>
                            {article.category}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-5">
                        {/* Titre */}
                        <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {article.Titre}
                        </h2>

                        {/* Extrait */}
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                          {article.Extrait}
                        </p>

                        {/* Métadonnées */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(article.Date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readingTime || 5} min
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Aucun article trouvé pour votre recherche.
                </p>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`min-w-[40px] ${
                            page === currentPage 
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                              : ''
                          }`}
                        >
                          {page}
                        </Button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Articles populaires */}
            <Card className="p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                Articles populaires
              </h3>
              <div className="space-y-4">
                {popularArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.Slug}`}
                    className="block group"
                  >
                    <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {article.Titre}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(article.Date)}
                    </p>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Newsletter */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Newsletter
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Recevez nos meilleurs bons plans et conseils chaque semaine !
              </p>
              <form className="space-y-3">
                <Input
                  type="email"
                  placeholder="Votre email"
                  className="w-full"
                  required
                />
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  S'abonner
                </Button>
              </form>
            </Card>

            {/* Tags */}
            <Card className="p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-500" />
                Tags populaires
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Fibre', '5G', 'iPhone', 'Samsung', 'Bbox', 'Free', 'Orange', 'SFR', 'Bouygues', 'Promo'].map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}