import { YouTubeService } from './YouTubeService';
import { VideoProcessingService } from './VideoProcessingService';
import { TranslationService } from './TranslationService';
import { CaptionProcessor } from '../utils/CaptionProcessor';

export interface VideoProcessingRequest {
  videoUrl: string;
  segmentDuration?: number;
  includeTranslation?: boolean;
}

export interface VideoProcessingResponse {
  success: boolean;
  data?: {
    videoId: string;
    title: string;
    duration: number;
    segments: VideoSegment[];
    captions: string;
    thumbnail: string;
  };
  error?: string;
}

export interface VideoSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  translation: string;
  audioUrl: string;
  videoUrl: string;
}

export class VideoService {
  static async processVideo(request: VideoProcessingRequest): Promise<VideoProcessingResponse> {
    try {
      // Extract video ID from URL
      const videoId = this.extractVideoId(request.videoUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      // Get video metadata
      const metadata = await YouTubeService.getVideoMetadata(videoId);
      
      // Extract captions
      const captions = await YouTubeService.extractCaptions(videoId, 'it');
      
      // Process captions into segments
      const captionData = CaptionProcessor.parseCaptions(captions);
      const segments = CaptionProcessor.createSegments(captionData, {
        segmentDuration: request.segmentDuration || 8,
        overlap: 1
      });

      // Add translations if requested
      if (request.includeTranslation) {
        for (const segment of segments) {
          try {
            segment.translation = await TranslationService.translate(segment.text, 'it', 'en');
          } catch (error) {
            console.warn(`Translation failed for segment ${segment.id}:`, error);
            segment.translation = '[Translation failed]';
          }
        }
      }

      // Process video segments (extract audio/video)
      await VideoProcessingService.processSegments(videoId, segments);

      // Generate URLs for processed segments
      const baseUrl = process.env.BACKEND_URL || 'http://localhost:3001';
      segments.forEach((segment) => {
        segment.audioUrl = `${baseUrl}/processed/audio/${videoId}_${segment.startTime}_${segment.endTime}.mp3`;
        segment.videoUrl = `${baseUrl}/processed/video/${videoId}_${segment.startTime}_${segment.endTime}.mp4`;
      });

      return {
        success: true,
        data: {
          videoId,
          title: metadata.title,
          duration: metadata.duration,
          segments,
          captions: captionData.map(c => c.text).join(' '),
          thumbnail: metadata.thumbnail
        }
      };
    } catch (error) {
      console.error('Video processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process video'
      };
    }
  }

  private static extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }
}
