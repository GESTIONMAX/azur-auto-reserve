import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, MapPin, User, Car, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ReservationForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
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
      
      const { error } = await supabase
        .from('reservations')
        .insert({
          ...formData,
          annee_vehicule: parseInt(formData.annee_vehicule),
          prix: selectedPrestation?.price || 0,
          date_rdv: selectedDate?.toISOString()
        });

      if (error) throw error;

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
      setSelectedDate(undefined);
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

              {/* Informations véhicule */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Informations du véhicule
                </h3>
                
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
                      type="number"
                      min="1990"
                      max="2024"
                      required
                      value={formData.annee_vehicule}
                      onChange={(e) => handleInputChange("annee_vehicule", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numero_vin">Numéro de châssis (VIN) *</Label>
                  <Input
                    id="numero_vin"
                    required
                    placeholder="Ex: WVWZZZ1JZ3W386752"
                    value={formData.numero_vin}
                    onChange={(e) => handleInputChange("numero_vin", e.target.value)}
                  />
                </div>
              </div>

              {/* Prestation et date */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type_prestation">Type de prestation *</Label>
                  <Select value={formData.type_prestation} onValueChange={(value) => handleInputChange("type_prestation", value)}>
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

                <div className="space-y-2">
                  <Label>Date souhaitée</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Choisir une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
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