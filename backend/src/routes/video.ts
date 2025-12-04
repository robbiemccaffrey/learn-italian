import express from 'express';
import multer from 'multer';
import { 
  processVideo, 
  getVideoMetadata, 
  extractCaptions, 
  getVideoSegment,
  translateText,
  getVideoProgress
} from '../controllers/videoController';
import { validateVideoUrl, validateSegmentRequest } from '../middleware/validation';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: process.env.UPLOAD_DIR || './uploads',
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

// Video processing routes
router.post('/process', validateVideoUrl, processVideo);
router.get('/metadata/:videoId', getVideoMetadata);
router.get('/captions/:videoId', extractCaptions);
router.get('/segment/:videoId/:segmentId', validateSegmentRequest, getVideoSegment);
router.post('/translate', translateText);
router.get('/progress/:videoId', getVideoProgress);

// File upload route (for future use)
router.post('/upload', upload.single('video'), (req, res) => {
  res.json({
    success: true,
    message: 'Video uploaded successfully',
    file: req.file
  });
});

export default router;
