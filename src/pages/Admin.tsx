import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, AlertCircle, BarChart3, Clock, CheckCircle, XCircle, Phone, Mail, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Reservation = Tables<"reservations">;
type DemandesSAV = Tables<"demandes_sav">;

const Admin = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [demandesSAV, setDemandesSAV] = useState<DemandesSAV[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Charger les réservations
      const { data: reservationsData, error: reservationsError } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (reservationsError) throw reservationsError;

      // Charger les demandes SAV
      const { data: savData, error: savError } = await supabase
        .from('demandes_sav')
        .select('*')
        .order('created_at', { ascending: false });

      if (savError) throw savError;

      setReservations((reservationsData as any) || []);
      setDemandesSAV(savData || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ statut: newStatus })
        .eq('id', id);

      if (error) throw error;

      setReservations(prev => 
        prev.map(r => r.id === id ? { ...r, statut: newStatus } : r)
      );

      toast({
        title: "Statut mis à jour",
        description: "Le statut de la réservation a été modifié."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    }
  };

  const updateSAVStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('demandes_sav')
        .update({ statut: newStatus })
        .eq('id', id);

      if (error) throw error;

      setDemandesSAV(prev => 
        prev.map(d => d.id === id ? { ...d, statut: newStatus } : d)
      );

      toast({
        title: "Statut mis à jour",
        description: "Le statut de la demande SAV a été modifié."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'en_attente': { variant: 'secondary', label: 'En attente' },
      'confirme': { variant: 'default', label: 'Confirmé' },
      'termine': { variant: 'default', label: 'Terminé' },
      'nouveau': { variant: 'destructive', label: 'Nouveau' },
      'en_cours': { variant: 'default', label: 'En cours' },
      'resolu': { variant: 'default', label: 'Résolu' },
    };
    
    const config = variants[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const stats = {
    totalReservations: reservations.length,
    reservationsEnAttente: reservations.filter(r => r.statut === 'en_attente').length,
    totalSAV: demandesSAV.length,
    savEnCours: demandesSAV.filter(d => d.statut === 'nouveau' || d.statut === 'en_cours').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Back Office - OBDExpress</h1>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Retour au site
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistiques */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Réservations totales</p>
                  <p className="text-2xl font-bold">{stats.totalReservations}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold">{stats.reservationsEnAttente}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Demandes SAV</p>
                  <p className="text-2xl font-bold">{stats.totalSAV}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SAV en cours</p>
                  <p className="text-2xl font-bold">{stats.savEnCours}</p>
                </div>
                <Users className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets principaux */}
        <Tabs defaultValue="reservations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reservations">
              Réservations ({stats.totalReservations})
            </TabsTrigger>
            <TabsTrigger value="sav">
              SAV ({stats.totalSAV})
            </TabsTrigger>
          </TabsList>

          {/* Gestion des réservations */}
          <TabsContent value="reservations" className="space-y-6">
            <div className="grid gap-6">
              {reservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {reservation.prenom} {reservation.nom}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(reservation.statut)}
                        <Select
                          value={reservation.statut}
                          onValueChange={(value) => updateReservationStatus(reservation.id, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en_attente">En attente</SelectItem>
                            <SelectItem value="confirme">Confirmé</SelectItem>
                            <SelectItem value="termine">Terminé</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <CardDescription>
                      Réservé le {format(new Date(reservation.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          <span>{reservation.telephone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          <span>{reservation.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{reservation.adresse}, {reservation.ville} {reservation.code_postal}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p><strong>Véhicule:</strong> {reservation.marque_vehicule} {reservation.modele_vehicule} ({reservation.annee_vehicule})</p>
                        <p><strong>VIN:</strong> {reservation.numero_vin}</p>
                        <p><strong>Prestation:</strong> {reservation.type_prestation}</p>
                        <p><strong>Prix:</strong> {reservation.prix}€</p>
                        {reservation.date_rdv && (
                          <p><strong>RDV:</strong> {format(new Date(reservation.date_rdv), 'dd MMMM yyyy', { locale: fr })}</p>
                        )}
                      </div>
                    </div>
                    {reservation.notes && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm"><strong>Notes:</strong> {reservation.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Gestion SAV */}
          <TabsContent value="sav" className="space-y-6">
            <div className="grid gap-6">
              {demandesSAV.map((demande) => (
                <Card key={demande.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {demande.prenom} {demande.nom}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(demande.statut)}
                        <Select
                          value={demande.statut}
                          onValueChange={(value) => updateSAVStatus(demande.id, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nouveau">Nouveau</SelectItem>
                            <SelectItem value="en_cours">En cours</SelectItem>
                            <SelectItem value="resolu">Résolu</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <CardDescription>
                      Demande créée le {format(new Date(demande.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            <span>{demande.telephone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" />
                            <span>{demande.email}</span>
                          </div>
                        </div>
                        <div>
                          <p><strong>Sujet:</strong> {demande.sujet}</p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm"><strong>Description:</strong></p>
                        <p className="mt-2">{demande.description}</p>
                      </div>

                      {demande.fichier_url && (
                        <div className="p-3 border rounded-lg">
                          <p className="text-sm font-medium mb-2">Pièce jointe:</p>
                          <a 
                            href={demande.fichier_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Voir le fichier
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;