// Video Service for handling YouTube video processing
// This would typically be a backend service, but we'll create a mock frontend service

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
    segments: Array<{
      id: string;
      startTime: number;
      endTime: number;
      text: string;
      translation?: string;
      audioUrl: string;
      videoUrl: string;
    }>;
    captions: string;
    thumbnail: string;
  };
  error?: string;
}

// Backend API endpoint
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9283/api';

// YouTube Data API configuration
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Real API integration flags
const USE_REAL_YOUTUBE_API = false; // Set to true when you have a YouTube API key
const USE_REAL_TRANSLATION_API = false; // Set to true when you have translation service

export class VideoService {
  // ====== Video Processing ======
  static async processVideo(request: VideoProcessingRequest): Promise<VideoProcessingResponse> {
    try {
      // Try backend API first
      try {
        const response = await fetch(`${API_BASE_URL}/video/process`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request)
        });

        if (response.ok) {
          const data = await response.json();
          return data;
        } else {
          throw new Error(`Backend API failed with status ${response.status}`);
        }
      } catch (error) {
        console.error('Backend API error:', error);
        throw new Error(`Failed to process video: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process video'
      };
    }
  }

  // ====== Real YouTube API Integration ======
  private static async processVideoWithRealAPI(
    videoId: string, 
    request: VideoProcessingRequest
  ): Promise<VideoProcessingResponse> {
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    // Fetch video metadata
    const metadataResponse = await fetch(
      `${YOUTUBE_API_BASE}/videos?id=${videoId}&part=snippet,contentDetails&key=${YOUTUBE_API_KEY}`
    );
    
    if (!metadataResponse.ok) {
      throw new Error('Failed to fetch video metadata');
    }
    
    const metadata = await metadataResponse.json();
    const videoInfo = metadata.items[0];
    
    if (!videoInfo) {
      throw new Error('Video not found');
    }

    // Extract captions
    const captions = await this.extractCaptions(videoId, 'it');
    
    // Process captions into segments
    const { parseVTTCaptions, createVideoSegments } = await import('../utils/videoProcessor');
    const captionData = parseVTTCaptions(captions);
    const segments = createVideoSegments(captionData, {
      segmentDuration: request.segmentDuration || 8
    });

    // Add translations if requested
    if (request.includeTranslation) {
      for (const segment of segments) {
        segment.translation = await this.translateText(segment.text);
      }
    }

    // Generate audio/video URLs (would need backend processing)
    segments.forEach((segment, index) => {
      segment.audioUrl = `${API_BASE_URL}/audio/${videoId}_${segment.startTime}_${segment.endTime}.mp3`;
      segment.videoUrl = `${API_BASE_URL}/video/${videoId}_${segment.startTime}_${segment.endTime}.mp4`;
    });

    return {
      success: true,
      data: {
        videoId,
        title: videoInfo.snippet.title,
        duration: this.parseDuration(videoInfo.contentDetails.duration),
        segments,
        captions: captionData.map(c => c.text).join(' '),
        thumbnail: videoInfo.snippet.thumbnails.maxres?.url || videoInfo.snippet.thumbnails.default?.url
      }
    };
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

  // ====== Caption Extraction ======
  static async extractCaptions(videoId: string, language: string = 'it'): Promise<string> {
    try {
      // Mock caption extraction
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, this would use YouTube Data API
      return `WEBVTT

00:00:00.000 --> 00:00:05.000
Ciao, come stai?

00:00:05.000 --> 00:00:10.000
Sono molto felice di vederti oggi.

00:00:10.000 --> 00:00:15.000
Parliamo di cibo italiano.

00:00:15.000 --> 00:00:20.000
Mi piace molto la pasta.

00:00:20.000 --> 00:00:25.000
La pizza è deliziosa.

00:00:25.000 --> 00:00:30.000
Dove vai domani?

00:00:30.000 --> 00:00:35.000
Vado al cinema con i miei amici.`;
    } catch (error) {
      throw new Error('Failed to extract captions');
    }
  }

  // ====== Audio/Video Extraction ======
  static async extractAudioSegment(
    videoId: string, 
    startTime: number, 
    endTime: number
  ): Promise<string> {
    try {
      // Mock audio extraction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, this would use FFmpeg or similar
      const segmentId = `${videoId}_${startTime}_${endTime}`;
      return `${API_BASE_URL}/audio/${segmentId}.mp3`;
    } catch (error) {
      throw new Error('Failed to extract audio segment');
    }
  }

  static async extractVideoSegment(
    videoId: string, 
    startTime: number, 
    endTime: number
  ): Promise<string> {
    try {
      // Mock video extraction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would use FFmpeg or similar
      const segmentId = `${videoId}_${startTime}_${endTime}`;
      return `${API_BASE_URL}/video/${segmentId}.mp4`;
    } catch (error) {
      throw new Error('Failed to extract video segment');
    }
  }

  // ====== Translation Service ======
  static async translateText(text: string, targetLang: string = 'en'): Promise<string> {
    try {
      // Try real translation API if enabled
      if (USE_REAL_TRANSLATION_API) {
        try {
          return await this.translateWithRealAPI(text, targetLang);
        } catch (error) {
          console.warn('Real translation API failed, using mock:', error);
        }
      }

      // Mock translation fallback
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const translations: Record<string, string> = {
        'Ciao, come stai?': 'Hello, how are you?',
        'Sono molto felice di vederti oggi.': 'I am very happy to see you today.',
        'Parliamo di cibo italiano.': "Let's talk about Italian food.",
        'Mi piace molto la pasta.': 'I really like pasta.',
        'La pizza è deliziosa.': 'The pizza is delicious.',
        'Dove vai domani?': 'Where are you going tomorrow?',
        'Vado al cinema con i miei amici.': "I'm going to the cinema with my friends.",
        'Buongiorno!': 'Good morning!',
        'Buonasera!': 'Good evening!',
        'Grazie mille!': 'Thank you very much!',
        'Prego!': 'You\'re welcome!',
        'Come ti chiami?': 'What is your name?',
        'Mi chiamo...': 'My name is...',
        'Piacere di conoscerti!': 'Nice to meet you!',
        'Arrivederci!': 'Goodbye!'
      };

      return translations[text] || `[Translation needed for: ${text}]`;
    } catch (error) {
      throw new Error('Failed to translate text');
    }
  }

  private static async translateWithRealAPI(text: string, targetLang: string): Promise<string> {
    // Google Translate API integration
    const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      throw new Error('Google Translate API key not configured');
    }

    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        source: 'it'
      })
    });

    if (!response.ok) {
      throw new Error('Translation API request failed');
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  }

  // ====== Video Metadata ======
  static async getVideoMetadata(videoId: string): Promise<{
    title: string;
    description: string;
    duration: number;
    thumbnail: string;
  }> {
    try {
      // Mock metadata fetch
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        title: 'Italian Conversation Practice',
        description: 'Practice Italian pronunciation with real conversations',
        duration: 300, // 5 minutes
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      };
    } catch (error) {
      throw new Error('Failed to fetch video metadata');
    }
  }

  // ====== Progress Tracking ======
  static async saveProgress(
    videoId: string, 
    segmentId: string, 
    isCorrect: boolean,
    userTranscription: string,
    userTranslation: string
  ): Promise<void> {
    try {
      // Mock progress saving
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In real implementation, save to database
      console.log('Progress saved:', {
        videoId,
        segmentId,
        isCorrect,
        userTranscription,
        userTranslation,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  // ====== Analytics ======
  static async getVideoAnalytics(videoId: string): Promise<{
    totalAttempts: number;
    correctAttempts: number;
    averageAccuracy: number;
    mostDifficultSegments: string[];
  }> {
    try {
      // Mock analytics
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return {
        totalAttempts: 45,
        correctAttempts: 38,
        averageAccuracy: 84.4,
        mostDifficultSegments: ['segment_3', 'segment_7']
      };
    } catch (error) {
      throw new Error('Failed to fetch analytics');
    }
  }
}

// ====== Utility Functions ======
export const validateYouTubeUrl = (url: string): boolean => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  return regex.test(url);
};

export const extractVideoIdFromUrl = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
