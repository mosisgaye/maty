'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Users, Award, Zap, Heart } from 'lucide-react';

interface TrustIndicatorsProps {
  variant?: 'horizontal' | 'vertical';
  showIcons?: boolean;
  className?: string;
}

const TrustIndicators: React.FC<TrustIndicatorsProps> = ({ 
  variant = 'horizontal',
  showIcons = true,
  className = ""
}) => {
  const indicators = [
    {
      icon: <Shield className="w-4 h-4" />,
      text: "Comparaison gratuite",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: <Award className="w-4 h-4" />,
      text: "100% indépendant", 
      color: "text-green-600 dark:text-green-400"
    },
    {
      icon: <Clock className="w-4 h-4" />,
      text: "Mis à jour quotidiennement",
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      icon: <Users className="w-4 h-4" />,
      text: "Utilisé par +10k personnes",
      color: "text-orange-600 dark:text-orange-400"
    },
    {
      icon: <Zap className="w-4 h-4" />,
      text: "Résultats instantanés",
      color: "text-yellow-600 dark:text-yellow-400"
    },
    {
      icon: <Heart className="w-4 h-4" />,
      text: "Support client 7j/7",
      color: "text-red-600 dark:text-red-400"
    }
  ];

  const containerClass = variant === 'horizontal' 
    ? "flex flex-wrap items-center gap-4 md:gap-6" 
    : "flex flex-col gap-3";

  return (
    <motion.div 
      className={`${containerClass} text-sm ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.6 }}
    >
      {indicators.slice(0, variant === 'horizontal' ? 3 : 6).map((indicator, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 + (index * 0.1), duration: 0.4 }}
          className="flex items-center gap-2 group cursor-default"
        >
          {showIcons && (
            <div className={`${indicator.color} group-hover:scale-110 transition-transform duration-200`}>
              {indicator.icon}
            </div>
          )}
          <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">
            {indicator.text}
          </span>
          {showIcons && (
            <span className={`${indicator.color} font-bold opacity-60`}>✓</span>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TrustIndicators;
