// src/providers/toast-provider.tsx
'use client';

import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <TooltipProvider>
      {children}
      
      <Toaster 
        position="bottom-right"
        expand={true}
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          classNames: {
            toast: 'group toast',
            description: 'group-[.toast]:text-muted-foreground',
            actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
            cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          },
        }}
      />
      
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom"
        />
      )}
    </TooltipProvider>
  );
}