import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface VehicleSelectorProps {
  onVehicleInfoFound: (vehicleInfo: any) => void;
}

const VehicleSelector = ({ onVehicleInfoFound }: VehicleSelectorProps) => {
  const [plateNumber, setPlateNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      // Définir les différentes URL à tester - URL fonctionnelle en premier
      const urlsToTry = [
        // Cette URL semble fonctionner d'après les tests
        'https://supabasekong-mooccw08w8gokwc4okss800k.gestionmax.fr/rest/v1/rpc/get_vehicle_info',
        // Autres URL à essayer si nécessaire
        'https://supabasekong-mooccw08w8gokwc4okss800k.gestionmax.fr/functions/v1/get-vehicle-info',
        'https://supabasekong-mooccw08w8gokwc4okss800k.gestionmax.fr/functions/get-vehicle-info'
      ];
      
      // Essayer chaque URL jusqu'à ce qu'une fonctionne
      let response;
      let lastError: any = null;
      let responseData = null;
      
      for (const url of urlsToTry) {
        try {
          console.log(`Essai avec URL: ${url}`);
          console.log(`Essai d'appel à l'URL: ${url}`);
          
          // Obtenir la clé anon de Supabase pour l'authentification
          const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vb2NjdzA4dzhnb2t3YzRva3NzODAwayIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjU2NDQ3NDI3LCJleHAiOjE5NzIwMjM0Mjd9.IbVqy05ciU9UGswJIJEXllyO4ydLfBwNmiwAdpf7-Hc';
          
          response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Utiliser à la fois Authorization Bearer et apikey pour l'authentification Supabase
              "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
              "apikey": SUPABASE_ANON_KEY,
              "x-client-info": "VehicleSelector Component"
            },
            body: JSON.stringify({ plaque: plateNumber }),
          });
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `L'API a répondu avec le statut ${response.status}`);
          }

          const data = await response.json();
          
          // Traiter les données et appeler le callback
          onVehicleInfoFound(data);
          
          toast({
            title: "Véhicule trouvé",
            description: "Les informations du véhicule ont été récupérées avec succès."
          });
          
          // Si on a réussi, on sort de la fonction
          return;
          
        } catch (error: any) {
          console.log(`Échec avec l'URL ${url}:`, error.message);
          lastError = error;
          // Continuer à essayer les autres URLs
        }
      }
      
      // Si on arrive ici, c'est qu'aucune URL n'a fonctionné
      // Essayons d'obtenir plus de détails sur l'erreur
      let errorMessage = "Impossible de récupérer les informations du véhicule.";
      
      if (lastError && lastError.message) {
        errorMessage = lastError.message;
      }
        
      // Si nous avons une réponse avec des détails d'erreur supplémentaires
      if (lastError && lastError.errorData) {
        errorMessage += " Détails: " + JSON.stringify(lastError.errorData);
      }
        
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
        
      console.error("Erreur lors de la récupération des infos du véhicule:", lastError);
      console.log("Plaque d'immatriculation envoyée:", plateNumber);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-stretch gap-1">
        <div className="bg-blue-900 text-white flex items-center justify-center px-3 py-2 rounded-l-md font-bold">
          F
        </div>
        <Input
          placeholder="AA-456-BB"
          className="rounded-none flex-grow"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
        />
        <Button 
          onClick={handleGetVehicleInfo} 
          disabled={isLoading} 
          className="rounded-r-md bg-orange-500 hover:bg-orange-600"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ok"}
        </Button>
      </div>
    </div>
  );
};

export default VehicleSelector;
