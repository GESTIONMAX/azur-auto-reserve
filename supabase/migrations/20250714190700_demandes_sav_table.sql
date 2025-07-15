-- Migration pour la fonctionnalité de formulaire SAV
-- Table des demandes de service après-vente

-- Création de la table des demandes SAV
CREATE TABLE public.demandes_sav (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  sujet TEXT NOT NULL,
  description TEXT NOT NULL,
  fichier_url TEXT,
  statut TEXT NOT NULL DEFAULT 'nouveau',  -- nouveau, en_cours, résolu, fermé
  assigné_a UUID REFERENCES auth.users(id),
  notes_internes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activer RLS (Row Level Security)
ALTER TABLE public.demandes_sav ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion publique (pour le formulaire de contact)
CREATE POLICY "Insertion publique des demandes SAV" ON public.demandes_sav 
  FOR INSERT 
  WITH CHECK (true);

-- Politique pour permettre aux admins de voir et modifier toutes les demandes
CREATE POLICY "Accès admin aux demandes SAV" ON public.demandes_sav 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Trigger pour mettre à jour le timestamp updated_at
CREATE TRIGGER update_demandes_sav_updated_at
  BEFORE UPDATE ON public.demandes_sav
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Création du bucket de stockage pour les fichiers SAV
INSERT INTO storage.buckets (id, name) VALUES ('sav-files', 'sav-files')
ON CONFLICT DO NOTHING;

-- Configurer les politiques d'accès pour le stockage
CREATE POLICY "Accès public en lecture aux fichiers SAV" ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'sav-files');

CREATE POLICY "Upload public des fichiers SAV" ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'sav-files');

COMMENT ON TABLE public.demandes_sav IS 'Table contenant les demandes de service après-vente';
