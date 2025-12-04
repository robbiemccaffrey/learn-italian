import { Request, Response } from 'express';
import { VideoService } from '../services/VideoService';
import { YouTubeService } from '../services/YouTubeService';
import { TranslationService } from '../services/TranslationService';
import { VideoProcessingService } from '../services/VideoProcessingService';

// Process video endpoint
export const processVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoUrl, segmentDuration = 8, includeTranslation = true } = req.body;

    if (!videoUrl) {
      res.status(400).json({
        success: false,
        error: 'Video URL is required'
      });
      return;
    }

    const result = await VideoService.processVideo({
      videoUrl,
      segmentDuration,
      includeTranslation
    });

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Video processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process video'
    });
  }
};

// Get video metadata
export const getVideoMetadata = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;
    const metadata = await YouTubeService.getVideoMetadata(videoId);
    res.json(metadata);
  } catch (error) {
    console.error('Metadata error:', error);
    res.status(500).json({
      error: 'Failed to fetch video metadata'
    });
  }
};

// Extract captions
export const extractCaptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;
    const { language = 'it' } = req.query;
    
    const captions = await YouTubeService.extractCaptions(videoId, language as string);
    res.json({
      videoId,
      language,
      captions
    });
  } catch (error) {
    console.error('Caption extraction error:', error);
    res.status(500).json({
      error: 'Failed to extract captions'
    });
  }
};

// Get video segment
export const getVideoSegment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId, segmentId } = req.params;
    
    // In a real implementation, this would serve the processed audio/video segment
    const segmentUrl = await VideoProcessingService.getSegmentUrl(videoId, segmentId);
    
    res.json({
      videoId,
      segmentId,
      audioUrl: segmentUrl.audio,
      videoUrl: segmentUrl.video
    });
  } catch (error) {
    console.error('Segment retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve video segment'
    });
  }
};

// Translate text
export const translateText = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, targetLang = 'en', sourceLang = 'it' } = req.body;

    if (!text) {
      res.status(400).json({
        error: 'Text is required for translation'
      });
      return;
    }

    const translation = await TranslationService.translate(text, sourceLang, targetLang);
    
    res.json({
      originalText: text,
      translatedText: translation,
      sourceLang,
      targetLang
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      error: 'Failed to translate text'
    });
  }
};

// Get video processing progress
export const getVideoProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;
    const progress = await VideoProcessingService.getProgress(videoId);
    
    res.json({
      videoId,
      progress
    });
  } catch (error) {
    console.error('Progress retrieval error:', error);
    res.status(500).json({
      error: 'Failed to get processing progress'
    });
  }
};


