import React, { useState } from 'react';
import Calendar from './Calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarEvent, StatutDisponibilite } from '@/types/disponibilites';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminCalendar: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<StatutDisponibilite>('disponible');
  const [notes, setNotes] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Gérer la création d'un nouveau créneau
  const handleCreateSlot = async () => {
    if (!startDate || !endDate) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une date de début et de fin',
        variant: 'destructive',
      });
      return;
    }

    if (startDate >= endDate) {
      toast({
        title: 'Erreur',
        description: 'La date de fin doit être postérieure à la date de début',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from('disponibilites').insert({
        date_debut: startDate.toISOString(),
        date_fin: endDate.toISOString(),
        statut: status,
        notes,
      });

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Créneau créé avec succès',
      });

      // Réinitialiser le formulaire et fermer la boîte de dialogue
      setStartDate(null);
      setEndDate(null);
      setStatus('disponible');
      setNotes('');
      setIsCreateDialogOpen(false);

      // Recharger le calendrier (le useEffect dans Calendar se déclenchera)
      // Force refresh en ajoutant un paramètre à l'URL
      window.location.search = `?refresh=${Date.now()}`;
    } catch (error) {
      console.error('Erreur lors de la création du créneau:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le créneau',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la mise à jour d'un créneau existant
  const handleUpdateSlot = async () => {
    if (!selectedEvent || !startDate || !endDate) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('disponibilites')
        .update({
          date_debut: startDate.toISOString(),
          date_fin: endDate.toISOString(),
          statut: status,
          notes,
        })
        .eq('id', selectedEvent.id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Créneau mis à jour avec succès',
      });

      setIsEditDialogOpen(false);
      // Force refresh
      window.location.search = `?refresh=${Date.now()}`;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du créneau:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le créneau',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la suppression d'un créneau
  const handleDeleteSlot = async () => {
    if (!selectedEvent) {
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) {
      setIsLoading(true);

      try {
        const { error } = await supabase
          .from('disponibilites')
          .delete()
          .eq('id', selectedEvent.id);

        if (error) throw error;

        toast({
          title: 'Succès',
          description: 'Créneau supprimé avec succès',
        });

        setIsEditDialogOpen(false);
        // Force refresh
        window.location.search = `?refresh=${Date.now()}`;
      } catch (error) {
        console.error('Erreur lors de la suppression du créneau:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer le créneau',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Gérer la sélection d'un créneau dans le calendrier
  const handleSlotSelect = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    setIsCreateDialogOpen(true);
  };

  // Gérer la sélection d'un événement dans le calendrier
  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setStartDate(event.start);
    setEndDate(event.end);
    setStatus(event.status);
    setNotes(event.notes || '');
    setIsEditDialogOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gestion du planning</CardTitle>
        <CardDescription>
          Gérez les créneaux de disponibilité pour les réservations. Cliquez et glissez sur le calendrier pour créer un nouveau créneau.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Calendar isAdmin={true} onSlotSelect={handleSlotSelect} onEventSelect={handleEventSelect} />
          <Button onClick={() => setIsCreateDialogOpen(true)}>Ajouter un créneau</Button>
        </div>

        {/* Dialog pour créer un nouveau créneau */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer un nouveau créneau</DialogTitle>
              <DialogDescription>
                Définissez la période de disponibilité et le statut du créneau.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Date de début</Label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    timeCaption="Heure"
                    dateFormat="dd/MM/yyyy HH:mm"
                    locale={fr}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholderText="Sélectionner..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Date de fin</Label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    timeCaption="Heure"
                    dateFormat="dd/MM/yyyy HH:mm"
                    locale={fr}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholderText="Sélectionner..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as StatutDisponibilite)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="bloque">Bloqué</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes ou commentaires (facultatif)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleCreateSlot} disabled={isLoading}>
                {isLoading ? 'En cours...' : 'Créer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog pour modifier un créneau existant */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier le créneau</DialogTitle>
              <DialogDescription>
                Modifiez les détails du créneau sélectionné.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Date de début</Label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    timeCaption="Heure"
                    dateFormat="dd/MM/yyyy HH:mm"
                    locale={fr}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholderText="Sélectionner..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Date de fin</Label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    timeCaption="Heure"
                    dateFormat="dd/MM/yyyy HH:mm"
                    locale={fr}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholderText="Sélectionner..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as StatutDisponibilite)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="reserve">Réservé</SelectItem>
                    <SelectItem value="bloque">Bloqué</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes ou commentaires (facultatif)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="destructive" onClick={handleDeleteSlot} disabled={isLoading}>
                Supprimer
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleUpdateSlot} disabled={isLoading}>
                  {isLoading ? 'En cours...' : 'Enregistrer'}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminCalendar;
