export interface CaptionData {
  start: number;
  end: number;
  text: string;
}

export interface SegmentationOptions {
  segmentDuration: number;
  overlap: number;
  minSegmentDuration?: number;
  maxSegmentDuration?: number;
  preferSentenceBoundaries?: boolean;
  maxWordsPerSegment?: number;
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

export class CaptionProcessor {
  static parseCaptions(captionText: string): CaptionData[] {
    // Parse different caption formats
    if (captionText.includes('<p') || captionText.includes('ttml')) {
      return this.parseTTML(captionText);
    } else if (captionText.includes('-->')) {
      return this.parseSRT(captionText);
    } else {
      // Treat as plain text and create mock timestamps
      return this.parsePlainText(captionText);
    }
  }

  static createSegments(
    captions: CaptionData[], 
    options: SegmentationOptions
  ): VideoSegment[] {
    const {
      segmentDuration = 8,
      overlap = 1,
      minSegmentDuration = 3,
      maxSegmentDuration = 15,
      preferSentenceBoundaries = true,
      maxWordsPerSegment = 20
    } = options;

    const segments: VideoSegment[] = [];
    
    if (captions.length === 0) return segments;

    // Sort captions by start time
    const sortedCaptions = [...captions].sort((a, b) => a.start - b.start);
    
    let currentTime = 0;
    let segmentId = 1;

    while (currentTime < Math.max(...captions.map(c => c.end))) {
      const segmentEnd = Math.min(currentTime + segmentDuration, Math.max(...captions.map(c => c.end)));
      
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
        if (wordCount > maxWordsPerSegment && preferSentenceBoundaries) {
          // Try to split at sentence boundaries
          const sentences = combinedText.split(/[.!?]+/);
          if (sentences.length > 1) {
            // Take first sentence or sentences that fit within word limit
            let text = '';
            let words = 0;
            for (const sentence of sentences) {
              const sentenceWords = sentence.trim().split(/\s+/).length;
              if (words + sentenceWords <= maxWordsPerSegment && sentence.trim()) {
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
        if (actualEnd - actualStart >= minSegmentDuration) {
          segments.push({
            id: segmentId.toString(),
            startTime: actualStart,
            endTime: actualEnd,
            text: combinedText,
            translation: '', // Will be filled by translation service
            audioUrl: '', // Will be filled by video processing service
            videoUrl: '' // Will be filled by video processing service
          });

          segmentId++;
        }

        // Move forward by segment duration minus overlap
        currentTime += segmentDuration - overlap;
      } else {
        // No captions in this time range, move forward
        currentTime += segmentDuration;
      }
    }

    return segments;
  }

  private static parseTTML(ttmlContent: string): CaptionData[] {
    const captions: CaptionData[] = [];
    
    // Simple TTML parser
    const pRegex = /<p[^>]*begin="([^"]*)"[^>]*end="([^"]*)"[^>]*>(.*?)<\/p>/g;
    let match;

    while ((match = pRegex.exec(ttmlContent)) !== null) {
      const start = this.parseTimeToSeconds(match[1]);
      const end = this.parseTimeToSeconds(match[2]);
      const text = this.cleanText(match[3]);

      if (text && start >= 0 && end > start) {
        captions.push({ start, end, text });
      }
    }

    return captions;
  }

  private static parseSRT(srtContent: string): CaptionData[] {
    const captions: CaptionData[] = [];
    const blocks = srtContent.split(/\n\s*\n/);

    for (const block of blocks) {
      const lines = block.trim().split('\n');
      if (lines.length >= 3) {
        const timeMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
        if (timeMatch) {
          const start = this.parseTimeToSeconds(timeMatch[1]);
          const end = this.parseTimeToSeconds(timeMatch[2]);
          const text = lines.slice(2).join(' ').trim();

          if (text && start >= 0 && end > start) {
            captions.push({ start, end, text });
          }
        }
      }
    }

    return captions;
  }

  private static parsePlainText(text: string): CaptionData[] {
    // Split text into sentences and create mock timestamps
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const captions: CaptionData[] = [];
    
    let currentTime = 0;
    const durationPerSentence = 3; // 3 seconds per sentence

    for (const sentence of sentences) {
      const cleanSentence = sentence.trim();
      if (cleanSentence) {
        captions.push({
          start: currentTime,
          end: currentTime + durationPerSentence,
          text: cleanSentence
        });
        currentTime += durationPerSentence;
      }
    }

    return captions;
  }

  private static parseTimeToSeconds(timeString: string): number {
    // Parse various time formats
    if (timeString.includes(':')) {
      // Format: HH:MM:SS or HH:MM:SS.mmm
      const parts = timeString.split(':');
      const hours = parseInt(parts[0] || '0');
      const minutes = parseInt(parts[1] || '0');
      const secondsParts = parts[2] ? parts[2].split(/[,.]/) : ['0'];
      const seconds = parseInt(secondsParts[0] || '0');
      const milliseconds = parseInt(secondsParts[1] || '0');
      
      return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
    } else if (timeString.includes('s')) {
      // Format: 123.45s
      return parseFloat(timeString.replace('s', ''));
    } else {
      // Assume it's already in seconds
      return parseFloat(timeString);
    }
  }

  private static cleanText(text: string): string {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\[.*?\]/g, '') // Remove [brackets] like [Music]
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  static mergeAdjacentSegments(segments: VideoSegment[]): VideoSegment[] {
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
  }

  static validateSegment(segment: VideoSegment): boolean {
    return !!(
      segment.id &&
      segment.startTime >= 0 &&
      segment.endTime > segment.startTime &&
      segment.text.trim()
    );
  }
}


