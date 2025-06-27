import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MobilePlan, NetworkType, SortOption } from '@/types/mobile';

interface MobilePlanResponse {
  id: string;
  name: string;
  operator: string;
  data: string;
  price: string;
  coverage: string;
  features: string[];
  created_at: string;
  updated_at: string;
  affiliate_url: string | null;
}

const fetchMobilePlans = async (): Promise<MobilePlan[]> => {
  const { data, error } = await supabase
    .from('mobile_plans')
    .select('*')
    .order('price');

  if (error) {
    console.error('Error fetching mobile plans:', error);
    throw new Error('Failed to fetch mobile plans');
  }

  return (data as MobilePlanResponse[]).map(plan => ({
    id: parseInt(plan.id.slice(0, 8), 16), // Convert UUID to a simple numeric ID
    name: plan.name,
    operator: plan.operator,
    data: plan.data,
    price: plan.price,
    coverage: plan.coverage,
    features: plan.features,
    affiliate_url: plan.affiliate_url || undefined,
    commission: 0 // Default commission value
  }));
};

export const useMobilePlansFromSupabase = () => {
  const [dataRange, setDataRange] = useState<number[]>([100]);
  const [priceRange, setPriceRange] = useState<number[]>([20]);
  const [networkType, setNetworkType] = useState<NetworkType>('all');
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<MobilePlan[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Fetch data using React Query
  const { data: allPlans = [], isLoading, error } = useQuery({
    queryKey: ['mobilePlans'],
    queryFn: fetchMobilePlans,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get all available operators from the data
  const operators = Array.from(new Set(allPlans.map(plan => plan.operator)));

  const handleOperatorChange = (operator: string) => {
    setSelectedOperators(prev => {
      if (prev.includes(operator)) {
        return prev.filter(op => op !== operator);
      } else {
        return [...prev, operator];
      }
    });
  };

  // Apply filters
  useEffect(() => {
    if (allPlans.length === 0) return;
    
    // Set filtering state to true
    setIsFiltering(true);
    
    // Set a small timeout to simulate loading and show skeleton
    const filterTimer = setTimeout(() => {
      let filtered = [...allPlans];

      // Filter by data amount
      filtered = filtered.filter(plan => {
        const dataAmount = parseInt(plan.data.replace(/[^0-9]/g, ''));
        return dataAmount <= dataRange[0];
      });

      // Filter by price
      filtered = filtered.filter(plan => {
        const price = parseFloat(plan.price.match(/\d+\.\d+/)?.[0] || '0');
        return price <= priceRange[0];
      });

      // Filter by network type (4G/5G)
      if (networkType !== 'all') {
        filtered = filtered.filter(plan => plan.coverage.includes(networkType));
      }

      // Filter by selected operators
      if (selectedOperators.length > 0) {
        filtered = filtered.filter(plan => selectedOperators.includes(plan.operator));
      }

      // Sort results
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.price.match(/\d+\.\d+/)?.[0] || '0');
        const priceB = parseFloat(b.price.match(/\d+\.\d+/)?.[0] || '0');
        const dataA = parseInt(a.data.replace(/[^0-9]/g, ''));
        const dataB = parseInt(b.data.replace(/[^0-9]/g, ''));

        switch (sortOption) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'data-asc':
            return dataA - dataB;
          case 'data-desc':
            return dataB - dataA;
          default:
            return priceA - priceB;
        }
      });

      setFilteredPlans(filtered);
      setIsFiltering(false);
    }, 600); // 600ms delay to show the skeleton loading state
    
    return () => clearTimeout(filterTimer);
  }, [allPlans, dataRange, priceRange, networkType, selectedOperators, sortOption]);

  return {
    dataRange,
    setDataRange,
    priceRange,
    setPriceRange,
    networkType,
    setNetworkType,
    selectedOperators,
    operators,
    handleOperatorChange,
    filteredPlans,
    sortOption,
    setSortOption,
    filtersOpen,
    setFiltersOpen,
    isLoading,
    isFiltering,
    error
  };
};
