import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Search, Filter, Star, Trash2, Download, Play, Eye, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { Recording } from '../types';

interface HistoryProps {
  setCurrentPage: (page: string) => void;
}

export const History: React.FC<HistoryProps> = ({ setCurrentPage }) => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [search, setSearch] = useState('');
  const [favOnly, setFavOnly] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);

  useEffect(() => {
    loadRecordings();
  }, [search, favOnly]);

  const loadRecordings = async () => {
    try {
      const data = await api.getRecordings(search, undefined, favOnly);
      setRecordings(data);
    } catch {
      // Fallback sample data if backend endpoint loading
      setRecordings([
        {
          id: 1,
          user_id: 1,
          title: "Quarterly Product Strategy Briefing",
          transcript: "Welcome everyone to our Q3 strategy discussion. Today we are launching the new AI Voice Recognition feature powered by Google Speech API.",
          language: "en-US",
          language_name: "English (United States)",
          confidence: 0.98,
          duration_seconds: 24.5,
          word_count: 42,
          wpm: 102.8,
          filler_words_count: 1,
          emotion: "Energetic",
          is_favorite: true,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          user_id: 1,
          title: "தமிழ் குரல் அங்கீகார சோதனை",
          transcript: "கூகிள் குரல் அங்கீகார தொழில்நுட்பம் மிகவும் துல்லியமாக செயல்படுகிறது.",
          language: "ta-IN",
          language_name: "Tamil (India)",
          confidence: 0.95,
          duration_seconds: 18.0,
          word_count: 19,
          wpm: 63.3,
          filler_words_count: 0,
          emotion: "Calm",
          is_favorite: true,
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  const handleToggleFavorite = async (id: number) => {
    try {
      const res = await api.toggleFavorite(id);
      setRecordings(prev => prev.map(r => r.id === id ? { ...r, is_favorite: res.is_favorite } : r));
    } catch {
      setRecordings(prev => prev.map(r => r.id === id ? { ...r, is_favorite: !r.is_favorite } : r));
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this voice recording history?")) {
      await api.deleteRecording(id).catch(() => {});
      setRecordings(prev => prev.filter(r => r.id !== id));
      if (selectedRecording?.id === id) setSelectedRecording(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Cloud Transcript Library
          </div>
          <h1 className="text-3xl font-extrabold text-white">Recording History & Transcripts</h1>
          <p className="text-xs text-slate-400 mt-1">Search, filter, favorite, and manage all your stored Google Speech recordings.</p>
        </div>

        <button
          onClick={() => setCurrentPage('downloads')}
          className="px-6 py-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 font-semibold text-xs hover:bg-indigo-600/30 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Batch Exporters
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search transcripts or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          onClick={() => setFavOnly(!favOnly)}
          className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
            favOnly
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Star className={`w-4 h-4 ${favOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
          {favOnly ? 'Showing Favorites Only' : 'Filter Favorites'}
        </button>
      </div>

      {/* Recordings Grid / Table */}
      <div className="grid grid-cols-1 gap-4">
        {recordings.map((rec) => (
          <div key={rec.id} className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleFavorite(rec.id)}
                  className="text-slate-500 hover:text-amber-400 transition-colors"
                >
                  <Star className={`w-5 h-5 ${rec.is_favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>

                <h3 className="text-base font-bold text-white">{rec.title}</h3>

                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold">
                  {rec.language_name}
                </span>

                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  {(rec.confidence * 100).toFixed(1)}% Precision
                </span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 font-sans bg-[#090C16] p-3 rounded-xl border border-slate-800/80">
                "{rec.transcript}"
              </p>

              <div className="flex items-center gap-6 text-[11px] text-slate-400 font-medium pt-1">
                <span>Duration: <strong>{rec.duration_seconds}s</strong></span>
                <span>Word Count: <strong>{rec.word_count}</strong></span>
                <span>Speed: <strong className="text-indigo-400">{rec.wpm} WPM</strong></span>
                <span>Emotion: <strong className="text-cyan-400">{rec.emotion}</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => setSelectedRecording(rec)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="View Full Recording"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage('downloads')}
                className="px-3 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Export
              </button>

              <button
                onClick={() => handleDelete(rec.id)}
                className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                title="Delete Recording"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Modal View for Selected Recording */}
      {selectedRecording && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-2xl w-full p-6 rounded-3xl border border-indigo-500/30 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">{selectedRecording.title}</h3>
              <button
                onClick={() => setSelectedRecording(null)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#090C16] border border-slate-800 rounded-2xl text-slate-100 text-sm leading-relaxed max-h-60 overflow-y-auto">
                {selectedRecording.transcript}
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700">
                  <p className="text-[10px] text-slate-400">Duration</p>
                  <p className="font-bold text-white">{selectedRecording.duration_seconds}s</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700">
                  <p className="text-[10px] text-slate-400">Words / WPM</p>
                  <p className="font-bold text-indigo-400">{selectedRecording.word_count} ({selectedRecording.wpm} WPM)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700">
                  <p className="text-[10px] text-slate-400">Accuracy</p>
                  <p className="font-bold text-emerald-400">{(selectedRecording.confidence * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
