import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import type { Ville } from '@/integrations/supabase/types/villes';

const VilleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [ville, setVille] = useState<Ville | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const siteUrl = import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin;

  useEffect(() => {
    const fetchVilleDetails = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('villes')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Ville non trouvée
            navigate('/villes', { replace: true });
            return;
          }
          throw new Error(error.message);
        }

        if (!data) {
          navigate('/villes', { replace: true });
          return;
        }

        setVille(data as Ville);
        
        // Incrémenter le compteur de visites
        await supabase
          .from('villes')
          .update({ visites: (data.visites || 0) + 1 })
          .eq('id', data.id);
          
        setLoading(false);
      } catch (err) {
        console.error(`Erreur lors de la récupération des détails pour ${slug}:`, err);
        setError('Une erreur est survenue lors du chargement des informations. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    fetchVilleDetails();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto py-16">
        <h1 className="text-2xl font-bold mb-8">Chargement...</h1>
      </div>
    );
  }

  if (error || !ville) {
    return (
      <div className="container mx-auto py-16">
        <h1 className="text-2xl font-bold mb-4">Erreur</h1>
        <p className="text-red-500">{error || 'Ville non trouvée'}</p>
        <button 
          onClick={() => navigate('/villes')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Voir toutes les villes
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{ville.meta_title}</title>
        <meta name="description" content={ville.meta_description} />
        <link rel="canonical" href={`${siteUrl}/villes/${ville.slug}`} />
      </Helmet>

      <div className="container mx-auto py-16">
        <h1 className="text-4xl font-bold mb-4">Diagnostic automobile à domicile à {ville.nom}</h1>
        <p className="text-gray-600 mb-8">{ville.region} - {ville.departement}</p>

        <div className="prose max-w-none mb-12">
          <p className="text-lg mb-6">{ville.introduction}</p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Nos avantages à {ville.nom}</h2>
          <ul className="list-disc pl-6 mb-8">
            {ville.avantages_locaux.map((avantage, index) => (
              <li key={index} className="mb-2">{avantage}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-6">Nos tarifs à {ville.nom}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-xl mb-2">Diagnostic standard</h3>
              <p className="text-3xl font-bold text-blue-600">{ville.prix_specifiques.diagnostic_standard}€</p>
              <p className="mt-2 text-gray-600">Analyse des codes défaut et diagnostic de base</p>
            </div>
            

            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-xl mb-2">Diagnostic électronique</h3>
              <p className="text-3xl font-bold text-blue-600">{ville.prix_specifiques.diagnostic_electronique}€</p>
              <p className="mt-2 text-gray-600">Spécifique aux problèmes électriques et électroniques</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-xl mb-2">Inspection pré-achat</h3>
              <p className="text-3xl font-bold text-blue-600">{ville.prix_specifiques.inspection_pre_achat}€</p>
              <p className="mt-2 text-gray-600">Inspection complète avant l'achat d'un véhicule d'occasion</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-xl mb-2">Dépannage à domicile</h3>
              <p className="text-3xl font-bold text-blue-600">{ville.prix_specifiques.depannage_domicile}€</p>
              <p className="mt-2 text-gray-600">Intervention rapide en cas de panne</p>
            </div>
          </div>

          {ville.points_interet.garages_partenaires && ville.points_interet.garages_partenaires.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mt-10 mb-4">Nos partenaires à {ville.nom}</h2>
              <ul className="list-disc pl-6 mb-8">
                {ville.points_interet.garages_partenaires.map((garage, index) => (
                  <li key={index} className="mb-2">{garage}</li>
                ))}
              </ul>
            </>
          )}

          <div className="bg-gray-100 p-6 rounded-lg my-8">
            <h2 className="text-2xl font-semibold mb-4">Zone d'intervention</h2>
            <p>{ville.points_interet.zone_intervention}</p>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4">Besoin d'un diagnostic automobile à {ville.nom} ?</h3>
            <p className="mb-6">Nos experts se déplacent à votre domicile pour un diagnostic rapide et précis.</p>
            <a 
              href="#contact" 
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block font-medium"
            >
              Prendre rendez-vous
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default VilleDetail;
