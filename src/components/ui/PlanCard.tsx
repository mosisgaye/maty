'use client';

import React, { useState, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, Euro, Phone, Signal, Globe, Star, TrendingUp, 
  Zap, Check, ChevronRight, Sparkles, Clock, Users,
  ArrowRight, ExternalLink, Shield, Award
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// ✅ Supprimer l'import Progress problématique
// import { Progress } from "@/components/ui/progress";
import { UnifiedMobilePlan, isTimeOnePlan } from '@/types/mobile';
import { useAffiliateTracking } from '@/hooks/useAffiliateTracking';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PlanCardProps {
  plan: UnifiedMobilePlan;
  showSource?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  onCompare?: (plan: UnifiedMobilePlan) => void;
  isComparing?: boolean;
}

// Skeleton pour le chargement
export const PlanCardSkeleton: React.FC = () => (
  <Card className="overflow-hidden animate-pulse bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="space-y-1 text-right">
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
    </div>
  </Card>
);

const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  showSource = true,
  variant = 'default',
  onCompare,
  isComparing = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // ✅ Hook avec protection SSR
  const { trackClick, isClient } = useAffiliateTracking();
  const { toast } = useToast();

  // ✅ S'assurer qu'on est côté client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isPartner = isTimeOnePlan(plan);
  const hasHighCommission = isPartner && (plan as any).commission && (plan as any).commission >= 45;
  const is5G = plan.features.some(f => f.includes('5G')) || (plan as any).networkType === '5G';
  const isUnlimited = plan.data.toLowerCase().includes('illimité') || parseInt(plan.data) >= 200;
  
  // Gestion du clic sur le bouton CTA
  const handleCtaClick = () => {
    if (!plan.affiliate_url && !((plan as any).trackingUrl)) {
      console.warn('[PlanCard] Pas d\'URL d\'affiliation pour:', plan.name);
      toast({
        title: "Lien indisponible",
        description: "Ce forfait n'a pas de lien d'affiliation configuré.",
        variant: "destructive"
      });
      return;
    }

    const affiliateUrl = plan.affiliate_url || (plan as any).trackingUrl;

    // ✅ Utiliser le tracking seulement côté client
    if (mounted && isClient) {
      trackClick(plan, affiliateUrl);
    } else {
      // ✅ Fallback si tracking pas disponible
      if (typeof window !== 'undefined') {
        window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Gestion de la comparaison
  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCompare) {
      onCompare(plan);
    }
  };

  // Calculer le score de qualité/prix (pour l'affichage)
  const qualityScore = React.useMemo(() => {
    let score = 0;
    const price = parseFloat(plan.price) || 0;
    const data = parseInt(plan.data) || 0;
    
    // Score basé sur le rapport Go/€
    if (price > 0) {
      const dataPerEuro = data / price;
      score = Math.min(Math.round(dataPerEuro * 2), 100);
    }
    
    // Bonus pour 5G
    if (is5G) score += 15;
    
    // Bonus pour illimité
    if (isUnlimited) score += 10;
    
    // Bonus partenaire
    if (isPartner) score += 5;
    
    return Math.min(score, 100);
  }, [plan.price, plan.data, is5G, isUnlimited, isPartner]);

  // ✅ Composant Progress simple inline
  const SimpleProgress = ({ value, className = "" }: { value: number; className?: string }) => (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700", className)}>
      <div 
        className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-out"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );

  // Animation variants
  const cardVariants = {
    rest: { 
      scale: 1,
      rotateY: 0,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    },
    hover: { 
      scale: variant === 'featured' ? 1.02 : 1.01,
      rotateY: variant === 'featured' ? 2 : 0,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative group cursor-pointer",
        variant === 'featured' && "transform-gpu"
      )}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-300",
        "bg-white dark:bg-gray-800",
        "border-gray-200 dark:border-gray-700",
        "hover:border-blue-300 dark:hover:border-blue-600",
        variant === 'featured' && [
          "ring-2 ring-blue-500/20 dark:ring-blue-400/20",
          "bg-gradient-to-br from-blue-50 to-indigo-50",
          "dark:from-blue-950/30 dark:to-indigo-950/30"
        ],
        variant === 'compact' && "p-4",
        isComparing && "ring-2 ring-green-500"
      )}>
        {/* Badge featured */}
        {variant === 'featured' && (
          <div className="absolute top-0 right-0 z-10">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg flex items-center gap-1">
              <Star className="w-3 h-3" />
              Recommandé
            </div>
          </div>
        )}

        {/* Badge commission élevée */}
        {hasHighCommission && (
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
              <TrendingUp className="w-3 h-3 mr-1" />
              {(plan as any).commission}€
            </Badge>
          </div>
        )}

        <CardContent className={cn(
          "p-6",
          variant === 'compact' && "p-4"
        )}>
          {/* Header avec nom et prix */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={cn(
                  "font-semibold text-gray-900 dark:text-white",
                  variant === 'compact' ? "text-base" : "text-lg"
                )}>
                  {plan.name}
                </h3>
                {showSource && isPartner && (
                  <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                    <Sparkles className="w-2.5 h-2.5 mr-1" />
                    Partenaire
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {plan.operator}
                </span>
                {is5G && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    5G
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className={cn(
                "font-bold text-gray-900 dark:text-white",
                variant === 'compact' ? "text-xl" : "text-2xl"
              )}>
                {plan.price}€
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                /mois
              </div>
            </div>
          </div>

          {/* Specs principales */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              {plan.data}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              Appels illimités
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Signal className="w-3 h-3" />
              {plan.coverage}
            </Badge>
          </div>

          {/* Score qualité/prix */}
          {variant !== 'compact' && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Rapport qualité/prix
                </span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {qualityScore}/100
                </span>
              </div>
              <SimpleProgress value={qualityScore} />
            </div>
          )}

          {/* Features */}
          {variant !== 'compact' && !showDetails && (
            <div className="space-y-1 mb-4">
              {plan.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span className="truncate">{feature}</span>
                </div>
              ))}
              {plan.features.length > 3 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(true);
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  +{plan.features.length - 3} autres caractéristiques
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Features détaillées */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1 mb-4 overflow-hidden"
              >
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(false);
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  Réduire
                  <ChevronRight className="w-3 h-3 rotate-90" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              onClick={handleCtaClick}
              className={cn(
                "flex-1 transition-all duration-200",
                variant === 'featured' 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                  : "bg-blue-600 hover:bg-blue-700"
              )}
              disabled={!mounted} // ✅ Désactivé pendant le mounting
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {variant === 'compact' ? 'Voir' : 'Voir l\'offre'}
            </Button>
            
            {onCompare && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleCompareClick}
                className={cn(
                  "transition-all duration-200",
                  isComparing && "bg-green-100 border-green-300 text-green-700"
                )}
              >
                {isComparing ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Star className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default memo(PlanCard);