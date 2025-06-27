import { Phone, SortOption, PhoneFilters } from '@/types/phones';

/**
 * Filters the phones data based on extended criteria including forfaits
 */
export const filterPhones = (phones: Phone[], filters: PhoneFilters) => {
  return phones.filter(phone => {
    // Filter by brand
    if (filters.brands.length > 0 && !filters.brands.includes(phone.trademark)) {
      return false;
    }
    
    // Filter by price (téléphone seul, pas le forfait)
    if (phone.price < filters.priceRange.min || phone.price > filters.priceRange.max) {
      return false;
    }
    
    // Filter by condition
    if (filters.conditions.length > 0 && !filters.conditions.includes(phone.condition)) {
      return false;
    }
    
    // Filter by OS
    if (filters.operatingSystems.length > 0 && 
        phone.operatingSystem && 
        !filters.operatingSystems.includes(phone.operatingSystem)) {
      return false;
    }
    
    // Filter by storage
    if (filters.storage.length > 0 && 
        phone.storage && 
        !filters.storage.includes(phone.storage)) {
      return false;
    }
    
    // Filter by eco-friendly status
    if (filters.ecoFriendly && !phone.isEcoFriendly) {
      return false;
    }
    
    // 🆕 NOUVEAUX FILTRES BOUYGUES
    
    // Filter by forfait type
    if (filters.forfaitType && filters.forfaitType !== 'all') {
      if (filters.forfaitType === 'with-forfait' && !phone.hasForfait) {
        return false;
      }
      if (filters.forfaitType === 'without-forfait' && phone.hasForfait) {
        return false;
      }
    }
    
    // Filter by operators
    if (filters.operators && filters.operators.length > 0) {
      if (!phone.operator || !filters.operators.includes(phone.operator)) {
        return false;
      }
    }
    
    // Filter by network type
    if (filters.network && filters.network !== 'all') {
      if (!phone.network || phone.network !== filters.network) {
        return false;
      }
    }
    
    // Filter by forfait data range
    if (filters.forfaitDataRange && phone.forfaitData) {
      const dataAmount = parseInt(phone.forfaitData.replace(/[^0-9]/g, ''));
      if (dataAmount < filters.forfaitDataRange.min || dataAmount > filters.forfaitDataRange.max) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Sorts phones based on the selected sort option with new forfait options
 */
export const sortPhones = (phones: Phone[], sortOption: SortOption): Phone[] => {
  return [...phones].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating-desc':
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return ratingB - ratingA;
      case 'newest':
        // Prioritize affiliate offers (Bouygues) as "newest"
        if (a.isAffiliate && !b.isAffiliate) return -1;
        if (!a.isAffiliate && b.isAffiliate) return 1;
        return 0;
      case 'popularity':
        // Sort by brand popularity, then affiliate status
        const popularBrands = ['Apple', 'Samsung', 'Google', 'Xiaomi'];
        const aPopular = popularBrands.includes(a.trademark);
        const bPopular = popularBrands.includes(b.trademark);
        
        if (aPopular && !bPopular) return -1;
        if (!aPopular && bPopular) return 1;
        
        // Then by affiliate status
        if (a.isAffiliate && !b.isAffiliate) return -1;
        if (!a.isAffiliate && b.isAffiliate) return 1;
        
        return 0;
        
      // 🆕 NOUVEAUX TRIS FORFAIT
      case 'forfait-data-asc':
        const dataA = a.forfaitData ? parseInt(a.forfaitData.replace(/[^0-9]/g, '')) : 0;
        const dataB = b.forfaitData ? parseInt(b.forfaitData.replace(/[^0-9]/g, '')) : 0;
        return dataA - dataB;
        
      case 'forfait-data-desc':
        const dataA2 = a.forfaitData ? parseInt(a.forfaitData.replace(/[^0-9]/g, '')) : 0;
        const dataB2 = b.forfaitData ? parseInt(b.forfaitData.replace(/[^0-9]/g, '')) : 0;
        return dataB2 - dataA2;
        
      case 'total-price-asc':
        const totalA = a.totalMonthlyPrice || a.price;
        const totalB = b.totalMonthlyPrice || b.price;
        return totalA - totalB;
        
      case 'total-price-desc':
        const totalA2 = a.totalMonthlyPrice || a.price;
        const totalB2 = b.totalMonthlyPrice || b.price;
        return totalB2 - totalA2;
        
      default:
        return 0;
    }
  });
};

/**
 * Gets advanced filter statistics for the UI
 */
export const getAdvancedFilterStats = (phones: Phone[]) => {
  const stats = {
    totalPhones: phones.length,
    withForfait: phones.filter(p => p.hasForfait).length,
    affiliateOffers: phones.filter(p => p.isAffiliate).length,
    operators: [...new Set(phones.map(p => p.operator).filter(Boolean))],
    forfaitDataRanges: [...new Set(phones.map(p => p.forfaitData).filter(Boolean))],
    networkTypes: [...new Set(phones.map(p => p.network).filter(Boolean))],
    priceRanges: {
      phones: {
        min: Math.min(...phones.map(p => p.price)),
        max: Math.max(...phones.map(p => p.price))
      },
      totalMonthly: {
        min: Math.min(...phones.filter(p => p.totalMonthlyPrice).map(p => p.totalMonthlyPrice!)),
        max: Math.max(...phones.filter(p => p.totalMonthlyPrice).map(p => p.totalMonthlyPrice!))
      }
    }
  };
  
  return stats;
};

/**
 * Creates smart filter suggestions based on phone data
 */
export const getFilterSuggestions = (phones: Phone[]) => {
  const suggestions = [];
  
  // Suggest Bouygues offers if available
  const bouyguesOffers = phones.filter(p => p.operator === 'Bouygues Telecom');
  if (bouyguesOffers.length > 0) {
    suggestions.push({
      type: 'operator',
      label: `${bouyguesOffers.length} offres Bouygues Telecom`,
      filter: { operators: ['Bouygues Telecom'] },
      priority: 1
    });
  }
  
  // Suggest phones with forfait
  const withForfait = phones.filter(p => p.hasForfait);
  if (withForfait.length > 0) {
    suggestions.push({
      type: 'forfait',
      label: `${withForfait.length} téléphones avec forfait inclus`,
      filter: { forfaitType: 'with-forfait' as const },
      priority: 2
    });
  }
  
  // Suggest 5G phones
  const with5G = phones.filter(p => p.network === '5G');
  if (with5G.length > 0) {
    suggestions.push({
      type: 'network',
      label: `${with5G.length} téléphones 5G`,
      filter: { network: '5G' as const },
      priority: 3
    });
  }
  
  // Suggest budget options
  const budget = phones.filter(p => p.totalMonthlyPrice && p.totalMonthlyPrice < 50);
  if (budget.length > 0) {
    suggestions.push({
      type: 'price',
      label: `${budget.length} offres moins de 50€/mois`,
      filter: { forfaitDataRange: { min: 0, max: 50 } },
      priority: 4
    });
  }
  
  return suggestions.sort((a, b) => a.priority - b.priority);
};