import express from 'express';
import {
  scanCSVFolder,
  previewCSV,
  importAllCSV,
  importCSV,
} from '../controllers/csvImportController';

const router = express.Router();

// Scan CSV folder
router.get('/scan', scanCSVFolder);

// Preview CSV file before importing
router.get('/preview/:filename', previewCSV);

// Import all CSV files
router.post('/import-all', importAllCSV);

// Import specific CSV file
router.post('/import/:filename', importCSV);

export default router;
