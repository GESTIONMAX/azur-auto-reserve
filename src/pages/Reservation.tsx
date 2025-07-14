
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Reservation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  
  const services = {
    suppression_fap: { name: 'Suppression FAP', price: 299 },
    suppression_egr: { name: 'Suppression EGR', price: 249 },
    suppression_adblue: { name: 'Suppression AdBlue', price: 399 },
    reprogrammation_stage1: { name: 'Reprogrammation Stage 1', price: 349 },
    reprogrammation_stage2: { name: 'Reprogrammation Stage 2', price: 499 }
  };

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: '',
    marque_vehicule: '',
    modele_vehicule: '',
    annee_vehicule: new Date().getFullYear(),
    numero_vin: '',
    type_prestation: searchParams.get('service') || '',
    notes: ''
  });

  const selectedService = formData.type_prestation ? services[formData.type_prestation as keyof typeof services] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('reservations')
        .insert({
          ...formData,
          prix: selectedService?.price || 0,
          date_rdv: date?.toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Réservation confirmée !",
        description: "Votre demande de réservation a été enregistrée. Nous vous contacterons sous 24h.",
      });

      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre réservation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold">Réservation</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle réservation</CardTitle>
              <CardDescription>
                Remplissez le formulaire ci-dessous pour réserver votre intervention
              </CardDescription>
              {selectedService && (
                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="font-semibold">{selectedService.name} - {selectedService.price}€</p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations personnelles */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informations personnelles</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                        id="nom"
                        required
                        value={formData.nom}
                        onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        required
                        value={formData.prenom}
                        onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telephone">Téléphone *</Label>
                    <Input
                      id="telephone"
                      required
                      value={formData.telephone}
                      onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    />
                  </div>
                </div>

                {/* Adresse */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Adresse</h3>
                  <div>
                    <Label htmlFor="adresse">Adresse *</Label>
                    <Input
                      id="adresse"
                      required
                      value={formData.adresse}
                      onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ville">Ville *</Label>
                      <Input
                        id="ville"
                        required
                        value={formData.ville}
                        onChange={(e) => setFormData({...formData, ville: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="code_postal">Code postal *</Label>
                      <Input
                        id="code_postal"
                        required
                        value={formData.code_postal}
                        onChange={(e) => setFormData({...formData, code_postal: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Informations véhicule */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informations véhicule</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="marque_vehicule">Marque *</Label>
                      <Input
                        id="marque_vehicule"
                        required
                        value={formData.marque_vehicule}
                        onChange={(e) => setFormData({...formData, marque_vehicule: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="modele_vehicule">Modèle *</Label>
                      <Input
                        id="modele_vehicule"
                        required
                        value={formData.modele_vehicule}
                        onChange={(e) => setFormData({...formData, modele_vehicule: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="annee_vehicule">Année *</Label>
                    <Input
                      id="annee_vehicule"
                      type="number"
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      required
                      value={formData.annee_vehicule}
                      onChange={(e) => setFormData({...formData, annee_vehicule: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="numero_vin">Numéro VIN *</Label>
                    <Input
                      id="numero_vin"
                      required
                      value={formData.numero_vin}
                      onChange={(e) => setFormData({...formData, numero_vin: e.target.value})}
                      placeholder="17 caractères"
                      maxLength={17}
                    />
                  </div>
                </div>

                {/* Service et date */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Service demandé</h3>
                  <div>
                    <Label htmlFor="type_prestation">Type de prestation *</Label>
                    <Select
                      value={formData.type_prestation}
                      onValueChange={(value) => setFormData({...formData, type_prestation: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un service" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(services).map(([key, service]) => (
                          <SelectItem key={key} value={key}>
                            {service.name} - {service.price}€
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Date souhaitée</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: fr }) : "Sélectionnez une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Notes additionnelles</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Informations complémentaires..."
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Envoi en cours..." : "Confirmer la réservation"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
