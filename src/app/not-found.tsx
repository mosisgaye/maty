// src/app/not-found.tsx
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page non trouvée',
  description: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page non trouvée</h2>
        <p className="text-muted-foreground mb-6">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <a href="/" className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors">
          <HomeIcon className="h-4 w-4" />
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}