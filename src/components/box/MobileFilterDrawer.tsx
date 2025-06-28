import React from 'react';
import { BoxFilters } from '@/types/box';
import { X as CloseIcon } from 'lucide-react';
import { Box } from '@/types/box';
import { Button } from '@/components/ui/button';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: BoxFilters;
  setFilters: (filters: BoxFilters) => void;
  onReset: () => void;
  activeFiltersCount: number;
  availableBoxes: Box[];
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  onReset,
  activeFiltersCount,
  availableBoxes
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Filtres
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <CloseIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* Technologie */}
              <div>
                <h3 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
                  Technologie
                </h3>
                <div className="space-y-2">
                  {['all', 'Fibre', '5G', 'ADSL'].map((tech) => (
                    <label key={tech} className="flex items-center">
                      <input
                        type="radio"
                        name="technology"
                        value={tech}
                        checked={filters.technology === tech}
                        onChange={(e) => setFilters({ ...filters, technology: e.target.value as any })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {tech === 'all' ? 'Toutes' : tech}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div>
                <h3 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
                  Prix max: {filters.priceRange[0]}€/mois
                </h3>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={filters.priceRange[0]}
                  onChange={(e) => setFilters({ ...filters, priceRange: [parseInt(e.target.value)] })}
                  className="w-full"
                />
              </div>

              {/* Engagement */}
              <div>
                <h3 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
                  Engagement
                </h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Tous' },
                    { value: 'without', label: 'Sans engagement' },
                    { value: 'with', label: 'Avec engagement' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="engagement"
                        value={option.value}
                        checked={filters.engagement === option.value}
                        onChange={(e) => setFilters({ ...filters, engagement: e.target.value as any })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* TV */}
              <div>
                <h3 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
                  Télévision
                </h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Tous' },
                    { value: 'with', label: 'Avec TV' },
                    { value: 'without', label: 'Internet seul' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="tv"
                        value={option.value}
                        checked={filters.tvIncluded === option.value}
                        onChange={(e) => setFilters({ ...filters, tvIncluded: e.target.value as any })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                onClick={onReset}
                className="w-full"
              >
                Réinitialiser ({activeFiltersCount})
              </Button>
            )}
            <Button
              onClick={onClose}
              className="w-full"
            >
              Voir les résultats
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterDrawer;

