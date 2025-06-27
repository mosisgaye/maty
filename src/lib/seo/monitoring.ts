// ================================================
// FICHIER: /src/lib/seo/monitoring.ts
// ================================================
// Monitoring SEO et Core Web Vitals

import type { Metric } from 'web-vitals';

/**
 * Envoie les métriques à Google Analytics
 */
function sendToGoogleAnalytics(metric: Metric) {
  // Vérifier que gtag existe
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

/**
 * Envoie les métriques à votre endpoint personnalisé
 */
async function sendToAnalyticsEndpoint(metric: Metric) {
  try {
    await fetch('/api/analytics/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    });
  } catch (error) {
    console.error('Failed to send metric to endpoint:', error);
  }
}

/**
 * Initialise le monitoring SEO et Core Web Vitals
 */
export function initSEOMonitoring() {
  if (typeof window === 'undefined') return;
  
  // Monitoring des Core Web Vitals
  if ('PerformanceObserver' in window) {
    // Import dynamique de web-vitals uniquement côté client
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
      // Envoyer à Google Analytics
      onCLS(sendToGoogleAnalytics);
      onFID(sendToGoogleAnalytics);
      onFCP(sendToGoogleAnalytics);
      onLCP(sendToGoogleAnalytics);
      onTTFB(sendToGoogleAnalytics);
      onINP(sendToGoogleAnalytics); // Nouvelle métrique qui remplace FID
      
      // Optionnel : envoyer aussi à votre endpoint
      if (process.env.NODE_ENV === 'production') {
        onCLS(sendToAnalyticsEndpoint);
        onFID(sendToAnalyticsEndpoint);
        onFCP(sendToAnalyticsEndpoint);
        onLCP(sendToAnalyticsEndpoint);
        onTTFB(sendToAnalyticsEndpoint);
        onINP(sendToAnalyticsEndpoint);
      }
    }).catch((error) => {
      console.error('Failed to load web-vitals:', error);
    });
  }
  
  // Monitoring des erreurs 404
  if (document.title.includes('404') || document.title.includes('Page not found')) {
    if (window.gtag) {
      window.gtag('event', 'page_not_found', {
        page_location: window.location.href,
        page_referrer: document.referrer
      });
    }
  }
  
  // Monitoring des erreurs JavaScript
  window.addEventListener('error', (event) => {
    if (window.gtag) {
      window.gtag('event', 'javascript_error', {
        event_category: 'errors',
        event_label: event.message,
        error_message: event.message,
        error_filename: event.filename,
        error_lineno: event.lineno,
        error_colno: event.colno,
        non_interaction: true,
      });
    }
  });
  
  // Monitoring du temps de chargement de la page
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      if (window.gtag && pageLoadTime > 0) {
        window.gtag('event', 'page_timing', {
          event_category: 'performance',
          event_label: 'page_load_time',
          value: pageLoadTime,
          page_location: window.location.href,
        });
      }
    }, 0);
  });
  
  // Monitoring de la visibilité de la page
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.gtag) {
      const timeOnPage = Math.round(performance.now() / 1000);
      window.gtag('event', 'page_visibility', {
        event_category: 'engagement',
        event_label: 'time_on_page',
        value: timeOnPage,
      });
    }
  });
}

/**
 * Tracker personnalisé pour les conversions
 */
export function trackConversion(conversionType: string, value?: number, currency: string = 'EUR') {
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: process.env.NEXT_PUBLIC_GA_ID,
      value: value,
      currency: currency,
      conversion_type: conversionType,
    });
  }
  
}

/**
 * Tracker pour les clics sur les offres
 */
export function trackOfferClick(offer: {
  name: string;
  operator: string;
  price: string;
  type?: string;
}) {
  if (window.gtag) {
    window.gtag('event', 'select_item', {
      item_list_id: 'offers',
      item_list_name: 'Offers List',
      items: [{
        item_id: `${offer.operator}_${offer.name}`,
        item_name: offer.name,
        item_brand: offer.operator,
        item_category: offer.type || 'mobile',
        price: parseFloat(offer.price),
        currency: 'EUR',
      }]
    });
  }
}

/**
 * Tracker pour la recherche
 */
export function trackSearch(searchTerm: string, resultCount: number) {
  if (window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
      results_count: resultCount,
    });
  }
}

/**
 * Tracker pour le scroll
 */
export function initScrollTracking() {
  let maxScroll = 0;
  const scrollPercentages = [25, 50, 75, 90, 100];
  const trackedPercentages = new Set<number>();
  
  const trackScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const scrollPercentage = Math.round((scrolled / scrollHeight) * 100);
    
    if (scrollPercentage > maxScroll) {
      maxScroll = scrollPercentage;
      
      scrollPercentages.forEach(percentage => {
        if (scrollPercentage >= percentage && !trackedPercentages.has(percentage)) {
          trackedPercentages.add(percentage);
          
          if (window.gtag) {
            window.gtag('event', 'scroll', {
              event_category: 'engagement',
              event_label: `${percentage}%`,
              value: percentage,
            });
          }
        }
      });
    }
  };
  
  // Debounce pour éviter trop d'appels
  let scrollTimeout: NodeJS.Timeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(trackScroll, 100);
  });
}