import express from 'express';
import { translate, generatePhrase } from '../controllers/chatGPTController';

const router = express.Router();

router.post('/translate', translate);
router.post('/generate-phrase', generatePhrase);

export default router;

