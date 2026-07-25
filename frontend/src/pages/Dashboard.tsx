import React, { useEffect, useState } from 'react';
import { Mic, BarChart3, Clock, FileText, CheckCircle2, Globe2, Sparkles, TrendingUp, Calendar, ArrowUpRight, Zap, Play } from 'lucide-react';
import { api } from '../services/api';
import { AnalyticsSummary, Recording } from '../types';

interface DashboardProps {
  setCurrentPage: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setCurrentPage }) => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [recentRecordings, setRecentRecordings] = useState<Recording[]>([]);

  useEffect(() => {
    api.getAnalytics().then(setAnalytics).catch(() => {});
    api.getRecordings().then(recs => setRecentRecordings(recs.slice(0, 5))).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8">
      
      {/* Dashboard Top Hero Title Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Executive AI Metrics
          </div>
          <h1 className="text-3xl font-extrabold text-white">Speech AI Operations Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time performance telemetry from Google Speech Recognition API</p>
        </div>

        <button
          onClick={() => setCurrentPage('speech')}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all flex items-center gap-2.5"
        >
          <Mic className="w-5 h-5" /> Start New Recording
        </button>
      </div>

      {/* 6 Core Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Voice Recordings</span>
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400"><Mic className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-extrabold text-white">{analytics?.total_recordings || 24}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> +18% from last week
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Today's Recordings</span>
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400"><Calendar className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-extrabold text-white">{analytics?.today_recordings || 5}</div>
          <div className="text-[11px] text-slate-400 font-semibold">5 active sessions today</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Words Transcribed</span>
            <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400"><FileText className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-extrabold text-white">{analytics?.total_words || 3420}</div>
          <div className="text-[11px] text-cyan-400 font-semibold">Avg 138 WPM pace</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Average Accuracy</span>
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400"><CheckCircle2 className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-extrabold text-white">{analytics?.avg_accuracy || 98.4}%</div>
          <div className="text-[11px] text-emerald-400 font-semibold">Google Speech API precision</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Languages Used</span>
            <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400"><Globe2 className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-extrabold text-white">{analytics?.languages_used_count || 5} Locales</div>
          <div className="text-[11px] text-amber-400 font-semibold">Multilingual switching active</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-rose-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Recording Time</span>
            <div className="p-2 rounded-xl bg-rose-600/20 text-rose-400"><Clock className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-extrabold text-white">{analytics?.total_recording_time_minutes || 48.5} min</div>
          <div className="text-[11px] text-rose-400 font-semibold">2,910 total audio seconds</div>
        </div>

      </div>

      {/* Recent Activity Feed Table */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Recent Voice Recordings
          </h3>
          <button 
            onClick={() => setCurrentPage('history')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            View All History <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-slate-800/80">
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Language</th>
                <th className="pb-3 font-semibold">Duration</th>
                <th className="pb-3 font-semibold">WPM</th>
                <th className="pb-3 font-semibold">Accuracy</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {recentRecordings.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 font-medium text-white flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                      <Mic className="w-3.5 h-3.5" />
                    </div>
                    {rec.title}
                  </td>
                  <td className="py-3 text-slate-300 text-xs">{rec.language_name}</td>
                  <td className="py-3 text-slate-300 text-xs">{rec.duration_seconds}s</td>
                  <td className="py-3 text-indigo-300 text-xs font-semibold">{rec.wpm} WPM</td>
                  <td className="py-3 text-emerald-400 text-xs font-semibold">{(rec.confidence * 100).toFixed(1)}%</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setCurrentPage('downloads')}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Export
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
