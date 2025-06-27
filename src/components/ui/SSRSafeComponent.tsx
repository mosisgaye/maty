'use client';

import { useEffect, useState } from 'react';

interface SSRSafeComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Composant qui s'assure que ses enfants ne s'exécutent que côté client
 * Utile pour éviter les erreurs de localStorage, window, document, etc.
 */
export const SSRSafeComponent: React.FC<SSRSafeComponentProps> = ({ 
  children, 
  fallback = null 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Hook pour vérifier si on est côté client
 */
export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};