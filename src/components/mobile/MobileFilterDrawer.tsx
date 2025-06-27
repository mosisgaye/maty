import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { 
  Filter, X, ChevronDown, Wifi, Euro, Phone, Signal, 
  Star, Check, Sparkles, SlidersHorizontal, Search,
  Zap, Globe
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { NetworkType, DataSource } from '@/types/mobile';
import { cn } from '@/lib/utils';

// ✅ INTERFACE COMPLÈTE CORRIGÉE
interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  
  // États des filtres basiques
  dataRange: number[];
  setDataRange: (value: number[]) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  networkType: NetworkType;
  setNetworkType: (value: NetworkType) => void;
  selectedOperators: string[];
  operators: string[];
  handleOperatorChange: (operator: string) => void;
  
  // Sources de données
  selectedSources: DataSource[];
  setSelectedSources: (sources: DataSource[]) => void;
  
  // ✅ NOUVEAUX FILTRES AJOUTÉS
  unlimitedCalls: boolean;
  setUnlimitedCalls: (value: boolean) => void;
  roamingIncluded: boolean;
  setRoamingIncluded: (value: boolean) => void;
  planType: 'all' | 'prepaid' | 'with-commitment' | 'no-commitment';
  setPlanType: (value: 'all' | 'prepaid' | 'with-commitment' | 'no-commitment') => void;
  
  // Actions et compteurs
  activeFiltersCount: number;
  onApply: () => void;  // ← Renommé pour correspondre
  onReset: () => void;  // ← Renommé pour correspondre
}

// Composant Quick Filter Pills
const QuickFilterPill: React.FC<{ 
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all",
      isActive 
        ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
    )}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </motion.button>
);

// Composant Slider personnalisé pour mobile
const CustomSlider: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  format: (value: number) => string;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}> = ({ value, onChange, min, max, step = 1, format, isDragging, setIsDragging }) => {
  return (
    <div className="relative py-6">
      <div className="text-center mb-4">
        <span className="text-lg font-bold text-indigo-600">
          {format(value)}
        </span>
      </div>
      
      <div className="relative h-2 bg-gray-200 rounded-full mx-4">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
          animate={{ scale: isDragging ? [1, 1.02, 1] : 1 }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-indigo-500"
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 16px)` }}
          animate={{ scale: isDragging ? 1.2 : 1 }}
        />
        
        {/* Marqueurs visuels */}
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
          <span className="text-xs text-gray-500">{format(min)}</span>
          <span className="text-xs text-gray-500">{format(max)}</span>
        </div>
      </div>
    </div>
  );
};

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  dataRange,
  setDataRange,
  priceRange,
  setPriceRange,
  networkType,
  setNetworkType,
  selectedOperators,
  operators,
  handleOperatorChange,
  selectedSources,
  setSelectedSources,
  unlimitedCalls,
  setUnlimitedCalls,
  roamingIncluded,
  setRoamingIncluded,
  planType,
  setPlanType,
  activeFiltersCount,
  onApply,
  onReset
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllOperators, setShowAllOperators] = useState(false);
  const [isDraggingData, setIsDraggingData] = useState(false);
  const [isDraggingPrice, setIsDraggingPrice] = useState(false);
  
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0]);
  const scale = useTransform(y, [0, 300], [1, 0.9]);
  
  // Gestion du swipe pour fermer
  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };
  
  // Filtrage des opérateurs par recherche
  const filteredOperators = operators.filter(op => 
    op.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Opérateurs visibles (6 max si non étendu)
  const visibleOperators = showAllOperators 
    ? filteredOperators 
    : filteredOperators.slice(0, 6);
  
  // Quick filters presets
  const quickFilters = [
    {
      label: 'Moins de 10€',
      icon: <Euro className="w-4 h-4" />,
      isActive: priceRange[0] <= 10,
      action: () => setPriceRange([10])
    },
    {
      label: '5G uniquement',
      icon: <Signal className="w-4 h-4" />,
      isActive: networkType === '5G',
      action: () => setNetworkType('5G')
    },
    {
      label: '100Go+',
      icon: <Wifi className="w-4 h-4" />,
      isActive: dataRange[0] >= 100,
      action: () => setDataRange([100])
    },
    {
      label: 'Partenaires',
      icon: <Star className="w-4 h-4" />,
      isActive: selectedSources.length === 1 && selectedSources[0] === 'timeone',
      action: () => setSelectedSources(['timeone'])
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ opacity, scale, y }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Handle de glissement */}
            <div className="flex justify-center p-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Filtres</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {activeFiltersCount} filtres actifs
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto px-6 pb-24 max-h-[70vh]">
              {/* Quick Filters */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Filtres rapides</h3>
                <div className="flex flex-wrap gap-2">
                  {quickFilters.map((filter, index) => (
                    <QuickFilterPill
                      key={index}
                      label={filter.label}
                      icon={filter.icon}
                      isActive={filter.isActive}
                      onClick={filter.action}
                    />
                  ))}
                </div>
              </div>
              
              {/* Prix */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Prix mensuel</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={50}
                  min={0}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0€</span>
                  <span className="font-medium text-indigo-600">
                    {priceRange[0] >= 50 ? 'Plus de 50€' : `${priceRange[0]}€`}
                  </span>
                  <span>50€+</span>
                </div>
              </div>
              
              {/* Volume de données */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Volume de données</h3>
                <Slider
                  value={dataRange}
                  onValueChange={setDataRange}
                  max={300}
                  min={5}
                  step={5}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5Go</span>
                  <span className="font-medium text-indigo-600">
                    {dataRange[0] >= 300 ? 'Illimité' : `${dataRange[0]}Go`}
                  </span>
                  <span>Illimité</span>
                </div>
              </div>
              
              {/* Type de réseau */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Type de réseau</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['all', '4G', '5G'].map((type) => (
                    <Button
                      key={type}
                      variant={networkType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNetworkType(type as NetworkType)}
                      className="text-xs"
                    >
                      {type === 'all' ? 'Tous' : type}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Type de forfait */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Type de forfait</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Tous les forfaits' },
                    { value: 'no-commitment', label: 'Sans engagement' },
                    { value: 'with-commitment', label: 'Avec engagement' },
                    { value: 'prepaid', label: 'Prépayé' }
                  ].map((type) => (
                    <Button
                      key={type.value}
                      variant={planType === type.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPlanType(type.value as any)}
                      className="w-full justify-start text-xs"
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Options supplémentaires */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Options</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Appels illimités</span>
                    <Switch
                      checked={unlimitedCalls}
                      onCheckedChange={setUnlimitedCalls}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Roaming inclus</span>
                    <Switch
                      checked={roamingIncluded}
                      onCheckedChange={setRoamingIncluded}
                    />
                  </div>
                </div>
              </div>
              
              {/* Opérateurs */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Opérateurs ({selectedOperators.length} sélectionnés)
                </h3>
                
                {/* Barre de recherche */}
                {operators.length > 6 && (
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher un opérateur..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                )}
                
                {/* Liste des opérateurs */}
                <div className="space-y-2">
                  {visibleOperators.map((operator) => (
                    <div key={operator} className="flex items-center justify-between">
                      <span className="text-sm">{operator}</span>
                      <Checkbox
                        checked={selectedOperators.includes(operator)}
                        onCheckedChange={() => handleOperatorChange(operator)}
                      />
                    </div>
                  ))}
                  
                  {!showAllOperators && filteredOperators.length > 6 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllOperators(true)}
                      className="w-full text-xs text-indigo-600"
                    >
                      Voir {filteredOperators.length - 6} autres opérateurs
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Sources de données */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Source des offres</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Offres standards</span>
                    <Checkbox
                      checked={selectedSources.includes('supabase')}
                      onCheckedChange={() => {
                        if (selectedSources.includes('supabase')) {
                          setSelectedSources(selectedSources.filter(s => s !== 'supabase'));
                        } else {
                          setSelectedSources([...selectedSources, 'supabase']);
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Offres partenaires</span>
                    <Checkbox
                      checked={selectedSources.includes('timeone')}
                      onCheckedChange={() => {
                        if (selectedSources.includes('timeone')) {
                          setSelectedSources(selectedSources.filter(s => s !== 'timeone'));
                        } else {
                          setSelectedSources([...selectedSources, 'timeone']);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions en bas */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onReset}
                  className="flex-1"
                  disabled={activeFiltersCount === 0}
                >
                  Réinitialiser
                </Button>
                <Button
                  onClick={onApply}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Appliquer les filtres
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileFilterDrawer;