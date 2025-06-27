import React from 'react';
import { Wifi, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useTimeOneOffers } from '@/hooks/useTimeOneOffers';

const BannerIllustration: React.FC = () => {
  // Hook pour récupérer TOUTES les offres TimeOne (multi-opérateurs)
  const { offers, loading } = useTimeOneOffers({
    autoFetch: true,
  });
  
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [visibleCards, setVisibleCards] = React.useState<number[]>([0]);

  // Animation infinie - cycle through ALL offers
  React.useEffect(() => {
    if (offers.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % offers.length;
        
        // Gestion de la pile de cartes visibles (max 2 cartes)
        setVisibleCards((prevVisible) => {
          if (prevVisible.length === 1) {
            // Ajouter la nouvelle carte
            return [prevVisible[0], nextIndex];
          } else {
            // Remplacer la carte du bas par la nouvelle
            return [prevVisible[1], nextIndex];
          }
        });
        
        return nextIndex;
      });
    }, 2500); // Nouvelle carte toutes les 2.5 secondes

    return () => clearInterval(interval);
  }, [offers.length]);
  
  if (loading) {
    return (
      <motion.div 
        className="flex justify-center items-center h-32 md:h-40"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="animate-pulse text-muted-foreground">Chargement des offres...</div>
      </motion.div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="flex justify-center items-center h-32 md:h-40">
        <div className="text-muted-foreground">Aucune offre disponible</div>
      </div>
    );
  }

  return (
    <motion.div 
      className="flex justify-center items-start h-32 md:h-40"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      {/* Conteneur des cartes avec dimensions originales */}
      <div className="relative w-64 h-32 md:h-36">
        <AnimatePresence mode="popLayout">
          {visibleCards.map((cardIndex, stackIndex) => {
            const offer = offers[cardIndex];
            if (!offer) return null;
            
            const isTopCard = stackIndex === visibleCards.length - 1;
            const zIndex = stackIndex + 1;
            const yOffset = stackIndex * 8;
            const xOffset = stackIndex * 4;
            
            return (
              <motion.div 
                key={`${offer.id}-${cardIndex}`}
                className="absolute top-0 left-0 bg-card/95 dark:bg-card border border-border shadow-lg rounded-xl p-3 backdrop-blur-sm w-64 h-28 md:h-32"
                style={{
                  zIndex: zIndex,
                }}
                initial={{ 
                  opacity: 0, 
                  x: 100,
                  rotate: 5,
                  scale: 0.9
                }}
                animate={{ 
                  opacity: isTopCard ? 1 : 0.7,
                  x: xOffset,
                  y: yOffset,
                  rotate: 0,
                  scale: isTopCard ? 1 : 0.95
                }}
                exit={{ 
                  opacity: 0,
                  x: -100,
                  rotate: -5,
                  scale: 0.9,
                  transition: { duration: 0.5 }
                }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.02,
                  y: yOffset - 4,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Header compact */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      offer.operator === 'Bouygues Telecom' ? 'bg-blue-500' :
                      offer.operator === 'SFR' ? 'bg-red-500' :
                      offer.operator === 'Orange' ? 'bg-orange-500' :
                      offer.operator === 'Free' ? 'bg-gray-700' :
                      offer.operator === 'Youprice' ? 'bg-purple-500' :
                      offer.operator === 'Auchan Télécom' ? 'bg-green-500' :
                      'bg-indigo-500'
                    }`} />
                    <span className="text-xs font-medium text-muted-foreground">
                      {offer.operator === 'Bouygues Telecom' ? 'Bouygues' : 
                       offer.operator === 'SFR' ? 'SFR' : 
                       offer.operator === 'Orange' ? 'Orange' :
                       offer.operator === 'Free' ? 'Free' :
                       offer.operator === 'Auchan Télécom' ? 'Auchan' :
                       offer.operator === 'Youprice' ? 'Youprice' :
                       offer.operator.split(' ')[0]}
                    </span>
                  </div>
                  <Badge className="text-xs bg-orange-500 hover:bg-orange-600 h-4 px-2 text-white border-0">
                    +{offer.commission}€
                  </Badge>
                </div>
                
                {/* Nom de l'offre compact */}
                <div className="mb-2">
                  <span className="font-bold text-sm text-foreground leading-tight block">
                    {offer.name.length > 18 ? offer.name.substring(0, 18) + '...' : offer.name}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Wifi className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-muted-foreground">
                      {offer.data}
                    </span>
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      {offer.networkType || '4G'}
                    </span>
                  </div>
                </div>
                
                {/* Prix compact */}
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-primary">
                    {offer.price.toString().split('.')[0]}
                  </span>
                  <span className="text-md font-bold text-primary">
                    .{(Number(offer.price).toFixed(2).split('.')[1] || '99')}
                  </span>
                  <span className="text-xs text-muted-foreground">€/mois</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Indicateur de progression avec scroll */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1 max-w-32 overflow-hidden">
          <div className="flex gap-1" style={{
            transform: `translateX(-${Math.max(0, currentIndex - 7) * 12}px)`,
            transition: 'transform 0.3s ease'
          }}>
            {offers.slice(0, Math.min(offers.length, 15)).map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  visibleCards.includes(index) ? 'bg-primary scale-125' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
            {offers.length > 15 && (
              <div className="text-xs text-muted-foreground ml-2">
                +{offers.length - 15}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BannerIllustration;