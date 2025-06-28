// lib/blog-service.ts
import { BlogArticle, StrapiResponse, BlogFilters, calculateReadingTime, extractCategory } from '@/types/blog';

// Configuration API
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.compareprix.net';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '423d7bba2753d60fa27ff91c95492c3ee400fc7c278875f057192b541df17aedcccb8c3a4edc3800a8150aa765698af18fa61c546b34039fe7cf20b721f4ed328e4527e74c818cc03656aff1133ca7b661a2cc69c47ad84625438afa39468ce8bc903e4b347145db774fbaadada8d05ffb9d979fb74298840e2b7fd4377fe27e';

export class BlogService {
  private static instance: BlogService;

  static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  // Récupérer tous les articles avec filtres
  async getArticles(filters?: BlogFilters): Promise<StrapiResponse<BlogArticle>> {
    try {
      const params = new URLSearchParams();
      
      // Pagination
      params.append('pagination[page]', (filters?.page || 1).toString());
      params.append('pagination[pageSize]', (filters?.pageSize || 12).toString());
      
      // Inclure l'image
      params.append('populate', '*');
      
      // Tri par date décroissante
      params.append('sort', 'Date:desc');
      
      // Recherche
      if (filters?.search) {
        params.append('filters[$or][0][Titre][$containsi]', filters.search);
        params.append('filters[$or][1][Extrait][$containsi]', filters.search);
        params.append('filters[$or][2][Contenus][$containsi]', filters.search);
      }

      const response = await fetch(`${STRAPI_URL}/api/articles?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: 3600 } // Cache 1h
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data: StrapiResponse<BlogArticle> = await response.json();
      
      // Enrichir les articles avec les champs calculés
      data.data = data.data.map(article => ({
        ...article,
        readingTime: calculateReadingTime(article.Contenus),
        category: extractCategory(article)
      }));

      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      throw error;
    }
  }

  // Récupérer un article par slug
  async getArticleBySlug(slug: string): Promise<BlogArticle | null> {
    try {
      const params = new URLSearchParams();
      params.append('filters[Slug][$eq]', slug);
      params.append('populate', '*');

      const response = await fetch(`${STRAPI_URL}/api/articles?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: 3600 }
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data: StrapiResponse<BlogArticle> = await response.json();
      
      if (data.data.length === 0) {
        return null;
      }

      const article = data.data[0];
      
      // Enrichir avec les champs calculés
      return {
        ...article,
        readingTime: calculateReadingTime(article.Contenus),
        category: extractCategory(article)
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      return null;
    }
  }

  // Récupérer les derniers articles pour la homepage
  async getLatestArticles(limit: number = 3): Promise<BlogArticle[]> {
    try {
      const response = await this.getArticles({
        pageSize: limit,
        page: 1
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des derniers articles:', error);
      return [];
    }
  }

  // Récupérer les articles similaires
  async getRelatedArticles(currentArticle: BlogArticle, limit: number = 3): Promise<BlogArticle[]> {
    try {
      // Récupérer plus d'articles pour avoir de quoi filtrer
      const response = await this.getArticles({
        pageSize: limit + 5,
        page: 1
      });

      // Filtrer l'article actuel et prendre les plus pertinents
      const relatedArticles = response.data
        .filter(article => article.id !== currentArticle.id)
        .filter(article => article.category === currentArticle.category)
        .slice(0, limit);

      // Si pas assez d'articles de la même catégorie, compléter avec d'autres
      if (relatedArticles.length < limit) {
        const otherArticles = response.data
          .filter(article => article.id !== currentArticle.id)
          .filter(article => !relatedArticles.some(r => r.id === article.id))
          .slice(0, limit - relatedArticles.length);
        
        relatedArticles.push(...otherArticles);
      }

      return relatedArticles;
    } catch (error) {
      console.error('Erreur lors de la récupération des articles similaires:', error);
      return [];
    }
  }

  // Récupérer les articles par catégorie
  async getArticlesByCategory(category: string): Promise<BlogArticle[]> {
    try {
      // Pour l'instant on récupère tous les articles et on filtre côté client
      // Idéalement, on devrait avoir une vraie catégorie dans Strapi
      const response = await this.getArticles({
        pageSize: 100
      });

      return response.data.filter(article => article.category === category);
    } catch (error) {
      console.error('Erreur lors de la récupération des articles par catégorie:', error);
      return [];
    }
  }

  // Récupérer les articles populaires (simulé par les plus récents pour l'instant)
  async getPopularArticles(limit: number = 5): Promise<BlogArticle[]> {
    try {
      const response = await this.getArticles({
        pageSize: limit,
        page: 1
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des articles populaires:', error);
      return [];
    }
  }

  // Générer le sitemap des articles
  async getAllArticlesForSitemap(): Promise<{ slug: string; updatedAt: string }[]> {
    try {
      // Récupérer tous les articles (pagination importante si beaucoup d'articles)
      const articles: BlogArticle[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await this.getArticles({
          page,
          pageSize: 100
        });

        articles.push(...response.data);
        
        hasMore = page < response.meta.pagination.pageCount;
        page++;
      }

      return articles.map(article => ({
        slug: article.Slug,
        updatedAt: article.updatedAt
      }));
    } catch (error) {
      console.error('Erreur lors de la génération du sitemap:', error);
      return [];
    }
  }
}

// Export de l'instance singleton
export const blogService = BlogService.getInstance();