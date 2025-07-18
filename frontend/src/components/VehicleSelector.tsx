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

// Types pour l'API RapidAPI d'immatriculation française
interface RapidApiFrenchVehicleResponse {
  error?: boolean;
  code?: number;
  message?: string;
  query?: string;
  country?: string;
  data?: {
    AAM_fg_plaque?: string;
    AAM_fgfg?: string;
    AAM_RASA?: any[];
    AAM_VIN?: string;
    AAM_sd_siv4?: string;
    AAM_annee_de_debut_modele?: string;
    AAM_annee_de_fin_modele?: string;
    AAM_capacite_reservoirs?: string;
    AAM_carrosserie?: string;
    AAM_carrosserie_carte_grise?: string;
    AAM_carrosserie_ce?: string;
    AAM_categorie_vehicule?: string;
    AAM_photo_image?: string;
    AAM_classe_environnement_ce?: string;
    AAM_classe_grtc?: string;
    AAM_code_certificat_qualite_air?: string;
    AAM_code_de_boite_de_vitesses?: string;
    AAM_code_national?: string;
    AAM_code_vrai?: string;
    AAM_codes_moteur?: string[];
    AAM_codes_vin?: string[];
    AAM_collection?: string;
    AAM_consommation_ex_urbaine?: string;
    AAM_consommation_mixte?: string;
    AAM_consommation_urbaine?: string;
    AAM_couleur?: string;
    AAM_cylindree_capacite?: string;
    AAM_date_de?: string;
    AAM_date_cg?: string;
    AAM_date_derniere_cg?: string;
    AAM_date_mise_en_circulation?: string;
    AAM_date_mise_en_circulation_des?: string;
    AAM_deposition?: string;
    AAM_emission_co_2?: string;
    AAM_emission_co_2_gr?: string;
    AAM_emplacement?: string;
    AAM_energie?: string;
    AAM_energie_code?: string;
    AAM_finition?: string;
    AAM_general?: string;
    AAM_genre?: string;
    AAM_genre_carte_grise?: string;
    AAM_genre_code?: string;
    AAM_genre_euro_code?: string;
    AAM_garantie?: string;
    AAM_group_code?: string;
    AAM_hauteur?: string;
    AAM_kw_version?: string;
    AAM_level?: string;
    AAM_k_type?: string;
    AAM_label?: string;
    AAM_label_energy?: string;
    AAM_largeur?: string;
    AAM_longueur?: string;
    AAM_marque?: string;
    AAM_modele?: string;
    AAM_mois_version?: string;
    AAM_motorisation?: string;
    AAM_normes_euro?: string;
    AAM_note?: string;
    AAM_nb_places?: string;
    AAM_nb_portes?: string;
    AAM_nb_version_total?: string;
    AAM_poids_ptac?: string;
    AAM_prix_neuf?: string;
    AAM_prototype_version?: string;
    AAM_ptac?: string;
    AAM_puissance?: string;
    AAM_puissance_commercial?: string;
    AAM_puissance_cv?: string;
    AAM_segment_eureka?: string;
    AAM_serie?: string;
    AAM_serie_age?: string;
    AAM_style?: string;
    AAM_transmission?: string;
    AAM_type_mines?: string;
    AAM_type_variante_version?: string;
    AAM_type_version?: string;
    AAM_variante_version?: string;
    [key: string]: any; // Pour les autres propriétés potentielles
  };
}

const VehicleSelector = ({ onVehicleInfoFound }: VehicleSelectorProps) => {
  const [plateNumber, setPlateNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState<VehicleInfo | null>(null);
  const { toast } = useToast();

  // Formater automatiquement la plaque au format AA-123-BC pendant la saisie
  const formatLicensePlate = (input: string) => {
    // On retire d'abord tout caractère non alphanumérique
    const cleaned = input.replace(/[^A-Z0-9]/g, '');
    
    // Ensuite on applique le format français : AA-123-BC
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 5) {
      return `${cleaned.substring(0, 2)}-${cleaned.substring(2)}`;
    } else {
      return `${cleaned.substring(0, 2)}-${cleaned.substring(2, 5)}-${cleaned.substring(5, 7)}`;
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convertir en majuscule et appliquer le formatage
    const formattedValue = formatLicensePlate(e.target.value.toUpperCase());
    setPlateNumber(formattedValue);
  };
  
  // Gérer la touche Entrée pour lancer la recherche
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGetVehicleInfo();
    }
  };

  const handleGetVehicleInfo = async () => {
    if (!plateNumber.trim()) {
      toast({
        title: "Attention",
        description: "Veuillez entrer une plaque d'immatriculation.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Format de la plaque: conserver le format avec tirets (AA-123-BC)
      const formattedPlate = plateNumber.trim();
      
      console.log(`Recherche du véhicule avec plaque: ${formattedPlate}`);
      
      // Récupération des variables d'environnement
      const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
      const apiHost = import.meta.env.VITE_RAPIDAPI_HOST;
      const apiToken = import.meta.env.VITE_RAPIDAPI_TOKEN || 'TokenDemoRapidapi';
      
      if (!apiKey || !apiHost) {
        throw new Error("Les clés d'API RapidAPI ne sont pas configurées.");
      }
      
      // Construire l'URL avec les paramètres corrects selon l'API française
      const url = `https://${apiHost}/getdata?plate=${encodeURIComponent(formattedPlate)}`;
      
      console.log(`Appel API avec URL: ${url}`);
      
      // Configuration de la requête
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': apiHost
        }
      };

      // Appel API
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
      }
      
      // Lecture de la réponse
      const responseData: RapidApiFrenchVehicleResponse = await response.json();
      console.log("Réponse de l'API:", responseData);
      
      if (responseData.error || !responseData.data) {
        throw new Error(responseData.message || "La recherche n'a pas retourné de résultats valides.");
      }
      
      // Convertir les données au format attendu par l'application
      const vehicleData: VehicleInfo = {
        make: responseData.data.AAM_marque || "Marque inconnue",
        model: responseData.data.AAM_modele || "Modèle inconnu",
        year: responseData.data.AAM_annee_de_debut_modele || responseData.data.AAM_date_mise_en_circulation?.substring(0, 4) || "Année inconnue",
        fuel_type: responseData.data.AAM_energie || "Carburant inconnu",
        engine: responseData.data.AAM_puissance ? `${responseData.data.AAM_puissance} CV` : "Puissance inconnue"
      };
      
      // Créer le format de réponse attendu par le composant parent
      const apiResponse = {
        vehicle_data: vehicleData
      };
      
      console.log("Informations structurées du véhicule:", apiResponse);
      
      // Stocker les détails du véhicule pour affichage
      setVehicleDetails(vehicleData);
      
      // Envoyer les données au composant parent
      onVehicleInfoFound(apiResponse);
      
      toast({
        title: "Véhicule trouvé",
        description: `${vehicleData.make} ${vehicleData.model} (${vehicleData.year})`
      });
      
      // Si c'est un véhicule de démonstration ou de test, ajoutons un message spécial
      if (formattedPlate.toLowerCase().includes('demo') || formattedPlate === 'AA-123-BC') {
        toast({
          title: "Mode Démo",
          description: "Vous utilisez un numéro de plaque de démonstration. Les informations peuvent être fictives."
        });
      }
            
    } catch (error: any) {
      console.error("Erreur lors de la récupération des informations du véhicule:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la récupération des informations du véhicule.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-end gap-2">
        <div className="flex-grow">
          <Input 
            placeholder="Entrez votre plaque d'immatriculation (ex: AA-123-BC)" 
            value={plateNumber}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="uppercase text-center font-medium tracking-wider"
            maxLength={9} // Format français AA-123-BC = 9 caractères
            autoComplete="off"
          />
        </div>
        <Button 
          onClick={handleGetVehicleInfo}
          disabled={isLoading || plateNumber.length < 7}
          className="shrink-0 bg-green-600 hover:bg-green-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Recherche...
            </>
          ) : (
            "Rechercher"
          )}
        </Button>
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
