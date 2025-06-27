// hooks/usePhones.tsx
import { useState, useMemo, useCallback, useRef } from 'react'
import { Phone, SortOption } from '@/types/phones'
import { filterPhones, sortPhones } from '@/services/phones/phoneService'
import { memoize } from '@/lib/performance-client'

// Memoization des fonctions de filtrage coûteuses
const memoizedFilter = memoize(filterPhones)
const memoizedSort = memoize(sortPhones)

export const usePhones = (initialPhones: Phone[] = []) => {
  // Filter states
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<('new' | 'refurbished' | 'used')[]>([])
  const [selectedOS, setSelectedOS] = useState<string[]>([])
  const [selectedStorage, setSelectedStorage] = useState<string[]>([])
  const [ecoFriendly, setEcoFriendly] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption>('popularity')
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [comparisonList, setComparisonList] = useState<string[]>([])

  // Bouygues states
  const [forfaitType, setForfaitType] = useState<'all' | 'with-forfait' | 'without-forfait'>('all')
  const [networkType, setNetworkType] = useState<'all' | '4G' | '5G'>('all')
  const [showOnlyDeals, setShowOnlyDeals] = useState(false)

  // Cache pour éviter les recalculs
  const filterCacheRef = useRef<{
    key: string;
    result: Phone[];
  } | null>(null)

  // Use initial phones
  const allPhones = initialPhones

  // Générer une clé unique pour le cache des filtres
  const getFilterKey = useCallback(() => {
    return JSON.stringify({
      brands: selectedBrands,
      priceRange,
      conditions: selectedConditions,
      os: selectedOS,
      storage: selectedStorage,
      ecoFriendly,
      forfaitType,
      networkType,
      showOnlyDeals,
      sortOption
    })
  }, [
    selectedBrands,
    priceRange,
    selectedConditions,
    selectedOS,
    selectedStorage,
    ecoFriendly,
    forfaitType,
    networkType,
    showOnlyDeals,
    sortOption
  ])

  // Filter and sort phones avec cache
  const filteredPhones = useMemo(() => {
    const currentKey = getFilterKey()
    
    // Vérifier le cache
    if (filterCacheRef.current?.key === currentKey) {
      return filterCacheRef.current.result
    }

    // Performance: log uniquement en dev
    if (process.env.NODE_ENV === 'development') {
      console.time('Filter phones')
    }
    
    // Créer l'objet filters
    const filters = {
      brands: selectedBrands || [],
      priceRange: { 
        min: priceRange[0] || 0, 
        max: priceRange[1] || 2000 
      },
      conditions: selectedConditions || [],
      operatingSystems: selectedOS || [],
      storage: selectedStorage || [],
      ecoFriendly: ecoFriendly || false,
      forfaitType: forfaitType || 'all',
      network: networkType || 'all',
    }
    
    // Appliquer les filtres avec memoization
    let filtered = memoizedFilter(allPhones, filters)
    
    // Appliquer le filtre des deals
    if (showOnlyDeals) {
      filtered = filtered.filter(phone => 
        phone.promotion || 
        (phone.discount && phone.discount > 50) ||
        (phone.totalMonthlyPrice && phone.totalMonthlyPrice < 40)
      )
    }
    
    // Trier avec memoization
    const sorted = memoizedSort(filtered, sortOption)
    
    // Mettre en cache le résultat
    filterCacheRef.current = {
      key: currentKey,
      result: sorted
    }

    if (process.env.NODE_ENV === 'development') {
      console.timeEnd('Filter phones')
      console.log(`Filtered: ${sorted.length} phones from ${allPhones.length}`)
    }
    
    return sorted
  }, [allPhones, getFilterKey, showOnlyDeals, sortOption])

  // Toggle comparison avec limite
  const toggleComparison = useCallback((phoneId: string) => {
    setComparisonList(prev => {
      if (prev.includes(phoneId)) {
        return prev.filter(id => id !== phoneId)
      } else {
        if (prev.length >= 4) {
          // Optionnel: afficher un toast pour informer l'utilisateur
          console.warn('Maximum 4 téléphones en comparaison')
          return [...prev.slice(1), phoneId]
        }
        return [...prev, phoneId]
      }
    })
  }, [])

  // Fonction pour réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setPriceRange([0, 2000])
    setSelectedBrands([])
    setSelectedConditions([])
    setSelectedOS([])
    setSelectedStorage([])
    setEcoFriendly(false)
    setForfaitType('all')
    setNetworkType('all')
    setShowOnlyDeals(false)
    setSortOption('popularity')
  }, [])

  // Statistiques pour affichage (memoized)
  const stats = useMemo(() => ({
    totalResults: filteredPhones.length,
    avgPrice: filteredPhones.length > 0 
      ? Math.round(filteredPhones.reduce((sum, p) => sum + p.price, 0) / filteredPhones.length)
      : 0,
    hasActiveFilters: selectedBrands.length > 0 || 
                     selectedConditions.length > 0 || 
                     selectedOS.length > 0 || 
                     selectedStorage.length > 0 || 
                     ecoFriendly || 
                     forfaitType !== 'all' || 
                     networkType !== 'all' || 
                     showOnlyDeals ||
                     priceRange[0] > 0 || 
                     priceRange[1] < 2000
  }), [filteredPhones, selectedBrands, selectedConditions, selectedOS, selectedStorage, 
       ecoFriendly, forfaitType, networkType, showOnlyDeals, priceRange])

  return {
    // States
    priceRange,
    setPriceRange,
    selectedBrands,
    setSelectedBrands,
    selectedConditions,
    setSelectedConditions,
    selectedOS,
    setSelectedOS,
    selectedStorage,
    setSelectedStorage,
    ecoFriendly,
    setEcoFriendly,
    sortOption,
    setSortOption,
    filtersOpen,
    setFiltersOpen,
    comparisonList,
    forfaitType,
    setForfaitType,
    networkType,
    setNetworkType,
    showOnlyDeals,
    setShowOnlyDeals,
    
    // Data
    allPhones,
    filteredPhones,
    isLoading: false,
    isError: false,
    
    // Functions
    toggleComparison,
    resetFilters,
    
    // Stats
    stats
  }
}