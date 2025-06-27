// Base interface (votre existante, inchangée)
export interface MobilePlan {
  id: number;
  name: string;
  operator: string;
  data: string;
  price: string;
  coverage: string;
  features: string[];
  affiliate_url?: string;
  commission: number;
}

// Extension pour les sources de données
export type DataSource = 'supabase' | 'timeone';

// Extension pour TimeOne (hérite de MobilePlan)
export interface TimeOneMobilePlan extends MobilePlan {
  // Champs spécifiques TimeOne
  promoid: string;              // ID de promotion pour tracking
  commission: number;           // Votre commission en euros
  trackingUrl: string;          // URL avec tracking TimeOne
  commissionLevel: string;      // "Niveau 0", "Niveau 1", etc.
  source: 'timeone';           // Identifie la source
  
  // Métadonnées optionnelles
  isRecommended?: boolean;      // Badge "Recommandé"
  isSpecialOffer?: boolean;     // Offres spéciales (Summer Edition, etc.)
  networkType?: '4G' | '5G';    // Type de réseau
}

// Type union pour gérer les deux sources
export type UnifiedMobilePlan = MobilePlan | TimeOneMobilePlan;

// Type guards pour différencier les sources
export function isTimeOnePlan(plan: UnifiedMobilePlan): plan is TimeOneMobilePlan {
  return 'source' in plan && plan.source === 'timeone';
}

export function isSupabasePlan(plan: UnifiedMobilePlan): plan is MobilePlan {
  return !('source' in plan) || (plan as any).source !== 'timeone';
}

// Types existants (inchangés)
export type NetworkType = 'all' | '4G' | '5G';
export type SortOption = 'price-asc' | 'price-desc' | 'data-asc' | 'data-desc' | 'commission-desc';

// Nouveaux types pour TimeOne
export type CommissionLevel = 'Niveau 0' | 'Niveau 1' | 'Niveau 2' | 'Niveau 3' | 'Niveau 4' | 'Niveau 5';

// Interface pour les filtres étendus
export interface MobileFilters {
  networkType: NetworkType;
  operators: string[];
  priceRange: {
    min: number;
    max: number;
  };
  dataRange: {
    min: number;
    max: number;
  };
  sources: DataSource[];  // Nouveau : filtrer par source
}

// Interface pour les statistiques de plans
export interface PlanStats {
  total: number;
  bySource: Record<DataSource, number>;
  byOperator: Record<string, number>;
  averagePrice: number;
  averageCommission?: number;  // Pour TimeOne uniquement
}

// Ajouter ces extensions dans votre fichier src/types/mobile.ts

// Étendre le type UnifiedMobilePlan pour inclure les propriétés manquantes
// Si UnifiedMobilePlan = MobilePlan | TimeOneMobilePlan, alors il faut étendre ces types de base

// Dans MobilePlan, ajouter :
export interface MobilePlan {
  // ... propriétés existantes ...
  networkType?: '4G' | '5G';
  isRecommended?: boolean;
  isSpecialOffer?: boolean;
}

// Dans TimeOneMobilePlan, ces propriétés existent déjà probablement, mais vérifier :
export interface TimeOneMobilePlan {
  // ... propriétés existantes ...
  networkType?: '4G' | '5G';
  isRecommended?: boolean;
  isSpecialOffer?: boolean;
  commission: number; // Déjà présent normalement
}

// Alternativement, si vous ne voulez pas modifier les types existants,
// créer un type étendu pour l'UI :
export type ExtendedMobilePlan = UnifiedMobilePlan & {
  networkType?: '4G' | '5G';
  isRecommended?: boolean;
  isSpecialOffer?: boolean;
  commission?: number;
};

// Helper pour vérifier si c'est un plan TimeOne avec commission
export function getPlanCommission(plan: UnifiedMobilePlan): number {
  return isTimeOnePlan(plan) ? (plan as TimeOneMobilePlan).commission : 0;
}