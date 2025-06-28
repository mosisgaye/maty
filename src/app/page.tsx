// src/app/page.tsx - Page d'accueil SaaS
import type { Metadata } from 'next';
import SaaSHomePage from './SaaSHomePage';

export const metadata: Metadata = {
  title: 'AISupport Pro - Plateforme SaaS de Support Client IA',
  description: 'Révolutionnez votre support client avec notre IA avancée. Chat intelligent, automatisation, insights en temps réel. Essai gratuit 14 jours.',
  keywords: [
    'support client IA',
    'chatbot intelligent',
    'SaaS support',
    'automatisation client',
    'IA conversationnelle',
    'plateforme support',
    'chat GPT-4',
    'Claude AI',
    'service client automatisé'
  ],
  openGraph: {
    title: 'AISupport Pro - Support Client IA Révolutionnaire',
    description: 'Transformez votre support client avec l\'IA. Chat intelligent, automatisation avancée, insights en temps réel.',
    url: 'https://aisupport-pro.com',
    images: [
      {
        url: '/og-saas-homepage.jpg',
        width: 1200,
        height: 630,
        alt: 'AISupport Pro - Plateforme SaaS IA',
      },
    ],
  },
  alternates: {
    canonical: 'https://aisupport-pro.com',
  },
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AISupport Pro',
    description: 'Plateforme SaaS de support client basée sur l\'IA',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '29',
      priceCurrency: 'EUR',
      priceValidUntil: '2024-12-31'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1247'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SaaSHomePage />
    </>
  );
}