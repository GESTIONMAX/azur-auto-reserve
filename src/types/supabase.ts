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
      demandes_sav: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          nom: string
          prenom: string
          email: string
          telephone: string
          sujet: string
          description: string
          fichier_url: string | null
          statut: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          nom: string
          prenom: string
          email: string
          telephone: string
          sujet: string
          description: string
          fichier_url?: string | null
          statut?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          nom?: string
          prenom?: string
          email?: string
          telephone?: string
          sujet?: string
          description?: string
          fichier_url?: string | null
          statut?: string
        }
        Relationships: []
      }
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
        Relationships: [
          {
            foreignKeyName: "disponibilites_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          }
        ]
      }
      reservations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          nom: string
          prenom: string
          email: string
          telephone: string
          marque: string
          modele: string
          annee: string
          immatriculation: string | null
          vin: string | null
          type_prestation: string
          notes: string | null
          statut: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          nom: string
          prenom: string
          email: string
          telephone: string
          marque: string
          modele: string
          annee: string
          immatriculation?: string | null
          vin?: string | null
          type_prestation: string
          notes?: string | null
          statut?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          nom?: string
          prenom?: string
          email?: string
          telephone?: string
          marque?: string
          modele?: string
          annee?: string
          immatriculation?: string | null
          vin?: string | null
          type_prestation?: string
          notes?: string | null
          statut?: string
        }
        Relationships: []
      }
      villes: {
        Row: {
          id: string
          created_at: string
          nom: string
          code_postal: string
          slug: string
          meta_title: string
          meta_description: string
          h1: string
          contenu_html: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          nom: string
          code_postal: string
          slug: string
          meta_title: string
          meta_description: string
          h1: string
          contenu_html?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          nom?: string
          code_postal?: string
          slug?: string
          meta_title?: string
          meta_description?: string
          h1?: string
          contenu_html?: string | null
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
