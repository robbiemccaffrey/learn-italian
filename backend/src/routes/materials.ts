import express from 'express';
import {
  checkMaterialsAvailable,
  getMaterials,
  getMaterial,
  getMaterialFile,
  searchMaterials,
  getProcessingStatus,
  processMaterials,
} from '../controllers/materialsController';

const router = express.Router();

// Specific routes must come before parameterized routes
// Check if materials are available
router.get('/available', checkMaterialsAvailable);

// Search materials
router.get('/search', searchMaterials);

// Get processing status
router.get('/status', getProcessingStatus);

// Get material file (serve original file)
router.get('/file/:id', getMaterialFile);

// Trigger material processing
router.post('/process', processMaterials);

// Get all materials (with optional filters)
router.get('/', getMaterials);

// Get material by ID (must be last)
router.get('/:id', getMaterial);

export default router;
