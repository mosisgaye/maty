
import React, { useState } from 'react';
import PhoneResultsHeader from './PhoneResultsHeader';
import PhoneComparisonButton from './PhoneComparisonButton';
import PhoneResults from './PhoneResults';
import ViewerCounter from '../common/ViewerCounter';
import ExpertInsight from '../common/ExpertInsight';
import { Phone, SortOption } from '@/types/phones';

interface PhoneResultsPanelProps {
  phones: Phone[];
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  isLoading: boolean;
  comparisonList: string[];
  toggleComparison: (id: string) => void;
}

const PhoneResultsPanel = ({
  phones,
  sortOption,
  setSortOption,
  isLoading,
  comparisonList,
  toggleComparison
}: PhoneResultsPanelProps) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const phonesPerPage = 9; // 3x3 grid
  
  // Get comparison phones
  const comparisonPhones = phones.filter(phone => 
    comparisonList.includes(phone.id)
  );
  
  // Get the first phone for the viewer counter and expert insight
  const featuredPhone = phones.length > 0 ? phones[0] : null;
  
  // Expert insights for different phone brands
  const getExpertInsight = (trademark: string) => {
    const insights: Record<string, string> = {
      'Apple': "Les iPhone offrent l'écosystème le plus fluide et une longévité exceptionnelle avec des mises à jour pendant 5+ ans, idéal pour ceux qui valorisent simplicité et durabilité.",
      'Samsung': "Les Galaxy S et Note excellent en photographie et innovation, avec un excellent équilibre entre performances et personnalisation pour les utilisateurs avancés.",
      'Xiaomi': "Offre un rapport qualité-prix imbattable avec des performances proches des flagships pour une fraction du prix, parfait pour les budgets limités.",
      'Google': "Les Pixel proposent la meilleure expérience photo sur smartphone et Android dans sa forme la plus pure, idéal pour les amateurs de photographie.",
      'Sony': "Excellents pour les créateurs de contenu avec des écrans professionnels et des capacités audio exceptionnelles, parfaits pour les cinéphiles et audiophiles."
    };
    
    return insights[trademark] || 
      "Ce modèle offre un excellent équilibre entre performances, fonctionnalités et prix dans sa catégorie, correspondant aux besoins de la majorité des utilisateurs.";
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(phones.length / phonesPerPage);
  const startIndex = (page - 1) * phonesPerPage;
  const paginatedPhones = phones.slice(startIndex, startIndex + phonesPerPage);
  
  // Page change handler
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="lg:col-span-3">
      {/* Results Header */}
      <PhoneResultsHeader 
        isLoading={isLoading}
        phonesCount={phones.length}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* Comparison selection reminder */}
      <PhoneComparisonButton 
        comparisonList={comparisonList}
        comparisonPhones={comparisonPhones}
      />
      
      {featuredPhone && !isLoading && (
        <div className="space-y-4 mb-6">
          <ViewerCounter 
            operatorName={featuredPhone.trademark} 
            productType="téléphone" 
            className="border border-muted bg-card"
          />
          
          <ExpertInsight 
            operatorName={featuredPhone.trademark}
            productType="téléphone"
            insight={getExpertInsight(featuredPhone.trademark)}
            expertName="Claire Dupont"
            expertTitle="Spécialiste Tech"
          />
        </div>
      )}

      {/* Results Content */}
      <PhoneResults
        phones={phones}
        isLoading={isLoading}
        paginatedPhones={paginatedPhones}
        comparisonList={comparisonList}
        toggleComparison={toggleComparison}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        viewType={view}
      />
    </div>
  );
};

export default PhoneResultsPanel;
