import fs from 'fs';
import path from 'path';
import { MaterialMetadata } from './MaterialProcessingService';
import { OCRResult } from './OCRService';
import { DocumentTextResult } from './DocumentProcessingService';

export interface ProcessedMaterial extends MaterialMetadata {
  extractedText?: string;
  ocrResult?: OCRResult;
  documentResult?: DocumentTextResult;
  thumbnailPath?: string;
  processedAt: Date;
}

export interface MaterialIndex {
  version: string;
  lastUpdated: Date;
  materials: ProcessedMaterial[];
  categories: {
    [category: string]: string[];
  };
  contexts: {
    [context: string]: string[];
  };
  statistics: {
    totalMaterials: number;
    byType: {
      image: number;
      document: number;
      pdf: number;
      other: number;
    };
    byCategory: {
      [category: string]: number;
    };
  };
}

export class MaterialStorageService {
  private static indexPath: string = path.resolve(
    __dirname,
    '../materials/materials-index.json'
  );

  /**
   * Load material index from file
   */
  static loadIndex(): MaterialIndex | null {
    try {
      if (!fs.existsSync(this.indexPath)) {
        return null;
      }

      const data = fs.readFileSync(this.indexPath, 'utf-8');
      const index: MaterialIndex = JSON.parse(data);

      // Convert date strings back to Date objects
      index.lastUpdated = new Date(index.lastUpdated);
      index.materials = index.materials.map(mat => ({
        ...mat,
        createdAt: new Date(mat.createdAt),
        modifiedAt: new Date(mat.modifiedAt),
        processedAt: new Date(mat.processedAt),
      }));

      return index;
    } catch (error) {
      console.error('Error loading material index:', error);
      return null;
    }
  }

  /**
   * Save material index to file
   */
  static saveIndex(index: MaterialIndex): void {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.indexPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Convert to JSON (dates will be serialized)
      const json = JSON.stringify(index, null, 2);
      fs.writeFileSync(this.indexPath, json, 'utf-8');
    } catch (error) {
      console.error('Error saving material index:', error);
      throw error;
    }
  }

  /**
   * Create new material index
   */
  static createIndex(materials: ProcessedMaterial[]): MaterialIndex {
    const categories: { [category: string]: string[] } = {};
    const contexts: { [context: string]: string[] } = {};
    const byType = {
      image: 0,
      document: 0,
      pdf: 0,
      other: 0,
    };
    const byCategory: { [category: string]: number } = {};

    for (const material of materials) {
      // Organize by category
      if (material.category) {
        if (!categories[material.category]) {
          categories[material.category] = [];
        }
        categories[material.category].push(material.id);

        byCategory[material.category] = (byCategory[material.category] || 0) + 1;
      }

      // Organize by context
      if (material.context) {
        for (const context of material.context) {
          if (!contexts[context]) {
            contexts[context] = [];
          }
          contexts[context].push(material.id);
        }
      }

      // Count by type
      if (material.type === 'image') byType.image++;
      else if (material.type === 'document') byType.document++;
      else if (material.type === 'pdf') byType.pdf++;
      else byType.other++;
    }

    return {
      version: '1.0.0',
      lastUpdated: new Date(),
      materials,
      categories,
      contexts,
      statistics: {
        totalMaterials: materials.length,
        byType,
        byCategory,
      },
    };
  }

  /**
   * Add or update material in index
   */
  static addMaterial(material: ProcessedMaterial): void {
    const index = this.loadIndex() || this.createIndex([]);
    
    // Remove existing material with same ID
    index.materials = index.materials.filter(m => m.id !== material.id);
    
    // Add new material
    index.materials.push(material);
    
    // Rebuild index structure
    const newIndex = this.createIndex(index.materials);
    newIndex.lastUpdated = new Date();
    
    this.saveIndex(newIndex);
  }

  /**
   * Remove material from index
   */
  static removeMaterial(materialId: string): void {
    const index = this.loadIndex();
    if (!index) return;

    index.materials = index.materials.filter(m => m.id !== materialId);
    
    // Rebuild index structure
    const newIndex = this.createIndex(index.materials);
    newIndex.lastUpdated = new Date();
    
    this.saveIndex(newIndex);
  }

  /**
   * Get material by ID
   */
  static getMaterial(materialId: string): ProcessedMaterial | null {
    const index = this.loadIndex();
    if (!index) return null;

    return index.materials.find(m => m.id === materialId) || null;
  }

  /**
   * Search materials by query
   */
  static searchMaterials(query: string, context?: string): ProcessedMaterial[] {
    const index = this.loadIndex();
    if (!index) return [];

    const lowerQuery = query.toLowerCase();
    let results = index.materials;

    // Filter by context if provided
    if (context) {
      results = results.filter(m => m.context?.includes(context));
    }

    // Search in filename, extracted text, and tags
    results = results.filter(material => {
      const filenameMatch = material.filename.toLowerCase().includes(lowerQuery);
      const textMatch = material.extractedText?.toLowerCase().includes(lowerQuery);
      const tagMatch = material.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
      const categoryMatch = material.category?.toLowerCase().includes(lowerQuery);

      return filenameMatch || textMatch || tagMatch || categoryMatch;
    });

    return results;
  }

  /**
   * Get materials by context
   */
  static getMaterialsByContext(context: string): ProcessedMaterial[] {
    const index = this.loadIndex();
    if (!index) return [];

    return index.materials.filter(m => m.context?.includes(context));
  }

  /**
   * Get materials by category
   */
  static getMaterialsByCategory(category: string): ProcessedMaterial[] {
    const index = this.loadIndex();
    if (!index) return [];

    return index.materials.filter(m => m.category === category);
  }
}
