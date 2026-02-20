import React, { useState, useEffect, useCallback } from "react";
import { PRONUNCIATION_RULES_DATA } from "../data/pronunciationWords";

// Italian Pronunciation Practice Page
// Based on the pronunciation article covering vowels, consonants, and special sounds

// ====== TypeScript Interfaces ======
interface PronunciationExample {
  word: string;
  meaning: string;
  note: string;
}

interface PracticeWord {
  word: string;
  hint: string;
  meaning?: string;
}

interface PronunciationRule {
  id: string;
  title: string;
  description: string;
  examples: PronunciationExample[];
  practice: PracticeWord[];
}

interface ExerciseType {
  id: string;
  title: string;
  description: string;
}

interface CurrentExercise {
  word: PracticeWord;
  attempts: number;
  correct: boolean;
}

interface Score {
  correct: number;
  total: number;
}

// ====== Styling helpers ======
const labelCls = "text-sm font-medium text-slate-700";
const inputCls = "w-full rounded-xl border border-slate-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400";
const buttonCls = "rounded-lg px-3 py-2 text-sm font-medium transition-colors";
const cardCls = "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";


// ====== Practice Exercise Types ======
const EXERCISE_TYPES = [
  {
    id: "listen-repeat",
    title: "Listen and Repeat",
    description: "Listen to the pronunciation and repeat the word"
  },
  {
    id: "choose-pronunciation",
    title: "Choose Correct Pronunciation",
    description: "Select the correct pronunciation from multiple options"
  },
  {
    id: "identify-sound",
    title: "Identify Sound Pattern",
    description: "Identify which pronunciation rule applies to each word"
  }
];

// Italian alphabet
const ITALIAN_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L', 
  'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'Z'
];

export default function Pronunciation() {
  const [activeRule, setActiveRule] = useState<PronunciationRule>(PRONUNCIATION_RULES_DATA[0]);
  const [currentExercise, setCurrentExercise] = useState<CurrentExercise | null>(null);
  const [exerciseType, setExerciseType] = useState<ExerciseType>(EXERCISE_TYPES[0]);
  const [userInput, setUserInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [score, setScore] = useState<Score>({ correct: 0, total: 0 });
  const [showHints, setShowHints] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [showAlphabet, setShowAlphabet] = useState(false);
  const [isPlayingAlphabet, setIsPlayingAlphabet] = useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = useState<number | null>(null);

  // Recording functions
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not start recording. Please check microphone permissions.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  }, [mediaRecorder, isRecording]);

  const clearRecording = useCallback(() => {
    if (recordedAudio) {
      URL.revokeObjectURL(recordedAudio);
      setRecordedAudio(null);
    }
  }, [recordedAudio]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger shortcuts when not typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl/Cmd + N for Next exercise
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        if (activeRule && exerciseType) {
          nextExercise();
        }
      }

      // Ctrl/Cmd + L for Listen
      if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
        event.preventDefault();
        if (currentExercise) {
          speak(currentExercise.word.word);
        }
      }

      // Ctrl/Cmd + H for Toggle Hints
      if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
        event.preventDefault();
        setShowHints(!showHints);
      }

      // Ctrl/Cmd + R for Record
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        if (currentExercise) {
          if (isRecording) {
            stopRecording();
          } else {
            startRecording();
          }
        }
      }

      // Ctrl/Cmd + P for Play correct pronunciation
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        if (currentExercise) {
          speak(currentExercise.word.word);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeRule, exerciseType, currentExercise, showHints, isRecording, startRecording, stopRecording]);

  // Cleanup recording when component unmounts
  useEffect(() => {
    return () => {
      if (recordedAudio) {
        URL.revokeObjectURL(recordedAudio);
      }
    };
  }, [recordedAudio]);

  // Speech synthesis function
  const speak = (text: string, lang: string = "it-IT") => {
    if (!text) return;
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis not supported in this browser.");
      return;
    }

    // Special handling for single letters in the alphabet
    let speechText = text;
    if (text.length === 1 && /[A-Z]/.test(text)) {
      // Use Italian letter names for single letters
      const letterNames: { [key: string]: string } = {
        'A': 'a',
        'B': 'bi',
        'C': 'ci',
        'D': 'di',
        'E': 'e',
        'F': 'effe',
        'G': 'gi',
        'H': 'acca',
        'I': 'i',
        'L': 'elle',
        'M': 'emme',
        'N': 'enne',
        'O': 'o',
        'P': 'pi',
        'Q': 'qu',
        'R': 'erre',
        'S': 'esse',
        'T': 'ti',
        'U': 'u',
        'V': 'vu',
        'Z': 'zeta'
      };
      speechText = letterNames[text] || text;
    } else {
      // Special pronunciation fixes for common Italian words and endings
      const pronunciationFixes: { [key: string]: string } = {
        'SCEGLIERE': 'SCE-GLIE-RE',
        'CRESCERE': 'CRE-SCE-RE',
        'PIACERE': 'PIA-CE-RE',
        'VINCERE': 'VIN-CE-RE',
        'VEDERE': 'VE-DE-RE',
        'POTERE': 'PO-TE-RE',
        'DOVERE': 'DO-VE-RE',
        'VOLERE': 'VO-LE-RE',
        'SAPERE': 'SA-PE-RE',
        'FARE': 'FA-RE',
        'ANDARE': 'AN-DA-RE',
        'STARE': 'STA-RE',
        'VENIRE': 'VE-NI-RE',
        'USCIRE': 'U-SCI-RE',
        'DIRE': 'DI-RE'
      };
      
      if (pronunciationFixes[text.toUpperCase()]) {
        speechText = pronunciationFixes[text.toUpperCase()];
      }
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = lang;
    utterance.rate = 0.7; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech synthesis error:", e);
    }
  };


  // Speech recognition function
  const startListening = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "it-IT";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Recognition start error:", e);
      setIsListening(false);
    }
  };

  // Start a new exercise
  const startExercise = (rule: PronunciationRule, type: ExerciseType) => {
    setActiveRule(rule);
    setExerciseType(type);
    const randomWord = rule.practice[Math.floor(Math.random() * rule.practice.length)];
    setCurrentExercise({
      word: randomWord,
      attempts: 0,
      correct: false
    });
    setUserInput("");
    setShowAnswer(false);
    // Clear any existing recording when starting new exercise
    clearRecording();
  };

  // Check user's answer
  const checkAnswer = () => {
    if (!currentExercise) return;
    
    const normalizedInput = userInput.toLowerCase().trim();
    const normalizedWord = currentExercise.word.word.toLowerCase().trim();
    
    const isCorrect = normalizedInput === normalizedWord;
    
    setCurrentExercise(prev => prev ? {
      ...prev,
      attempts: prev.attempts + 1,
      correct: isCorrect
    } : null);
    
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    
    setShowAnswer(true);
  };

  // Next exercise
  const nextExercise = () => {
    if (activeRule && exerciseType) {
      startExercise(activeRule, exerciseType);
    }
  };

  // Play through the alphabet
  const playAlphabet = useCallback(() => {
    if (isPlayingAlphabet) {
      // Stop playing
      setIsPlayingAlphabet(false);
      setCurrentLetterIndex(null);
      window.speechSynthesis.cancel();
      return;
    }

    setIsPlayingAlphabet(true);
    setCurrentLetterIndex(0);

    const playLetter = (index: number) => {
      if (index >= ITALIAN_ALPHABET.length) {
        setIsPlayingAlphabet(false);
        setCurrentLetterIndex(null);
        return;
      }

      setCurrentLetterIndex(index);
      const letter = ITALIAN_ALPHABET[index];
      
      // Use the speak function which has letter name mappings
      const letterNames: { [key: string]: string } = {
        'A': 'a',
        'B': 'bi',
        'C': 'ci',
        'D': 'di',
        'E': 'e',
        'F': 'effe',
        'G': 'gi',
        'H': 'acca',
        'I': 'i',
        'L': 'elle',
        'M': 'emme',
        'N': 'enne',
        'O': 'o',
        'P': 'pi',
        'Q': 'qu',
        'R': 'erre',
        'S': 'esse',
        'T': 'ti',
        'U': 'u',
        'V': 'vu',
        'Z': 'zeta'
      };

      const utterance = new SpeechSynthesisUtterance(letterNames[letter] || letter);
      utterance.lang = "it-IT";
      utterance.rate = 0.7;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onend = () => {
        // Wait 1 second before next letter
        setTimeout(() => {
          playLetter(index + 1);
        }, 1000);
      };

      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error("Speech synthesis error:", e);
        setIsPlayingAlphabet(false);
        setCurrentLetterIndex(null);
      }
    };

    playLetter(0);
  }, [isPlayingAlphabet]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-24 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Italian Pronunciation Practice
              </h1>
              <p className="text-slate-600">
                Master Italian pronunciation with interactive exercises based on essential pronunciation rules
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Score</div>
              <div className="text-lg font-semibold text-slate-900">
                {score.correct}/{score.total}
              </div>
            </div>
          </div>
        </header>

        {/* Alphabet Section Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAlphabet(!showAlphabet)}
            className={`${buttonCls} ${
              showAlphabet
                ? "bg-purple-600 text-white"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
            }`}
          >
            🔤 Italian Alphabet
          </button>
        </div>

        {/* Alphabet Display */}
        {showAlphabet && (
          <div className={`${cardCls} mb-8`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Italian Alphabet (21 Letters)
              </h2>
              <button
                onClick={playAlphabet}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isPlayingAlphabet
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {isPlayingAlphabet ? "⏹️ Stop" : "▶️ Play All"}
              </button>
            </div>
            
            <p className="text-slate-600 mb-4">
              The Italian alphabet has 21 letters. Letters J, K, W, X, Y are only used in foreign words.
            </p>

            <div className="grid grid-cols-7 gap-3">
              {ITALIAN_ALPHABET.map((letter, index) => (
                <button
                  key={letter}
                  onClick={() => speak(letter)}
                  className={`relative p-4 rounded-lg text-2xl font-bold transition-all ${
                    currentLetterIndex === index
                      ? "bg-emerald-500 text-white scale-110 shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105"
                  }`}
                  title={`Click to hear ${letter}`}
                >
                  {letter}
                  {currentLetterIndex === index && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Pronunciation Guide:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
                <div><strong>A</strong> - "ah" like father</div>
                <div><strong>B</strong> - "bee" like English</div>
                <div><strong>C</strong> - "chee" (soft before e, i)</div>
                <div><strong>D</strong> - "dee" like English</div>
                <div><strong>E</strong> - "eh" like met</div>
                <div><strong>F</strong> - "ef-feh"</div>
                <div><strong>G</strong> - "jee" (soft before e, i)</div>
                <div><strong>H</strong> - "ak-ka" (silent in words)</div>
                <div><strong>I</strong> - "ee" like machine</div>
                <div><strong>L</strong> - "el-leh"</div>
                <div><strong>M</strong> - "em-meh"</div>
                <div><strong>N</strong> - "en-neh"</div>
                <div><strong>O</strong> - "oh" like go</div>
                <div><strong>P</strong> - "pee" like English</div>
                <div><strong>Q</strong> - "koo" (always with u)</div>
                <div><strong>R</strong> - "er-reh" (rolled)</div>
                <div><strong>S</strong> - "es-seh"</div>
                <div><strong>T</strong> - "tee" like English</div>
                <div><strong>U</strong> - "oo" like boot</div>
                <div><strong>V</strong> - "voo"</div>
                <div><strong>Z</strong> - "dzeh-ta"</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex flex-wrap gap-2">
            {PRONUNCIATION_RULES_DATA.map((rule) => (
              <button
                key={rule.id}
                onClick={() => setActiveRule(rule)}
                className={`${buttonCls} ${
                  activeRule.id === rule.id
                    ? "bg-sky-600 text-white"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                }`}
              >
                {rule.title}
              </button>
            ))}
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Rule Explanation */}
          <div className="space-y-6">
            <div className={cardCls}>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {activeRule.title}
              </h2>
              <p className="text-slate-700 mb-6">
                {activeRule.description}
              </p>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-800">Examples</h3>
                {activeRule.examples.map((example, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{example.word}</div>
                      <div className="text-sm text-slate-600">{example.meaning}</div>
                      <div className="text-xs text-slate-500 italic">{example.note}</div>
                    </div>
                    <button
                      onClick={() => speak(example.word)}
                      className="ml-4 p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                      title="Listen to pronunciation"
                    >
                      🔊
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise Types */}
            <div className={cardCls}>
              <h3 className="text-lg font-medium text-slate-800 mb-4">Practice Exercises</h3>
              <div className="space-y-3">
                {EXERCISE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => startExercise(activeRule, type)}
                    className="w-full text-left p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="font-medium text-slate-900">{type.title}</div>
                    <div className="text-sm text-slate-600">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Exercise Area */}
          <div className="space-y-6">
            {currentExercise ? (
              <div className={cardCls}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-slate-800">
                      {exerciseType.title}
                    </h3>
                    <div className="text-xs text-slate-500 mt-1">
                      <span className="inline-flex items-center px-2 py-1 bg-slate-100 rounded mr-2">
                        <kbd className="text-xs">⌘</kbd>+<kbd className="text-xs">L</kbd> Listen
                      </span>
                      <span className="inline-flex items-center px-2 py-1 bg-slate-100 rounded mr-2">
                        <kbd className="text-xs">⌘</kbd>+<kbd className="text-xs">P</kbd> Play
                      </span>
                      <span className="inline-flex items-center px-2 py-1 bg-slate-100 rounded mr-2">
                        <kbd className="text-xs">⌘</kbd>+<kbd className="text-xs">R</kbd> Record
                      </span>
                      <span className="inline-flex items-center px-2 py-1 bg-slate-100 rounded mr-2">
                        <kbd className="text-xs">⌘</kbd>+<kbd className="text-xs">H</kbd> Hints
                      </span>
                      <span className="inline-flex items-center px-2 py-1 bg-slate-100 rounded">
                        <kbd className="text-xs">⌘</kbd>+<kbd className="text-xs">N</kbd> Next
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className={`px-3 py-1 rounded-lg transition-colors text-sm ${
                        showHints 
                          ? "bg-sky-100 text-sky-700 hover:bg-sky-200" 
                          : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      }`}
                    >
                      {showHints ? "Hide Hints" : "Show Hints"}
                    </button>
                    <button
                      onClick={nextExercise}
                      className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                      Next Exercise
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Word to practice */}
                  <div className="text-center p-6 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900 mb-2">
                      {currentExercise.word.word}
                    </div>
                    {showHints && (
                      <div className="text-sm text-slate-600 mb-2">
                        {currentExercise.word.hint}
                      </div>
                    )}
                    {currentExercise.word.meaning && (
                      <div className="text-sm font-medium text-slate-700 mb-4">
                        English: <span className="text-sky-600">{currentExercise.word.meaning}</span>
                      </div>
                    )}
                    <button
                      onClick={() => speak(currentExercise.word.word)}
                      className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                    >
                      🔊 Listen
                    </button>
                  </div>

                  {/* User input area */}
                  <div className="space-y-3">
                    <label className={labelCls}>
                      Your pronunciation (speak or type):
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className={inputCls}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type or speak the word..."
                      />
                      <button
                        onClick={startListening}
                        disabled={isListening}
                        className={`absolute right-3 top-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          isListening
                            ? "bg-red-600 text-white animate-pulse"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        {isListening ? "🎤 Listening..." : "🎤 Speak"}
                      </button>
                    </div>
                  </div>

                  {/* Recording section */}
                  <div className="space-y-3 border-t pt-4">
                    <label className={labelCls}>
                      Record your pronunciation:
                    </label>
                    <div className="flex gap-2 items-center">
                      {!isRecording ? (
                        <button
                          onClick={startRecording}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          🎙️ Start Recording
                        </button>
                      ) : (
                        <button
                          onClick={stopRecording}
                          className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors animate-pulse"
                        >
                          ⏹️ Stop Recording
                        </button>
                      )}
                      
                      {recordedAudio && (
                        <div className="flex gap-2 items-center">
                          <audio controls src={recordedAudio} className="h-10" />
                          <button
                            onClick={clearRecording}
                            className="px-3 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {recordedAudio && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-700 mb-2">
                          <strong>Your recording:</strong> Listen to your pronunciation
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => speak(currentExercise.word.word)}
                            className="flex items-center gap-2 px-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm"
                          >
                            🔊 Hear Correct Pronunciation
                          </button>
                          <span className="text-xs text-blue-600 self-center">
                            Compare with your recording above
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Check button */}
                  <button
                    onClick={checkAnswer}
                    disabled={!userInput.trim()}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      userInput.trim()
                        ? "bg-sky-600 text-white hover:bg-sky-700"
                        : "bg-slate-300 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    Check Answer
                  </button>

                  {/* Result */}
                  {showAnswer && (
                    <div className={`p-4 rounded-lg ${
                      currentExercise.correct
                        ? "bg-emerald-50 border border-emerald-200"
                        : "bg-red-50 border border-red-200"
                    }`}>
                      <div className={`font-medium ${
                        currentExercise.correct ? "text-emerald-800" : "text-red-800"
                      }`}>
                        {currentExercise.correct ? "✅ Correct!" : "❌ Try again"}
                      </div>
                      {!currentExercise.correct && (
                        <div className="text-sm text-slate-600 mt-2">
                          Correct answer: <strong>{currentExercise.word.word}</strong>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={cardCls}>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-lg font-medium text-slate-800 mb-2">
                    Ready to Practice?
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Choose an exercise type to start practicing {activeRule.title.toLowerCase()}
                  </p>
                  <div className="space-y-2">
                    {EXERCISE_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => startExercise(activeRule, type)}
                        className="w-full p-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                      >
                        {type.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pronunciation Tips */}
            <div className={cardCls}>
              <h3 className="text-lg font-medium text-slate-800 mb-4">
                Pronunciation Tips
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start">
                  <span className="text-sky-600 mr-2">•</span>
                  <span>Always pronounce every letter in Italian words</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-600 mr-2">•</span>
                  <span>Vowels are always clear and distinct</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-600 mr-2">•</span>
                  <span>Practice with the audio examples first</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-600 mr-2">•</span>
                  <span>Use speech recognition to check your pronunciation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-600 mr-2">•</span>
                  <span>Repeat exercises until you feel confident</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-500">
          <p>
            Based on Italian pronunciation rules. Practice regularly for best results!
          </p>
        </footer>
      </div>
    </div>
  );
}
