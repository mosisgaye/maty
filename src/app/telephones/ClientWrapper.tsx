// app/telephones/ClientWrapper.tsx
'use client'

import React from 'react'
import { Phone } from '@/types/phones'
import { usePhones } from '@/hooks/usePhones'
import PhoneHero from '@/components/phones/PhoneHero'
import PhoneContent from '@/components/phones/PhoneContent'

interface ClientWrapperProps {
  initialPhones: Phone[]
}

export default function ClientWrapper({ initialPhones }: ClientWrapperProps) {
  // Utiliser le hook existant avec les données pré-chargées
  const {
    // États de filtres
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
    
    // États Bouygues
    forfaitType,
    setForfaitType,
    networkType,
    setNetworkType,
    showOnlyDeals,
    setShowOnlyDeals,
    
    // Données - on utilise les données pré-chargées
    filteredPhones,
    isLoading,
    isError,
    
    // Fonctions
    toggleComparison
  } = usePhones(initialPhones) // On passe les données pré-chargées ici

  return (
    <>
      {/* Hero Section - votre composant intact */}
      <PhoneHero />
      
      {/* Contenu principal - votre composant intact */}
      <PhoneContent 
        // États de filtres
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        selectedConditions={selectedConditions}
        setSelectedConditions={setSelectedConditions}
        selectedOS={selectedOS}
        setSelectedOS={setSelectedOS}
        selectedStorage={selectedStorage}
        setSelectedStorage={setSelectedStorage}
        ecoFriendly={ecoFriendly}
        setEcoFriendly={setEcoFriendly}
        sortOption={sortOption}
        setSortOption={setSortOption}
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        
        // États Bouygues
        forfaitType={forfaitType}
        setForfaitType={setForfaitType}
        networkType={networkType}
        setNetworkType={setNetworkType}
        showOnlyDeals={showOnlyDeals}
        setShowOnlyDeals={setShowOnlyDeals}
        
        // Données
        allPhones={initialPhones} // Données pré-chargées
        filteredPhones={filteredPhones}
        isLoading={isLoading}
        isError={isError}
        
        // Comparaison
        comparisonList={comparisonList}
        toggleComparison={toggleComparison}
      />
    </>
  )
}