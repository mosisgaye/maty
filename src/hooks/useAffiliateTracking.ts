'use client';

import { useCallback, useEffect, useState } from 'react';
import { cookieManager } from '@/lib/cookieConsent';

export interface AffiliateClickData {
  phoneId: string;
  phoneBrand: string;
  phoneTitle: string;
  price: number;
  url: string;
  timestamp: number;
  sessionId: string | null;
  userAgent?: string;
  referrer?: string;
}

export const useAffiliateTracking = () => {
  const [isClient, setIsClient] = useState(false);

  // ✅ S'assurer qu'on est côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  /**
   * 🎯 Tracker un clic vers un partenaire d'affiliation
   */
  const trackClick = useCallback((plan: any, affiliateUrl: string) => {
    if (!isClient) return; // ✅ Protection SSR
    
    // Vérifier si le tracking marketing est autorisé
    if (!cookieManager.hasConsent('marketing')) {
      console.log('🚫 Tracking bloqué - Cookies marketing non autorisés');
      // Ouvrir quand même le lien mais sans tracking
      if (typeof window !== 'undefined') {
        window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    try {
      // Préparer les données de tracking
      const clickData: AffiliateClickData = {
        phoneId: plan.id || plan.name,
        phoneBrand: plan.operator || 'Unknown',
        phoneTitle: plan.name || 'Unknown',
        price: parseFloat(plan.price) || 0,
        url: affiliateUrl,
        timestamp: Date.now(),
        sessionId: cookieManager.getCookie('affiliate_session'),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined
      };

      // Sauvegarder le clic
      cookieManager.trackAffiliateClick(plan.id || plan.name, affiliateUrl);
      
      // Envoyer à votre API analytics (optionnel)
      if (cookieManager.hasConsent('analytics')) {
        sendToAnalytics(clickData);
      }

      // Définir un cookie de conversion pour tracker le retour
      cookieManager.setCookie(`click_${plan.id}`, JSON.stringify({
        timestamp: Date.now(),
        price: parseFloat(plan.price) || 0,
        brand: plan.operator
      }), 30); // 30 jours pour tracker la conversion

      console.log('🎯 Clic affiliation tracké:', clickData);

      // Ouvrir le lien d'affiliation
      if (typeof window !== 'undefined') {
        window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.warn('Erreur tracking clic:', error);
      // Ouvrir le lien même en cas d'erreur
      if (typeof window !== 'undefined') {
        window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
      }
    }
  }, [isClient]);

  /**
   * 📊 Envoyer les données à votre service d'analytics
   */
  const sendToAnalytics = useCallback(async (data: AffiliateClickData) => {
    if (!isClient) return; // ✅ Protection SSR
    
    try {
      // Remplacez par votre endpoint d'analytics
      await fetch('/api/analytics/affiliate-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.warn('Erreur envoi analytics:', error);
    }
  }, [isClient]);

  /**
   * 📈 Obtenir les statistiques d'affiliation
   */
  const getStats = useCallback(() => {
    if (!isClient) return {
      totalClicks: 0,
      clicksByBrand: {},
      clicksByDay: {},
      totalValue: 0
    }; // ✅ Protection SSR

    if (!cookieManager.hasConsent('marketing')) {
      return {
        totalClicks: 0,
        clicksByBrand: {},
        clicksByDay: {},
        totalValue: 0
      };
    }

    try {
      const clicks = cookieManager.getAffiliateStats();
      
      // Calculer les statistiques
      const stats = {
        totalClicks: clicks.length,
        clicksByBrand: clicks.reduce((acc: Record<string, number>, click: any) => {
          const brand = click.phoneBrand || 'Unknown';
          acc[brand] = (acc[brand] || 0) + 1;
          return acc;
        }, {}),
        clicksByDay: clicks.reduce((acc: Record<string, number>, click: any) => {
          const day = new Date(click.timestamp).toDateString();
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {}),
        totalValue: clicks.reduce((sum: number, click: any) => sum + (click.price || 0), 0)
      };

      return stats;
    } catch (error) {
      console.warn('Erreur lecture stats:', error);
      return {
        totalClicks: 0,
        clicksByBrand: {},
        clicksByDay: {},
        totalValue: 0
      };
    }
  }, [isClient]);

  /**
   * 🎯 Tracker une conversion (quand l'utilisateur revient après achat)
   */
  const trackConversion = useCallback((planId: string, conversionValue?: number) => {
    if (!isClient) return; // ✅ Protection SSR
    
    if (!cookieManager.hasConsent('marketing')) return;

    try {
      const clickCookie = cookieManager.getCookie(`click_${planId}`);
      if (clickCookie) {
        const clickData = JSON.parse(clickCookie);
        const conversion = {
          planId,
          originalClick: clickData,
          conversionTimestamp: Date.now(),
          conversionValue: conversionValue || clickData.price,
          timeSinceClick: Date.now() - clickData.timestamp
        };

        // Sauvegarder la conversion
        const conversions = JSON.parse(localStorage.getItem('affiliate_conversions') || '[]');
        conversions.push(conversion);
        localStorage.setItem('affiliate_conversions', JSON.stringify(conversions));

        // Nettoyer le cookie de tracking
        cookieManager.deleteCookie(`click_${planId}`);

        console.log('🎉 Conversion trackée:', conversion);
      }
    } catch (error) {
      console.warn('Erreur tracking conversion:', error);
    }
  }, [isClient]);

  /**
   * 🔄 Obtenir le taux de conversion
   */
  const getConversionRate = useCallback(() => {
    if (!isClient) return 0; // ✅ Protection SSR
    
    if (!cookieManager.hasConsent('marketing')) return 0;

    try {
      const clicks = cookieManager.getAffiliateStats().length;
      const conversions = JSON.parse(localStorage.getItem('affiliate_conversions') || '[]').length;
      
      return clicks > 0 ? (conversions / clicks) * 100 : 0;
    } catch (error) {
      console.warn('Erreur calcul taux conversion:', error);
      return 0;
    }
  }, [isClient]);

  /**
   * 🧹 Nettoyer les données de tracking (RGPD)
   */
  const clearTrackingData = useCallback(() => {
    if (!isClient) return; // ✅ Protection SSR
    
    try {
      localStorage.removeItem('affiliate_clicks');
      localStorage.removeItem('affiliate_conversions');
      
      // Supprimer tous les cookies de click tracking
      if (typeof document !== 'undefined') {
        document.cookie.split(";").forEach(cookie => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          if (name.startsWith('click_')) {
            cookieManager.deleteCookie(name);
          }
        });
      }

      console.log('🧹 Données de tracking nettoyées');
    } catch (error) {
      console.warn('Erreur nettoyage données:', error);
    }
  }, [isClient]);

  return {
    trackClick,
    getStats,
    trackConversion,
    getConversionRate,
    clearTrackingData,
    hasMarketingConsent: () => isClient ? cookieManager.hasConsent('marketing') : false,
    hasAnalyticsConsent: () => isClient ? cookieManager.hasConsent('analytics') : false,
    isClient // ✅ Export pour les composants qui en ont besoin
  };
};

/**
 * 🎯 Hook simplifié pour le tracking de base
 */
export const useSimpleTracking = () => {
  const { trackClick, isClient } = useAffiliateTracking();
  
  return {
    /**
     * Fonction simple à utiliser dans vos composants
     */
    handleAffiliateClick: (plan: any) => {
      if (!isClient) return; // ✅ Protection SSR
      
      if (plan.affiliate_url || plan.trackingUrl) {
        trackClick(plan, plan.affiliate_url || plan.trackingUrl);
      } else {
        console.warn('Pas d\'URL d\'affiliation pour:', plan.name);
      }
    },
    isClient
  };
};