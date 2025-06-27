import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDownAZ, ArrowUpZA, Signal, Wifi, Star, TrendingUp,
  Grid3X3, List, SlidersHorizontal, Eye, EyeOff, Sparkles,
  BarChart3, Filter, X, ChevronLeft, ChevronRight, Info,
  Loader2, Search, Euro
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { SortOption, UnifiedMobilePlan, isTimeOnePlan } from '@/types/mobile';
import PlanCard, { PlanCardSkeleton } from '@/components/ui/PlanCard';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResultsPanelProps {
  filteredPlans: UnifiedMobilePlan[];
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
  isLoading?: boolean;
  isFiltering?: boolean;
  showSourceBreakdown?: boolean;
  showSourceSections?: boolean;
  onCompare?: (plans: UnifiedMobilePlan[]) => void;
}



// Composant pour la barre de statistiques
const StatsBar: React.FC<{ plans: UnifiedMobilePlan[] }> = ({ plans }) => {
  const stats = useMemo(() => {
    const timeOnePlans = plans.filter(isTimeOnePlan);
    const operatorCounts = plans.reduce((acc, plan) => {
      acc[plan.operator] = (acc[plan.operator] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const totalCommission = timeOnePlans.reduce((sum, plan) => 
      sum + (plan.commission || 0), 0
    );
    
    return {
      total: plans.length,
      partner: timeOnePlans.length,
      standard: plans.length - timeOnePlans.length,
      operators: Object.keys(operatorCounts).length,
      commission: totalCommission,
      topOperator: Object.entries(operatorCounts).sort((a, b) => b[1] - a[1])[0]
    };
  }, [plans]);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="p-3 bg-white rounded-lg border border-gray-200 text-center"
      >
        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        <div className="text-xs text-gray-500">Forfaits totaux</div>
      </motion.div>
      
      {stats.partner > 0 && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-3 bg-orange-50 rounded-lg border border-orange-200 text-center"
        >
          <div className="text-2xl font-bold text-orange-700">{stats.partner}</div>
          <div className="text-xs text-orange-600">Offres partenaires</div>
        </motion.div>
      )}
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center"
      >
        <div className="text-2xl font-bold text-blue-700">{stats.operators}</div>
        <div className="text-xs text-blue-600">Opérateurs</div>
      </motion.div>
      
      {stats.commission > 0 && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-3 bg-green-50 rounded-lg border border-green-200 text-center"
        >
          <div className="text-2xl font-bold text-green-700">{stats.commission}€</div>
          <div className="text-xs text-green-600">Commission potentielle</div>
        </motion.div>
      )}
    </div>
  );
};

// Composant principal ResultsPanel
const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  filteredPlans, 
  sortOption, 
  setSortOption, 
  isLoading = false, 
  isFiltering = false,
  showSourceBreakdown = true,
  showSourceSections = true,
  onCompare
}) => {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showStats, setShowStats] = useState(true);
  const [selectedForComparison, setSelectedForComparison] = useState<UnifiedMobilePlan[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 6 : 12;
  
  // Pagination
  const paginatedPlans = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPlans.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPlans, currentPage, itemsPerPage]);
  
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  
  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredPlans.length]);
  
  // Gestion de la comparaison
  const handleCompareToggle = useCallback((plan: UnifiedMobilePlan) => {
    setSelectedForComparison(prev => {
      const isSelected = prev.some(p => p.id === plan.id);
      if (isSelected) {
        return prev.filter(p => p.id !== plan.id);
      }
      if (prev.length >= 3) {
        // Maximum 3 forfaits en comparaison
        return [...prev.slice(1), plan];
      }
      return [...prev, plan];
    });
  }, []);
  
  // Groupement des plans par source/opérateur
  const groupedPlans = useMemo(() => {
    if (!showSourceSections) return { all: paginatedPlans };
    
    const groups: Record<string, UnifiedMobilePlan[]> = {};
    
    // Grouper par opérateur pour les offres TimeOne
    const timeOnePlans = paginatedPlans.filter(isTimeOnePlan);
    const operatorGroups = timeOnePlans.reduce((acc, plan) => {
      const key = plan.operator;
      if (!acc[key]) acc[key] = [];
      acc[key].push(plan);
      return acc;
    }, {} as Record<string, UnifiedMobilePlan[]>);
    
    // Ordre de priorité des opérateurs
    const operatorPriority = ['Bouygues Telecom', 'SFR', 'Youprice', 'Auchan Télécom'];
    
    // Ajouter les groupes d'opérateurs dans l'ordre
    operatorPriority.forEach(operator => {
      if (operatorGroups[operator]) {
        groups[operator] = operatorGroups[operator];
      }
    });
    
    // Ajouter les plans standard
    const standardPlans = paginatedPlans.filter(p => !isTimeOnePlan(p));
    if (standardPlans.length > 0) {
      groups['Autres offres'] = standardPlans;
    }
    
    return groups;
  }, [paginatedPlans, showSourceSections]);
  
  // Animation des cartes
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  if (isLoading || isFiltering) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-60 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        
        {/* Cards skeleton */}
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        )}>
          {[...Array(6)].map((_, i) => (
            <PlanCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header avec contrôles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {filteredPlans.length} forfait{filteredPlans.length !== 1 ? 's' : ''} disponible{filteredPlans.length !== 1 ? 's' : ''}
            </h2>
            {showSourceBreakdown && (
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(groupedPlans).map(([key, plans]) => (
                  <Badge 
                    key={key}
                    variant="secondary" 
                    className={cn(
                      "text-xs",
                      key === 'Bouygues Telecom' && "bg-blue-100 text-blue-700",
                      key === 'SFR' && "bg-red-100 text-red-700",
                      key === 'Orange' && "bg-orange-100 text-orange-700",
                      key === 'Free' && "bg-gray-100 text-gray-700",
                      key === 'Auchan Télécom' && "bg-green-100 text-green-700",
                      key === 'Youprice' && "bg-purple-100 text-purple-700",
                      key === 'Autres offres' && "bg-gray-100 text-gray-600"
                    )}
                  >
                    {key}: {plans.length}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Toggle stats */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className="hidden md:flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              {showStats ? 'Masquer' : 'Afficher'} stats
            </Button>
            
            {/* View mode toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-3"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Sort dropdown */}
            <Select
              value={sortOption}
              onValueChange={(value) => setSortOption(value as SortOption)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">
                  <div className="flex items-center gap-2">
                    <ArrowDownAZ className="w-4 h-4" />
                    Prix croissant
                  </div>
                </SelectItem>
                <SelectItem value="price-desc">
                  <div className="flex items-center gap-2">
                    <ArrowUpZA className="w-4 h-4" />
                    Prix décroissant
                  </div>
                </SelectItem>
                <SelectItem value="data-asc">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    Data croissante
                  </div>
                </SelectItem>
                <SelectItem value="data-desc">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    Data décroissante
                  </div>
                </SelectItem>
                <SelectItem value="commission-desc">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Commission élevée
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Barre de stats animée */}
      <AnimatePresence>
        {showStats && filteredPlans.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StatsBar plans={filteredPlans} />
          </motion.div>
        )}
      </AnimatePresence>
  
      
      {/* Barre de comparaison */}
      <AnimatePresence>
        {selectedForComparison.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 z-40"
          >
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">
                  Comparer {selectedForComparison.length} forfait{selectedForComparison.length > 1 ? 's' : ''}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedForComparison([])}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 mb-3">
                {selectedForComparison.map(plan => (
                  <div key={plan.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{plan.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCompareToggle(plan)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => onCompare?.(selectedForComparison)}
                className="w-full"
                disabled={selectedForComparison.length < 2}
              >
                Comparer maintenant
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Résultats */}
      {filteredPlans.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 px-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <Filter className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun forfait trouvé
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Aucun forfait ne correspond à vos critères actuels. 
            Essayez d'élargir votre recherche en modifiant les filtres.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="default">
              Réinitialiser les filtres
            </Button>
            <Button variant="outline">
              Voir tous les forfaits
            </Button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Vue en sections ou mixte */}
          {showSourceSections && Object.keys(groupedPlans).length > 1 ? (
            <div className="space-y-8">
              {Object.entries(groupedPlans).map(([groupName, plans]) => (
                <motion.div
                  key={groupName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{groupName}</h3>
                    <div className="flex-1 h-px bg-gray-200" />
                    {groupName !== 'Autres offres' && (
                      <Badge className="bg-orange-100 text-orange-700">
                        <Star className="w-3 h-3 mr-1" />
                        Partenaire
                      </Badge>
                    )}
                  </div>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className={cn(
                      "grid gap-6",
                      viewMode === 'grid' 
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                        : "grid-cols-1"
                    )}
                  >
                    {plans.map(plan => (
                      <motion.div key={plan.id} variants={itemVariants}>
                        <PlanCard 
                          plan={plan} 
                          showSource={false}
                          variant={viewMode === 'list' ? 'compact' : 'default'}
                          onCompare={handleCompareToggle}
                          isComparing={selectedForComparison.some(p => p.id === plan.id)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className={cn(
                "grid gap-6",
                viewMode === 'grid' 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              )}
            >
              {paginatedPlans.map(plan => (
                <motion.div key={plan.id} variants={itemVariants}>
                  <PlanCard 
                    plan={plan} 
                    showSource={showSourceBreakdown}
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                    onCompare={handleCompareToggle}
                    isComparing={selectedForComparison.some(p => p.id === plan.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 mt-8"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  const isActive = page === currentPage;
                  const isNearby = Math.abs(page - currentPage) <= 1;
                  const isEdge = page === 1 || page === totalPages;
                  
                  if (!isActive && !isNearby && !isEdge) {
                    if (page === 2 || page === totalPages - 1) {
                      return <span key={page} className="px-1 text-gray-400">...</span>;
                    }
                    return null;
                  }
                  
                  return (
                    <Button
                      key={page}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "h-8 w-8 p-0",
                        isActive && "pointer-events-none"
                      )}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default ResultsPanel;