'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Éviter l'hydration mismatch NextJS
  useEffect(() => {
    setMounted(true);
    
    // Vérifier localStorage seulement côté client
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('theme') === 'dark' || 
                     (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDarkMode(isDark);
      
      // Appliquer le thème immédiatement
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Appliquer le thème quand isDarkMode change
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (error) {
      console.warn('Theme localStorage error:', error);
    }
  }, [isDarkMode, mounted]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Placeholder pendant l'hydration
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-9 h-9"
        disabled
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 transition-all duration-300 hover:bg-muted/50"
      aria-label={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      {isDarkMode ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500 rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-gray-700 rotate-0 scale-100 transition-all" />
      )}
    </Button>
  );
};

export default ThemeToggle;