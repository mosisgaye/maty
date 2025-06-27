
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { InternetBox, ConnectionType, SortOption } from '@/types/internet';
import { fetchInternetBoxes } from '@/services/internet/api';
import { 
  filterInternetBoxes, 
  extractOperators, 
  extractWifiTypes 
} from '@/services/internet/filterService';

export const useInternetBoxesFromSupabase = () => {
  // State management for filters
  const [speedRange, setSpeedRange] = useState<number[]>([1000]);
  const [priceRange, setPriceRange] = useState<number[]>([30]);
  const [connectionType, setConnectionType] = useState<ConnectionType>('all');
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [selectedWifiTypes, setSelectedWifiTypes] = useState<string[]>([]);
  const [filteredBoxes, setFilteredBoxes] = useState<InternetBox[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  // Fetch data using React Query
  const { data: allBoxes = [], isLoading, error } = useQuery({
    queryKey: ['internetBoxes'],
    queryFn: fetchInternetBoxes,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // All available operators from the data
  const operators = extractOperators(allBoxes);
  // All available WiFi types from the data
  const wifiTypes = extractWifiTypes(allBoxes);

  const handleOperatorChange = (operator: string) => {
    setSelectedOperators(prev => {
      if (prev.includes(operator)) {
        return prev.filter(op => op !== operator);
      } else {
        return [...prev, operator];
      }
    });
  };

  const handleWifiTypeChange = (type: string) => {
    setSelectedWifiTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Apply filters
  useEffect(() => {
    if (!allBoxes.length) return;
    
    // Set filtering state to true
    setIsFiltering(true);
    
    // Set a small timeout to simulate loading and show skeleton
    const filterTimer = setTimeout(() => {
      const filtered = filterInternetBoxes(
        allBoxes,
        {
          speedRange,
          priceRange,
          connectionType,
          selectedOperators,
          selectedWifiTypes
        }
      );

      setFilteredBoxes(filtered);
      setIsFiltering(false);
    }, 600); // 600ms delay to show the skeleton loading state
    
    return () => clearTimeout(filterTimer);
  }, [allBoxes, speedRange, priceRange, connectionType, selectedOperators, selectedWifiTypes, sortOption]);

  return {
    speedRange,
    setSpeedRange,
    priceRange,
    setPriceRange,
    connectionType,
    setConnectionType,
    selectedOperators,
    operators,
    handleOperatorChange,
    selectedWifiTypes,
    wifiTypes,
    handleWifiTypeChange,
    filteredBoxes,
    sortOption,
    setSortOption,
    filtersOpen,
    setFiltersOpen,
    isLoading,
    isFiltering,
    error
  };
};
