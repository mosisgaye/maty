'use client';
import React from 'react';
import BannerContent from './banner/BannerContent';
import BannerIllustration from './banner/BannerIllustration';
import { useTimeOneOffers } from '@/hooks/useTimeOneOffers';

const Banner = () => {
  const { stats, loading } = useTimeOneOffers({
    autoFetch: true,
  });

  return (
    <>
      <div className="w-full pt-16 md:pt-24 pb-8 md:pb-16">
        {/* Hero Section moderne sans gradient */}
        <section className="relative w-full py-16 md:py-32 bg-primary/5 dark:bg-primary/10 overflow-hidden">
          
          {/* Pattern de fond subtil */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          {/* Formes géométriques minimalistes */}
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 
              bg-primary/10 rounded-full" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 
              bg-purple-500/10 rounded-full" />
          </div>

          {/* Accent de couleur */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary" />

          {/* Contenu principal */}
          <div className="container relative z-10 px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <BannerContent />
              
              {/* Illustration cachée sur mobile avec CSS */}
              <div className="hidden md:block">
                <BannerIllustration />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Banner;