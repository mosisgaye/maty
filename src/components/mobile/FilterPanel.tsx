import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, Wifi, Euro, Phone, Signal, ChevronDown, X, Star, 
  Zap, Check, Globe, SlidersHorizontal, Sparkles
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { NetworkType, DataSource } from '@/types/mobile';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  dataRange: number[];
  setDataRange: (value: number[]) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  networkType: NetworkType;
  setNetworkType: (value: NetworkType) => void;
  selectedOperators: string[];
  operators: string[];
  handleOperatorChange: (operator: string) => void;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  
  // Props pour multi-opérateurs
  selectedSources?: DataSource[];
  setSelectedSources?: (sources: DataSource[]) => void;
  showSourceFilter?: boolean;
  
  // Nouveaux props pour l'UX améliorée
  unlimitedCalls?: boolean;
  setUnlimitedCalls?: (value: boolean) => void;
  roamingIncluded?: boolean;
  setRoamingIncluded?: (value: boolean) => void;
  planType?: 'all' | 'prepaid' | 'with-commitment' | 'no-commitment';
  setPlanType?: (value: 'all' | 'prepaid' | 'with-commitment' | 'no-commitment') => void;
}

// Type pour les filtres actifs
interface ActiveFilter {
  key: string;
  label: string;
  color?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  dataRange,
  setDataRange,
  priceRange,
  setPriceRange,
  networkType,
  setNetworkType,
  selectedOperators,
  operators,
  handleOperatorChange,
  filtersOpen,
  setFiltersOpen,
  selectedSources = ['supabase', 'timeone'],
  setSelectedSources = () => {},
  showSourceFilter = true,
  unlimitedCalls = true,
  setUnlimitedCalls = () => {},
  roamingIncluded = false,
  setRoamingIncluded = () => {},
  planType = 'all',
  setPlanType = () => {},
}) => {
  const isMobile = useIsMobile();
  const [expandedSections, setExpandedSections] = useState<string[]>(['data', 'price']);
  
  // Calcul des filtres actifs
  const activeFilters: ActiveFilter[] = useMemo(() => {
    const filters: ActiveFilter[] = [];
    
    if (dataRange[0] < 300) {
      filters.push({ 
        key: 'data', 
        label: dataRange[0] === 5 ? '5 Go' : `Max ${dataRange[0]} Go`,
        color: 'blue' 
      });
    }
    
    if (priceRange[0] > 0 || priceRange[0] < 50) {
      filters.push({ 
        key: 'price', 
        label: `${priceRange[0]}€/mois max`,
        color: 'green' 
      });
    }
    
    if (networkType !== 'all') {
      filters.push({ 
        key: 'network', 
        label: networkType,
        color: 'teal' 
      });
    }
    
    if (selectedOperators.length > 0 && selectedOperators.length < operators.length) {
      filters.push({ 
        key: 'operators', 
        label: selectedOperators.length === 1 
          ? selectedOperators[0] 
          : `${selectedOperators.length} opérateurs`,
        color: 'purple' 
      });
    }
    
    if (selectedSources.length === 1) {
      filters.push({ 
        key: 'source', 
        label: selectedSources[0] === 'timeone' ? 'Partenaires' : 'Standard',
        color: 'orange' 
      });
    }
    
    if (!unlimitedCalls) {
      filters.push({ 
        key: 'calls', 
        label: 'Sans illimité',
        color: 'red' 
      });
    }
    
    if (roamingIncluded) {
      filters.push({ 
        key: 'roaming', 
        label: 'Roaming EU',
        color: 'indigo' 
      });
    }
    
    if (planType !== 'all') {
      const planLabels = {
        'prepaid': 'Prépayé',
        'with-commitment': 'Avec engagement',
        'no-commitment': 'Sans engagement'
      };
      filters.push({ 
        key: 'type', 
        label: planLabels[planType],
        color: 'violet' 
      });
    }
    
    return filters;
  }, [dataRange, priceRange, networkType, selectedOperators, operators.length, selectedSources, unlimitedCalls, roamingIncluded, planType]);
  
  // Fonctions utilitaires
  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };
  
  const removeFilter = (key: string) => {
    switch(key) {
      case 'data': 
        setDataRange([300]); 
        break;
      case 'price': 
        setPriceRange([50]); 
        break;
      case 'network': 
        setNetworkType('all'); 
        break;
      case 'operators': 
        selectedOperators.forEach(op => handleOperatorChange(op)); 
        break;
      case 'source': 
        setSelectedSources(['supabase', 'timeone']); 
        break;
      case 'calls': 
        setUnlimitedCalls(true); 
        break;
      case 'roaming': 
        setRoamingIncluded(false); 
        break;
      case 'type': 
        setPlanType('all'); 
        break;
    }
  };
  
  const clearAllFilters = () => {
    setDataRange([300]);
    setPriceRange([50]);
    setNetworkType('all');
    selectedOperators.forEach(op => handleOperatorChange(op));
    setSelectedSources(['supabase', 'timeone']);
    setUnlimitedCalls(true);
    setRoamingIncluded(false);
    setPlanType('all');
  };
  
  const handleSourceChange = (source: DataSource) => {
    if (selectedSources.includes(source)) {
      if (selectedSources.length > 1) {
        setSelectedSources(selectedSources.filter(s => s !== source));
      }
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };
  
  // Composant Section Accordéon
  const AccordionSection = ({ 
    title, 
    icon, 
    section, 
    children,
    badge 
  }: { 
    title: string;
    icon: React.ReactNode;
    section: string;
    children: React.ReactNode;
    badge?: React.ReactNode;
  }) => (
    <div className="border-b border-gray-100 dark:border-gray-700 last:border-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between py-4 px-1 
          hover:bg-gray-50 dark:hover:bg-gray-800 
          transition-colors rounded-lg group"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 
            bg-gray-100 dark:bg-gray-700 
            rounded-lg 
            group-hover:bg-gray-200 dark:group-hover:bg-gray-600 
            transition-colors">
            {icon}
          </div>
          <span className="font-medium 
            text-gray-900 dark:text-gray-100">{title}</span>
          {badge}
        </div>
        <motion.div
          animate={{ rotate: expandedSections.includes(section) ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 
            text-gray-400 dark:text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {expandedSections.includes(section) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4 px-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  
  // Indicateur de commission moyenne
  const averageCommission = useMemo(() => {
    if (!showSourceFilter || !selectedSources.includes('timeone')) return null;
    // Calculer en fonction des opérateurs sélectionnés
    const baseCommission = 30;
    const operatorBonus = selectedOperators.includes('Bouygues Telecom') ? 15 : 0;
    const dataBonus = dataRange[0] >= 100 ? 10 : 0;
    return baseCommission + operatorBonus + dataBonus;
  }, [selectedOperators, dataRange, selectedSources, showSourceFilter]);

  return (
    <div className="h-full flex flex-col 
      bg-white dark:bg-gray-800 
      rounded-xl shadow-sm 
      border border-gray-100 dark:border-gray-700 
      transition-colors">
      {/* En-tête amélioré */}
      <div className="p-4 
        border-b border-gray-100 dark:border-gray-700 
        bg-gradient-to-r from-indigo-50 to-purple-50 
        dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 
              bg-white dark:bg-gray-700 
              rounded-lg shadow-sm">
              <SlidersHorizontal className="h-5 w-5 
                text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold 
                text-gray-900 dark:text-gray-100">Filtres</h2>
              {activeFilters.length > 0 && (
                <p className="text-xs 
                  text-gray-500 dark:text-gray-400 mt-0.5">
                  {activeFilters.length} filtre{activeFilters.length > 1 ? 's' : ''} actif{activeFilters.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 
                text-gray-600 dark:text-gray-400 
                hover:bg-gray-100 dark:hover:bg-gray-700" 
              onClick={() => setFiltersOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Filtres actifs avec animation */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 
              bg-gradient-to-r from-indigo-50/50 to-purple-50/50 
              dark:from-gray-800/50 dark:to-gray-700/50 
              border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium 
                  text-gray-700 dark:text-gray-300">Filtres actifs</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs 
                    text-indigo-600 dark:text-indigo-400 
                    hover:text-indigo-700 dark:hover:text-indigo-300 
                    h-auto p-1"
                >
                  Effacer tout
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <motion.button
                    key={filter.key}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => removeFilter(filter.key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105",
                      "bg-white dark:bg-gray-700 border shadow-sm hover:shadow-md",
                      {
                        'border-blue-200 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30': filter.color === 'blue',
                        'border-green-200 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30': filter.color === 'green',
                        'border-purple-200 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30': filter.color === 'purple',
                        'border-orange-200 dark:border-orange-600 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/30': filter.color === 'orange',
                        'border-teal-200 dark:border-teal-600 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30': filter.color === 'teal',
                        'border-red-200 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30': filter.color === 'red',
                        'border-indigo-200 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30': filter.color === 'indigo',
                        'border-violet-200 dark:border-violet-600 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/30': filter.color === 'violet',
                        'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/30': !filter.color,
                      }
                    )}
                  >
                    {filter.label}
                    <X className="w-3 h-3" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Indicateur de commission potentielle */}
      {averageCommission && selectedSources.includes('timeone') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4 p-3 
            bg-gradient-to-r from-green-50 to-emerald-50 
            dark:from-green-900/30 dark:to-emerald-900/30 
            rounded-lg 
            border border-green-200 dark:border-green-700"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 
              text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium 
              text-green-800 dark:text-green-300">
              Commission moyenne estimée: {averageCommission}€
            </span>
          </div>
        </motion.div>
      )}

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {/* Source Filter - Multi-opérateurs */}
        {showSourceFilter && (
          <AccordionSection 
            title="Source des offres" 
            icon={<Star className="h-4 w-4 text-orange-500 dark:text-orange-400" />} 
            section="source"
            badge={
              selectedSources.includes('timeone') && (
                <Badge variant="secondary" className="text-xs 
                  bg-orange-100 dark:bg-orange-900/30 
                  text-orange-700 dark:text-orange-300 
                  border-orange-200 dark:border-orange-700">
                  TimeOne
                </Badge>
              )
            }
          >
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-lg 
                border border-gray-200 dark:border-gray-600 
                cursor-pointer 
                hover:bg-gray-50 dark:hover:bg-gray-700 
                transition-colors group">
                <Checkbox
                  id="source-supabase"
                  checked={selectedSources.includes('supabase')}
                  onCheckedChange={() => handleSourceChange('supabase')}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium 
                      text-gray-900 dark:text-gray-100 
                      group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      Offres standard
                    </span>
                    <Badge variant="outline" className="text-xs 
                      border-gray-300 dark:border-gray-600 
                      text-gray-700 dark:text-gray-300">
                      Tous opérateurs
                    </Badge>
                  </div>
                  <p className="text-xs 
                    text-gray-500 dark:text-gray-400 mt-1">
                    Forfaits classiques de tous les opérateurs
                  </p>
                </div>
              </label>
              
              <label className="flex items-start gap-3 p-3 rounded-lg 
                border border-orange-200 dark:border-orange-600 
                bg-orange-50/50 dark:bg-orange-900/20 
                cursor-pointer 
                hover:bg-orange-50 dark:hover:bg-orange-900/30 
                transition-colors group">
                <Checkbox
                  id="source-timeone"
                  checked={selectedSources.includes('timeone')}
                  onCheckedChange={() => handleSourceChange('timeone')}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium 
                      text-gray-900 dark:text-gray-100 
                      group-hover:text-orange-600 dark:group-hover:text-orange-400">
                      Offres partenaires
                    </span>
                    <Badge className="text-xs 
                      bg-orange-500 dark:bg-orange-600 
                      text-white">
                      TimeOne
                    </Badge>
                  </div>
                  <p className="text-xs 
                    text-gray-500 dark:text-gray-400 mt-1">
                    Offres exclusives avec commission
                  </p>
                </div>
              </label>
            </div>
          </AccordionSection>
        )}
        
        {/* Type de forfait */}
        <AccordionSection 
          title="Type de forfait" 
          icon={<Zap className="h-4 w-4 text-purple-500 dark:text-purple-400" />} 
          section="type"
        >
          <div className="grid grid-cols-1 gap-2">
            {[
              { value: 'all' as const, label: 'Tous les forfaits', icon: '🎯' },
              { value: 'no-commitment' as const, label: 'Sans engagement', icon: '🆓' },
              { value: 'with-commitment' as const, label: 'Avec engagement', icon: '📝' },
              { value: 'prepaid' as const, label: 'Prépayé', icon: '💳' }
            ].map(option => (
              <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg 
                border border-gray-200 dark:border-gray-600 
                cursor-pointer 
                hover:bg-gray-50 dark:hover:bg-gray-700 
                transition-colors group">
                <input
                  type="radio"
                  name="planType"
                  value={option.value}
                  checked={planType === option.value}
                  onChange={(e) => setPlanType(e.target.value as typeof option.value)}
                  className="text-indigo-600 dark:text-indigo-400"
                />
                <span className="text-2xl">{option.icon}</span>
                <span className="text-sm font-medium 
                  text-gray-700 dark:text-gray-300 
                  group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </AccordionSection>

        {/* Volume de données avec présets */}
        <AccordionSection 
          title="Volume de données" 
          icon={<Wifi className="h-4 w-4 text-blue-500 dark:text-blue-400" />} 
          section="data"
          badge={
            dataRange[0] < 300 && (
              <Badge variant="secondary" className="text-xs 
                bg-blue-100 dark:bg-blue-900/30 
                text-blue-700 dark:text-blue-300 
                border-blue-200 dark:border-blue-700">
                Max {dataRange[0]} Go
              </Badge>
            )
          }
        >
          <div className="space-y-4">
            {/* Présets populaires */}
            <div className="grid grid-cols-4 gap-2">
              {[10, 50, 100, 300].map(value => (
                <Button
                  key={value}
                  variant={dataRange[0] === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDataRange([value])}
                  className={cn(
                    "text-xs",
                    dataRange[0] === value 
                      ? "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white border-0"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                >
                  {value === 300 ? '∞' : `${value}Go`}
                </Button>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm 
                  text-gray-600 dark:text-gray-400">Volume maximum</span>
                <span className="text-sm font-semibold 
                  text-indigo-600 dark:text-indigo-400">
                  {dataRange[0] === 300 ? 'Illimité' : `${dataRange[0]} Go`}
                </span>
              </div>
              <Slider
                value={dataRange}
                onValueChange={setDataRange}
                max={300}
                step={5}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs 
                text-gray-400 dark:text-gray-500">
                <span>5 Go</span>
                <span>100 Go</span>
                <span>200 Go</span>
                <span>Illimité</span>
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* Prix mensuel amélioré */}
        <AccordionSection 
          title="Budget mensuel" 
          icon={<Euro className="h-4 w-4 text-green-500 dark:text-green-400" />} 
          section="price"
          badge={
            priceRange[0] < 50 && (
              <Badge variant="secondary" className="text-xs 
                bg-green-100 dark:bg-green-900/30 
                text-green-700 dark:text-green-300 
                border-green-200 dark:border-green-700">
                Max {priceRange[0]}€
              </Badge>
            )
          }
        >
          <div className="space-y-4">
            {/* Présets de prix */}
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30, 50].map(value => (
                <Button
                  key={value}
                  variant={priceRange[0] === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriceRange([value])}
                  className={cn(
                    "text-xs",
                    priceRange[0] === value 
                      ? "bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white border-0"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                >
                  {value}€
                </Button>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm 
                  text-gray-600 dark:text-gray-400">Prix maximum</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0])}
                    className="w-16 px-2 py-1 text-sm text-right 
                      border border-gray-200 dark:border-gray-600 
                      bg-white dark:bg-gray-700 
                      text-gray-900 dark:text-gray-100 
                      rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  />
                  <span className="text-sm font-medium 
                    text-gray-600 dark:text-gray-400">€/mois</span>
                </div>
              </div>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={50}
                step={1}
                className="cursor-pointer"
              />
            </div>
          </div>
        </AccordionSection>

        {/* Options avec switches animés */}
        <AccordionSection 
          title="Options incluses" 
          icon={<Check className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />} 
          section="options"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg 
              bg-gray-50 dark:bg-gray-700 
              hover:bg-gray-100 dark:hover:bg-gray-600 
              transition-colors">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 
                  text-indigo-500 dark:text-indigo-400" />
                <div>
                  <span className="text-sm font-medium 
                    text-gray-900 dark:text-gray-100">Appels/SMS illimités</span>
                  <p className="text-xs 
                    text-gray-500 dark:text-gray-400">En France métropolitaine</p>
                </div>
              </div>
              <Switch
                checked={unlimitedCalls}
                onCheckedChange={setUnlimitedCalls}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg 
              bg-gray-50 dark:bg-gray-700 
              hover:bg-gray-100 dark:hover:bg-gray-600 
              transition-colors">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 
                  text-purple-500 dark:text-purple-400" />
                <div>
                  <span className="text-sm font-medium 
                    text-gray-900 dark:text-gray-100">Roaming Europe</span>
                  <p className="text-xs 
                    text-gray-500 dark:text-gray-400">Data à l'étranger incluse</p>
                </div>
              </div>
              <Switch
                checked={roamingIncluded}
                onCheckedChange={setRoamingIncluded}
              />
            </div>
          </div>
        </AccordionSection>

        {/* Network Type avec boutons visuels */}
        <AccordionSection 
          title="Type de réseau" 
          icon={<Signal className="h-4 w-4 text-teal-500 dark:text-teal-400" />} 
          section="network"
        >
          <div className="grid grid-cols-3 gap-2">
            {(['all', '4G', '5G'] as const).map(network => (
              <motion.button
                key={network}
                whileTap={{ scale: 0.95 }}
                onClick={() => setNetworkType(network)}
                className={cn(
                  "relative p-3 rounded-lg border-2 transition-all",
                  networkType === network
                    ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  <Signal className={cn(
                    "w-5 h-5",
                    networkType === network 
                      ? "text-indigo-600 dark:text-indigo-400" 
                      : "text-gray-400 dark:text-gray-500"
                  )} />
                  <span className={cn(
                    "text-xs font-medium",
                    networkType === network 
                      ? "text-indigo-600 dark:text-indigo-400" 
                      : "text-gray-600 dark:text-gray-400"
                  )}>
                    {network === 'all' ? 'Tous' : network}
                  </span>
                </div>
                {network === '5G' && (
                  <Sparkles className="absolute top-1 right-1 w-3 h-3 
                    text-yellow-500 dark:text-yellow-400" />
                )}
              </motion.button>
            ))}
          </div>
        </AccordionSection>

        {/* Opérateurs avec logos et badges */}
        <AccordionSection 
          title="Opérateurs" 
          icon={<Phone className="h-4 w-4 text-red-500 dark:text-red-400" />} 
          section="operators"
          badge={
            selectedOperators.length > 0 && selectedOperators.length < operators.length && (
              <Badge variant="secondary" className="text-xs 
                bg-red-100 dark:bg-red-900/30 
                text-red-700 dark:text-red-300 
                border-red-200 dark:border-red-700">
                {selectedOperators.length} sélectionné{selectedOperators.length > 1 ? 's' : ''}
              </Badge>
            )
          }
        >
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => operators.forEach(op => {
                  if (!selectedOperators.includes(op)) handleOperatorChange(op);
                })}
                className="text-xs flex-1 
                  border-gray-300 dark:border-gray-600 
                  text-gray-700 dark:text-gray-300 
                  hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Tout sélectionner
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectedOperators.forEach(op => handleOperatorChange(op))}
                className="text-xs flex-1 
                  border-gray-300 dark:border-gray-600 
                  text-gray-700 dark:text-gray-300 
                  hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Tout déselectionner
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {operators.map(operator => {
                const isTimeOneOperator = ['Bouygues Telecom', 'SFR', 'Youprice', 'Auchan Télécom'].includes(operator);
                const isSelected = selectedOperators.includes(operator);
                
                return (
                  <motion.button
                    key={operator}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOperatorChange(operator)}
                    className={cn(
                      "relative p-3 rounded-lg border-2 transition-all group",
                      isSelected
                        ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className={cn(
                        "text-xs font-medium text-center",
                        isSelected 
                          ? "text-indigo-700 dark:text-indigo-300" 
                          : "text-gray-700 dark:text-gray-300"
                      )}>
                        {operator.split(' ')[0]}
                      </div>
                      {operator.split(' ')[1] && (
                        <div className={cn(
                          "text-xs",
                          isSelected 
                            ? "text-indigo-600 dark:text-indigo-400" 
                            : "text-gray-500 dark:text-gray-400"
                        )}>
                          {operator.split(' ')[1]}
                        </div>
                      )}
                    </div>
                    {isTimeOneOperator && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1"
                      >
                        <div className="p-1 
                          bg-orange-500 dark:bg-orange-600 
                          rounded-full">
                          <Star className="w-2.5 h-2.5 text-white" />
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
            
            {selectedSources.includes('timeone') && (
              <p className="text-xs 
                text-gray-500 dark:text-gray-400 
                text-center mt-2">
                <Star className="w-3 h-3 
                  text-orange-500 dark:text-orange-400 
                  inline mr-1" />
                Opérateurs avec offres partenaires
              </p>
            )}
          </div>
        </AccordionSection>
      </div>
    </div>
  );
};

export default FilterPanel;