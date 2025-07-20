import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

interface VinDecoderResponse {
  success: boolean;
  data?: any;
  vehicle_info?: VehicleInfo;
  error?: string;
  message?: string;
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
  const { toast } = useToast();
  
  // États pour les sélecteurs et recherche VIN
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [vinInput, setVinInput] = useState("");
  const [isLoadingVin, setIsLoadingVin] = useState(false);
  const [vinError, setVinError] = useState<string | null>(null);
  
  // Options pour les combobox
  const makeOptions: ComboboxOption[] = makes.map(make => ({ value: make, label: make }));
  const modelOptions: ComboboxOption[] = selectedMake
    ? (modelsByMake[selectedMake] || []).map(model => ({ value: model, label: model }))
    : [];
  const yearOptions: ComboboxOption[] = years.map(year => ({ value: year, label: year }));

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

  // Fonction pour la recherche de véhicule par VIN
  const searchByVin = async () => {
    // Validation de base du VIN
    if (!vinInput || vinInput.trim().length < 10) {
      setVinError("Le numéro VIN doit contenir au moins 10 caractères");
      return;
    }
    
    setIsLoadingVin(true);
    setVinError(null);
    
    try {
      // Appel de l'Edge Function Supabase
      const { data, error } = await supabase.functions.invoke('vindecoder', {
        body: { vin: vinInput.trim() }
      });
      
      if (error) throw new Error(error.message || "Erreur lors de la recherche du véhicule");
      
      // Traiter la réponse
      const response = data as VinDecoderResponse;
      
      if (!response.success || response.error) {
        throw new Error(response.error || "Erreur lors du décodage du VIN");
      }
      
      if (response.vehicle_info) {
        // Mise à jour des sélecteurs avec les infos trouvées
        const { make, model, year } = response.vehicle_info;
        
        if (make) setSelectedMake(make);
        if (model) setSelectedModel(model);
        if (year) setSelectedYear(year);
        
        // Notification de succès
        toast({
          title: "Véhicule trouvé",
          description: `${make} ${model} ${year}`,
        });
        
        // Mise à jour des informations du véhicule pour le composant parent
        onVehicleInfoFound(response.vehicle_info);
      } else {
        // Si pas d'infos spécifiques mais une réponse valide
        toast({
          title: "Information limitée",
          description: "Les détails complets du véhicule n'ont pas pu être récupérés.",
          variant: "default"
        });
      }
      
    } catch (error) {
      console.error("Erreur recherche VIN:", error);
      setVinError(error.message || "Erreur lors de la recherche du véhicule");
      
      toast({
        title: "Erreur",
        description: error.message || "Le numéro VIN n'a pas pu être identifié",
        variant: "destructive",
      });
    } finally {
      setIsLoadingVin(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Recherche par VIN */}
      <div className="space-y-3 border-b pb-4">
        <h3 className="text-sm font-medium">Recherche par numéro VIN</h3>
        
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <Input
                placeholder="Entrez le numéro VIN du véhicule"
                value={vinInput}
                onChange={(e) => {
                  setVinInput(e.target.value);
                  if (vinError) setVinError(null);
                }}
                className={`pr-10 ${vinError ? 'border-red-500' : ''}`}
                disabled={isLoadingVin}
              />
              {isLoadingVin && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            <Button 
              onClick={searchByVin} 
              disabled={isLoadingVin || vinInput.length < 10}
              type="button"
            >
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </div>
          
          {vinError && (
            <div className="text-red-500 text-xs flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {vinError}
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Entrez le numéro VIN complet (17 caractères) ou partiel (min. 10 caractères) pour rechercher automatiquement les informations du véhicule.
          </p>
        </div>
      </div>
      
      {/* Titre séparateur */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-grow bg-muted"></div>
        <span className="text-xs font-medium text-muted-foreground">OU</span>
        <div className="h-px flex-grow bg-muted"></div>
      </div>

      {/* Sélection manuelle */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Sélection manuelle</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              disabled={!selectedMake}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSelector;
