
import React from 'react';
import { Phone } from '@/types/phones';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { CheckCircle, XCircle, HelpCircle, Leaf } from 'lucide-react';

interface PhoneComparisonTableProps {
  phones: Phone[];
}

const PhoneComparisonTable = ({ phones }: PhoneComparisonTableProps) => {
  // Format price with Euro symbol
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  // Render appropriate icon for boolean values
  const renderBooleanIcon = (value: boolean | undefined) => {
    if (value === true) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (value === false) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return <HelpCircle className="h-5 w-5 text-muted-foreground" />;
  };
  
  // If no phones to compare
  if (phones.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Aucun téléphone sélectionné pour la comparaison.
        </p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Caractéristiques</TableHead>
            {phones.map(phone => (
              <TableHead key={phone.id} className="text-center">
                <div className="flex flex-col items-center">
                  <img 
                    src={phone.image || '/placeholder.svg'} 
                    alt={phone.title} 
                    className="h-20 object-contain mb-2" 
                  />
                  <span className="font-medium">{phone.trademark}</span>
                  <span className="text-sm text-muted-foreground line-clamp-2 text-center">
                    {phone.title}
                  </span>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Price */}
          <TableRow>
            <TableCell className="font-medium">Prix</TableCell>
            {phones.map(phone => (
              <TableCell key={`${phone.id}-price`} className="text-center">
                <div className="font-bold text-lg">{formatPrice(phone.price)}</div>
                {phone.originalPrice && phone.originalPrice > phone.price && (
                  <div className="text-sm text-muted-foreground line-through">
                    {formatPrice(phone.originalPrice)}
                  </div>
                )}
              </TableCell>
            ))}
          </TableRow>
          
          {/* Installment */}
          <TableRow>
            <TableCell className="font-medium">Mensualités</TableCell>
            {phones.map(phone => (
              <TableCell key={`${phone.id}-installment`} className="text-center">
                {phone.installmentPrice && phone.installmentMonths ? (
                  <span>{phone.installmentPrice}€/mois × {phone.installmentMonths} mois</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            ))}
          </TableRow>
          
          {/* Operating System */}
          <TableRow>
            <TableCell className="font-medium">Système d'exploitation</TableCell>
            {phones.map(phone => (
              <TableCell key={`${phone.id}-os`} className="text-center">
                {phone.operatingSystem || <span className="text-muted-foreground">-</span>}
              </TableCell>
            ))}
          </TableRow>
          
          {/* Storage */}
          <TableRow>
            <TableCell className="font-medium">Stockage</TableCell>
            {phones.map(phone => (
              <TableCell key={`${phone.id}-storage`} className="text-center">
                {phone.storage || <span className="text-muted-foreground">-</span>}
              </TableCell>
            ))}
          </TableRow>
          
          {/* Color */}
          <TableRow>
            <TableCell className="font-medium">Couleur</TableCell>
            {phones.map(phone => (
              <TableCell key={`${phone.id}-color`} className="text-center">
                {phone.color || <span className="text-muted-foreground">-</span>}
              </TableCell>
            ))}
          </TableRow>
          
          {/* Condition */}
          <TableRow>
            <TableCell className="font-medium">État</TableCell>
            {phones.map(phone => (
              <TableCell key={`${phone.id}-condition`} className="text-center">
                {phone.condition === 'new' ? 'Neuf' : 
                 phone.condition === 'refurbished' ? 'Reconditionné' : 
                 phone.condition === 'used' ? 'Occasion' : 
                 <span className="text-muted-foreground">-</span>}
              </TableCell>
            ))}
          </TableRow>
          
          {/* Eco-friendly */}
          <TableRow>
            <TableCell className="font-medium">
              <span className="flex items-center">
                <Leaf className="h-4 w-4 mr-1 text-green-500" />
                Éco-responsable
              </span>
            </TableCell>
            {phones.map(phone => (
              <TableCell key={`${phone.id}-eco`} className="text-center">
                {renderBooleanIcon(phone.isEcoFriendly)}
              </TableCell>
            ))}
          </TableRow>
          
          {/* Shipping */}
          <TableRow>
            <TableCell className="font-medium">Livraison</TableCell>
            {phones.map(phone => (
              <TableCell key={`${phone.id}-shipping`} className="text-center">
                {phone.shipping || <span className="text-muted-foreground">-</span>}
              </TableCell>
            ))}
          </TableRow>
          
          {/* Merchant */}
          <TableRow>
            <TableCell className="font-medium">Vendeur</TableCell>
            {phones.map(phone => (
              <TableCell key={`${phone.id}-merchant`} className="text-center">
                {phone.merchant || <span className="text-muted-foreground">-</span>}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default PhoneComparisonTable;
