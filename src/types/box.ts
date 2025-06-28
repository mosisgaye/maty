// types/box.ts

// Type pour la technologie
export type TechnologyType = 'Fibre' | '5G' | 'ADSL' | 'all';

// Type pour l'engagement  
export type EngagementType = 'all' | 'with' | 'without';

// Type pour la TV
export type TVType = 'all' | 'with' | 'without';

// Type pour le tri
export type SortOption = 
  | 'featured'
  | 'price-asc' 
  | 'price-desc'
  | 'speed-desc'
  | 'speed-asc'
  | 'popularity'
  | 'rating';

// Interface principale pour une Box
export interface Box {
  id: number;
  promo_id: number;
  nom: string;
  technologie: 'Fibre' | '5G' | 'ADSL';
  debit_down: number; // en Mb/s
  debit_up: number; // en Mb/s
  prix_mensuel: number;
  prix_apres_promo: number;
  duree_promo: number; // en mois
  engagement: number; // en mois, 0 = sans engagement
  installation: string;
  wifi: string; // Wi-Fi 6, Wi-Fi 6E, Wi-Fi 7
  tv_incluse: boolean;
  nb_decodeurs: number;
  telephone_fixe: boolean;
  extras: string;
  description: string;
  image_url: string;
  url_tracking: string;
  disponible: boolean;
  featured: boolean;
}

// Interface pour les filtres
export interface BoxFilters {
  technology: TechnologyType;
  priceRange: number[]; // [max]
  speedRange: number[]; // [min] 
  engagement: EngagementType;
  tvIncluded: TVType;
  phoneIncluded: boolean;
  wifiStandard: string[];
  installation: string[];
}

// Options de technologie
export const TECHNOLOGIES = [
  { value: 'all', label: 'Toutes' },
  { value: 'Fibre', label: 'Fibre' },
  { value: '5G', label: '5G' },
  { value: 'ADSL', label: 'ADSL' }
] as const;

// Options d'engagement
export const ENGAGEMENT_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'without', label: 'Sans engagement' },
  { value: 'with', label: 'Avec engagement' }
] as const;

// Options TV
export const TV_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'with', label: 'Avec TV' },
  { value: 'without', label: 'Internet seul' }
] as const;

// Standards Wi-Fi disponibles
export const WIFI_STANDARDS = ['Wi-Fi 6', 'Wi-Fi 6E', 'Wi-Fi 7'] as const;

// Options de tri
export const SORT_OPTIONS = [
  { value: 'featured', label: 'Meilleures offres' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'speed-desc', label: 'Débit décroissant' },
  { value: 'speed-asc', label: 'Débit croissant' },
  { value: 'popularity', label: 'Popularité' },
  { value: 'rating', label: 'Note' }
] as const;

// Fonctions utilitaires
export function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',');
}

export function formatSpeed(speed: number): string {
  if (speed >= 1000) {
    return `${speed / 1000} Gb/s`;
  }
  return `${speed} Mb/s`;
}

export function getEngagementText(months: number): string {
  if (months === 0) return 'Sans engagement';
  if (months === 12) return '1 an';
  if (months === 24) return '2 ans';
  return `${months} mois`;
}

export function getTechnologyIcon(tech: string): string {
  switch (tech) {
    case 'Fibre': return '🌐';
    case '5G': return '📶';
    case 'ADSL': return '📞';
    default: return '🌐';
  }
}

export function getPromoText(box: Box): string | null {
  if (box.duree_promo === 0) return null;
  
  const savings = box.prix_apres_promo - box.prix_mensuel;
  const percentSavings = Math.round((savings / box.prix_apres_promo) * 100);
  
  if (percentSavings > 0) {
    return `-${percentSavings}% pendant ${box.duree_promo} mois`;
  }
  
  return null;
}

export function calculateSavings(box: Box): number {
  if (box.duree_promo === 0) return 0;
  return (box.prix_apres_promo - box.prix_mensuel) * box.duree_promo;
}

// Valeurs par défaut pour les filtres
export const DEFAULT_FILTERS: BoxFilters = {
  technology: 'all',
  priceRange: [80],
  speedRange: [0],
  engagement: 'all',
  tvIncluded: 'all',
  phoneIncluded: false,
  wifiStandard: [],
  installation: []
};

