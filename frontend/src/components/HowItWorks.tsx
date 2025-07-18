
import React from 'react';
import { Phone, Calendar, Wrench } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section className="my-16 px-4 max-w-6xl mx-auto bg-muted py-10 rounded-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">
        Comment ça marche ?
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {/* Étape 1 */}
        <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-primary">
          <div className="text-center">
            <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">1. Appel découverte</h3>
            <p className="text-muted-foreground text-sm">
              Un rendez-vous téléphonique gratuit de 10 minutes pour comprendre votre problème auto.
            </p>
          </div>
        </div>
        {/* Étape 2 */}
        <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-secondary">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">2. Prise de rendez-vous</h3>
            <p className="text-muted-foreground text-sm">
              Choisissez la date et l'heure de l'intervention à votre domicile selon vos disponibilités.
            </p>
          </div>
        </div>
        {/* Étape 3 */}
        <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-green-500">
          <div className="text-center">
            <Wrench className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">3. Intervention rapide</h3>
            <p className="text-muted-foreground text-sm">
              Le diagnostic est réalisé sur place avec rapport détaillé et effacement des défauts si possible.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
