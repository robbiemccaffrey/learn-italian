import React, { useState, useEffect, useCallback } from "react";
import { CSVImportService } from "../services/csvImportService";

// Flashcard system with Anki-like functionality
// Features: Deck management, CSV upload, spaced repetition, pronunciation

// ====== Types ======
interface Flashcard {
  id: string;
  front: string; // English
  back: string;  // Italian
  deckId: string;
  createdAt: Date;
  lastReviewed?: Date;
  interval: number; // days
  easeFactor: number;
  repetitions: number;
  consecutiveCorrect: number;
}

interface Deck {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  cardCount: number;
  newCardsToday: number;
  reviewCardsToday: number;
}

interface ReviewSession {
  deckId: string;
  cards: Flashcard[];
  currentIndex: number;
  newCards: Flashcard[];
  reviewCards: Flashcard[];
  completedCards: Flashcard[];
}

interface CardEntry {
  id: string;
  italianWord: string;
  englishWord: string;
  italianPhrase: string;
  englishPhrase: string;
  createdAt: Date;
}

// ====== Styling ======
const buttonCls = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2";
const inputCls = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400";
const cardCls = "bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden";

// ====== Main Component ======
export default function Flashcards() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [reviewSession, setReviewSession] = useState<ReviewSession | null>(null);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDeckManager, setShowDeckManager] = useState(false);
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");
  
  // Card Builder state
  const [showCardBuilder, setShowCardBuilder] = useState(false);
  const [cardEntries, setCardEntries] = useState<CardEntry[]>([]);
  const [italianWord, setItalianWord] = useState("");
  const [englishWord, setEnglishWord] = useState("");
  const [italianPhrase, setItalianPhrase] = useState("");
  const [englishPhrase, setEnglishPhrase] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingPhrase, setIsGeneratingPhrase] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CardEntry | null>(null);
  const [masterDeck, setMasterDeck] = useState<Deck | null>(null);
  
  // CSV Import state
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [isImportingCSV, setIsImportingCSV] = useState(false);
  const [csvImportStatus, setCsvImportStatus] = useState<string>("");

  // Load data from localStorage
  useEffect(() => {
    const savedDecks = localStorage.getItem("flashcard-decks");
    const savedCards = localStorage.getItem("flashcard-cards");
    const savedCardEntries = localStorage.getItem("flashcard-entries");
    
    if (savedDecks) {
      const parsedDecks = JSON.parse(savedDecks);
      // Find or create master deck
      let master = parsedDecks.find((d: Deck) => d.name === "Master Deck");
      if (!master) {
        // Create master deck if it doesn't exist
        master = {
          id: "master-deck-" + Date.now(),
          name: "Master Deck",
          description: "All cards from card builder",
          createdAt: new Date(),
          cardCount: 0,
          newCardsToday: 0,
          reviewCardsToday: 0
        };
        const updatedDecks = [...parsedDecks, master];
        setDecks(updatedDecks);
        localStorage.setItem("flashcard-decks", JSON.stringify(updatedDecks));
      } else {
        setDecks(parsedDecks);
      }
      setMasterDeck(master);
    } else {
      // Create master deck if no decks exist
      const newMaster: Deck = {
        id: "master-deck-" + Date.now(),
        name: "Master Deck",
        description: "All cards from card builder",
        createdAt: new Date(),
        cardCount: 0,
        newCardsToday: 0,
        reviewCardsToday: 0
      };
      setDecks([newMaster]);
      setMasterDeck(newMaster);
      localStorage.setItem("flashcard-decks", JSON.stringify([newMaster]));
    }
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    }
    if (savedCardEntries) {
      setCardEntries(JSON.parse(savedCardEntries));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("flashcard-decks", JSON.stringify(decks));
  }, [decks]);

  useEffect(() => {
    localStorage.setItem("flashcard-cards", JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem("flashcard-entries", JSON.stringify(cardEntries));
  }, [cardEntries]);

  // Update deck card counts
  useEffect(() => {
    setDecks(prevDecks => 
      prevDecks.map(deck => ({
        ...deck,
        cardCount: cards.filter(card => card.deckId === deck.id).length
      }))
    );
  }, [cards]);

  // Speech synthesis
  const speak = useCallback((text: string) => {
    if (!text) return;
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "it-IT";
    utterance.rate = 0.7;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech synthesis error:", e);
    }
  }, []);

  // Create new deck
  const createDeck = () => {
    if (!newDeckName.trim()) return;

    const newDeck: Deck = {
      id: Date.now().toString(),
      name: newDeckName.trim(),
      description: newDeckDescription.trim(),
      createdAt: new Date(),
      cardCount: 0,
      newCardsToday: 0,
      reviewCardsToday: 0
    };

    setDecks(prev => [...prev, newDeck]);
    setNewDeckName("");
    setNewDeckDescription("");
    setShowCreateDeck(false);
  };

  // Delete deck
  const deleteDeck = (deckId: string) => {
    if (confirm("Are you sure you want to delete this deck? All cards will be lost.")) {
      setDecks(prev => prev.filter(deck => deck.id !== deckId));
      setCards(prev => prev.filter(card => card.deckId !== deckId));
    }
  };

  // Start review session
  const startReview = (deck: Deck) => {
    const deckCards = cards.filter(card => card.deckId === deck.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Separate new cards and review cards
    const newCards = deckCards.filter(card => !card.lastReviewed);
    const reviewCards = deckCards.filter(card => {
      if (!card.lastReviewed) return false;
      const reviewDate = new Date(card.lastReviewed);
      reviewDate.setDate(reviewDate.getDate() + card.interval);
      return reviewDate <= today;
    });

    const session: ReviewSession = {
      deckId: deck.id,
      cards: [...newCards, ...reviewCards],
      currentIndex: 0,
      newCards,
      reviewCards,
      completedCards: []
    };

    setReviewSession(session);
    setActiveDeck(deck);
    setCurrentCard(session.cards[0] || null);
    setIsFlipped(false);
  };

  // Flip card
  const flipCard = () => {
    if (!isFlipped && currentCard) {
      speak(currentCard.back);
    }
    setIsFlipped(!isFlipped);
  };

  // Rate card (spaced repetition)
  const rateCard = (rating: number) => {
    if (!currentCard || !reviewSession) return;

    const now = new Date();
    let newInterval = currentCard.interval;
    let newEaseFactor = currentCard.easeFactor;
    let newRepetitions = currentCard.repetitions + 1;
    let newConsecutiveCorrect = currentCard.consecutiveCorrect;

    // Spaced repetition algorithm (simplified SM-2)
    if (rating >= 3) { // Correct
      newConsecutiveCorrect += 1;
      
      if (currentCard.repetitions === 0) {
        newInterval = 1;
      } else if (currentCard.repetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(currentCard.interval * currentCard.easeFactor);
      }
      
      newEaseFactor = Math.max(1.3, currentCard.easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02)));
    } else { // Incorrect
      newConsecutiveCorrect = 0;
      newInterval = 1;
      newEaseFactor = Math.max(1.3, currentCard.easeFactor - 0.2);
    }

    // Update card
    const updatedCard: Flashcard = {
      ...currentCard,
      lastReviewed: now,
      interval: newInterval,
      easeFactor: newEaseFactor,
      repetitions: newRepetitions,
      consecutiveCorrect: newConsecutiveCorrect
    };

    setCards(prev => prev.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    ));

    // Move to next card
    const nextIndex = reviewSession.currentIndex + 1;
    if (nextIndex < reviewSession.cards.length) {
      setReviewSession(prev => ({
        ...prev!,
        currentIndex: nextIndex,
        completedCards: [...prev!.completedCards, updatedCard]
      }));
      setCurrentCard(reviewSession.cards[nextIndex]);
      setIsFlipped(false);
    } else {
      // Session complete
      setReviewSession(null);
      setCurrentCard(null);
      setActiveDeck(null);
    }
  };

  // Handle CSV upload
  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const newCards: Flashcard[] = [];

      for (let i = 1; i < lines.length; i++) { // Skip header
        const [front, back] = lines[i].split(',').map(s => s.trim().replace(/"/g, ''));
        if (front && back && activeDeck) {
          newCards.push({
            id: Date.now().toString() + i,
            front,
            back,
            deckId: activeDeck.id,
            createdAt: new Date(),
            interval: 1,
            easeFactor: 2.5,
            repetitions: 0,
            consecutiveCorrect: 0
          });
        }
      }

      setCards(prev => [...prev, ...newCards]);
      setShowCSVUpload(false);
    };

    reader.readAsText(file);
  };

  // Add single card
  const addCard = (front: string, back: string) => {
    if (!front.trim() || !back.trim() || !activeDeck) return;

    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: front.trim(),
      back: back.trim(),
      deckId: activeDeck.id,
      createdAt: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
      consecutiveCorrect: 0
    };

    setCards(prev => [...prev, newCard]);
  };

  // ChatGPT API functions
  const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:9283/api';

  const translateText = async (text: string): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chatgpt/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, sourceLang: 'it', targetLang: 'en' })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.translation;
    } catch (error) {
      console.error('Translation error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend server. Please make sure the backend is running on port 9283.');
      }
      throw error;
    }
  };

  const generatePhrase = async (word: string): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chatgpt/generate-phrase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.phrase;
    } catch (error) {
      console.error('Phrase generation error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend server. Please make sure the backend is running on port 9283.');
      }
      throw error;
    }
  };

  // Auto-translate word when entered
  useEffect(() => {
    if (italianWord.trim() && !editingEntry) {
      const timeoutId = setTimeout(async () => {
        setIsTranslating(true);
        try {
          const translation = await translateText(italianWord.trim());
          setEnglishWord(translation);
        } catch (error) {
          console.error('Auto-translation failed:', error);
        } finally {
          setIsTranslating(false);
        }
      }, 500); // Debounce

      return () => clearTimeout(timeoutId);
    }
  }, [italianWord, editingEntry]);

  // Auto-translate phrase when entered
  useEffect(() => {
    if (italianPhrase.trim() && !editingEntry) {
      const timeoutId = setTimeout(async () => {
        setIsTranslating(true);
        try {
          const translation = await translateText(italianPhrase.trim());
          setEnglishPhrase(translation);
        } catch (error) {
          console.error('Auto-translation failed:', error);
        } finally {
          setIsTranslating(false);
        }
      }, 500); // Debounce

      return () => clearTimeout(timeoutId);
    }
  }, [italianPhrase, editingEntry]);

  // Generate phrase with ChatGPT
  const handleGeneratePhrase = async () => {
    if (!italianWord.trim()) {
      alert('Please enter an Italian word first');
      return;
    }

    setIsGeneratingPhrase(true);
    try {
      const phrase = await generatePhrase(italianWord.trim());
      setItalianPhrase(phrase);
      // Auto-translate the generated phrase
      const translation = await translateText(phrase);
      setEnglishPhrase(translation);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to generate phrase: ${errorMessage}`);
      console.error('Phrase generation error:', error);
    } finally {
      setIsGeneratingPhrase(false);
    }
  };

  // Add entry to card builder
  const addCardEntry = () => {
    if (!italianWord.trim() || !englishWord.trim()) {
      alert('Please enter both Italian and English words');
      return;
    }

    if (editingEntry) {
      // Update existing entry
      setCardEntries(prev => prev.map(entry => 
        entry.id === editingEntry.id
          ? {
              ...entry,
              italianWord: italianWord.trim(),
              englishWord: englishWord.trim(),
              italianPhrase: italianPhrase.trim(),
              englishPhrase: englishPhrase.trim()
            }
          : entry
      ));
      setEditingEntry(null);
    } else {
      // Add new entry
      const newEntry: CardEntry = {
        id: Date.now().toString(),
        italianWord: italianWord.trim(),
        englishWord: englishWord.trim(),
        italianPhrase: italianPhrase.trim(),
        englishPhrase: englishPhrase.trim(),
        createdAt: new Date()
      };
      setCardEntries(prev => [...prev, newEntry]);
    }

    // Clear form
    setItalianWord("");
    setEnglishWord("");
    setItalianPhrase("");
    setEnglishPhrase("");
  };

  // Add all entries to master deck
  const addToMasterDeck = () => {
    if (!masterDeck) {
      alert('Master deck not found. Please create it first.');
      return;
    }

    const newCards: Flashcard[] = cardEntries.map(entry => ({
      id: Date.now().toString() + entry.id,
      front: entry.englishWord + (entry.englishPhrase ? `\n${entry.englishPhrase}` : ''),
      back: entry.italianWord + (entry.italianPhrase ? `\n${entry.italianPhrase}` : ''),
      deckId: masterDeck.id,
      createdAt: new Date(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
      consecutiveCorrect: 0
    }));

    setCards(prev => [...prev, ...newCards]);
    alert(`Added ${newCards.length} cards to Master Deck!`);
  };

  // Edit entry
  const handleEditEntry = (entry: CardEntry) => {
    setEditingEntry(entry);
    setItalianWord(entry.italianWord);
    setEnglishWord(entry.englishWord);
    setItalianPhrase(entry.italianPhrase);
    setEnglishPhrase(entry.englishPhrase);
  };

  // Delete entry
  const handleDeleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setCardEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Italian Word', 'English Word', 'Italian Phrase', 'English Phrase'];
    const rows = cardEntries.map(entry => [
      entry.italianWord,
      entry.englishWord,
      entry.italianPhrase,
      entry.englishPhrase
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flashcard-entries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import CSV files from materials folder
  const handleImportFromMaterials = async () => {
    setIsImportingCSV(true);
    setCsvImportStatus("Importing CSV files from materials folder...");
    setShowCSVImport(true);

    try {
      const summary = await CSVImportService.importAllCSV();
      
      if (summary.successful > 0) {
        // Create decks and cards from imported CSV files
        for (const result of summary.results) {
          if (result.success && result.cards.length > 0) {
            // Check if deck already exists
            let deck = decks.find(d => d.name === result.deckName);
            
            if (!deck) {
              // Create new deck
              deck = {
                id: `csv-deck-${Date.now()}-${result.filename}`,
                name: result.deckName,
                description: `Imported from ${result.filename}`,
                createdAt: new Date(),
                cardCount: 0,
                newCardsToday: 0,
                reviewCardsToday: 0
              };
              setDecks(prev => [...prev, deck!]);
            }

            // Add cards to the deck
            const newCards: Flashcard[] = result.cards.map((card, index) => ({
              id: `${deck!.id}-${Date.now()}-${index}`,
              front: card.front,
              back: card.back,
              deckId: deck!.id,
              createdAt: new Date(),
              interval: 1,
              easeFactor: 2.5,
              repetitions: 0,
              consecutiveCorrect: 0
            }));

            setCards(prev => [...prev, ...newCards]);
          }
        }

        setCsvImportStatus(
          `✅ Successfully imported ${summary.successful} CSV file(s) with ${summary.totalCards} total cards!`
        );
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
          setShowCSVImport(false);
          setCsvImportStatus("");
        }, 3000);
      } else {
        setCsvImportStatus("No CSV files found or all imports failed.");
      }
    } catch (error) {
      console.error('Error importing CSV files:', error);
      setCsvImportStatus(
        `Error: ${error instanceof Error ? error.message : 'Failed to import CSV files'}`
      );
    } finally {
      setIsImportingCSV(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            📚 Flashcard Revision
          </h1>
          <p className="text-slate-600">
            Spaced repetition learning system with Anki-like functionality
          </p>
        </div>

        {!reviewSession ? (
          // Deck Management View
          <div className="space-y-6">
            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-wrap gap-4 justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-800">Your Decks</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCreateDeck(true)}
                    className={`${buttonCls} bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-400`}
                  >
                    ➕ Create Deck
                  </button>
                  <button
                    onClick={() => setShowDeckManager(!showDeckManager)}
                    className={`${buttonCls} bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-400`}
                  >
                    ⚙️ Manage Decks
                  </button>
                  <button
                    onClick={() => setShowCardBuilder(!showCardBuilder)}
                    className={`${buttonCls} ${
                      showCardBuilder 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    } focus:ring-purple-400`}
                  >
                    {showCardBuilder ? '📝 Hide Card Builder' : '✨ Card Builder'}
                  </button>
                  <button
                    onClick={handleImportFromMaterials}
                    disabled={isImportingCSV}
                    className={`${buttonCls} ${
                      isImportingCSV
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    } focus:ring-indigo-400`}
                  >
                    {isImportingCSV ? '⏳ Importing...' : '📥 Import from Materials'}
                  </button>
                </div>
              </div>
            </div>

            {/* CSV Import Status */}
            {showCSVImport && csvImportStatus && (
              <div className={`bg-white rounded-xl shadow-lg p-4 ${
                csvImportStatus.includes('✅') ? 'border-2 border-green-500' : 
                csvImportStatus.includes('Error') ? 'border-2 border-red-500' : 
                'border-2 border-blue-500'
              }`}>
                <p className={csvImportStatus.includes('✅') ? 'text-green-700' : 
                              csvImportStatus.includes('Error') ? 'text-red-700' : 
                              'text-blue-700'}>
                  {csvImportStatus}
                </p>
              </div>
            )}

            {/* Card Builder Section */}
            {showCardBuilder && (
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-slate-800">
                    🎨 Card Builder with ChatGPT
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={exportToCSV}
                      disabled={cardEntries.length === 0}
                      className={`${buttonCls} ${
                        cardEntries.length === 0
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      📥 Export CSV
                    </button>
                    <button
                      onClick={addToMasterDeck}
                      disabled={cardEntries.length === 0}
                      className={`${buttonCls} ${
                        cardEntries.length === 0
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      ➕ Add to Master Deck
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Italian Word *
                    </label>
                    <input
                      type="text"
                      value={italianWord}
                      onChange={(e) => setItalianWord(e.target.value)}
                      className={inputCls}
                      placeholder="Enter Italian word..."
                      disabled={isTranslating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      English Word (Auto-translated)
                      {isTranslating && <span className="text-blue-600 ml-2">⏳ Translating...</span>}
                    </label>
                    <input
                      type="text"
                      value={englishWord}
                      onChange={(e) => setEnglishWord(e.target.value)}
                      className={inputCls}
                      placeholder="Auto-translated..."
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Italian Phrase
                      {italianWord && (
                        <button
                          onClick={handleGeneratePhrase}
                          disabled={isGeneratingPhrase}
                          className="ml-2 px-3 py-1 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-400"
                        >
                          {isGeneratingPhrase ? '⏳ Generating...' : '✨ Generate with ChatGPT'}
                        </button>
                      )}
                    </label>
                    <textarea
                      value={italianPhrase}
                      onChange={(e) => setItalianPhrase(e.target.value)}
                      className={inputCls}
                      placeholder="Enter Italian phrase or generate with ChatGPT..."
                      rows={3}
                      disabled={isTranslating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      English Phrase (Auto-translated)
                      {isTranslating && <span className="text-blue-600 ml-2">⏳ Translating...</span>}
                    </label>
                    <textarea
                      value={englishPhrase}
                      onChange={(e) => setEnglishPhrase(e.target.value)}
                      className={inputCls}
                      placeholder="Auto-translated..."
                      rows={3}
                      readOnly
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={addCardEntry}
                    disabled={!italianWord.trim() || !englishWord.trim()}
                    className={`${buttonCls} ${
                      !italianWord.trim() || !englishWord.trim()
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {editingEntry ? '💾 Update Entry' : '➕ Add Entry'}
                  </button>
                  {editingEntry && (
                    <button
                      onClick={() => {
                        setEditingEntry(null);
                        setItalianWord("");
                        setEnglishWord("");
                        setItalianPhrase("");
                        setEnglishPhrase("");
                      }}
                      className={`${buttonCls} bg-slate-300 text-slate-700 hover:bg-slate-400`}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                {/* Entries Table */}
                {cardEntries.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      Entries ({cardEntries.length})
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="border border-slate-300 px-4 py-2 text-left text-sm font-semibold text-slate-700">
                              Italian Word
                            </th>
                            <th className="border border-slate-300 px-4 py-2 text-left text-sm font-semibold text-slate-700">
                              English Word
                            </th>
                            <th className="border border-slate-300 px-4 py-2 text-left text-sm font-semibold text-slate-700">
                              Italian Phrase
                            </th>
                            <th className="border border-slate-300 px-4 py-2 text-left text-sm font-semibold text-slate-700">
                              English Phrase
                            </th>
                            <th className="border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {cardEntries.map((entry) => (
                            <tr key={entry.id} className="hover:bg-slate-50">
                              <td className="border border-slate-300 px-4 py-2 text-sm text-slate-800">
                                {entry.italianWord}
                              </td>
                              <td className="border border-slate-300 px-4 py-2 text-sm text-slate-800">
                                {entry.englishWord}
                              </td>
                              <td className="border border-slate-300 px-4 py-2 text-sm text-slate-600">
                                {entry.italianPhrase || '-'}
                              </td>
                              <td className="border border-slate-300 px-4 py-2 text-sm text-slate-600">
                                {entry.englishPhrase || '-'}
                              </td>
                              <td className="border border-slate-300 px-4 py-2 text-center">
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={() => handleEditEntry(entry)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                  >
                                    ✏️ Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEntry(entry.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                  >
                                    🗑️ Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Create Deck Modal */}
            {showCreateDeck && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Create New Deck</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Deck Name
                    </label>
                    <input
                      type="text"
                      value={newDeckName}
                      onChange={(e) => setNewDeckName(e.target.value)}
                      className={inputCls}
                      placeholder="Enter deck name..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description (optional)
                    </label>
                    <input
                      type="text"
                      value={newDeckDescription}
                      onChange={(e) => setNewDeckDescription(e.target.value)}
                      className={inputCls}
                      placeholder="Enter description..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={createDeck}
                      className={`${buttonCls} bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-400`}
                    >
                      Create Deck
                    </button>
                    <button
                      onClick={() => setShowCreateDeck(false)}
                      className={`${buttonCls} bg-slate-300 text-slate-700 hover:bg-slate-400 focus:ring-slate-400`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Deck Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {decks.map(deck => (
                <div key={deck.id} className={cardCls}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-1">
                          {deck.name}
                        </h3>
                        {deck.description && (
                          <p className="text-sm text-slate-600 mb-2">
                            {deck.description}
                          </p>
                        )}
                      </div>
                      {showDeckManager && (
                        <button
                          onClick={() => deleteDeck(deck.id)}
                          className="text-rose-600 hover:text-rose-700 text-sm"
                          title="Delete deck"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    
                    <div className="text-sm text-slate-600 mb-4">
                      <div>Cards: {deck.cardCount}</div>
                      <div>Created: {new Date(deck.createdAt).toLocaleDateString()}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startReview(deck)}
                        disabled={deck.cardCount === 0}
                        className={`${buttonCls} flex-1 ${
                          deck.cardCount === 0
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400'
                        }`}
                      >
                        🚀 Study
                      </button>
                      <button
                        onClick={() => {
                          setActiveDeck(deck);
                          setShowCSVUpload(true);
                        }}
                        className={`${buttonCls} bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-400`}
                        title="Upload CSV"
                      >
                        📤
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CSV Upload Modal */}
            {showCSVUpload && activeDeck && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Upload Cards to "{activeDeck.name}"
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      CSV File
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVUpload}
                      className={inputCls}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      CSV format: front,back (English,Italian)
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCSVUpload(false)}
                    className={`${buttonCls} bg-slate-300 text-slate-700 hover:bg-slate-400 focus:ring-slate-400`}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Review Session View
          <div className="max-w-2xl mx-auto">
            {/* Progress */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">
                  {activeDeck?.name}
                </span>
                <span className="text-sm text-slate-600">
                  {reviewSession.currentIndex + 1} / {reviewSession.cards.length}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((reviewSession.currentIndex + 1) / reviewSession.cards.length) * 100}%` 
                  }}
                />
              </div>
            </div>

            {/* Card */}
            {currentCard && (
              <div className={cardCls}>
                <div 
                  className="p-8 min-h-[300px] flex items-center justify-center cursor-pointer"
                  onClick={flipCard}
                >
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-slate-800 mb-4">
                      {isFlipped ? currentCard.back : currentCard.front}
                    </div>
                    <div className="text-sm text-slate-500">
                      {isFlipped ? "Italian" : "English"}
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      Click to flip
                    </div>
                  </div>
                </div>

                {/* Rating Buttons */}
                {isFlipped && (
                  <div className="p-6 bg-slate-50 border-t border-slate-200">
                    <div className="text-center mb-4">
                      <p className="text-sm text-slate-600 mb-2">How well did you know this?</p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => rateCard(1)}
                        className={`${buttonCls} bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-400`}
                        title="Again (1 day)"
                      >
                        Again
                      </button>
                      <button
                        onClick={() => rateCard(2)}
                        className={`${buttonCls} bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-400`}
                        title="Hard (6 days)"
                      >
                        Hard
                      </button>
                      <button
                        onClick={() => rateCard(3)}
                        className={`${buttonCls} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400`}
                        title="Good (spaced)"
                      >
                        Good
                      </button>
                      <button
                        onClick={() => rateCard(4)}
                        className={`${buttonCls} bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-400`}
                        title="Easy (longer spaced)"
                      >
                        Easy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Session Complete */}
            {reviewSession && reviewSession.currentIndex >= reviewSession.cards.length && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  🎉 Session Complete!
                </h2>
                <p className="text-slate-600 mb-6">
                  You've reviewed all cards in this deck.
                </p>
                <button
                  onClick={() => {
                    setReviewSession(null);
                    setCurrentCard(null);
                    setActiveDeck(null);
                  }}
                  className={`${buttonCls} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400`}
                >
                  Back to Decks
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


