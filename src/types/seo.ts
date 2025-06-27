export interface SEOMetadata {
    title: string;
    description: string;
    keywords?: string[];
    canonical?: string;
    openGraph?: {
      title?: string;
      description?: string;
      image?: string;
      type?: string;
    };
    twitter?: {
      title?: string;
      description?: string;
      image?: string;
      card?: 'summary' | 'summary_large_image';
    };
    structuredData?: Record<string, any>[];
  }
  
  export interface BreadcrumbItem {
    name: string;
    url: string;
  }
  
  export interface ProductSEO {
    name: string;
    description: string;
    price: number;
    brand: string;
    image?: string;
    ratingValue?: number;
    reviewCount?: number;
  }
  