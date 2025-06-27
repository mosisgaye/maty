
import { Phone, FilterOption, PriceRange } from '@/types/phones';

/**
 * Gets all unique brands from the phones data
 */
export const getBrands = (phones: Phone[]): FilterOption[] => {
  const brandsMap = new Map<string, number>();
  
  phones.forEach(phone => {
    if (phone.trademark) {
      const count = brandsMap.get(phone.trademark) || 0;
      brandsMap.set(phone.trademark, count + 1);
    }
  });
  
  return Array.from(brandsMap.entries())
    .map(([brand, count]) => ({ 
      id: brand.toLowerCase().replace(/\s+/g, '-'), 
      label: brand, 
      count 
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Gets all unique operating systems
 */
export const getOperatingSystems = (phones: Phone[]): FilterOption[] => {
  const osMap = new Map<string, number>();
  
  phones.forEach(phone => {
    if (phone.operatingSystem) {
      const count = osMap.get(phone.operatingSystem) || 0;
      osMap.set(phone.operatingSystem, count + 1);
    }
  });
  
  return Array.from(osMap.entries())
    .map(([os, count]) => ({ 
      id: os.toLowerCase().replace(/\s+/g, '-'), 
      label: os, 
      count 
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Gets all unique storage options
 */
export const getStorageOptions = (phones: Phone[]): FilterOption[] => {
  const storageMap = new Map<string, number>();
  
  phones.forEach(phone => {
    if (phone.storage) {
      const count = storageMap.get(phone.storage) || 0;
      storageMap.set(phone.storage, count + 1);
    }
  });
  
  return Array.from(storageMap.entries())
    .map(([storage, count]) => ({ 
      id: storage.toLowerCase().replace(/\s+/g, '-'), 
      label: storage, 
      count 
    }))
    .sort((a, b) => {
      // Sort by storage size numerically
      const sizeA = parseInt(a.label.match(/\d+/)?.[0] || '0');
      const sizeB = parseInt(b.label.match(/\d+/)?.[0] || '0');
      return sizeA - sizeB;
    });
};

/**
 * Gets price range (min and max) from all phones
 */
export const getPriceRange = (phones: Phone[]): PriceRange => {
  if (phones.length === 0) {
    return { min: 0, max: 2000 };
  }
  
  const prices = phones.map(phone => phone.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices))
  };
};
