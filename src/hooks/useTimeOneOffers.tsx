'use client'
import { useState, useEffect, useCallback, useRef } from 'react';
import timeoneApi from '@/services/affiliate/timeoneApi';
import xmlParser from '@/services/affiliate/xmlParser';
import { TimeOneMobilePlan } from '@/types/mobile';

/**
 * Interface pour les options du hook
 */
export interface UseTimeOneOffersOptions {
  autoFetch?: boolean;      
  refreshInterval?: number; 
  retryCount?: number;      
  onError?: (error: string) => void; 
  onSuccess?: (offers: TimeOneMobilePlan[]) => void; 
}

/**
 * Interface pour les statistiques multi-opérateurs
 */
export interface TimeOneOffersStats {
  total: number;
  byOperator: Record<string, number>; // Bouygues, SFR, Auchan, etc.
  byNetwork: Record<'4G' | '5G', number>;
  byCommission: Record<number, number>;
  specialOffers: number;
  recommended: number;
  averageCommission: number;
  totalPotentialCommission: number;
  lastUpdate: Date | null;
}

/**
 * Interface de retour du hook
 */
export interface UseTimeOneOffersReturn {
  // États principaux
  offers: TimeOneMobilePlan[];
  loading: boolean;
  error: string | null;
  
  // Métadonnées
  stats: TimeOneOffersStats;
  lastFetch: Date | null;
  fromCache: boolean;
  
  // Actions
  refetch: () => Promise<void>;
  clearError: () => void;
  forceRefresh: () => Promise<void>;
  
  // Utilitaires multi-opérateurs
  getOfferByPromoid: (promoid: string) => TimeOneMobilePlan | undefined;
  getOffersByOperator: (operator: string) => TimeOneMobilePlan[];
  getOffersByCommission: (minCommission: number) => TimeOneMobilePlan[];
  getRecommendedOffers: () => TimeOneMobilePlan[];
  getBouyguesOffers: () => TimeOneMobilePlan[]; // Compatibilité
  
  // Nouvelles méthodes pour les offres mises en avant
  getFeaturedOffer: () => TimeOneMobilePlan | undefined;
  getLocalOffer: () => TimeOneMobilePlan | undefined;
  getWidgetOffers: () => TimeOneMobilePlan[];
}

/**
 * Hook principal pour toutes les offres TimeOne
 */
export function useTimeOneOffers(options: UseTimeOneOffersOptions = {}): UseTimeOneOffersReturn {
  const {
    autoFetch = true,
    refreshInterval = 30 * 60 * 1000,
    retryCount = 3,
    onError,
    onSuccess,
  } = options;

  // États principaux
  const [offers, setOffers] = useState<TimeOneMobilePlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [fromCache, setFromCache] = useState<boolean>(false);

  // Refs pour éviter les re-renders
  const retryCountRef = useRef<number>(0);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Calcule les statistiques multi-opérateurs
   */
  const calculateStats = useCallback((offersList: TimeOneMobilePlan[]): TimeOneOffersStats => {
    if (offersList.length === 0) {
      return {
        total: 0,
        byOperator: {},
        byNetwork: { '4G': 0, '5G': 0 },
        byCommission: {},
        specialOffers: 0,
        recommended: 0,
        averageCommission: 0,
        totalPotentialCommission: 0,
        lastUpdate: lastFetch,
      };
    }

    const stats: TimeOneOffersStats = {
      total: offersList.length,
      byOperator: {},
      byNetwork: { '4G': 0, '5G': 0 },
      byCommission: {},
      specialOffers: 0,
      recommended: 0,
      averageCommission: 0,
      totalPotentialCommission: 0,
      lastUpdate: lastFetch,
    };

    offersList.forEach(offer => {
      // Répartition par opérateur
      stats.byOperator[offer.operator] = (stats.byOperator[offer.operator] || 0) + 1;

      // Répartition par réseau
      if (offer.networkType) {
        stats.byNetwork[offer.networkType]++;
      }

      // Répartition par commission
      stats.byCommission[offer.commission] = (stats.byCommission[offer.commission] || 0) + 1;
      stats.totalPotentialCommission += offer.commission;

      // Offres spéciales
      if (offer.isSpecialOffer) {
        stats.specialOffers++;
      }

      // Recommandées
      if (offer.isRecommended) {
        stats.recommended++;
      }
    });

    // Commission moyenne
    stats.averageCommission = offersList.reduce((sum, offer) => sum + offer.commission, 0) / offersList.length;

    return stats;
  }, [lastFetch]);

  /**
   * Fonction principale de fetch
   */
  const fetchOffers = useCallback(async (forceRefresh = false): Promise<void> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      console.log('[useTimeOneOffers] 🚀 Fetch optimisé');

      // 🚀 Fetch avec timeout réduit pour performance
      const response = await timeoneApi.fetchBouyguesXML({ 
        forceRefresh,
        timeout: 8000 // Réduit de 15s à 8s
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'No data received');
      }

      setFromCache(response.cached || false);

      // 🚀 Parsing avec limitation de performance
      const parseStart = performance.now();
      const parsedOffers = xmlParser.parseBouyguesXML(response.data);
      const parseTime = Math.round(performance.now() - parseStart);
      
      if (parsedOffers.length === 0) {
        console.warn('[useTimeOneOffers] ⚠️ No offers found');
      }

      // 🚀 Validation rapide
      const validOffers = parsedOffers.filter(offer => 
        offer.id && offer.name && offer.operator && offer.price && offer.trackingUrl
      );
      
      if (validOffers.length !== parsedOffers.length) {
        console.warn(`[useTimeOneOffers] ⚠️ Filtered ${parsedOffers.length - validOffers.length} invalid offers`);
      }

      // Mettre à jour les états
      setOffers(validOffers);
      setLastFetch(new Date());
      retryCountRef.current = 0;

      // 🚀 Stats simplifiées
      const operatorCount = [...new Set(validOffers.map(o => o.operator))].length;
      
      console.log(`[useTimeOneOffers] ✓ ${validOffers.length} offers, ${operatorCount} operators, ${parseTime}ms`);

      if (onSuccess) {
        onSuccess(validOffers);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown fetch error';
      console.error('[useTimeOneOffers] ❌', errorMessage);

      // 🚀 Retry simplifié avec délai réduit
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;
        console.log(`[useTimeOneOffers] 🔄 Retry ${retryCountRef.current}/${retryCount}`);
        
        setTimeout(() => {
          if (!abortControllerRef.current?.signal.aborted) {
            fetchOffers(forceRefresh);
          }
        }, 1000); // Réduit de 2s à 1s
        
        return;
      }

      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }

    } finally {
      setLoading(false);
    }
  }, [retryCount, onError, onSuccess]);

  /**
   * Utilitaires multi-opérateurs
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const forceRefresh = useCallback(async (): Promise<void> => {
    await fetchOffers(true);
  }, [fetchOffers]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchOffers(false);
  }, [fetchOffers]);

  const getOfferByPromoid = useCallback((promoid: string): TimeOneMobilePlan | undefined => {
    return offers.find(offer => offer.promoid === promoid);
  }, [offers]);

  const getOffersByOperator = useCallback((operator: string): TimeOneMobilePlan[] => {
    return offers.filter(offer => offer.operator === operator);
  }, [offers]);

  const getOffersByCommission = useCallback((minCommission: number): TimeOneMobilePlan[] => {
    return offers.filter(offer => offer.commission >= minCommission);
  }, [offers]);

  const getRecommendedOffers = useCallback((): TimeOneMobilePlan[] => {
    return offers.filter(offer => offer.isRecommended);
  }, [offers]);

  // Compatibilité avec l'ancien hook
  const getBouyguesOffers = useCallback((): TimeOneMobilePlan[] => {
    return offers.filter(offer => offer.operator === 'Bouygues Telecom');
  }, [offers]);

  /**
   * NOUVELLES MÉTHODES pour les offres mises en avant
   */
  
  // Offre principale (Hero) - Commission la plus élevée
  const getFeaturedOffer = useCallback((): TimeOneMobilePlan | undefined => {
    const featuredOffers = offers
      .filter(offer => offer.commission >= 45)
      .sort((a, b) => b.commission - a.commission);
    
    console.log('[useTimeOneOffers] Offres candidates pour featured:', featuredOffers.length);
    return featuredOffers[0];
  }, [offers]);

  // Offre "locale" - 2ème meilleure commission, différente de la featured
  const getLocalOffer = useCallback((): TimeOneMobilePlan | undefined => {
    const featured = getFeaturedOffer();
    const localOffers = offers
      .filter(offer => 
        offer.id !== featured?.id && 
        offer.commission >= 30
      )
      .sort((a, b) => b.commission - a.commission);
    
    console.log('[useTimeOneOffers] Offres candidates pour locale:', localOffers.length);
    return localOffers[0];
  }, [offers, getFeaturedOffer]);

  // Widget circulaire - 4 offres variées par catégorie
  const getWidgetOffers = useCallback((): TimeOneMobilePlan[] => {
    const featured = getFeaturedOffer();
    const local = getLocalOffer();
    const usedIds = [featured?.id, local?.id].filter(Boolean);
    
    const availableOffers = offers.filter(offer => !usedIds.includes(offer.id));
    
    // Catégoriser les offres
    const smallDataOffers = availableOffers
      .filter(offer => parseInt(offer.data) <= 20)
      .sort((a, b) => b.commission - a.commission);
    
    const bigDataOffers = availableOffers
      .filter(offer => parseInt(offer.data) >= 100)
      .sort((a, b) => b.commission - a.commission);
    
    const fiveGOffers = availableOffers
      .filter(offer => offer.networkType === '5G')
      .sort((a, b) => b.commission - a.commission);
    
    const specialOffers = availableOffers
      .filter(offer => offer.isSpecialOffer)
      .sort((a, b) => b.commission - a.commission);
    
    // Construire le widget avec diversité
    const widgetOffers: TimeOneMobilePlan[] = [];
    const addedIds = new Set();
    
    // Ajouter une offre de chaque catégorie (sans doublons)
    [smallDataOffers[0], bigDataOffers[0], fiveGOffers[0], specialOffers[0]]
      .filter(Boolean)
      .forEach(offer => {
        if (!addedIds.has(offer.id)) {
          widgetOffers.push(offer);
          addedIds.add(offer.id);
        }
      });
    
    // Compléter avec les meilleures commissions restantes si nécessaire
    const remaining = availableOffers
      .filter(offer => !addedIds.has(offer.id))
      .sort((a, b) => b.commission - a.commission);
    
    while (widgetOffers.length < 4 && remaining.length > 0) {
      const nextOffer = remaining.shift();
      if (nextOffer) {
        widgetOffers.push(nextOffer);
      }
    }
    
    console.log('[useTimeOneOffers] Offres widget sélectionnées:', widgetOffers.length);
    return widgetOffers.slice(0, 4);
  }, [offers, getFeaturedOffer, getLocalOffer]);

  /**
   * Calcul des stats (memoized)
   */
  const stats = calculateStats(offers);

  /**
   * Effects
   */
  useEffect(() => {
    if (autoFetch) {
      fetchOffers();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch]);

  useEffect(() => {
    if (refreshInterval > 0 && lastFetch) {
      refreshIntervalRef.current = setInterval(() => {
        console.log('[useTimeOneOffers] Auto-refresh des offres');
        fetchOffers();
      }, refreshInterval);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [refreshInterval, lastFetch, fetchOffers]);

  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // États principaux
    offers,
    loading,
    error,
    
    // Métadonnées
    stats,
    lastFetch,
    fromCache,
    
    // Actions
    refetch,
    clearError,
    forceRefresh,
    
    // Utilitaires existants
    getOfferByPromoid,
    getOffersByOperator,
    getOffersByCommission,
    getRecommendedOffers,
    getBouyguesOffers, // Compatibilité
    
    // Nouvelles méthodes pour les offres mises en avant
    getFeaturedOffer,
    getLocalOffer,
    getWidgetOffers,
  };
}

/**
 * Hook simplifié pour usage basique
 */
export function useTimeOneOffersSimple() {
  const { offers, loading, error, refetch } = useTimeOneOffers({
    autoFetch: true,
    refreshInterval: 0,
  });

  return { offers, loading, error, refetch };
}

export default useTimeOneOffers;