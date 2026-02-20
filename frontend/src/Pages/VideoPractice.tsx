import { useState, useRef, useEffect, useCallback } from "react";
import { 
  extractVideoId, 
  isValidYouTubeUrl, 
  createMockVideoData, 
  formatTime,
  type VideoData
} from "../utils/videoProcessor";
import { VideoService } from "../services/videoService";

// Italian Video Pronunciation Practice Page
// Allows users to upload YouTube videos, extract captions, and practice pronunciation

interface PracticeSession {
  currentSegment: number;
  userTranscription: string;
  userTranslation: string;
  isListening: boolean;
  showAnswer: boolean;
  score: { correct: number; total: number };
  completedSegments: Set<number>;
  segmentScores: Map<number, boolean>;
  practiceMode: 'transcription' | 'translation' | 'pronunciation' | 'all';
  playbackSpeed: number;
  repeatCount: number;
  maxRepeats: number;
}

// ====== Styling helpers ======
const labelCls = "text-sm font-medium text-slate-700";
const inputCls = "w-full rounded-xl border border-slate-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400";
const buttonCls = "rounded-lg px-3 py-2 text-sm font-medium transition-colors";
const cardCls = "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";

export default function VideoPractice() {
  // ====== State Management ======
  const [videoUrl, setVideoUrl] = useState("");
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [practiceSession, setPracticeSession] = useState<PracticeSession>({
    currentSegment: 0,
    userTranscription: "",
    userTranslation: "",
    isListening: false,
    showAnswer: false,
    score: { correct: 0, total: 0 },
    completedSegments: new Set(),
    segmentScores: new Map(),
    practiceMode: 'all',
    playbackSpeed: 1.0,
    repeatCount: 0,
    maxRepeats: 3
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Refs for audio/video playback
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ====== Persistence Functions ======
  const saveProgressToStorage = useCallback(() => {
    if (videoData) {
      const progressData = {
        videoId: videoData.id,
        currentSegment: practiceSession.currentSegment,
        completedSegments: Array.from(practiceSession.completedSegments),
        segmentScores: Object.fromEntries(practiceSession.segmentScores),
        score: practiceSession.score,
        timestamp: Date.now()
      };
      localStorage.setItem(`video_progress_${videoData.id}`, JSON.stringify(progressData));
    }
  }, [videoData, practiceSession]);

  const loadProgressFromStorage = useCallback((videoId: string) => {
    const stored = localStorage.getItem(`video_progress_${videoId}`);
    if (stored) {
      try {
        const progressData = JSON.parse(stored);
        setPracticeSession(prev => ({
          ...prev,
          currentSegment: progressData.currentSegment || 0,
          completedSegments: new Set(progressData.completedSegments || []),
          segmentScores: new Map(Object.entries(progressData.segmentScores || {}).map(([k, v]) => [parseInt(k), v as boolean])),
          score: progressData.score || { correct: 0, total: 0 }
        }));
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    }
  }, []);

  // ====== Video Processing Functions ======
  const fetchVideoData = async (url: string): Promise<VideoData | null> => {
    if (!isValidYouTubeUrl(url)) {
      throw new Error("Invalid YouTube URL");
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error("Could not extract video ID from URL");
    }

    // Try to use real API first, fallback to mock
    try {
      const response = await VideoService.processVideo({
        videoUrl: url,
        segmentDuration: 8,
        includeTranslation: true
      });

      if (response.success && response.data) {
        const videoData: VideoData = {
          id: response.data.videoId,
          title: response.data.title,
          url: url,
          duration: response.data.duration,
          segments: response.data.segments,
          captions: response.data.captions,
          thumbnail: response.data.thumbnail
        };
        
        // Load any existing progress
        loadProgressFromStorage(videoId);
        return videoData;
      }
    } catch (error) {
      console.warn('Real API failed, using mock data:', error);
    }

    // Fallback to mock data
    const mockVideoData = createMockVideoData(videoId, url);
    loadProgressFromStorage(videoId);
    return mockVideoData;
  };

  // ====== Video Processing Functions ======
  const handleVideoUpload = async () => {
    if (!videoUrl.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await fetchVideoData(videoUrl);
      if (data) {
        setVideoData(data);
        setPracticeSession(prev => ({
          ...prev,
          currentSegment: 0,
          userTranscription: "",
          userTranslation: "",
          showAnswer: false,
          score: { correct: 0, total: 0 }
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process video");
    } finally {
      setIsLoading(false);
    }
  };

  // ====== Audio/Video Playback Functions ======
  const setupAudioListeners = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const playCurrentSegment = useCallback(() => {
    if (!videoData || !videoData.segments[practiceSession.currentSegment]) return;
    
    const segment = videoData.segments[practiceSession.currentSegment];
    
    // Play audio if available
    if (audioRef.current) {
      const audio = audioRef.current;
      
      // Set playback speed
      audio.playbackRate = practiceSession.playbackSpeed;
      
      // If it's the same segment, just play from current position
      if (audio.src && audio.currentTime >= segment.startTime && audio.currentTime < segment.endTime) {
        audio.play().catch(console.error);
      } else {
        // Load new segment
        audio.src = segment.audioUrl || '';
        audio.currentTime = segment.startTime;
        audio.play().catch(console.error);
      }
    }
    
    // Update repeat count
    setPracticeSession(prev => ({
      ...prev,
      repeatCount: prev.repeatCount + 1
    }));
  }, [videoData, practiceSession.currentSegment, practiceSession.playbackSpeed]);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const setPlaybackSpeed = useCallback((speed: number) => {
    setPracticeSession(prev => ({ ...prev, playbackSpeed: speed }));
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, []);

  const seekToTime = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  // Auto-stop at segment end
  useEffect(() => {
    if (!videoData || !isPlaying) return;
    
    const segment = videoData.segments[practiceSession.currentSegment];
    if (!segment) return;

    const checkTime = () => {
      if (currentTime >= segment.endTime) {
        stopPlayback();
        // Auto-advance if repeat limit reached
        if (practiceSession.repeatCount >= practiceSession.maxRepeats) {
          setTimeout(() => nextSegment(), 1000);
        }
      }
    };

    const interval = setInterval(checkTime, 100);
    return () => clearInterval(interval);
  }, [currentTime, isPlaying, videoData, practiceSession.currentSegment, practiceSession.repeatCount, practiceSession.maxRepeats, stopPlayback]);

  // ====== Speech Recognition Functions ======
  const startVoiceInput = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.lang = 'it-IT';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    setPracticeSession(prev => ({ ...prev, isListening: true }));

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      
      setPracticeSession(prev => ({ 
        ...prev, 
        userTranscription: transcript,
        isListening: false 
      }));

      // Save recognition result for analytics
      if (videoData) {
        VideoService.saveProgress(
          videoData.id,
          practiceSession.currentSegment.toString(),
          false, // Will be determined when checking answer
          transcript,
          practiceSession.userTranslation
        );
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setPracticeSession(prev => ({ ...prev, isListening: false }));
    };

    recognition.onend = () => {
      setPracticeSession(prev => ({ ...prev, isListening: false }));
      recognitionRef.current = null;
    };

    recognition.start();
  }, [videoData, practiceSession.currentSegment, practiceSession.userTranslation]);

  const stopVoiceInput = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setPracticeSession(prev => ({ ...prev, isListening: false }));
  }, []);

  // ====== Practice Functions ======
  const calculateSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase().trim().replace(/[^\w\s]/g, '');
    const s2 = str2.toLowerCase().trim().replace(/[^\w\s]/g, '');
    
    if (s1 === s2) return 1.0;
    
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    
    return commonWords.length / Math.max(words1.length, words2.length);
  };

  const checkAnswer = useCallback(() => {
    if (!videoData) return;

    const currentSegment = videoData.segments[practiceSession.currentSegment];
    const segmentIndex = practiceSession.currentSegment;
    
    // Calculate similarity scores (more forgiving than exact match)
    const transcriptionSimilarity = calculateSimilarity(
      practiceSession.userTranscription, 
      currentSegment.text
    );
    const translationSimilarity = calculateSimilarity(
      practiceSession.userTranslation, 
      currentSegment.translation || ''
    );

    // Consider correct if similarity is above 80%
    const isTranscriptionCorrect = transcriptionSimilarity >= 0.8;
    const isTranslationCorrect = translationSimilarity >= 0.8;
    const isCorrect = isTranscriptionCorrect && isTranslationCorrect;

    // Update session state
    setPracticeSession(prev => {
      const newCompletedSegments = new Set(prev.completedSegments);
      newCompletedSegments.add(segmentIndex);
      
      const newSegmentScores = new Map(prev.segmentScores);
      newSegmentScores.set(segmentIndex, isCorrect);
      
      return {
        ...prev,
        showAnswer: true,
        completedSegments: newCompletedSegments,
        segmentScores: newSegmentScores,
        score: {
          correct: prev.score.correct + (isCorrect ? 1 : 0),
          total: prev.score.total + 1
        },
        repeatCount: 0 // Reset repeat count after answering
      };
    });

    // Save progress
    saveProgressToStorage();
    
    // Save to analytics
    if (videoData) {
      VideoService.saveProgress(
        videoData.id,
        segmentIndex.toString(),
        isCorrect,
        practiceSession.userTranscription,
        practiceSession.userTranslation
      );
    }
  }, [videoData, practiceSession, saveProgressToStorage]);

  const nextSegment = useCallback(() => {
    if (!videoData) return;

    const nextIndex = practiceSession.currentSegment + 1;
    if (nextIndex < videoData.segments.length) {
      setPracticeSession(prev => ({
        ...prev,
        currentSegment: nextIndex,
        userTranscription: "",
        userTranslation: "",
        showAnswer: false,
        repeatCount: 0
      }));
      saveProgressToStorage();
    }
  }, [videoData, practiceSession.currentSegment, saveProgressToStorage]);

  const prevSegment = useCallback(() => {
    const prevIndex = practiceSession.currentSegment - 1;
    if (prevIndex >= 0) {
      setPracticeSession(prev => ({
        ...prev,
        currentSegment: prevIndex,
        userTranscription: "",
        userTranslation: "",
        showAnswer: false,
        repeatCount: 0
      }));
      saveProgressToStorage();
    }
  }, [practiceSession.currentSegment, saveProgressToStorage]);

  const jumpToSegment = useCallback((index: number) => {
    if (!videoData || index < 0 || index >= videoData.segments.length) return;
    
    setPracticeSession(prev => ({
      ...prev,
      currentSegment: index,
      userTranscription: "",
      userTranslation: "",
      showAnswer: false,
      repeatCount: 0
    }));
    saveProgressToStorage();
  }, [videoData, saveProgressToStorage]);

  const resetProgress = useCallback(() => {
    if (!videoData) return;
    
    if (confirm('Are you sure you want to reset all progress for this video?')) {
      localStorage.removeItem(`video_progress_${videoData.id}`);
      setPracticeSession(prev => ({
        ...prev,
        currentSegment: 0,
        userTranscription: "",
        userTranslation: "",
        showAnswer: false,
        completedSegments: new Set(),
        segmentScores: new Map(),
        score: { correct: 0, total: 0 },
        repeatCount: 0
      }));
    }
  }, [videoData]);

  // ====== Effects ======
  useEffect(() => {
    const cleanup = setupAudioListeners();
    return cleanup;
  }, [setupAudioListeners]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Auto-save progress periodically
    const interval = setInterval(() => {
      if (videoData && practiceSession.score.total > 0) {
        saveProgressToStorage();
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [videoData, practiceSession.score.total, saveProgressToStorage]);

  // ====== Render Functions ======
  const renderVideoUpload = () => (
    <div className={cardCls}>
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Upload YouTube Video</h2>
      
      <div className="space-y-4">
        <div>
          <label className={labelCls}>YouTube URL</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className={inputCls}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleVideoUpload}
          disabled={isLoading}
          className={`${buttonCls} bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? "Processing..." : "Extract Video & Captions"}
        </button>
      </div>
    </div>
  );

  const renderVideoInfo = () => {
    if (!videoData) return null;

    const completionPercentage = (practiceSession.completedSegments.size / videoData.segments.length) * 100;
    const accuracy = practiceSession.score.total > 0 ? (practiceSession.score.correct / practiceSession.score.total) * 100 : 0;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <div className={cardCls}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{videoData.title}</h3>
                <p className="text-sm text-slate-600">
                  Duration: {formatTime(videoData.duration)} • 
                  Segments: {videoData.segments.length}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`${buttonCls} bg-slate-100 text-slate-700 hover:bg-slate-200`}
                >
                  ⚙️ Settings
                </button>
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className={`${buttonCls} bg-slate-100 text-slate-700 hover:bg-slate-200`}
                >
                  📊 Analytics
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-slate-700">Full Captions:</h4>
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                {videoData.captions}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="space-y-4">
          <div className={cardCls}>
            <h4 className="font-semibold text-slate-900 mb-3">Progress</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Completion</span>
                  <span>{Math.round(completionPercentage)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Accuracy</span>
                  <span>{Math.round(accuracy)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>

              <div className="text-sm text-slate-600">
                <div>Completed: {practiceSession.completedSegments.size}/{videoData.segments.length}</div>
                <div>Correct: {practiceSession.score.correct}/{practiceSession.score.total}</div>
              </div>
            </div>
          </div>

          <div className={cardCls}>
            <h4 className="font-semibold text-slate-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button
                onClick={resetProgress}
                className={`${buttonCls} w-full bg-red-100 text-red-700 hover:bg-red-200`}
              >
                🔄 Reset Progress
              </button>
              <button
                onClick={() => jumpToSegment(0)}
                className={`${buttonCls} w-full bg-slate-100 text-slate-700 hover:bg-slate-200`}
              >
                ⏮️ Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPracticeInterface = () => {
    if (!videoData || !videoData.segments[practiceSession.currentSegment]) return null;

    const currentSegment = videoData.segments[practiceSession.currentSegment];
    const progress = ((practiceSession.currentSegment + 1) / videoData.segments.length) * 100;
    const isCompleted = practiceSession.completedSegments.has(practiceSession.currentSegment);
    const isCorrect = practiceSession.segmentScores.get(practiceSession.currentSegment);

    return (
      <div className="space-y-6">
        {/* Progress Bar & Segment Navigation */}
        <div className={cardCls}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-700">
                Segment {practiceSession.currentSegment + 1} of {videoData.segments.length}
              </span>
              {isCompleted && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {isCorrect ? '✅ Correct' : '❌ Incorrect'}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Score: {practiceSession.score.correct}/{practiceSession.score.total}
              </span>
              <span className="text-sm text-slate-600">
                Repeats: {practiceSession.repeatCount}/{practiceSession.maxRepeats}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
            <div 
              className="bg-sky-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Segment Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {videoData.segments.slice(0, Math.min(10, videoData.segments.length)).map((_, index) => (
                <button
                  key={index}
                  onClick={() => jumpToSegment(index)}
                  className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                    index === practiceSession.currentSegment
                      ? 'bg-sky-600 text-white'
                      : practiceSession.completedSegments.has(index)
                      ? practiceSession.segmentScores.get(index)
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              {videoData.segments.length > 10 && (
                <span className="text-xs text-slate-500 px-2 py-2">
                  +{videoData.segments.length - 10} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Audio/Video Player */}
        <div className={cardCls}>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Listen & Watch</h3>
          
          <div className="space-y-4">
            {/* Audio Player with Enhanced Controls */}
            <div className="bg-slate-50 rounded-lg p-4">
              <audio
                ref={audioRef}
                controls
                className="w-full mb-4"
              >
                Your browser does not support the audio element.
              </audio>
              
              {/* Custom Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(currentSegment.endTime - currentSegment.startTime)}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 cursor-pointer" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = x / rect.width;
                  const newTime = currentSegment.startTime + (percentage * (currentSegment.endTime - currentSegment.startTime));
                  seekToTime(newTime);
                }}>
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                    style={{ 
                      width: `${((currentTime - currentSegment.startTime) / (currentSegment.endTime - currentSegment.startTime)) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Playback Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-center space-x-2">
                <button
                  onClick={playCurrentSegment}
                  disabled={isPlaying}
                  className={`${buttonCls} bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isPlaying ? '⏸️ Playing' : '▶️ Play Segment'}
                </button>
                <button
                  onClick={stopPlayback}
                  className={`${buttonCls} bg-red-600 text-white hover:bg-red-700`}
                >
                  ⏹️ Stop
                </button>
              </div>
              
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setPlaybackSpeed(0.5)}
                  className={`${buttonCls} ${practiceSession.playbackSpeed === 0.5 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  0.5x
                </button>
                <button
                  onClick={() => setPlaybackSpeed(0.75)}
                  className={`${buttonCls} ${practiceSession.playbackSpeed === 0.75 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  0.75x
                </button>
                <button
                  onClick={() => setPlaybackSpeed(1.0)}
                  className={`${buttonCls} ${practiceSession.playbackSpeed === 1.0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  1x
                </button>
                <button
                  onClick={() => setPlaybackSpeed(1.25)}
                  className={`${buttonCls} ${practiceSession.playbackSpeed === 1.25 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  1.25x
                </button>
              </div>
            </div>

            {/* Segment Info */}
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-600">
                Time: {formatTime(currentSegment.startTime)} - {formatTime(currentSegment.endTime)}
              </p>
              <p className="text-xs text-slate-500">
                Duration: {formatTime(currentSegment.endTime - currentSegment.startTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Practice Input */}
        <div className={cardCls}>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Practice</h3>
          
          <div className="space-y-4">
            {/* Transcription Input */}
            <div>
              <label className={labelCls}>Write what you heard (Italian):</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={practiceSession.userTranscription}
                  onChange={(e) => setPracticeSession(prev => ({ ...prev, userTranscription: e.target.value }))}
                  className={inputCls}
                  placeholder="Type or use voice input..."
                  disabled={practiceSession.isListening}
                />
                <button
                  onClick={startVoiceInput}
                  disabled={practiceSession.isListening}
                  className={`${buttonCls} bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 min-w-[120px]`}
                >
                  {practiceSession.isListening ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>Listening...</span>
                    </div>
                  ) : (
                    "🎤 Voice Input"
                  )}
                </button>
                {practiceSession.isListening && (
                  <button
                    onClick={stopVoiceInput}
                    className={`${buttonCls} bg-red-600 text-white hover:bg-red-700`}
                  >
                    ⏹️ Stop
                  </button>
                )}
              </div>
              {practiceSession.isListening && (
                <p className="text-xs text-purple-600 mt-1">
                  🎤 Speak clearly in Italian. The system is listening...
                </p>
              )}
            </div>

            {/* Translation Input */}
            <div>
              <label className={labelCls}>Translate to English:</label>
              <input
                type="text"
                value={practiceSession.userTranslation}
                onChange={(e) => setPracticeSession(prev => ({ ...prev, userTranslation: e.target.value }))}
                className={inputCls}
                placeholder="Type the English translation..."
              />
            </div>

            {/* Answer Display */}
            {practiceSession.showAnswer && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-700">Correct Italian:</h4>
                  <p className="text-slate-900">{currentSegment.text}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-700">Correct English:</h4>
                  <p className="text-slate-900">{currentSegment.translation}</p>
                </div>
                
                {/* Pronunciation Practice */}
                <div className="pt-3 border-t border-slate-200">
                  <h4 className="font-medium text-slate-700 mb-2">Practice Pronunciation:</h4>
                  <button
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.play().catch(console.error);
                      }
                    }}
                    className={`${buttonCls} bg-blue-600 text-white hover:bg-blue-700`}
                  >
                    🔊 Listen Again
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={prevSegment}
                disabled={practiceSession.currentSegment === 0}
                className={`${buttonCls} bg-slate-600 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                ← Previous
              </button>
              
              {!practiceSession.showAnswer ? (
                <button
                  onClick={checkAnswer}
                  disabled={!practiceSession.userTranscription.trim() || !practiceSession.userTranslation.trim()}
                  className={`${buttonCls} bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={nextSegment}
                  disabled={practiceSession.currentSegment >= videoData.segments.length - 1}
                  className={`${buttonCls} bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ====== Settings Panel ======
  const renderSettings = () => {
    if (!showSettings) return null;

    return (
      <div className={cardCls}>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Settings</h3>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Practice Mode:</label>
            <select
              value={practiceSession.practiceMode}
              onChange={(e) => setPracticeSession(prev => ({ 
                ...prev, 
                practiceMode: e.target.value as PracticeSession['practiceMode'] 
              }))}
              className={inputCls}
            >
              <option value="all">All (Transcription + Translation)</option>
              <option value="transcription">Transcription Only</option>
              <option value="translation">Translation Only</option>
              <option value="pronunciation">Pronunciation Only</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Max Repeats per Segment:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={practiceSession.maxRepeats}
              onChange={(e) => setPracticeSession(prev => ({ 
                ...prev, 
                maxRepeats: parseInt(e.target.value) || 3 
              }))}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Default Playback Speed:</label>
            <select
              value={practiceSession.playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className={inputCls}
            >
              <option value="0.5">0.5x (Slow)</option>
              <option value="0.75">0.75x (Slower)</option>
              <option value="1.0">1x (Normal)</option>
              <option value="1.25">1.25x (Faster)</option>
              <option value="1.5">1.5x (Fast)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => setShowSettings(false)}
              className={`${buttonCls} bg-slate-600 text-white hover:bg-slate-700`}
            >
              Close Settings
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ====== Analytics Panel ======
  const renderAnalytics = () => {
    if (!showAnalytics) return null;

    const completionRate = (practiceSession.completedSegments.size / (videoData?.segments.length || 1)) * 100;
    const accuracy = practiceSession.score.total > 0 ? (practiceSession.score.correct / practiceSession.score.total) * 100 : 0;
    const avgRepeats = practiceSession.score.total > 0 ? practiceSession.repeatCount / practiceSession.score.total : 0;

    return (
      <div className={cardCls}>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-900">Completion</h4>
              <p className="text-2xl font-bold text-blue-600">{Math.round(completionRate)}%</p>
              <p className="text-sm text-blue-700">
                {practiceSession.completedSegments.size} of {videoData?.segments.length || 0} segments
              </p>
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-medium text-green-900">Accuracy</h4>
              <p className="text-2xl font-bold text-green-600">{Math.round(accuracy)}%</p>
              <p className="text-sm text-green-700">
                {practiceSession.score.correct} of {practiceSession.score.total} correct
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-medium text-purple-900">Average Repeats</h4>
              <p className="text-2xl font-bold text-purple-600">{avgRepeats.toFixed(1)}</p>
              <p className="text-sm text-purple-700">per segment</p>
            </div>

            <div className="bg-orange-50 p-3 rounded-lg">
              <h4 className="font-medium text-orange-900">Current Segment</h4>
              <p className="text-2xl font-bold text-orange-600">{practiceSession.currentSegment + 1}</p>
              <p className="text-sm text-orange-700">of {videoData?.segments.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <button
            onClick={() => setShowAnalytics(false)}
            className={`${buttonCls} bg-slate-600 text-white hover:bg-slate-700`}
          >
            Close Analytics
          </button>
        </div>
      </div>
    );
  };

  // ====== Main Render ======
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Video Pronunciation Practice</h1>
          <p className="text-slate-600">
            Upload YouTube videos with Italian subtitles and practice pronunciation with real conversations
          </p>
        </div>

        <div className="space-y-6">
          {!videoData && renderVideoUpload()}
          {videoData && renderVideoInfo()}
          {showSettings && renderSettings()}
          {showAnalytics && renderAnalytics()}
          {videoData && renderPracticeInterface()}
        </div>

        {/* Reset Button */}
        {videoData && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                setVideoData(null);
                setVideoUrl("");
                setPracticeSession({
                  currentSegment: 0,
                  userTranscription: "",
                  userTranslation: "",
                  isListening: false,
                  showAnswer: false,
                  score: { correct: 0, total: 0 },
                  completedSegments: new Set(),
                  segmentScores: new Map(),
                  practiceMode: 'all',
                  playbackSpeed: 1.0,
                  repeatCount: 0,
                  maxRepeats: 3
                });
              }}
              className={`${buttonCls} bg-slate-600 text-white hover:bg-slate-700`}
            >
              Upload New Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
