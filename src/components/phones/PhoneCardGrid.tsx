
import React from 'react';
import { Phone as PhoneType } from '@/types/phones';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Info, ExternalLink } from 'lucide-react';
import { 
  formatPrice, 
  renderRating, 
  getPromotionTag, 
  renderColorOptions,
  EcoFriendlyBadge
} from './PhoneCardUtils';

interface PhoneCardGridProps {
  phone: PhoneType;
  isInComparison: boolean;
  onCompareToggle: () => void;
}

const PhoneCardGrid = ({ 
  phone, 
  isInComparison,
  onCompareToggle 
}: PhoneCardGridProps) => {
  const promotionTag = getPromotionTag(phone.description, phone.discount);
  const isNewRelease = phone.title.includes("16") || phone.title.includes("A26") || phone.title.includes("S25");
  
  return (
    <Card className="overflow-hidden h-full flex flex-col border border-gray-200 hover:border-gray-300">
      {promotionTag && (
        <div className={`text-center text-white text-xs font-semibold py-1 px-2 ${
          promotionTag.includes('OFFERTE') ? 'bg-blue-700' : 'bg-orange-500'
        }`}>
          {promotionTag}
        </div>
      )}
      
      {isNewRelease && !promotionTag && (
        <div className="text-center text-white text-xs font-semibold py-1 px-2 bg-blue-900">
          NOUVEAUTÉ
        </div>
      )}
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-1">{phone.title}</h3>
        
        {phone.rating && (
          <div className="mb-3">
            {renderRating(phone.rating, phone.reviewCount || 0)}
          </div>
        )}
        
        <div className="relative flex-grow flex items-center justify-center py-4">
          {phone.isEcoFriendly && (
            <div className="absolute top-0 right-0">
              <EcoFriendlyBadge />
            </div>
          )}
          
          <img 
            src={phone.image || '/placeholder.svg'} 
            alt={phone.title}
            className="max-h-[150px] object-contain"
          />
          
          {renderColorOptions()}
        </div>
        
        <div className="mt-auto pt-4">
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="text-sm font-medium text-gray-500">À partir de</span>
            </div>
            <span className="text-2xl font-bold">
              {formatPrice(phone.price)}
            </span>
            
            {phone.installmentPrice && phone.installmentMonths && (
              <div className="text-sm text-gray-600 mt-1">
                +{phone.installmentPrice}€/mois x {phone.installmentMonths} mois
                <br />
                <span className="text-xs text-gray-500">après remboursement</span>
                <Info className="inline-block h-3 w-3 ml-1 text-gray-400" />
              </div>
            )}
            
            <div className="flex items-center mt-2 py-2 border-t border-gray-100">
              <div className="flex-shrink-0">
                <img 
                  src="/placeholder.svg" 
                  alt="Phone icon" 
                  className="w-8 h-8"
                />
              </div>
              <div className="ml-2">
                <div className="text-xs text-gray-500">
                  Valeur ancien mobile
                </div>
                <div className="flex items-baseline">
                  <span className="font-semibold text-sm">100€</span>
                  <span className="ml-1 text-xs text-gray-500">de bonus</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100">
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-sm"
                onClick={() => window.open(phone.productUrl, '_blank')}
              >
                Voir l'offre
                <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PhoneCardGrid;
