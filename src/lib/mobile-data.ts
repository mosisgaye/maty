//lib/mobile-data.ts
import { UnifiedMobilePlan, TimeOneMobilePlan } from '@/types/mobile';
import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';
import { cache } from 'react';

// Interface pour les données CSV brutes
interface CsvMobileData {
  Programme_ID: string;
  Programme_Nom: string;
  Description: string;
  URL_Tracking: string;
  Code_HTML: string;
  Promo_ID: string;
}

// Données de commission par opérateur (estimation basée sur l'industrie)
const COMMISSION_RATES: Record<string, number> = {
  'Bouygues Telecom': 45,
  'Youprice': 35,
  'NRJ Mobile': 30,
  'Auchan Telecom': 25,
  'Lycamobile FR': 20,
  'default': 25
};

// Mapping des réseaux pour Youprice
const YOUPRICE_NETWORKS: Record<string, string> = {
  'Orange': 'Orange',
  'SFR': 'SFR',
  'Bouygues': 'Bouygues Telecom'
};

/**
 * Parse une description de forfait pour extraire les informations
 */
function parseDescription(description: string, operator: string): {
  name: string;
  data: string;
  price: string;
  features: string[];
  networkType: '4G' | '5G';
  realOperator?: string;
} {
  // Nettoyer la description
  const cleanDesc = description.replace(/\s+/g, ' ').trim();
  
  // Patterns de regex pour extraire les infos
  const dataPattern = /(\d+)\s*(Go|GB|go|gb)/i;
  const pricePattern = /(\d+[,.]?\d*)\s*€/;
  const networkPattern = /(4G|5G)/i;
  
  // Extraction des données
  const dataMatch = cleanDesc.match(dataPattern);
  const priceMatch = cleanDesc.match(pricePattern);
  const networkMatch = cleanDesc.match(networkPattern);
  
  // Volume de données
  const data = dataMatch ? `${dataMatch[1]}Go` : '0Go';
  
  // Prix
  const price = priceMatch ? priceMatch[1].replace(',', '.') : '0';
  
  // Type de réseau
  const networkType = networkMatch && networkMatch[1] === '5G' ? '5G' : '4G';
  
  // Nom du forfait selon l'opérateur
  let name = '';
  let realOperator = operator;
  let features: string[] = [];
  
  switch (operator) {
    case 'Bouygues Telecom':
      // Format : "B&You Forfait 100Go_5G"
      if (cleanDesc.includes('B&You')) {
        name = cleanDesc.replace(/_5G/i, '').trim();
      } else if (cleanDesc.includes('engagement')) {
        name = 'Forfait Bouygues avec engagement';
      } else if (cleanDesc.includes('remise')) {
        name = `Promo Bouygues ${data}`;
      } else {
        name = cleanDesc;
      }
      features = [
        'Appels illimités en France',
        'SMS/MMS illimités',
        'Sans engagement',
        `Internet ${data} en ${networkType}`
      ];
      break;
      
    case 'Youprice':
      // Format : "Le Start :4,99€ Orange"
      const youpriceMatch = cleanDesc.match(/^([^:]+)\s*:?\s*(\d+[,.]?\d*)\s*€\s*(\w+)/);
      if (youpriceMatch) {
        name = youpriceMatch[1].trim();
        realOperator = YOUPRICE_NETWORKS[youpriceMatch[3]] || youpriceMatch[3];
      } else {
        name = cleanDesc.split(':')[0].trim();
      }
      
      // Extraction des features pour Youprice
      features = [
        'Appels illimités en France',
        'SMS/MMS illimités',
        'Sans engagement'
      ];
      
      if (cleanDesc.includes('UE/DOM')) {
        const roamingMatch = cleanDesc.match(/(\d+)Go en UE\/DOM/i);
        if (roamingMatch) {
          features.push(`${roamingMatch[1]}Go en Europe/DOM`);
        }
      }
      
      if (networkType === '5G') {
        features.push('5G incluse');
      }
      
      features.push(`Internet ${data} en ${networkType}`);
      break;
      
    case 'NRJ Mobile':
    case 'Auchan Telecom':
      // Format : "Forfait sans engagement 200Go 5G à 7,99€"
      const parts = cleanDesc.split('à');
      name = parts[0].trim();
      
      features = [
        'Appels illimités en France',
        'SMS/MMS illimités',
        'Sans engagement',
        `Internet ${data} en ${networkType}`
      ];
      
      if (networkType === '5G') {
        features.push('5G incluse');
      }
      break;
      
    case 'Lycamobile FR':
      // Format complexe multiligne
      name = `Lycamobile ${data}`;
      
      // Parser les features depuis la description
      features = [];
      
      if (cleanDesc.includes('Unlimited national minutes') || cleanDesc.includes('Appels nationaux ILLIMITÉS')) {
        features.push('Appels illimités en France');
      }
      
      if (cleanDesc.includes('Unlimited national SMS') || cleanDesc.includes('SMS nationaux ILLIMITÉS')) {
        features.push('SMS illimités');
      }
      
      if (cleanDesc.includes('International')) {
        features.push('Appels internationaux inclus');
      }
      
      if (cleanDesc.includes('eSIM')) {
        features.push('eSIM disponible');
      }
      
      const roamingMatch = cleanDesc.match(/(\d+\.?\d*)\s*G[Bo]?\s*(EU\s*)?[Rr]oaming/i);
      if (roamingMatch) {
        features.push(`${roamingMatch[1]}Go en Europe`);
      }
      
      if (cleanDesc.includes('24 Month') || cleanDesc.includes('24 mois')) {
        features.push('Engagement 24 mois');
      } else {
        features.push('Sans engagement');
      }
      
      features.push(`Internet ${data}`);
      break;
      
    default:
      name = cleanDesc.substring(0, 50) + (cleanDesc.length > 50 ? '...' : '');
      features = ['Détails sur le site'];
  }
  
  return {
    name,
    data,
    price,
    features,
    networkType,
    realOperator: realOperator !== operator ? realOperator : undefined
  };
}

/**
 * Mappe une ligne CSV vers TimeOneMobilePlan
 */
function mapCsvToMobilePlan(csvRow: CsvMobileData, index: number): TimeOneMobilePlan | null {
  // Ignorer les lignes sans données essentielles
  if (!csvRow.Programme_Nom || !csvRow.Description || !csvRow.URL_Tracking) {
    return null;
  }
  
  const operator = csvRow.Programme_Nom;
  const parsed = parseDescription(csvRow.Description, operator);
  
  // Créer l'objet TimeOneMobilePlan
  const plan: TimeOneMobilePlan = {
    // Propriétés de base MobilePlan
    id: csvRow.Promo_ID ? parseInt(csvRow.Promo_ID) : 900000 + index,
    name: parsed.name,
    operator: parsed.realOperator || operator,
    data: parsed.data,
    price: parsed.price,
    coverage: 'France métropolitaine',
    features: parsed.features,
    affiliate_url: csvRow.URL_Tracking,
    
    // Propriétés spécifiques TimeOne
    promoid: csvRow.Promo_ID || `${csvRow.Programme_ID}-${index}`,
    commission: COMMISSION_RATES[operator] || COMMISSION_RATES.default,
    trackingUrl: csvRow.URL_Tracking,
    commissionLevel: getCommissionLevel(COMMISSION_RATES[operator] || COMMISSION_RATES.default),
    source: 'timeone' as const,
    
    // Métadonnées
    isRecommended: isRecommendedOffer(parsed.price, parsed.data, operator),
    isSpecialOffer: csvRow.Description.toLowerCase().includes('offre') || 
                    csvRow.Description.toLowerCase().includes('promo') ||
                    csvRow.Description.toLowerCase().includes('special'),
    networkType: parsed.networkType
  };
  
  return plan;
}

/**
 * Détermine le niveau de commission
 */
function getCommissionLevel(commission: number): string {
  if (commission >= 40) return 'Niveau 5';
  if (commission >= 35) return 'Niveau 4';
  if (commission >= 30) return 'Niveau 3';
  if (commission >= 25) return 'Niveau 2';
  if (commission >= 20) return 'Niveau 1';
  return 'Niveau 0';
}

/**
 * Détermine si une offre est recommandée
 */
function isRecommendedOffer(price: string, data: string, operator: string): boolean {
  const priceNum = parseFloat(price);
  const dataNum = parseInt(data);
  
  // Critères de recommandation
  if (operator === 'Bouygues Telecom' && dataNum >= 100 && priceNum <= 15) return true;
  if (operator === 'Youprice' && priceNum < 10 && dataNum >= 100) return true;
  if (operator === 'NRJ Mobile' && dataNum >= 200 && priceNum < 10) return true;
  if (dataNum >= 100 && priceNum < 8) return true; // Super deal
  
  return false;
}

/**
 * Charge les forfaits mobiles depuis le CSV côté serveur
 * Utilise le cache React pour optimiser les performances
 */
export const loadMobilePlansFromServer = cache(async (): Promise<TimeOneMobilePlan[]> => {
  try {
    console.log('🚀 Chargement serveur du CSV forfaits mobiles...');
    
    // Chemin vers le fichier CSV dans public
    const csvPath = path.join(process.cwd(), 'public', 'lien.csv');
    
    // Lire le fichier
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    
    // Parser avec Papaparse
    const parsedData = Papa.parse<CsvMobileData>(csvContent, {
      header: true,
      delimiter: ',',
      skipEmptyLines: true
    });

    if (parsedData.errors.length > 0) {
      console.warn('⚠️ Erreurs lors du parsing CSV:', parsedData.errors);
    }

    // Mapper les données et filtrer les nulls
    const plans = parsedData.data
      .map((row, index) => mapCsvToMobilePlan(row, index))
      .filter((plan): plan is TimeOneMobilePlan => plan !== null);

    // Trier par commission décroissante puis par prix croissant
    plans.sort((a, b) => {
      if (b.commission !== a.commission) {
        return b.commission - a.commission;
      }
      return parseFloat(a.price) - parseFloat(b.price);
    });

    console.log(`✅ ${plans.length} forfaits mobiles chargés côté serveur`);
    
    // Stats pour debug
    const stats = {
      total: plans.length,
      byOperator: plans.reduce((acc, plan) => {
        acc[plan.operator] = (acc[plan.operator] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      with5G: plans.filter(p => p.networkType === '5G').length,
      recommended: plans.filter(p => p.isRecommended).length
    };
    
    console.log('📊 Stats forfaits:', stats);
    
    return plans;
    
  } catch (error) {
    console.error('❌ Erreur chargement serveur:', error);
    throw new Error(`Impossible de charger les forfaits: ${error}`);
  }
});

/**
 * Revalide les données toutes les 24h
 * Next.js 14 avec ISR
 */
export const revalidate = 86400; // 24 heures en secondes