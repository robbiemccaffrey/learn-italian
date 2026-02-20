import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { VideoSegment } from './VideoService';

// Import yt-dlp-wrap for real YouTube video processing (more reliable than ytdl-core)
const YTDlpWrap = require('yt-dlp-wrap').default;

export interface ProcessingProgress {
  videoId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  currentSegment?: number;
  totalSegments?: number;
  error?: string;
  startTime?: Date;
  endTime?: Date;
}

export class VideoProcessingService {
  private static progressMap = new Map<string, ProcessingProgress>();
  private static processedDir = process.env.PROCESSED_DIR || './processed';

  static async processSegments(videoId: string, segments: VideoSegment[]): Promise<void> {
    const progressId = `${videoId}_${Date.now()}`;
    
    // Initialize progress tracking
    this.progressMap.set(progressId, {
      videoId,
      status: 'pending',
      progress: 0,
      totalSegments: segments.length,
      startTime: new Date()
    });

    try {
      // Ensure processed directories exist
      await this.ensureDirectories();

      // Update status to processing
      this.updateProgress(progressId, { status: 'processing' });

      // Process each segment
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        
        this.updateProgress(progressId, {
          currentSegment: i + 1,
          progress: Math.round((i / segments.length) * 100)
        });

        await this.processSegment(videoId, segment);
      }

      // Mark as completed
      this.updateProgress(progressId, {
        status: 'completed',
        progress: 100,
        endTime: new Date()
      });

    } catch (error) {
      console.error(`Video processing failed for ${videoId}:`, error);
      
      this.updateProgress(progressId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private static async processSegment(videoId: string, segment: VideoSegment, retryCount: number = 0): Promise<void> {
    const audioOutputPath = path.join(
      this.processedDir,
      'audio',
      `${videoId}_${segment.startTime}_${segment.endTime}.mp3`
    );

    const videoOutputPath = path.join(
      this.processedDir,
      'video',
      `${videoId}_${segment.startTime}_${segment.endTime}.mp4`
    );

    console.log(`Processing segment ${segment.id} for video ${videoId} (${segment.startTime}s - ${segment.endTime}s)`);
    
    try {
      // Try to get the actual YouTube video stream URL
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      
      // Use yt-dlp for more reliable YouTube processing
      console.log(`Processing with yt-dlp for ${videoId}`);
      
      const ytDlpWrap = new YTDlpWrap();
      
      try {
        // Get video info first
        const info = await ytDlpWrap.getVideoInfo(videoUrl);
        
        if (!info) {
          throw new Error('Could not get video info');
        }
        
        console.log(`Video info retrieved for ${videoId}: ${info.title}`);
        
        // Extract audio segment with more robust parameters
        const audioArgs = [
          '--extractor-args', 'youtube:player_client=android,web',
          '--user-agent', 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
          '-f', 'bestaudio[ext=m4a]/bestaudio/best',
          '--extract-audio',
          '--audio-format', 'mp3',
          '--audio-quality', '0',
          '--external-downloader', 'ffmpeg',
          '--external-downloader-args', `ffmpeg:-ss ${segment.startTime} -t ${segment.endTime - segment.startTime}`,
          '-o', audioOutputPath.replace('.m4a', '.mp3'),
          '--no-check-certificates',
          '--ignore-errors',
          videoUrl
        ];
        
        console.log(`Running yt-dlp with args: ${audioArgs.join(' ')}`);
        await ytDlpWrap.execPromise(audioArgs);
        console.log(`Audio segment extracted for segment ${segment.id}`);
        
        // Extract video segment with more robust parameters
        const videoArgs = [
          '--extractor-args', 'youtube:player_client=android,web',
          '--user-agent', 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
          '-f', 'best[height<=720]/best',
          '--external-downloader', 'ffmpeg',
          '--external-downloader-args', `ffmpeg:-ss ${segment.startTime} -t ${segment.endTime - segment.startTime}`,
          '-o', videoOutputPath.replace('.mp4', '.%(ext)s'),
          '--no-check-certificates',
          '--ignore-errors',
          videoUrl
        ];
        
        console.log(`Running yt-dlp with args: ${videoArgs.join(' ')}`);
        await ytDlpWrap.execPromise(videoArgs);
        console.log(`Video segment extracted for segment ${segment.id}`);
        
        console.log(`Successfully processed segment ${segment.id} with yt-dlp`);
        
      } catch (ytDlpError) {
        const errorMessage = ytDlpError instanceof Error ? ytDlpError.message : 'Unknown yt-dlp error';
        console.warn(`yt-dlp error for ${videoId}:`, errorMessage);
        throw new Error(`yt-dlp processing error: ${errorMessage}`);
      }

    } catch (error) {
      const maxRetries = 3;
      
      if (retryCount < maxRetries) {
        console.warn(`YouTube processing failed for ${segment.id}, retrying (${retryCount + 1}/${maxRetries}):`, error);
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
        return this.processSegment(videoId, segment, retryCount + 1);
      } else {
        console.error(`YouTube processing failed for ${segment.id} after ${maxRetries} retries:`, error);
        throw error; // Don't fall back to mock files - fail the request
      }
    }
  }

  private static async extractAudioSegment(
    videoUrl: string, 
    segment: VideoSegment, 
    outputPath: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoUrl)
        .seekInput(segment.startTime)
        .duration(segment.endTime - segment.startTime)
        .audioCodec('aac') // Use AAC instead of MP3
        .audioBitrate('128k')
        .audioFrequency(44100)
        .audioChannels(2)
        .format('mp4') // Use MP4 container for AAC
        .on('start', (commandLine) => {
          console.log('Audio extraction started:', commandLine);
        })
        .on('progress', (progress) => {
          console.log(`Audio processing: ${progress.percent}% done`);
        })
        .on('end', () => {
          console.log('Audio extraction finished');
          resolve();
        })
        .on('error', (err) => {
          console.error('Audio extraction error:', err);
          reject(err);
        })
        .save(outputPath.replace('.mp3', '.m4a')); // Save as M4A instead of MP3
    });
  }

  private static async extractVideoSegment(
    videoUrl: string, 
    segment: VideoSegment, 
    outputPath: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoUrl)
        .seekInput(segment.startTime)
        .duration(segment.endTime - segment.startTime)
        .videoCodec('libx264')
        .audioCodec('aac')
        .size('640x480')
        .videoBitrate('1000k')
        .audioBitrate('128k')
        .on('start', (commandLine) => {
          console.log('Video extraction started:', commandLine);
        })
        .on('progress', (progress) => {
          console.log(`Video processing: ${progress.percent}% done`);
        })
        .on('end', () => {
          console.log('Video extraction finished');
          resolve();
        })
        .on('error', (err) => {
          console.error('Video extraction error:', err);
          reject(err);
        })
        .save(outputPath);
    });
  }


  static async getSegmentUrl(videoId: string, segmentId: string): Promise<{
    audio: string;
    video: string;
  }> {
    // In a real implementation, you would look up the actual segment files
    // For now, return mock URLs with correct extensions
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:8473';
    
    return {
      audio: `${baseUrl}/processed/audio/${videoId}_segment_${segmentId}.m4a`,
      video: `${baseUrl}/processed/video/${videoId}_segment_${segmentId}.mp4`
    };
  }

  static async getProgress(videoId: string): Promise<ProcessingProgress | null> {
    // Find the most recent progress for this video
    for (const [key, progress] of this.progressMap.entries()) {
      if (progress.videoId === videoId) {
        return progress;
      }
    }
    return null;
  }

  private static updateProgress(progressId: string, updates: Partial<ProcessingProgress>): void {
    const current = this.progressMap.get(progressId);
    if (current) {
      this.progressMap.set(progressId, { ...current, ...updates });
    }
  }

  private static async ensureDirectories(): Promise<void> {
    const audioDir = path.join(this.processedDir, 'audio');
    const videoDir = path.join(this.processedDir, 'video');

    try {
      await fs.mkdir(audioDir, { recursive: true });
      await fs.mkdir(videoDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create directories:', error);
      throw error;
    }
  }

  static getProgressMap(): Map<string, ProcessingProgress> {
    return this.progressMap;
  }

  static clearOldProgress(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    for (const [key, progress] of this.progressMap.entries()) {
      if (progress.startTime && progress.startTime < oneHourAgo) {
        this.progressMap.delete(key);
      }
    }
  }
}
