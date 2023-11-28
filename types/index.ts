import type { Database } from './supabase';

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type FeatureRequest = Database['public']['Tables']['feature_requests']['Row'];