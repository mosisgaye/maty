/**
 * Hook de compatibilité - Redirige vers le nouveau hook multi-opérateurs
 * DEPRECATED: Utilisez useTimeOneOffers à la place
 */

import { useTimeOneOffers, UseTimeOneOffersOptions, UseTimeOneOffersReturn } from './useTimeOneOffers';

/**
 * @deprecated Utilisez useTimeOneOffers à la place
 * Hook de compatibilité pour useBouyguesOffers
 */
export function useBouyguesOffers(options: UseTimeOneOffersOptions = {}): UseTimeOneOffersReturn {
  console.warn('[useBouyguesOffers] DEPRECATED: Utilisez useTimeOneOffers à la place');
  
  // Redirige vers le nouveau hook
  const result = useTimeOneOffers(options);
  
  // Log pour debug
  const bouyguesCount = result.offers.filter(o => o.operator === 'Bouygues Telecom').length;
  const totalCount = result.offers.length;
  
  if (totalCount > bouyguesCount) {
    console.log(`[useBouyguesOffers] ${bouyguesCount} offres Bouygues, ${totalCount - bouyguesCount} autres opérateurs`);
  }
  
  return result;
}

/**
 * @deprecated Utilisez useTimeOneOffersSimple à la place
 */
export function useBouyguesOffersSimple() {
  console.warn('[useBouyguesOffersSimple] DEPRECATED: Utilisez useTimeOneOffersSimple à la place');
  
  const { offers, loading, error, refetch } = useTimeOneOffers({
    autoFetch: true,
    refreshInterval: 0,
  });

  return { offers, loading, error, refetch };
}

// Exports pour compatibilité
export type {
  UseTimeOneOffersOptions as UseBouyguesOffersOptions,
  UseTimeOneOffersReturn as UseBouyguesOffersReturn,
  TimeOneOffersStats as BouyguesOffersStats
} from './useTimeOneOffers';

export default useBouyguesOffers;