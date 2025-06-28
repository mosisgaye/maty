// components/home/BlogSection.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogArticle, formatDate, getImageUrl } from '@/types/blog';
import { blogService } from '@/lib/blog-service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Clock, User, Calendar, TrendingUp } from 'lucide-react';

// Composant serveur pour récupérer les articles
async function getLatestArticles() {
  try {
    const articles = await blogService.getLatestArticles(3);
    return articles;
  } catch (error) {
    console.error('Erreur lors du chargement des articles:', error);
    return [];
  }
}

// Map des couleurs par catégorie
const categoryColors: Record<string, string> = {
  'Box': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Mobile': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Téléphone': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Guide': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'Bons plans': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

// Card d'article
const ArticleCard = ({ article }: { article: BlogArticle }) => {
  return (
    <Link href={`/blog/${article.Slug}`} className="block group">
      <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
        {/* Image avec overlay gradient au hover */}
        <div className="relative aspect-video overflow-hidden">
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
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.Titre}
          </h3>

          {/* Extrait */}
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
            {article.Extrait}
          </p>

          {/* Métadonnées */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(article.Date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readingTime} min
              </span>
            </div>
            
            {/* Auteur */}
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>Rédaction</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

// Section principale
export default async function BlogSection() {
  const articles = await getLatestArticles();

  if (articles.length === 0) {
    return null; // Ne rien afficher s'il n'y a pas d'articles
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        {/* Header de section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-700 dark:text-orange-300 text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            ACTUALITÉS
            <TrendingUp className="w-4 h-4" />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Actualités & Conseils
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Guides d'achat, comparatifs et bons plans télécom
          </p>
        </div>

        {/* Badge NEW */}
        <div className="flex justify-center mb-8">
          <Badge variant="default" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-sm font-medium">
            🎉 NOUVEAU : Découvrez notre blog !
          </Badge>
        </div>

        {/* Grille des articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* CTA principal */}
        <div className="text-center">
          <Link href="/blog">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Voir tous les articles
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}