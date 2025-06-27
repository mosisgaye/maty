import React from 'react';
import { Button } from "@/components/ui/button";

interface PhonePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PhonePagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: PhonePaginationProps) => {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Précédent
      </Button>
      
      <div className="flex items-center space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
          .map((p, i, arr) => (
            <React.Fragment key={`page-${p}`}>
              {i > 0 && arr[i - 1] !== p - 1 && (
                <span key={`ellipsis-${p}`} className="px-2 text-muted-foreground">...</span>
              )}
              <Button
                key={`button-${p}`}
                variant={p === currentPage ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => onPageChange(p)}
              >
                {p}
              </Button>
            </React.Fragment>
          ))}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Suivant
      </Button>
    </div>
  );
};

export default PhonePagination;