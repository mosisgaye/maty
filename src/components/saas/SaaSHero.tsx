// src/components/saas/SaaSHero.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  MessageSquare, 
  Brain, 
  Zap,
  CheckCircle,
  Star
} from 'lucide-react';

const SaaSHero = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const features = [
    "IA GPT-4 Turbo intégrée",
    "Widget personnalisable",
    "Analytics en temps réel",
    "Support multilingue"
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"
        />
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-15"
        />
      </div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Nouveau : IA GPT-4 Turbo intégrée
              </Badge>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                Support Client
                <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Révolutionné par l'IA
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl"
            >
              Transformez votre support client avec notre plateforme IA. 
              Chat intelligent, automatisation avancée, insights en temps réel.
            </motion.p>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-3"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Brain className="mr-2 h-5 w-5" />
                Essai gratuit 14 jours
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setIsVideoPlaying(true)}
                className="border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Play className="mr-2 h-5 w-5" />
                Voir la démo
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  +1,200 entreprises nous font confiance
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                  4.9/5 (1,247 avis)
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Demo/Visual */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Chat Demo Interface */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-white/30 rounded-full" />
                  <div className="w-3 h-3 bg-white/30 rounded-full" />
                  <div className="w-3 h-3 bg-white/30 rounded-full" />
                  <div className="ml-auto flex items-center gap-2 text-white">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm font-medium">AISupport Pro</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-6 space-y-4 h-80 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-xs">
                    <p className="text-sm">Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="flex gap-3 justify-end"
                >
                  <div className="bg-indigo-500 text-white rounded-lg p-3 max-w-xs">
                    <p className="text-sm">J'ai un problème avec ma commande #12345</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-xs">
                    <p className="text-sm">Je vois que votre commande #12345 a été expédiée hier. Voici le numéro de suivi : TR123456789. Souhaitez-vous que je vous aide avec autre chose ?</p>
                  </div>
                </motion.div>

                {/* Typing indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Tapez votre message..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    disabled
                  />
                  <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600">
                    <Zap className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">98%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Satisfaction</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
              className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">2.3s</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Temps de réponse</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SaaSHero;