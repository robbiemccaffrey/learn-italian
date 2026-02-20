// Video Processing Utilities for YouTube Video Practice
// Handles video extraction, caption processing, and segmentation

export interface VideoSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  translation?: string;
  audioUrl?: string;
  videoUrl?: string;
}

export interface VideoData {
  id: string;
  title: string;
  url: string;
  duration: number;
  segments: VideoSegment[];
  captions: string;
  thumbnail?: string;
  description?: string;
}

export interface CaptionData {
  start: number;
  end: number;
  text: string;
}

// ====== YouTube URL Processing ======
export const extractVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const isValidYouTubeUrl = (url: string): boolean => {
  return extractVideoId(url) !== null;
};

// ====== Caption Processing ======
export const parseSRTCaptions = (srtContent: string): CaptionData[] => {
  const captions: CaptionData[] = [];
  const blocks = srtContent.trim().split(/\n\s*\n/);

  blocks.forEach(block => {
    const lines = block.trim().split('\n');
    if (lines.length >= 3) {
      const timeMatch = lines[1].match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
      
      if (timeMatch) {
        const startTime = parseTimeToSeconds(timeMatch[1], timeMatch[2], timeMatch[3], timeMatch[4]);
        const endTime = parseTimeToSeconds(timeMatch[5], timeMatch[6], timeMatch[7], timeMatch[8]);
        const text = lines.slice(2).join(' ').replace(/<[^>]*>/g, ''); // Remove HTML tags
        
        captions.push({
          start: startTime,
          end: endTime,
          text: text.trim()
        });
      }
    }
  });

  return captions;
};

export const parseVTTCaptions = (vttContent: string): CaptionData[] => {
  const captions: CaptionData[] = [];
  const lines = vttContent.split('\n');
  let currentCaption: Partial<CaptionData> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if line contains timestamp
    const timeMatch = line.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);
    
    if (timeMatch) {
      const startTime = parseTimeToSeconds(timeMatch[1], timeMatch[2], timeMatch[3], timeMatch[4]);
      const endTime = parseTimeToSeconds(timeMatch[5], timeMatch[6], timeMatch[7], timeMatch[8]);
      
      currentCaption = {
        start: startTime,
        end: endTime,
        text: ''
      };
      
      // Collect text lines until next timestamp or end
      let j = i + 1;
      const textLines: string[] = [];
      
      while (j < lines.length && lines[j].trim() !== '' && !lines[j].includes('-->')) {
        textLines.push(lines[j].trim());
        j++;
      }
      
      currentCaption.text = textLines.join(' ').replace(/<[^>]*>/g, ''); // Remove HTML tags
      captions.push(currentCaption as CaptionData);
      i = j - 1;
    }
  }

  return captions;
};

const parseTimeToSeconds = (hours: string, minutes: string, seconds: string, milliseconds: string): number => {
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds) + parseInt(milliseconds) / 1000;
};

// ====== Advanced Video Segmentation ======
export interface SegmentationOptions {
  segmentDuration: number;
  overlap: number;
  minSegmentDuration: number;
  maxSegmentDuration: number;
  preferSentenceBoundaries: boolean;
  maxWordsPerSegment: number;
}

export const DEFAULT_SEGMENTATION_OPTIONS: SegmentationOptions = {
  segmentDuration: 8,
  overlap: 1,
  minSegmentDuration: 3,
  maxSegmentDuration: 15,
  preferSentenceBoundaries: true,
  maxWordsPerSegment: 20
};

export const createVideoSegments = (
  captions: CaptionData[],
  options: Partial<SegmentationOptions> = {}
): VideoSegment[] => {
  const opts = { ...DEFAULT_SEGMENTATION_OPTIONS, ...options };
  const segments: VideoSegment[] = [];
  
  if (captions.length === 0) return segments;

  // Sort captions by start time
  const sortedCaptions = [...captions].sort((a, b) => a.start - b.start);
  
  let currentTime = 0;
  let segmentId = 1;

  while (currentTime < Math.max(...captions.map(c => c.end))) {
    const segmentEnd = Math.min(currentTime + opts.segmentDuration, Math.max(...captions.map(c => c.end)));
    
    // Find captions that overlap with this segment
    const segmentCaptions = sortedCaptions.filter(caption => 
      caption.start < segmentEnd && caption.end > currentTime
    );

    if (segmentCaptions.length > 0) {
      // Combine text from overlapping captions
      let combinedText = segmentCaptions
        .map(caption => caption.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Check if segment is too long (too many words)
      const wordCount = combinedText.split(/\s+/).length;
      if (wordCount > opts.maxWordsPerSegment && opts.preferSentenceBoundaries) {
        // Try to split at sentence boundaries
        const sentences = combinedText.split(/[.!?]+/);
        if (sentences.length > 1) {
          // Take first sentence or sentences that fit within word limit
          let text = '';
          let words = 0;
          for (const sentence of sentences) {
            const sentenceWords = sentence.trim().split(/\s+/).length;
            if (words + sentenceWords <= opts.maxWordsPerSegment && sentence.trim()) {
              text += (text ? '. ' : '') + sentence.trim();
              words += sentenceWords;
            } else {
              break;
            }
          }
          if (text) {
            combinedText = text;
          }
        }
      }

      // Find the actual start and end times for this segment
      const actualStart = Math.max(currentTime, segmentCaptions[0].start);
      const actualEnd = Math.min(segmentEnd, segmentCaptions[segmentCaptions.length - 1].end);

      // Ensure minimum duration
      if (actualEnd - actualStart >= opts.minSegmentDuration) {
        segments.push({
          id: segmentId.toString(),
          startTime: actualStart,
          endTime: actualEnd,
          text: combinedText,
          translation: '', // Will be filled by user or translation service
          audioUrl: generateAudioUrl(segmentId, actualStart, actualEnd),
          videoUrl: generateVideoUrl(segmentId, actualStart, actualEnd)
        });

        segmentId++;
      }

      // Move forward by segment duration minus overlap
      currentTime += opts.segmentDuration - opts.overlap;
    } else {
      // No captions in this time range, move forward
      currentTime += opts.segmentDuration;
    }
  }

  return segments;
};

// ====== URL Generation (Mock for now) ======
const generateAudioUrl = (segmentId: number, startTime: number, endTime: number): string => {
  // In a real implementation, this would generate URLs to extracted audio segments
  // For now, return mock URLs
  return `/api/audio/segment_${segmentId}_${startTime}_${endTime}.mp3`;
};

const generateVideoUrl = (segmentId: number, startTime: number, endTime: number): string => {
  // In a real implementation, this would generate URLs to extracted video segments
  // For now, return mock URLs
  return `/api/video/segment_${segmentId}_${startTime}_${endTime}.mp4`;
};

// ====== Translation Services ======
export const translateText = async (text: string, targetLang: string = 'en'): Promise<string> => {
  // Mock translation - in a real implementation, you'd use Google Translate API or similar
  const mockTranslations: Record<string, string> = {
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

  return mockTranslations[text] || `[Translation needed for: ${text}]`;
};

// ====== Video Data Processing ======
export const processVideoData = async (
  videoId: string,
  videoUrl: string,
  captions: CaptionData[],
  segmentDuration: number = 8
): Promise<VideoData> => {
  const segments = createVideoSegments(captions, segmentDuration);
  
  // Add translations to segments
  for (const segment of segments) {
    if (segment.text) {
      segment.translation = await translateText(segment.text);
    }
  }

  return {
    id: videoId,
    title: `Italian Practice Video ${videoId}`,
    url: videoUrl,
    duration: Math.max(...captions.map(c => c.end)),
    segments,
    captions: captions.map(c => c.text).join(' '),
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    description: 'Italian conversation practice video with subtitles'
  };
};

// ====== Mock Data for Development ======
export const createMockVideoData = (videoId: string, videoUrl: string): VideoData => {
  const mockCaptions: CaptionData[] = [
    { start: 0, end: 5, text: 'Ciao, come stai?' },
    { start: 5, end: 10, text: 'Sono molto felice di vederti oggi.' },
    { start: 10, end: 15, text: 'Parliamo di cibo italiano.' },
    { start: 15, end: 20, text: 'Mi piace molto la pasta.' },
    { start: 20, end: 25, text: 'La pizza è deliziosa.' },
    { start: 25, end: 30, text: 'Dove vai domani?' },
    { start: 30, end: 35, text: 'Vado al cinema con i miei amici.' },
    { start: 35, end: 40, text: 'Buongiorno a tutti!' },
    { start: 40, end: 45, text: 'Grazie mille per essere qui.' },
    { start: 45, end: 50, text: 'Prego, è un piacere!' },
    { start: 50, end: 55, text: 'Come ti chiami?' },
    { start: 55, end: 60, text: 'Mi chiamo Marco, e tu?' },
    { start: 60, end: 65, text: 'Piacere di conoscerti!' },
    { start: 65, end: 70, text: 'Arrivederci, a presto!' }
  ];

  return processVideoData(videoId, videoUrl, mockCaptions, 8);
};

// ====== Export Helper Functions ======
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const validateSegment = (segment: VideoSegment): boolean => {
  return !!(
    segment.id &&
    segment.startTime >= 0 &&
    segment.endTime > segment.startTime &&
    segment.text.trim()
  );
};

export const mergeAdjacentSegments = (segments: VideoSegment[]): VideoSegment[] => {
  if (segments.length <= 1) return segments;

  const merged: VideoSegment[] = [];
  let current = { ...segments[0] };

  for (let i = 1; i < segments.length; i++) {
    const next = segments[i];
    
    // If segments are very close (within 2 seconds), merge them
    if (next.startTime - current.endTime <= 2) {
      current.endTime = next.endTime;
      current.text = `${current.text} ${next.text}`.replace(/\s+/g, ' ').trim();
    } else {
      merged.push(current);
      current = { ...next };
    }
  }

  merged.push(current);
  return merged;
};

// ====== Advanced Text Processing ======
export const cleanText = (text: string): string => {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\[.*?\]/g, '') // Remove [brackets] like [Music]
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

export const extractKeywords = (text: string): string[] => {
  // Simple keyword extraction for Italian text
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  // Remove common Italian words
  const commonWords = new Set([
    'che', 'con', 'per', 'una', 'sono', 'alla', 'della', 'delle', 'dello', 'della',
    'questo', 'questa', 'quello', 'quella', 'molto', 'bene', 'anche', 'come',
    'quando', 'dove', 'perché', 'quindi', 'allora', 'prima', 'dopo', 'sempre'
  ]);
  
  return [...new Set(words.filter(word => !commonWords.has(word)))];
};

export const calculateTextComplexity = (text: string): number => {
  const words = text.split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = words.length / sentences.length;
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  
  // Simple complexity score (0-1, where 1 is most complex)
  return Math.min(1, (avgWordsPerSentence * avgWordLength) / 100);
};

// ====== Segment Quality Assessment ======
export interface SegmentQuality {
  score: number; // 0-1
  issues: string[];
  suggestions: string[];
}

export const assessSegmentQuality = (segment: VideoSegment): SegmentQuality => {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 1.0;

  // Check duration
  const duration = segment.endTime - segment.startTime;
  if (duration < 3) {
    issues.push('Segment too short');
    score -= 0.2;
  } else if (duration > 15) {
    issues.push('Segment too long');
    suggestions.push('Consider splitting into smaller segments');
    score -= 0.1;
  }

  // Check text length
  const wordCount = segment.text.split(/\s+/).length;
  if (wordCount < 3) {
    issues.push('Text too short');
    score -= 0.3;
  } else if (wordCount > 25) {
    issues.push('Text too long');
    suggestions.push('Consider splitting at sentence boundaries');
    score -= 0.1;
  }

  // Check text quality
  if (!segment.translation) {
    issues.push('Missing translation');
    suggestions.push('Add English translation');
    score -= 0.2;
  }

  // Check for special characters or formatting issues
  if (/[{}[\]()<>]/.test(segment.text)) {
    issues.push('Contains formatting characters');
    suggestions.push('Clean up text formatting');
    score -= 0.1;
  }

  return { score: Math.max(0, score), issues, suggestions };
};

// ====== Smart Segment Optimization ======
export const optimizeSegments = (segments: VideoSegment[]): VideoSegment[] => {
  return segments.map(segment => {
    const quality = assessSegmentQuality(segment);
    
    // If quality is good, return as is
    if (quality.score >= 0.8) {
      return segment;
    }
    
    // Try to improve the segment
    const improved = { ...segment };
    
    // Clean text if needed
    if (quality.issues.includes('Contains formatting characters')) {
      improved.text = cleanText(segment.text);
    }
    
    // Add placeholder translation if missing
    if (quality.issues.includes('Missing translation')) {
      improved.translation = '[Translation needed]';
    }
    
    return improved;
  });
};
