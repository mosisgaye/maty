
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PhoneEmptyState = () => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-8 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="bg-muted rounded-full p-3">
          <X className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">Aucun téléphone trouvé</h3>
        <p className="text-muted-foreground max-w-md">
          Aucun téléphone ne correspond à vos critères de recherche.
          Essayez de modifier ou de réinitialiser vos filtres.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  );
};

export default PhoneEmptyState;
