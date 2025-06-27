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
      short_urls: {
        Row: {
          id: string
          user_id: string
          original_url: string
          short_code: string
          password_hash: string | null
          created_at: string
          updated_at: string
          is_active: boolean
          total_clicks: number
          unique_clicks: number
        }
        Insert: {
          id?: string
          user_id: string
          original_url: string
          short_code: string
          password_hash?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
          total_clicks?: number
          unique_clicks?: number
        }
        Update: {
          id?: string
          user_id?: string
          original_url?: string
          short_code?: string
          password_hash?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
          total_clicks?: number
          unique_clicks?: number
        }
      }
      short_url_analytics: {
        Row: {
          id: string
          short_url_id: string
          ip_address: string
          user_agent: string | null

          timestamp: string
          country: string | null
          region: string | null
          city: string | null
          isp: string | null
          device: string | null
          browser: string | null
          os: string | null
          authorized: boolean | null
        }
        Insert: {
          id?: string
          short_url_id: string
          ip_address: string
          user_agent?: string | null
          timestamp?: string
          country?: string | null
          region?: string | null
          city?: string | null
          isp?: string | null
          device?: string | null
          browser?: string | null
          os?: string | null
          authorized?: boolean | null
        }
        Update: {
          id?: string
          short_url_id?: string
          ip_address?: string
          user_agent?: string | null
          timestamp?: string
          country?: string | null
          region?: string | null
          city?: string | null
          isp?: string | null
          device?: string | null
          browser?: string | null
          os?: string | null
          authorized?: boolean | null
        }
      }
    }
  }
}
