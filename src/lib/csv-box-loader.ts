// lib/csv-box-loader.ts
import { Box } from '@/types/box';

/**
 * VERSION CORRIGÉE - Typage TypeScript fixé
 */

// Interface pour les données CSV
interface CSVData {
  Nom_Lien: string;
  URL_Tracking: string;
}

// Interface pour la config de base
interface BoxConfig {
  nom: string;
  technologie: 'Fibre' | '5G' | 'ADSL';
  debit_down: number;
  debit_up: number;
  prix_mensuel: number;
  prix_apres_promo: number;
  description: string;
  tv_incluse?: boolean;
  nb_decodeurs?: number;
  wifi: string;
  extras?: string;
  featured?: boolean;
  engagement?: number;
  duree_promo?: number;
  telephone_fixe?: boolean;
  installation?: string;
}

// Données du CSV directement intégrées
const CSV_DATA: CSVData[] = [
  { Nom_Lien: 'Lien_FAI_Bbox_Fit_FilRouge', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=155849&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_Bbox_Must_FilRouge', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=155941&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_Bbox_Ultym', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=218236&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_5GBox_FilRouge', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=252690&progid=5334&partid=63879' },
  { Nom_Lien: 'Bbox B&You Pure Fibre', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=262863&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_ADSL', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=218235&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_Bbox_TV', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=155885&progid=5334&partid=63879' },
  { Nom_Lien: 'Box + Smart TV', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=243568&progid=5334&partid=63879' },
  { Nom_Lien: 'Box+ PS5', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=263159&progid=5334&partid=63879' },
  { Nom_Lien: 'Box + Xbox Series', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=263172&progid=5334&partid=63879' },
  { Nom_Lien: 'Box + iPad', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=264728&progid=5334&partid=63879' },
  { Nom_Lien: 'Bbox BIG > Forfait FAM + BOX', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=262099&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_Pro', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=180451&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_Fibre', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=224644&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_Box_ADSL', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=243575&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_Box+Forfait_Mobile', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=245416&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_Box+For-Mobile_Exclu', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=245417&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_Box+For-Mobile_Promo', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=245418&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_Box_ADSL_Exclu', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=245421&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_Box_ADSL_Promo', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=245422&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_Box_TV_Exclu', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=247178&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_Box_TV_Promo', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=247179&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_BBOX_Box_TV', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=250459&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_BBOX+Forfait', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=250466&progid=5334&partid=63879' },
  { Nom_Lien: 'Lien_FAI_Box_BBOX', URL_Tracking: 'https://tracking.publicidees.com/clic.php?promoid=253570&progid=5334&partid=63879' }
];

// Mapping détaillé des types de box
const BOX_TYPES: Record<string, BoxConfig> = {
  'Lien_FAI_Bbox_Fit_FilRouge': {
    nom: 'Bbox Fit',
    technologie: 'Fibre',
    debit_down: 400,
    debit_up: 400,
    prix_mensuel: 15.99,
    prix_apres_promo: 27.99,
    description: 'Internet Très Haut Débit + Téléphone fixe',
    tv_incluse: false,
    wifi: 'Wi-Fi 6',
    featured: false
  },
  'Lien_FAI_Bbox_Must_FilRouge': {
    nom: 'Bbox Must',
    technologie: 'Fibre',
    debit_down: 1000,
    debit_up: 700,
    prix_mensuel: 15.99,
    prix_apres_promo: 40.99,
    description: 'Internet + TV + Téléphone avec décodeur TV',
    tv_incluse: true,
    nb_decodeurs: 1,
    wifi: 'Wi-Fi 6E',
    extras: '180 chaînes TV',
    featured: true
  },
  'Lien_FAI_Bbox_Ultym': {
    nom: 'Bbox Ultym',
    technologie: 'Fibre',
    debit_down: 2000,
    debit_up: 1000,
    prix_mensuel: 31.99,
    prix_apres_promo: 54.99,
    description: 'Internet Ultra Haut Débit + TV Premium + Netflix',
    tv_incluse: true,
    nb_decodeurs: 2,
    wifi: 'Wi-Fi 7',
    extras: '300 chaînes TV + Netflix Standard',
    featured: true
  },
  'Lien_FAI_5GBox_FilRouge': {
    nom: 'Bbox 5G',
    technologie: '5G',
    debit_down: 1000,
    debit_up: 100,
    prix_mensuel: 34.99,
    prix_apres_promo: 39.99,
    description: 'Box 5G ultra-portable, prête en 2 minutes',
    wifi: 'Wi-Fi 6',
    engagement: 0,
    duree_promo: 6,
    telephone_fixe: false,
    extras: 'Solution sans ligne fixe',
    featured: false
  },
  'Bbox B&You Pure Fibre': {
    nom: 'Bbox B&You Pure Fibre',
    technologie: 'Fibre',
    debit_down: 400,
    debit_up: 400,
    prix_mensuel: 19.99,
    prix_apres_promo: 19.99,
    description: 'Internet fibre sans engagement',
    wifi: 'Wi-Fi 6',
    engagement: 0,
    duree_promo: 0,
    installation: '49€',
    telephone_fixe: false,
    featured: false
  },
  'Lien_FAI_ADSL': {
    nom: 'Bbox ADSL',
    technologie: 'ADSL',
    debit_down: 20,
    debit_up: 1,
    prix_mensuel: 24.99,
    prix_apres_promo: 29.99,
    description: 'Internet ADSL + TV + Téléphone pour zones non fibrées',
    wifi: 'Wi-Fi 6',
    tv_incluse: true,
    nb_decodeurs: 1,
    extras: '180 chaînes TV',
    duree_promo: 6,
    featured: false
  },
  'Lien_FAI_Bbox_TV': {
    nom: 'Bbox TV+',
    technologie: 'Fibre',
    debit_down: 1000,
    debit_up: 700,
    prix_mensuel: 29.99,
    prix_apres_promo: 44.99,
    description: 'Internet + TV enrichie + Téléphone',
    tv_incluse: true,
    nb_decodeurs: 1,
    wifi: 'Wi-Fi 6E',
    extras: '200 chaînes TV + Replay',
    featured: false
  },
  'Lien_FAI_Pro': {
    nom: 'Bbox Pro',
    technologie: 'Fibre',
    debit_down: 2000,
    debit_up: 1000,
    prix_mensuel: 44.99,
    prix_apres_promo: 59.99,
    description: 'Solution professionnelle avec IP fixe',
    wifi: 'Wi-Fi 7',
    tv_incluse: false,
    extras: 'IP fixe + Support prioritaire',
    featured: false,
    engagement: 24
  }
};

// Parser pour les offres spéciales et bundles
function parseSpecialOffer(nomLien: string): BoxConfig | null {
  const nom = nomLien.toLowerCase();
  
  if (nom.includes('smart tv') || nom.includes('smarttv')) {
    return {
      nom: 'Bbox Must + Smart TV Samsung',
      technologie: 'Fibre',
      debit_down: 1000,
      debit_up: 700,
      prix_mensuel: 35.99,
      prix_apres_promo: 60.99,
      wifi: 'Wi-Fi 6E',
      extras: 'Smart TV Samsung 50" offerte',
      engagement: 24,
      tv_incluse: true,
      nb_decodeurs: 1,
      featured: true,
      description: 'Box + TV + Smart TV Samsung 50 pouces incluse'
    };
  } else if (nom.includes('ps5')) {
    return {
      nom: 'Bbox Must + PlayStation 5',
      technologie: 'Fibre',
      debit_down: 1000,
      debit_up: 700,
      prix_mensuel: 55.99,
      prix_apres_promo: 80.99,
      wifi: 'Wi-Fi 6E',
      extras: 'PlayStation 5 incluse',
      engagement: 24,
      tv_incluse: true,
      nb_decodeurs: 1,
      featured: true,
      description: 'Box + TV + PlayStation 5 offerte'
    };
  } else if (nom.includes('xbox')) {
    return {
      nom: 'Bbox Must + Xbox Series S',
      technologie: 'Fibre',
      debit_down: 1000,
      debit_up: 700,
      prix_mensuel: 50.99,
      prix_apres_promo: 75.99,
      wifi: 'Wi-Fi 6E',
      extras: 'Xbox Series S incluse',
      engagement: 24,
      tv_incluse: true,
      nb_decodeurs: 1,
      featured: false,
      description: 'Box + TV + Xbox Series S offerte'
    };
  } else if (nom.includes('ipad')) {
    return {
      nom: 'Bbox Must + iPad',
      technologie: 'Fibre',
      debit_down: 1000,
      debit_up: 700,
      prix_mensuel: 45.99,
      prix_apres_promo: 70.99,
      wifi: 'Wi-Fi 6E',
      extras: 'iPad inclus',
      engagement: 24,
      tv_incluse: true,
      nb_decodeurs: 1,
      featured: false,
      description: 'Box + TV + iPad offert'
    };
  } else if (nom.includes('big') || nom.includes('fam')) {
    return {
      nom: 'Bbox BIG',
      technologie: 'Fibre',
      debit_down: 2000,
      debit_up: 1000,
      prix_mensuel: 49.99,
      prix_apres_promo: 79.99,
      wifi: 'Wi-Fi 7',
      extras: '300 chaînes + Netflix + Prime Video + Forfaits mobiles',
      nb_decodeurs: 3,
      tv_incluse: true,
      featured: true,
      description: 'Offre complète Internet + TV + Mobile famille'
    };
  } else if (nom.includes('forfait') || nom.includes('mobile')) {
    return {
      nom: 'Bbox + Forfait Mobile',
      technologie: 'Fibre',
      debit_down: 1000,
      debit_up: 700,
      prix_mensuel: 39.99,
      prix_apres_promo: 59.99,
      wifi: 'Wi-Fi 6E',
      extras: 'Forfait mobile 100 Go inclus',
      tv_incluse: true,
      nb_decodeurs: 1,
      featured: false,
      description: 'Box internet + Forfait mobile 100 Go'
    };
  }

  return null;
}

// Fonction de transformation avec typage correct
function transformDataToBox(data: CSVData, index: number): Box {
  // Extraire le promo_id
  const promoIdMatch = data.URL_Tracking.match(/promoid=(\d+)/);
  const promo_id = promoIdMatch ? parseInt(promoIdMatch[1]) : index + 1000;

  // Valeurs par défaut complètes
  const defaultBox: Box = {
    id: index + 1,
    promo_id,
    url_tracking: data.URL_Tracking,
    nom: 'Bbox Standard',
    technologie: 'Fibre',
    debit_down: 400,
    debit_up: 400,
    prix_mensuel: 29.99,
    prix_apres_promo: 39.99,
    duree_promo: 12,
    engagement: 12,
    installation: 'Gratuite',
    wifi: 'Wi-Fi 6',
    tv_incluse: false,
    nb_decodeurs: 0,
    telephone_fixe: true,
    extras: '',
    description: 'Offre box internet',
    image_url: '/images/bbox-default.jpg',
    disponible: true,
    featured: false
  };

  // Récupérer la config de base ou spéciale
  const baseConfig = BOX_TYPES[data.Nom_Lien];
  const specialConfig = parseSpecialOffer(data.Nom_Lien);
  
  // Choisir la config appropriée
  const config = baseConfig || specialConfig;

  if (config) {
    return {
      ...defaultBox,
      nom: config.nom,
      technologie: config.technologie,
      debit_down: config.debit_down,
      debit_up: config.debit_up,
      prix_mensuel: config.prix_mensuel,
      prix_apres_promo: config.prix_apres_promo,
      description: config.description,
      wifi: config.wifi,
      duree_promo: config.duree_promo ?? defaultBox.duree_promo,
      engagement: config.engagement ?? defaultBox.engagement,
      installation: config.installation ?? defaultBox.installation,
      tv_incluse: config.tv_incluse ?? defaultBox.tv_incluse,
      nb_decodeurs: config.nb_decodeurs ?? defaultBox.nb_decodeurs,
      telephone_fixe: config.telephone_fixe ?? defaultBox.telephone_fixe,
      extras: config.extras ?? defaultBox.extras,
      featured: config.featured ?? defaultBox.featured,
      image_url: `/images/${config.nom.toLowerCase().replace(/\s+/g, '-')}.jpg`
    };
  }

  // Si aucune config trouvée, retourner avec nom basé sur le lien
  return {
    ...defaultBox,
    nom: data.Nom_Lien.replace(/_/g, ' ').replace('Lien FAI', 'Bbox'),
    description: `Offre ${data.Nom_Lien.replace(/_/g, ' ')}`
  };
}

// Fonction principale
export async function loadRealBoxesFromCSV(): Promise<Box[]> {
  try {
    // Transformer directement les données intégrées
    const boxes = CSV_DATA.map((row, index) => transformDataToBox(row, index));
    
    console.log(`✅ ${boxes.length} box chargées avec succès`);
    
    return boxes;
  } catch (error) {
    console.error('❌ Erreur lors du traitement des données:', error);
    return getFallbackBoxes();
  }
}

// Données de fallback
function getFallbackBoxes(): Box[] {
  return Object.entries(BOX_TYPES).slice(0, 6).map(([key, config], index) => ({
    id: index + 1,
    promo_id: 1000 + index,
    nom: config.nom,
    technologie: config.technologie,
    debit_down: config.debit_down,
    debit_up: config.debit_up,
    prix_mensuel: config.prix_mensuel,
    prix_apres_promo: config.prix_apres_promo,
    duree_promo: config.duree_promo ?? 12,
    engagement: config.engagement ?? 12,
    installation: config.installation ?? 'Gratuite',
    wifi: config.wifi,
    tv_incluse: config.tv_incluse ?? false,
    nb_decodeurs: config.nb_decodeurs ?? 0,
    telephone_fixe: config.telephone_fixe ?? true,
    extras: config.extras ?? '',
    description: config.description,
    image_url: `/images/${config.nom.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    url_tracking: '#',
    disponible: true,
    featured: config.featured ?? false
  }));
}

// Fonctions utilitaires pour le SEO
export async function getBoxCount(): Promise<number> {
  const boxes = await loadRealBoxesFromCSV();
  return boxes.length;
}

export async function getBoxStats(): Promise<{
  count: number;
  minPrice: number;
  maxPrice: number;
  technologies: string[];
  maxSpeed: number;
}> {
  const boxes = await loadRealBoxesFromCSV();
  
  return {
    count: boxes.length,
    minPrice: Math.min(...boxes.map(b => b.prix_mensuel)),
    maxPrice: Math.max(...boxes.map(b => b.prix_mensuel)),
    technologies: [...new Set(boxes.map(b => b.technologie))],
    maxSpeed: Math.max(...boxes.map(b => b.debit_down))
  };
}