// app/telephones/lib/phone-data.ts
import { Phone } from '@/types/phones';
import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';
import { cache } from 'react';

// Interface pour les données CSV brutes (copié depuis bouygues-csv-service.ts)
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

/**
 * Fonction de mapping (identique à bouygues-csv-service.ts)
 * On la duplique ici pour le serveur
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
    
    const priceVariation = (price > 800) ? 0.2 : (price < 300) ? -0.2 : 0;
    return Math.min(5, Math.max(3, baseRating + priceVariation));
  };

  // Génération d'ID unique
  const generateUniqueId = (): string => {
    if (csvProduct.product_id_ean && csvProduct.product_id_ean.toString().trim()) {
      return `ean-${csvProduct.product_id_ean}-${index}`;
    }
    if (csvProduct.product_id_store && csvProduct.product_id_store.toString().trim()) {
      return `store-${csvProduct.product_id_store}-${index}`;
    }
    const titleHash = csvProduct.title ? csvProduct.title.replace(/\s+/g, '').slice(0, 20) : 'unknown';
    return `phone-${titleHash}-${index}-${Date.now()}`;
  };

  // Construction de l'URL d'affiliation propre
  const cleanAffiliateUrl = csvProduct.url?.replace(/hhttps/, 'https') || '';

  return {
    id: generateUniqueId(),
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
    additionalImages: [
      csvProduct.product_images_image_small,
      csvProduct.product_images_image_medium,
      csvProduct.product_images_image_large
    ].filter((image): image is string => typeof image === 'string'),
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
    affiliateCommission: 3.5,
    
    // Engagement et mensualités
    engagementDuration: phonePriceMatch ? parseInt(phonePriceMatch[2]) : 24,
    totalMonthlyPrice: totalMonthlyPrice > 0 ? totalMonthlyPrice : undefined,
    installmentPrice: phoneMonthlyCost > 0 ? phoneMonthlyCost : undefined,
    installmentMonths: phonePriceMatch ? parseInt(phonePriceMatch[2]) : 24,
    
    // Autres propriétés
    rating: generateRating(csvProduct.trademark, csvProduct.price),
    reviewCount: Math.floor(Math.random() * 500) + 10,
    inStock: true,
    isEcoFriendly: csvProduct.trademark === 'Fairphone',
    promotion: forfaitMatch ? `Forfait ${forfaitMatch[1]} inclus` : undefined
  };
}

/**
 * Charge les téléphones depuis le CSV côté serveur
 * Utilise le cache React pour optimiser les performances
 */
export const loadPhonesFromServer = cache(async (): Promise<Phone[]> => {
  try {
    console.log('🚀 Chargement serveur du CSV...');
    
    // Chemin vers le fichier CSV dans public
    const csvPath = path.join(process.cwd(), 'public', 'xmlTmp.csv');
    
    // Lire le fichier
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    
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

    // Mapper les données
    const phones = parsedData.data
      .filter(item => item && item.trademark && item.title && item.price > 0)
      .map((item, index) => mapCsvToPhone(item, index))
      .filter(phone => phone.id);

    console.log(`✅ ${phones.length} téléphones chargés côté serveur`);
    
    return phones;
    
  } catch (error) {
    console.error('❌ Erreur chargement serveur:', error);
    throw new Error(`Impossible de charger les données: ${error}`);
  }
});

/**
 * Revalide les données toutes les 24h
 * Next.js 14 avec ISR
 */
export const revalidate = 86400; // 24 heures en secondes