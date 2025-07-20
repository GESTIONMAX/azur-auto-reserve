import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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

const VehicleSelector = ({ onVehicleInfoFound }: VehicleSelectorProps) => {
  const [plateNumber, setPlateNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlateNumber(e.target.value);
    // Réinitialiser les erreurs quand l'utilisateur commence à saisir
    if (error) setError(null);
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

  const handleSearch = async () => {
    if (!plateNumber.trim()) {
      setError("Veuillez entrer un numéro d'immatriculation");
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
    const makes = ["Renault", "Peugeot", "Citroën", "Volkswagen", "BMW", "Audi", "Mercedes", "Toyota", "Honda", "Ford"];
    const make = makes[firstChar.charCodeAt(0) % makes.length];
    
    // Générer le modèle basé sur le second caractère
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
    
    const modelsForMake = modelsByMake[make] || ["Modèle inconnu"];
    const model = modelsForMake[secondChar.charCodeAt(0) % modelsForMake.length];
    
    // Générer l'année basée sur les chiffres de la plaque
    const currentYear = new Date().getFullYear();
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

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="plate-input" className="text-sm font-medium">
          Numéro d'immatriculation
        </label>
        <div className="flex space-x-2">
          <Input
            id="plate-input"
            value={plateNumber}
            onChange={handleInputChange}
            placeholder="AB-123-CD"
            className="flex-grow"
            disabled={loading}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recherche...
              </>
            ) : (
              "Rechercher"
            )}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Entrez votre plaque d'immatriculation et appuyez sur Rechercher pour compléter
        automatiquement les informations de votre véhicule.
      </p>
      {plateNumber === "AA-123-BC" && (
        <p className="text-xs text-amber-500">
          Vous utilisez une plaque de démonstration. Essayez avec votre vraie plaque pour de meilleurs résultats.
        </p>
      )}
    </div>
  );
};

export default VehicleSelector;
