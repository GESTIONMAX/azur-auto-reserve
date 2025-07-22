import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/database.types';

type Ville = Database['public']['Tables']['villes']['Row'];

const VilleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [ville, setVille] = useState<Ville | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVille = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('villes')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (!data) {
          navigate('/not-found');
          return;
        }

        setVille(data);

        // Incrémenter le compteur de visites
        await supabase
          .from('villes')
          .update({ visites: data.visites + 1 })
          .eq('id', data.id);

      } catch (err: any) {
        console.error('Erreur lors de la récupération de la ville:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVille();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="spinner"></div>
        <p className="mt-4">Chargement...</p>
      </div>
    );
  }

  if (error || !ville) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-6">Ville non trouvée</h1>
        <p className="mb-8">
          Désolé, la ville que vous recherchez n'existe pas dans notre base de données.
        </p>
        <Link 
          to="/villes" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Voir toutes nos villes
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{ville.meta_title}</title>
        <meta name="description" content={ville.meta_description} />
        <meta property="og:title" content={ville.meta_title} />
        <meta property="og:description" content={ville.meta_description} />
        <meta property="og:url" content={`${import.meta.env.VITE_PUBLIC_SITE_URL}/villes/${ville.slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_FR" />
        <link rel="canonical" href={`${import.meta.env.VITE_PUBLIC_SITE_URL}/villes/${ville.slug}`} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <Link to="/villes" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <span className="mr-1">←</span> Retour à toutes les villes
        </Link>

        <h1 className="text-4xl font-bold mb-6">
          Reprogrammation moteur à {ville.nom}
        </h1>

        <div className="bg-gray-100 p-4 rounded-md mb-8">
          <p className="text-sm">
            <strong>Région:</strong> {ville.region} | <strong>Département:</strong> {ville.departement} | <strong>Code postal:</strong> {ville.code_postal}
          </p>
        </div>

        <div className="prose max-w-none mb-12">
          <p className="text-xl mb-6">{ville.introduction}</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Nos services de reprogrammation moteur à {ville.nom}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold mb-3">Suppression FAP</h3>
              <p className="mb-4">
                Élimination du filtre à particules pour améliorer les performances et réduire les problèmes de régénération.
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {(ville.prix_specifiques as any)?.suppression_fap || 'Sur devis'}€
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold mb-3">Suppression EGR</h3>
              <p className="mb-4">
                Suppression de la vanne EGR pour améliorer la combustion et la fiabilité du moteur.
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {(ville.prix_specifiques as any)?.suppression_egr || 'Sur devis'}€
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold mb-3">Suppression AdBlue</h3>
              <p className="mb-4">
                Élimination du système AdBlue pour éviter les problèmes liés à ce système et réduire les coûts d'entretien.
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {(ville.prix_specifiques as any)?.suppression_adblue || 'Sur devis'}€
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold mb-3">Reprogrammation Stage 1</h3>
              <p className="mb-4">
                Optimisation des paramètres moteur pour gagner en puissance et en couple tout en conservant la fiabilité d'origine.
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {(ville.prix_specifiques as any)?.reprogrammation_stage1 || 'Sur devis'}€
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            Pourquoi choisir Azur Auto Réserve à {ville.nom} ?
          </h2>

          <ul className="list-disc pl-6 mb-8">
            {ville.avantages_locaux.map((avantage, index) => (
              <li key={index} className="mb-2">{avantage}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            Nos points d'intervention à {ville.nom}
          </h2>

          <p className="mb-4">
            Notre équipe intervient dans toute la zone de {(ville.points_interet as any)?.zone_intervention || ville.nom}.
          </p>

          {(ville.points_interet as any)?.garages_partenaires && (ville.points_interet as any)?.garages_partenaires.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mt-6 mb-3">
                Nos garages partenaires à {ville.nom}
              </h3>
              <ul className="list-disc pl-6 mb-8">
                {(ville.points_interet as any)?.garages_partenaires.map((garage: string, index: number) => (
                  <li key={index} className="mb-2">{garage}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="bg-blue-100 p-6 rounded-lg border border-blue-200 mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Réservez votre intervention à {ville.nom}
          </h2>
          <p className="mb-6">
            Nos experts sont disponibles pour réaliser votre reprogrammation moteur ou suppression FAP à {ville.nom} et dans ses environs.
          </p>
          <Link
            to="/formulaire-reservation"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-md hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Prendre rendez-vous
          </Link>
        </div>
      </div>
    </>
  );
};

export default VilleDetail;
