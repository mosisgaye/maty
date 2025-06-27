// lib/performance-client.ts
/**
 * Version SSR-safe des utilitaires de performance
 * Vérifie toujours si on est côté client avant d'utiliser window
 */

// 🚀 Debounce optimisé avec RequestAnimationFrame
export function requestIdleCallback(callback: () => void, timeout = 5000) {
    if (typeof window === 'undefined') {
      // Côté serveur, exécuter immédiatement
      callback();
      return;
    }
  
    if ('requestIdleCallback' in window) {
      return window.requestIdleCallback(callback, { timeout });
    }
    
    // Fallback pour navigateurs non supportés
    return setTimeout(() => {
      const start = performance.now();
      callback();
      const end = performance.now();
      
      if (end - start > 50) {
        console.warn('⚠️ Long task detected:', end - start + 'ms');
      }
    }, 1);
  }
  
  // 🚀 Intersection Observer optimisé et SSR-safe
  export function createLazyObserver(
    callback: (entry: IntersectionObserverEntry) => void,
    options: IntersectionObserverInit = {}
  ) {
    // Vérifier qu'on est côté client
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return {
        observe: () => {},
        unobserve: () => {},
        disconnect: () => {}
      };
    }
  
    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    };
    
    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    }, defaultOptions);
  }
  
  // 🚀 Memoization simple sans WeakMap (SSR-safe)
  export function memoize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map();
    
    return ((...args: any[]) => {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = fn(...args);
      cache.set(key, result);
      
      // Limiter la taille du cache
      if (cache.size > 100) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      
      return result;
    }) as T;
  }
  
  // 🚀 Chunking pour gros datasets (SSR-safe)
  export function processInChunks<T>(
    items: T[],
    chunkSize: number,
    processor: (chunk: T[]) => void,
    onComplete?: () => void
  ) {
    let index = 0;
    
    function processChunk() {
      const chunk = items.slice(index, index + chunkSize);
      if (chunk.length === 0) {
        onComplete?.();
        return;
      }
      
      processor(chunk);
      index += chunkSize;
      
      // Utilise requestIdleCallback si disponible
      requestIdleCallback(processChunk);
    }
    
    processChunk();
  }
  
  // 🚀 Throttle SSR-safe
  export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): T {
    let timeout: NodeJS.Timeout | null = null;
    let lastArgs: any[] | null = null;
    
    return ((...args: any[]) => {
      lastArgs = args;
      
      if (!timeout) {
        timeout = setTimeout(() => {
          func(...lastArgs!);
          timeout = null;
          lastArgs = null;
        }, wait);
      }
    }) as T;
  }
  
  // 🚀 Debounce SSR-safe
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): T {
    let timeout: NodeJS.Timeout | null = null;
    
    return ((...args: any[]) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      
      timeout = setTimeout(() => {
        func(...args);
      }, wait);
    }) as T;
  }