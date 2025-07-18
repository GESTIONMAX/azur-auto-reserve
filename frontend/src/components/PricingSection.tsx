
import React, { useState } from 'react';
import { Shield, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

const PricingSection = () => {
  const [selectedZone, setSelectedZone] = useState('standard');
  const navigate = useNavigate();

  const zoneData = {
    standard: {
      price: '99€',
      areas: 'Antibes, Juan-les-Pins, Biot, Vallauris, Golfe-Juan',
      distance: 'Rayon de 15km autour d\'Antibes',
      color: 'bg-green-500',
      bgColor: 'bg-green-100'
    },
    extended: {
      price: '109€',
      areas: 'Nice, Cannes, Cagnes-sur-Mer, Grasse, Valbonne',
      distance: 'Zone étendue - déplacement majoré',
      color: 'bg-yellow-400',
      bgColor: 'bg-yellow-100'
    },
    other: {
      price: 'Sur devis',
      areas: 'Autre localité',
      distance: 'Tarif personnalisé selon la distance',
      color: 'bg-red-500',
      bgColor: 'bg-red-100'
    }
  };

  const currentZone = zoneData[selectedZone as keyof typeof zoneData];

  const handleBooking = () => {
    const params = new URLSearchParams({
      service: 'diagnostic',
      zone: selectedZone,
      price: selectedZone === 'other' ? '0' : currentZone.price.replace('€', '')
    });
    navigate(`/reservation?${params.toString()}`);
  };

  return (
    <section id="tarifs" className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Nos tarifs</h2>
        <p className="text-muted-foreground text-center mb-12">Des prix transparents selon votre zone géographique</p>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg overflow-hidden border-t-4 border-primary">
            <div className="p-6">
              {/* En-tête avec titre et icône */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Diagnostic automobile</h3>
                <span className="inline-block w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </span>
              </div>
              
              {/* Sélecteur de localité */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Choisissez votre localité</label>
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Antibes, Juan-les-Pins, Biot, Vallauris, Golfe-Juan</SelectItem>
                    <SelectItem value="extended">Nice, Cannes, Cagnes-sur-Mer, Grasse, Valbonne</SelectItem>
                    <SelectItem value="other">Autre localité (sur devis)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Information de prix dynamique */}
              <div className="bg-muted p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Prix du diagnostic</p>
                    <p className="text-3xl font-bold text-primary">
                      {currentZone.price} 
                      {selectedZone !== 'other' && <span className="text-sm text-muted-foreground font-normal"> TTC</span>}
                    </p>
                    {selectedZone !== 'other' && (
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-primary font-medium">Paiement en 4x sans frais disponible</span>
                      </div>
                    )}
                  </div>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${currentZone.bgColor}`}>
                    <span className={`inline-block w-8 h-8 ${currentZone.color} rounded-full`}></span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{currentZone.distance}</p>
              </div>
              
              {/* Caractéristiques du service */}
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="w-5 h-5 text-green-500 mr-2 mt-0.5">✓</span>
                  <span>Déplacement inclus</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 text-green-500 mr-2 mt-0.5">✓</span>
                  <span>Lecture des codes défaut</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 text-green-500 mr-2 mt-0.5">✓</span>
                  <span>Effacement des voyants</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 text-green-500 mr-2 mt-0.5">✓</span>
                  <span>Rapport détaillé</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 text-green-500 mr-2 mt-0.5">✓</span>
                  <span>Intervention rapide</span>
                </li>
              </ul>
              
              {/* Bouton d'action */}
              <Button 
                onClick={handleBooking}
                className="w-full py-4 text-lg"
                size="lg"
              >
                Prendre rendez-vous
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
