
-- Créer la table pour les réservations
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  adresse TEXT NOT NULL,
  ville TEXT NOT NULL,
  code_postal TEXT NOT NULL,
  marque_vehicule TEXT NOT NULL,
  modele_vehicule TEXT NOT NULL,
  annee_vehicule INTEGER NOT NULL,
  numero_vin TEXT NOT NULL,
  type_prestation TEXT NOT NULL CHECK (type_prestation IN ('suppression_fap', 'suppression_egr', 'suppression_adblue', 'reprogrammation_stage1', 'reprogrammation_stage2')),
  prix DECIMAL(10,2) NOT NULL,
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'confirme', 'en_cours', 'termine', 'annule')),
  date_reservation TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_rdv TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Créer la table pour les demandes SAV
CREATE TABLE public.demandes_sav (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  sujet TEXT NOT NULL,
  description TEXT NOT NULL,
  fichier_url TEXT,
  statut TEXT NOT NULL DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'en_cours', 'resolu', 'ferme')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activer RLS (Row Level Security)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demandes_sav ENABLE ROW LEVEL SECURITY;

-- Créer des politiques pour permettre l'accès public (car pas d'authentification utilisateur)
CREATE POLICY "Accès public aux réservations" ON public.reservations FOR ALL USING (true);
CREATE POLICY "Accès public aux demandes SAV" ON public.demandes_sav FOR ALL USING (true);

-- Créer un bucket de stockage pour les fichiers SAV
INSERT INTO storage.buckets (id, name, public) VALUES ('sav-files', 'sav-files', true);

-- Politique de stockage pour les fichiers SAV
CREATE POLICY "Accès public aux fichiers SAV" ON storage.objects FOR ALL USING (bucket_id = 'sav-files');
