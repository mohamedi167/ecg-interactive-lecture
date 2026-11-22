import React, { useEffect, useRef } from 'react';

interface AmbientBackdropProps {
  zeroG: boolean;
}

export const AmbientBackdrop: React.FC<AmbientBackdropProps> = ({ zeroG }) => {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (mediaReduced || !zeroG) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!layerRef.current) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 24;
      const ny = (e.clientY / window.innerHeight - 0.5) * 18;
      layerRef.current.style.transform = `translate3d(${-nx}px, ${-ny}px, 0)`;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [zeroG]);

  const particles = [
    { top: '8%', left: '12%', size: 8, type: 'rbc', delay: '0s' },
    { top: '22%', left: '84%', size: 12, type: 'rbc', delay: '-2s' },
    { top: '38%', left: '18%', size: 6, type: 'dot', delay: '-1.5s' },
    { top: '52%', left: '78%', size: 14, type: 'rbc', delay: '-3.4s' },
    { top: '67%', left: '9%', size: 10, type: 'rbc', delay: '-4.8s' },
    { top: '76%', left: '88%', size: 7, type: 'dot', delay: '-1s' },
    { top: '88%', left: '34%', size: 11, type: 'rbc', delay: '-2.6s' },
    { top: '14%', left: '48%', size: 5, type: 'dot', delay: '-5.2s' },
    { top: '44%', left: '62%', size: 6, type: 'dot', delay: '-0.8s' },
  ];

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Petrol-blue deep atmospheric radial gradients */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 18% 15%, rgba(14, 124, 107, 0.24) 0%, transparent 45%), radial-gradient(circle at 82% 28%, rgba(232, 85, 46, 0.14) 0%, transparent 42%), radial-gradient(circle at 50% 85%, rgba(11, 59, 74, 0.72) 0%, #041921 100%)',
        }}
      />

      {/* Faint background ECG trace lines */}
      <svg
        className="absolute inset-x-0 top-[26%] w-full h-32 opacity-[0.06]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,70 L180,70 L200,58 L220,70 L250,70 L262,82 L276,16 L292,98 L306,70 L345,70 L370,48 L398,70 L620,70 L640,58 L660,70 L690,70 L702,82 L716,16 L732,98 L746,70 L785,70 L810,48 L838,70 L1200,70"
          fill="none"
          stroke="#2DD4BF"
          strokeWidth="2"
        />
      </svg>

      <svg
        className="absolute inset-x-0 top-[68%] w-full h-32 opacity-[0.045]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,70 L260,70 L280,56 L300,70 L330,70 L342,84 L356,14 L372,96 L386,70 L425,70 L452,46 L480,70 L840,70 L860,56 L880,70 L910,70 L922,84 L936,14 L952,96 L966,70 L1005,70 L1032,46 L1060,70 L1200,70"
          fill="none"
          stroke="#E8552E"
          strokeWidth="2"
        />
      </svg>

      {/* Parallax floating particles and stylized red blood cells */}
      <div
        ref={layerRef}
        className="absolute inset-[-32px] transition-transform duration-300 ease-out will-change-transform"
      >
        {particles.map((p, idx) => (
          <div
            key={idx}
            className={`absolute ${idx % 2 === 0 ? 'zg-float-a' : 'zg-float-b'}`}
            style={{
              top: p.top,
              left: p.left,
              animationDelay: p.delay,
            }}
          >
            {p.type === 'rbc' ? (
              <div
                style={{
                  width: `${p.size * 2}px`,
                  height: `${p.size * 1.45}px`,
                }}
                className="rounded-full bg-gradient-to-br from-[#E8552E]/30 to-[#7F1D1D]/45 border border-[#FB7185]/20 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]"
              />
            ) : (
              <div
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                }}
                className="rounded-full bg-[#F2A33A]/25 blur-[0.5px]"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
