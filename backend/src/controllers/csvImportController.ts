import { Request, Response } from 'express';
import path from 'path';
import { CSVImportService, CSVImportResult } from '../services/CSVImportService';

/**
 * Scan CSV folder and return list of available CSV files
 */
export const scanCSVFolder = async (req: Request, res: Response) => {
  try {
    // Resolve path relative to project root, not dist folder
    const projectRoot = path.resolve(__dirname, '../../..');
    const materialsPath = process.env.MATERIALS_PATH || 
      path.join(projectRoot, 'Italian Learning Materials');
    const csvFolderPath = path.join(materialsPath, '4. Flashcards - Anki CSV');

    const csvFiles = CSVImportService.scanCSVFolder(csvFolderPath);

    res.json({
      success: true,
      files: csvFiles.map(file => ({
        path: file,
        filename: path.basename(file),
      })),
      count: csvFiles.length,
    });
  } catch (error) {
    console.error('Error scanning CSV folder:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Preview a CSV file before importing
 */
export const previewCSV = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const projectRoot = path.resolve(__dirname, '../../..');
    const materialsPath = process.env.MATERIALS_PATH || 
      path.join(projectRoot, 'Italian Learning Materials');
    const csvFolderPath = path.join(materialsPath, '4. Flashcards - Anki CSV');
    const filePath = path.join(csvFolderPath, filename);

    if (!filePath.startsWith(csvFolderPath)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file path',
      });
    }

    const preview = CSVImportService.previewCSVFile(filePath);

    return res.json({
      ...preview,
    });
  } catch (error) {
    console.error('Error previewing CSV:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Import all CSV files
 */
export const importAllCSV = async (req: Request, res: Response) => {
  try {
    const projectRoot = path.resolve(__dirname, '../../..');
    const materialsPath = process.env.MATERIALS_PATH || 
      path.join(projectRoot, 'Italian Learning Materials');
    const csvFolderPath = path.join(materialsPath, '4. Flashcards - Anki CSV');

    const summary = CSVImportService.importAllCSVFiles(csvFolderPath);

    res.json({
      success: true,
      ...summary,
    });
  } catch (error) {
    console.error('Error importing CSV files:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Import a specific CSV file
 */
export const importCSV = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const projectRoot = path.resolve(__dirname, '../../..');
    const materialsPath = process.env.MATERIALS_PATH || 
      path.join(projectRoot, 'Italian Learning Materials');
    const csvFolderPath = path.join(materialsPath, '4. Flashcards - Anki CSV');
    const filePath = path.join(csvFolderPath, filename);

    if (!filePath.startsWith(csvFolderPath)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file path',
      });
    }

    const result = CSVImportService.parseCSVFile(filePath);

    return res.json({
      ...result,
    });
  } catch (error) {
    console.error('Error importing CSV:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
