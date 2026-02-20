import fs from 'fs';
import path from 'path';

export interface MaterialMetadata {
  id: string;
  originalPath: string;
  filename: string;
  folder: string;
  type: 'image' | 'document' | 'pdf' | 'csv' | 'json' | 'other';
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  category?: string;
  context?: string[];
  tags?: string[];
}

export interface ProcessingProgress {
  status: 'pending' | 'scanning' | 'processing' | 'indexing' | 'completed' | 'error';
  currentStep: string;
  totalFiles: number;
  processedFiles: number;
  currentFile: string;
  errors: Array<{ file: string; error: string }>;
  estimatedTimeRemaining?: number;
  startTime?: Date;
  endTime?: Date;
}

export interface ProcessingResult {
  success: boolean;
  totalFiles: number;
  processedFiles: number;
  failedFiles: number;
  materials: MaterialMetadata[];
  errors: Array<{ file: string; error: string }>;
}

export class MaterialProcessingService {
  /**
   * Check if processing is needed by comparing folder modification time with index
   */
  static needsProcessing(
    materialsPath: string,
    indexPath: string
  ): boolean {
    try {
      // If index doesn't exist, need to process
      if (!fs.existsSync(indexPath)) {
        return true;
      }

      // If materials folder doesn't exist, no processing needed
      if (!fs.existsSync(materialsPath)) {
        return false;
      }

      // Check if materials folder is newer than index
      const indexModified = fs.statSync(indexPath).mtime;
      const materialsModified = fs.statSync(materialsPath).mtime;

      return materialsModified > indexModified;
    } catch (error) {
      console.error('Error checking processing needs:', error);
      return true; // If in doubt, process
    }
  }

  /**
   * Scan materials folder and build file inventory
   */
  static scanMaterialsFolder(materialsPath: string): MaterialMetadata[] {
    const materials: MaterialMetadata[] = [];

    if (!fs.existsSync(materialsPath)) {
      console.warn(`Materials folder not found: ${materialsPath}`);
      return materials;
    }

    const scanDirectory = (dir: string, relativePath: string = ''): void => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relativeFilePath = path.join(relativePath, entry.name);

          if (entry.isDirectory()) {
            // Recursively scan subdirectories
            scanDirectory(fullPath, relativeFilePath);
          } else if (entry.isFile()) {
            // Process file
            const stats = fs.statSync(fullPath);
            const ext = path.extname(entry.name).toLowerCase();
            const type = this.getFileType(ext);

            // Skip CSV files (handled separately by CSVImportService)
            if (type === 'csv') {
              continue;
            }

            const material: MaterialMetadata = {
              id: this.generateMaterialId(fullPath),
              originalPath: fullPath,
              filename: entry.name,
              folder: relativePath,
              type,
              size: stats.size,
              createdAt: stats.birthtime,
              modifiedAt: stats.mtime,
              category: this.inferCategory(relativePath),
              context: this.inferContext(relativePath, entry.name),
              tags: this.generateTags(relativePath, entry.name),
            };

            materials.push(material);
          }
        }
      } catch (error) {
        console.error(`Error scanning directory ${dir}:`, error);
      }
    };

    scanDirectory(materialsPath);
    return materials;
  }

  /**
   * Determine file type from extension
   */
  private static getFileType(ext: string): MaterialMetadata['type'] {
    const imageExts = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];
    const docExts = ['.docx', '.doc'];
    const pdfExts = ['.pdf'];
    const csvExts = ['.csv'];
    const jsonExts = ['.json'];

    if (imageExts.includes(ext)) return 'image';
    if (docExts.includes(ext)) return 'document';
    if (pdfExts.includes(ext)) return 'pdf';
    if (csvExts.includes(ext)) return 'csv';
    if (jsonExts.includes(ext)) return 'json';
    return 'other';
  }

  /**
   * Generate unique material ID from file path
   */
  private static generateMaterialId(filePath: string): string {
    // Use a hash of the file path as ID
    const hash = filePath.split('').reduce((acc, char) => {
      const hash = ((acc << 5) - acc) + char.charCodeAt(0);
      return hash & hash;
    }, 0);
    return `mat-${Math.abs(hash).toString(36)}`;
  }

  /**
   * Infer category from folder path
   */
  private static inferCategory(folderPath: string): string | undefined {
    const lowerPath = folderPath.toLowerCase();
    
    if (lowerPath.includes('grammar') || lowerPath.includes('verb')) {
      return 'grammar';
    }
    if (lowerPath.includes('vocabulary') || lowerPath.includes('theme')) {
      return 'vocabulary';
    }
    if (lowerPath.includes('exercise') || lowerPath.includes('practice')) {
      return 'exercise';
    }
    if (lowerPath.includes('conversation') || lowerPath.includes('dialogue')) {
      return 'conversation';
    }
    if (lowerPath.includes('culture') || lowerPath.includes('reading')) {
      return 'culture';
    }
    if (lowerPath.includes('reference') || lowerPath.includes('book')) {
      return 'reference';
    }
    if (lowerPath.includes('lesson')) {
      return 'lesson';
    }
    
    return undefined;
  }

  /**
   * Infer context from folder path and filename
   */
  private static inferContext(folderPath: string, filename: string): string[] {
    const contexts: string[] = [];
    const lowerPath = folderPath.toLowerCase();
    const lowerFilename = filename.toLowerCase();

    // Daily Life contexts
    if (lowerPath.includes('vocabulary') || lowerFilename.includes('food') || 
        lowerFilename.includes('restaurant') || lowerFilename.includes('shopping')) {
      contexts.push('daily-life');
    }

    // Communication contexts
    if (lowerPath.includes('conversation') || lowerPath.includes('dialogue') ||
        lowerPath.includes('exercise') || lowerFilename.includes('dialog')) {
      contexts.push('communication');
    }

    // Deep Dive contexts
    if (lowerPath.includes('grammar') || lowerPath.includes('vocabulary') ||
        lowerPath.includes('culture') || lowerPath.includes('reading')) {
      contexts.push('deep-dive');
    }

    // Resources contexts
    if (lowerPath.includes('reference') || lowerPath.includes('book') ||
        lowerPath.includes('lesson')) {
      contexts.push('resources');
    }

    // If no context found, assign based on category
    if (contexts.length === 0) {
      const category = this.inferCategory(folderPath);
      if (category === 'grammar' || category === 'vocabulary' || category === 'culture') {
        contexts.push('deep-dive');
      } else if (category === 'conversation' || category === 'exercise') {
        contexts.push('communication');
      } else if (category === 'reference' || category === 'lesson') {
        contexts.push('resources');
      }
    }

    return contexts.length > 0 ? contexts : ['deep-dive']; // Default to deep-dive
  }

  /**
   * Generate tags from folder path and filename
   */
  private static generateTags(folderPath: string, filename: string): string[] {
    const tags: string[] = [];
    const lowerPath = folderPath.toLowerCase();
    const lowerFilename = filename.toLowerCase();

    // Grammar tags
    if (lowerFilename.includes('passato') || lowerFilename.includes('imperfetto') ||
        lowerFilename.includes('futuro') || lowerFilename.includes('condizionale')) {
      tags.push('grammar');
    }

    // Verb tags
    if (lowerFilename.includes('verb') || lowerFilename.includes('coniug')) {
      tags.push('verbs');
    }

    // Vocabulary tags
    if (lowerFilename.includes('vocab') || lowerFilename.includes('word')) {
      tags.push('vocabulary');
    }

    // Theme tags
    const themes = ['food', 'restaurant', 'shopping', 'family', 'weather', 
                    'household', 'job', 'direction', 'reflexive'];
    for (const theme of themes) {
      if (lowerFilename.includes(theme)) {
        tags.push(theme);
      }
    }

    return tags;
  }

  /**
   * Process all materials (scan and organize)
   */
  static async processAllMaterials(options: {
    materialsPath: string;
    mode?: 'auto' | 'full' | 'incremental';
    onProgress?: (progress: ProcessingProgress) => void;
  }): Promise<ProcessingResult> {
    const startTime = new Date();
    const errors: Array<{ file: string; error: string }> = [];

    try {
      // Update progress: scanning
      options.onProgress?.({
        status: 'scanning',
        currentStep: 'Scanning materials folder',
        totalFiles: 0,
        processedFiles: 0,
        currentFile: '',
        errors: [],
        startTime,
      });

      // Scan folder
      const materials = this.scanMaterialsFolder(options.materialsPath);

      // Update progress: processing
      options.onProgress?.({
        status: 'processing',
        currentStep: 'Processing materials',
        totalFiles: materials.length,
        processedFiles: 0,
        currentFile: '',
        errors: [],
        startTime,
      });

      // For now, just return the scanned materials
      // Actual processing (OCR, text extraction) will be done by other services
      const endTime = new Date();

      options.onProgress?.({
        status: 'completed',
        currentStep: 'Completed',
        totalFiles: materials.length,
        processedFiles: materials.length,
        currentFile: '',
        errors,
        startTime,
        endTime,
      });

      return {
        success: true,
        totalFiles: materials.length,
        processedFiles: materials.length,
        failedFiles: errors.length,
        materials,
        errors,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push({ file: 'general', error: errorMessage });

      options.onProgress?.({
        status: 'error',
        currentStep: 'Error occurred',
        totalFiles: 0,
        processedFiles: 0,
        currentFile: '',
        errors,
        startTime,
        endTime: new Date(),
      });

      return {
        success: false,
        totalFiles: 0,
        processedFiles: 0,
        failedFiles: errors.length,
        materials: [],
        errors,
      };
    }
  }
}
