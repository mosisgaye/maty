// src/app/SaaSHomePage.tsx - Page d'accueil SaaS
'use client';

import React, { Suspense, lazy } from 'react';
import SaaSHero from '@/components/saas/SaaSHero';
import SaaSFeatures from '@/components/saas/SaaSFeatures';
import SaaSPricing from '@/components/saas/SaaSPricing';
import SaaSTestimonials from '@/components/saas/SaaSTestimonials';
import SaaSDemo from '@/components/saas/SaaSDemo';
import SaaSCTA from '@/components/saas/SaaSCTA';

// Lazy loading pour optimiser les performances
const SaaSStats = lazy(() => import('@/components/saas/SaaSStats'));
const SaaSIntegrations = lazy(() => import('@/components/saas/SaaSIntegrations'));
const SaaSFAQ = lazy(() => import('@/components/saas/SaaSFAQ'));

const SectionSkeleton = ({ height = "400px" }: { height?: string }) => (
  <div 
    style={{ height, backgroundColor: 'hsl(var(--muted))', opacity: 0.3 }}
    className="animate-pulse rounded-lg mx-4 my-8" 
  />
);

const SaaSHomePage = () => {
  return (
    <main className="flex-1">
      {/* Hero Section - Critique, pas de lazy loading */}
      <SaaSHero />
      
      {/* Demo Section - Haute priorité */}
      <SaaSDemo />
      
      {/* Features Section */}
      <SaaSFeatures />
      
      {/* Stats avec lazy loading */}
      <Suspense fallback={<SectionSkeleton height="300px" />}>
        <SaaSStats />
      </Suspense>
      
      {/* Pricing Section */}
      <SaaSPricing />
      
      {/* Testimonials */}
      <SaaSTestimonials />
      
      {/* Integrations avec lazy loading */}
      <Suspense fallback={<SectionSkeleton height="400px" />}>
        <SaaSIntegrations />
      </Suspense>
      
      {/* FAQ avec lazy loading */}
      <Suspense fallback={<SectionSkeleton height="500px" />}>
        <SaaSFAQ />
      </Suspense>
      
      {/* CTA Final */}
      <SaaSCTA />
    </main>
  );
};

export default SaaSHomePage;