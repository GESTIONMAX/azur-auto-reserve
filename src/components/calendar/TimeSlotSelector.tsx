import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Calendar from './Calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { CalendarEvent } from '@/types/disponibilites';

interface TimeSlotSelectorProps {
  onSlotSelect: (slotId: string, startDate: Date, endDate: Date) => void;
  selectedSlotId?: string;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ 
  onSlotSelect,
  selectedSlotId 
}) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const { toast } = useToast();

  // Gérer la sélection d'un créneau dans le calendrier
  const handleEventSelect = (event: CalendarEvent) => {
    console.log('TimeSlotSelector - Événement sélectionné:', event);
    
    if (event.status !== 'disponible') {
      toast({
        title: 'Créneau indisponible',
        description: 'Ce créneau n\'est pas disponible pour réservation.',
        variant: 'destructive',
      });
      return;
    }
    
    setSelectedEvent(event);
    console.log('Appel de onSlotSelect avec:', event.id, event.start, event.end);
    onSlotSelect(event.id, event.start, event.end);
    
    // Confirmation visuelle
    toast({
      title: 'Créneau sélectionné',
      description: 'Vous avez sélectionné un créneau disponible',
      variant: 'default',
    });
  };

  // Formater l'affichage de la date et de l'heure
  const formatDateTime = (date: Date) => {
    return format(date, 'EEEE d MMMM yyyy à HH:mm', { locale: fr });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Choisissez un créneau disponible</CardTitle>
        <CardDescription>
          Sélectionnez un créneau disponible (en vert) dans le calendrier ci-dessous pour votre réservation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Calendar isAdmin={false} onEventSelect={handleEventSelect} />
          
          {selectedEvent && (
            <div className="mt-4 rounded-md bg-secondary p-4">
              <h3 className="font-medium">Créneau sélectionné :</h3>
              <p className="capitalize">
                {formatDateTime(selectedEvent.start)} - {format(selectedEvent.end, 'HH:mm')}
              </p>
            </div>
          )}
          
          {!selectedEvent && selectedSlotId && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Un créneau a été sélectionné</p>
            </div>
          )}
          
          {!selectedEvent && !selectedSlotId && (
            <div className="mt-4 rounded-md bg-muted p-4">
              <p className="text-sm text-muted-foreground">Aucun créneau sélectionné. Veuillez cliquer sur un créneau disponible (en vert) dans le calendrier.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSlotSelector;
