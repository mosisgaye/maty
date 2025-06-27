// src/providers/index.tsx - Provider principal
'use client';

import QueryProvider from './query-provider';
import ToastProvider from './toast-provider';
import { ThemeProvider } from './theme-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}