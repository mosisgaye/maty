// hooks/usePhones.tsx
import { useState, useMemo } from 'react'
import { Phone, SortOption } from '@/types/phones'
import { filterPhones, sortPhones } from '@/services/phones/phoneService'

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

  // Use initial phones
  const allPhones = initialPhones

  // Filter and sort phones
  const filteredPhones = useMemo(() => {
    // Créer l'objet filters avec toutes les propriétés nécessaires
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
    
    // Log pour debug
    console.log('Applying filters:', filters)
    
    let filtered = filterPhones(allPhones, filters)
    
    // Appliquer le filtre des deals
    if (showOnlyDeals) {
      filtered = filtered.filter(phone => 
        phone.promotion || 
        (phone.discount && phone.discount > 50) ||
        (phone.totalMonthlyPrice && phone.totalMonthlyPrice < 40)
      )
    }
    
    return sortPhones(filtered, sortOption)
  }, [
    allPhones,
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

  // Toggle comparison
  const toggleComparison = (phoneId: string) => {
    setComparisonList(prev => {
      if (prev.includes(phoneId)) {
        return prev.filter(id => id !== phoneId)
      } else {
        if (prev.length >= 4) {
          return [...prev.slice(1), phoneId]
        }
        return [...prev, phoneId]
      }
    })
  }

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
    toggleComparison
  }
}