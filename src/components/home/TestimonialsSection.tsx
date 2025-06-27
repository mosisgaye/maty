'use client';

import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Marie D.",
      comment: "J'ai économisé 180€ par an grâce à ComparePrix ! Service excellent.",
      rating: 5,
      date: "Il y a 2 jours"
    },
    {
      name: "Pierre L.",
      comment: "Interface simple et claire. J'ai trouvé mon forfait idéal en 5 minutes.",
      rating: 5,
      date: "Il y a 1 semaine"
    },
    {
      name: "Sophie M.",
      comment: "Comparaison très détaillée, j'ai pu choisir en toute connaissance de cause.",
      rating: 4,
      date: "Il y a 2 semaines"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ce que disent nos utilisateurs</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Plus de 10 000 personnes nous font confiance pour comparer leurs offres télécoms.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-muted/50 p-6 rounded-lg border border-border">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} 
                    />
                  ))}
                </div>
                <p className="mb-4 italic text-foreground">"{testimonial.comment}"</p>
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            { title: "Économisez du temps", value: "+2h", description: "gagnées en recherche" },
            { title: "Économisez de l'argent", value: "219€", description: "d'économie moyenne annuelle" },
            { title: "Utilisateurs satisfaits", value: "98%", description: "de satisfaction client" }
          ].map((stat, index) => (
            <div key={index} className="bg-card p-6 rounded-lg shadow-sm text-center border border-border">
              <h3 className="font-semibold mb-2">{stat.title}</h3>
              <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;