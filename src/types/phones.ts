export interface Phone {
  id: string;
  ean: string;
  title: string;
  trademark: string;
  description: string;
  fullDescription?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  additionalImages?: string[];
  category: string;
  merchant: string;
  condition: 'new' | 'refurbished' | 'used';
  operatingSystem?: string;
  color?: string;
  storage?: string;
  shipping?: string;
  installmentPrice?: number;
  installmentMonths?: number;
  promotion?: string;
  rating?: number;
  reviewCount?: number;
  isEcoFriendly?: boolean;
  inStock?: boolean;
  productUrl?: string;
  
  // ✨ PROPRIÉTÉS BOUYGUES pour forfaits
  hasForfait?: boolean;
  forfaitData?: string;          // "150Go", "120Go"
  forfaitPrice?: number;         // Prix mensuel du forfait
  forfaitDuration?: number;      // 24 mois
  operator?: string;             // "Bouygues Telecom"
  network?: '4G' | '5G';
  
  // Affiliation
  isAffiliate?: boolean;
  affiliateUrl?: string;
  affiliateCommission?: number;
  
  // Engagement
  engagementDuration?: number;    // 24 mois
  totalMonthlyPrice?: number;     // Prix téléphone + forfait /mois
}

export type FilterOption = {
  id: string;
  label: string;
  count: number;
};

export type PriceRange = {
  min: number;
  max: number;
};

export type SortOption = 
  | 'price-asc' 
  | 'price-desc' 
  | 'popularity' 
  | 'newest'
  | 'rating-desc'
  | 'forfait-data-asc'    // ✨ NOUVEAU : Tri par forfait
  | 'forfait-data-desc'
  | 'total-price-asc'     // ✨ NOUVEAU : Tri par prix total
  | 'total-price-desc';

// ✨ NOUVEAUX TYPES POUR FILTRES BOUYGUES
export type NetworkType = 'all' | '4G' | '5G';
export type ForfaitType = 'all' | 'with-forfait' | 'without-forfait';


export interface PhoneFilters {
  brands: string[]
  priceRange: { min: number; max: number }
  conditions: ('new' | 'refurbished' | 'used')[]
  operatingSystems: string[]
  storage: string[]
  ecoFriendly?: boolean
  forfaitType?: 'all' | 'with-forfait' | 'without-forfait'
  operators?: string[]
  network?: 'all' | '4G' | '5G'
  forfaitDataRange?: { min: number; max: number }
}

