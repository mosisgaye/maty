import React from 'react';
import PhoneFilterPanel from '@/components/phones/PhoneFilterPanel';
import PhoneResultsPanel from '@/components/phones/PhoneResultsPanel';
import { SortOption, Phone } from '@/types/phones';

interface PhoneContentProps {
  // Filter state - EXISTANT
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  selectedConditions: ('new' | 'refurbished' | 'used')[];
  setSelectedConditions: (conditions: ('new' | 'refurbished' | 'used')[]) => void;
  selectedOS: string[];
  setSelectedOS: (os: string[]) => void;
  selectedStorage: string[];
  setSelectedStorage: (storage: string[]) => void;
  ecoFriendly: boolean;
  setEcoFriendly: (value: boolean) => void;
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
  filtersOpen: boolean;
  setFiltersOpen: (value: boolean) => void;
  
  // 🆕 NOUVEAUX PROPS pour Bouygues
  forfaitType?: 'all' | 'with-forfait' | 'without-forfait';
  setForfaitType?: (type: 'all' | 'with-forfait' | 'without-forfait') => void;
  networkType?: 'all' | '4G' | '5G';
  setNetworkType?: (type: 'all' | '4G' | '5G') => void;
  showOnlyDeals?: boolean;
  setShowOnlyDeals?: (show: boolean) => void;
  
  // Data - EXISTANT
  allPhones: Phone[];
  filteredPhones: Phone[];
  isLoading: boolean;
  isError: boolean;
  
  // Comparison - EXISTANT
  comparisonList: string[];
  toggleComparison: (id: string) => void;
}

const PhoneContent: React.FC<PhoneContentProps> = ({
  // Filter state - EXISTANT
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
  
  // 🆕 NOUVEAUX PROPS avec valeurs par défaut
  forfaitType = 'all',
  setForfaitType = () => {},
  networkType = 'all',
  setNetworkType = () => {},
  showOnlyDeals = false,
  setShowOnlyDeals = () => {},
  
  // Data - EXISTANT
  allPhones,
  filteredPhones,
  isLoading,
  isError,
  
  // Comparison - EXISTANT
  comparisonList,
  toggleComparison
}) => {
  return (
    <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
      {isError ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Impossible de charger les données
          </h2>
          <p className="text-muted-foreground">
            Veuillez rafraîchir la page ou réessayer plus tard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Panel - 🔄 MISE À JOUR avec nouvelles props */}
          <PhoneFilterPanel 
            allPhones={allPhones}
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
            filtersOpen={filtersOpen}
            setFiltersOpen={setFiltersOpen}
            isLoading={isLoading}
            forfaitType={forfaitType}
            setForfaitType={setForfaitType}
            networkType={networkType}
            setNetworkType={setNetworkType}
            showOnlyDeals={showOnlyDeals}
            setShowOnlyDeals={setShowOnlyDeals}
          />

          {/* Results Panel - EXISTANT (pas de changement) */}
          <PhoneResultsPanel 
            phones={filteredPhones}
            sortOption={sortOption}
            setSortOption={setSortOption}
            isLoading={isLoading}
            comparisonList={comparisonList}
            toggleComparison={toggleComparison}
          />
        </div>
      )}
    </main>
  );
};

export default PhoneContent;