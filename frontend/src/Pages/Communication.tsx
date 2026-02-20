import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MaterialsService, { Material } from '../services/materialsService';

export default function Communication() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubContext, setActiveSubContext] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMaterials();
  }, [activeSubContext, searchQuery]);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const response = await MaterialsService.getMaterials({
        context: 'communication',
        search: searchQuery || undefined,
      });
      setMaterials(response.materials);
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const subContexts = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'conversations', label: 'Conversations & Dialogues', icon: '💬' },
    { id: 'grammar-context', label: 'Grammar in Context', icon: '📝' },
    { id: 'exercises', label: 'Speaking Exercises', icon: '🎯' },
  ];

  const filteredMaterials = activeSubContext === 'all'
    ? materials
    : materials.filter(m => {
        if (activeSubContext === 'conversations') {
          return m.category === 'conversation';
        }
        if (activeSubContext === 'grammar-context') {
          return m.category === 'grammar' && m.tags?.includes('grammar');
        }
        if (activeSubContext === 'exercises') {
          return m.category === 'exercise';
        }
        return true;
      });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to="/study-hub" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
            ← Back to Study Hub
          </Link>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            🗣️ Communication
          </h1>
          <p className="text-slate-600">
            Conversations, grammar in context, and speaking practice
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Sub-context Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {subContexts.map((subContext) => (
            <button
              key={subContext.id}
              onClick={() => setActiveSubContext(subContext.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSubContext === subContext.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-blue-50'
              }`}
            >
              <span className="mr-2">{subContext.icon}</span>
              {subContext.label}
            </button>
          ))}
        </div>

        {/* Materials Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading materials...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-600">No materials found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <div
                key={material.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">
                    {material.type === 'image' && '🖼️'}
                    {material.type === 'document' && '📄'}
                    {material.type === 'pdf' && '📕'}
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {material.type}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  {material.filename}
                </h3>
                {material.extractedText && (
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {material.extractedText}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  {material.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={MaterialsService.getMaterialFileUrl(material.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View Material →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
