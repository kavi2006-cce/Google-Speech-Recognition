import React, { useEffect, useRef } from 'react';
import { Mic, Sparkles, Activity, ShieldCheck, Zap } from 'lucide-react';

export const HeroMic3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);
      angle += 0.015;

      // Outer Glowing Ring 1
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.arc(0, 0, 110, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 18]);
      ctx.stroke();
      ctx.restore();

      // Outer Glowing Ring 2
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-angle * 0.7);
      ctx.beginPath();
      ctx.arc(0, 0, 135, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 14]);
      ctx.stroke();
      ctx.restore();

      // Floating particles around orb
      for (let i = 0; i < 16; i++) {
        const pAngle = angle + (i * Math.PI) / 8;
        const radius = 90 + Math.sin(angle * 2 + i) * 20;
        const px = cx + Math.cos(pAngle) * radius;
        const py = cy + Math.sin(pAngle) * radius;

        ctx.fillStyle = i % 2 === 0 ? '#38BDF8' : '#C084FC';
        ctx.beginPath();
        ctx.arc(px, py, 2.5 + Math.sin(angle + i) * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Core Glowing AI Orb
      const orbGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 80);
      orbGrad.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
      orbGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.4)');
      orbGrad.addColorStop(1, 'rgba(11, 15, 25, 0)');

      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 85, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full max-w-lg aspect-square mx-auto flex items-center justify-center">
      {/* Interactive 3D Canvas Background */}
      <canvas 
        ref={canvasRef} 
        width={450} 
        height={450} 
        className="absolute inset-0 w-full h-full pointer-events-none" 
      />

      {/* Central 3D Floating Mic Badge */}
      <div className="relative z-10 w-44 h-44 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 p-[3px] shadow-[0_0_60px_rgba(99,102,241,0.5)] animate-float">
        <div className="w-full h-full rounded-full bg-[#0B0F19] flex flex-col items-center justify-center p-6 border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <Mic className="w-20 h-20 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.8)] transition-transform duration-500 group-hover:scale-110" />
          
          <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-cyan-400 tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-cyan-300" /> GOOGLE SPEECH AI
          </div>
        </div>
      </div>

      {/* Floating Glass Badges around the 3D Mic */}
      <div className="absolute top-4 left-4 glass-panel px-4 py-2 rounded-xl flex items-center gap-2.5 border border-indigo-500/30 text-xs font-semibold shadow-lg animate-pulse-slow">
        <Activity className="w-4 h-4 text-emerald-400" />
        <div>
          <p className="text-[10px] text-slate-400">Speech Accuracy</p>
          <p className="text-slate-100 font-bold">98.4% Precision</p>
        </div>
      </div>

      <div className="absolute bottom-6 right-4 glass-panel px-4 py-2 rounded-xl flex items-center gap-2.5 border border-purple-500/30 text-xs font-semibold shadow-lg">
        <Zap className="w-4 h-4 text-amber-400" />
        <div>
          <p className="text-[10px] text-slate-400">Language Engine</p>
          <p className="text-slate-100 font-bold">40+ Languages</p>
        </div>
      </div>

      <div className="absolute top-12 right-0 glass-panel px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium border border-cyan-500/30 text-cyan-300">
        <ShieldCheck className="w-4 h-4 text-cyan-400" /> JWT Encrypted
      </div>
    </div>
  );
};
