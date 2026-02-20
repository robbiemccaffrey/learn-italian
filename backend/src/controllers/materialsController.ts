import { Request, Response } from 'express';
import path from 'path';
import { MaterialProcessingService } from '../services/MaterialProcessingService';
import { MaterialStorageService } from '../services/MaterialStorageService';
import { OCRService } from '../services/OCRService';
import { DocumentProcessingService } from '../services/DocumentProcessingService';
import fs from 'fs';

/**
 * Check if materials are available
 */
export const checkMaterialsAvailable = async (req: Request, res: Response) => {
  try {
    const index = MaterialStorageService.loadIndex();
    const available = index !== null && index.materials.length > 0;

    res.json({
      available,
      processing: false, // Will be updated when processing is implemented
      materialCount: available ? index!.materials.length : 0,
    });
  } catch (error) {
    res.status(500).json({
      available: false,
      processing: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get all materials with optional filtering
 */
export const getMaterials = async (req: Request, res: Response) => {
  try {
    const { context, category, search } = req.query;
    const index = MaterialStorageService.loadIndex();

    if (!index) {
      return res.json({
        materials: [],
        categories: {},
        total: 0,
      });
    }

    let materials = index.materials;

    // Filter by context
    if (context && typeof context === 'string') {
      materials = materials.filter(m => m.context?.includes(context));
    }

    // Filter by category
    if (category && typeof category === 'string') {
      materials = materials.filter(m => m.category === category);
    }

    // Search
    if (search && typeof search === 'string') {
      materials = MaterialStorageService.searchMaterials(search, context as string);
    }

    // Group by sub-context for context pages
    const categories: { [key: string]: number } = {};
    for (const material of materials) {
      if (material.category) {
        categories[material.category] = (categories[material.category] || 0) + 1;
      }
    }

    return res.json({
      materials: materials.map(m => ({
        id: m.id,
        filename: m.filename,
        folder: m.folder,
        type: m.type,
        category: m.category,
        context: m.context,
        tags: m.tags,
        extractedText: m.extractedText?.substring(0, 500), // Preview only
        size: m.size,
        createdAt: m.createdAt,
        modifiedAt: m.modifiedAt,
      })),
      categories,
      total: materials.length,
    });
  } catch (error) {
    console.error('Error getting materials:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get material by ID
 */
export const getMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const material = MaterialStorageService.getMaterial(id);

    if (!material) {
      return res.status(404).json({
        error: 'Material not found',
      });
    }

    return res.json({
      success: true,
      material,
    });
  } catch (error) {
    console.error('Error getting material:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get material file (serve original file)
 */
export const getMaterialFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const material = MaterialStorageService.getMaterial(id);

    if (!material) {
      return res.status(404).json({
        error: 'Material not found',
      });
    }

    // Security check: ensure file is within materials folder
    const projectRoot = path.resolve(__dirname, '../../..');
    const materialsPath = process.env.MATERIALS_PATH || 
      path.join(projectRoot, 'Italian Learning Materials');
    const filePath = path.resolve(material.originalPath);

    if (!filePath.startsWith(path.resolve(materialsPath))) {
      return res.status(403).json({
        error: 'Access denied',
      });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File not found',
      });
    }

    // Send file
    return res.sendFile(filePath);
  } catch (error) {
    console.error('Error getting material file:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Search materials
 */
export const searchMaterials = async (req: Request, res: Response) => {
  try {
    const { q, context } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        error: 'Search query required',
      });
    }

    const results = MaterialStorageService.searchMaterials(
      q,
      context as string | undefined
    );

    return res.json({
      results: results.map(m => ({
        id: m.id,
        filename: m.filename,
        context: m.context,
        category: m.category,
        snippet: m.extractedText?.substring(0, 200),
        relevanceScore: 1.0, // Simple implementation
        matchType: 'extractedText',
      })),
      total: results.length,
    });
  } catch (error) {
    console.error('Error searching materials:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get processing status
 */
export const getProcessingStatus = async (req: Request, res: Response) => {
  try {
    const index = MaterialStorageService.loadIndex();
    
    return res.json({
      hasIndex: index !== null,
      materialCount: index?.materials.length || 0,
      lastUpdated: index?.lastUpdated || null,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Trigger material processing
 */
export const processMaterials = async (req: Request, res: Response) => {
  try {
    const projectRoot = path.resolve(__dirname, '../../..');
    const materialsPath = process.env.MATERIALS_PATH || 
      path.join(projectRoot, 'Italian Learning Materials');

    // Start processing in background
    MaterialProcessingService.processAllMaterials({
      materialsPath,
      mode: 'auto',
      onProgress: (progress) => {
        console.log(`Processing: ${progress.processedFiles}/${progress.totalFiles}`);
      },
    }).then(async (result) => {
      // Process materials with OCR and document extraction
      const processedMaterials = [];

      for (const material of result.materials) {
        try {
          let extractedText = '';
          let ocrResult;
          let documentResult;

          if (material.type === 'image') {
            // Extract text with OCR
            ocrResult = await OCRService.extractTextFromImage(material.originalPath);
            extractedText = ocrResult.text;
          } else if (material.type === 'document' || material.type === 'pdf') {
            // Extract text from document
            documentResult = await DocumentProcessingService.extractTextFromDocument(
              material.originalPath
            );
            extractedText = documentResult.text;
          }

          processedMaterials.push({
            ...material,
            extractedText,
            ocrResult,
            documentResult,
            processedAt: new Date(),
          });
        } catch (error) {
          console.error(`Error processing ${material.filename}:`, error);
          // Continue with other materials
          processedMaterials.push({
            ...material,
            extractedText: '',
            processedAt: new Date(),
          });
        }
      }

      // Save to index
      const index = MaterialStorageService.createIndex(processedMaterials);
      MaterialStorageService.saveIndex(index);

      console.log('✅ Materials processing complete!');
    }).catch((error) => {
      console.error('❌ Materials processing error:', error);
    });

    res.json({
      success: true,
      message: 'Processing started',
    });
  } catch (error) {
    console.error('Error starting material processing:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
