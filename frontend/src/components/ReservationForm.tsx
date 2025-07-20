import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, User, Car, Phone, Mail, Loader2 } from "lucide-react";
import GoogleAddressAutocomplete from "./GoogleAddressAutocomplete";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import TimeSlotSelector from "@/components/calendar/TimeSlotSelector";
import VehicleSelector from "@/components/VehicleSelector";

// Interface pour les prix spécifiques par ville
interface PrixSpecifiques {
  [ville: string]: number;
}

// Type générique pour les données de villes provenant de Supabase
type VilleData = {
  id: string | number;
  nom: string;
  code_postal: string;
  prix_specifiques: any; // Utiliser 'any' pour éviter les problèmes de typage avec JSON Supabase
}

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
    type_prestation: "diagnostic_auto", // Valeur par défaut pour l'offre unique
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(99); // Prix par défaut
  const [villesData, setVillesData] = useState<VilleData[]>([]); 
  const { toast } = useToast();

  // Charger les données des villes au chargement du composant
  useEffect(() => {
    const fetchVillesData = async () => {
      try {
        const { data, error } = await supabase
          .from('villes')
          .select('id, nom, code_postal, prix_specifiques');
        
        if (error) throw error;
        if (data) {
          // Conversion explicite pour assurer la compatibilité de type
          const typedData: VilleData[] = data.map(item => ({
            id: item.id,
            nom: item.nom,
            code_postal: item.code_postal,
            prix_specifiques: item.prix_specifiques
          }));
          setVillesData(typedData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des villes:', error);
      }
    };
    
    fetchVillesData();
    // Essayer d'obtenir la géolocalisation au chargement
    getUserLocation();
  }, []);
  
  // Fonction pour obtenir la localisation de l'utilisateur
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setIsGeolocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Utiliser une API de géocodage inverse pour obtenir l'adresse
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=fr`
            );
            const data = await response.json();
            
            // Remplir l'adresse et la ville automatiquement
            const ville = data.locality || data.city || '';
            const codePostal = data.postcode || '';
            
            setFormData(prev => ({
              ...prev,
              ville,
              // Conserver le code postal existant s'il est déjà rempli et que l'API ne renvoie pas de valeur
              code_postal: codePostal || prev.code_postal || '',
              // Ne pas pré-remplir l'adresse d'intervention avec les informations régionales
              // L'utilisateur doit saisir l'adresse exacte d'intervention
              // adresse: data.principalSubdivision ? `${data.principalSubdivision}, ${ville}` : ville
            }));
            
            // Calculer le prix basé sur la ville
            updatePriceBasedOnLocation(ville);
          } catch (error) {
            console.error("Erreur lors de la récupération de l'adresse:", error);
          } finally {
            setIsGeolocationLoading(false);
          }
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          setIsGeolocationLoading(false);
          toast({
            title: "Géolocalisation non disponible",
            description: "Veuillez saisir votre adresse manuellement.",
            variant: "destructive"
          });
        }
      );
    }
  };
  
  // Mettre à jour le prix en fonction de la localisation
  const updatePriceBasedOnLocation = (ville: string) => {
    // Prix par défaut si aucune correspondance n'est trouvée
    let newPrice = 99;
    
    // Rechercher dans les données de villes si un prix spécifique est défini
    const villeData = villesData.find(v => v.nom.toLowerCase() === ville.toLowerCase());
    
    if (villeData && villeData.prix_specifiques) {
      // Si un prix spécifique existe pour cette ville
      const prixSpecifique = villeData.prix_specifiques[ville.toLowerCase()] || 
                           villeData.prix_specifiques['default'];
                           
      if (prixSpecifique) {
        newPrice = prixSpecifique;
      }
    }
    
    setCurrentPrice(newPrice);
  };
  
  // Mettre à jour le prix quand la ville change manuellement
  useEffect(() => {
    if (formData.ville) {
      updatePriceBasedOnLocation(formData.ville);
    }
  }, [formData.ville]);
  
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('=== DÉBUT DU PROCESSUS DE RÉSERVATION ===');
    console.log('Données du formulaire:', formData);
    console.log('Créneau sélectionné:', { 
      id: selectedSlotId, 
      startDate: selectedStartDate?.toISOString(), 
      endDate: selectedEndDate?.toISOString() 
    });
    console.log('Informations véhicule:', vehicleInfo);
    console.log('Prix calculé:', currentPrice);

    try {
      setIsSubmitting(true);
      // Vérification des prérequis
      console.log('Vérification des prérequis OK - Début insertion réservation');
      
      // S'assurer que le prix est défini (valeur par défaut de 99 si non défini)
      const prixFinal = currentPrice || 99;
      console.log(`Prix calculé: ${prixFinal}`);
      
      // Construire les données standard de la réservation
      const standardReservationFields = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        // Champs d'adresse d'intervention (pas seulement pour la géolocalisation)
        adresse: formData.adresse || '',
        ville: formData.ville || '',
        code_postal: formData.code_postal || '',
        // Information véhicule
        marque_vehicule: formData.marque_vehicule || '',
        modele_vehicule: formData.modele_vehicule || '',
        annee_vehicule: formData.annee_vehicule || new Date().getFullYear().toString(),
        numero_vin: formData.numero_vin || '',
        // Information prestation
        type_prestation: 'essentiel', // Valeur par défaut, maintenant qu'il n'y a qu'une seule prestation
        // Forcer la présence du prix et s'assurer qu'il est envoyé comme une chaîne
        prix: String(prixFinal),
        notes: formData.notes || '',
        statut: 'nouvelle'
      };
      
      const requestBody = {
        reservation_data: standardReservationFields,
        slot_start: selectedStartDate.toISOString(),
        slot_end: selectedEndDate.toISOString()
      };
      
      console.log('Appel de la fonction RPC create_reservation avec les paramètres:', requestBody);
      console.log('Corps de la requête JSON:', JSON.stringify(requestBody, null, 2));
      
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/create_reservation`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(requestBody)
          }
        );
        
        console.log('Réponse de l\'API:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries([...response.headers])
        });

        const responseText = await response.text();
        console.log('Corps de la réponse:', responseText);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${responseText}`);
        }
        
        // Parse la réponse JSON si elle existe
        let reservationData;
        try {
          if (responseText) {
            reservationData = JSON.parse(responseText);
          }
        } catch (parseError) {
          console.error('Erreur lors du parsing de la réponse JSON:', parseError);
          throw new Error('Format de réponse invalide');
        }
        
        console.log('Réservation créée avec succès:', reservationData);
        
        // Récupérer l'ID de réservation depuis la réponse JSON si disponible
        const reservationId = reservationData?.reservation_id;
        console.log('Réservation complète terminée avec succès. ID réservation:', reservationId || 'Non retourné');
        
        console.log('=== FIN DU PROCESSUS DE RÉSERVATION - SUCCÈS ===');

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
        
      } catch (apiError) {
        console.error('Erreur API lors de la création de la réservation:', apiError);
        throw apiError;
      }
      
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message || "Une erreur est survenue lors de l'envoi de votre réservation.",
        variant: "destructive",
      });
      console.error('Erreur lors de la soumission du formulaire:', error);
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
                  <Label htmlFor="nom" className="flex items-center gap-1">Nom <span className="text-destructive">*</span></Label>
                  <Input
                    id="nom"
                    required
                    value={formData.nom}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom" className="flex items-center gap-1">Prénom <span className="text-destructive">*</span></Label>
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
                  <Label htmlFor="email" className="flex items-center gap-1">Email <span className="text-destructive">*</span></Label>
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
                  <Label htmlFor="telephone" className="flex items-center gap-1">Téléphone <span className="text-destructive">*</span></Label>
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

              {/* Bloc Tarification et Diagnostic */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">Diagnostic Automobile Essentiel</h3>
                    <p className="text-sm text-muted-foreground">Lecture des codes défaut et diagnostic précis</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{currentPrice} €</p>
                    <p className="text-sm text-muted-foreground">Prix pour {formData.ville || 'votre zone'}</p>
                  </div>
                </div>
                <div className="mb-3 p-2 bg-blue-50 border border-blue-100 rounded text-sm text-blue-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Le prix varie selon votre localisation. Utilisez le bouton ci-dessous ou saisissez votre adresse pour calculer le tarif précis.</span>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={getUserLocation} 
                  className="w-full flex justify-center items-center gap-2 bg-white"
                  disabled={isGeolocationLoading}
                >
                  {isGeolocationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                  Utiliser ma position actuelle
                </Button>
              </div>

              {/* Adresse */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adresse" className="flex items-center gap-1">Adresse d'intervention <span className="text-destructive">*</span></Label>
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
                  <Label className="mb-2 block flex items-center gap-1">Sélectionnez votre véhicule <span className="text-destructive">*</span></Label>
                  <VehicleSelector onVehicleInfoFound={(data) => {
                    setVehicleInfo(data);
                    // Mettre à jour les informations du véhicule dans le formulaire
                    setFormData(prev => ({
                      ...prev,
                      marque_vehicule: data.make || "",
                      modele_vehicule: data.model || "",
                      annee_vehicule: data.year?.toString() || "",
                      // Conserver le VIN s'il est disponible
                      numero_vin: data.vin || prev.numero_vin
                    }));
                  }} />
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
              
              {/* Sélecteur de créneaux */}
              <div className="space-y-2">
                <Label htmlFor="creneaux" className="block mb-2 flex items-center gap-1">Choisissez un créneau de rendez-vous <span className="text-destructive">*</span></Label>
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
                className="w-full bg-green-600 hover:bg-green-700" 
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