import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import AdminCalendar from '@/components/calendar/AdminCalendar';
import { Helmet } from 'react-helmet-async';

const PlanningPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Gestion du Planning | Azur Auto Réserve</title>
      </Helmet>
      <AdminLayout>
        <div className="container py-8">
          <h1 className="mb-6 text-3xl font-bold">Gestion du Planning</h1>
          <p className="mb-6 text-gray-600">
            Gérez les créneaux de disponibilité pour les réservations. Utilisez le calendrier ci-dessous pour ajouter, 
            modifier ou supprimer des créneaux.
          </p>
          <AdminCalendar />
        </div>
      </AdminLayout>
    </>
  );
};

export default PlanningPage;
