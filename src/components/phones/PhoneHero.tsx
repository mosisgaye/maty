import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, Smartphone, TrendingDown } from 'lucide-react';

const PhoneHero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            {/* Badge simple */}
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-medium">
              Forfait inclus - Meilleurs prix
            </span>

            {/* Titre clean et impactant */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Téléphone + Forfait
              <span className="block text-yellow-300">Un seul prix</span>
            </h1>

            {/* Message unique et clair */}
            <p className="text-xl md:text-2xl text-white/80 max-w-md">
              iPhone, Samsung, Google avec forfait mobile inclus. Jusqu'à 300€ d'économie vs achat séparé.
            </p>

            {/* CTAs simples */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-yellow-300 hover:text-blue-700">
                <Search className="mr-2 h-5 w-5" />
                Voir les offres
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Comparer les prix
              </Button>
            </div>

            {/* Éléments de confiance épurés */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <span className="bg-white/20 p-1 rounded-full mr-1">✓</span>
                Livraison gratuite
              </div>
              <div className="flex items-center">
                <span className="bg-white/20 p-1 rounded-full mr-1">✓</span>
                1,185 modèles
              </div>
              <div className="flex items-center">
                <span className="bg-white/20 p-1 rounded-full mr-1">✓</span>
                Prix garantis
              </div>
            </div>
          </div>

          {/* Section droite simplifiée */}
          <div className="flex justify-center md:justify-end relative">
            <div className="relative w-64 h-64 md:w-72 md:h-72 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center p-4">
              <Smartphone className="w-40 h-40 text-white" />
              
              {/* Badge économie unique */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-blue-800 font-bold rounded-full w-16 h-16 flex items-center justify-center text-lg shadow-lg">
                -300€
              </div>
            </div>

            {/* Cards prix épurées - 2 au lieu de 3 */}
            <div className="absolute top-1/4 -left-4 bg-white shadow-lg rounded-lg p-3 animate-bounce">
              <span className="text-blue-600 font-bold">iPhone 16</span>
              <div className="text-sm font-bold text-green-600">44,99€/mois</div>
            </div>

            <div className="absolute bottom-1/4 -right-4 bg-white shadow-lg rounded-lg p-3 animate-bounce delay-500">
              <span className="text-purple-600 font-bold">Galaxy S24</span>
              <div className="text-sm font-bold text-green-600">52,99€/mois</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneHero;