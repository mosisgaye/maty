// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Une erreur s'est produite</h1>
        <p className="text-muted-foreground mb-6">
          Désolé, quelque chose s'est mal passé. Veuillez réessayer.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>
            Réessayer
          </Button>
          <a href="/" className="inline-flex items-center justify-center h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}

// ===================================

