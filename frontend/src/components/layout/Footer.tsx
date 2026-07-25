import React from 'react';
import { Mic, Github, Cpu, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  return (
    <footer className="bg-[#080B12] border-t border-indigo-500/10 pt-16 pb-12 mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
                <Mic className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">AURA SPEECH AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise-grade AI Voice Recognition platform powered by Google Speech API, real-time audio analytics, and multilingual stream processing.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> API Operational (99.9% Uptime)
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Product Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => setCurrentPage('speech')} className="hover:text-indigo-400 transition-colors">Speech Recognition Engine</button></li>
              <li><button onClick={() => setCurrentPage('dashboard')} className="hover:text-indigo-400 transition-colors">AI Dashboard</button></li>
              <li><button onClick={() => setCurrentPage('analytics')} className="hover:text-indigo-400 transition-colors">Speech Analytics</button></li>
              <li><button onClick={() => setCurrentPage('history')} className="hover:text-indigo-400 transition-colors">Transcript Storage</button></li>
              <li><button onClick={() => setCurrentPage('downloads')} className="hover:text-indigo-400 transition-colors">Export formats (SRT/VTT/PDF)</button></li>
            </ul>
          </div>

          {/* Features & Tech Stack */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Tech Architecture</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-indigo-400" /> Google Speech Recognition API</li>
              <li className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> React 18 + TypeScript + Vite</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Python FastAPI + JWT Security</li>
              <li>PostgreSQL & Redis Cache Ready</li>
              <li>Docker & Docker Compose Deployment</li>
            </ul>
          </div>

          {/* Multilingual Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Language Engine</h4>
            <p className="text-xs leading-relaxed mb-3">
              Supporting over 40 global languages with instant switching including English, Tamil, Hindi, French, Spanish, German, Japanese, and Chinese.
            </p>
            <button 
              onClick={() => setCurrentPage('speech')}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 font-semibold text-xs hover:bg-indigo-600/30 transition-all text-center"
            >
              Try Voice Recognition Demo
            </button>
          </div>

        </div>

        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 AURA AI Voice Recognition SaaS. Built for Software Engineering Portfolio.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>API Docs</span>
            <span>Security & Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
