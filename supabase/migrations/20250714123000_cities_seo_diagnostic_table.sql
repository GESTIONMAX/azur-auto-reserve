-- Migration pour la fonctionnalité de SEO programmatique
-- Table des villes pour la génération dynamique de pages SEO

-- Création de la table des villes
CREATE TABLE public.villes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE, -- pour l'URL (/villes/nice)
  nom TEXT NOT NULL,
  region TEXT NOT NULL,
  departement TEXT NOT NULL,
  code_postal TEXT NOT NULL,
  population INTEGER,
  
  -- Informations pour personnaliser le contenu SEO
  meta_title TEXT NOT NULL, -- ex: "Diagnostic automobile à domicile à Nice | Azur Auto Réserve"
  meta_description TEXT NOT NULL, -- ex: "Service de diagnostic automobile à domicile à Nice par nos experts."
  
  -- Contenu spécifique à la ville
  introduction TEXT NOT NULL, -- Paragraphe d'introduction spécifique à la ville
  avantages_locaux TEXT[], -- Liste des avantages spécifiques à cette ville
  prix_specifiques JSONB, -- Prix spécifiques à cette ville pour différents services
  points_interet JSONB, -- Points d'intérêt locaux (garages partenaires, etc.)
  
  -- Informations géographiques
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Statistiques et performance
  visites INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour les recherches
CREATE INDEX villes_slug_idx ON public.villes(slug);
CREATE INDEX villes_nom_idx ON public.villes(nom);
CREATE INDEX villes_region_idx ON public.villes(region);
CREATE INDEX villes_departement_idx ON public.villes(departement);

-- Activer RLS (Row Level Security)
ALTER TABLE public.villes ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre l'accès public en lecture
CREATE POLICY "Accès public en lecture aux villes" ON public.villes 
  FOR SELECT USING (true);

-- Créer une politique pour limiter les modifications aux utilisateurs authentifiés avec le rôle admin
CREATE POLICY "Modifications des villes limitées aux admins" ON public.villes
  FOR ALL USING (auth.role() = 'authenticated');

-- Fonction de mise à jour du timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour le timestamp automatiquement
CREATE TRIGGER update_villes_updated_at
  BEFORE UPDATE ON public.villes
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Insérer quelques villes d'exemple
INSERT INTO public.villes (
  slug, nom, region, departement, code_postal, population, 
  meta_title, meta_description, introduction, avantages_locaux, 
  prix_specifiques, points_interet
) VALUES 
(
  'nice', 'Nice', 'Provence-Alpes-Côte d''Azur', 'Alpes-Maritimes', '06000', 342522,
  'Diagnostic automobile à domicile à Nice | Azur Auto Réserve', 
  'Service professionnel de diagnostic automobile à domicile à Nice. Bénéficiez de l''expertise de nos techniciens pour identifier rapidement les problèmes de votre véhicule.',
  'Nice, joyau de la Côte d''Azur, est une ville où la mobilité est essentielle. Azur Auto Réserve offre aux Niçois un service de diagnostic automobile à domicile complet et pratique, sans avoir à vous déplacer dans un garage.',
  ARRAY['Expertise spécifique pour les véhicules circulant en zone côtière', 'Service à domicile dans tout Nice et ses environs', 'Partenariats avec les garages locaux'],
  '{"diagnostic_standard": 89, "diagnostic_complet": 149, "diagnostic_electronique": 119, "inspection_pre_achat": 199, "depannage_domicile": 129}'::jsonb,
  '{"garages_partenaires": ["Garage AutoTech Nice", "Centre Auto Premium"], "zone_intervention": "Nice et 15km alentours"}'::jsonb
),
(
  'cannes', 'Cannes', 'Provence-Alpes-Côte d''Azur', 'Alpes-Maritimes', '06400', 74545,
  'Diagnostic automobile à domicile à Cannes | Azur Auto Réserve', 
  'Service de diagnostic automobile à domicile à Cannes. Nos experts se déplacent chez vous pour identifier et résoudre les problèmes de votre véhicule.',
  'À Cannes, ville de prestige et d''élégance, la mobilité est primordiale. Azur Auto Réserve propose aux Cannois un service de diagnostic automobile à domicile pratique et efficace, adapté au rythme de vie de la Côte d''Azur.',
  ARRAY['Spécialiste des véhicules haut de gamme', 'Intervention rapide dans Cannes', 'Service discret pour véhicules de luxe'],
  '{"diagnostic_standard": 99, "diagnostic_complet": 159, "diagnostic_electronique": 129, "inspection_pre_achat": 219, "depannage_domicile": 139}'::jsonb,
  '{"garages_partenaires": ["Prestige Auto Cannes", "Grand Prix Motors"], "zone_intervention": "Cannes et alentours"}'::jsonb
);

-- Exemple d'ajout d'un commentaire sur la table pour la documentation
COMMENT ON TABLE public.villes IS 'Table contenant les informations des villes pour le SEO programmatique';
