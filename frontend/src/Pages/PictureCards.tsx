import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { pictureCards, CATEGORIES, type PictureCard } from "../data/pictureCards";

const STORAGE_KEY = "picture-cards-learned";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PictureCards() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learnedIds, setLearnedIds] = useState<Set<string>>(new Set());
  const [deck, setDeck] = useState<PictureCard[]>(pictureCards);
  const [sessionComplete, setSessionComplete] = useState(false);
  // displayedIndex is what's rendered — it lags behind currentIndex
  // so the card text doesn't change until the flip-back finishes
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const isTransitioning = useRef(false);

  // Load learned state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLearnedIds(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  // Persist learned state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...learnedIds]));
  }, [learnedIds]);

  // Filter deck when category changes
  const filteredDeck = useMemo(() => {
    if (activeCategory === "All") return deck;
    return deck.filter((c) => c.category === activeCategory);
  }, [deck, activeCategory]);

  const displayedCard = filteredDeck[displayedIndex] ?? null;

  // Preload upcoming images (5 ahead)
  useEffect(() => {
    for (let i = 1; i <= 5; i++) {
      const upcoming = filteredDeck[currentIndex + i];
      if (upcoming) {
        const img = new Image();
        img.src = upcoming.image;
      }
    }
  }, [currentIndex, filteredDeck]);

  const totalForCategory =
    activeCategory === "All"
      ? pictureCards.length
      : pictureCards.filter((c) => c.category === activeCategory).length;

  const learnedForCategory =
    activeCategory === "All"
      ? learnedIds.size
      : pictureCards.filter(
          (c) => c.category === activeCategory && learnedIds.has(c.id)
        ).length;

  const speak = useCallback((text: string) => {
    if (!text) return;
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "it-IT";
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech synthesis error:", e);
    }
  }, []);

  const flipCard = () => {
    if (!displayedCard || isFlipped || isTransitioning.current) return;
    setIsFlipped(true);
    speak(displayedCard.italian);
    setLearnedIds((prev) => new Set(prev).add(displayedCard.id));
  };

  const nextCard = () => {
    if (isTransitioning.current) return;
    if (currentIndex + 1 >= filteredDeck.length) {
      setSessionComplete(true);
      return;
    }
    // Start flip-back, then swap card content after animation
    isTransitioning.current = true;
    setIsFlipped(false);
    const nextIdx = currentIndex + 1;
    setCurrentIndex(nextIdx);
    setTimeout(() => {
      setDisplayedIndex(nextIdx);
      isTransitioning.current = false;
    }, 350); // matches CSS duration
  };

  const prevCard = () => {
    if (currentIndex <= 0 || isTransitioning.current) return;
    isTransitioning.current = true;
    setIsFlipped(false);
    const prevIdx = currentIndex - 1;
    setCurrentIndex(prevIdx);
    setTimeout(() => {
      setDisplayedIndex(prevIdx);
      isTransitioning.current = false;
    }, 350);
  };

  const handleShuffle = () => {
    setDeck(shuffle(pictureCards));
    setCurrentIndex(0);
    setDisplayedIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
    isTransitioning.current = false;
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentIndex(0);
    setDisplayedIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
    isTransitioning.current = false;
  };

  const resetProgress = () => {
    setLearnedIds(new Set());
    setCurrentIndex(0);
    setDisplayedIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
    isTransitioning.current = false;
  };

  const restartSession = () => {
    setCurrentIndex(0);
    setDisplayedIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
    isTransitioning.current = false;
  };

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (sessionComplete) {
          restartSession();
        } else if (!isFlipped) {
          flipCard();
        } else {
          nextCard();
        }
      } else if (e.key === "ArrowRight" && isFlipped) {
        nextCard();
      } else if (e.key === "ArrowLeft") {
        prevCard();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-24 md:p-8 md:pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Picture Flashcards
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {learnedForCategory}/{totalForCategory} learned
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShuffle}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Shuffle
            </button>
            <button
              onClick={resetProgress}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-sky-100 text-sky-700"
                  : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Session complete screen */}
        {sessionComplete && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Session Complete!
            </h2>
            <p className="text-slate-500 mb-6">
              You've gone through all {filteredDeck.length} cards
              {activeCategory !== "All" ? ` in ${activeCategory}` : ""}.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={restartSession}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-sky-600 text-white hover:bg-sky-700 transition-colors"
              >
                Go Again
              </button>
              <button
                onClick={handleShuffle}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Shuffle & Restart
              </button>
            </div>
          </div>
        )}

        {/* Card */}
        {!sessionComplete && displayedCard && (
          <>
            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>
                  Card {currentIndex + 1} of {filteredDeck.length}
                </span>
                <span className="text-slate-400">{displayedCard.category}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / filteredDeck.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Flip card */}
            <div
              className="cursor-pointer select-none"
              style={{ perspective: "1000px" }}
              onClick={() => {
                if (!isFlipped) flipCard();
                else nextCard();
              }}
            >
              <div
                className="relative w-full transition-transform duration-[350ms] ease-in-out"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  aspectRatio: "4 / 3",
                }}
              >
                {/* Front — photo + English word */}
                <div
                  className="absolute inset-0 rounded-xl shadow-sm border border-slate-200 overflow-hidden bg-white"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <img
                    src={displayedCard.image}
                    alt={displayedCard.english}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                    <span className="text-white text-lg font-semibold">
                      {displayedCard.english}
                    </span>
                  </div>
                  {/* Tap hint */}
                  <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                    Tap to reveal
                  </div>
                </div>

                {/* Back — Italian word + English + speaker */}
                <div
                  className="absolute inset-0 rounded-xl shadow-sm border border-sky-200 bg-gradient-to-b from-sky-50 to-white flex flex-col items-center justify-center p-6"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <span className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-2">
                    {displayedCard.italian}
                  </span>
                  <span className="text-base text-slate-500 mb-4">
                    {displayedCard.english}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(displayedCard.italian);
                    }}
                    className="w-12 h-12 rounded-full bg-sky-600 text-white flex items-center justify-center hover:bg-sky-700 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.788v6.424a.5.5 0 00.757.429l4.964-3.212a.5.5 0 000-.858L7.257 8.36a.5.5 0 00-.757.429z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Back button + hint */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={prevCard}
                disabled={currentIndex === 0}
                className={`text-sm font-medium transition-colors ${
                  currentIndex === 0
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                ← Back
              </button>
              <span className="text-xs text-slate-400">
                {isFlipped ? "Tap to continue" : "Tap to reveal"}
              </span>
            </div>
          </>
        )}

        {filteredDeck.length === 0 && !sessionComplete && (
          <p className="text-center text-slate-400 mt-12">
            No cards in this category.
          </p>
        )}
      </div>
    </div>
  );
}
