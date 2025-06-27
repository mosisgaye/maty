/**
 * Parser CSV pour TimeOne - Version MULTI-OPÉRATEURS CORRIGÉE
 * Support : Bouygues/B&YOU, SFR/Youprice, Auchan Télécom, ET TOUS LES AUTRES
 */

import { TimeOneMobilePlan } from '@/types/mobile';

/**
 * Interface pour les données CSV brutes
 */
interface CsvMobileOffer {
  Programme_ID: string;
  Programme_Nom: string;
  Description: string;
  URL_Tracking: string;
  Code_HTML: string;
  Promo_ID: string;
}

/**
 * Configuration des opérateurs supportés - ÉLARGIE
 */
const OPERATORS_CONFIG = {
  bouygues: {
    programIds: ['5334'], // Bouygues Telecom
    programNames: ['Bouygues'],
    name: 'Bouygues Telecom',
    patterns: [
      /B&You?\s+Forfait\s+(\d+)Go(?:_5G)?/i,
      /forfait.*(\d+)\s*Go/i,
      /(\d+)\s*Go/i,
    ],
  },
  youprice: {
    programIds: [''], // ID vide
    programNames: ['Youprice', 'YouPrice'],
    name: 'Youprice',
    patterns: [
      /(\d+)Go.*5G.*(\d+[,.]?\d*)\s*€/i,
      /(\d+[,.]?\d*)\s*€.*(\d+)Go/i,
      /forfait.*(\d+)Go.*(\d+[,.]?\d*)\s*€/i,
      /(\d+)\s*Go/i,
    ],
  },
  sfr: {
    programIds: [], // À définir selon le CSV
    programNames: ['SFR', 'RED'],
    name: 'SFR',
    patterns: [
      /(\d+)\s*Go/i,
      /forfait.*(\d+)Go/i,
    ],
  },
  auchan: {
    programIds: [], // À définir selon le CSV
    programNames: ['Auchan'],
    name: 'Auchan Télécom',
    patterns: [
      /(\d+)\s*Go/i,
    ],
  }
};

/**
 * Mapping des prix par défaut (pour offres sans prix explicite)
 */
const DEFAULT_PRICES: Record<string, string> = {
  '1Go': '4.99', '2Go': '1.99', '5Go': '7.99', '14Go': '7.99', '16Go': '10.99',
  '20Go': '9.99', '40Go': '12.99', '50Go': '4.99', '100Go': '6.99', 
  '130Go': '19.99', '200Go': '7.99', '300Go': '9.99',
};

/**
 * Mapping des commissions 
 */
const COMMISSION_MAPPING: Record<string, number> = {
  '1Go': 15, '2Go': 10, '5Go': 15, '14Go': 20, '16Go': 25,
  '20Go': 25, '40Go': 30, '50Go': 15, '100Go': 45, 
  '130Go': 45, '200Go': 60, '300Go': 60,
};

/**
 * Parse le CSV et extrait TOUTES les offres mobiles (pas seulement Bouygues)
 */
export function parseBouyguesXML(csvContent: string): TimeOneMobilePlan[] {
  try {
    console.log('[MultiParser] 🚀 Parsing CSV optimisé');
    
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV vide ou invalide');
    }
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    console.log('[MultiParser] Headers:', headers.length);
    
    // 🚀 Parsing optimisé avec validation rapide
    const csvData: CsvMobileOffer[] = [];
    const startTime = performance.now();
    
    for (let i = 1; i < Math.min(lines.length, 200); i++) { // Limite pour performance
      const line = lines[i].trim();
      if (!line || line.length < 10) continue;
      
      const values = parseCSVLine(line);
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        // Validation rapide des données essentielles
        if (row.Description && row.URL_Tracking) {
          csvData.push(row as CsvMobileOffer);
        }
      }
    }
    
    const parseTime = Math.round(performance.now() - startTime);
    console.log('[MultiParser] ✓ Parsed:', csvData.length, 'rows in', parseTime + 'ms');
    
    // 🚀 Extraction optimisée des opérateurs
    const extractStart = performance.now();
    const allOffers: TimeOneMobilePlan[] = [];
    
    // Extraction en parallèle pour performance
    const [bouyguesOffers, youpriceOffers, otherOffers] = [
      extractBouyguesOffers(csvData),
      extractYoupriceOffers(csvData),
      extractOtherOffers(csvData)
    ];
    
    allOffers.push(...bouyguesOffers, ...youpriceOffers, ...otherOffers);
    
    const extractTime = Math.round(performance.now() - extractStart);
    console.log('[MultiParser] ✓ Extracted:', {
      bouygues: bouyguesOffers.length,
      youprice: youpriceOffers.length,
      others: otherOffers.length,
      total: allOffers.length,
      time: extractTime + 'ms'
    });
    
    // 🚀 Tri optimisé avec cache des valeurs numériques
    const sortStart = performance.now();
    allOffers.sort((a, b) => {
      const commissionDiff = b.commission - a.commission;
      if (commissionDiff !== 0) return commissionDiff;
      return parseFloat(a.price) - parseFloat(b.price);
    });
    
    const sortTime = Math.round(performance.now() - sortStart);
    const totalTime = Math.round(performance.now() - startTime);
    
    console.log('[MultiParser] ✓ Final:', {
      offers: allOffers.length,
      operators: [...new Set(allOffers.map(o => o.operator))].length,
      sortTime: sortTime + 'ms',
      totalTime: totalTime + 'ms'
    });
    
    return allOffers.slice(0, 100); // Limite pour performance
    
  } catch (error) {
    console.error('[MultiParser] Erreur lors du parsing:', error);
    throw new Error(`Échec du parsing CSV: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

/**
 * Extrait les offres Bouygues / B&YOU (existant)
 */
function extractBouyguesOffers(csvData: CsvMobileOffer[]): TimeOneMobilePlan[] {
  const offers: TimeOneMobilePlan[] = [];
  let idCounter = 1000;
  
  // 🚀 Filtre optimisé avec limite
  const bouyguesData = csvData
    .filter(row => row.Programme_ID === '5334')
    .slice(0, 20); // Limite pour performance
  
  bouyguesData.forEach(row => {
    const description = row.Description || '';
    const trackingUrl = row.URL_Tracking || '';
    const promoId = row.Promo_ID || '';
    
    const volume = extractDataVolume(description, OPERATORS_CONFIG.bouygues.patterns);
    if (!volume || !promoId || !trackingUrl) return;
    
    const isByou = /B&You/i.test(description);
    const isEngagement = /engagement/i.test(description);
    const isSpecial = /remise|promotion|-\d+€/i.test(description);
    const networkType = detectNetworkType(description);
    
    let offerName = isByou ? `B&YOU ${volume}` : `Bouygues ${volume}`;
    if (networkType === '5G') offerName += ' 5G';
    if (isSpecial) offerName += ' Promo';
    
    const price = extractPriceFromDescription(description) || DEFAULT_PRICES[volume] || '19.99';
    const commission = COMMISSION_MAPPING[volume] || (isByou ? 15 : 10);
    
    const offer: TimeOneMobilePlan = {
      id: idCounter++,
      name: offerName,
      operator: 'Bouygues Telecom',
      data: volume,
      price: price,
      coverage: 'France métropolitaine',
      features: generateBouyguesFeatures(volume, networkType, isByou, isEngagement),
      affiliate_url: trackingUrl,
      promoid: promoId,
      commission,
      trackingUrl,
      commissionLevel: `Niveau ${getCommissionLevel(commission)}`,
      source: 'timeone',
      isRecommended: commission >= 45,
      isSpecialOffer: isSpecial,
      networkType,
    };
    
    offers.push(offer);
  });
  
  return offers;
}

/**
 * Extrait les offres Youprice / SFR (existant)
 */
function extractYoupriceOffers(csvData: CsvMobileOffer[]): TimeOneMobilePlan[] {
  const offers: TimeOneMobilePlan[] = [];
  let idCounter = 2000;
  
  // 🚀 Filtre optimisé avec limite
  const youpriceData = csvData
    .filter(row => 
      (row.Programme_ID === '' || row.Programme_ID === '0') && 
      row.Programme_Nom.toLowerCase().includes('youprice')
    )
    .slice(0, 15);
  
  youpriceData.forEach(row => {
    const description = row.Description || '';
    const trackingUrl = row.URL_Tracking || '';
    const promoId = row.Promo_ID || '';
    
    if (description.includes('Forfaits SE') || !trackingUrl) return;
    
    const volume = extractDataVolume(description, OPERATORS_CONFIG.youprice.patterns);
    const price = extractPriceFromDescription(description);
    
    if (!volume || !price) return;
    
    const isSFR = /SFR/i.test(description);
    const isAuchan = /Auchan/i.test(description);
    const networkType = detectNetworkType(description);
    
    let operatorName = 'Youprice';
    if (isSFR) operatorName = 'SFR';
    if (isAuchan) operatorName = 'Auchan Télécom';
    
    let offerName = `${volume}`;
    if (description.includes('Le Turbo')) offerName = `Le Turbo ${volume}`;
    if (description.includes('Le Zénith')) offerName = `Le Zénith ${volume}`;
    if (networkType === '5G') offerName += ' 5G';
    
    const offer: TimeOneMobilePlan = {
      id: idCounter++,
      name: offerName,
      operator: operatorName,
      data: volume,
      price: price,
      coverage: 'France métropolitaine',
      features: generateYoupriceFeatures(volume, networkType, isSFR),
      affiliate_url: trackingUrl,
      promoid: promoId,
      commission: COMMISSION_MAPPING[volume] || 10,
      trackingUrl,
      commissionLevel: `Niveau 0`,
      source: 'timeone',
      isRecommended: false,
      isSpecialOffer: description.includes('sans engagement'),
      networkType,
    };
    
    offers.push(offer);
  });
  
  return offers;
}

/**
 * NOUVELLE FONCTION: Extrait toutes les autres offres (Orange, Free, etc.)
 */
function extractOtherOffers(csvData: CsvMobileOffer[]): TimeOneMobilePlan[] {
  const offers: TimeOneMobilePlan[] = [];
  let idCounter = 3000;
  
  // 🚀 Filtre optimisé avec limite
  const otherData = csvData
    .filter(row => 
      row.Programme_ID !== '5334' && 
      !row.Programme_Nom.toLowerCase().includes('youprice') && 
      row.Description && 
      row.URL_Tracking &&
      row.Description.length > 15
    )
    .slice(0, 10); // Limite stricte pour performance
  
  otherData.forEach(row => {
    const description = row.Description || '';
    const trackingUrl = row.URL_Tracking || '';
    const promoId = row.Promo_ID || '';
    const programName = row.Programme_Nom || 'Inconnu';
    
    // Détecter l'opérateur à partir du nom du programme ou de la description
    let operatorName = 'Autre opérateur';
    let operatorShort = programName;
    
    // Mappings spécifiques
    if (programName.toLowerCase().includes('orange') || description.toLowerCase().includes('orange')) {
      operatorName = 'Orange';
      operatorShort = 'Orange';
    } else if (programName.toLowerCase().includes('free') || description.toLowerCase().includes('free')) {
      operatorName = 'Free';
      operatorShort = 'Free';
    } else if (programName.toLowerCase().includes('sfr') || description.toLowerCase().includes('sfr')) {
      operatorName = 'SFR';
      operatorShort = 'SFR';
    } else if (programName.toLowerCase().includes('sosh') || description.toLowerCase().includes('sosh')) {
      operatorName = 'Sosh';
      operatorShort = 'Sosh';
    } else if (programName.toLowerCase().includes('red') || description.toLowerCase().includes('red')) {
      operatorName = 'RED by SFR';
      operatorShort = 'RED';
    } else {
      // Utiliser le nom du programme comme opérateur
      operatorName = programName;
      operatorShort = programName.split(' ')[0];
    }
    
    // Extraire volume de données
    const volume = extractDataVolume(description, [/(\d+)\s*Go/gi]) || 
                   extractDataVolumeGeneric(description);
    
    // Extraire prix
    const price = extractPriceFromDescription(description) || 
                  estimatePriceFromDescription(description);
    
    if (!volume || !price || !trackingUrl) {
      console.log('[MultiParser] Offre rejetée:', { description, volume, price, trackingUrl: !!trackingUrl });
      return;
    }
    
    const networkType = detectNetworkType(description);
    const isSpecial = /promo|offre|special|reduction/i.test(description);
    
    // Générer le nom de l'offre
    let offerName = `${operatorShort} ${volume}`;
    if (networkType === '5G') offerName += ' 5G';
    if (isSpecial) offerName += ' Promo';
    
    const commission = COMMISSION_MAPPING[volume] || 
                      estimateCommission(parseFloat(price), parseInt(volume));
    
    const offer: TimeOneMobilePlan = {
      id: idCounter++,
      name: offerName,
      operator: operatorName,
      data: volume,
      price: price,
      coverage: 'France métropolitaine',
      features: generateGenericFeatures(volume, networkType, operatorName),
      affiliate_url: trackingUrl,
      promoid: promoId,
      commission,
      trackingUrl,
      commissionLevel: `Niveau ${getCommissionLevel(commission)}`,
      source: 'timeone',
      isRecommended: commission >= 30,
      isSpecialOffer: isSpecial,
      networkType,
    };
    
    offers.push(offer);
    console.log('[MultiParser] Offre ajoutée:', offerName, operatorName, volume, price);
  });
  
  return offers;
}

/**
 * NOUVELLES FONCTIONS UTILITAIRES
 */

// Extraction générique de volume de données
function extractDataVolumeGeneric(description: string): string | null {
  // Patterns plus flexibles
  const patterns = [
    /(\d+)\s*Go/gi,
    /(\d+)\s*GB/gi,
    /(\d+)\s*giga/gi,
    /illimité/gi,
    /unlimited/gi
  ];
  
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match) {
      if (match[0].toLowerCase().includes('illimité') || match[0].toLowerCase().includes('unlimited')) {
        return '300Go'; // Considéré comme illimité
      }
      return `${match[1]}Go`;
    }
  }
  
  return null;
}

// Estimation de prix depuis la description
function estimatePriceFromDescription(description: string): string | null {
  // Patterns de prix plus flexibles
  const patterns = [
    /(\d+[,.]?\d*)\s*€/g,
    /(\d+[,.]?\d*)\s*euros?/gi,
    /€\s*(\d+[,.]?\d*)/g,
    /prix[\s:]*(\d+[,.]?\d*)/gi
  ];
  
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      const price = parseFloat(match[1].replace(',', '.'));
      if (price > 0 && price < 100) { // Prix raisonnable
        return price.toFixed(2);
      }
    }
  }
  
  return null;
}

// Estimation de commission basée sur prix et data
function estimateCommission(price: number, dataAmount: number): number {
  let commission = Math.max(5, Math.min(60, price * 1.5)); // Base sur le prix
  
  // Bonus pour grosse data
  if (dataAmount >= 100) commission += 10;
  if (dataAmount >= 200) commission += 10;
  
  return Math.round(commission);
}

// Génération de features génériques
function generateGenericFeatures(volume: string, networkType: '4G' | '5G', operator: string): string[] {
  const features = [
    'Appels illimités en France',
    'SMS/MMS illimités en France',
    `${volume} en France`,
    `Réseau ${networkType}`,
    'Sans engagement'
  ];
  
  const volumeNum = parseInt(volume);
  let europeData = Math.floor(volumeNum * 0.1);
  if (europeData < 2) europeData = 2;
  if (europeData > 20) europeData = 20;
  features.push(`${europeData}Go en Europe`);
  
  if (operator !== 'Autre opérateur') {
    features.push(`Réseau ${operator}`);
  }
  
  return features;
}

/**
 * FONCTIONS UTILITAIRES EXISTANTES (inchangées)
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"/, '').replace(/"$/, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"/, '').replace(/"$/, ''));
  return result;
}

function extractDataVolume(description: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      return `${match[1]}Go`;
    }
  }
  
  const genericMatch = description.match(/(\d+)\s*Go/i);
  if (genericMatch) {
    return `${genericMatch[1]}Go`;
  }
  
  return null;
}

function extractPriceFromDescription(description: string): string | null {
  const priceMatch = description.match(/(\d+[,.]?\d*)\s*€/);
  if (priceMatch) {
    return priceMatch[1].replace(',', '.');
  }
  return null;
}

function detectNetworkType(description: string): '4G' | '5G' {
  return /5G/i.test(description) ? '5G' : '4G';
}

function generateBouyguesFeatures(volume: string, networkType: '4G' | '5G', isByou: boolean, isEngagement: boolean): string[] {
  const features = [
    'Appels illimités en France',
    'SMS/MMS illimités en France',
    `${volume} en France`,
    `Réseau ${networkType}`,
  ];
  
  if (isByou) {
    features.push('Sans engagement');
  } else if (isEngagement) {
    features.push('Avec engagement');
  }
  
  const volumeNum = parseInt(volume);
  let europeData = Math.floor(volumeNum * 0.15);
  if (europeData < 3) europeData = 3;
  if (europeData > 25) europeData = 25;
  features.push(`${europeData}Go en Europe`);
  
  return features;
}

function generateYoupriceFeatures(volume: string, networkType: '4G' | '5G', isSFR: boolean): string[] {
  const features = [
    'Appels illimités en France',
    'SMS/MMS illimités en France',
    `${volume} en France`,
    'Sans engagement',
    `Réseau ${networkType}`,
  ];
  
  if (isSFR) {
    features.push('Réseau SFR');
  }
  
  const volumeNum = parseInt(volume);
  let europeData = Math.floor(volumeNum * 0.1);
  if (europeData < 2) europeData = 2;
  if (europeData > 20) europeData = 20;
  features.push(`${europeData}Go en Europe`);
  
  return features;
}

function getCommissionLevel(commission: number): number {
  if (commission >= 60) return 5;
  if (commission >= 45) return 4;
  if (commission >= 35) return 3;
  if (commission >= 30) return 2;
  if (commission >= 25) return 1;
  return 0;
}

export function validateBouyguesOffer(offer: TimeOneMobilePlan): boolean {
  const required = [
    offer.id,
    offer.name,
    offer.operator,
    offer.data,
    offer.price,
    offer.promoid,
    offer.trackingUrl,
    offer.source === 'timeone'
  ];
  
  return required.every(field => !!field);
}

export function getParsingStats(offers: TimeOneMobilePlan[]) {
  const stats = {
    total: offers.length,
    byOperator: {} as Record<string, number>,
    byNetwork: { '4G': 0, '5G': 0 } as Record<'4G' | '5G', number>,
    byCommission: {} as Record<number, number>,
    specialOffers: offers.filter(o => o.isSpecialOffer).length,
    recommended: offers.filter(o => o.isRecommended).length,
    averageCommission: 0,
    totalPotentialCommission: 0,
  };
  
  offers.forEach(offer => {
    stats.byOperator[offer.operator] = (stats.byOperator[offer.operator] || 0) + 1;
    
    if (offer.networkType) {
      stats.byNetwork[offer.networkType]++;
    }
    
    stats.byCommission[offer.commission] = (stats.byCommission[offer.commission] || 0) + 1;
    stats.totalPotentialCommission += offer.commission;
  });
  
  stats.averageCommission = offers.length > 0 
    ? offers.reduce((sum, o) => sum + o.commission, 0) / offers.length 
    : 0;
  
  return stats;
}

export default {
  parseBouyguesXML,
  validateBouyguesOffer,
  getParsingStats,
};