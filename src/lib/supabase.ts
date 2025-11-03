import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DevelopmentProcess {
  id: string;
  title: string;
  phase: string;
  description: string;
  steps: { step: string; details: string }[];
  timeline: string;
  key_considerations: string;
  created_at: string;
  updated_at: string;
}

export interface TroubleshootingGuide {
  id: string;
  title: string;
  category: string;
  problem_description: string;
  root_causes: { cause: string; explanation: string }[];
  solutions: { solution: string; implementation?: string; details?: string }[];
  case_studies: string;
  created_at: string;
  updated_at: string;
}

export interface RegulatoryResource {
  id: string;
  title: string;
  region: string;
  document_type: string;
  summary: string;
  key_points: string[];
  url: string;
  effective_date: string;
  created_at: string;
  updated_at: string;
}
