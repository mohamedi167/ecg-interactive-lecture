import React, { useEffect, useRef } from 'react';

interface LiveEcgMonitorProps {
  bpm?: number;
  irregular?: boolean;
  strokeColor?: string;
  height?: number;
  className?: string;
  label?: string;
}

export function sampleEcgValue(phase: number): number {
  // P wave
  const p = 0.16 * Math.exp(-Math.pow((phase - 0.14) / 0.032, 2));
  // Q dip
  const q = -0.14 * Math.exp(-Math.pow((phase - 0.275) / 0.012, 2));
  // R spike
  const r = 1.0 * Math.exp(-Math.pow((phase - 0.305) / 0.014, 2));
  // S dip
  const s = -0.26 * Math.exp(-Math.pow((phase - 0.338) / 0.014, 2));
  // T wave (asymmetric)
  const t = 0.28 * Math.exp(-Math.pow((phase - 0.56) / 0.055, 2));
  return p + q + r + s + t;
}

export const LiveEcgMonitor: React.FC<LiveEcgMonitorProps> = ({
  bpm = 72,
  irregular = false,
  strokeColor = '#2DD4BF',
  height = 96,
  className = '',
  label,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const configRef = useRef({ bpm, irregular, strokeColor });

  useEffect(() => {
    configRef.current = { bpm, irregular, strokeColor };
  }, [bpm, irregular, strokeColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frameId = 0;
    let offset = 0;
    let lastTime = performance.now();

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      canvas.width = Math.max(200, Math.floor(w * dpr));
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const irregularBeatOffsets = [0, 0.72, 1.35, 2.25, 2.86, 3.74, 4.35, 5.18];

    const renderFrame = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const { bpm: curBpm, irregular: isIrreg, strokeColor: color } = configRef.current;
      const w = canvas.clientWidth || 300;
      const h = height;
      const baseline = h * 0.64;
      const amp = h * 0.48;

      if (!prefersReduced) {
        offset += dt * (curBpm / 60) * 140;
      }

      ctx.clearRect(0, 0, w, h);

      // Subtle background grid
      ctx.strokeStyle = 'rgba(232, 85, 46, 0.12)';
      ctx.lineWidth = 1;
      const step = 20;
      for (let gx = 0; gx < w; gx += step) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += step) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      // Draw ECG waveform
      const cycleWidth = Math.max(95, (60 / curBpm) * 150);
      ctx.beginPath();
      ctx.lineWidth = 2.2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;

      for (let x = 0; x <= w; x += 2) {
        const worldX = x + offset;
        let val = 0;

        if (!isIrreg) {
          const phase = (worldX % cycleWidth) / cycleWidth;
          val = sampleEcgValue(phase);
        } else {
          // Irregular R-R intervals without clear P waves (AFib-like)
          const period = 680;
          const pos = (worldX % period) / 115;
          val = Math.sin(worldX * 0.19) * 0.035 + Math.cos(worldX * 0.31) * 0.025;
          for (let i = 0; i < irregularBeatOffsets.length; i++) {
            const b = irregularBeatOffsets[i];
            const dist = pos - b;
            if (Math.abs(dist) < 0.45) {
              const p = dist + 0.3;
              if (p > 0.22 && p < 0.72) {
                val +=
                  -0.12 * Math.exp(-Math.pow((p - 0.275) / 0.012, 2)) +
                  0.96 * Math.exp(-Math.pow((p - 0.305) / 0.014, 2)) -
                  0.24 * Math.exp(-Math.pow((p - 0.338) / 0.014, 2)) +
                  0.22 * Math.exp(-Math.pow((p - 0.54) / 0.055, 2));
              }
            }
          }
        }

        const y = baseline - val * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (!prefersReduced) {
        frameId = requestAnimationFrame(renderFrame);
      }
    };

    frameId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
    };
  }, [height]);

  return (
    <div className={`relative w-full overflow-hidden rounded-xl bg-[#041921]/90 border border-white/10 ${className}`}>
      {label && (
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 text-[11px] text-[#9CBAC4]">
          <span>{label}</span>
          <span className="font-mono-num text-[#F2A33A]" dir="ltr">
            {irregular ? 'Irregular R-R' : `${bpm} BPM`}
          </span>
        </div>
      )}
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  );
};
