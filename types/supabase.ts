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
      feature_requests: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          project_id: string
          title: string | null
          updated_at: string | null
          upvotes: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          project_id: string
          title?: string | null
          updated_at?: string | null
          upvotes?: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          project_id?: string
          title?: string | null
          updated_at?: string | null
          upvotes?: number
        }
        Relationships: [
          {
            foreignKeyName: "feature_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          start_date: string | null
          status: number
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          description?: string | null
          id: string
          start_date?: string | null
          status?: number
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          start_date?: string | null
          status?: number
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          column_order: number
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          project_id: string
          status: number
          title: string | null
          updated_at: string | null
        }
        Insert: {
          column_order?: number
          created_at?: string | null
          creator_id: string
          description?: string | null
          id: string
          project_id: string
          status?: number
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          column_order?: number
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          project_id?: string
          status?: number
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
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
