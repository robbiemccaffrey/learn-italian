import { useState } from 'react';
import { Link } from 'react-router-dom';
import { studyContent, StudySection } from '../data/studyContent';

export default function StudyHub() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const totalPhrases = studyContent.reduce(
    (acc, s) => acc + s.subsections.reduce((a, sub) => a + sub.phrases.length, 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-slate-800 mb-1">
            Study Hub
          </h1>
          <p className="text-sm md:text-base text-slate-600">
            {studyContent.length} topics &middot; {totalPhrases} phrases
          </p>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Link
            to="/verbs"
            className="text-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-xl md:text-2xl mb-1">📖</div>
            <div className="text-xs md:text-sm font-medium text-slate-700">Verbs</div>
          </Link>
          <Link
            to="/pronunciation"
            className="text-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-xl md:text-2xl mb-1">🎤</div>
            <div className="text-xs md:text-sm font-medium text-slate-700">Pronunciation</div>
          </Link>
          <Link
            to="/flashcards"
            className="text-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-xl md:text-2xl mb-1">🃏</div>
            <div className="text-xs md:text-sm font-medium text-slate-700">Flashcards</div>
          </Link>
        </div>

        {/* Study Sections */}
        <div className="space-y-3">
          {studyContent.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              isExpanded={expandedSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  section,
  isExpanded,
  onToggle,
}: {
  section: StudySection;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const phraseCount = section.subsections.reduce((a, s) => a + s.phrases.length, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Section Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-lg md:text-xl shrink-0`}
          >
            {section.icon}
          </div>
          <div className="min-w-0">
            <h2 className="text-base md:text-lg font-semibold text-slate-800 truncate">
              {section.title}
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              {section.subsections.length} sections &middot; {phraseCount} phrases
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-100 px-4 pb-4 md:px-5 md:pb-5">
          {section.subsections.map((sub, i) => (
            <div key={i} className={i > 0 ? 'mt-5' : 'mt-4'}>
              <h3 className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                {sub.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {sub.phrases.map((phrase, j) => (
                  <div
                    key={j}
                    className="flex items-baseline justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-indigo-50 transition-colors"
                  >
                    <span className="font-medium text-slate-800 text-sm md:text-base">
                      {phrase.italian}
                    </span>
                    <span className="text-xs md:text-sm text-slate-500 text-right shrink-0">
                      {phrase.english}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
