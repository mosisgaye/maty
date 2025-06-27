// 🔄 REMPLACER VOTRE /services/phones/phoneService.ts PAR CE CONTENU

import { Phone, FilterOption, PriceRange, PhoneFilters, SortOption } from '@/types/phones';
// 🆕 IMPORTER le service CSV
import { loadPhonesFromCsv } from './bouygues-csv-service';

/**
 * Fonction principale pour récupérer les téléphones
 * 🔄 MODIFIÉE pour utiliser le CSV au lieu des mocks
 */
export async function fetchPhonesData(): Promise<Phone[]> {
  try {
    // 🆕 Utiliser les vraies données CSV
    return await loadPhonesFromCsv();
  } catch (error) {
    console.error('Erreur lors du chargement des données CSV:', error);
    // Fallback vers les exemples
    return getExamplePhones();
  }
}

/**
 * Obtenir les marques disponibles
 */
export function getBrands(phones: Phone[]): FilterOption[] {
  const brandCounts = phones.reduce((acc, phone) => {
    const brand = phone.trademark;
    acc[brand] = (acc[brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(brandCounts)
    .map(([brand, count]) => ({
      id: brand.toLowerCase().replace(/\s+/g, '-'),
      label: brand,
      count
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Obtenir les systèmes d'exploitation disponibles
 */
export function getOperatingSystems(phones: Phone[]): FilterOption[] {
  const osCounts = phones.reduce((acc, phone) => {
    if (phone.operatingSystem) {
      acc[phone.operatingSystem] = (acc[phone.operatingSystem] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(osCounts)
    .map(([os, count]) => ({
      id: os.toLowerCase(),
      label: os,
      count
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Obtenir les options de stockage disponibles
 */
export function getStorageOptions(phones: Phone[]): FilterOption[] {
  const storageCounts = phones.reduce((acc, phone) => {
    if (phone.storage) {
      acc[phone.storage] = (acc[phone.storage] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(storageCounts)
    .map(([storage, count]) => ({
      id: storage.toLowerCase(),
      label: storage,
      count
    }))
    .sort((a, b) => {
      // Tri numérique pour le stockage
      const aNum = parseInt(a.label);
      const bNum = parseInt(b.label);
      return aNum - bNum;
    });
}

/**
 * Obtenir la plage de prix
 */
export function getPriceRange(phones: Phone[]): PriceRange {
  if (phones.length === 0) return { min: 0, max: 2000 };
  
  const prices = phones.map(phone => phone.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices))
  };
}

/**
 * Filtrer les téléphones selon les critères
 * 🔄 ÉTENDU avec les nouveaux filtres Bouygues
 */
export function filterPhones(phones: Phone[], filters: PhoneFilters): Phone[] {
  return phones.filter(phone => {
    // Filtre par marque
    if (filters.brands.length > 0 && !filters.brands.includes(phone.trademark)) {
      return false;
    }

    // Filtre par prix
    if (phone.price < filters.priceRange.min || phone.price > filters.priceRange.max) {
      return false;
    }

    // Filtre par état
    if (filters.conditions.length > 0 && !filters.conditions.includes(phone.condition)) {
      return false;
    }

    // Filtre par système d'exploitation
    if (filters.operatingSystems.length > 0 && phone.operatingSystem && 
        !filters.operatingSystems.includes(phone.operatingSystem)) {
      return false;
    }

    // Filtre par stockage
    if (filters.storage.length > 0 && phone.storage && 
        !filters.storage.includes(phone.storage)) {
      return false;
    }

    // Filtre éco-responsable
    if (filters.ecoFriendly && !phone.isEcoFriendly) {
      return false;
    }

    // 🆕 NOUVEAUX FILTRES BOUYGUES

    // Filtre par forfait
    if (filters.forfaitType) {
      if (filters.forfaitType === 'with-forfait' && !phone.hasForfait) {
        return false;
      }
      if (filters.forfaitType === 'without-forfait' && phone.hasForfait) {
        return false;
      }
    }

    // Filtre par réseau
    if (filters.network && filters.network !== 'all' && 
        phone.network && phone.network !== filters.network) {
      return false;
    }

    // Filtre par opérateur
    if (filters.operators && filters.operators.length > 0 && 
        phone.operator && !filters.operators.includes(phone.operator)) {
      return false;
    }

    return true;
  });
}

/**
 * Trier les téléphones
 * 🔄 ÉTENDU avec de nouveaux types de tri
 */
export function sortPhones(phones: Phone[], sortOption: SortOption): Phone[] {
  const sortedPhones = [...phones];
  
  switch (sortOption) {
    case 'price-asc':
      return sortedPhones.sort((a, b) => a.price - b.price);
    
    case 'price-desc':
      return sortedPhones.sort((a, b) => b.price - a.price);
    
    case 'rating-desc':
      return sortedPhones.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
    case 'newest':
      // Trier par les nouveaux modèles (iPhone 16, Galaxy S25, etc.)
      return sortedPhones.sort((a, b) => {
        const aIsNew = a.title.includes('16') || a.title.includes('S25') || a.title.includes('A26');
        const bIsNew = b.title.includes('16') || b.title.includes('S25') || b.title.includes('A26');
        if (aIsNew && !bIsNew) return -1;
        if (!aIsNew && bIsNew) return 1;
        return b.price - a.price; // Puis par prix décroissant
      });
    
    // 🆕 NOUVEAUX TRIS BOUYGUES
    case 'forfait-data-desc':
      return sortedPhones.sort((a, b) => {
        const aData = a.forfaitData ? parseInt(a.forfaitData) : 0;
        const bData = b.forfaitData ? parseInt(b.forfaitData) : 0;
        return bData - aData;
      });
    
    case 'forfait-data-asc':
      return sortedPhones.sort((a, b) => {
        const aData = a.forfaitData ? parseInt(a.forfaitData) : 0;
        const bData = b.forfaitData ? parseInt(b.forfaitData) : 0;
        return aData - bData;
      });
    
    case 'total-price-asc':
      return sortedPhones.sort((a, b) => {
        const aTotal = a.totalMonthlyPrice || a.price;
        const bTotal = b.totalMonthlyPrice || b.price;
        return aTotal - bTotal;
      });
    
    case 'total-price-desc':
      return sortedPhones.sort((a, b) => {
        const aTotal = a.totalMonthlyPrice || a.price;
        const bTotal = b.totalMonthlyPrice || b.price;
        return bTotal - aTotal;
      });
    
    case 'popularity':
    default:
      // Tri par popularité : forfait + marque + rating
      return sortedPhones.sort((a, b) => {
        // Priorité aux forfaits
        if (a.hasForfait && !b.hasForfait) return -1;
        if (!a.hasForfait && b.hasForfait) return 1;
        
        // Puis par marque (Apple, Samsung en premier)
        const brandPriority = { 'Apple': 3, 'Samsung': 2, 'Google': 1 };
        const aPriority = brandPriority[a.trademark as keyof typeof brandPriority] || 0;
        const bPriority = brandPriority[b.trademark as keyof typeof brandPriority] || 0;
        
        if (aPriority !== bPriority) return bPriority - aPriority;
        
        // Enfin par rating
        return (b.rating || 0) - (a.rating || 0);
      });
  }
}

/**
 * Données d'exemple pour le fallback
 * 🔄 SIMPLIFIÉES - utilisées seulement en cas d'erreur
 */
export function getExamplePhones(): Phone[] {
  return [
    {
      id: 'fallback-1',
      ean: '0000000000000',
      title: 'Chargement des données CSV...',
      trademark: 'Bouygues',
      description: 'Chargement en cours des téléphones Bouygues Telecom',
      price: 0,
      image: '/placeholder.svg',
      category: 'Téléphones mobiles',
      merchant: 'Bouygues Telecom',
      condition: 'new',
      operatingSystem: 'iOS',
      inStock: true,
      hasForfait: false,
      isAffiliate: true,
      affiliateUrl: '',
      operator: 'Bouygues Telecom',
      network: '5G',
      productUrl: ''
    }
  ];
}