// ================================================
// FICHIER: /src/hooks/useSEO.ts
// ================================================
// Hook personnalisé pour gérer le SEO dynamiquement

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Types pour le SEO
export interface SEOMetadata {
  title?: string;
  description?: string;
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

export function useSEO(metadata?: Partial<SEOMetadata>) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Mise à jour dynamique du titre
    if (metadata?.title) {
      document.title = `${metadata.title} | ComparePrix`;
    }
    
    // Mise à jour de la description
    if (metadata?.description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', metadata.description);
      }
    }
    
    // Mise à jour des keywords
    if (metadata?.keywords && metadata.keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', metadata.keywords.join(', '));
    }
    
    // Mise à jour du canonical
    if (metadata?.canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', metadata.canonical);
    }
    
    // Tracking de navigation (si Google Analytics est chargé)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX', {
        page_path: pathname,
      });
    }
  }, [pathname, metadata]);
  
  // Fonction pour tracker des événements personnalisés
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: parameters?.category || 'engagement',
        event_label: parameters?.label,
        value: parameters?.value,
        ...parameters,
      });
    }
  };
  
  // Fonction pour tracker les conversions
  const trackConversion = (conversionType: string, value?: number) => {
    trackEvent('conversion', {
      send_to: process.env.NEXT_PUBLIC_GA_ID,
      value: value,
      currency: 'EUR',
      conversion_type: conversionType,
    });
  };
  
  // Fonction pour tracker les clics sur les offres
  const trackOfferClick = (offerName: string, operator: string, price: string) => {
    trackEvent('offer_click', {
      category: 'offers',
      label: `${operator} - ${offerName}`,
      value: parseFloat(price),
      offer_name: offerName,
      operator: operator,
      price: price,
    });
  };
  
  return {
    trackEvent,
    trackConversion,
    trackOfferClick,
  };
}

