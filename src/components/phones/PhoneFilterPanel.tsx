import React, { useMemo, useState } from 'react';
import { 
  Filter, Euro, Smartphone, RefreshCcw, Monitor, 
  Database, Leaf, ChevronDown, ChevronUp,
  Wifi, Signal, Gift,
  // 🆕 NOUVEAUX IMPORTS pour Problem-Solver
  DollarSign, Camera, Gamepad2, Heart, Briefcase, 
  Sparkles, Target, Users
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Phone } from '@/types/phones';
import { 
  getBrands, 
  getOperatingSystems, 
  getStorageOptions, 
  getPriceRange 
} from '@/services/phones/phoneService';
import { getForfaitOptions, getForfaitStats } from '@/services/phones/bouyguesFilterUtils';

// 🆕 TYPES pour les filtres Problem-Solver
type ProblemSolverFilter = 
  | 'budget' 
  | 'photo' 
  | 'gaming' 
  | 'first-phone' 
  | 'business' 
  | 'all';

interface PhoneFilterPanelProps {
  allPhones: Phone[];
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  selectedConditions: ('new' | 'refurbished' | 'used')[];
  setSelectedConditions: (conditions: ('new' | 'refurbished' | 'used')[]) => void;
  selectedOS: string[];
  setSelectedOS: (os: string[]) => void;
  selectedStorage: string[];
  setSelectedStorage: (storage: string[]) => void;
  ecoFriendly: boolean;
  setEcoFriendly: (value: boolean) => void;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  isLoading: boolean;
  forfaitType?: 'all' | 'with-forfait' | 'without-forfait';
  setForfaitType?: (type: 'all' | 'with-forfait' | 'without-forfait') => void;
  networkType?: 'all' | '4G' | '5G';
  setNetworkType?: (type: 'all' | '4G' | '5G') => void;
  showOnlyDeals?: boolean;
  setShowOnlyDeals?: (show: boolean) => void;
}

const PhoneFilterPanel = ({
  allPhones,
  priceRange,
  setPriceRange,
  selectedBrands,
  setSelectedBrands,
  selectedConditions,
  setSelectedConditions,
  selectedOS,
  setSelectedOS,
  selectedStorage,
  setSelectedStorage,
  ecoFriendly,
  setEcoFriendly,
  filtersOpen,
  setFiltersOpen,
  isLoading,
  forfaitType = 'all',
  setForfaitType = () => {},
  networkType = 'all',
  setNetworkType = () => {},
  showOnlyDeals = false,
  setShowOnlyDeals = () => {}
}: PhoneFilterPanelProps) => {
  
  // 🆕 ÉTAT pour Problem-Solver Filter
  const [selectedProblemFilter, setSelectedProblemFilter] = useState<ProblemSolverFilter>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Get filter options from phone data
  const brands = useMemo(() => getBrands(allPhones), [allPhones]);
  const operatingSystems = useMemo(() => getOperatingSystems(allPhones), [allPhones]);
  const storageOptions = useMemo(() => getStorageOptions(allPhones), [allPhones]);
  const fullPriceRange = useMemo(() => getPriceRange(allPhones), [allPhones]);
  const forfaitOptions = useMemo(() => getForfaitOptions(allPhones), [allPhones]);
  const forfaitStats = useMemo(() => getForfaitStats(allPhones), [allPhones]);

  // 🧠 LOGIQUE PROBLEM-SOLVER : Appliquer les filtres automatiquement
  const applyProblemSolverFilter = (filterType: ProblemSolverFilter) => {
    console.log('🎯 Applying problem-solver filter:', filterType);
    setSelectedProblemFilter(filterType);
    
    // Reset des filtres techniques
    setSelectedBrands([]);
    setSelectedConditions([]);
    setSelectedOS([]);
    setSelectedStorage([]);
    setForfaitType('all');
    setNetworkType('all');
    setShowOnlyDeals(false);
    
    switch (filterType) {
      case 'budget':
        // Budget serré : forfaits < 35€/mois, reconditionnés OK
        setSelectedConditions(['new', 'refurbished']);
        setPriceRange([0, 500]);
        setForfaitType('with-forfait');
        break;
        
      case 'photo':
        // Photos pro : iPhone Pro, Pixel, Galaxy Ultra
        setSelectedBrands(['Apple', 'Google', 'Samsung']);
        setPriceRange([600, 2000]);
        break;
        
      case 'gaming':
        // Gaming : marques performance, prix élevé, 5G
        setSelectedBrands(['Apple', 'Samsung', 'Xiaomi']);
        setPriceRange([400, 2000]);
        setNetworkType('5G');
        setSelectedStorage(['256Go', '512Go', '1To']);
        break;
        
      case 'first-phone':
        // Premier smartphone : prix doux, marques connues
        setSelectedBrands(['Apple', 'Samsung']);
        setPriceRange([0, 600]);
        setSelectedConditions(['new']);
        break;
        
      case 'business':
        // Usage pro : autonomie, sécurité, grandes marques
        setSelectedBrands(['Apple', 'Samsung', 'Google']);
        setPriceRange([500, 1500]);
        setSelectedStorage(['128Go', '256Go', '512Go']);
        setNetworkType('5G');
        break;
        
      case 'all':
      default:
        // Reset complet
        setPriceRange([fullPriceRange.min, fullPriceRange.max]);
        break;
    }
  };

  // 🆕 DÉFINITION des filtres Problem-Solver
  const problemSolverOptions = [
    {
      id: 'all' as ProblemSolverFilter,
      icon: Target,
      title: 'Tous les téléphones',
      description: 'Voir toute la sélection',
      count: allPhones.length,
      color: 'text-gray-600'
    },
    {
      id: 'budget' as ProblemSolverFilter,
      icon: DollarSign,
      title: 'Budget serré',
      description: 'Moins de 35€/mois, bon rapport qualité-prix',
      count: allPhones.filter(p => p.totalMonthlyPrice && p.totalMonthlyPrice < 35).length,
      color: 'text-green-600'
    },
    {
      id: 'photo' as ProblemSolverFilter,
      icon: Camera,
      title: 'Photos professionnelles',
      description: 'iPhone Pro, Pixel, Galaxy Ultra - Meilleurs capteurs',
      count: allPhones.filter(p => 
        (p.trademark === 'Apple' && p.title.includes('Pro')) ||
        (p.trademark === 'Google' && p.title.includes('Pixel')) ||
        (p.trademark === 'Samsung' && p.title.includes('Ultra'))
      ).length,
      color: 'text-purple-600'
    },
    {
      id: 'gaming' as ProblemSolverFilter,
      icon: Gamepad2,
      title: 'Gaming & Performance',
      description: 'Processeurs puissants, 5G, stockage élevé',
      count: allPhones.filter(p => 
        p.network === '5G' && p.price > 400 && 
        ['Apple', 'Samsung', 'Xiaomi'].includes(p.trademark)
      ).length,
      color: 'text-red-600'
    },
    {
      id: 'first-phone' as ProblemSolverFilter,
      icon: Heart,
      title: 'Premier smartphone',
      description: 'Interface simple, prix accessible, marques fiables',
      count: allPhones.filter(p => 
        ['Apple', 'Samsung'].includes(p.trademark) && p.price < 600
      ).length,
      color: 'text-pink-600'
    },
    {
      id: 'business' as ProblemSolverFilter,
      icon: Briefcase,
      title: 'Usage professionnel',
      description: 'Sécurité, autonomie, productivité, 5G',
      count: allPhones.filter(p => 
        p.network === '5G' && p.price > 500 && 
        ['Apple', 'Samsung', 'Google'].includes(p.trademark)
      ).length,
      color: 'text-blue-600'
    }
  ];

  // Handlers existants (conservés)
  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
    setSelectedProblemFilter('all'); // Reset problem filter if manual change
  };
  
  const handleConditionChange = (condition: 'new' | 'refurbished' | 'used') => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter(c => c !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
    }
    setSelectedProblemFilter('all');
  };
  
  const handleOSChange = (os: string) => {
    if (selectedOS.includes(os)) {
      setSelectedOS(selectedOS.filter(o => o !== os));
    } else {
      setSelectedOS([...selectedOS, os]);
    }
    setSelectedProblemFilter('all');
  };
  
  const handleStorageChange = (storage: string) => {
    if (selectedStorage.includes(storage)) {
      setSelectedStorage(selectedStorage.filter(s => s !== storage));
    } else {
      setSelectedStorage([...selectedStorage, storage]);
    }
    setSelectedProblemFilter('all');
  };
  
  // Reset all filters
  const resetFilters = () => {
    setPriceRange([fullPriceRange.min, fullPriceRange.max]);
    setSelectedBrands([]);
    setSelectedConditions([]);
    setSelectedOS([]);
    setSelectedStorage([]);
    setEcoFriendly(false);
    setForfaitType('all');
    setNetworkType('all');
    setShowOnlyDeals(false);
    setSelectedProblemFilter('all');
  };
  
  return (
    <div className="lg:col-span-1">
      <Collapsible
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        className="bg-card border border-border rounded-lg shadow-sm overflow-hidden mb-6 lg:mb-0 lg:sticky lg:top-24"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Trouvez votre téléphone</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="h-8 text-xs"
              disabled={isLoading}
            >
              <RefreshCcw className="h-3 w-3 mr-1" />
              Tout voir
            </Button>
            <CollapsibleTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {filtersOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent className="p-4 space-y-6">
          
          {/* 🆕 SECTION PROBLEM-SOLVER - PRIORITÉ ABSOLUE */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <h3 className="font-medium text-gray-900">Quel est votre usage principal ?</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {problemSolverOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedProblemFilter === option.id;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => applyProblemSolverFilter(option.id)}
                    className={`p-3 rounded-lg border text-left transition-all hover:shadow-sm ${
                      isSelected 
                        ? 'border-blue-300 bg-blue-50 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={isLoading}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? 'text-blue-600' : option.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium text-sm ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                            {option.title}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${isSelected ? 'border-blue-300 text-blue-700' : ''}`}
                          >
                            {option.count}
                          </Badge>
                        </div>
                        <p className={`text-xs mt-1 ${isSelected ? 'text-blue-700' : 'text-gray-500'}`}>
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 🔄 FILTRES AVANCÉS - Section repliable */}
          <div className="border-t pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="w-full justify-between p-0 h-auto font-medium text-sm text-gray-700 hover:text-gray-900"
            >
              <span>Filtres avancés</span>
              {showAdvancedFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            
            {showAdvancedFilters && (
              <div className="mt-4 space-y-6">
                
                {/* Search bar */}
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Modèle, marque..."
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>

                {/* Brands */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sm">Marque</h3>
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {['Apple', 'Samsung', 'Google', 'Xiaomi'].map(brand => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox
                            id={`brand-${brand.toLowerCase()}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => handleBrandChange(brand)}
                          />
                          <label
                            htmlFor={`brand-${brand.toLowerCase()}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Condition */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sm">État</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="condition-new"
                        checked={selectedConditions.includes('new')}
                        onCheckedChange={() => handleConditionChange('new')}
                        disabled={isLoading}
                      />
                      <label htmlFor="condition-new" className="text-sm">Neuf</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="condition-refurbished"
                        checked={selectedConditions.includes('refurbished')}
                        onCheckedChange={() => handleConditionChange('refurbished')}
                        disabled={isLoading}
                      />
                      <label htmlFor="condition-refurbished" className="text-sm">Reconditionné</label>
                    </div>
                  </div>
                </div>

                {/* Operating System */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sm">Système</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="os-ios"
                        checked={selectedOS.includes('iOS')}
                        onCheckedChange={() => handleOSChange('iOS')}
                        disabled={isLoading}
                      />
                      <label htmlFor="os-ios" className="text-sm">iOS</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="os-android"
                        checked={selectedOS.includes('Android')}
                        onCheckedChange={() => handleOSChange('Android')}
                        disabled={isLoading}
                      />
                      <label htmlFor="os-android" className="text-sm">Android</label>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default PhoneFilterPanel;