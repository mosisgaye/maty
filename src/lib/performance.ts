/**
 * 🚀 UTILITAIRES DE PERFORMANCE
 * Optimisations spécifiques pour réduire le travail du thread principal
 */

// 🚀 Debounce optimisé avec RequestAnimationFrame
export function requestIdleCallback(callback: () => void, timeout = 5000) {
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

// 🚀 Chunking pour gros datasets
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
    
    // Utilise scheduler pour éviter de bloquer le thread principal
    requestIdleCallback(processChunk);
  }
  
  processChunk();
}

// 🚀 Memoization avec WeakMap pour performance
const memoCache = new WeakMap();

export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    
    if (memoCache.has(fn)) {
      const cache = memoCache.get(fn);
      if (cache.has(key)) {
        return cache.get(key);
      }
    } else {
      memoCache.set(fn, new Map());
    }
    
    const result = fn(...args);
    memoCache.get(fn).set(key, result);
    return result;
  }) as T;
}

// 🚀 Intersection Observer optimisé
export function createLazyObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
) {
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

// 🚀 RAF-based throttle pour animations
export function rafThrottle<T extends (...args: any[]) => any>(fn: T): T {
  let ticking = false;
  let lastArgs: Parameters<T>;
  
  return ((...args: Parameters<T>) => {
    lastArgs = args;
    
    if (!ticking) {
      requestAnimationFrame(() => {
        fn(...lastArgs);
        ticking = false;
      });
      ticking = true;
    }
  }) as T;
}

// 🚀 Performance monitor
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private longTasks: PerformanceEntry[] = [];
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  constructor() {
    this.initLongTaskObserver();
  }
  
  private initLongTaskObserver() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'longtask') {
              this.longTasks.push(entry);
              console.warn('🐌 Long task detected:', {
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name
              });
            }
          });
        });
        
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('PerformanceObserver not supported');
      }
    }
  }
  
  getLongTasks() {
    return this.longTasks;
  }
  
  getPerformanceScore() {
    const totalBlockingTime = this.longTasks.reduce((sum, task) => 
      sum + Math.max(0, task.duration - 50), 0
    );
    
    return {
      longTaskCount: this.longTasks.length,
      totalBlockingTime,
      score: Math.max(0, 100 - (totalBlockingTime / 100))
    };
  }
}

// 🚀 Virtual scrolling helper
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan = 3
) {
  const start = Math.floor(scrollTop / itemHeight);
  const end = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight)
  );
  
  return {
    start: Math.max(0, start - overscan),
    end: Math.min(totalItems - 1, end + overscan),
    offset: Math.max(0, start - overscan) * itemHeight
  };
}

// 🚀 Code splitting helper
export function loadComponentAsync<T = any>(
  importFn: () => Promise<{ default: T }>,
  fallback?: T
): Promise<T> {
  return new Promise((resolve) => {
    requestIdleCallback(async () => {
      try {
        const module = await importFn();
        resolve(module.default);
      } catch (error) {
        console.error('Failed to load component:', error);
        if (fallback) {
          resolve(fallback);
        }
      }
    });
  });
}

// 🚀 Memory usage tracker
export function trackMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      usage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
    };
  }
  return null;
}

// 🚀 Export du monitor global
export const performanceMonitor = PerformanceMonitor.getInstance();