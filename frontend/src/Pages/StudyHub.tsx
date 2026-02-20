import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MaterialsService from '../services/materialsService';

export default function StudyHub() {
  const [materialsAvailable, setMaterialsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [materialCount, setMaterialCount] = useState(0);

  useEffect(() => {
    // Check if materials are available
    const checkMaterials = async () => {
      try {
        const available = await MaterialsService.checkMaterialsAvailable();
        setMaterialsAvailable(available);

        if (available) {
          const status = await MaterialsService.getProcessingStatus();
          setMaterialCount(status.materialCount);
        } else {
          // Poll until materials are ready
          pollUntilReady();
        }
      } catch (error) {
        console.error('Error checking materials:', error);
        setMaterialsAvailable(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMaterials();
  }, []);

  // Auto-poll until materials ready (every 3 seconds)
  const pollUntilReady = () => {
    const interval = setInterval(async () => {
      try {
        const available = await MaterialsService.checkMaterialsAvailable();
        if (available) {
          clearInterval(interval);
          setMaterialsAvailable(true);
          const status = await MaterialsService.getProcessingStatus();
          setMaterialCount(status.materialCount);
        }
      } catch (error) {
        console.error('Error polling materials:', error);
      }
    }, 3000);

    // Cleanup after 5 minutes
    setTimeout(() => clearInterval(interval), 5 * 60 * 1000);
  };

  const contextCards = [
    {
      title: 'Daily Life',
      description: 'Food & Dining, Shopping & Services, Daily Routines',
      icon: '🍝',
      path: '/daily-life',
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Communication',
      description: 'Conversations, Grammar in Context, Speaking Exercises',
      icon: '🗣️',
      path: '/communication',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Deep Dive',
      description: 'Grammar Reference, Vocabulary Builder, Culture & Reading',
      icon: '📚',
      path: '/deep-dive',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      title: 'Resources',
      description: 'Reference Books, Lesson Notes',
      icon: '📖',
      path: '/resources',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading Study Hub...</p>
        </div>
      </div>
    );
  }

  if (materialsAvailable === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Loading Materials...</h2>
          <p className="text-slate-600 mb-6">
            Your study materials are being processed. This may take a few minutes.
          </p>
          <div className="animate-pulse">
            <div className="h-2 bg-purple-200 rounded-full mb-2"></div>
            <div className="h-2 bg-purple-200 rounded-full"></div>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            You can continue using other pages while materials load.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            📚 Study Hub
          </h1>
          <p className="text-slate-600">
            Your Italian learning materials organized by context
          </p>
          {materialCount > 0 && (
            <p className="text-sm text-slate-500 mt-2">
              {materialCount} materials available
            </p>
          )}
        </div>

        {/* Context Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {contextCards.map((card) => (
            <Link
              key={card.path}
              to={card.path}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow transform hover:scale-105"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${card.color} flex items-center justify-center text-3xl mb-4`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {card.title}
              </h3>
              <p className="text-slate-600 text-sm">
                {card.description}
              </p>
              <div className="mt-4 text-purple-600 font-medium">
                Explore →
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/flashcards"
              className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="text-2xl mb-2">🃏</div>
              <div className="text-sm font-medium text-slate-700">Flashcards</div>
            </Link>
            <Link
              to="/verbs"
              className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="text-2xl mb-2">📚</div>
              <div className="text-sm font-medium text-slate-700">Verb Practice</div>
            </Link>
            <Link
              to="/pronunciation"
              className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="text-2xl mb-2">🎤</div>
              <div className="text-sm font-medium text-slate-700">Pronunciation</div>
            </Link>
            <Link
              to="/video-practice"
              className="text-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <div className="text-2xl mb-2">🎥</div>
              <div className="text-sm font-medium text-slate-700">Video Practice</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
