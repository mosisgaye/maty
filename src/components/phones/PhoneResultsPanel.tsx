// components/phones/PhoneResultsPanel.tsx
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone } from '@/types/phones';
import { SortOption } from '@/types/phones';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import PhoneCard from './PhoneCard';
import { Grid2X2, List, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhoneResultsPanelProps {
  phones: Phone[];
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
  isLoading: boolean;
  comparisonList: string[];
  toggleComparison: (id: string) => void;
}

const PHONES_PER_PAGE = 30; // Nombre de téléphones par page

const PhoneResultsPanel: React.FC<PhoneResultsPanelProps> = ({
  phones,
  sortOption,
  setSortOption,
  isLoading,
  comparisonList,
  toggleComparison
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  
  // Récupérer la page actuelle depuis l'URL
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  
  // Calculer les données de pagination
  const totalPages = Math.ceil(phones.length / PHONES_PER_PAGE);
  const startIndex = (currentPage - 1) * PHONES_PER_PAGE;
  const endIndex = startIndex + PHONES_PER_PAGE;
  const currentPhones = phones.slice(startIndex, endIndex);
  
  // Gérer le changement de page
  const handlePageChange = (newPage: number) => {
    // Créer les nouveaux paramètres d'URL
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    
    // Naviguer vers la nouvelle URL
    router.push(`/telephones?${params.toString()}`, { scroll: false });
    
    // Scroll en haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Reset à la page 1 quand les filtres changent
  useEffect(() => {
    if (currentPage > 1 && currentPage > totalPages) {
      handlePageChange(1);
    }
  }, [phones.length]);
  
  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 space-y-6">
      {/* Header avec contrôles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {phones.length} téléphones disponibles
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Page {currentPage} sur {totalPages} - Affichage {startIndex + 1}-{Math.min(endIndex, phones.length)} résultats
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Sélecteur de tri */}
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularité</SelectItem>
              <SelectItem value="price-asc">Prix croissant</SelectItem>
              <SelectItem value="price-desc">Prix décroissant</SelectItem>
              <SelectItem value="rating">Meilleures notes</SelectItem>
              <SelectItem value="newest">Plus récents</SelectItem>
              <SelectItem value="discount">Meilleures offres</SelectItem>
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
      {currentPhones.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-lg text-muted-foreground">
            Aucun téléphone ne correspond à vos critères de recherche.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Réinitialiser les filtres
          </Button>
        </Card>
      ) : (
        <>
          {/* Grille de téléphones */}
          <div className={
            viewType === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
          }>
            {currentPhones.map((phone) => (
              <PhoneCard
                key={phone.id}
                phone={phone}
                viewType={viewType}
                isInComparison={comparisonList.includes(phone.id)}
                onCompareToggle={() => toggleComparison(phone.id)}
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

                {/* Première page si nécessaire */}
                {getPageNumbers()[0] > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      className="w-10"
                    >
                      1
                    </Button>
                    {getPageNumbers()[0] > 2 && (
                      <span className="text-muted-foreground">...</span>
                    )}
                  </>
                )}

                {/* Numéros de page */}
                {getPageNumbers().map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                ))}

                {/* Dernière page si nécessaire */}
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                  <>
                    {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                      <span className="text-muted-foreground">...</span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      className="w-10"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}

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
                Affichage {startIndex + 1}-{Math.min(endIndex, phones.length)} sur {phones.length} résultats
              </p>
            </div>
          )}

          {/* SEO Text (caché visuellement mais lisible par Google) */}
          <div className="sr-only">
            <h3>Navigation des pages de téléphones</h3>
            <p>
              Parcourez notre catalogue de {phones.length} téléphones avec forfait. 
              Page actuelle : {currentPage} sur {totalPages}.
              {currentPage < totalPages && (
                <> Page suivante disponible avec {phones.length - endIndex} téléphones supplémentaires.</>
              )}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default PhoneResultsPanel;