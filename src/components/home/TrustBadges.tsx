// src/components/home/TrustBadges.tsx
'use client';

import { useEffect, useState } from 'react';

export default function TrustBadges() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-8 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {mounted ? '10 000+' : '10 000+'}
            </p>
            <p className="text-sm text-muted-foreground">Utilisateurs satisfaits</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">98%</p>
            <p className="text-sm text-muted-foreground">Taux de satisfaction</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">24/7</p>
            <p className="text-sm text-muted-foreground">Support disponible</p>
          </div>
        </div>
      </div>
    </section>
  );
}