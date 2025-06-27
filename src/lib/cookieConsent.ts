// 📁 /src/lib/cookieConsent.ts

export interface CookieCategories {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export class CookieManager {
  private static instance: CookieManager;
  private consentGiven: CookieCategories = {
    necessary: true, // Toujours actifs
    analytics: false,
    marketing: false,
    preferences: false
  };

  private constructor() {
    // ✅ SEULEMENT côté client
    if (typeof window !== 'undefined') {
      this.loadSavedConsent();
    }
  }

  public static getInstance(): CookieManager {
    if (!CookieManager.instance) {
      CookieManager.instance = new CookieManager();
    }
    return CookieManager.instance;
  }

  // 💾 Sauvegarder le consentement
  public saveConsent(categories: CookieCategories): void {
    if (typeof window === 'undefined') return; // ✅ Protection SSR
    
    this.consentGiven = { ...categories, necessary: true };
    try {
      localStorage.setItem('cookie-consent', JSON.stringify({
        categories: this.consentGiven,
        timestamp: Date.now(),
        version: '1.0'
      }));
      
      // Déclencher les trackers selon le consentement
      this.initializeTrackers();
    } catch (error) {
      console.warn('Erreur sauvegarde consentement:', error);
    }
  }

  // 📖 Charger le consentement sauvegardé
  private loadSavedConsent(): void {
    if (typeof window === 'undefined') return; // ✅ Protection SSR
    
    try {
      const saved = localStorage.getItem('cookie-consent');
      if (saved) {
        const data = JSON.parse(saved);
        // Vérifier si le consentement n'est pas trop ancien (6 mois)
        const sixMonthsAgo = Date.now() - (6 * 30 * 24 * 60 * 60 * 1000);
        if (data.timestamp > sixMonthsAgo) {
          this.consentGiven = data.categories;
        }
      }
    } catch (error) {
      console.warn('Erreur lors du chargement du consentement cookies:', error);
    }
  }

  // 🔍 Vérifier si une catégorie est autorisée
  public hasConsent(category: keyof CookieCategories): boolean {
    return this.consentGiven[category];
  }

  // 📊 Obtenir tout le consentement
  public getConsent(): CookieCategories {
    return { ...this.consentGiven };
  }

  // 🔄 Réinitialiser le consentement
  public resetConsent(): void {
    if (typeof window === 'undefined') return; // ✅ Protection SSR
    
    try {
      localStorage.removeItem('cookie-consent');
      this.consentGiven = {
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false
      };
    } catch (error) {
      console.warn('Erreur reset consentement:', error);
    }
  }

  // 🍪 Gestion des cookies
  public setCookie(name: string, value: string, days: number = 30): void {
    if (typeof window === 'undefined') return; // ✅ Protection SSR
    
    try {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    } catch (error) {
      console.warn('Erreur création cookie:', error);
    }
  }

  public getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null; // ✅ Protection SSR
    
    try {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    } catch (error) {
      console.warn('Erreur lecture cookie:', error);
      return null;
    }
  }

  public deleteCookie(name: string): void {
    if (typeof window === 'undefined') return; // ✅ Protection SSR
    
    try {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    } catch (error) {
      console.warn('Erreur suppression cookie:', error);
    }
  }

  // 🎯 Tracker un clic d'affiliation
  public trackAffiliateClick(phoneId: string, affiliateUrl: string): void {
    if (typeof window === 'undefined') return; // ✅ Protection SSR
    
    if (!this.hasConsent('marketing')) {
      console.log('🚫 Tracking affiliation bloqué - pas de consentement');
      return;
    }

    try {
      // Sauvegarder le clic pour analytics
      const clickData = {
        phoneId,
        url: affiliateUrl,
        timestamp: Date.now(),
        sessionId: this.getCookie('affiliate_session')
      };

      // Stocker en localStorage
      const clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
      clicks.push(clickData);
      
      // Garder seulement les 100 derniers clics
      if (clicks.length > 100) {
        clicks.splice(0, clicks.length - 100);
      }
      
      localStorage.setItem('affiliate_clicks', JSON.stringify(clicks));
      console.log('🎯 Clic affiliation tracké:', clickData);
    } catch (error) {
      console.warn('Erreur tracking affiliation:', error);
    }
  }

  // 📊 Obtenir les statistiques d'affiliation
  public getAffiliateStats(): any[] {
    if (typeof window === 'undefined') return []; // ✅ Protection SSR
    
    if (!this.hasConsent('marketing')) return [];
    
    try {
      return JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
    } catch (error) {
      console.warn('Erreur lecture stats affiliation:', error);
      return [];
    }
  }

  // 🎯 Initialiser les trackers selon le consentement
  private initializeTrackers(): void {
    if (typeof window === 'undefined') return; // ✅ Protection SSR
    
    // Analytics (Vercel Analytics)
    if (this.hasConsent('analytics')) {
      this.enableAnalytics();
    }

    // Marketing (Tracking affiliation)
    if (this.hasConsent('marketing')) {
      this.enableAffiliateTracking();
    }

    // Préférences (Sauvegarde filtres)
    if (this.hasConsent('preferences')) {
      this.enablePreferences();
    }

    console.log('🍪 Trackers initialisés:', this.consentGiven);
  }

  // 📈 Activer Analytics
  private enableAnalytics(): void {
    if (typeof window === 'undefined') return; // ✅ Protection SSR
    
    // Vercel Analytics déjà inclus
    if (typeof window !== 'undefined' && (window as any).va) {
      console.log('📊 Analytics activé');
    }
  }

  // 🎯 Activer tracking affiliation
  private enableAffiliateTracking(): void {
    if (typeof window === 'undefined') return; // ✅ Protection SSR
    
    // Générer un ID de session s'il n'existe pas
    if (!this.getCookie('affiliate_session')) {
      const sessionId = 'aff_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      this.setCookie('affiliate_session', sessionId, 30);
    }
    console.log('🎯 Tracking affiliation activé');
  }

  // ⚙️ Activer préférences
  private enablePreferences(): void {
    console.log('⚙️ Préférences activées');
  }
}

// ✅ Export singleton avec protection SSR
export const cookieManager = CookieManager.getInstance();