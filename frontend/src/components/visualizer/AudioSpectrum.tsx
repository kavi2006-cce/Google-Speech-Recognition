import React, { useEffect, useRef } from 'react';

interface AudioSpectrumProps {
  isRecording: boolean;
  audioStream?: MediaStream | null;
}

export const AudioSpectrum: React.FC<AudioSpectrumProps> = ({ isRecording, audioStream }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array | null = null;

    if (isRecording && audioStream) {
      try {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(audioStream);
        source.connect(analyser);
        analyser.fftSize = 128;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
      } catch (err) {
        console.warn("AudioContext init fallback:", err);
      }
    }

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background subtle grid/gradient
      const bgGlow = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width / 2);
      bgGlow.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
      bgGlow.addColorStop(1, 'rgba(11, 15, 25, 0.0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      const barCount = 48;
      const barWidth = width / barCount - 2;

      if (isRecording && analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray as any);
      }

      for (let i = 0; i < barCount; i++) {
        let val = 15;
        if (isRecording) {
          if (dataArray && i < dataArray.length) {
            val = (dataArray[i] / 255) * height * 0.85;
          } else {
            // Simulated lively spectrum if analyzer fallback
            const time = Date.now() * 0.005;
            val = Math.sin(time + i * 0.2) * (height * 0.35) + (height * 0.4);
          }
        } else {
          val = Math.sin(Date.now() * 0.002 + i * 0.15) * 8 + 12;
        }

        val = Math.max(val, 6);

        const x = i * (barWidth + 2);
        const y = (height - val) / 2;

        // Gradient for spectrum bar
        const barGradient = ctx.createLinearGradient(0, y, 0, y + val);
        if (isRecording) {
          barGradient.addColorStop(0, '#38BDF8');
          barGradient.addColorStop(0.5, '#818CF8');
          barGradient.addColorStop(1, '#C084FC');
        } else {
          barGradient.addColorStop(0, 'rgba(71, 85, 105, 0.5)');
          barGradient.addColorStop(1, 'rgba(30, 41, 59, 0.3)');
        }

        ctx.fillStyle = barGradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, val, [4, 4, 4, 4]);
        ctx.fill();

        // Top glowing cap
        if (isRecording) {
          ctx.fillStyle = '#60A5FA';
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [isRecording, audioStream]);

  return (
    <div className="w-full relative glass-panel rounded-2xl p-4 overflow-hidden border border-indigo-500/20 shadow-xl">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={120} 
        className="w-full h-28 object-contain" 
      />
      {isRecording && (
        <div className="absolute top-3 right-4 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          LIVE MICROPHONE STREAM
        </div>
      )}
    </div>
  );
};
