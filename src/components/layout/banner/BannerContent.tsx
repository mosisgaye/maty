'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const BannerContent: React.FC = () => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Badge */}
      <motion.span 
        className="inline-block bg-primary/20 backdrop-blur-sm text-primary px-4 py-1 rounded-full text-sm font-medium"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        Meilleurs prix garantis
      </motion.span>
      
      {/* Titre principal */}
      <motion.h1 
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Économisez sur vos{" "}
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          forfaits mobiles
        </span>
      </motion.h1>
      
      {/* Sous-titre */}
      <motion.p 
        className="text-xl md:text-2xl text-muted-foreground max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Comparez plus de 100 forfaits des plus grands opérateurs et économisez jusqu'à 40%
      </motion.p>
      
      {/* Boutons */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Link href="/mobile" className="inline-flex items-center justify-center h-11 px-8 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full sm:w-auto shadow-lg">
          <Search className="mr-2 h-5 w-5" />
          Comparer maintenant
        </Link>
        
        <Link href="/mobile" className="inline-flex items-center justify-center h-11 px-8 rounded-md border border-border bg-background/50 backdrop-blur-sm text-foreground hover:bg-background/80 transition-colors w-full sm:w-auto">
          Meilleures offres
        </Link>
      </motion.div>
      
      {/* Indicateurs de confiance */}
      <motion.div 
        className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <div className="flex items-center">
          <span className="text-primary mr-2">✓</span>
          Comparaison gratuite
        </div>
        <div className="flex items-center">
          <span className="text-primary mr-2">✓</span>
          100% indépendant
        </div>
        <div className="flex items-center">
          <span className="text-primary mr-2">✓</span>
          Mis à jour quotidiennement
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BannerContent;