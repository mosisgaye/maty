'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Phone, Wifi, Home, Flame, Package, Smartphone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactElement;
}

const navItems: NavItem[] = [
  { label: 'Forfait Mobile', href: '/forfaits-mobiles', icon: <Smartphone className="w-4 h-4 mr-2" /> },
  { label: 'Box Internet', href: '/internet', icon: <Wifi className="w-4 h-4 mr-2" /> },
  { label: 'Téléphones', href: '/telephones', icon: <Phone className="w-4 h-4 mr-2" /> },
  { label: 'Box + Mobile', href: '/packages', icon: <Package className="w-4 h-4 mr-2" /> },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Gestion du défilement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Blocage du défilement
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Fermeture au clic externe
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header 
      ref={headerRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 h-16",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-lg" 
          : "bg-transparent"
      )}
    >
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ComparePrix
          </span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg transition-all duration-200 flex items-center text-sm font-medium",
                  isActive
                    ? "bg-primary/10 dark:bg-primary/20 text-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {React.cloneElement(item.icon, { 
                  className: cn(
                    "w-4 h-4 mr-2",
                    isActive ? "text-primary" : ""
                  )
                })}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ACTIONS DESKTOP avec bouton theme */}
        <div className="hidden md:flex items-center space-x-3">
          <ThemeToggle />
          
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Comparer
          </Button>
        </div>

        {/* MENU MOBILE avec bouton theme */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative"
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      <div 
        className={cn(
          "md:hidden absolute left-0 right-0 bg-background border-b border-border shadow-lg transition-all duration-300 ease-out",
          isMobileMenuOpen 
            ? "mt-16 opacity-100"
            : "-mt-[100vh] opacity-0"
        )}
        style={{ top: headerRef.current?.offsetHeight || "4rem" }}
      >
        <nav className="container mx-auto py-2 px-4 flex flex-col">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "py-3 px-4 rounded-lg flex items-center text-foreground transition-colors",
                  isActive
                    ? "bg-primary/10 dark:bg-primary/20 text-primary"
                    : "hover:bg-muted/50"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
                role="menuitem"
              >
                {React.cloneElement(item.icon, { 
                  className: cn(
                    "w-5 h-5 mr-3",
                    isActive ? "text-primary" : ""
                  )
                })}
                <span className="text-base">{item.label}</span>
              </Link>
            );
          })}
          
          {/* Button Comparer pour mobile */}
          <div className="mt-4 px-4">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Comparer les offres
            </Button>
          </div>
        </nav>
      </div>

      {/* Overlay arrière */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
          role="presentation"
        />
      )}
    </header>
  );
};

export default Header;