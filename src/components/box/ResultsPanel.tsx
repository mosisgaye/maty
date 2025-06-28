// components/box/ResultsPanel.tsx
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, SortOption, SORT_OPTIONS } from '@/types/box';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import BoxCard from './BoxCard';
import { 
  Grid2X2, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  Eye,
  EyeOff
} from 'lucide-react';

interface ResultsPanelProps {
  boxes: Box[];
  totalBoxes: number;
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
  isLoading: boolean;
  comparisonList: string[];
  toggleComparison: (id: string) => void;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onToggleFilters: () => void;
  filtersOpen: boolean;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  boxes,
  totalBoxes,
  sortOption,
  setSortOption,
  isLoading,
  comparisonList,
  toggleComparison,
  currentPage,
  totalPages,
  itemsPerPage,
  onToggleFilters,
  filtersOpen
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  // Gestion de la pagination
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    
    const queryString = params.toString();
    const url = queryString ? `/box-internet?${queryString}` : '/box-internet';
    router.push(url, { scroll: false });
  };

  // Calculer les numéros de page à afficher
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    
    if (currentPage - delta > 2) {
      range.unshift('...' as any);
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...' as any);
    }
    
    range.unshift(1);
    if (totalPages !== 1) {
      range.push(totalPages);
    }
    
    return range.filter((item, index, arr) => arr.indexOf(item) === index);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalBoxes);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec contrôles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          {/* Bouton toggle filtres - Desktop seulement */}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFilters}
            className="hidden lg:flex items-center gap-2"
          >
            {filtersOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {filtersOpen ? 'Masquer' : 'Afficher'} filtres
          </Button>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalBoxes} box{totalBoxes > 1 ? 'es' : ''} disponible{totalBoxes > 1 ? 's' : ''}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Page {currentPage} sur {totalPages} - Affichage {startIndex + 1}-{endIndex} résultats
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Sélecteur de tri */}
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Toggle vue */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
            <Button
              variant={viewType === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('grid')}
              className="rounded-r-none"
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewType === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Résultats */}
      {boxes.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <SlidersHorizontal className="w-12 h-12 text-gray-400" />
            <div>
              <p className="text-lg text-muted-foreground mb-2">
                Aucune box ne correspond à vos critères de recherche.
              </p>
              <p className="text-sm text-gray-500">
                Essayez d'ajuster vos filtres pour voir plus d'offres.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Grille de box */}
          <div className={
            viewType === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
          }>
            {boxes.map((box) => (
              <BoxCard
                key={box.id}
                box={box}
                viewType={viewType}
                isInComparison={comparisonList.includes(box.id.toString())}
                onCompareToggle={() => toggleComparison(box.id.toString())}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              {/* Info pagination mobile */}
              <p className="text-sm text-muted-foreground sm:hidden">
                Page {currentPage} sur {totalPages}
              </p>
              
              {/* Contrôles pagination */}
              <div className="flex items-center gap-2">
                {/* Bouton Précédent */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Précédent</span>
                </Button>

                {/* Numéros de page */}
                {getPageNumbers().map((pageNum, index) => {
                  if (pageNum === '...') {
                    return (
                      <span key={`ellipsis-${index}`} className="text-muted-foreground px-2">
                        ...
                      </span>
                    );
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNum as number)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                {/* Bouton Suivant */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  <span className="hidden sm:inline">Suivant</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Info pagination desktop */}
              <p className="text-sm text-muted-foreground hidden sm:block">
                Affichage {startIndex + 1}-{endIndex} sur {totalBoxes} résultats
              </p>
            </div>
          )}

          {/* SEO Text (caché visuellement mais lisible par Google) */}
          <div className="sr-only">
            <h3>Navigation des pages de box internet</h3>
            <p>
              Parcourez notre catalogue de {totalBoxes} box internet et fibre. 
              Page actuelle : {currentPage} sur {totalPages}.
              {currentPage < totalPages && (
                <> Page suivante disponible avec {totalBoxes - endIndex} box supplémentaires.</>
              )}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ResultsPanel;