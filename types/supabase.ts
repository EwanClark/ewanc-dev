export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          avatar_source: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          avatar_source?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          avatar_source?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string | null
          github_url: string | null
          demo_url: string | null
          category: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url?: string | null
          github_url?: string | null
          demo_url?: string | null
          category?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          github_url?: string | null
          demo_url?: string | null
          category?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      experiences: {
        Row: {
          id: string
          company: string
          position: string
          start_date: string
          end_date: string | null
          description: string | null
          technologies: string[] | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          company: string
          position: string
          start_date: string
          end_date?: string | null
          description?: string | null
          technologies?: string[] | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          company?: string
          position?: string
          start_date?: string
          end_date?: string | null
          description?: string | null
          technologies?: string[] | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
  }
}
