import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";

interface VehicleSelectorProps {
  onVehicleInfoFound: (vehicleInfo: any) => void;
}

interface VehicleInfo {
  make: string;
  model: string;
  year: string;
  vin?: string;
  fuel_type?: string;
  engine?: string;
}

// Listes des marques et modèles pour les combobox
const makes = ["Renault", "Peugeot", "Citroën", "Volkswagen", "BMW", "Audi", "Mercedes", "Toyota", "Honda", "Ford"];

const modelsByMake: Record<string, string[]> = {
  "Renault": ["Clio", "Megane", "Captur", "Kadjar", "Twingo"],
  "Peugeot": ["208", "308", "3008", "5008", "2008"],
  "Citroën": ["C3", "C4", "C5", "Berlingo", "DS3"],
  "Volkswagen": ["Golf", "Polo", "Passat", "Tiguan", "T-Roc"],
  "BMW": ["Série 1", "Série 3", "Série 5", "X1", "X3"],
  "Audi": ["A1", "A3", "A4", "Q3", "Q5"],
  "Mercedes": ["Classe A", "Classe C", "Classe E", "GLA", "GLC"],
  "Toyota": ["Yaris", "Corolla", "RAV4", "CH-R", "Aygo"],
  "Honda": ["Civic", "Jazz", "CR-V", "HR-V", "e"],
  "Ford": ["Fiesta", "Focus", "Puma", "Kuga", "Mondeo"]
};

// Générer les années (de l'année courante à 20 ans en arrière)
const currentYear = new Date().getFullYear();
const years = Array.from({length: 21}, (_, i) => (currentYear - i).toString());

const VehicleSelector = ({ onVehicleInfoFound }: VehicleSelectorProps) => {
  const [plateNumber, setPlateNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // États pour les sélecteurs
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  
  // Options pour les combobox
  const makeOptions: ComboboxOption[] = makes.map(make => ({ value: make, label: make }));
  const modelOptions: ComboboxOption[] = selectedMake
    ? (modelsByMake[selectedMake] || []).map(model => ({ value: model, label: model }))
    : [];
  const yearOptions: ComboboxOption[] = years.map(year => ({ value: year, label: year }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPlateNumber(newValue);
    // Réinitialiser les erreurs quand l'utilisateur commence à saisir
    if (error) setError(null);
    
    // Déclencher la recherche automatique après un court délai si la plaque a au moins 5 caractères
    if (newValue.length >= 5) {
      const timeoutId = setTimeout(() => {
        handleSearch(newValue);
      }, 500); // Délai de 500ms pour éviter trop d'appels pendant la saisie
      
      return () => clearTimeout(timeoutId);
    }
  };
  
  // Gérer les changements de sélection dans les combobox
  const handleMakeChange = (value: string) => {
    setSelectedMake(value);
    setSelectedModel(""); // Réinitialiser le modèle quand la marque change
    updateVehicleInfo({ make: value, model: "", year: selectedYear });
  };
  
  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    updateVehicleInfo({ make: selectedMake, model: value, year: selectedYear });
  };
  
  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    updateVehicleInfo({ make: selectedMake, model: selectedModel, year: value });
  };
  
  // Mettre à jour les informations du véhicule quand les sélections changent
  const updateVehicleInfo = ({ make, model, year }: { make: string, model: string, year: string }) => {
    if (make || model || year) {
      const vehicleData: VehicleInfo = {
        make: make || "",
        model: model || "",
        year: year || "",
        // Générer des données fictives cohérentes pour les autres champs
        fuel_type: make ? ["Essence", "Diesel", "Hybride", "Électrique"][Math.floor(Math.random() * 4)] : "",
        engine: make && model ? `${Math.floor(Math.random() * 150) + 70} ch` : ""
      };
      
      // Ne transmettre les informations que si au moins un champ est rempli
      if (make || model || year) {
        onVehicleInfoFound(vehicleData);
      }
    }
  };

  const formatLicensePlate = (plate: string): string => {
    // Normaliser: supprimer espaces, tirets et convertir en majuscule
    const normalized = plate.toUpperCase().replace(/[\s-]/g, "");
    
    // Format SIV (post-2009): AA-123-AA
    if (/^[A-Z]{2}\d{3}[A-Z]{2}$/.test(normalized)) {
      return `${normalized.substring(0, 2)}-${normalized.substring(2, 5)}-${normalized.substring(5, 7)}`;
    }
    
    // Format FNI (pré-2009): 123 AA 34
    else if (/^\d{2,4}[A-Z]{2}\d{2}$/.test(normalized)) {
      const dept = normalized.slice(-2);
      const letters = normalized.slice(-4, -2);
      const numbers = normalized.slice(0, -4);
      return `${numbers} ${letters} ${dept}`;
    }
    
    // Autre format ou format non reconnu
    return normalized;
  };

  const handleSearch = async (plate: string = plateNumber) => {
    if (!plate.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Format de la plaque: conserver le format avec tirets (AA-123-BC)
      const formattedPlate = plateNumber.trim();
      
      console.log(`Simulation de recherche du véhicule avec plaque: ${formattedPlate}`);
      
      // Simuler un délai de chargement pour une meilleure expérience utilisateur
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Générer des données simulées basées sur la plaque d'immatriculation
      const vehicleData = generateVehicleData(formattedPlate);
      
      // Notifier l'utilisateur du succès
      toast({
        title: "Véhicule trouvé",
        description: `${vehicleData.make} ${vehicleData.model} (${vehicleData.year})`,
      });

      // Transmettre les données au composant parent
      onVehicleInfoFound(vehicleData);
    } catch (error) {
      console.error("Erreur lors de la recherche du véhicule:", error);
      setError(error instanceof Error ? error.message : "Une erreur est survenue lors de la recherche du véhicule");
      
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la recherche du véhicule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour générer des données de véhicule simulées à partir de la plaque
  const generateVehicleData = (plate: string): VehicleInfo => {
    // Normaliser la plaque pour l'analyse
    const normalized = plate.toUpperCase().replace(/[\s-]/g, "");
    
    // Utiliser différents caractères de la plaque pour "déterminer" les données du véhicule
    const firstChar = normalized.charAt(0);
    const secondChar = normalized.charAt(1);
    const numericPart = normalized.match(/\d+/)?.[0] || "";
    
    // Générer la marque basée sur le premier caractère
    const make = makes[firstChar.charCodeAt(0) % makes.length];
    
    // Générer le modèle basé sur le second caractère
    const modelsForMake = modelsByMake[make] || ["Modèle inconnu"];
    const model = modelsForMake[secondChar.charCodeAt(0) % modelsForMake.length];
    
    // Générer l'année basée sur les chiffres de la plaque
    const year = (2010 + (parseInt(numericPart, 10) % 13)).toString();
    
    // Générer le type de carburant
    const fuelTypes = ["Essence", "Diesel", "Hybride", "Électrique", "GPL"];
    const fuelType = fuelTypes[(firstChar.charCodeAt(0) + secondChar.charCodeAt(0)) % fuelTypes.length];
    
    // Générer la puissance moteur
    const enginePowers = ["70 ch", "90 ch", "110 ch", "130 ch", "150 ch", "180 ch", "200 ch"];
    const engine = enginePowers[numericPart.length % enginePowers.length];
    
    // Générer un VIN (Vehicle Identification Number) simulé
    const vin = `VF${normalized.substring(0, 2)}${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}${normalized.substring(2, 4)}`;
    
    return {
      make,
      model,
      year,
      fuel_type: fuelType,
      engine,
      vin
    };
  };
  
  // Mise à jour des sélecteurs quand les données du véhicule sont trouvées via la plaque
  useEffect(() => {
    const handleSuccessfulSearch = (vehicleData: VehicleInfo) => {
      if (vehicleData.make) setSelectedMake(vehicleData.make);
      if (vehicleData.model) setSelectedModel(vehicleData.model);
      if (vehicleData.year) setSelectedYear(vehicleData.year);
    };
    
    // Si des données ont été trouvées via la recherche par plaque, mettre à jour les sélecteurs
    if (loading === false && plateNumber.length >= 5) {
      const vehicleData = generateVehicleData(plateNumber);
      handleSuccessfulSearch(vehicleData);
    }
  }, [loading, plateNumber]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="plate-input" className="text-sm font-medium">
          Numéro d'immatriculation
        </label>
        <div className="relative">
          <Input
            id="plate-input"
            value={plateNumber}
            onChange={handleInputChange}
            placeholder="AB-123-CD"
            className="w-full"
            disabled={loading}
          />
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Entrez votre plaque d'immatriculation pour compléter automatiquement
        les informations de votre véhicule ou utilisez les sélecteurs ci-dessous.
      </p>
      {plateNumber === "AA-123-BC" && (
        <p className="text-xs text-amber-500">
          Vous utilisez une plaque de démonstration. Essayez avec votre vraie plaque pour de meilleurs résultats.
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Sélecteur de marque */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Marque *
          </label>
          <Combobox
            options={makeOptions}
            value={selectedMake}
            onValueChange={handleMakeChange}
            placeholder="Sélectionner une marque"
            emptyMessage="Aucune marque trouvée."
            disabled={loading}
          />
        </div>
        
        {/* Sélecteur de modèle */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Modèle *
          </label>
          <Combobox
            options={modelOptions}
            value={selectedModel}
            onValueChange={handleModelChange}
            placeholder="Sélectionner un modèle"
            emptyMessage="Sélectionnez d'abord une marque."
            disabled={!selectedMake || loading}
          />
        </div>
        
        {/* Sélecteur d'année */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Année *
          </label>
          <Combobox
            options={yearOptions}
            value={selectedYear}
            onValueChange={handleYearChange}
            placeholder="Sélectionner une année"
            emptyMessage="Aucune année trouvée."
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleSelector;
