
import { useState, useEffect } from 'react';
import { internetBoxes } from '@/data/internetBoxes';
import { InternetBox, ConnectionType, SortOption } from '@/types/internet';

export const useInternetBoxes = () => {
  const [speedRange, setSpeedRange] = useState<number[]>([1000]);
  const [priceRange, setPriceRange] = useState<number[]>([30]);
  const [connectionType, setConnectionType] = useState<ConnectionType>('all');
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [selectedWifiTypes, setSelectedWifiTypes] = useState<string[]>([]);
  const [filteredBoxes, setFilteredBoxes] = useState<InternetBox[]>(internetBoxes);
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');
  const [filtersOpen, setFiltersOpen] = useState(true);

  // All available operators from the data
  const operators = Array.from(new Set(internetBoxes.map(box => box.operator)));
  // All available WiFi types from the data
  const wifiTypes = Array.from(new Set(internetBoxes.map(box => box.wifiType)));

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

  const applyFilters = () => {
    let filtered = [...internetBoxes];

    // Filter by download speed
    filtered = filtered.filter(box => {
      const speedMatch = box.downloadSpeed.match(/(\d+\.?\d*)\s*(Gb\/s|Mb\/s)/);
      if (!speedMatch) return true;
      
      const speedValue = parseFloat(speedMatch[1]);
      const speedUnit = speedMatch[2];
      
      // Convert to Mbps for comparison
      const speedMbps = speedUnit === 'Gb/s' ? speedValue * 1000 : speedValue;
      
      return speedMbps <= speedRange[0];
    });

    // Filter by price
    filtered = filtered.filter(box => {
      const price = parseFloat(box.price);
      return price <= priceRange[0];
    });

    // Filter by connection type
    if (connectionType !== 'all') {
      filtered = filtered.filter(box => {
        if (connectionType === 'fibre') {
          return box.downloadSpeed.includes('Gb/s') || parseInt(box.downloadSpeed) > 100;
        } else if (connectionType === 'adsl') {
          return box.downloadSpeed.includes('Mb/s') && parseInt(box.downloadSpeed) <= 100;
        } else if (connectionType === 'box4g') {
          return box.name.toLowerCase().includes('4g') || box.name.toLowerCase().includes('5g');
        }
        return true;
      });
    }

    // Filter by selected operators
    if (selectedOperators.length > 0) {
      filtered = filtered.filter(box => selectedOperators.includes(box.operator));
    }

    // Filter by selected WiFi types
    if (selectedWifiTypes.length > 0) {
      filtered = filtered.filter(box => selectedWifiTypes.includes(box.wifiType));
    }

    // Sort results
    filtered.sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      
      const speedMatchA = a.downloadSpeed.match(/(\d+\.?\d*)\s*(Gb\/s|Mb\/s)/);
      const speedMatchB = b.downloadSpeed.match(/(\d+\.?\d*)\s*(Gb\/s|Mb\/s)/);
      
      const speedValueA = speedMatchA ? parseFloat(speedMatchA[1]) : 0;
      const speedUnitA = speedMatchA ? speedMatchA[2] : 'Mb/s';
      const speedValueB = speedMatchB ? parseFloat(speedMatchB[1]) : 0;
      const speedUnitB = speedMatchB ? speedMatchB[2] : 'Mb/s';
      
      const speedMbpsA = speedUnitA === 'Gb/s' ? speedValueA * 1000 : speedValueA;
      const speedMbpsB = speedUnitB === 'Gb/s' ? speedValueB * 1000 : speedValueB;

      switch (sortOption) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'speed-asc':
          return speedMbpsA - speedMbpsB;
        case 'speed-desc':
          return speedMbpsB - speedMbpsA;
        default:
          return priceA - priceB;
      }
    });

    setFilteredBoxes(filtered);
  };

  // Apply filters when any filter value changes
  useEffect(() => {
    applyFilters();
  }, [speedRange, priceRange, connectionType, selectedOperators, selectedWifiTypes, sortOption]);

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
    setFiltersOpen
  };
};
