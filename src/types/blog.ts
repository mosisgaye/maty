// types/blog.ts

// Type pour les formats d'image Strapi
export interface ImageFormat {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    path: string | null;
    size: number;
    width: number;
    height: number;
    sizeInBytes: number;
  }
  
  // Type pour l'image Strapi
  export interface StrapiImage {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      large?: ImageFormat;
      medium?: ImageFormat;
      small?: ImageFormat;
      thumbnail?: ImageFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }
  
  // Type pour un article de blog
  export interface BlogArticle {
    id: number;
    documentId: string;
    Titre: string;
    Slug: string;
    Extrait: string;
    Date: string;
    Contenus: string;
    Image: StrapiImage | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    // Champs calculés
    readingTime?: number;
    category?: BlogCategory;
  }
  
  // Type pour la réponse API Strapi
  export interface StrapiResponse<T> {
    data: T[];
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }
  
  // Type pour les catégories
  export type BlogCategory = 'Box' | 'Mobile' | 'Téléphone' | 'Guide' | 'Bons plans';
  
  // Type pour les filtres
  export interface BlogFilters {
    category?: BlogCategory;
    search?: string;
    page?: number;
    pageSize?: number;
  }
  
  // Fonction helper pour calculer le temps de lecture
  export function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }
  
  // Fonction helper pour extraire la catégorie depuis le titre ou contenu
  export function extractCategory(article: BlogArticle): BlogCategory {
    const title = article.Titre.toLowerCase();
    const content = article.Contenus.toLowerCase();
    
    if (title.includes('box') || content.includes('box fibre')) {
      return 'Box';
    } else if (title.includes('forfait') || title.includes('mobile')) {
      return 'Mobile';
    } else if (title.includes('iphone') || title.includes('samsung') || title.includes('téléphone')) {
      return 'Téléphone';
    } else if (title.includes('guide') || title.includes('comment')) {
      return 'Guide';
    } else if (title.includes('promo') || title.includes('bon plan')) {
      return 'Bons plans';
    }
    
    return 'Guide'; // Par défaut
  }
  
  // Fonction helper pour formater la date
  export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  }
  
  // Fonction helper pour obtenir l'URL de l'image
  export function getImageUrl(image: StrapiImage | null, format: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'): string {
    if (!image) return '/images/blog-placeholder.jpg';
    
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.compareprix.net';
    
    // Essayer d'obtenir le format demandé
    if (image.formats && image.formats[format]) {
      return `${baseUrl}${image.formats[format].url}`;
    }
    
    // Fallback sur l'image originale
    return `${baseUrl}${image.url}`;
  }
  
  // Type pour les métadonnées SEO
  export interface BlogSEO {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    canonicalUrl: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
  }