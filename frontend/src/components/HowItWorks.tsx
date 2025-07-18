
import React from 'react';

const HowItWorks = () => {
  return (
    <section className="my-16 px-4 max-w-6xl mx-auto py-10 rounded-lg relative circuit-board-pattern overflow-hidden">
      {/* Lignes animées du circuit */}
      <div className="circuit-line-1"></div>
      <div className="circuit-line-2"></div>
      <div className="circuit-line-3"></div>
      <div className="circuit-node-1"></div>
      <div className="circuit-node-2"></div>
      <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">
        Comment ça marche ?
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {/* Étape 1 */}
        <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-primary">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mx-auto mb-4">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <h3 className="text-xl font-semibold mb-2">1. Appel découverte</h3>
            <p className="text-muted-foreground text-sm">
              Un rendez-vous téléphonique gratuit de 10 minutes pour comprendre votre problème auto.
            </p>
          </div>
        </div>
        {/* Étape 2 */}
        <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-secondary">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary mx-auto mb-4">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <h3 className="text-xl font-semibold mb-2">2. Prise de rendez-vous</h3>
            <p className="text-muted-foreground text-sm">
              Choisissez la date et l'heure de l'intervention à votre domicile selon vos disponibilités.
            </p>
          </div>
        </div>
        {/* Étape 3 */}
        <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-green-500">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mx-auto mb-4">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
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
