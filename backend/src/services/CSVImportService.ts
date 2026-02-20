import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface FlashcardData {
  front: string;
  back: string;
}

export interface CSVImportResult {
  deckName: string;
  filename: string;
  cardCount: number;
  cards: FlashcardData[];
  success: boolean;
  error?: string;
}

export interface CSVImportSummary {
  totalFiles: number;
  successful: number;
  failed: number;
  totalCards: number;
  results: CSVImportResult[];
}

export class CSVImportService {
  /**
   * Scan CSV folder and return list of CSV files
   */
  static scanCSVFolder(csvFolderPath: string): string[] {
    try {
      if (!fs.existsSync(csvFolderPath)) {
        console.warn(`CSV folder not found: ${csvFolderPath}`);
        return [];
      }

      const files = fs.readdirSync(csvFolderPath);
      return files
        .filter(file => file.toLowerCase().endsWith('.csv'))
        .map(file => path.join(csvFolderPath, file));
    } catch (error) {
      console.error('Error scanning CSV folder:', error);
      return [];
    }
  }

  /**
   * Parse a single CSV file and extract flashcard data
   */
  static parseCSVFile(filePath: string): CSVImportResult {
    const filename = path.basename(filePath);
    const deckName = this.generateDeckName(filename);

    try {
      // Read file content
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // Parse CSV with flexible options
      const records = parse(fileContent, {
        columns: true, // Use first line as column names
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true, // Handle inconsistent column counts
        quote: '"',
        escape: '"',
      });

      if (!records || records.length === 0) {
        return {
          deckName,
          filename,
          cardCount: 0,
          cards: [],
          success: false,
          error: 'No data found in CSV file',
        };
      }

      // Normalize column names (handle case variations)
      const normalizedRecords = records.map((record: any) => {
        const keys = Object.keys(record);
        const frontKey = keys.find(k => 
          k.toLowerCase() === 'front' || 
          k.toLowerCase() === 'english' ||
          k.toLowerCase() === 'question'
        );
        const backKey = keys.find(k => 
          k.toLowerCase() === 'back' || 
          k.toLowerCase() === 'italian' ||
          k.toLowerCase() === 'answer'
        );

        // If no standard keys found, use first two columns
        const finalFrontKey = frontKey || keys[0];
        const finalBackKey = backKey || keys[1];

        return {
          front: record[finalFrontKey] || '',
          back: record[finalBackKey] || '',
        };
      });

      // Filter out empty cards
      const validCards = normalizedRecords.filter(
        (card: FlashcardData) => card.front && card.back
      );

      return {
        deckName,
        filename,
        cardCount: validCards.length,
        cards: validCards,
        success: true,
      };
    } catch (error) {
      console.error(`Error parsing CSV file ${filename}:`, error);
      return {
        deckName,
        filename,
        cardCount: 0,
        cards: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Import all CSV files from the folder
   */
  static importAllCSVFiles(csvFolderPath: string): CSVImportSummary {
    const csvFiles = this.scanCSVFolder(csvFolderPath);
    const results: CSVImportResult[] = [];
    let totalCards = 0;
    let successful = 0;
    let failed = 0;

    for (const filePath of csvFiles) {
      const result = this.parseCSVFile(filePath);
      results.push(result);

      if (result.success) {
        successful++;
        totalCards += result.cardCount;
      } else {
        failed++;
      }
    }

    return {
      totalFiles: csvFiles.length,
      successful,
      failed,
      totalCards,
      results,
    };
  }

  /**
   * Preview a CSV file without importing
   */
  static previewCSVFile(filePath: string): {
    deckName: string;
    preview: FlashcardData[];
    totalRows: number;
    success: boolean;
    error?: string;
  } {
    const result = this.parseCSVFile(filePath);
    
    return {
      deckName: result.deckName,
      preview: result.cards.slice(0, 10), // First 10 cards as preview
      totalRows: result.cardCount,
      success: result.success,
      error: result.error,
    };
  }

  /**
   * Generate a clean deck name from filename
   */
  private static generateDeckName(filename: string): string {
    // Remove .csv extension
    let name = filename.replace(/\.csv$/i, '');
    
    // Remove common prefixes/suffixes
    name = name.replace(/^anki_/i, '');
    name = name.replace(/_anki$/i, '');
    
    // Replace underscores and hyphens with spaces
    name = name.replace(/[_-]/g, ' ');
    
    // Capitalize first letter of each word
    name = name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    return name || 'Imported Deck';
  }
}
