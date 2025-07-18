
import React from 'react';
import Map from './Map';

const InterventionZones = () => {
  return (
    <section id="zones" className="mb-12">
      <h2 className="text-2xl font-bold text-center mb-4">Zones d'intervention</h2>
      <p className="text-center mb-6">Antibes, Cannes, Cagnes-sur-Mer, Grasse, Vallauris, Biot, Le Cannet...</p>
      
      {/* Carte des zones d'intervention */}
      <div className="rounded shadow mb-6 overflow-hidden">
        <Map 
          center={[43.58, 7.10]} // Centré sur la région d'Antibes/Cannes
          zoom={11}
          height="400px"
          markers={[
            { position: [43.5833, 7.1], popup: "Antibes" },
            { position: [43.5515, 7.0134], popup: "Cannes" },
            { position: [43.6691, 7.2146], popup: "Cagnes-sur-Mer" },
            { position: [43.6582, 6.9249], popup: "Grasse" },
            { position: [43.5798, 7.0502], popup: "Vallauris" },
            { position: [43.6338, 7.0986], popup: "Biot" },
            { position: [43.5707, 7.0194], popup: "Le Cannet" }
          ]}
        />
      </div>
    </section>
  );
};

export default InterventionZones;
