import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import PhoneCard from './PhoneCard';
import PhoneEmptyState from './PhoneEmptyState';
import PhonePagination from './PhonePagination';
import { Phone } from '@/types/phones';

interface PhoneResultsProps {
  phones: Phone[];
  isLoading: boolean;
  paginatedPhones: Phone[];
  comparisonList: string[];
  toggleComparison: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  viewType: 'grid' | 'list';
}

const PhoneResults = ({
  phones,
  isLoading,
  paginatedPhones,
  comparisonList,
  toggleComparison,
  page,
  totalPages,
  onPageChange,
  viewType
}: PhoneResultsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 h-full">
              <Skeleton className="h-40 w-full mb-4" />
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-5 w-1/3 mb-2" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (phones.length === 0) {
    return <PhoneEmptyState />;
  }
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPhones.map((phone) => (
          <PhoneCard 
            key={phone.id}
            phone={phone}
            viewType={viewType}
            isInComparison={comparisonList.includes(phone.id)}
            onCompareToggle={() => toggleComparison(phone.id)}
          />
        ))}
      </div>
      
      <PhonePagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={onPageChange} 
      />
    </>
  );
};

export default PhoneResults;