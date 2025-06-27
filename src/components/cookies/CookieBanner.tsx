// 📁 /src/components/cookies/CookieBanner.tsx

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Cookie, 
  Settings, 
  Shield, 
  BarChart3, 
  Target, 
  User,
  Info,
  X,
  ChevronUp
} from 'lucide-react';
import { cookieManager, type CookieCategories } from '@/lib/cookieConsent';

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [consent, setConsent] = useState<CookieCategories>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    // Vérifier si le consentement a déjà été donné
    const savedConsent = localStorage.getItem('cookie-consent');
    if (!savedConsent) {
      // Délai pour éviter le flash à l'ouverture de page
      setTimeout(() => {
        setShowBanner(true);
        setIsAnimating(true);
      }, 1000);
    } else {
      // Charger le consentement existant
      setConsent(cookieManager.getConsent());
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookieCategories = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    
    cookieManager.saveConsent(allAccepted);
    setConsent(allAccepted);
    closeBanner();
  };

  const handleAcceptSelected = () => {
    cookieManager.saveConsent(consent);
    closeBanner();
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const minimal: CookieCategories = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    
    cookieManager.saveConsent(minimal);
    setConsent(minimal);
    closeBanner();
  };

  const closeBanner = () => {
    setIsAnimating(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  const toggleCategory = (category: keyof CookieCategories) => {
    if (category === 'necessary') return; // Toujours requis
    
    setConsent(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const cookieCategories = [
    {
      key: 'necessary' as keyof CookieCategories,
      title: 'Cookies Essentiels',
      description: 'Nécessaires au fonctionnement du site (navigation, sécurité)',
      icon: Shield,
      required: true,
      color: 'text-green-600 dark:text-green-400',
      examples: 'Session utilisateur, sécurité, préférences de base'
    },
    {
      key: 'analytics' as keyof CookieCategories,
      title: 'Cookies d\'Analyse',
      description: 'Nous aident à comprendre l\'utilisation du site et à l\'améliorer',
      icon: BarChart3,
      required: false,
      color: 'text-blue-600 dark:text-blue-400',
      examples: 'Pages visitées, temps passé, parcours utilisateur'
    },
    {
      key: 'marketing' as keyof CookieCategories,
      title: 'Cookies Marketing',
      description: 'Permettent de tracker les clics vers nos partenaires (Bouygues)',
      icon: Target,
      required: false,
      color: 'text-purple-600 dark:text-purple-400',
      examples: 'Suivi des clics d\'affiliation, conversions partenaires'
    },
    {
      key: 'preferences' as keyof CookieCategories,
      title: 'Cookies Préférences',
      description: 'Sauvegardent vos choix et filtres pour une meilleure expérience',
      icon: User,
      required: false,
      color: 'text-orange-600 dark:text-orange-400',
      examples: 'Filtres sauvegardés, téléphones favoris, préférences d\'affichage'
    }
  ];

  if (!showBanner) return null;

  return (
    <>
      {/* Banner Principal - Version Compacte */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 p-3 transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-2xl">
            <div className="px-4 py-3">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
                
                {/* Icône et Texte Compact */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Cookie className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">
                      🍪 Nous utilisons des cookies
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                      Pour améliorer votre expérience et tracker les clics vers nos partenaires comme{' '}
                      <span className="font-medium text-purple-600 dark:text-purple-400">Bouygues Telecom</span>.{' '}
                      <button 
                        onClick={() => setShowSettings(true)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors"
                      >
                        Personnaliser
                      </button>
                    </p>
                  </div>
                </div>

                {/* Actions Compactes */}
                <div className="flex flex-row gap-2 w-full lg:w-auto lg:flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRejectAll}
                    className="flex-1 lg:flex-none text-xs h-8 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Rejeter
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                    className="flex-1 lg:flex-none text-xs h-8 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Options
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    className="flex-1 lg:flex-none text-xs h-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Accepter
                  </Button>
                </div>

                {/* Bouton Fermer */}
                <button
                  onClick={closeBanner}
                  className="absolute top-2 right-2 lg:relative lg:top-auto lg:right-auto p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal Paramètres Détaillés */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Cookie className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              Paramètres des Cookies
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Choisissez quels cookies vous souhaitez autoriser. Vous pouvez modifier ces préférences à tout moment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {cookieCategories.map((category) => {
              const Icon = category.icon;
              const isChecked = consent[category.key];
              
              return (
                <Card 
                  key={category.key} 
                  className={`p-4 transition-all border-2 ${
                    isChecked 
                      ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30' 
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center space-x-3 flex-1">
                      <Checkbox
                        id={category.key}
                        checked={isChecked}
                        onCheckedChange={() => toggleCategory(category.key)}
                        disabled={category.required}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`p-1.5 rounded ${isChecked ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            <Icon className={`h-4 w-4 ${category.color}`} />
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {category.title}
                          </h4>
                          {category.required && (
                            <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                              Requis
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                          {category.description}
                        </p>
                        
                        <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>Exemples : {category.examples}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* Informations RGPD */}
            <Card className="p-4 bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                Vos droits RGPD
              </h4>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p>• Vous pouvez modifier ces préférences à tout moment</p>
                <p>• Vos données sont conservées localement sur votre appareil</p>
                <p>• Les cookies marketing nous permettent de gagner une commission sur les ventes Bouygues</p>
                <p>• Consultez notre politique de confidentialité pour plus d'informations</p>
              </div>
            </Card>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleRejectAll}
              className="w-full sm:w-auto border-gray-300 dark:border-gray-600"
            >
              Rejeter tout
            </Button>
            
            <Button
              onClick={handleAcceptSelected}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Sauvegarder mes préférences
            </Button>
            
            <Button
              onClick={handleAcceptAll}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
            >
              Accepter tout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieBanner;