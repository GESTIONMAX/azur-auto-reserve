import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const VehicleInfoTest = () => {
  const [plateNumber, setPlateNumber] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setVehicleInfo(null);

    try {
      // Option 1: Appel direct à l'endpoint de la fonction
      const response = await fetch('https://votre-domaine-supabase/functions/v1/get-vehicle-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plate: plateNumber
        })
      });

      // Gestion des erreurs HTTP
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Une erreur s'est produite lors de la récupération des informations du véhicule");
      }

      const data = await response.json();
      setVehicleInfo(data);
      
      toast({
        title: "Succès",
        description: "Informations du véhicule récupérées avec succès",
      });

    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite");
      toast({
        title: "Erreur",
        description: err.message || "Une erreur s'est produite lors de la récupération des informations du véhicule",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Option 2: Utiliser le client Supabase (décommenter pour utiliser)
  const handleSubmitWithSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setVehicleInfo(null);

    try {
      const { data, error } = await supabase.functions.invoke('get-vehicle-info', {
        body: { plate: plateNumber }
      });

      if (error) throw error;
      
      setVehicleInfo(data);
      
      toast({
        title: "Succès",
        description: "Informations du véhicule récupérées avec succès",
      });

    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite");
      toast({
        title: "Erreur",
        description: err.message || "Une erreur s'est produite lors de la récupération des informations du véhicule",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Test de la fonction Edge get-vehicle-info</CardTitle>
        <CardDescription>
          Entrez une plaque d'immatriculation pour obtenir les informations du véhicule
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plateNumber">Plaque d'immatriculation</Label>
            <Input
              id="plateNumber"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder="Ex: AB123CD"
              required
            />
          </div>

          <div className="flex space-x-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Récupérer les informations (Fetch)
            </Button>
            
            <Button 
              type="button" 
              onClick={handleSubmitWithSupabase}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Récupérer les informations (Supabase)
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              <p className="font-medium">Erreur:</p>
              <p>{error}</p>
            </div>
          )}

          {vehicleInfo && (
            <div className="mt-4">
              <h3 className="text-lg font-medium">Informations du véhicule:</h3>
              <div className="p-4 bg-muted rounded-md mt-2">
                <pre className="whitespace-pre-wrap overflow-auto max-h-96">
                  {JSON.stringify(vehicleInfo, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default VehicleInfoTest;
