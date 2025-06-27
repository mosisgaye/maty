// app/forfaits-mobiles/ClientWrapper.tsx
'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { NetworkType, SortOption, DataSource, UnifiedMobilePlan, isTimeOnePlan } from '@/types/mobile';
import { Button } from '@/components/ui/button';
import { Filter, Sparkles, TrendingUp, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Banner from '@/components/layout/Banner';

// Lazy loading des composants (identique à votre page.tsx actuelle)
const FilterPanel = dynamic(() => import('@/components/mobile/FilterPanel'), {
  loading: () => <div className="w-80 h-96 bg-gray-100 dark:bg-gray-800 rounded-lg" />
});

const ResultsPanel = dynamic(() => import('@/components/mobile/ResultsPanel'), {
  loading: () => <div className="flex-1 h-96 bg-gray-100 dark:bg-gray-800 rounded-lg" />
});

const MobileFilterDrawer = dynamic(() => import('@/components/mobile/MobileFilterDrawer'), {
  ssr: false,
  loading: () => null
});

const ComparisonModal = dynamic(() => import('@/components/mobile/ComparisonModal'), {
  ssr: false,
  loading: () => null
});

interface ClientWrapperProps {
  initialPlans: UnifiedMobilePlan[];
}

export default function ClientWrapper({ initialPlans }: ClientWrapperProps) {
  // États locaux (identiques à votre page.tsx actuelle)
  const [dataRange, setDataRange] = useState<number[]>([300]);
  const [priceRange, setPriceRange] = useState<number[]>([50]);
  const [networkType, setNetworkType] = useState<NetworkType>('all');
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<DataSource[]>(['timeone']); // Seulement TimeOne maintenant
  const [sortOption, setSortOption] = useState<SortOption>('commission-desc'); // Par défaut, tri par commission
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [unlimitedCalls, setUnlimitedCalls] = useState(true);
  const [roamingIncluded, setRoamingIncluded] = useState(false);
  const [planType, setPlanType] = useState<'all' | 'prepaid' | 'with-commitment' | 'no-commitment'>('all');
  const [comparisonPlans, setComparisonPlans] = useState<UnifiedMobilePlan[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Extraire tous les opérateurs uniques
  const operators = useMemo(() => {
    return Array.from(new Set(initialPlans.map(plan => plan.operator).filter(Boolean))).sort();
  }, [initialPlans]);

  // Gestion des changements d'opérateur
  const handleOperatorChange = useCallback((operator: string) => {
    setSelectedOperators(prev => {
      if (prev.includes(operator)) {
        return prev.filter(op => op !== operator);
      }
      return [...prev, operator];
    });
  }, []);

  // Filtrage des plans
  const filteredPlans = useMemo(() => {
    let plans = [...initialPlans];
    
    // Filtre par volume de données
    if (dataRange[0] < 300) {
      plans = plans.filter(plan => {
        const planDataValue = parseInt(plan.data) || 0;
        return planDataValue <= dataRange[0];
      });
    }

    // Filtre par prix
    if (priceRange[0] < 50) {
      plans = plans.filter(plan => {
        const planPrice = parseFloat(plan.price) || 0;
        return planPrice <= priceRange[0];
      });
    }

    // Filtre par type de réseau
    if (networkType !== 'all') {
      plans = plans.filter(plan => {
        const planNetworkType = (plan as any).networkType || 
          (plan.features.some(f => f.toLowerCase().includes('5g')) ? '5G' : '4G');
        return planNetworkType === networkType;
      });
    }

    // Filtre par opérateur
    if (selectedOperators.length > 0) {
      plans = plans.filter(plan => selectedOperators.includes(plan.operator));
    }

    // Filtre par appels illimités
    if (unlimitedCalls) {
      plans = plans.filter(plan => 
        plan.features.some(f => 
          f.toLowerCase().includes('illimité') || 
          f.toLowerCase().includes('unlimited')
        )
      );
    }

    // Filtre par roaming
    if (roamingIncluded) {
      plans = plans.filter(plan => 
        plan.features.some(f => 
          f.toLowerCase().includes('roaming') || 
          f.toLowerCase().includes('europe') ||
          f.toLowerCase().includes('ue/dom')
        )
      );
    }

    // Filtre par type de forfait
    if (planType !== 'all') {
      plans = plans.filter(plan => {
        const hasCommitment = plan.features.some(f => 
          f.toLowerCase().includes('engagement') || 
          f.toLowerCase().includes('24 mois')
        );
        const isPrepaid = plan.features.some(f => 
          f.toLowerCase().includes('prépayé') || 
          f.toLowerCase().includes('prepaid')
        );
        
        switch (planType) {
          case 'prepaid':
            return isPrepaid;
          case 'with-commitment':
            return hasCommitment;
          case 'no-commitment':
            return !hasCommitment && !isPrepaid;
          default:
            return true;
        }
      });
    }

    return plans;
  }, [
    initialPlans, 
    dataRange, 
    priceRange, 
    networkType, 
    selectedOperators, 
    unlimitedCalls, 
    roamingIncluded, 
    planType
  ]);

  // Tri des plans
  const sortedPlans = useMemo(() => {
    return [...filteredPlans].sort((a, b) => {
      const priceA = parseFloat(a.price) || 0;
      const priceB = parseFloat(b.price) || 0;
      const dataA = parseInt(a.data) || 0;
      const dataB = parseInt(b.data) || 0;

      switch (sortOption) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'data-asc':
          return dataA - dataB;
        case 'data-desc':
          return dataB - dataA;
        case 'commission-desc':
          const aCommission = isTimeOnePlan(a) ? (a as any).commission || 0 : 0;
          const bCommission = isTimeOnePlan(b) ? (b as any).commission || 0 : 0;
          return bCommission - aCommission;
        default:
          return 0;
      }
    });
  }, [filteredPlans, sortOption]);

  // Calcul des filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (dataRange[0] < 300) count++;
    if (priceRange[0] < 50) count++;
    if (networkType !== 'all') count++;
    if (selectedOperators.length > 0) count++;
    if (planType !== 'all') count++;
    if (!unlimitedCalls) count++;
    if (roamingIncluded) count++;
    return count;
  }, [dataRange, priceRange, networkType, selectedOperators, planType, unlimitedCalls, roamingIncluded]);

  // Gestion de la comparaison
  const handleCompare = useCallback((plans: UnifiedMobilePlan[]) => {
    setComparisonPlans(plans);
    setShowComparison(true);
  }, []);

  // Application des filtres depuis le drawer mobile
  const handleApplyFilters = useCallback(() => {
    setShowMobileFilters(false);
  }, []);

  // Réinitialisation des filtres
  const handleResetFilters = useCallback(() => {
    setDataRange([300]);
    setPriceRange([50]);
    setNetworkType('all');
    setSelectedOperators([]);
    setPlanType('all');
    setUnlimitedCalls(true);
    setRoamingIncluded(false);
  }, []);

  // Statistiques
  const stats = useMemo(() => {
    const avgPrice = sortedPlans.length > 0 
      ? sortedPlans.reduce((sum, plan) => sum + parseFloat(plan.price), 0) / sortedPlans.length
      : 0;
    
    const totalCommission = sortedPlans
      .filter(isTimeOnePlan)
      .reduce((sum, plan) => sum + ((plan as any).commission || 0), 0);

    return {
      total: sortedPlans.length,
      avgPrice: Math.round(avgPrice * 100) / 100,
      totalCommission: Math.round(totalCommission * 100) / 100,
      operators: operators.length
    };
  }, [sortedPlans, operators]);

  return (
    <>
      {/* Banner - maintenant dans le Client Component */}
      <Banner />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header avec actions */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Forfaits Mobile
              </h1>
              
              {/* Badges de stats */}
              <div className="hidden md:flex items-center gap-2">
                <Badge variant="secondary">
                  {stats.total} forfaits
                </Badge>
                <Badge variant="outline" className="border-orange-200 text-orange-700">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Offres partenaires
                </Badge>
                {stats.totalCommission > 0 && (
                  <Badge variant="outline" className="border-green-200 text-green-700">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stats.totalCommission}€ potentiel
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="hidden sm:flex"
                >
                  Réinitialiser ({activeFiltersCount})
                </Button>
              )}
              
              {/* Mobile filter button */}
              {isMobile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileFilters(true)}
                  className="relative"
                >
                  <Filter className="w-4 h-4" />
                  {activeFiltersCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Panel de filtres - Desktop uniquement */}
          {!isMobile && (
            <div className="w-80 flex-shrink-0">
              <FilterPanel
                dataRange={dataRange}
                setDataRange={setDataRange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                networkType={networkType}
                setNetworkType={setNetworkType}
                selectedOperators={selectedOperators}
                operators={operators}
                handleOperatorChange={handleOperatorChange}
                filtersOpen={filtersOpen}
                setFiltersOpen={setFiltersOpen}
                selectedSources={selectedSources}
                setSelectedSources={setSelectedSources}
                showSourceFilter={false} // Plus besoin, on a que TimeOne
                unlimitedCalls={unlimitedCalls}
                setUnlimitedCalls={setUnlimitedCalls}
                roamingIncluded={roamingIncluded}
                setRoamingIncluded={setRoamingIncluded}
                planType={planType}
                setPlanType={setPlanType}
              />
            </div>
          )}

          {/* Panel de résultats */}
          <div className="flex-1 min-w-0">
            <ResultsPanel
              filteredPlans={sortedPlans}
              sortOption={sortOption}
              setSortOption={setSortOption}
              isLoading={false} // Plus de loading, données pré-chargées
              isFiltering={false}
              showSourceBreakdown={false} // Plus besoin, que TimeOne
              showSourceSections={true}
              onCompare={handleCompare}
            />
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        dataRange={dataRange}
        setDataRange={setDataRange}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        networkType={networkType}
        setNetworkType={setNetworkType}
        selectedOperators={selectedOperators}
        operators={operators}
        handleOperatorChange={handleOperatorChange}
        selectedSources={selectedSources}
        setSelectedSources={setSelectedSources}
        unlimitedCalls={unlimitedCalls}
        setUnlimitedCalls={setUnlimitedCalls}
        roamingIncluded={roamingIncluded}
        setRoamingIncluded={setRoamingIncluded}
        planType={planType}
        setPlanType={setPlanType}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Modal de comparaison */}
      <ComparisonModal
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        plans={comparisonPlans}
      />
      </div>
    </>
  );
}