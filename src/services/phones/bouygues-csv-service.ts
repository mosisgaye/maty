import Papa from 'papaparse';
import { Phone, FilterOption, PriceRange, PhoneFilters, SortOption } from '@/types/phones';

// Interface pour les données CSV brutes
interface CsvPhoneData {
  product_id_ean: string;
  product_id_store: string;
  product_id_manufacturer?: string;
  trademark: string;
  title: string;
  desc: string;
  full_desc: string;
  url: string;
  other?: string;
  product_images_image_default: string;
  product_images_image_small?: string;
  product_images_image?: string;
  product_images_image_medium?: string;
  product_images_image_large?: string;
  price: number;
  tax_name?: string;
  tax_price?: number;
  shipping_delivery?: string;
  shipping_price?: number;
  category_merchant_name: string;
  category_merchant_id: string;
  storeData_data_prix_barre?: number;
}

// Cache pour éviter de reparser le CSV à chaque appel
let cachedPhones: Phone[] | null = null;
let lastCacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * 🔧 FONCTION DE MAPPING CORRIGÉE - avec IDs uniques
 */
function mapCsvToPhone(csvProduct: CsvPhoneData, index: number): Phone {
  const desc = csvProduct.full_desc || '';
  
  // Expressions régulières pour extraire les données du forfait
  const forfaitMatch = desc.match(/forfait (\d+Go)/i);
  const networkMatch = desc.match(/(4G|5G)/i);
  const phonePriceMatch = desc.match(/(\d+,\d+)€\/mois pendant (\d+) mois/);
  const forfaitPriceMatch = desc.match(/\+(\d+)€\/mois/);
  
  // Extraction stockage et couleur depuis le titre
  const storageMatch = csvProduct.title.match(/(\d+\s?Go)/i);
  const colorMatch = csvProduct.title.match(/(Noir|Blanc|Bleu|Rouge|Vert|Rose|Violet|Gris|Or|Argent|Silver|Gold|Purple|Green|Blue|Black|White)/i);
  
  // Calculs de prix
  const phoneMonthlyCost = phonePriceMatch ? parseFloat(phonePriceMatch[1].replace(',', '.')) : 0;
  const forfaitMonthlyCost = forfaitPriceMatch ? parseFloat(forfaitPriceMatch[1]) : 8;
  const totalMonthlyPrice = phoneMonthlyCost + forfaitMonthlyCost;
  
  // Détection si c'est un produit reconditionné
  const isRefurbished = csvProduct.title.toLowerCase().includes('reconditionné') || 
                       csvProduct.trademark === 'iPhone reconditionné';
  
  // Génération d'un rating basique (simulation)
  const generateRating = (trademark: string, price: number): number => {
    const baseRating = trademark === 'Apple' ? 4.5 : 
                      trademark === 'Samsung' ? 4.3 :
                      trademark === 'Google' ? 4.4 :
                      trademark === 'Xiaomi' ? 4.1 : 4.0;
    
    // Variation légère basée sur le prix
    const priceVariation = (price > 800) ? 0.2 : (price < 300) ? -0.2 : 0;
    return Math.min(5, Math.max(3, baseRating + priceVariation));
  };

  // 🔧 GÉNÉRATION D'ID UNIQUE - Fix pour les doublons
  const generateUniqueId = (): string => {
    // Utiliser EAN + index pour garantir l'unicité
    if (csvProduct.product_id_ean && csvProduct.product_id_ean.toString().trim()) {
      return `ean-${csvProduct.product_id_ean}-${index}`;
    }
    // Fallback avec store ID + index
    if (csvProduct.product_id_store && csvProduct.product_id_store.toString().trim()) {
      return `store-${csvProduct.product_id_store}-${index}`;
    }
    // Dernière option : hash du titre + index
    const titleHash = csvProduct.title ? csvProduct.title.replace(/\s+/g, '').slice(0, 20) : 'unknown';
    return `phone-${titleHash}-${index}-${Date.now()}`;
  };

  // Construction de l'URL d'affiliation propre
  const cleanAffiliateUrl = csvProduct.url?.replace(/hhttps/, 'https') || '';

  // 🔧 CORRECTION: Filtrer les images undefined et typer correctement
  const additionalImages: string[] = [
    csvProduct.product_images_image_small,
    csvProduct.product_images_image_medium,
    csvProduct.product_images_image_large
  ].filter((img): img is string => Boolean(img));

  return {
    id: generateUniqueId(), // 🔧 ID UNIQUE GARANTI
    ean: csvProduct.product_id_ean?.toString() || '',
    title: csvProduct.title?.replace(/\s+/g, ' ').trim() || '',
    trademark: csvProduct.trademark || '',
    description: csvProduct.desc || '',
    fullDescription: csvProduct.full_desc || '',
    price: csvProduct.price || 0,
    originalPrice: csvProduct.storeData_data_prix_barre || csvProduct.price,
    discount: csvProduct.storeData_data_prix_barre && csvProduct.storeData_data_prix_barre > csvProduct.price 
      ? csvProduct.storeData_data_prix_barre - csvProduct.price 
      : undefined,
    image: csvProduct.product_images_image_default || 
           csvProduct.product_images_image_medium || 
           csvProduct.product_images_image || 
           '/placeholder.svg',
    additionalImages: additionalImages, // 🔧 CORRIGÉ: Maintenant c'est string[]
    category: csvProduct.category_merchant_name || 'Téléphones mobiles',
    merchant: 'Bouygues Telecom',
    condition: isRefurbished ? 'refurbished' : 'new',
    operatingSystem: csvProduct.trademark === 'Apple' || csvProduct.trademark === 'iPhone reconditionné' 
      ? 'iOS' 
      : 'Android',
    color: colorMatch ? colorMatch[1] : undefined,
    storage: storageMatch ? storageMatch[1].replace(/\s/g, '') : undefined,
    shipping: 'Livraison gratuite',
    productUrl: cleanAffiliateUrl,
    
    // Propriétés spécifiques Bouygues
    hasForfait: forfaitMatch !== null,
    forfaitData: forfaitMatch ? forfaitMatch[1] : undefined,
    forfaitPrice: forfaitMonthlyCost > 0 ? forfaitMonthlyCost : undefined,
    forfaitDuration: phonePriceMatch ? parseInt(phonePriceMatch[2]) : 24,
    operator: 'Bouygues Telecom',
    network: networkMatch ? (networkMatch[1] as '4G' | '5G') : '5G',
    
    // Affiliation
    isAffiliate: true,
    affiliateUrl: cleanAffiliateUrl,
    affiliateCommission: 3.5, // Commission standard Bouygues
    
    // Engagement et mensualités
    engagementDuration: phonePriceMatch ? parseInt(phonePriceMatch[2]) : 24,
    totalMonthlyPrice: totalMonthlyPrice > 0 ? totalMonthlyPrice : undefined,
    installmentPrice: phoneMonthlyCost > 0 ? phoneMonthlyCost : undefined,
    installmentMonths: phonePriceMatch ? parseInt(phonePriceMatch[2]) : 24,
    
    // Autres propriétés
    rating: generateRating(csvProduct.trademark, csvProduct.price),
    reviewCount: Math.floor(Math.random() * 500) + 10, // Simulation
    inStock: true,
    isEcoFriendly: csvProduct.trademark === 'Fairphone',
    promotion: forfaitMatch ? `Forfait ${forfaitMatch[1]} inclus` : undefined
  };
}

/**
 * 🔧 FONCTION DE CHARGEMENT CORRIGÉE
 */
export async function loadPhonesFromCsv(): Promise<Phone[]> {
  // Vérifier le cache
  const now = Date.now();
  if (cachedPhones && (now - lastCacheTime) < CACHE_DURATION) {
    console.log('✅ Données CSV chargées depuis le cache');
    return cachedPhones;
  }

  try {
    console.log('📡 Chargement du fichier CSV depuis /public/xmlTmp.csv...');
    
    // Charger le fichier CSV
    const response = await fetch('/xmlTmp.csv');
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const csvContent = await response.text();
    console.log(`📄 CSV chargé: ${csvContent.length} caractères`);
    
    // Parser avec Papaparse
    const parsedData = Papa.parse<CsvPhoneData>(csvContent, {
      header: true,
      delimiter: ';',
      dynamicTyping: true,
      skipEmptyLines: true,
      delimitersToGuess: [';', ',', '\t', '|']
    });

    if (parsedData.errors.length > 0) {
      console.warn('⚠️ Erreurs lors du parsing CSV:', parsedData.errors);
    }

    // 🔧 MAPPER AVEC INDEX pour IDs uniques
    const phones = parsedData.data
      .filter(item => item && item.trademark && item.title && item.price > 0)
      .map((item, index) => mapCsvToPhone(item, index)) // 🔧 PASSER L'INDEX
      .filter(phone => phone.id);

    // Mettre en cache
    cachedPhones = phones;
    lastCacheTime = now;

    console.log(`✅ ${phones.length} téléphones chargés et mappés depuis le CSV`);
    
    // 🔧 VÉRIFICATION DES IDs UNIQUES
    const ids = phones.map(p => p.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      console.warn('⚠️ Des IDs dupliqués détectés après correction');
    } else {
      console.log('✅ Tous les IDs sont uniques');
    }
    
    return phones;
    
  } catch (error) {
    console.error('❌ Erreur lors du chargement du CSV:', error);
    
    // Détails d'erreur pour aider au debug
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('💡 Vérifiez que le fichier xmlTmp.csv est bien dans le dossier /public/');
    }
    
    // 🔧 CORRECTION: Gestion correcte du type unknown
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    throw new Error(`Impossible de charger les données des téléphones: ${errorMessage}`);
  }
}

/**
 * Fonction principale pour récupérer les téléphones (remplace les mocks)
 */
export async function fetchPhonesData(): Promise<Phone[]> {
  return await loadPhonesFromCsv();
}

/**
 * Données d'exemple pour le fallback
 */
export function getExamplePhones(): Phone[] {
  return [
    {
      id: 'fallback-1',
      ean: '0000000000000',
      title: 'Erreur de chargement CSV - Vérifiez /public/xmlTmp.csv',
      trademark: 'Bouygues',
      description: 'Le fichier CSV n\'a pas pu être chargé',
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
      productUrl: '',
      additionalImages: [] // 🔧 AJOUTÉ: tableau vide par défaut
    }
  ];
}

/**
 * Invalider le cache (utile pour le développement)
 */
export function invalidateCache(): void {
  cachedPhones = null;
  lastCacheTime = 0;
}