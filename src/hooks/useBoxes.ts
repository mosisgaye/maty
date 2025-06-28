// hooks/useBoxes.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, BoxFilters, SortOption } from '@/types/box';
import { BoxService } from '@/lib/box-service';

/**
 * RECOMMANDATIONS APPLIQUÉES:
 * 1. ✅ Fusion de useBoxes et useFilteredBoxes en un seul hook
 * 2. ✅ Suppression de useFavorites (non utilisé dans l'app)
 * 3. ✅ Optimisation de usePagination (suppression des fonctions inutiles)
 * 4. ✅ Mémoisation des calculs coûteux
 * 5. ✅ Suppression des re-exports inutiles
 */

// Hook principal combiné pour les box et le filtrage
interface UseBoxesWithFiltersOptions {
  initialBoxes?: Box[];
  filters: BoxFilters;
  sortOption: SortOption;
  autoLoad?: boolean;
}

interface UseBoxesWithFiltersReturn {
  boxes: Box[];
  filteredBoxes: Box[];
  sortedBoxes: Box[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  reload: () => Promise<void>;
}

export function useBoxesWithFilters({
  initialBoxes = [],
  filters,
  sortOption,
  autoLoad = true
}: UseBoxesWithFiltersOptions): UseBoxesWithFiltersReturn {
  const [boxes, setBoxes] = useState<Box[]>(initialBoxes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chargement des box
  const loadBoxes = useCallback(async () => {
    if (boxes.length > 0 && !autoLoad) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const service = BoxService.getInstance();
      const loadedBoxes = await service.loadBoxes();
      setBoxes(loadedBoxes);
    } catch (err) {
      console.error('Erreur lors du chargement des box:', err);
      setError('Impossible de charger les offres box internet');
    } finally {
      setLoading(false);
    }
  }, [autoLoad, boxes.length]);

  // Effet pour le chargement initial
  useEffect(() => {
    if (autoLoad && boxes.length === 0) {
      loadBoxes();
    }
  }, [autoLoad, loadBoxes, boxes.length]);

  // Filtrage optimisé avec useMemo
  const filteredBoxes = useMemo(() => {
    return boxes.filter(box => {
      // Filtre par technologie
      if (filters.technology !== 'all' && box.technologie !== filters.technology) {
        return false;
      }

      // Filtre par prix (optimisation: vérification simple)
      if (box.prix_mensuel > filters.priceRange[0]) {
        return false;
      }

      // Filtre par débit
      if (box.debit_down < filters.speedRange[0]) {
        return false;
      }

      // Filtre par engagement (simplifié)
      if (filters.engagement === 'with' && box.engagement === 0) {
        return false;
      }
      if (filters.engagement === 'without' && box.engagement > 0) {
        return false;
      }

      // Filtre par TV
      if (filters.tvIncluded === 'with' && !box.tv_incluse) {
        return false;
      }
      if (filters.tvIncluded === 'without' && box.tv_incluse) {
        return false;
      }

      // Filtre par téléphone fixe
      if (filters.phoneIncluded && !box.telephone_fixe) {
        return false;
      }

      // Filtre par Wi-Fi
      if (filters.wifiStandard.length > 0 && !filters.wifiStandard.includes(box.wifi)) {
        return false;
      }

      return true;
    });
  }, [boxes, filters]);

  // Tri optimisé avec useMemo
  const sortedBoxes = useMemo(() => {
    const sorted = [...filteredBoxes];
    
    switch (sortOption) {
      case 'price-asc':
        return sorted.sort((a, b) => a.prix_mensuel - b.prix_mensuel);
      case 'price-desc':
        return sorted.sort((a, b) => b.prix_mensuel - a.prix_mensuel);
      case 'speed-desc':
        return sorted.sort((a, b) => b.debit_down - a.debit_down);
      case 'featured':
        return sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.debit_down - a.debit_down;
        });
      default:
        return sorted;
    }
  }, [filteredBoxes, sortOption]);

  return {
    boxes,
    filteredBoxes,
    sortedBoxes,
    loading,
    error,
    totalCount: filteredBoxes.length,
    reload: loadBoxes
  };
}

// Hook simplifié pour la comparaison
interface UseBoxComparisonReturn {
  comparisonList: string[];
  canAddMore: boolean;
  addToComparison: (boxId: string) => boolean;
  removeFromComparison: (boxId: string) => void;
  clearComparison: () => void;
  isInComparison: (boxId: string) => boolean;
}

export function useBoxComparison(maxComparison: number = 3): UseBoxComparisonReturn {
  const [comparisonList, setComparisonList] = useState<string[]>([]);

  const addToComparison = useCallback((boxId: string): boolean => {
    if (comparisonList.includes(boxId) || comparisonList.length >= maxComparison) {
      return false;
    }
    setComparisonList(prev => [...prev, boxId]);
    return true;
  }, [comparisonList, maxComparison]);

  const removeFromComparison = useCallback((boxId: string) => {
    setComparisonList(prev => prev.filter(id => id !== boxId));
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonList([]);
  }, []);

  const isInComparison = useCallback((boxId: string): boolean => {
    return comparisonList.includes(boxId);
  }, [comparisonList]);

  return {
    comparisonList,
    canAddMore: comparisonList.length < maxComparison,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison
  };
}

// Hook de pagination simplifié (juste les calculs, pas de navigation)
interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasPrevious: boolean;
  hasNext: boolean;
  pageNumbers: (number | string)[];
}

export function usePagination(
  totalItems: number,
  itemsPerPage: number,
  currentPage: number
): UsePaginationReturn {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Calcul optimisé des numéros de page
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = 2;
    const range: (number | string)[] = [];
    
    // Toujours afficher la première page
    range.push(1);
    
    // Logique simplifiée pour les pages du milieu
    if (currentPage > 3) range.push('...');
    
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    
    if (currentPage < totalPages - 2) range.push('...');
    
    // Toujours afficher la dernière page
    if (totalPages > 1) range.push(totalPages);
    
    return range;
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages,
    pageNumbers
  };
}