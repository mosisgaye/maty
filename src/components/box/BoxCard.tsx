// components/box/BoxCard.tsx
import React, { useState } from 'react';
import { Box, formatPrice, formatSpeed, getEngagementText, getTechnologyIcon } from '@/types/box';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Wifi, 
  Tv, 
  Phone, 
  Star, 
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface BoxCardProps {
  box: Box;
  viewType: 'grid' | 'list';
  isInComparison: boolean;
  onCompareToggle: () => void;
}

/**
 * RECOMMANDATIONS APPLIQUÉES:
 * 1. ✅ Suppression de l'affichage des décodeurs en vue grille
 * 2. ✅ Simplification des badges (un seul affiché)
 * 3. ✅ Progressive disclosure: bouton "Plus de détails" en vue grille
 * 4. ✅ Hiérarchisation: Prix et débit en grand, reste en petit
 * 5. ✅ Suppression des imports inutilisés (Clock, Shield, Euro, Gift, etc.)
 * 6. ✅ Vue grille épurée avec seulement l'essentiel
 */

const BoxCard: React.FC<BoxCardProps> = ({
  box,
  viewType,
  isInComparison,
  onCompareToggle
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleBoxClick = () => {
    window.open(box.url_tracking, '_blank', 'noopener,noreferrer');
  };

  // Déterminer le badge principal à afficher (priorité)
  const getPrimaryBadge = () => {
    if (box.featured) {
      return { icon: Star, text: 'Populaire', variant: 'default', className: 'bg-orange-500 hover:bg-orange-600 text-white' };
    }
    if (box.duree_promo > 0) {
      const savings = box.prix_apres_promo - box.prix_mensuel;
      return { icon: null, text: `-${Math.round((savings/box.prix_apres_promo)*100)}%`, variant: 'destructive', className: '' };
    }
    return null;
  };

  const primaryBadge = getPrimaryBadge();

  if (viewType === 'list') {
    // Vue liste inchangée - elle est déjà bien
    return (
      <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Logo simplifié */}
            <div className="relative lg:w-32 lg:h-24 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {getTechnologyIcon(box.technologie)}
              </div>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">
                    {box.nom}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {box.description}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(box.prix_mensuel)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">/mois</span>
                  </div>
                  {box.duree_promo > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      puis {formatPrice(box.prix_apres_promo)}
                    </div>
                  )}
                </div>
              </div>

              {/* Infos clés en ligne */}
              <div className="flex flex-wrap gap-4 items-center text-sm">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="font-medium">{formatSpeed(box.debit_down)}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Wifi className="w-4 h-4 text-blue-500" />
                  <span>{box.wifi}</span>
                </div>

                {box.tv_incluse && (
                  <Badge variant="secondary" className="text-xs">
                    <Tv className="w-3 h-3 mr-1" />
                    TV incluse
                  </Badge>
                )}

                {box.telephone_fixe && (
                  <Badge variant="secondary" className="text-xs">
                    <Phone className="w-3 h-3 mr-1" />
                    Fixe inclus
                  </Badge>
                )}

                {box.engagement === 0 && (
                  <Badge variant="outline" className="text-xs">
                    Sans engagement
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`compare-${box.id}`}
                    checked={isInComparison}
                    onCheckedChange={onCompareToggle}
                  />
                  <label htmlFor={`compare-${box.id}`} className="text-sm cursor-pointer text-gray-600 dark:text-gray-300">
                    Comparer
                  </label>
                </div>
                
                <Button onClick={handleBoxClick} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  Souscrire
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Vue grille - SIMPLIFIÉE
  return (
    <Card className="relative group hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Badge unique */}
      {primaryBadge && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className={primaryBadge.className || ''} variant={primaryBadge.variant as any}>
            {primaryBadge.icon && <primaryBadge.icon className="w-3 h-3 mr-1" />}
            {primaryBadge.text}
          </Badge>
        </div>
      )}

      {/* Checkbox comparaison */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Checkbox
          id={`compare-grid-${box.id}`}
          checked={isInComparison}
          onCheckedChange={onCompareToggle}
          className="bg-white dark:bg-gray-800"
        />
      </div>

      <CardHeader className="pb-4">
        {/* Titre et technologie */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {box.nom}
            </h3>
            <Badge variant="outline" className="text-xs">
              {box.technologie}
            </Badge>
          </div>
          
          {/* Prix - Point focal principal */}
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(box.prix_mensuel)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">/mois</span>
            </div>
            {box.duree_promo > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                pendant {box.duree_promo} mois
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Infos essentielles uniquement */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="font-medium">{formatSpeed(box.debit_down)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-blue-500" />
            <span>{box.wifi}</span>
          </div>
        </div>

        {/* Services inclus - Simplifié */}
        <div className="flex gap-2">
          {box.tv_incluse && <Tv className="w-4 h-4 text-gray-400" />}
          {box.telephone_fixe && <Phone className="w-4 h-4 text-gray-400" />}
          {box.engagement === 0 && (
            <span className="text-xs text-green-600 font-medium ml-auto">Sans engagement</span>
          )}
        </div>

        {/* Progressive disclosure - Détails supplémentaires */}
        {showDetails && (
          <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Installation</span>
              <span className="font-medium">{box.installation}</span>
            </div>
            {box.extras && (
              <div className="text-xs text-amber-600 dark:text-amber-400">
                {box.extras}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <Button 
            onClick={handleBoxClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="default"
          >
            Voir l'offre
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-xs text-gray-600"
          >
            {showDetails ? (
              <>Moins de détails <ChevronUp className="w-3 h-3 ml-1" /></>
            ) : (
              <>Plus de détails <ChevronDown className="w-3 h-3 ml-1" /></>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BoxCard;