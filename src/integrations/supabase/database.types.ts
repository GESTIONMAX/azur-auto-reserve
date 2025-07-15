export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      disponibilites: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          date_debut: string
          date_fin: string
          statut: string
          reservation_id: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          date_debut: string
          date_fin: string
          statut?: string
          reservation_id?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          date_debut?: string
          date_fin?: string
          statut?: string
          reservation_id?: string | null
          notes?: string | null
        }
        Relationships: []
      }
      demandes_sav: {
        Row: {
          created_at: string
          description: string
          email: string
          fichier_url: string
          id: string
          nom: string
          prenom: string
          statut: string
          sujet: string
          telephone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          email: string
          fichier_url: string
          id?: string
          nom: string
          prenom: string
          statut?: string
          sujet: string
          telephone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          email?: string
          fichier_url?: string
          id?: string
          nom?: string
          prenom?: string
          statut?: string
          sujet?: string
          telephone?: string
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          adresse: string
          annee_vehicule: number
          code_postal: string
          created_at: string
          date_heure: string
          email: string
          id: string
          marque_vehicule: string
          modele_vehicule: string
          nom: string
          numero_vin: string
          prenom: string
          statut: string
          telephone: string
          type_prestation: string
          updated_at: string
          ville: string
        }
        Insert: {
          adresse: string
          annee_vehicule: number
          code_postal: string
          created_at?: string
          date_heure: string
          email: string
          id?: string
          marque_vehicule: string
          modele_vehicule: string
          nom: string
          numero_vin: string
          prenom: string
          statut?: string
          telephone: string
          type_prestation: string
          updated_at?: string
          ville: string
        }
        Update: {
          adresse?: string
          annee_vehicule?: number
          code_postal?: string
          created_at?: string
          date_heure?: string
          email?: string
          id?: string
          marque_vehicule?: string
          modele_vehicule?: string
          nom?: string
          numero_vin?: string
          prenom?: string
          statut?: string
          telephone?: string
          type_prestation?: string
          updated_at?: string
          ville?: string
        }
        Relationships: []
      }
      villes: {
        Row: {
          id: string
          slug: string
          nom: string
          region: string
          departement: string
          code_postal: string
          population: number | null
          meta_title: string
          meta_description: string
          introduction: string
          avantages_locaux: string[]
          prix_specifiques: Json
          points_interet: Json
          latitude: number | null
          longitude: number | null
          visites: number
          conversions: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          nom: string
          region: string
          departement: string
          code_postal: string
          population?: number | null
          meta_title: string
          meta_description: string
          introduction: string
          avantages_locaux: string[]
          prix_specifiques: Json
          points_interet: Json
          latitude?: number | null
          longitude?: number | null
          visites?: number
          conversions?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          nom?: string
          region?: string
          departement?: string
          code_postal?: string
          population?: number | null
          meta_title?: string
          meta_description?: string
          introduction?: string
          avantages_locaux?: string[]
          prix_specifiques?: Json
          points_interet?: Json
          latitude?: number | null
          longitude?: number | null
          visites?: number
          conversions?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
