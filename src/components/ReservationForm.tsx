import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, User, Car, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import TimeSlotSelector from "@/components/calendar/TimeSlotSelector";
import VehicleSelector from "@/components/VehicleSelector";

const ReservationForm = () => {
  const [selectedSlotId, setSelectedSlotId] = useState<string>();
  const [selectedStartDate, setSelectedStartDate] = useState<Date>();
  const [selectedEndDate, setSelectedEndDate] = useState<Date>();
  const [vehicleInfo, setVehicleInfo] = useState<any>(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    code_postal: "",
    marque_vehicule: "",
    modele_vehicule: "",
    annee_vehicule: "",
    numero_vin: "",
    type_prestation: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const prestations = [
    { id: "essentiel", label: "Forfait Essentiel", price: 99 },
    { id: "complet", label: "Forfait Complet", price: 149 },
    { id: "premium", label: "Forfait Premium", price: 199 }
  ];

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedPrestation = prestations.find(p => p.id === formData.type_prestation);
      
      if (!selectedSlotId || !selectedStartDate) {
        throw new Error("Veuillez sélectionner un créneau de rendez-vous disponible");
      }
      
      // Étape 1 : Insérer la réservation
      // Utilisation d'une assertion de type pour inclure le champ 'prix'
      const { data: reservationData, error: reservationError } = await supabase
        .from('reservations')
        .insert({
          ...formData,
          annee_vehicule: parseInt(formData.annee_vehicule),
          prix: selectedPrestation?.price || 0,
          date_rdv: selectedStartDate.toISOString()
        } as any) // Assertion de type pour éviter l'erreur sur 'prix'
        .select();
        
      if (reservationError) throw reservationError;
      
      // Étape 2 : Mettre à jour le créneau pour le marquer comme réservé
      const { error: updateError } = await supabase
        .from('disponibilites')
        .update({
          statut: 'reserve',
          reservation_id: reservationData?.[0]?.id
        })
        .eq('id', selectedSlotId);
        
      if (updateError) throw updateError;

      // Erreur déjà vérifiée (reservationError et updateError)

      toast({
        title: "Réservation confirmée !",
        description: "Nous vous contacterons sous peu pour confirmer votre rendez-vous.",
      });

      // Reset form
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adresse: "",
        ville: "",
        code_postal: "",
        marque_vehicule: "",
        modele_vehicule: "",
        annee_vehicule: "",
        numero_vin: "",
        type_prestation: "",
        notes: ""
      });
      setSelectedSlotId(undefined);
      setSelectedStartDate(undefined);
      setSelectedEndDate(undefined);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre réservation.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reservation" className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Réserver votre diagnostic</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Remplissez le formulaire ci-dessous pour prendre rendez-vous. Nous vous contacterons rapidement pour confirmer votre créneau.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations de réservation
            </CardTitle>
            <CardDescription>
              Tous les champs marqués d'un * sont obligatoires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations personnelles */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    required
                    value={formData.nom}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    required
                    value={formData.prenom}
                    onChange={(e) => handleInputChange("prenom", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      required
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="telephone"
                      required
                      className="pl-10"
                      value={formData.telephone}
                      onChange={(e) => handleInputChange("telephone", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse d'intervention *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="adresse"
                      required
                      className="pl-10"
                      value={formData.adresse}
                      onChange={(e) => handleInputChange("adresse", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ville">Ville *</Label>
                    <Input
                      id="ville"
                      required
                      value={formData.ville}
                      onChange={(e) => handleInputChange("ville", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code_postal">Code postal *</Label>
                    <Input
                      id="code_postal"
                      required
                      value={formData.code_postal}
                      onChange={(e) => handleInputChange("code_postal", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Informations sur le véhicule */}
              <div>
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Informations sur le véhicule
                </h3>
                
                <div className="mb-6">
                  <Label className="mb-2 block">Sélectionnez votre véhicule</Label>
                  <VehicleSelector onVehicleInfoFound={(data) => {
                    setVehicleInfo(data);
                    // Extraire et mettre à jour les informations du véhicule
                    // Ces champs dépendent de la structure de la réponse de votre API
                    if (data && data.vehicle_data) {
                      const vehicleData = data.vehicle_data;
                      setFormData(prev => ({
                        ...prev,
                        marque_vehicule: vehicleData.make || "",
                        modele_vehicule: vehicleData.model || "",
                        annee_vehicule: vehicleData.year?.toString() || "",
                        // Si vous avez le VIN dans la réponse de l'API
                        numero_vin: vehicleData.vin || ""
                      }));
                    }
                  }} />
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="marque_vehicule">Marque *</Label>
                    <Input
                      id="marque_vehicule"
                      required
                      value={formData.marque_vehicule}
                      onChange={(e) => handleInputChange("marque_vehicule", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modele_vehicule">Modèle *</Label>
                    <Input
                      id="modele_vehicule"
                      required
                      value={formData.modele_vehicule}
                      onChange={(e) => handleInputChange("modele_vehicule", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annee_vehicule">Année *</Label>
                    <Input
                      id="annee_vehicule"
                      required
                      value={formData.annee_vehicule}
                      onChange={(e) => handleInputChange("annee_vehicule", e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Label htmlFor="numero_vin">Numéro VIN (facultatif)</Label>
                  <Input
                    id="numero_vin"
                    value={formData.numero_vin}
                    onChange={(e) => handleInputChange("numero_vin", e.target.value)}
                    placeholder="Numéro d'identification du véhicule"
                  />
                </div>
                
                {vehicleInfo && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-md">
                    <p className="font-semibold mb-2">Informations du véhicule trouvées :</p>
                    <pre className="text-xs overflow-auto max-h-40 p-2 bg-white rounded">
                      {JSON.stringify(vehicleInfo, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Prestation */}
              <div className="space-y-2">
                <Label htmlFor="type_prestation">Type de prestation *</Label>
                <Select value={formData.type_prestation} onValueChange={(value) => handleInputChange("type_prestation", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez votre forfait" />
                  </SelectTrigger>
                  <SelectContent>
                    {prestations.map((prestation) => (
                      <SelectItem key={prestation.id} value={prestation.id}>
                        {prestation.label} - {prestation.price}€
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Sélecteur de créneaux */}
              <div className="space-y-2">
                <Label htmlFor="creneaux" className="block mb-2">Choisissez un créneau de rendez-vous *</Label>
                <TimeSlotSelector 
                  onSlotSelect={(slotId, startDate, endDate) => {
                    setSelectedSlotId(slotId);
                    setSelectedStartDate(startDate);
                    setSelectedEndDate(endDate);
                  }}
                  selectedSlotId={selectedSlotId}
                />
                
                {selectedStartDate && selectedEndDate && (
                  <div className="mt-2 p-3 bg-muted rounded-md">
                    <p className="font-medium">Créneau sélectionné :</p>
                    <p className="text-sm">
                      Le {format(selectedStartDate, "EEEE d MMMM yyyy", { locale: fr })} 
                      de {format(selectedStartDate, "HH:mm", { locale: fr })} 
                      à {format(selectedEndDate, "HH:mm", { locale: fr })}
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes complémentaires</Label>
                <Textarea
                  id="notes"
                  placeholder="Décrivez le problème rencontré, les symptômes observés..."
                  className="min-h-[100px]"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? "Envoi en cours..." : "Confirmer ma réservation"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ReservationForm;