'use client';

import React from 'react';
import { motion } from 'framer-motion';

const PartnersSection = () => {
  const partners = [
    { name: "Orange", logo: "/logos/orange.svg" },
    { name: "SFR", logo: "/logos/sfr.svg" },
    { name: "Bouygues", logo: "/logos/bouygues.svg" },
    { name: "Free", logo: "/logos/free.svg" },
    { name: "Sosh", logo: "/logos/sosh.svg" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Partenaires</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nous travaillons avec les plus grands opérateurs français pour vous offrir 
            une comparaison complète et transparente de toutes les offres du marché.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {partners.map((partner, index) => (
            <motion.div 
              key={index}
              className="bg-card p-6 rounded-xl border border-border flex items-center justify-center h-32 shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-full h-16 flex items-center justify-center">
                  <span className="text-lg font-bold text-muted-foreground">{partner.name}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">L'Excellence dans la Transparence des Offres</h3>
            <p className="text-muted-foreground mb-6">
              Grâce à nos partenariats avec les principaux acteurs des télécommunications en France, 
              nous vous garantissons un accès aux informations les plus à jour et des comparaisons impartiales.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h4 className="font-semibold mb-2">Données Fiables</h4>
                <p className="text-sm text-muted-foreground">
                  Informations vérifiées directement auprès des opérateurs pour une comparaison objective.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h4 className="font-semibold mb-2">Offres Exclusives</h4>
                <p className="text-sm text-muted-foreground">
                  Accédez à des promotions négociées spécialement pour nos utilisateurs.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h4 className="font-semibold mb-2">Analyse Impartiale</h4>
                <p className="text-sm text-muted-foreground">
                  Nous mettons en lumière les vrais avantages de chaque offre sans favoritisme.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;