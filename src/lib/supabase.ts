import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Database {
  public: {
    Tables: {
      songs: {
        Row: {
          id: string
          name: string
          artist: string
          duration: number
          file_url: string
          cover_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          artist: string
          duration: number
          file_url: string
          cover_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          artist?: string
          duration?: number
          file_url?: string
          cover_url?: string
          updated_at?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          duration: number
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          duration: number
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          duration?: number
          completed_at?: string
        }
      }
    }
  }
}

export type Song = Database['public']['Tables']['songs']['Row']
export type UserSession = Database['public']['Tables']['user_sessions']['Row']
