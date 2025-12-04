import express from 'express';
import { healthCheck, getSystemInfo } from '../controllers/healthController';

const router = express.Router();

// Health check endpoint
router.get('/health', healthCheck);

// System information endpoint
router.get('/system', getSystemInfo);

export default router;


