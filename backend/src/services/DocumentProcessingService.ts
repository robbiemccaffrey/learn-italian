import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
// PDF parsing - lazy loaded to avoid DOMMatrix issues
let pdfParse: any = null;
try {
  pdfParse = require('pdf-parse');
} catch (e) {
  console.warn('PDF parsing not available:', e);
}

export interface DocumentTextResult {
  text: string;
  structured?: {
    headings: string[];
    paragraphs: string[];
    lists: string[][];
  };
  metadata?: {
    title?: string;
    author?: string;
    pages?: number;
  };
}

export class DocumentProcessingService {
  /**
   * Extract text from DOCX file
   */
  static async extractTextFromDOCX(docxPath: string): Promise<DocumentTextResult> {
    try {
      if (!fs.existsSync(docxPath)) {
        throw new Error(`DOCX file not found: ${docxPath}`);
      }

      const buffer = fs.readFileSync(docxPath);
      const result = await mammoth.extractRawText({ buffer });

      // Try to extract structured content
      const htmlResult = await mammoth.convertToHtml({ buffer });
      const headings: string[] = [];
      const paragraphs: string[] = [];
      const lists: string[][] = [];

      // Simple parsing of HTML to extract structure
      // This is a basic implementation - can be enhanced
      const html = htmlResult.value;
      const headingMatches = html.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi);
      if (headingMatches) {
        headings.push(...headingMatches.map(h => h.replace(/<[^>]*>/g, '').trim()));
      }

      const paragraphMatches = html.match(/<p[^>]*>(.*?)<\/p>/gi);
      if (paragraphMatches) {
        paragraphs.push(...paragraphMatches.map(p => p.replace(/<[^>]*>/g, '').trim()));
      }

      return {
        text: result.value.trim(),
        structured: {
          headings,
          paragraphs,
          lists,
        },
      };
    } catch (error) {
      console.error(`Error extracting text from DOCX ${docxPath}:`, error);
      throw error;
    }
  }

  /**
   * Extract text from PDF file
   */
  static async extractTextFromPDF(pdfPath: string): Promise<DocumentTextResult> {
    try {
      if (!fs.existsSync(pdfPath)) {
        throw new Error(`PDF file not found: ${pdfPath}`);
      }

      if (!pdfParse) {
        // PDF parsing not available - return basic info
        return {
          text: `[PDF file: ${path.basename(pdfPath)} - PDF parsing not available]`,
          structured: {
            headings: [],
            paragraphs: [],
            lists: [],
          },
          metadata: {
            pages: 0,
          },
        };
      }

      const buffer = fs.readFileSync(pdfPath);
      const data = await pdfParse(buffer);

      // Extract metadata if available
      const metadata: DocumentTextResult['metadata'] = {};
      if (data.info) {
        if (data.info.Title) metadata.title = data.info.Title;
        if (data.info.Author) metadata.author = data.info.Author;
      }
      metadata.pages = data.numpages;

      // Split text into paragraphs
      const paragraphs = data.text
        .split(/\n\s*\n/)
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0);

      // Try to identify headings (lines that are short and followed by paragraphs)
      const headings: string[] = [];
      for (let i = 0; i < paragraphs.length; i++) {
        const para = paragraphs[i];
        // Simple heuristic: short lines might be headings
        if (para.length < 100 && para.split(' ').length < 10) {
          headings.push(para);
        }
      }

      return {
        text: data.text.trim(),
        structured: {
          headings,
          paragraphs,
          lists: [],
        },
        metadata,
      };
    } catch (error) {
      console.error(`Error extracting text from PDF ${pdfPath}:`, error);
      throw error;
    }
  }

  /**
   * Extract text from document (auto-detect type)
   */
  static async extractTextFromDocument(
    documentPath: string
  ): Promise<DocumentTextResult> {
    const ext = path.extname(documentPath).toLowerCase();

    if (ext === '.docx' || ext === '.doc') {
      return this.extractTextFromDOCX(documentPath);
    } else if (ext === '.pdf') {
      return this.extractTextFromPDF(documentPath);
    } else {
      throw new Error(`Unsupported document type: ${ext}`);
    }
  }

  /**
   * Batch process multiple documents
   */
  static async extractTextFromDocuments(
    documentPaths: string[],
    onProgress?: (current: number, total: number, currentFile: string) => void
  ): Promise<Map<string, DocumentTextResult>> {
    const results = new Map<string, DocumentTextResult>();

    for (let i = 0; i < documentPaths.length; i++) {
      const docPath = documentPaths[i];
      onProgress?.(i + 1, documentPaths.length, path.basename(docPath));

      try {
        const result = await this.extractTextFromDocument(docPath);
        results.set(docPath, result);
      } catch (error) {
        console.error(`Failed to process ${docPath}:`, error);
        // Continue with other documents even if one fails
        results.set(docPath, {
          text: '',
          structured: {
            headings: [],
            paragraphs: [],
            lists: [],
          },
        });
      }
    }

    return results;
  }
}
