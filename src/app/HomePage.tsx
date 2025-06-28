// src/app/HomePage.tsx
'use client';

import React, { Suspense, lazy } from 'react';
import Banner from '@/components/layout/Banner';

// Import direct pour les sections importantes SEO
import BoxSectionHomepage from '@/components/sections/BoxSectionHomepage';
import BlogSection from '@/components/home/BlogSection';

// Lazy loading avec webpackPrefetch pour les sections visibles rapidement
const MobileSection = lazy(() => 
  import(/* webpackPrefetch: true */ '@/components/home/MobileSection')
);

const InternetSection = lazy(() => 
  import(/* webpackPrefetch: true */ '@/components/home/InternetSection')
);

// Lazy loading standard pour les sections plus bas
const ComparisonSection = lazy(() => 
  import('@/components/home/ComparisonSection')
);

const PartnersSection = lazy(() => 
  import('@/components/home/PartnersSection')
);

const TestimonialsSection = lazy(() => 
  import('@/components/home/TestimonialsSection')
);

// Skeleton optimisé
const SectionSkeleton = ({ height = "384px" }: { height?: string }) => (
  <div 
    style={{ height }}
    className="bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg mx-4 my-8" 
  />
);

// Hook pour intersection observer réutilisable
const useIntersectionObserver = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '100px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

// Composant wrapper pour lazy loading avec intersection observer
const LazySection = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <div ref={ref}>
      {isVisible ? (
        <Suspense fallback={fallback || <SectionSkeleton />}>
          {children}
        </Suspense>
      ) : (
        fallback || <SectionSkeleton />
      )}
    </div>
  );
};

const HomePage = () => {
  return (
    <main className="flex-1">
      {/* Hero Section - Pas de lazy loading car critique */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Banner />
      </section>
        
      {/* Section Box Internet - Pas de lazy loading car importante pour le SEO */}
     
        <BoxSectionHomepage />
      

      {/* Sections avec lazy loading intelligent */}
      <LazySection>
        <MobileSection />
      </LazySection>

  

      {/* Section Blog - Pas de lazy loading car importante pour le SEO et l'engagement */}
      <BlogSection />
      
      <LazySection fallback={<SectionSkeleton height="256px" />}>
        <ComparisonSection />
      </LazySection>
   
      <LazySection>
        <PartnersSection />
      </LazySection>

      <LazySection>
        <TestimonialsSection />
      </LazySection>
      
      {/* Trust badges avec dark mode support */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                10 000+
              </p>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                Utilisateurs satisfaits
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                98%
              </p>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                Taux de satisfaction
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                24/7
              </p>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                Support disponible
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;