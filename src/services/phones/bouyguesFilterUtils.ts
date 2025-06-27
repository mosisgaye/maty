// 📁 Créer ce fichier : /services/phones/bouyguesFilterUtils.ts

import { Phone, FilterOption } from '@/types/phones';

/**
 * Obtenir les options de forfait disponibles
 */
export function getForfaitOptions(phones: Phone[]): FilterOption[] {
  const forfaitCounts = phones.reduce((acc, phone) => {
    if (phone.forfaitData) {
      acc[phone.forfaitData] = (acc[phone.forfaitData] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(forfaitCounts)
    .map(([forfait, count]) => ({
      id: forfait.toLowerCase().replace('go', ''),
      label: forfait,
      count
    }))
    .sort((a, b) => {
      const aNum = parseInt(a.label);
      const bNum = parseInt(b.label);
      return bNum - aNum; // Décroissant
    });
}

/**
 * Obtenir les opérateurs disponibles
 */
export function getOperators(phones: Phone[]): FilterOption[] {
  const operatorCounts = phones.reduce((acc, phone) => {
    if (phone.operator) {
      acc[phone.operator] = (acc[phone.operator] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(operatorCounts)
    .map(([operator, count]) => ({
      id: operator.toLowerCase().replace(/\s+/g, '-'),
      label: operator,
      count
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Statistiques des forfaits
 */
export function getForfaitStats(phones: Phone[]) {
  const phonesWithForfait = phones.filter(p => p.hasForfait);
  
  const avgForfaitPrice = phonesWithForfait.length > 0 
    ? phonesWithForfait.reduce((sum, p) => sum + (p.forfaitPrice || 0), 0) / phonesWithForfait.length
    : 0;

  return {
    totalWithForfait: phonesWithForfait.length,
    totalWithout: phones.length - phonesWithForfait.length,
    avgForfaitPrice: Math.round(avgForfaitPrice * 100) / 100,
    percentage: Math.round((phonesWithForfait.length / phones.length) * 100)
  };
}

/**
 * Meilleurs deals (prix total le plus avantageux)
 */
export function getBestDeals(phones: Phone[], limit: number = 10): Phone[] {
  return phones
    .filter(p => p.hasForfait && p.totalMonthlyPrice)
    .sort((a, b) => (a.totalMonthlyPrice! + a.price/24) - (b.totalMonthlyPrice! + b.price/24))
    .slice(0, limit);
}