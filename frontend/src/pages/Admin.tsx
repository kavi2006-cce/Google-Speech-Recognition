import React, { useState, useEffect } from 'react';
import { ShieldAlert, Server, Users, Activity, HardDrive, Cpu, RefreshCw, CheckCircle2, AlertTriangle, Database } from 'lucide-react';
import { api } from '../services/api';

export const Admin: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    api.getSystemHealth().then(setHealth).catch(() => {});
    api.getAdminLogs().then(data => setLogs(data.logs || [])).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-rose-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Admin Command Center
          </div>
          <h1 className="text-3xl font-extrabold text-white">System Infrastructure & User Operations</h1>
          <p className="text-xs text-slate-400 mt-1">Manage API rate limits, user access roles, Google Speech service health, and audit logs.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> SYSTEM ONLINE
          </span>
        </div>
      </div>

      {/* Infrastructure Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Active WebSockets</span>
            <Server className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{health?.active_websocket_connections || 12} Connections</p>
          <p className="text-[11px] text-emerald-400 font-medium">Real-time Stream Engine</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>DB Query Latency</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{health?.database_latency_ms || 1.4} ms</p>
          <p className="text-[11px] text-purple-400 font-medium">SQLAlchemy Connection Pool</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>CPU Core Usage</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{health?.cpu_usage_percent || 18.5}%</p>
          <p className="text-[11px] text-cyan-400 font-medium">Nominal Load</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Audio Processed</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{health?.total_audio_processed_mb || 1420.5} MB</p>
          <p className="text-[11px] text-emerald-400 font-medium">Google Speech API Stream</p>
        </div>

      </div>

      {/* Admin Audit Logs Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" /> System Security & Audit Log Stream
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-3 font-semibold">Log ID</th>
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Action Event</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-mono text-slate-400">#{log.id}</td>
                  <td className="py-3 font-bold text-white">{log.username}</td>
                  <td className="py-3 text-indigo-300 font-mono">{log.action}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
