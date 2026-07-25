import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { SpeechApp } from './pages/SpeechApp';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { History } from './pages/History';
import { Downloads } from './pages/Downloads';
import { Admin } from './pages/Admin';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'speech':
        return <SpeechApp setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'analytics':
        return <Analytics />;
      case 'history':
        return <History setCurrentPage={setCurrentPage} />;
      case 'downloads':
        return <Downloads />;
      case 'admin':
        return <Admin />;
      case 'settings':
      case 'profile':
        return (
          <div className="max-w-4xl mx-auto py-12 px-4 space-y-6 text-slate-100">
            <div className="p-8 rounded-2xl glass-panel border border-indigo-500/20">
              <h2 className="text-2xl font-bold mb-4 text-white">User Settings & Preferences</h2>
              <p className="text-slate-400">Configure your Google Speech API key, language fallbacks, noise reduction thresholds, and workspace audio preferences.</p>
              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-white">Default Speech Language</h3>
                    <p className="text-xs text-slate-400">Primary language selected for new recordings</p>
                  </div>
                  <span className="px-3 py-1 bg-indigo-600/30 text-indigo-300 rounded-lg text-sm border border-indigo-500/30">English (US) - ta-IN / en-IN ready</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-white">Google Speech Recognition Engine</h3>
                    <p className="text-xs text-slate-400">API connection status</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm border border-emerald-500/30">Active & Connected</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
          <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <main className="flex-grow py-8">
            {renderPage()}
          </main>
          <Footer setCurrentPage={setCurrentPage} />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
