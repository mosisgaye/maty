// app/telephones/ClientWrapper.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Phone } from '@/types/phones'
import { usePhones } from '@/hooks/usePhones'
import PhoneHero from '@/components/phones/PhoneHero'
import PhoneContent from '@/components/phones/PhoneContent'

interface ClientWrapperProps {
  initialPhones: Phone[]
  currentPage?: number
  itemsPerPage?: number
}

export default function ClientWrapper({ 
  initialPhones,
  currentPage = 1,
  itemsPerPage = 30
}: ClientWrapperProps) {
  // État pour gérer le chargement progressif
  const [phonesLoaded, setPhonesLoaded] = useState(false)
  const [phones, setPhones] = useState<Phone[]>([])
  
  // Charger les téléphones progressivement
  useEffect(() => {
    // Premier rendu : seulement les téléphones de la page actuelle
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const initialPagePhones = initialPhones.slice(startIndex, endIndex)
    
    // Afficher d'abord la page actuelle
    setPhones(initialPagePhones)
    
    // Puis charger le reste après le premier paint
    requestIdleCallback(() => {
      setPhones(initialPhones)
      setPhonesLoaded(true)
    }, { timeout: 1000 })
  }, [initialPhones, currentPage, itemsPerPage])
  
  // Utiliser le hook avec les données chargées progressivement
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
    
    // Données
    filteredPhones,
    isLoading,
    isError,
    
    // Fonctions
    toggleComparison
  } = usePhones(phones) // Utilise les données chargées progressivement

  return (
    <>
      {/* Hero Section */}
      <PhoneHero />
      
      {/* Indicateur de chargement discret */}
      {!phonesLoaded && phones.length < initialPhones.length && (
        <div className="text-center py-2 text-sm text-muted-foreground">
          Chargement des filtres avancés...
        </div>
      )}
      
      {/* Contenu principal */}
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
        allPhones={phones}
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