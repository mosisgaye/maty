// components/sections/BoxSectionHomepage.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Wifi, 
  Zap, 
  Gift, 
  ArrowRight, 
  Star,
  Tv,
  Phone,
  CheckCircle,
  TrendingDown
} from 'lucide-react';

// Types simples pour les box en homepage
interface BoxPreview {
  id: number;
  nom: string;
  technologie: 'Fibre' | '5G' | 'ADSL';
  debit: string;
  prix: number;
  prixBarre?: number;
  promo?: string;
  services: string[];
  highlight?: boolean;
}

// Données des 3 meilleures box à afficher
const FEATURED_BOXES: BoxPreview[] = [
  {
    id: 1,
    nom: "Bbox Fit",
    technologie: "Fibre",
    debit: "400 Mb/s",
    prix: 15.99,
    prixBarre: 27.99,
    promo: "-43%",
    services: ["Internet THD", "Wi-Fi 6", "Appels illimités"],
    highlight: false
  },
  {
    id: 2,
    nom: "Bbox Must",
    technologie: "Fibre",
    debit: "1 Gb/s",
    prix: 15.99,
    prixBarre: 40.99,
    promo: "-61%",
    services: ["Internet", "180 chaînes TV", "Wi-Fi 6E"],
    highlight: true
  },
  {
    id: 3,
    nom: "Bbox Ultym",
    technologie: "Fibre",
    debit: "2 Gb/s",
    prix: 31.99,
    prixBarre: 54.99,
    promo: "-42%",
    services: ["Internet", "TV + Netflix", "Wi-Fi 7"],
    highlight: false
  }
];

const BoxSectionHomepage = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        {/* Header de section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            OFFRE LIMITÉE
            <Zap className="w-4 h-4" />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Box Internet & Fibre
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Comparez les meilleures offres box internet et économisez jusqu'à 
            <span className="text-green-600 dark:text-green-400 font-bold"> 300€/an</span>
          </p>
        </div>

        {/* Badges avantages */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Badge variant="outline" className="px-4 py-2 text-sm">
            <Gift className="w-4 h-4 mr-2" />
            Installation gratuite
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-sm">
            <Wifi className="w-4 h-4 mr-2" />
            Wi-Fi dernière génération
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-sm">
            <TrendingDown className="w-4 h-4 mr-2" />
            Prix bloqué 12 mois
          </Badge>
        </div>

        {/* Grille des 3 box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {FEATURED_BOXES.map((box) => (
            <Card 
              key={box.id}
              className={`relative group hover:shadow-2xl transition-all duration-300 ${
                box.highlight ? 'ring-2 ring-blue-500 shadow-lg scale-105' : ''
              }`}
            >
              {box.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    PLUS POPULAIRE
                  </Badge>
                </div>
              )}

              <CardContent className="p-6">
                {/* Header carte */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {box.nom}
                    </h3>
                    {box.promo && (
                      <Badge variant="destructive" className="text-sm">
                        {box.promo}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Badge variant="secondary" className="text-xs">
                      {box.technologie}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      {box.debit}
                    </span>
                  </div>
                </div>

                {/* Prix */}
                <div className="mb-6 text-center py-4 border-t border-b border-gray-100 dark:border-gray-700">
                  {box.prixBarre && (
                    <div className="text-sm text-gray-500 line-through mb-1">
                      {box.prixBarre.toFixed(2).replace('.', ',')}€/mois
                    </div>
                  )}
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {box.prix.toFixed(2).replace('.', ',')}€
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">/mois</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Engagement 12 mois
                  </div>
                </div>

                {/* Services inclus */}
                <div className="space-y-2 mb-6">
                  {box.services.map((service, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>

                {/* CTA individuel */}
                <Link href="/box-internet" className="block">
                  <Button 
                    variant={box.highlight ? "default" : "outline"}
                    className="w-full group/btn"
                  >
                    Découvrir
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats et CTA principal */}
        <div className="text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-3xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">25+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Offres box</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">-70%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Réduction max</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">2 Gb/s</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Débit max</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Technologies</div>
            </div>
          </div>

          <Link href="/box-internet">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Comparer toutes les box internet
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Service 100% gratuit et sans engagement
          </p>
        </div>
      </div>
    </section>
  );
};

export default BoxSectionHomepage;