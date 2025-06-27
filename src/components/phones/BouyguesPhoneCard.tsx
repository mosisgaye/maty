import React from 'react';
import { Phone as PhoneType } from '@/types/phones';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  ExternalLink, 
  Smartphone, 
  Wifi, 
  Star,
  Clock,
  Gift,
  TrendingUp,
  Users,
  Zap,
  Eye
} from 'lucide-react';

interface BouyguesPhoneCardProps {
  phone: PhoneType;
  isInComparison: boolean;
  onCompareToggle: () => void;
}

const BouyguesPhoneCard = ({ 
  phone, 
  isInComparison,
  onCompareToggle 
}: BouyguesPhoneCardProps) => {
  // Format price with Euro symbol
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };

  // 🧠 SIMULATION INTELLIGENTE
  const getSmartBadge = () => {
    // Logique basée sur prix et popularité
    if (phone.trademark === 'Apple' && phone.price < 400) return { type: 'hot', label: 'POPULAIRE', color: 'bg-red-500' };
    if (phone.totalMonthlyPrice && phone.totalMonthlyPrice < 40) return { type: 'deal', label: 'TOP PRIX', color: 'bg-green-500' };
    if (phone.title.includes('16') || phone.title.includes('S25')) return { type: 'new', label: 'NOUVEAU', color: 'bg-blue-500' };
    if (phone.forfaitData && parseInt(phone.forfaitData) >= 150) return { type: 'data', label: 'MAX DATA', color: 'bg-purple-500' };
    return null;
  };

  const getViewersCount = () => {
    // Simulation basée sur popularité de la marque et prix
    const baseViewers = phone.trademark === 'Apple' ? 150 : phone.trademark === 'Samsung' ? 120 : 80;
    const priceMultiplier = phone.price < 500 ? 1.5 : phone.price > 800 ? 0.7 : 1;
    return Math.floor(baseViewers * priceMultiplier);
  };

  const getStockStatus = () => {
    // Simulation d'urgence pour conversion
    if (phone.price < 300) return { urgent: true, text: 'Plus que 3 en stock' };
    if (phone.trademark === 'Apple' && phone.totalMonthlyPrice && phone.totalMonthlyPrice < 50) return { urgent: true, text: 'Dernières pièces' };
    return { urgent: false, text: 'En stock' };
  };

  const getSavingsVsSeparate = () => {
    // Calcul économie vs achat séparé
    if (phone.totalMonthlyPrice && phone.forfaitPrice) {
      const separateMonthly = (phone.price / 24) + phone.forfaitPrice + 8; // +8€ marge opérateur
      const currentMonthly = phone.totalMonthlyPrice;
      const savingsPerMonth = separateMonthly - currentMonthly;
      const totalSavings = savingsPerMonth * 24;
      return Math.round(totalSavings);
    }
    return null;
  };

  const smartBadge = getSmartBadge();
  const viewersCount = getViewersCount();
  const stockStatus = getStockStatus();
  const savingsAmount = getSavingsVsSeparate();

  return (
    <Card className="overflow-hidden h-full flex flex-col border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-xl group">
      {/* Header avec badges optimisés */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 relative">
        <div className="flex justify-between items-center">
          <Badge className="bg-white/20 text-white">
            <Gift className="h-3 w-3 mr-1" />
            Forfait inclus
          </Badge>
          
          {/* Badge intelligent */}
          {smartBadge && (
            <Badge className={`${smartBadge.color} text-white animate-pulse`}>
              {smartBadge.label}
            </Badge>
          )}
        </div>
        
        {/* Viewers en temps réel */}
        <div className="absolute -bottom-3 left-4 bg-white text-gray-700 px-2 py-1 rounded-full text-xs flex items-center shadow-md">
          <Eye className="h-3 w-3 mr-1 text-blue-500" />
          {viewersCount} personnes regardent
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col pt-6">
        {/* Titre et marque */}
        <div className="mb-3">
          <Badge variant="outline" className="mb-2">
            {phone.trademark}
          </Badge>
          <h3 className="font-semibold text-lg leading-tight">{phone.title}</h3>
        </div>
        
        {/* Image */}
        <div className="relative flex-grow flex items-center justify-center py-4 min-h-[150px]">
          <img 
            src={phone.image || '/placeholder.svg'} 
            alt={phone.title}
            className="max-h-[140px] object-contain group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Badge économie flottant */}
          {savingsAmount && savingsAmount > 100 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
              -{savingsAmount}€
            </div>
          )}
        </div>
        
        {/* PRIX PRINCIPAL - Hiérarchie optimisée */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4 border border-green-200">
          <div className="text-center">
            {phone.totalMonthlyPrice ? (
              <>
                <div className="text-3xl font-bold text-green-700 mb-1">
                  {formatPrice(phone.totalMonthlyPrice)}<span className="text-lg">/mois</span>
                </div>
                <div className="text-sm text-green-600 mb-2">
                  Téléphone + forfait {phone.forfaitData} pendant 24 mois
                </div>
                {savingsAmount && (
                  <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                    <TrendingUp className="h-4 w-4 inline mr-1" />
                    Économie: {savingsAmount}€ vs séparé
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-700">
                  {formatPrice(phone.price)}
                </div>
                <div className="text-sm text-gray-600">Prix du téléphone</div>
              </>
            )}
          </div>
        </div>
        
        {/* Informations forfait compactes */}
        {phone.hasForfait && (
          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Smartphone className="h-4 w-4 text-blue-600 mr-2" />
                <span className="font-medium text-blue-800 text-sm">Forfait {phone.forfaitData}</span>
              </div>
              {phone.network && (
                <Badge variant="secondary" className="text-xs">
                  <Wifi className="h-3 w-3 mr-1" />
                  {phone.network}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Stock et urgence */}
        <div className="mb-3">
          <div className={`text-sm flex items-center ${stockStatus.urgent ? 'text-red-600 font-semibold' : 'text-green-600'}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${stockStatus.urgent ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
            {stockStatus.text}
          </div>
        </div>
        
        {/* Caractéristiques compactes */}
        <div className="flex flex-wrap gap-1 mb-3">
          {phone.storage && (
            <Badge variant="secondary" className="text-xs">
              {phone.storage}
            </Badge>
          )}
          {phone.color && (
            <Badge variant="secondary" className="text-xs">
              {phone.color}
            </Badge>
          )}
          {phone.condition === 'refurbished' && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
              Reconditionné
            </Badge>
          )}
        </div>
        
        {/* Rating */}
        {phone.rating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.floor(phone.rating!)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            {phone.reviewCount && (
              <span className="ml-1 text-xs text-gray-500">
                ({phone.reviewCount})
              </span>
            )}
          </div>
        )}
        
        {/* Actions optimisées */}
        <div className="mt-auto space-y-2">
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold h-12"
            onClick={() => {
              // Track click for affiliate commission
              if (phone.affiliateUrl) {
                window.open(phone.affiliateUrl, '_blank', 'noopener,noreferrer');
              }
            }}
          >
            <div className="flex items-center justify-center">
              <span>Voir cette offre</span>
              {savingsAmount && savingsAmount > 100 && (
                <span className="ml-2 bg-white/20 px-2 py-1 rounded text-xs">
                  -{savingsAmount}€
                </span>
              )}
              <ExternalLink className="h-4 w-4 ml-2" />
            </div>
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={onCompareToggle}
              className={`flex-1 ${isInComparison ? 'bg-blue-50 border-blue-300' : ''}`}
            >
              {isInComparison ? 'Retirer' : 'Comparer'}
            </Button>
            
            {phone.totalMonthlyPrice && (
              <Button 
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  // Affichage calcul détaillé
                  alert(`Détail: ${phone.price}€ téléphone + ${phone.forfaitPrice}€/mois forfait x 24 mois`);
                }}
              >
                <Users className="h-3 w-3 mr-1" />
                Calcul
              </Button>
            )}
          </div>
        </div>
        
        {/* Information légale discrète */}
        <div className="text-xs text-gray-500 mt-2 text-center">
          Prix sous réserve d'éligibilité - Engagement 24 mois
        </div>
      </div>
    </Card>
  );
};

export default BouyguesPhoneCard;