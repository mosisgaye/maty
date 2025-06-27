/**
 * Service API pour TimeOne - VERSION CSV
 * Lit les offres depuis /public/lien.csv au lieu de l'API XML
 */

// Cache simple en mémoire
interface CacheEntry {
  data: string;
  timestamp: number;
}

class TimeOneCache {
  private cache = new Map<string, CacheEntry>();

  set(key: string, data: string): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Cache 30 minutes
    if (Date.now() - entry.timestamp > 30 * 60 * 1000) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new TimeOneCache();

export interface TimeOneApiResponse {
  success: boolean;
  data?: string;
  error?: string;
  cached?: boolean;
}

export interface FetchOptions {
  forceRefresh?: boolean;
  timeout?: number;
}

/**
 * Lit le CSV depuis /public/lien.csv
 */
export async function fetchBouyguesXML(options: FetchOptions = {}): Promise<TimeOneApiResponse> {
  const { forceRefresh = false, timeout = 10000 } = options;
  const cacheKey = 'bouygues-csv';
  
  try {
    // 🚀 Vérifier le cache pour performance
    if (!forceRefresh) {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log('[TimeOne CSV] ✓ Cache hit');
        return {
          success: true,
          data: cachedData,
          cached: true,
        };
      }
    }
    
    console.log('[TimeOne CSV] 📥 Fetch /lien.csv');
    
    // 🚀 Fetch optimisé avec timeout et signal
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch('/lien.csv', {
      signal: controller.signal,
      cache: forceRefresh ? 'no-cache' : 'default',
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const csvData = await response.text();
    
    // 🚀 Validation rapide
    if (!csvData || csvData.length < 100) {
      throw new Error('CSV trop petit ou vide');
    }
    
    if (!csvData.includes('Programme_ID') && !csvData.includes('Description')) {
      throw new Error('Format CSV invalide');
    }
    
    // 🚀 Cache avec compression basique
    cache.set(cacheKey, csvData);
    
    console.log('[TimeOne CSV] ✓ Loaded:', Math.round(csvData.length/1024) + 'KB');
    
    return {
      success: true,
      data: csvData,
      cached: false,
    };
    
  } catch (error) {
    console.error('[TimeOne CSV] ❌ Error:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: 'Timeout: CSV loading too slow',
      };
    }
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        errorMessage = 'CSV file not found in /public/';
      } else if (error.message.includes('CSV')) {
        errorMessage = error.message;
      } else {
        errorMessage = `Loading error: ${error.message}`;
      }
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function getBouyguesOffers(options: FetchOptions = {}): Promise<TimeOneApiResponse> {
  console.log('[TimeOne CSV] Récupération des offres multi-opérateurs depuis CSV...');
  return await fetchBouyguesXML(options);
}

export async function testConnection(): Promise<TimeOneApiResponse> {
  console.log('[TimeOne CSV] Test de connexion CSV...');
  
  try {
    const response = await fetchBouyguesXML({ 
      forceRefresh: true 
    });
    
    if (response.success && response.data) {
      console.log('[TimeOne CSV] Test de connexion réussi');
      return {
        success: true,
        data: 'Connexion CSV OK',
      };
    }
    
    return response;
    
  } catch (error) {
    console.error('[TimeOne CSV] Test de connexion échoué:', error);
    return {
      success: false,
      error: 'Test de connexion CSV échoué',
    };
  }
}

export function clearCache(): void {
  cache.clear();
  console.log('[TimeOne CSV] Cache vidé');
}

export function getCacheStats() {
  const entries = Array.from(cache['cache'].entries());
  return {
    size: entries.length,
    entries: entries.map(([key, entry]) => ({
      key,
      age: Date.now() - entry.timestamp,
      dataSize: entry.data.length,
    })),
  };
}

export default {
  fetchBouyguesXML,
  getBouyguesOffers,
  testConnection,
  clearCache,
  getCacheStats,
};