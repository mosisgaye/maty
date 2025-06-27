import React from 'react';
import { ArrowDownAZ, ArrowUpZA, Signal, Wifi, Star, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SortOption, UnifiedMobilePlan, isTimeOnePlan } from '@/types/mobile';
import { Skeleton } from '@/components/ui/skeleton';

interface ResultsHeaderProps {
  filteredPlans: UnifiedMobilePlan[];
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  isLoading?: boolean;
  showSourceBreakdown?: boolean;
}

const ResultsHeader = ({ 
  filteredPlans, 
  sortOption, 
  setSortOption, 
  isLoading = false,
  showSourceBreakdown = true 
}: ResultsHeaderProps) => {
  
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-card border border-border rounded-lg shadow-sm">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          {showSourceBreakdown && (
            <div className="flex gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-28" />
            </div>
          )}
        </div>
        <Skeleton className="h-9 w-48 mt-3 md:mt-0" />
      </div>
    );
  }

  // Calculer les statistiques par source et opérateur
  const timeOnePlans = filteredPlans.filter(plan => isTimeOnePlan(plan));
  const supabasePlans = filteredPlans.filter(plan => !isTimeOnePlan(plan));
  const totalCount = filteredPlans.length;
  
  // Statistiques des opérateurs TimeOne
  const operatorStats = timeOnePlans.reduce((acc, plan) => {
    acc[plan.operator] = (acc[plan.operator] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculer la commission potentielle totale
  const totalCommission = timeOnePlans.reduce((sum, plan) => {
    return sum + (isTimeOnePlan(plan) ? plan.commission : 0);
  }, 0);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">
          {totalCount} forfait{totalCount !== 1 ? 's' : ''} trouvé{totalCount !== 1 ? 's' : ''}
        </h2>
        
        {showSourceBreakdown && totalCount > 0 && (
          <div className="flex flex-wrap gap-2 text-sm">
            {supabasePlans.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {supabasePlans.length} offre{supabasePlans.length !== 1 ? 's' : ''} générale{supabasePlans.length !== 1 ? 's' : ''}
              </Badge>
            )}
            
            {/* Afficher par opérateur TimeOne */}
            {Object.entries(operatorStats).map(([operator, count]) => (
              <Badge key={operator} variant="default" className="text-xs bg-orange-500 hover:bg-orange-600">
                <Star className="w-3 h-3 mr-1" />
                {count} {operator === 'Bouygues Telecom' ? 'B&YOU' : operator}
              </Badge>
            ))}
            
            {totalCommission > 0 && (
              <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                <TrendingUp className="w-3 h-3 mr-1" />
                {totalCommission}€ potentiel
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 md:mt-0">
        <Select
          value={sortOption}
          onValueChange={(value) => setSortOption(value as SortOption)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Trier par..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">
              <div className="flex items-center">
                <ArrowDownAZ className="mr-2 h-4 w-4" />
                Prix croissant
              </div>
            </SelectItem>
            <SelectItem value="price-desc">
              <div className="flex items-center">
                <ArrowUpZA className="mr-2 h-4 w-4" />
                Prix décroissant
              </div>
            </SelectItem>
            <SelectItem value="data-asc">
              <div className="flex items-center">
                <Wifi className="mr-2 h-4 w-4" />
                Data croissante
              </div>
            </SelectItem>
            <SelectItem value="data-desc">
              <div className="flex items-center">
                <Wifi className="mr-2 h-4 w-4" />
                Data décroissante
              </div>
            </SelectItem>
            {/* Tri par commission (pour TimeOne) */}
            <SelectItem value="commission-desc">
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Commission
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ResultsHeader;