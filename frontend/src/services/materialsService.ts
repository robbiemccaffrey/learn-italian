const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:9283/api';

export interface Material {
  id: string;
  filename: string;
  folder: string;
  type: 'image' | 'document' | 'pdf' | 'csv' | 'json' | 'other';
  category?: string;
  context?: string[];
  tags?: string[];
  extractedText?: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
}

export interface MaterialsResponse {
  materials: Material[];
  categories: { [key: string]: number };
  total: number;
}

export interface SearchResult {
  id: string;
  filename: string;
  context?: string[];
  category?: string;
  snippet?: string;
  relevanceScore: number;
  matchType: string;
}

class MaterialsService {
  /**
   * Check if materials are available
   */
  static async checkMaterialsAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/materials/available`);
      if (!response.ok) return false;
      
      const data = await response.json();
      return data.available === true;
    } catch (error) {
      console.error('Error checking materials availability:', error);
      return false;
    }
  }

  /**
   * Get all materials with optional filters
   */
  static async getMaterials(options?: {
    context?: string;
    category?: string;
    search?: string;
  }): Promise<MaterialsResponse> {
    try {
      const params = new URLSearchParams();
      if (options?.context) params.append('context', options.context);
      if (options?.category) params.append('category', options.category);
      if (options?.search) params.append('search', options.search);

      const url = `${API_BASE_URL}/materials${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
  }

  /**
   * Get material by ID
   */
  static async getMaterial(id: string): Promise<Material> {
    try {
      const response = await fetch(`${API_BASE_URL}/materials/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.material;
    } catch (error) {
      console.error('Error fetching material:', error);
      throw error;
    }
  }

  /**
   * Get material file URL
   */
  static getMaterialFileUrl(id: string): string {
    return `${API_BASE_URL}/materials/file/${id}`;
  }

  /**
   * Search materials
   */
  static async searchMaterials(
    query: string,
    context?: string
  ): Promise<{ results: SearchResult[]; total: number }> {
    try {
      const params = new URLSearchParams({ q: query });
      if (context) params.append('context', context);

      const response = await fetch(`${API_BASE_URL}/materials/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching materials:', error);
      throw error;
    }
  }

  /**
   * Get processing status
   */
  static async getProcessingStatus(): Promise<{
    hasIndex: boolean;
    materialCount: number;
    lastUpdated: Date | null;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/materials/status`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching processing status:', error);
      throw error;
    }
  }
}

export default MaterialsService;
export { Material, MaterialsResponse, SearchResult };
