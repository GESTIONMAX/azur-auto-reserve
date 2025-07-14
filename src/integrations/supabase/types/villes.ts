// Types pour la table villes (SEO programmatique)

export interface Ville {
  id: string;
  slug: string;
  nom: string;
  region: string;
  departement: string;
  code_postal: string;
  population: number | null;
  
  // Informations SEO
  meta_title: string;
  meta_description: string;
  
  // Contenu spécifique
  introduction: string;
  avantages_locaux: string[];
  prix_specifiques: {
    diagnostic_standard: number;
    diagnostic_complet: number;
    diagnostic_electronique: number;
    inspection_pre_achat: number;
    depannage_domicile: number;
    [key: string]: number;
  };
  points_interet: {
    garages_partenaires: string[];
    zone_intervention: string;
    [key: string]: any;
  };
  
  // Géolocalisation
  latitude: number | null;
  longitude: number | null;
  
  // Statistiques
  visites: number;
  conversions: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export type VilleInsert = Omit<Ville, 'id' | 'visites' | 'conversions' | 'created_at' | 'updated_at'>;
export type VilleUpdate = Partial<VilleInsert>;
