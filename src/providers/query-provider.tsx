// src/providers/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// Configuration optimisée pour Next.js 14
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Avec SSR, nous voulons généralement désactiver refetch sur le client
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes (anciennement cacheTime)
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: (failureCount, error: any) => {
          // Ne pas réessayer sur 404
          if (error?.status === 404) return false;
          // Maximum 2 tentatives
          return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: 1,
        onError: (error) => {
          console.error('Mutation error:', error);
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Serveur - toujours créer un nouveau client
    return makeQueryClient();
  } else {
    // Navigateur - réutiliser le client existant
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface QueryProviderProps {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  // NOTE: Éviter useState lors du SSR peut causer une désynchronisation
  // entre le serveur et le client, utilisez donc toujours useState
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}