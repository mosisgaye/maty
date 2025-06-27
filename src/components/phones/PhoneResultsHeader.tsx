
import React from 'react';
import { 
  SortAsc, SortDesc, Star
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SortOption } from '@/types/phones';

interface PhoneResultsHeaderProps {
  isLoading: boolean;
  phonesCount: number;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const PhoneResultsHeader = ({
  isLoading,
  phonesCount,
  sortOption,
  setSortOption
}: PhoneResultsHeaderProps) => {
  return (
    <div className="flex justify-between items-center py-3 mb-4 border-b">
      <div className="flex items-center">
        {isLoading ? (
          <Skeleton className="h-6 w-32" />
        ) : (
          <h2 className="font-medium text-lg">
            {phonesCount} téléphones
          </h2>
        )}
      </div>
      
      <div className="flex items-center">
        <Select
          value={sortOption}
          onValueChange={(value) => setSortOption(value as SortOption)}
        >
          <SelectTrigger className="w-auto border-none">
            <span className="text-sm font-medium mr-1">Trier par</span>
            <SelectValue placeholder="Meilleures ventes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Meilleures ventes</SelectItem>
            <SelectItem value="price-asc">
              <span className="flex items-center">
                <SortAsc className="mr-2 h-4 w-4" />
                Prix croissant
              </span>
            </SelectItem>
            <SelectItem value="price-desc">
              <span className="flex items-center">
                <SortDesc className="mr-2 h-4 w-4" />
                Prix décroissant
              </span>
            </SelectItem>
            <SelectItem value="rating-desc">
              <span className="flex items-center">
                <Star className="mr-2 h-4 w-4" />
                Meilleures notes
              </span>
            </SelectItem>
            <SelectItem value="newest">Nouveautés</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PhoneResultsHeader;
