
import React from 'react';
import { BarChart2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  DrawerTrigger,
} from "@/components/ui/drawer";
import PhoneComparisonTable from './PhoneComparisonTable';
import { Phone } from '@/types/phones';

interface PhoneComparisonButtonProps {
  comparisonList: string[];
  comparisonPhones: Phone[];
}

const PhoneComparisonButton = ({ 
  comparisonList,
  comparisonPhones 
}: PhoneComparisonButtonProps) => {
  if (comparisonList.length === 0) return null;
  
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="mb-4"
        >
          <BarChart2 className="h-4 w-4 mr-2" />
          Comparer {comparisonList.length} téléphone{comparisonList.length > 1 ? 's' : ''}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Comparaison de téléphones</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 py-2">
          <PhoneComparisonTable phones={comparisonPhones} />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Fermer</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PhoneComparisonButton;
