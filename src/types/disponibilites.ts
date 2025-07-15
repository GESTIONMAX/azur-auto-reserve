import { Database } from '@/types/supabase';

export type Disponibilite = Database['public']['Tables']['disponibilites']['Row'];

export type StatutDisponibilite = 'disponible' | 'reserve' | 'bloque';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: StatutDisponibilite;
  reservationId?: string;
  notes?: string;
}

export const mapDisponibiliteToCalendarEvent = (dispo: Disponibilite): CalendarEvent => {
  const title = dispo.statut === 'disponible' 
    ? 'Disponible'
    : dispo.statut === 'reserve'
      ? 'Réservé'
      : 'Bloqué';

  return {
    id: dispo.id,
    title,
    start: new Date(dispo.date_debut),
    end: new Date(dispo.date_fin),
    status: dispo.statut as StatutDisponibilite,
    reservationId: dispo.reservation_id || undefined,
    notes: dispo.notes || undefined
  };
};
