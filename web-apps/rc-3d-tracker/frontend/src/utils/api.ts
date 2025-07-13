// API utility functions for RC 3D Tracker

import { 
  Project, 
  Component, 
  Part, 
  ProjectSummary, 
  ComponentStats, 
  PartStats,
  ApiResponse,
  CreateProjectData,
  CreateComponentData,
  CreatePartData,
  BulkUpdateData
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Generic API request function
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const config = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Project API functions
export const projectApi = {
  // Get all projects
  getAll: (): Promise<ApiResponse<Project[]>> => 
    apiRequest<Project[]>('/projects'),
  
  // Get project by ID
  getById: (id: number): Promise<ApiResponse<Project>> => 
    apiRequest<Project>(`/projects/${id}`),
  
  // Get project summary
  getSummary: (id: number): Promise<ApiResponse<ProjectSummary>> => 
    apiRequest<ProjectSummary>(`/projects/${id}/summary`),
  
  // Create new project
  create: (data: CreateProjectData): Promise<ApiResponse<Project>> => 
    apiRequest<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Update project
  update: (id: number, data: CreateProjectData): Promise<ApiResponse<Project>> => 
    apiRequest<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Delete project
  delete: (id: number): Promise<ApiResponse<null>> => 
    apiRequest<null>(`/projects/${id}`, {
      method: 'DELETE',
    }),
  
  // Get aircraft models
  getAircraftModels: (): Promise<ApiResponse<string[]>> => 
    apiRequest<string[]>('/projects/aircraft-models'),
};

// Component API functions
export const componentApi = {
  // Get all components for a project
  getByProjectId: (projectId: number): Promise<ApiResponse<Component[]>> => 
    apiRequest<Component[]>(`/projects/${projectId}/components`),
  
  // Get component statistics
  getStats: (projectId: number): Promise<ApiResponse<ComponentStats>> => 
    apiRequest<ComponentStats>(`/projects/${projectId}/components/stats`),
  
  // Get component by ID
  getById: (id: number): Promise<ApiResponse<Component>> => 
    apiRequest<Component>(`/components/${id}`),
  
  // Create new component
  create: (projectId: number, data: CreateComponentData): Promise<ApiResponse<Component>> => 
    apiRequest<Component>(`/projects/${projectId}/components`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Update component
  update: (id: number, data: CreateComponentData): Promise<ApiResponse<Component>> => 
    apiRequest<Component>(`/components/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Toggle purchased status
  togglePurchased: (id: number): Promise<ApiResponse<Component>> => 
    apiRequest<Component>(`/components/${id}/toggle-purchased`, {
      method: 'PATCH',
    }),
  
  // Delete component
  delete: (id: number): Promise<ApiResponse<null>> => 
    apiRequest<null>(`/components/${id}`, {
      method: 'DELETE',
    }),
  
  // Bulk update purchased status
  bulkUpdatePurchased: (data: BulkUpdateData): Promise<ApiResponse<{ updated_count: number }>> => 
    apiRequest<{ updated_count: number }>('/components/bulk-update-purchased', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Part API functions
export const partApi = {
  // Get all parts for a project
  getByProjectId: (
    projectId: number, 
    sortByTime?: boolean, 
    ascending?: boolean
  ): Promise<ApiResponse<Part[]>> => {
    const params = new URLSearchParams();
    if (sortByTime) params.append('sort_by_time', 'true');
    if (ascending !== undefined) params.append('ascending', ascending.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<Part[]>(`/projects/${projectId}/parts${query}`);
  },
  
  // Get part statistics
  getStats: (projectId: number): Promise<ApiResponse<PartStats>> => 
    apiRequest<PartStats>(`/projects/${projectId}/parts/stats`),
  
  // Get remaining print time
  getRemainingTime: (projectId: number): Promise<ApiResponse<{ remaining_time: number }>> => 
    apiRequest<{ remaining_time: number }>(`/projects/${projectId}/parts/remaining-time`),
  
  // Get part by ID
  getById: (id: number): Promise<ApiResponse<Part>> => 
    apiRequest<Part>(`/parts/${id}`),
  
  // Create new part
  create: (projectId: number, data: CreatePartData): Promise<ApiResponse<Part>> => 
    apiRequest<Part>(`/projects/${projectId}/parts`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Update part
  update: (id: number, data: CreatePartData): Promise<ApiResponse<Part>> => 
    apiRequest<Part>(`/parts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Toggle printed status
  togglePrinted: (id: number): Promise<ApiResponse<Part>> => 
    apiRequest<Part>(`/parts/${id}/toggle-printed`, {
      method: 'PATCH',
    }),
  
  // Delete part
  delete: (id: number): Promise<ApiResponse<null>> => 
    apiRequest<null>(`/parts/${id}`, {
      method: 'DELETE',
    }),
  
  // Bulk update printed status
  bulkUpdatePrinted: (data: BulkUpdateData): Promise<ApiResponse<{ updated_count: number }>> => 
    apiRequest<{ updated_count: number }>('/parts/bulk-update-printed', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

