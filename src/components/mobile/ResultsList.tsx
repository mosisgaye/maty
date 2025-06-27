import React, { memo } from 'react';
import { Info } from 'lucide-react';
import PlanCard, { PlanCardSkeleton } from '@/components/ui/PlanCard';
import { MobilePlan, UnifiedMobilePlan, isTimeOnePlan } from '@/types/mobile';

interface ResultsListProps {
  filteredPlans: UnifiedMobilePlan[];
  isLoading?: boolean;
  showSource?: boolean;
}

const ResultsList = ({ filteredPlans, isLoading = false, showSource = true }: ResultsListProps) => {
  // Show skeletons when loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <PlanCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Organiser les plans par source et opérateur
  const supabasePlans = filteredPlans.filter(plan => !isTimeOnePlan(plan)) as MobilePlan[];
  const timeOnePlans = filteredPlans.filter(plan => isTimeOnePlan(plan));
  
  // Grouper les plans TimeOne par opérateur
  const timeOnePlansByOperator = timeOnePlans.reduce((acc, plan) => {
    if (!acc[plan.operator]) {
      acc[plan.operator] = [];
    }
    acc[plan.operator].push(plan);
    return acc;
  }, {} as Record<string, typeof timeOnePlans>);

  // Fonction pour rendre une section de plans
  const renderPlanSection = (plans: UnifiedMobilePlan[], title?: string, showBadge?: boolean, operator?: string) => {
    if (plans.length === 0) return null;

    return (
      <div key={operator || title} className="space-y-4">
        {title && showSource && (
          <div className="flex items-center gap-2 px-1">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {showBadge && (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                Offres partenaires
              </span>
            )}
            <div className="flex-1 h-px bg-border"></div>
          </div>
        )}
        <div className="space-y-4">
          {plans.map((plan) => (
            <PlanCard 
              key={`${isTimeOnePlan(plan) ? 'timeone' : 'supabase'}-${plan.id}`} 
              plan={plan} 
              showSource={showSource}
            />
          ))}
        </div>
      </div>
    );
  };

  // Ordre de priorité des opérateurs (B&YOU en premier)
  const operatorPriority: Record<string, number> = {
    'Bouygues Telecom': 1,
    'SFR': 2,
    'Youprice': 3,
    'Auchan Télécom': 4,
  };

  // Trier les opérateurs par priorité
  const sortedOperators = Object.keys(timeOnePlansByOperator).sort(
    (a, b) => (operatorPriority[a] || 999) - (operatorPriority[b] || 999)
  );

  return (
    <div className="space-y-8">
      {filteredPlans.length > 0 ? (
        <>
          {/* Affichage organisé par source si showSource est activé */}
          {showSource ? (
            <>
              {/* Plans TimeOne par opérateur - prioritaires */}
              {sortedOperators.map(operator => {
                const plans = timeOnePlansByOperator[operator];
                const sectionTitle = operator === 'Bouygues Telecom' ? 'Offres B&YOU' : `Offres ${operator}`;
                
                return renderPlanSection(
                  plans, 
                  sectionTitle, 
                  true,
                  operator
                );
              })}
              
              {/* Plans Supabase ensuite */}
              {renderPlanSection(supabasePlans, "Autres offres", false, "supabase")}
            </>
          ) : (
            /* Affichage mixte sans séparation */
            <div className="space-y-6">
              {filteredPlans.map((plan) => (
                <PlanCard 
                  key={`${isTimeOnePlan(plan) ? 'timeone' : 'supabase'}-${plan.id}`} 
                  plan={plan} 
                  showSource={showSource}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg">
          <Info className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">Aucun forfait trouvé</h3>
          <p className="text-muted-foreground text-center mt-1">
            Essayez d'élargir vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(ResultsList);