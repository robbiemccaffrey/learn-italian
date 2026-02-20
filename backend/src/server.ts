import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { MaterialProcessingService } from './services/MaterialProcessingService';
import { MaterialStorageService } from './services/MaterialStorageService';
import { OCRService } from './services/OCRService';
import { DocumentProcessingService } from './services/DocumentProcessingService';

// Import routes
import videoRoutes from './routes/video';
import healthRoutes from './routes/health';
import chatGPTRoutes from './routes/chatgpt';
import csvImportRoutes from './routes/csvImport';
import materialsRoutes from './routes/materials';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8473;

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins: string[] = [
  'http://localhost:8474',
  'http://127.0.0.1:8474',
  'http://localhost:8475',
  'http://127.0.0.1:8475'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Static file serving for processed audio/video
app.use('/processed', express.static(path.join(__dirname, '../processed')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api', healthRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/chatgpt', chatGPTRoutes);
app.use('/api/csv-import', csvImportRoutes);
app.use('/api/materials', materialsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message || 'Something went wrong';

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Initialize materials processing on startup
async function initializeMaterials() {
  // Resolve path relative to project root
  const projectRoot = path.resolve(__dirname, '../..');
  const materialsPath = process.env.MATERIALS_PATH || 
    path.join(projectRoot, 'Italian Learning Materials');
  const indexPath = path.resolve(__dirname, '../materials/materials-index.json');

  try {
    const needsProcessing = MaterialProcessingService.needsProcessing(
      materialsPath,
      indexPath
    );

    if (needsProcessing) {
      console.log('📚 Materials detected - starting automatic processing...');
      
      // Start processing in background (non-blocking)
      MaterialProcessingService.processAllMaterials({
        materialsPath,
        mode: 'auto',
        onProgress: (progress) => {
          console.log(`Processing: ${progress.processedFiles}/${progress.totalFiles} - ${progress.currentStep}`);
        },
      }).then(async (result) => {
        if (result.success && result.materials.length > 0) {
          console.log(`📝 Processing ${result.materials.length} materials...`);
          
          // Process materials with OCR and document extraction
          const processedMaterials = [];

          for (const material of result.materials) {
            try {
              let extractedText = '';
              let ocrResult;
              let documentResult;

              if (material.type === 'image') {
                // Extract text with OCR
                try {
                  ocrResult = await OCRService.extractTextFromImage(material.originalPath);
                  extractedText = ocrResult.text;
                } catch (ocrError) {
                  console.warn(`OCR failed for ${material.filename}:`, ocrError);
                }
              } else if (material.type === 'document' || material.type === 'pdf') {
                // Extract text from document
                try {
                  documentResult = await DocumentProcessingService.extractTextFromDocument(
                    material.originalPath
                  );
                  extractedText = documentResult.text;
                } catch (docError) {
                  console.warn(`Document extraction failed for ${material.filename}:`, docError);
                }
              }

              processedMaterials.push({
                ...material,
                extractedText,
                ocrResult,
                documentResult,
                processedAt: new Date(),
              });
            } catch (error) {
              console.error(`Error processing ${material.filename}:`, error);
              // Continue with other materials
              processedMaterials.push({
                ...material,
                extractedText: '',
                processedAt: new Date(),
              });
            }
          }

          // Save to index
          const index = MaterialStorageService.createIndex(processedMaterials);
          MaterialStorageService.saveIndex(index);

          console.log(`✅ Materials processing complete! ${processedMaterials.length} materials processed.`);
        }
      }).catch((error) => {
        console.error('❌ Materials processing error:', error);
      });
    } else {
      console.log('✅ Materials index up to date');
    }
  } catch (error) {
    console.error('Error initializing materials:', error);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Italian Learning Backend running on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:8474'}`);
  
  // Initialize materials processing (non-blocking)
  initializeMaterials().catch(console.error);
});

export default app;
