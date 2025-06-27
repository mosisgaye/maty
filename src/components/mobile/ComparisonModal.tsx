import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, Minus, Star, TrendingUp, Wifi, Euro, Phone, 
  Signal, Globe, Clock, Shield, Zap, ChevronDown, Award,
  AlertCircle, ArrowRight, Sparkles, BarChart, ExternalLink
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UnifiedMobilePlan, isTimeOnePlan } from '@/types/mobile';
import { useAffiliateTracking } from '@/hooks/useAffiliateTracking';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: UnifiedMobilePlan[];
}

// Types pour les caractéristiques de comparaison
interface ComparisonFeature {
  label: string;
  icon: React.ReactNode;
  getValue: (plan: UnifiedMobilePlan) => string | number | boolean;
  format?: (value: any) => string;
  type?: 'boolean' | 'number' | 'text';
  category: 'essential' | 'network' | 'extras' | 'pricing';
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, plans }) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'details' | 'recommendation'>('overview');
  const { trackClick } = useAffiliateTracking();
  const { toast } = useToast();
  
  // Définition des caractéristiques à comparer
  const comparisonFeatures: ComparisonFeature[] = [
    // Essentiels
    {
      label: 'Prix mensuel',
      icon: <Euro className="w-4 h-4" />,
      getValue: (plan) => parseFloat(plan.price),
      format: (value) => `${value}€`,
      type: 'number',
      category: 'essential'
    },
    {
      label: 'Volume de données',
      icon: <Wifi className="w-4 h-4" />,
      getValue: (plan) => parseInt(plan.data) || 0,
      format: (value) => value >= 200 ? 'Illimité' : `${value} Go`,
      type: 'number',
      category: 'essential'
    },
    {
      label: 'Type de réseau',
      icon: <Signal className="w-4 h-4" />,
      getValue: (plan) => (plan as any).networkType || (plan.features.some(f => f.includes('5G')) ? '5G' : '4G'),
      type: 'text',
      category: 'network'
    },
    {
      label: 'Appels illimités',
      icon: <Phone className="w-4 h-4" />,
      getValue: (plan) => plan.features.some(f => f.includes('Appels') && f.includes('illimités')),
      type: 'boolean',
      category: 'essential'
    },
    {
      label: 'SMS illimités',
      icon: <Phone className="w-4 h-4" />,
      getValue: (plan) => plan.features.some(f => f.includes('SMS') && f.includes('illimités')),
      type: 'boolean',
      category: 'essential'
    },
    {
      label: 'Roaming Europe',
      icon: <Globe className="w-4 h-4" />,
      getValue: (plan) => plan.features.some(f => f.includes('Europe')),
      type: 'boolean',
      category: 'extras'
    },
    {
      label: 'Sans engagement',
      icon: <Shield className="w-4 h-4" />,
      getValue: (plan) => plan.features.some(f => f.includes('Sans engagement')),
      type: 'boolean',
      category: 'pricing'
    },
    {
      label: 'Offre partenaire',
      icon: <Star className="w-4 h-4" />,
      getValue: (plan) => isTimeOnePlan(plan),
      type: 'boolean',
      category: 'pricing'
    },
    {
      label: 'Commission',
      icon: <TrendingUp className="w-4 h-4" />,
      getValue: (plan) => isTimeOnePlan(plan) ? (plan as any).commission || 0 : 0,
      format: (value) => value > 0 ? `${value}€` : '-',
      type: 'number',
      category: 'pricing'
    }
  ];
  
  // Calcul du meilleur plan
  const bestPlan = useMemo(() => {
    if (plans.length === 0) return null;
    
    return plans.reduce((best, plan) => {
      const planScore = calculatePlanScore(plan);
      const bestScore = calculatePlanScore(best);
      return planScore > bestScore ? plan : best;
    });
  }, [plans]);
  
  // Fonction de calcul du score
  const calculatePlanScore = (plan: UnifiedMobilePlan): number => {
    let score = 0;
    
    // Prix (inversé - moins cher = mieux)
    const price = parseFloat(plan.price);
    score += (50 - price) * 2;
    
    // Data
    const data = parseInt(plan.data) || 0;
    score += Math.min(data, 100) * 0.5;
    
    // 5G
    if ((plan as any).networkType === '5G' || plan.features.some(f => f.includes('5G'))) {
      score += 20;
    }
    
    // Sans engagement
    if (plan.features.some(f => f.includes('Sans engagement'))) {
      score += 15;
    }
    
    // Commission (pour les partenaires)
    if (isTimeOnePlan(plan)) {
      score += ((plan as any).commission || 0) * 0.3;
    }
    
    // Offre recommandée
    if ((plan as any).isRecommended) {
      score += 25;
    }
    
    return score;
  };
  
  // Rendu d'une valeur de comparaison
  const renderComparisonValue = (plan: UnifiedMobilePlan, feature: ComparisonFeature) => {
    const value = feature.getValue(plan);
    
    if (feature.type === 'boolean') {
      return value ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Check className="w-5 h-5 text-green-600" />
        </motion.div>
      ) : (
        <Minus className="w-5 h-5 text-gray-400" />
      );
    }
    
    const formattedValue = feature.format ? feature.format(value) : String(value);
    
    // Mise en évidence de la meilleure valeur
    const isBestValue = plans.every(p => {
      const otherValue = feature.getValue(p);
      if (feature.type === 'number') {
        // Pour le prix, moins c'est mieux
        if (feature.label === 'Prix mensuel') {
          return value <= otherValue;
        }
        return value >= otherValue;
      }
      return true;
    });
    
    return (
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "font-medium",
          isBestValue && feature.type === 'number' && "text-green-600"
        )}
      >
        {formattedValue}
      </motion.span>
    );
  };
  
  // Graphique de comparaison radar simplifié
  const RadarChart = () => {
    const metrics = [
      { label: 'Prix', key: 'price' },
      { label: 'Data', key: 'data' },
      { label: 'Réseau', key: 'network' },
      { label: 'Extras', key: 'extras' },
      { label: 'Valeur', key: 'value' }
    ];
    
    const getScores = (plan: UnifiedMobilePlan) => {
      const price = parseFloat(plan.price);
      const data = parseInt(plan.data) || 0;
      
      return {
        price: Math.max(0, 100 - (price * 2)), // Inversé
        data: Math.min(100, data),
        network: (plan as any).networkType === '5G' ? 100 : 60,
        extras: plan.features.length * 10,
        value: calculatePlanScore(plan) / 2
      };
    };
    
    const plansScores = plans.map(plan => ({
      plan,
      scores: getScores(plan)
    }));
    
    return (
      <div className="relative h-64 flex items-center justify-center">
        <div className="space-y-4 w-full">
          {metrics.map(metric => (
            <div key={metric.key} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{metric.label}</span>
              </div>
              <div className="relative">
                {plansScores.map((planScore, index) => (
                  <motion.div
                    key={planScore.plan.id}
                    initial={{ width: 0 }}
                    animate={{ width: `${planScore.scores[metric.key as keyof typeof planScore.scores]}%` }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "absolute h-6 rounded-full flex items-center px-2",
                      index === 0 && "bg-indigo-500 z-30",
                      index === 1 && "bg-purple-500 z-20 top-7",
                      index === 2 && "bg-pink-500 z-10 top-14"
                    )}
                  >
                    <span className="text-xs text-white font-medium">
                      {planScore.plan.operator.split(' ')[0]}
                    </span>
                  </motion.div>
                ))}
                <div className="h-6 bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Gestion du clic CTA
  const handleCtaClick = (plan: UnifiedMobilePlan) => {
    if (!plan.affiliate_url) return;
    
    const phoneData = {
      id: plan.id.toString(),
      title: plan.name,
      trademark: plan.operator,
      price: parseFloat(plan.price),
      affiliateUrl: plan.affiliate_url
    };
    
    if (isTimeOnePlan(plan)) {
      trackClick(phoneData as any, plan.affiliate_url);
      toast({
        title: "Redirection en cours",
        description: `Vous allez être redirigé vers l'offre ${plan.operator}`,
        duration: 2000,
      });
    } else {
      window.open(plan.affiliate_url, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Comparaison des forfaits
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} className="mt-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Détails complets
              </TabsTrigger>
              <TabsTrigger value="recommendation" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Recommandation
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-6 pb-6">
          <AnimatePresence mode="wait">
            {/* Vue d'ensemble */}
            {selectedTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 py-4"
              >
                {/* Cartes des forfaits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan, index) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "relative p-4 rounded-xl border-2 transition-all",
                        bestPlan?.id === plan.id 
                          ? "border-green-500 bg-green-50" 
                          : "border-gray-200 bg-white"
                      )}
                    >
                      {bestPlan?.id === plan.id && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Meilleur choix
                        </Badge>
                      )}
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">{plan.name}</h3>
                          <p className="text-sm text-gray-500">{plan.operator}</p>
                        </div>
                        
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-indigo-600">
                            {plan.price}€
                          </span>
                          <span className="text-sm text-gray-500">/mois</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <Wifi className="w-3 h-3 mr-1" />
                            {plan.data}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Signal className="w-3 h-3 mr-1" />
                            {(plan as any).networkType || '4G'}
                          </Badge>
                          {isTimeOnePlan(plan) && (plan as any).commission && (
                            <Badge className="text-xs bg-orange-100 text-orange-700">
                              <Star className="w-3 h-3 mr-1" />
                              +{(plan as any).commission}€
                            </Badge>
                          )}
                        </div>
                        
                        {/* Score visuel */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Score global</span>
                            <span className="font-medium">
                              {Math.round(calculatePlanScore(plan))}
                            </span>
                          </div>
                        
                        </div>
                        
                        <Button
                          onClick={() => handleCtaClick(plan)}
                          size="sm"
                          className="w-full"
                          variant={bestPlan?.id === plan.id ? "default" : "outline"}
                        >
                          Voir l'offre
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Graphique de comparaison */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-indigo-600" />
                    Analyse comparative
                  </h3>
                  <RadarChart />
                </div>
              </motion.div>
            )}
            
            {/* Détails complets */}
            {selectedTab === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-4"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium text-gray-700">
                          Caractéristique
                        </th>
                        {plans.map(plan => (
                          <th key={plan.id} className="text-center p-3 font-medium">
                            <div className="space-y-1">
                              <div className="text-sm">{plan.name}</div>
                              <div className="text-xs text-gray-500 font-normal">
                                {plan.operator}
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Grouper par catégorie */}
                      {(['essential', 'network', 'extras', 'pricing'] as const).map(category => {
                        const categoryFeatures = comparisonFeatures.filter(f => f.category === category);
                        const categoryLabels = {
                          essential: 'Essentiel',
                          network: 'Réseau',
                          extras: 'Options',
                          pricing: 'Tarification'
                        };
                        
                        return (
                          <React.Fragment key={category}>
                            <tr>
                              <td colSpan={plans.length + 1} className="pt-4 pb-2">
                                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                  {categoryLabels[category]}
                                </h4>
                              </td>
                            </tr>
                            {categoryFeatures.map((feature, index) => (
                              <motion.tr
                                key={feature.label}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-b border-gray-100 hover:bg-gray-50"
                              >
                                <td className="p-3 text-sm text-gray-700">
                                  <div className="flex items-center gap-2">
                                    {feature.icon}
                                    {feature.label}
                                  </div>
                                </td>
                                {plans.map(plan => (
                                  <td key={plan.id} className="p-3 text-center">
                                    {renderComparisonValue(plan, feature)}
                                  </td>
                                ))}
                              </motion.tr>
                            ))}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
            
            {/* Recommandation */}
            {selectedTab === 'recommendation' && bestPlan && (
              <motion.div
                key="recommendation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 py-4"
              >
                {/* Carte de recommandation */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-500 rounded-xl text-white">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Notre recommandation : {bestPlan.name}
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Basé sur votre sélection, ce forfait offre le meilleur équilibre entre prix, 
                        volume de données et fonctionnalités.
                      </p>
                      
                      {/* Points forts */}
                      <div className="space-y-2 mb-4">
                        <h4 className="font-semibold text-sm text-gray-700">Points forts :</h4>
                        <ul className="space-y-1">
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 mt-0.5" />
                            <span className="text-sm">
                              Excellent rapport qualité/prix ({bestPlan.price}€ pour {bestPlan.data})
                            </span>
                          </li>
                          {(bestPlan as any).networkType === '5G' && (
                            <li className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 mt-0.5" />
                              <span className="text-sm">Réseau 5G inclus</span>
                            </li>
                          )}
                          {bestPlan.features.some(f => f.includes('Sans engagement')) && (
                            <li className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 mt-0.5" />
                              <span className="text-sm">Sans engagement</span>
                            </li>
                          )}
                          {isTimeOnePlan(bestPlan) && (bestPlan as any).commission && (
                            <li className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 mt-0.5" />
                              <span className="text-sm">
                                Commission de {(bestPlan as any).commission}€ reversée
                              </span>
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <Button
                        onClick={() => handleCtaClick(bestPlan)}
                        className="w-full md:w-auto"
                      >
                        Souscrire à cette offre
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Alternatives */}
                {plans.filter(p => p.id !== bestPlan.id).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Autres options à considérer :</h4>
                    <div className="space-y-3">
                      {plans.filter(p => p.id !== bestPlan.id).map(plan => (
                        <div key={plan.id} className="p-4 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium">{plan.name}</h5>
                              <p className="text-sm text-gray-500">{plan.operator}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-lg">{plan.price}€</div>
                              <div className="text-xs text-gray-500">{plan.data}</div>
                            </div>
                          </div>
                          
                          {/* Différences avec le meilleur plan */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {parseFloat(plan.price) < parseFloat(bestPlan.price) && (
                              <Badge variant="outline" className="text-xs">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Moins cher
                              </Badge>
                            )}
                            {parseInt(plan.data) > parseInt(bestPlan.data) && (
                              <Badge variant="outline" className="text-xs">
                                <Wifi className="w-3 h-3 mr-1" />
                                Plus de data
                              </Badge>
                            )}
                            {(plan as any).networkType === '5G' && (bestPlan as any).networkType !== '5G' && (
                              <Badge variant="outline" className="text-xs">
                                <Zap className="w-3 h-3 mr-1" />
                                5G incluse
                              </Badge>
                            )}
                          </div>
                          
                          <Button
                            onClick={() => handleCtaClick(plan)}
                            variant="outline"
                            size="sm"
                            className="w-full mt-3"
                          >
                            Voir cette offre
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ComparisonModal;