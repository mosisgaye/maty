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

// Schémas pré-configurés pour ComparePrix
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ComparePrix.net",
  "url": "https://compareprix.net",
  "logo": "https://compareprix.net/logo.png",
  "description": "Comparateur de forfaits mobile, box internet et téléphones en France",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "FR"
  },
  "sameAs": [
    "https://www.facebook.com/compareprix",
    "https://twitter.com/compareprix"
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ComparePrix.net",
  "url": "https://compareprix.net",
  "description": "Comparateur de forfaits mobile, box internet et téléphones",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://compareprix.net/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});