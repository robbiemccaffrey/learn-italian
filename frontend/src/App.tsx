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

// Navigation Component
function Navigation() {
  const location = useLocation();

      const navItems = [
        { path: "/study-hub", label: "Study Hub", icon: "📚" },
        { path: "/verbs", label: "Verb Practice", icon: "📖" },
        { path: "/pronunciation", label: "Pronunciation", icon: "🎤" },
        { path: "/flashcards", label: "Flashcards", icon: "🃏" },
      ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/study-hub" className="flex items-center space-x-2">
              <span className="text-2xl">🇮🇹</span>
              <span className="text-xl font-bold text-slate-900">Learn Italian</span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
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
