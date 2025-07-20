import { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';

interface GoogleAddressAutocompleteProps {
  value: string;
  onChange: (value: string, placeDetails?: google.maps.places.PlaceResult | null) => void;
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
  label?: string;
}

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

const GoogleAddressAutocomplete = ({
  value,
  onChange,
  onPlaceSelect,
  className,
  placeholder = "Entrez une adresse",
  required = false,
  id = "google-address-autocomplete",
}: GoogleAddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Charger le script Google Maps si nécessaire
  useEffect(() => {
    // Vérifier si le script est déjà chargé
    if (window.google?.maps?.places?.Autocomplete) {
      console.log('Google Maps API déjà chargée');
      setIsScriptLoaded(true);
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('La clé API Google Maps est manquante. Ajoutez VITE_GOOGLE_MAPS_API_KEY à votre fichier .env');
      return;
    }
    
    // Vérifier si nous sommes en environnement de développement
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';
                         
    // Pour les tests en développement, possibilité d'utiliser un mode sans restriction
    // ATTENTION: À utiliser uniquement en développement, jamais en production
    const bypassRestrictions = isDevelopment; // Utilise l'API avec clé en production

    console.log('Chargement de l\'API Google Maps avec clé:', apiKey.substring(0, 10) + '...');

    // Définir la fonction de callback avant de charger le script
    window.initAutocomplete = () => {
      console.log('Script Google Maps chargé avec succès');
      setIsScriptLoaded(true);
    };

    // Ajouter un gestionnaire d'erreur global
    const handleScriptError = (event: ErrorEvent) => {
      if (event.filename && event.filename.includes('maps.googleapis.com')) {
        console.error('Erreur lors du chargement de l\'API Google Maps:', event.message);
      }
    };

    window.addEventListener('error', handleScriptError);
    
    // Créer et ajouter le script
    const script = document.createElement('script');
    
    // Pour forcer l'utilisation de la clé API et diagnostiquer le problème
    console.log('Tentative de chargement avec clé API');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initAutocomplete&loading=async`;
    
    // L'attribut 'loading=async' est ajouté directement dans l'URL pour suivre les meilleures pratiques
    // Mais nous conservons également ces attributs pour la compatibilité
    script.async = true;
    script.defer = true;
    script.onerror = (error) => {
      console.error('Erreur lors du chargement du script Google Maps:', error);
      console.log('URL utilisée:', script.src);
      console.log('Hostname actuel:', window.location.hostname);
      console.log('Mode bypass:', bypassRestrictions);
    };
    
    document.head.appendChild(script);

    return () => {
      // Nettoyer le script et le callback global si le composant est démonté
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      delete window.initAutocomplete;
      window.removeEventListener('error', handleScriptError);
    };
  }, []);

  // Initialiser l'autocomplétion une fois le script chargé
  useEffect(() => {
    if (isScriptLoaded && inputRef.current && !isInitialized) {
      const options = {
        componentRestrictions: { country: 'fr' }, // Limiter aux adresses françaises
        fields: ['address_components', 'formatted_address', 'geometry', 'name'],
        types: ['address']
      };

      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, options);
      
      // Écouter les changements de sélection
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.formatted_address) {
          onChange(place.formatted_address, place);
          if (onPlaceSelect) onPlaceSelect(place);
          
          // Extraire les composants d'adresse
          let ville = '';
          let codePostal = '';
          
          place.address_components?.forEach(component => {
            if (component.types.includes('locality')) {
              ville = component.long_name;
            }
            if (component.types.includes('postal_code')) {
              codePostal = component.long_name;
            }
          });
          
          // Vous pouvez ajouter un callback supplémentaire ici si nécessaire
          if (ville || codePostal) {
            console.log('Informations extraites:', { ville, codePostal });
            // Possibilité d'ajouter un callback ici
          }
        }
      });
      
      setIsInitialized(true);
    }
  }, [isScriptLoaded, onChange, onPlaceSelect, isInitialized]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        placeholder={placeholder}
        required={required}
      />
      {!isScriptLoaded && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default GoogleAddressAutocomplete;
