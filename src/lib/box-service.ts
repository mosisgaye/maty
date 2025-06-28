// lib/box-service.ts
import { Box } from '@/types/box';

/**
 * RECOMMANDATIONS APPLIQUÉES:
 * 1. ✅ Réduction du mapping en dur (données de base seulement)
 * 2. ✅ Structure plus maintenable avec des constantes
 * 3. ✅ Logique d'enrichissement simplifiée
 * 4. ✅ Suppression des répétitions de code
 * 5. ✅ Meilleure séparation des responsabilités
 */

// Interface pour les données brutes du CSV
interface RawBoxData {
  Nom_Lien: string;
  URL_Tracking: string;
}

// Constantes pour les valeurs par défaut
const DEFAULT_BOX_VALUES = {
  installation: 'Gratuite',
  wifi: 'Wi-Fi 6',
  disponible: true,
  engagement: 12,
  duree_promo: 12,
  telephone_fixe: true,
  tv_incluse: false,
  nb_decodeurs: 0,
  featured: false,
  extras: '',
} as const;

// Configuration des offres de base (données minimales)
const BOX_BASE_CONFIG: Record<string, {
  nom: string;
  debit_down: number;
  debit_up: number;
  prix_mensuel: number;
  prix_apres_promo: number;
  technologie: 'Fibre' | '5G' | 'ADSL';
}> = {
  'fit': {
    nom: 'Bbox Fit',
    debit_down: 400,
    debit_up: 400,
    prix_mensuel: 15.99,
    prix_apres_promo: 27.99,
    technologie: 'Fibre',
  },
  'must': {
    nom: 'Bbox Must',
    debit_down: 1000,
    debit_up: 700,
    prix_mensuel: 15.99,
    prix_apres_promo: 40.99,
    technologie: 'Fibre',
  },
  'ultym': {
    nom: 'Bbox Ultym',
    debit_down: 2000,
    debit_up: 1000,
    prix_mensuel: 31.99,
    prix_apres_promo: 54.99,
    technologie: 'Fibre',
  },
  '5g': {
    nom: 'Bbox 5G',
    debit_down: 1000,
    debit_up: 100,
    prix_mensuel: 34.99,
    prix_apres_promo: 39.99,
    technologie: '5G',
  },
  'adsl': {
    nom: 'Bbox ADSL',
    debit_down: 20,
    debit_up: 1,
    prix_mensuel: 24.99,
    prix_apres_promo: 29.99,
    technologie: 'ADSL',
  },
  'byou': {
    nom: 'Bbox B&You',
    debit_down: 400,
    debit_up: 400,
    prix_mensuel: 19.99,
    prix_apres_promo: 19.99,
    technologie: 'Fibre',
  }
};

// Fonction pour identifier le type de box depuis le nom
function identifyBoxType(nomLien: string): string {
  const nom = nomLien.toLowerCase();
  
  if (nom.includes('fit')) return 'fit';
  if (nom.includes('ultym')) return 'ultym';
  if (nom.includes('must')) return 'must';
  if (nom.includes('5g')) return '5g';
  if (nom.includes('adsl')) return 'adsl';
  if (nom.includes('byou') || nom.includes('b&you')) return 'byou';
  
  // Par défaut, retourner 'fit' pour les offres non identifiées
  return 'fit';
}

// Fonction pour extraire les caractéristiques spéciales
function extractSpecialFeatures(nomLien: string): Partial<Box> {
  const nom = nomLien.toLowerCase();
  const features: Partial<Box> = {};
  
  // TV incluse
  if (nom.includes('must') || nom.includes('ultym') || nom.includes('adsl')) {
    features.tv_incluse = true;
    features.nb_decodeurs = nom.includes('ultym') ? 2 : 1;
  }
  
  // Wi-Fi amélioré
  if (nom.includes('ultym')) {
    features.wifi = 'Wi-Fi 7';
  } else if (nom.includes('must')) {
    features.wifi = 'Wi-Fi 6E';
  }
  
  // Sans engagement
  if (nom.includes('byou') || nom.includes('b&you') || nom.includes('5g')) {
    features.engagement = 0;
    features.duree_promo = 0;
  }
  
  // Extras gaming/TV
  if (nom.includes('ps5')) {
    features.extras = 'PlayStation 5 incluse';
    features.featured = true;
    features.engagement = 24;
  } else if (nom.includes('xbox')) {
    features.extras = 'Xbox Series S incluse';
    features.featured = true;
    features.engagement = 24;
  } else if (nom.includes('smart tv') || nom.includes('smarttv')) {
    features.extras = 'Smart TV Samsung 50" offerte';
    features.featured = true;
    features.engagement = 24;
  } else if (nom.includes('netflix')) {
    features.extras = 'Netflix Standard inclus';
  }
  
  // 5G Box spécificités
  if (nom.includes('5g')) {
    features.telephone_fixe = false;
    features.duree_promo = 6;
    features.extras = 'Solution sans ligne fixe';
  }
  
  return features;
}

// Fonction d'enrichissement optimisée
function enrichBoxData(rawData: RawBoxData, index: number): Box {
  const boxType = identifyBoxType(rawData.Nom_Lien);
  const baseConfig = BOX_BASE_CONFIG[boxType] || BOX_BASE_CONFIG['fit'];
  const specialFeatures = extractSpecialFeatures(rawData.Nom_Lien);
  
  // Extraire le promo_id de l'URL
  const promoIdMatch = rawData.URL_Tracking.match(/promoid=(\d+)/);
  const promoId = promoIdMatch ? parseInt(promoIdMatch[1]) : index + 1000;
  
  // Générer la description
  const description = generateDescription(baseConfig, specialFeatures);
  
  // Construire l'objet Box final
  return {
    id: index + 1,
    promo_id: promoId,
    url_tracking: rawData.URL_Tracking,
    image_url: `/images/${baseConfig.nom.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    description,
    ...DEFAULT_BOX_VALUES,
    ...baseConfig,
    ...specialFeatures,
  } as Box;
}

// Fonction pour générer une description appropriée
function generateDescription(baseConfig: any, features: Partial<Box>): string {
  const parts: string[] = [];
  
  // Débit
  if (baseConfig.debit_down >= 1000) {
    parts.push(`Internet ${baseConfig.debit_down / 1000} Gb/s`);
  } else {
    parts.push(`Internet ${baseConfig.debit_down} Mb/s`);
  }
  
  // Services inclus
  if (features.tv_incluse) {
    parts.push('TV');
  }
  if (features.telephone_fixe !== false) {
    parts.push('Téléphone');
  }
  
  // Extras
  if (features.extras) {
    parts.push(`+ ${features.extras}`);
  }
  
  return parts.join(' + ');
}

// Service principal optimisé
export class BoxService {
  private static instance: BoxService;
  private boxes: Box[] = [];
  private loading = false;
  
  static getInstance(): BoxService {
    if (!BoxService.instance) {
      BoxService.instance = new BoxService();
    }
    return BoxService.instance;
  }

  async loadBoxes(): Promise<Box[]> {
    // Si déjà chargé, retourner le cache
    if (this.boxes.length > 0) {
      return this.boxes;
    }

    // Éviter les chargements multiples
    if (this.loading) {
      while (this.loading) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      return this.boxes;
    }

    this.loading = true;

    try {
      const rawData = await this.loadRawBoxData();
      this.boxes = rawData.map((data, index) => enrichBoxData(data, index));
      return this.boxes;
    } catch (error) {
      console.error('Erreur lors du chargement des box:', error);
      return [];
    } finally {
      this.loading = false;
    }
  }

  private async loadRawBoxData(): Promise<RawBoxData[]> {
    // TODO: Implémenter le chargement réel depuis CSV/API
    // Pour l'instant, données simulées minimales
    return [
      { Nom_Lien: 'Lien_FAI_Bbox_Fit_FilRouge', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=155849&progid=5334&partid=63879' },
      { Nom_Lien: 'Lien_FAI_Bbox_Must_FilRouge', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=155941&progid=5334&partid=63879' },
      { Nom_Lien: 'Lien_FAI_Bbox_Ultym', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=218236&progid=5334&partid=63879' },
      // Ajouter les autres offres selon le CSV
    ];
  }

  // Méthodes utilitaires simplifiées
  getBoxById(id: number): Box | undefined {
    return this.boxes.find(box => box.id === id);
  }

  getFeaturedBoxes(): Box[] {
    return this.boxes.filter(box => box.featured);
  }
}

// Export de la fonction helper pour le SSR
export async function loadBoxesFromServer(): Promise<Box[]> {
  const service = BoxService.getInstance();
  return await service.loadBoxes();
}