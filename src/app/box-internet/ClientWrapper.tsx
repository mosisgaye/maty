// app/box-internet/ClientWrapper.tsx
'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Box, SortOption, BoxFilters } from '@/types/box';
import { Button } from '@/components/ui/button';
import { Filter, Sparkles, TrendingUp, Wifi, Zap, Gift, ArrowRight, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useBoxesWithFilters, useBoxComparison } from '@/hooks/useBoxes';

// Lazy loading des composants lourds
const FilterPanel = dynamic(() => import('@/components/box/FilterPanel'), {
  loading: () => <div className="w-80 h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
});

const ResultsPanel = dynamic(() => import('@/components/box/ResultsPanel'), {
  loading: () => <div className="flex-1 h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
});

const MobileFilterDrawer = dynamic(() => import('@/components/box/MobileFilterDrawer'), {
  ssr: false
});

const ComparisonModal = dynamic(() => import('@/components/box/ComparisonModal'), {
  ssr: false
});

interface ClientWrapperProps {
  initialBoxes: Box[];
  currentPage: number;
  itemsPerPage: number;
}

// Bannière promotionnelle
const PromoBanner = ({ boxCount, minPrice }: { boxCount: number; minPrice: number }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  // Timer pour l'urgence
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full -mt-16 md:-mt-20 lg:-mt-24">
      {/* Bannière principale avec gradient animé */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Spacer pour le header */}
        <div className="h-16 md:h-20 lg:h-24" />
        
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Particules animées en arrière-plan */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse" 
               style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative container mx-auto px-4 py-8 md:py-12">
          <div className="text-center text-white space-y-6">
            {/* Badge promo */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              OFFRE LIMITÉE - {boxCount} box disponibles
              <Sparkles className="w-4 h-4" />
            </div>

            {/* Titre principal */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">
              Box Internet & Fibre
              <span className="block text-2xl md:text-3xl lg:text-4xl mt-2 text-yellow-300">
                Jusqu'à -70% de réduction
              </span>
            </h1>

            {/* Sous-titre */}
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Installation gratuite + 3 mois offerts sur toutes les box fibre
            </p>

            {/* Prix starting */}
            <div className="flex items-center justify-center gap-4 text-2xl md:text-3xl font-bold">
              <span className="text-white/70 line-through">29,99€</span>
              <span className="text-yellow-300 text-3xl md:text-4xl">
                {minPrice.toFixed(2).replace('.', ',')}€
                <span className="text-lg font-normal">/mois</span>
              </span>
            </div>

            {/* Timer urgence */}
            <div className="flex items-center justify-center gap-2 md:gap-4">
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]">
                  <div className="text-2xl font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="text-xs uppercase">Jours</div>
                </div>
              </div>
              <span className="text-2xl">:</span>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]">
                  <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs uppercase">Heures</div>
                </div>
              </div>
              <span className="text-2xl">:</span>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]">
                  <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs uppercase">Min</div>
                </div>
              </div>
              <span className="text-2xl hidden md:inline">:</span>
              <div className="text-center hidden md:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]">
                  <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs uppercase">Sec</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Voir toutes les offres
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg"
              >
                <Wifi className="mr-2 w-5 h-5" />
                Tester mon éligibilité
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bande d'avantages */}
      <div className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">Fibre jusqu'à 2 Gb/s</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Gift className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">Installation offerte</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">Sans engagement dispo</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium">Prix bloqué 12 mois</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ClientWrapper({ 
  initialBoxes, 
  currentPage, 
  itemsPerPage 
}: ClientWrapperProps) {
  // État des filtres
  const [filters, setFilters] = useState<BoxFilters>({
    technology: 'all',
    priceRange: [80],
    speedRange: [2000],
    engagement: 'all',
    tvIncluded: 'all',
    phoneIncluded: false,
    wifiStandard: [],
    installation: []
  });

  // État du tri
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  
  // État de l'interface
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Hook optimisé pour les box et le filtrage
  const { 
    sortedBoxes, 
    loading, 
    error,
    totalCount 
  } = useBoxesWithFilters({
    initialBoxes,
    filters,
    sortOption,
    autoLoad: false
  });

  // Hook pour la comparaison
  const {
    comparisonList,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison
  } = useBoxComparison(3);

  // Pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBoxes = sortedBoxes.slice(startIndex, endIndex);

  // Stats pour la bannière
  const minPrice = Math.min(...initialBoxes.map(b => b.prix_mensuel));

  // Gestion de la comparaison
  const toggleComparison = useCallback((boxId: string) => {
    if (isInComparison(boxId)) {
      removeFromComparison(boxId);
    } else {
      const added = addToComparison(boxId);
      if (!added && comparisonList.length >= 3) {
        toast({
          title: "Limite atteinte",
          description: "Vous pouvez comparer maximum 3 box.",
          variant: "destructive"
        });
      }
    }
  }, [addToComparison, removeFromComparison, isInComparison, comparisonList.length, toast]);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setFilters({
      technology: 'all',
      priceRange: [80],
      speedRange: [2000],
      engagement: 'all',
      tvIncluded: 'all',
      phoneIncluded: false,
      wifiStandard: [],
      installation: []
    });
    setSortOption('featured');
  }, []);

  // Nombre de filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.technology !== 'all') count++;
    if (filters.priceRange[0] < 80) count++;
    if (filters.speedRange[0] < 2000) count++;
    if (filters.engagement !== 'all') count++;
    if (filters.tvIncluded !== 'all') count++;
    if (filters.phoneIncluded) count++;
    if (filters.wifiStandard.length > 0) count++;
    return count;
  }, [filters]);

  // Ajuster l'affichage des filtres
  useEffect(() => {
    setFiltersOpen(!isMobile);
  }, [isMobile]);

  return (
    <>
      {/* Bannière intégrée */}
      <PromoBanner boxCount={initialBoxes.length} minPrice={minPrice} />
      
      {/* Contenu principal */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header avec stats */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {totalCount} offres disponibles
                </h2>
                <Badge variant="secondary" className="hidden sm:inline-flex">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {sortedBoxes.filter(b => b.featured).length} en promo
                </Badge>
              </div>
              
              <div className="flex gap-3">
                {/* Bouton filtres mobile */}
                {isMobile && (
                  <Button
                    variant="outline"
                    onClick={() => setShowMobileFilters(true)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filtres
                    {activeFiltersCount > 0 && (
                      <Badge variant="destructive" className="ml-1">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                )}

                {/* Bouton comparaison */}
                {comparisonList.length > 0 && (
                  <Button
                    onClick={() => setShowComparison(true)}
                    className="flex items-center gap-2"
                  >
                    Comparer ({comparisonList.length})
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Layout principal */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filtres desktop */}
            {!isMobile && filtersOpen && (
              <div className="lg:col-span-1">
                <FilterPanel
                  filters={filters}
                  setFilters={setFilters}
                  onReset={resetFilters}
                  activeFiltersCount={activeFiltersCount}
                  availableBoxes={initialBoxes}
                />
              </div>
            )}

            {/* Résultats */}
            <div className={`${filtersOpen && !isMobile ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
              <ResultsPanel
                boxes={currentBoxes}
                totalBoxes={totalCount}
                sortOption={sortOption}
                setSortOption={setSortOption}
                isLoading={loading}
                comparisonList={comparisonList}
                toggleComparison={toggleComparison}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onToggleFilters={() => setFiltersOpen(!filtersOpen)}
                filtersOpen={filtersOpen}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MobileFilterDrawer
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filters={filters}
        setFilters={setFilters}
        onReset={resetFilters}
        activeFiltersCount={activeFiltersCount}
        availableBoxes={initialBoxes}
      />

      <ComparisonModal
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        comparisonList={comparisonList}
        boxes={initialBoxes}
        onRemoveFromComparison={removeFromComparison}
      />
    </>
  );
}