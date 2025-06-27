
import React from 'react';
import { Star, Leaf } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Format price with Euro symbol
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(price);
};

// Generate stars for rating
export const renderRating = (rating: number = 0, reviewCount: number = 0) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= Math.floor(rating)
              ? 'text-yellow-400 fill-yellow-400'
              : star - 0.5 <= rating
              ? 'text-yellow-400 fill-yellow-400/50'
              : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      ))}
      {reviewCount > 0 && (
        <span className="ml-1 text-sm text-muted-foreground">
          ({reviewCount} avis)
        </span>
      )}
    </div>
  );
};

// Extract promotion tag from description
export const getPromotionTag = (description: string, discount?: number) => {
  if (description.includes("OFFERTE")) {
    return "GALAXY TABS6 LITE 2024 OFFERTE";
  }
  
  if (discount) {
    if (discount >= 100) {
      return `-100€ REMISE IMMÉDIATE`;
    } else if (discount >= 60) {
      return `-60€ REMISE IMMÉDIATE`;
    } else if (discount > 0) {
      return `-${discount}€ REMISE IMMÉDIATE`;
    }
  }
  
  return null;
};

// Color options display (simplified)
export const renderColorOptions = () => {
  const colors = ['black', 'white', 'blue', 'green'];
  
  return (
    <div className="flex space-x-1 mt-2">
      {colors.map((color) => (
        <div 
          key={color} 
          className={`w-4 h-4 rounded-full border ${
            color === 'black' ? 'bg-black' : 
            color === 'white' ? 'bg-white' : 
            color === 'blue' ? 'bg-blue-500' : 
            'bg-green-500'
          }`}
        />
      ))}
    </div>
  );
};

// Eco-friendly badge component
export const EcoFriendlyBadge = () => (
  <Badge className="bg-green-100 text-green-800 border-green-200">
    <Leaf className="h-3 w-3 mr-1" />
    TECH & DURABLE
  </Badge>
);
