import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/database.types';

type Ville = Database['public']['Tables']['villes']['Row'];

const VillesIndex: React.FC = () => {
  const [villes, setVilles] = useState<Ville[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVilles = async () => {
      try {
        const { data, error } = await supabase
          .from('villes')
          .select('*')
          .order('nom', { ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        setVilles(data || []);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des villes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVilles();
  }, []);

  return (
    <>
      <Helmet>
        <title>Nos services de reprogrammation moteur par ville | Azur Auto Réserve</title>
        <meta
          name="description"
          content="Découvrez nos services de reprogrammation moteur et suppression FAP dans votre ville. Trouvez un expert Azur Auto Réserve près de chez vous."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${import.meta.env.VITE_PUBLIC_SITE_URL}/villes`} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">
          Nos services par ville
        </h1>

        <div className="mb-8 max-w-3xl mx-auto">
          <p className="text-lg text-center mb-6">
            Azur Auto Réserve propose des services de reprogrammation moteur et d'optimisation de véhicules dans de nombreuses villes en France.
            Sélectionnez votre ville ci-dessous pour découvrir nos offres spécifiques à votre région.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="spinner"></div>
            <p className="mt-4">Chargement des villes...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-red-700">
              Une erreur est survenue lors du chargement des villes. Veuillez réessayer ultérieurement.
            </p>
            <p className="text-sm text-red-600 mt-1">Détail: {error}</p>
          </div>
        ) : (
          <>
            {villes.length === 0 ? (
              <p className="text-center py-10">
                Aucune ville n'est disponible pour le moment. Revenez bientôt pour plus de destinations.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {villes.map((ville) => (
                  <Link 
                    to={`/villes/${ville.slug}`} 
                    key={ville.id}
                    className="block bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden"
                  >
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold mb-2">{ville.nom}</h2>
                      <p className="text-gray-600 mb-3">
                        {ville.departement}, {ville.region}
                      </p>
                      <p className="text-gray-500 text-sm mb-4">
                        Code postal: {ville.code_postal}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-medium">
                          Voir nos services
                        </span>
                        <span className="text-gray-400">→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-12 text-center">
              <p className="text-gray-600">
                Vous ne trouvez pas votre ville? Contactez-nous pour connaître notre zone d'intervention.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default VillesIndex;
