import VerbPractice from "./Pages/VerbPractice";
import Pronunciation from "./Pages/Pronunciation";
import Flashcards from "./Pages/Flashcards";
import StudyHub from "./Pages/StudyHub";
import DailyLife from "./Pages/DailyLife";
import Communication from "./Pages/Communication";
import DeepDive from "./Pages/DeepDive";
import Resources from "./Pages/Resources";
import "./App.css";

import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/study-hub", label: "Study Hub", icon: "📚" },
  { path: "/verbs", label: "Verbs", icon: "📖" },
  { path: "/pronunciation", label: "Pronounce", icon: "🎤" },
  { path: "/flashcards", label: "Flashcards", icon: "🃏" },
];

function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname === "/" ? "/study-hub" : location.pathname;

  return (
    <>
      {/* Desktop top nav */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 md:h-16">
            <div className="flex items-center">
              <Link to="/study-hub" className="flex items-center space-x-2">
                <span className="text-xl md:text-2xl">🇮🇹</span>
                <span className="text-lg md:text-xl font-bold text-slate-900">Learn Italian</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPath === item.path
                      ? "bg-sky-100 text-sky-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden z-50">
        <div className="flex justify-around items-center h-16 px-2 safe-area-bottom">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-colors ${
                currentPath === item.path
                  ? "text-sky-600"
                  : "text-slate-400 active:text-slate-600"
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<StudyHub />} />
          <Route path="/study-hub" element={<StudyHub />} />
          <Route path="/daily-life" element={<DailyLife />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/deep-dive" element={<DeepDive />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/verbs" element={<VerbPractice />} />
          <Route path="/pronunciation" element={<Pronunciation />} />
          <Route path="/flashcards" element={<Flashcards />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
