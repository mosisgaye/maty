// src/app/HomePage.tsx
'use client';

import React, { Suspense, lazy } from 'react';
import Banner from '@/components/layout/Banner';

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

// Skeleton optimisé (pas de classes inutiles)
const SectionSkeleton = ({ height = "384px" }: { height?: string }) => (
  <div 
    style={{ height, backgroundColor: 'hsl(var(--muted))', opacity: 0.5 }}
    className="animate-pulse rounded-lg m-4" 
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
      <section className="relative overflow-hidden bg-primary/5 dark:bg-primary/10">
        <Banner />
      </section>
        
      {/* Sections avec lazy loading intelligent */}
      <LazySection>
        <MobileSection />
      </LazySection>

      <LazySection>
        <InternetSection />
      </LazySection>
      
      <LazySection fallback={<SectionSkeleton height="256px" />}>
        <ComparisonSection />
      </LazySection>
   
      <LazySection>
        <PartnersSection />
      </LazySection>

      <LazySection>
        <TestimonialsSection />
      </LazySection>
      
      {/* Trust badges inline pour éviter un composant supplémentaire */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">10 000+</p>
              <p className="text-sm text-muted-foreground">Utilisateurs satisfaits</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">98%</p>
              <p className="text-sm text-muted-foreground">Taux de satisfaction</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground">Support disponible</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;