import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Code, Film, CheckCircle2, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { ExportFormat } from '../types';

export const Downloads: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('srt');
  const [downloading, setDownloading] = useState(false);

  const exportFormats = [
    { id: 'srt', name: 'SRT Subtitles', desc: 'SubRip Subtitle format with precise timestamps for video editing.', icon: Film, badge: 'Popular' },
    { id: 'vtt', name: 'WebVTT Captions', desc: 'Web closed-caption standard format for HTML5 video players.', icon: Film, badge: 'Video' },
    { id: 'pdf', name: 'PDF Document', desc: 'Formatted printable PDF document with session metadata.', icon: FileText, badge: 'Print' },
    { id: 'docx', name: 'Word (.DOCX)', desc: 'Editable Microsoft Word document for professional reports.', icon: FileText, badge: 'Office' },
    { id: 'txt', name: 'Plain Text (.TXT)', desc: 'Clean unformatted raw text transcript file.', icon: FileText, badge: 'Light' },
    { id: 'csv', name: 'Spreadsheet (.CSV)', desc: 'Tabular CSV file containing timestamps, speaker tags, and WPM.', icon: FileSpreadsheet, badge: 'Data' },
    { id: 'json', name: 'JSON Metadata', desc: 'Structured JSON data payload including analytics and confidence.', icon: Code, badge: 'API' },
  ];

  const handleDownload = () => {
    setDownloading(true);
    const downloadUrl = api.getExportUrl(1, selectedFormat);
    
    // Create hidden anchor trigger
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `transcript_export.${selectedFormat}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloading(false), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-8">
      
      {/* Downloads Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Multi-Format SaaS Exporter
        </div>
        <h1 className="text-3xl font-extrabold text-white">Transcript Export & Subtitle Center</h1>
        <p className="text-xs text-slate-400 mt-1">Convert spoken speech recordings into production-ready captions and reports.</p>
      </div>

      {/* Formats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exportFormats.map((fmt) => {
          const Icon = fmt.icon;
          const isSelected = selectedFormat === fmt.id;
          return (
            <div
              key={fmt.id}
              onClick={() => setSelectedFormat(fmt.id as ExportFormat)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                  : 'glass-panel border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{fmt.name}</h3>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700">
                  {fmt.badge}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{fmt.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Download Action Trigger Box */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Selected Format: <span className="text-gradient uppercase">{selectedFormat}</span></h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Your transcript will be compiled with automated speaker timestamps, accuracy metrics, and metadata.
        </p>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white font-bold text-base shadow-xl transition-all inline-flex items-center gap-3"
        >
          <Download className="w-5 h-5" />
          {downloading ? 'Compiling File...' : `Download .${selectedFormat.toUpperCase()} Transcript`}
        </button>
      </div>

    </div>
  );
};
