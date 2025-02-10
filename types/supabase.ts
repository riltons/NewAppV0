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
      communities: {
        Row: {
          id: string
          name: string
          description: string
          owner_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['communities']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['communities']['Insert']>
      }
      games: {
        Row: {
          id: string
          name: string
          description: string
          community_id: string
          status: 'active' | 'finished'
          score: [number, number]
          team1: string[]
          team2: string[]
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['games']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['games']['Insert']>
      }
      competitions: {
        Row: {
          id: string
          name: string
          description: string
          game_id: string
          start_date: string
          end_date: string
          status: 'pending' | 'active' | 'finished'
          players: string[]
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['competitions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['competitions']['Insert']>
      }
      players: {
        Row: {
          id: string
          user_id: string
          nickname: string
          avatar_url?: string
          community_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['players']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['players']['Insert']>
      }
      matches: {
        Row: {
          id: string
          game_id: string
          winner: 1 | 2 | null
          points: number
          type: 'simple' | 'carroca' | 'la-e-lo' | 'cruzada' | 'contagem'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['matches']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['matches']['Insert']>
      }
    }
  }
}