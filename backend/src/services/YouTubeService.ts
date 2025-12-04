import axios from 'axios';
import { google } from 'googleapis';

export interface VideoMetadata {
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
}

export class YouTubeService {
  private static youtubeApiKey = process.env.YOUTUBE_API_KEY;
  private static youtube = google.youtube({ version: 'v3', auth: this.youtubeApiKey });

  static async getVideoMetadata(videoId: string): Promise<VideoMetadata> {
    try {
      if (!this.youtubeApiKey) {
        // Return mock data if no API key
        return this.getMockMetadata(videoId);
      }

      const response = await this.youtube.videos.list({
        part: ['snippet', 'contentDetails'],
        id: [videoId]
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Video not found');
      }

      const video = response.data.items[0];
      const duration = this.parseDuration(video.contentDetails?.duration || '');

      return {
        title: video.snippet?.title || 'Unknown Title',
        description: video.snippet?.description || '',
        duration,
        thumbnail: video.snippet?.thumbnails?.maxres?.url || 
                   video.snippet?.thumbnails?.default?.url || '',
        publishedAt: video.snippet?.publishedAt || '',
        channelTitle: video.snippet?.channelTitle || ''
      };
    } catch (error) {
      console.error('YouTube API error:', error);
      // Fallback to mock data
      return this.getMockMetadata(videoId);
    }
  }

  static async extractCaptions(videoId: string, language: string = 'it'): Promise<string> {
    try {
      if (!this.youtubeApiKey) {
        // Return mock captions if no API key
        return this.getMockCaptions();
      }

      // Get caption tracks
      const captionResponse = await this.youtube.captions.list({
        part: ['snippet'],
        videoId: videoId
      });

      if (!captionResponse.data.items || captionResponse.data.items.length === 0) {
        throw new Error('No captions available for this video');
      }

      // Find Italian captions or auto-generated ones
      let captionTrack = captionResponse.data.items.find(
        track => track.snippet?.language === language
      );

      if (!captionTrack) {
        // Fallback to auto-generated captions
        captionTrack = captionResponse.data.items.find(
          track => track.snippet?.trackKind === 'asr'
        );
      }

      if (!captionTrack || !captionTrack.id) {
        throw new Error('No suitable captions found');
      }

      // Download captions
      const captionContent = await this.youtube.captions.download({
        id: captionTrack.id,
        tfmt: 'ttml'
      });

      return this.parseCaptions(captionContent.data as string);
    } catch (error) {
      console.error('Caption extraction error:', error);
      // Fallback to mock captions
      return this.getMockCaptions();
    }
  }

  private static parseDuration(isoDuration: string): number {
    // Parse ISO 8601 duration (e.g., PT1H2M3S)
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  }

  private static parseCaptions(ttmlContent: string): string {
    // Simple TTML parser - extract text content
    const textRegex = /<p[^>]*>(.*?)<\/p>/g;
    const captions: string[] = [];
    let match;

    while ((match = textRegex.exec(ttmlContent)) !== null) {
      const text = match[1]
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
      
      if (text) {
        captions.push(text);
      }
    }

    return captions.join(' ');
  }

  private static getMockMetadata(videoId: string): VideoMetadata {
    return {
      title: 'Italian Conversation Practice - Mock Video',
      description: 'A practice video for learning Italian pronunciation and conversation.',
      duration: 300, // 5 minutes
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      publishedAt: new Date().toISOString(),
      channelTitle: 'Italian Learning Channel'
    };
  }

  private static getMockCaptions(): string {
    return `Ciao, come stai? Sono molto felice di vederti oggi. 
    Parliamo di cibo italiano. Mi piace molto la pasta. 
    La pizza è deliziosa. Dove vai domani? 
    Vado al cinema con i miei amici. 
    Buongiorno! Buonasera! Grazie mille! 
    Prego! Come ti chiami? Mi chiamo... 
    Piacere di conoscerti! Arrivederci!`;
  }
}


