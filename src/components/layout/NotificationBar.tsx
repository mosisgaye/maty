'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const NotificationBar = () => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Logic pour afficher la notification si nécessaire
    const shouldShow = !localStorage.getItem('notification-hidden');
    setShowNotification(shouldShow);
  }, []);

  if (!showNotification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-orange-500 text-white py-2 px-4 text-center text-sm"
      >
        <div className="flex items-center justify-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>🎉 Nouvelles offres exclusives disponibles !</span>
          <Link href="/mobile" className="underline font-medium">
            Voir les offres
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowNotification(false);
              localStorage.setItem('notification-hidden', 'true');
            }}
            className="ml-4 h-6 w-6 p-0 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationBar;
