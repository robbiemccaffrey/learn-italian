import { createWorker, Worker } from 'tesseract.js';
import fs from 'fs';
import path from 'path';

export interface OCRResult {
  text: string;
  confidence: number;
  words: Array<{
    text: string;
    confidence: number;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>;
}

export class OCRService {
  private static worker: Worker | null = null;
  private static isInitialized = false;

  /**
   * Initialize Tesseract worker with Italian language
   */
  static async initialize(): Promise<void> {
    if (this.isInitialized && this.worker) {
      return;
    }

    try {
      this.worker = await createWorker('ita'); // Italian language
      this.isInitialized = true;
      console.log('✅ OCR Service initialized with Italian language');
    } catch (error) {
      console.error('Error initializing OCR service:', error);
      throw error;
    }
  }

  /**
   * Extract text from image file
   */
  static async extractTextFromImage(imagePath: string): Promise<OCRResult> {
    try {
      // Ensure worker is initialized
      if (!this.worker || !this.isInitialized) {
        await this.initialize();
      }

      if (!this.worker) {
        throw new Error('OCR worker not initialized');
      }

      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Image file not found: ${imagePath}`);
      }

      // Perform OCR
      const result = await this.worker.recognize(imagePath);
      const { text, confidence } = result.data;
      const words = (result.data as any).words || [];

      // Format words data
      const formattedWords = words.map((word: any) => ({
        text: word.text || '',
        confidence: word.confidence || 0,
        bbox: word.bbox || { x0: 0, y0: 0, x1: 0, y1: 0 },
      }));

      return {
        text: text.trim(),
        confidence: confidence || 0,
        words: formattedWords,
      };
    } catch (error) {
      console.error(`Error extracting text from image ${imagePath}:`, error);
      throw error;
    }
  }

  /**
   * Batch process multiple images
   */
  static async extractTextFromImages(
    imagePaths: string[],
    onProgress?: (current: number, total: number, currentFile: string) => void
  ): Promise<Map<string, OCRResult>> {
    const results = new Map<string, OCRResult>();

    // Initialize worker once
    await this.initialize();

    for (let i = 0; i < imagePaths.length; i++) {
      const imagePath = imagePaths[i];
      onProgress?.(i + 1, imagePaths.length, path.basename(imagePath));

      try {
        const result = await this.extractTextFromImage(imagePath);
        results.set(imagePath, result);
      } catch (error) {
        console.error(`Failed to process ${imagePath}:`, error);
        // Continue with other images even if one fails
        results.set(imagePath, {
          text: '',
          confidence: 0,
          words: [],
        });
      }
    }

    return results;
  }

  /**
   * Terminate OCR worker (cleanup)
   */
  static async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
      console.log('OCR Service terminated');
    }
  }
}
