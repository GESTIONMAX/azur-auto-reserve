
import React from 'react';
import { MapPin } from 'lucide-react';

const InterventionZones = () => {
  return (
    <section id="zones" className="mb-12">
      <h2 className="text-2xl font-bold text-center mb-4">Zones d'intervention</h2>
      <p className="text-center mb-6">Antibes, Cannes, Cagnes-sur-Mer, Grasse, Vallauris, Biot, Le Cannet...</p>
      
      {/* Placeholder pour la carte */}
      <div className="h-80 w-full rounded shadow mb-6 bg-muted flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carte des zones d'intervention</p>
          <p className="text-sm text-muted-foreground mt-2">Intégration carte à venir</p>
        </div>
      </div>
      
      <div className="max-w-xl mx-auto bg-card p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Légende</h3>
        <ul className="text-sm space-y-1">
          <li className="flex items-center">
            <span className="inline-block w-4 h-4 bg-green-500 rounded-full mr-2"></span>
            Zone standard - 99€ TTC
          </li>
          <li className="flex items-center">
            <span className="inline-block w-4 h-4 bg-yellow-400 rounded-full mr-2"></span>
            Zone étendue - 109€ TTC
          </li>
          <li className="flex items-center">
            <span className="inline-block w-4 h-4 bg-red-500 rounded-full mr-2"></span>
            Sur devis
          </li>
        </ul>
      </div>
    </section>
  );
};

export default InterventionZones;
