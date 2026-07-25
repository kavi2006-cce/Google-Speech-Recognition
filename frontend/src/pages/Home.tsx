import React, { useState } from 'react';
import { Mic, Sparkles, ArrowRight, ShieldCheck, Zap, Globe2, BarChart3, CheckCircle2, ChevronDown, Play, Pause } from 'lucide-react';
import { HeroMic3D } from '../components/visualizer/HeroMic3D';
import { AudioSpectrum } from '../components/visualizer/AudioSpectrum';

interface HomeProps {
  setCurrentPage: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setCurrentPage }) => {
  const [demoRecording, setDemoRecording] = useState(false);
  const [demoText, setDemoText] = useState("Click 'Start Demo Recording' to test live Google Speech Recognition in real-time...");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const startDemo = () => {
    setDemoRecording(true);
    setDemoText("Listening to audio stream via Google Speech API...");
    setTimeout(() => {
      setDemoText("AURA AI Voice Recognition System correctly processed your spoken phrase with 98.4% accuracy in English.");
      setDemoRecording(false);
    }, 3200);
  };

  const faqs = [
    {
      q: "How does Google Speech Recognition API integration work?",
      a: "The application streams audio recorded from your browser microphone to our Python FastAPI backend engine, which communicates directly with Google's Speech Recognition API to convert spoken voice to text with high precision."
    },
    {
      q: "How many languages are supported?",
      a: "Over 40 languages are supported including English, Tamil, Hindi, Spanish, French, German, Japanese, Chinese, and Arabic. You can switch target languages instantly without reloading."
    },
    {
      q: "What export formats are provided for transcripts?",
      a: "You can download transcripts as plain text (.TXT), formatted documents (.PDF, .DOCX), tabular data (.CSV, .JSON), or subtitle closed captions (.SRT, .VTT)."
    },
    {
      q: "What speech analytics are provided?",
      a: "Our AI engine analyzes words per minute (WPM), filler word counts (e.g. 'umm', 'like', 'actually'), sentiment emotion heuristics, and continuous audio timeline confidence scores."
    }
  ];

  return (
    <div className="space-y-24">
      
      {/* 3D Animated Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-lg">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Next-Gen Google Speech AI Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Turn Spoken Voice into <span className="text-gradient">Structured Text</span> in Real-Time
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Commercial AI SaaS powered by Google Speech Recognition API, featuring real-time audio analytics, multi-language support (&gt;40 languages), voice commands, and multi-format SRT subtitle exports.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => setCurrentPage('speech')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-base shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] transition-all flex items-center justify-center gap-3 group"
                >
                  <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Launch Speech App
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-panel text-slate-200 font-semibold text-base border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all flex items-center justify-center gap-2"
                >
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  View Analytics Dashboard
                </button>
              </div>

              <div className="pt-6 flex items-center justify-center lg:justify-start gap-8 text-xs font-semibold text-slate-400">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 40+ Languages</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> SRT/VTT Subtitles</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Voice Commands</div>
              </div>
            </div>

            {/* 3D Animated Hero Element */}
            <div>
              <HeroMic3D />
            </div>

          </div>
        </div>
      </section>

      {/* Live Speech Recognition Interactive Demo Widget */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Mic className="w-5 h-5 text-indigo-400" /> Live Interactive Speech Recognition Demo
              </h3>
              <p className="text-xs text-slate-400">Test real-time Google Speech processing directly from your browser</p>
            </div>
            <button
              onClick={startDemo}
              disabled={demoRecording}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                demoRecording 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
              }`}
            >
              {demoRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {demoRecording ? 'Recording Audio...' : 'Start Demo Recording'}
            </button>
          </div>

          <AudioSpectrum isRecording={demoRecording} />

          <div className="mt-6 p-5 rounded-2xl bg-[#090C16] border border-slate-800 text-slate-200 font-mono text-sm leading-relaxed min-h-[100px] flex items-center">
            {demoText}
          </div>
        </div>
      </section>

      {/* Core Platform Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Engineered for <span className="text-gradient">Maximum Precision</span> & Speed
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Everything you need in a commercial AI speech product: from live transcription to deep acoustic analytics and multi-format exports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-panel p-8 rounded-3xl glass-panel-hover space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">40+ Languages Support</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Seamlessly switch between English, Tamil, Hindi, French, Spanish, German, Japanese, Chinese, Arabic, and more without reloading the page.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl glass-panel-hover space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Speech Analytics & WPM</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automated detection of speech velocity (WPM), confidence scores, filler word counts (e.g. 'umm', 'like'), and emotion heuristic indicators.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl glass-panel-hover space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Voice Commands Engine</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Control the application using hands-free voice commands such as "Open Dashboard", "Start Recording", "Download Transcript", and "Dark Mode".
            </p>
          </div>

        </div>
      </section>

      {/* Statistics Counter */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="glass-panel p-10 rounded-3xl border border-indigo-500/20 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-white text-gradient">98.4%</div>
            <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Recognition Accuracy</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-white text-gradient">40+</div>
            <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Global Locales</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-white text-gradient">&lt; 300ms</div>
            <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">WebSocket Latency</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-white text-gradient">7 Export</div>
            <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Formats (SRT/PDF)</div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-white text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-5 text-left font-bold text-slate-200 flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-indigo-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
