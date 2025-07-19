# Implémentation de l'Autocomplétion d'Adresse avec Google Places API

## Introduction
Ce document explique l'implémentation de l'autocomplétion d'adresses via l'API Google Places dans notre application Azur Auto Réserve. Cette fonctionnalité permet aux utilisateurs de saisir facilement et précisément des adresses dans le formulaire de réservation.

## Prérequis

### 1. Création du projet Google Cloud
- Accédez à la [Google Cloud Console](https://console.cloud.google.com)
- Créez un nouveau projet (ex: "My Project 41870-OBDEXPRESS")
- Notez l'ID du projet (utile pour la gestion future)

### 2. Activation des APIs nécessaires
- Places API
- Maps JavaScript API
- Geocoding API (optionnelle mais recommandée)

### 3. Création d'une clé API
- Dans "APIs & Services" > "Credentials", créez une nouvelle clé API
- Sécurisez votre clé API en limitant son usage :
  - Restriction HTTP referrers (URLs autorisées)
  - Ajouter votre domaine de production (ex: https://obdexpress.fr)
  - Ajouter vos URLs de développement (ex: http://localhost:8080)

### 4. Configuration des variables d'environnement
```bash
# Ajoutez dans votre fichier .env
VITE_GOOGLE_MAPS_API_KEY=votre_clé_api_google_maps
```

## Implémentation technique

### 1. Composant d'Autocomplétion (GoogleAddressAutocomplete.tsx)

```typescript
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
  
  // Chargement du script Google Maps
  useEffect(() => {
    // Vérifier si le script est déjà chargé
    if (window.google?.maps?.places?.Autocomplete) {
      setIsScriptLoaded(true);
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('La clé API Google Maps est manquante');
      return;
    }

    // Créer et ajouter le script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initAutocomplete`;
    script.async = true;
    script.defer = true;
    
    window.initAutocomplete = () => {
      setIsScriptLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      delete window.initAutocomplete;
    };
  }, []);

  // Initialisation de l'autocomplétion
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
          
          // Extraction des composants d'adresse (ville, code postal)
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
```

### 2. Intégration dans le formulaire de réservation (ReservationForm.tsx)

```typescript
// Import du composant
import GoogleAddressAutocomplete from "./GoogleAddressAutocomplete";

// Dans le formulaire de réservation
<div className="space-y-2">
  <Label htmlFor="adresse">Adresse d'intervention *</Label>
  <div className="relative">
    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
    <GoogleAddressAutocomplete
      id="adresse"
      required
      className="pl-10"
      value={formData.adresse}
      onChange={(value, placeDetails) => {
        // Mise à jour de l'adresse
        handleInputChange("adresse", value);
        
        // Si des détails de lieu sont disponibles, extraire ville et code postal
        if (placeDetails?.address_components) {
          let ville = '';
          let codePostal = '';
          
          placeDetails.address_components.forEach(component => {
            if (component.types.includes('locality')) {
              ville = component.long_name;
            }
            if (component.types.includes('postal_code')) {
              codePostal = component.long_name;
            }
          });
          
          // Mettre à jour ville et code postal s'ils sont disponibles
          if (ville) handleInputChange("ville", ville);
          if (codePostal) handleInputChange("code_postal", codePostal);
          
          // Mettre à jour le prix en fonction de la ville
          if (ville) updatePriceBasedOnLocation(ville);
        }
      }}
      placeholder="Saisissez l'adresse précise d'intervention"
    />
  </div>
</div>
```

## Fonctionnalités implémentées

1. **Autocomplétion intelligente** - Suggestions d'adresses réelles à mesure que l'utilisateur tape
2. **Restriction géographique** - Limité aux adresses françaises (`componentRestrictions: { country: 'fr' }`)
3. **Extraction de données structurées** - Récupération automatique de la ville et du code postal
4. **Mise à jour dynamique du prix** - Calcul du tarif en fonction de la ville sélectionnée
5. **Indicateur de chargement** - Affichage d'un spinner pendant le chargement de l'API
6. **Gestion des erreurs** - Message d'erreur si la clé API est manquante

## Dépannage

### Erreur "RefererNotAllowedMapError"
Si vous rencontrez cette erreur, cela signifie que l'URL de votre application n'est pas autorisée dans les restrictions de la clé API.

Solution:
1. Dans Google Cloud Console, accédez à "APIs & Services" > "Credentials"
2. Modifiez votre clé API
3. Dans "Application restrictions" > "HTTP referrers", ajoutez toutes les URLs nécessaires:
   - URL de production (ex: https://obdexpress.fr/*)
   - URLs de développement (ex: http://localhost:8080/*)

### Erreur "MissingKeyMapError"
Cette erreur apparaît si la clé API n'est pas fournie ou est incorrecte.

Solution:
1. Vérifiez que VITE_GOOGLE_MAPS_API_KEY est correctement définie dans votre fichier .env
2. Redémarrez le serveur de développement pour prendre en compte les changements

## Bonnes pratiques

1. **Sécurité de la clé API** - Limitez toujours l'usage de votre clé API via les restrictions de domaine
2. **Gestion des quotas** - Surveillez votre utilisation de l'API pour éviter des frais supplémentaires
3. **User Experience** - Ajoutez des délais appropriés pour limiter les appels API pendant la saisie
4. **Accessibilité** - Assurez-vous que le composant est utilisable au clavier et compatible avec les lecteurs d'écran

## Ressources

- [Documentation Google Maps Platform](https://developers.google.com/maps/documentation)
- [Documentation Places API](https://developers.google.com/maps/documentation/javascript/places)
- [Guide de démarrage Autocomplete](https://developers.google.com/maps/documentation/javascript/places-autocomplete)
- [Console Google Cloud](https://console.cloud.google.com)
