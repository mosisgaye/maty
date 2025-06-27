'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-muted/50 dark:bg-slate-900 py-6 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div className="font-bold text-xl">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Compare</span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Prix</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground mt-4 md:mt-0">
            © {new Date().getFullYear()} ComparePrix. Tous droits réservés.
          </div>
        </div>
        
        <div className="border-t border-border mt-6 pt-6">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/politique-confidentialite" className="hover:underline hover:text-primary transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="/politique-cookies" className="hover:underline hover:text-primary transition-colors">
              Politique de cookies
            </Link>
            <Link href="/mentions-legales" className="hover:underline hover:text-primary transition-colors">
              Mentions légales
            </Link>
            <Link href="/cgv" className="hover:underline hover:text-primary transition-colors">
              CGV
            </Link>
            <Link href="/sitemap.xml" className="hover:underline hover:text-primary transition-colors">
              Plan du site
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;