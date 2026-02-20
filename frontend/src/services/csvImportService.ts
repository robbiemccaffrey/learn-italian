const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:9283/api';

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
   * Scan CSV folder
   */
  static async scanCSVFolder(): Promise<{
    success: boolean;
    files: Array<{ path: string; filename: string }>;
    count: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/csv-import/scan`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error scanning CSV folder:', error);
      throw error;
    }
  }

  /**
   * Preview CSV file
   */
  static async previewCSV(filename: string): Promise<{
    success: boolean;
    deckName: string;
    preview: FlashcardData[];
    totalRows: number;
    error?: string;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/csv-import/preview/${encodeURIComponent(filename)}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error previewing CSV:', error);
      throw error;
    }
  }

  /**
   * Import all CSV files
   */
  static async importAllCSV(): Promise<CSVImportSummary> {
    try {
      const response = await fetch(`${API_BASE_URL}/csv-import/import-all`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error importing all CSV files:', error);
      throw error;
    }
  }

  /**
   * Import specific CSV file
   */
  static async importCSV(filename: string): Promise<CSVImportResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/csv-import/import/${encodeURIComponent(filename)}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error importing CSV:', error);
      throw error;
    }
  }
}
