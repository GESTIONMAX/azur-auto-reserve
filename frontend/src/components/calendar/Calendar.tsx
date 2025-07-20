import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as BigCalendar, Views, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/fr';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database } from '@/types/supabase';
import { CalendarEvent } from '@/types/disponibilites';

// Configurer le localizer pour le français
moment.locale('fr');
const localizer = momentLocalizer(moment);


interface CalendarProps {
  isAdmin?: boolean;
  onSlotSelect?: (start: Date, end: Date) => void;
  onEventSelect?: (event: CalendarEvent) => void;
}

const Calendar: React.FC<CalendarProps> = ({ 
  isAdmin = false, 
  onSlotSelect, 
  onEventSelect 
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Mémoriser le localizer pour éviter les re-rendus inutiles
  const memoizedLocalizer = useMemo(() => localizer, []);

  // Charger les disponibilités depuis Supabase
  useEffect(() => {
    let isMounted = true;
    const fetchDisponibilites = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Utiliser le client Supabase au lieu de fetch direct
        const query = supabase
          .from('disponibilites')
          .select('*')
          .order('date_debut', { ascending: true });
        
        // Filtrer par disponibilité si non admin
        if (!isAdmin) {
          query.eq('statut', 'disponible');
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Erreur Supabase:', error);
          throw error;
        }
        
        if (data && isMounted) {
          try {
            // Mapper les disponibilités en événements de calendrier
            const calendarEvents: CalendarEvent[] = data.map((dispo: any) => ({
              id: dispo.id,
              title: dispo.statut === 'disponible' ? 'Disponible' : 
                    dispo.statut === 'reserve' ? 'Réservé' : 'Bloqué',
              start: new Date(dispo.date_debut),
              end: new Date(dispo.date_fin),
              status: dispo.statut,
              reservationId: dispo.reservation_id || undefined,
              notes: dispo.notes || undefined
            }));
            
            console.log('Disponibilités chargées:', calendarEvents.length, calendarEvents);
            
            // Si aucun créneau n'est disponible, générer des créneaux démo pour tester
            if (calendarEvents.length === 0) {
              console.log('Aucun créneau disponible, génération de créneaux de test');
              // Ajouter quelques événements de démo pour les tests
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(today.getDate() + 1);
              
              calendarEvents.push({
                id: 'demo-1',
                title: 'Disponible (Démo)',
                start: new Date(tomorrow.setHours(10, 0, 0)),
                end: new Date(tomorrow.setHours(12, 0, 0)),
                status: 'disponible'
              });
              
              const dayAfterTomorrow = new Date(today);
              dayAfterTomorrow.setDate(today.getDate() + 2);
              
              calendarEvents.push({
                id: 'demo-2',
                title: 'Disponible (Démo)',
                start: new Date(dayAfterTomorrow.setHours(14, 0, 0)),
                end: new Date(dayAfterTomorrow.setHours(16, 0, 0)),
                status: 'disponible'
              });
            }
            
            setEvents(calendarEvents);
          } catch (mapError) {
            console.error('Erreur lors de la conversion des données:', mapError);
            setError('Format de données incorrect');
          }
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des disponibilités:', error);
        if (isMounted) {
          setError(error?.message || 'Impossible de charger le calendrier des disponibilités');
          toast({
            title: 'Erreur',
            description: 'Impossible de charger le calendrier des disponibilités',
            variant: 'destructive'
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDisponibilites();
    
    return () => { isMounted = false; };
  }, [isAdmin, toast]);

  // Gérer la sélection d'un créneau
  const handleSlotSelect = ({ start, end }: { start: Date; end: Date }) => {
    if (onSlotSelect && isAdmin) {
      onSlotSelect(start, end);
    }
  };

  // Gérer la sélection d'un événement
  const handleEventSelect = (event: CalendarEvent) => {
    console.log('Event sélectionné:', event);
    if (onEventSelect) {
      onEventSelect(event);
    } else {
      console.error('onEventSelect handler non défini!');
    }
  };

  // Style des événements selon leur statut
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3174ad'; // Défaut
    let color = '#fff';

    switch (event.status) {
      case 'disponible':
        backgroundColor = '#10b981'; // Vert pour disponible
        break;
      case 'reserve':
        backgroundColor = '#f59e0b'; // Orange pour réservé
        break;
      case 'bloque':
        backgroundColor = '#ef4444'; // Rouge pour bloqué
        break;
    }

    return {
      style: {
        backgroundColor,
        color,
        borderRadius: '5px',
        border: 'none',
        opacity: 0.9,
        cursor: 'pointer',
      },
    };
  };

  // Afficher un état de chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[500px] w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Chargement du calendrier...</span>
      </div>
    );
  }

  // Afficher un état d'erreur
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  // Rendu normal du calendrier avec les événements
  return (
    <div className="h-[400px] md:h-[500px] w-full overflow-hidden">
      <BigCalendar
        localizer={memoizedLocalizer}
        events={events}
        views={isAdmin ? { month: true, week: true, day: true, agenda: true } : { month: true }}
        defaultView={Views.MONTH}
        selectable={isAdmin} // Seul l'admin peut créer des créneaux
        onSelectSlot={handleSlotSelect}
        onSelectEvent={handleEventSelect} // Tous les utilisateurs peuvent sélectionner un événement existant
        eventPropGetter={eventStyleGetter}
        popup={true}
        className="max-w-full"
        messages={{
          today: "Aujourd'hui",
          previous: "Précédent",
          next: "Suivant",
          month: "Mois",
          week: "Semaine",
          day: "Jour",
          agenda: "Agenda",
          date: "Date",
          time: "Heure",
          event: "Événement",
          noEventsInRange: "Aucun créneau disponible dans cette période",
        }}
      />
    </div>
  );
};

export default Calendar;
