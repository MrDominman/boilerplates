// Type definitions for RC 3D Tracker

export interface Project {
  id: number;
  name: string;
  aircraft_model: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Component {
  id: number;
  project_id: number;
  name: string;
  quantity: number;
  purchased: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Part {
  id: number;
  project_id: number;
  name: string;
  estimated_print_time: number;
  estimated_weight: number;
  printed: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectSummary {
  project: Project;
  components: {
    total: number;
    purchased: number;
    progress: number;
  };
  parts: {
    total: number;
    printed: number;
    progress: number;
    total_print_time: number;
    total_weight: number;
  };
}

export interface ComponentStats {
  total: number;
  purchased: number;
  total_quantity: number;
  purchased_quantity: number;
  progress: number;
  quantity_progress: number;
}

export interface PartStats {
  total: number;
  printed: number;
  total_print_time: number;
  total_weight: number;
  printed_time: number;
  printed_weight: number;
  progress: number;
  time_progress: number;
  weight_progress: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: any[];
}

export interface CreateProjectData {
  name: string;
  aircraft_model: string;
  description?: string;
}

export interface CreateComponentData {
  name: string;
  quantity: number;
  purchased?: boolean;
  notes?: string;
}

export interface CreatePartData {
  name: string;
  estimated_print_time: number;
  estimated_weight: number;
  printed?: boolean;
  notes?: string;
}

export interface BulkUpdateData {
  ids: number[];
  purchased?: boolean;
  printed?: boolean;
}

// Common aircraft models
export const AIRCRAFT_MODELS = [
  'F-35', 'F-16', 'F-18', 'F-22', 'A-10', 'B-2', 'B-52',
  'A330-300', 'A380', 'Boeing 737', 'Boeing 747', 'Boeing 777', 'Boeing 787',
  'Cessna 172', 'Piper Cherokee', 'Beechcraft Bonanza',
  'P-51 Mustang', 'Spitfire', 'Corsair', 'Zero', 'Bf-109',
  'Custom', 'Other'
] as const;

export type AircraftModel = typeof AIRCRAFT_MODELS[number];

