// components/box/FilterPanel.tsx
import React from 'react';
import { Box, BoxFilters, TECHNOLOGIES, ENGAGEMENT_OPTIONS, TV_OPTIONS, WIFI_STANDARDS } from '@/types/box';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  RotateCcw, 
  Wifi, 
  Zap, 
  Euro, 
  Tv, 
  Phone, 
  Calendar,
  Router,
  Shield
} from 'lucide-react';

interface FilterPanelProps {
  filters: BoxFilters;
  setFilters: (filters: BoxFilters) => void;
  onReset: () => void;
  activeFiltersCount: number;
  availableBoxes: Box[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  setFilters,
  onReset,
  activeFiltersCount,
  availableBoxes
}) => {
  // Calculer les plages de prix et débit disponibles
  const prices = availableBoxes.map(box => box.prix_mensuel);
  const speeds = availableBoxes.map(box => box.debit_down);
  const maxPrice = Math.max(...prices);
  const maxSpeed = Math.max(...speeds);

  // Mise à jour des filtres
  const updateFilter = <K extends keyof BoxFilters>(
    key: K,
    value: BoxFilters[K]
  ) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <Card className="sticky top-4 h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Router className="w-5 h-5 text-blue-600" />
            Filtres
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="w-full text-gray-600 hover:text-gray-900"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Technologie */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Technologie
          </Label>
          <RadioGroup
            value={filters.technology}
            onValueChange={(value) => updateFilter('technology', value as any)}
            className="space-y-2"
          >
            {TECHNOLOGIES.map((tech) => (
              <div key={tech.value} className="flex items-center space-x-2">
                <RadioGroupItem value={tech.value} id={tech.value} />
                <Label htmlFor={tech.value} className="text-sm cursor-pointer">
                  {tech.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* Prix mensuel */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Euro className="w-4 h-4 text-green-500" />
            Prix mensuel maximum
          </Label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value)}
              max={maxPrice}
              min={10}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10€</span>
              <span className="font-medium text-blue-600">
                {filters.priceRange[0]}€/mois
              </span>
              <span>{maxPrice}€</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Débit descendant */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Wifi className="w-4 h-4 text-blue-500" />
            Débit minimum
          </Label>
          <div className="px-2">
            <Slider
              value={filters.speedRange}
              onValueChange={(value) => updateFilter('speedRange', value)}
              max={maxSpeed}
              min={20}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>20 Mb/s</span>
              <span className="font-medium text-blue-600">
                {filters.speedRange[0]} Mb/s
              </span>
              <span>{maxSpeed} Mb/s</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Engagement */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            Engagement
          </Label>
          <RadioGroup
            value={filters.engagement}
            onValueChange={(value) => updateFilter('engagement', value as any)}
            className="space-y-2"
          >
            {ENGAGEMENT_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="text-sm cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* TV incluse */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Tv className="w-4 h-4 text-red-500" />
            Télévision
          </Label>
          <RadioGroup
            value={filters.tvIncluded}
            onValueChange={(value) => updateFilter('tvIncluded', value as any)}
            className="space-y-2"
          >
            {TV_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="text-sm cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* Options supplémentaires */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-500" />
            Options
          </Label>
          
          <div className="space-y-3">
            {/* Téléphone fixe */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="phone"
                checked={filters.phoneIncluded}
                onCheckedChange={(checked) => 
                  updateFilter('phoneIncluded', !!checked)
                }
              />
              <Label htmlFor="phone" className="text-sm cursor-pointer flex items-center gap-2">
                <Phone className="w-3 h-3" />
                Téléphone fixe inclus
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Standard Wi-Fi */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Wifi className="w-4 h-4 text-indigo-500" />
            Standard Wi-Fi
          </Label>
          <div className="space-y-2">
            {WIFI_STANDARDS.map((standard) => (
              <div key={standard} className="flex items-center space-x-2">
                <Checkbox
                  id={standard}
                  checked={filters.wifiStandard.includes(standard)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilter('wifiStandard', [...filters.wifiStandard, standard]);
                    } else {
                      updateFilter('wifiStandard', 
                        filters.wifiStandard.filter(s => s !== standard)
                      );
                    }
                  }}
                />
                <Label htmlFor={standard} className="text-sm cursor-pointer">
                  {standard}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiques des résultats */}
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <div className="font-medium mb-1">Résultats filtrés</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {availableBoxes.filter(box => {
                // Appliquer les mêmes filtres pour compter
                if (filters.technology !== 'all' && box.technologie !== filters.technology) return false;
                if (box.prix_mensuel > filters.priceRange[0]) return false;
                if (box.debit_down < filters.speedRange[0]) return false;
                if (filters.engagement === 'with' && box.engagement === 0) return false;
                if (filters.engagement === 'without' && box.engagement > 0) return false;
                if (filters.tvIncluded === 'with' && !box.tv_incluse) return false;
                if (filters.tvIncluded === 'without' && box.tv_incluse) return false;
                if (filters.phoneIncluded && !box.telephone_fixe) return false;
                if (filters.wifiStandard.length > 0 && !filters.wifiStandard.includes(box.wifi)) return false;
                return true;
              }).length} offres correspondent à vos critères
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;