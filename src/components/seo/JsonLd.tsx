import React from 'react';
import { SEO_CONFIG } from '@/lib/seo/config';

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Schema Organization
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": SEO_CONFIG.siteName,
  "url": SEO_CONFIG.domain,
  "logo": `${SEO_CONFIG.domain}${SEO_CONFIG.images.logo}`,
  "description": SEO_CONFIG.defaultDescription,
  "email": SEO_CONFIG.contact.email,
  "telephone": SEO_CONFIG.contact.phone,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": SEO_CONFIG.contact.address.street,
    "addressLocality": SEO_CONFIG.contact.address.city,
    "postalCode": SEO_CONFIG.contact.address.postalCode,
    "addressCountry": SEO_CONFIG.contact.address.countryCode,
  },
  "sameAs": Object.values(SEO_CONFIG.social).filter(url => url.startsWith('http')),
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": SEO_CONFIG.contact.phone,
    "contactType": "customer service",
    "areaServed": SEO_CONFIG.contact.address.countryCode,
    "availableLanguage": SEO_CONFIG.locale.supported,
  },
};

// Schema WebSite avec SearchAction
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": SEO_CONFIG.siteName,
  "url": SEO_CONFIG.domain,
  "description": SEO_CONFIG.defaultDescription,
  "publisher": {
    "@id": `${SEO_CONFIG.domain}#organization`
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${SEO_CONFIG.domain}/recherche?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": SEO_CONFIG.locale.default,
};

// Schema BreadcrumbList
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${SEO_CONFIG.domain}${item.url}`
    }))
  };
}

// Schema Product pour les offres
export function generateProductSchema(product: {
  name: string;
  description: string;
  price: number;
  currency?: string;
  brand: string;
  image?: string;
  url?: string;
  ratingValue?: number;
  reviewCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "image": product.image || SEO_CONFIG.images.ogImage,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": product.currency || SEO_CONFIG.locale.currency,
      "availability": "https://schema.org/InStock",
      "url": product.url || SEO_CONFIG.domain,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    ...(product.ratingValue && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.ratingValue,
        "reviewCount": product.reviewCount || 1
      }
    })
  };
}

// Schema FAQ
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}