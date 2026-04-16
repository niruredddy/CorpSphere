import React, { useState, useEffect } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [dots, setDots] = useState('');
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 15000);

    const phaseInterval = setInterval(() => {
      setPhase(p => (p + 1) % 4);
    }, 3500);

    const dotInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => {
      clearTimeout(timer);
      clearInterval(phaseInterval);
      clearInterval(dotInterval);
    };
  }, [onComplete]);

  const phases = [
    "Secure Tenant Isolation Architecture",
    "Real-time Data Aggregation (GitHub v3)",
    "Distributed Discussion Protocols",
    "Organizational Intelligence Layer"
  ];

  return (
    <div className="splash-container">
      <div className="splash-content px-6">
        <div className="relative mb-12 flex justify-center">
            <div className="w-32 h-32 border-4 border-emerald-500/20 rounded-full animate-ping absolute"></div>
            <div className="w-32 h-32 border-t-4 border-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-600">CS</span>
            </div>
        </div>
        
        <h1 className="text-6xl font-black mb-6 tracking-tighter text-white">
          CORP<span className="text-emerald-500">SPHERE</span>
        </h1>

        <div className="max-w-xl mx-auto mb-12 space-y-4">
            <p className="text-zinc-400 text-xl font-light leading-relaxed">
              Empowering global organizations with <span className="text-white font-medium">private, high-performance directories</span> and integrated real-time collaboration tools.
            </p>
            <p className="text-zinc-500 text-sm uppercase tracking-[0.3em] font-bold">
              Secure • Scalable • Intelligent
            </p>
        </div>
        
        <div className="flex flex-col items-center gap-6">
            <div className="h-0.5 w-64 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 animate-[progress_15s_linear_forwards]"></div>
            </div>
            
            <div className="text-emerald-500 font-mono text-xs tracking-widest uppercase transition-all duration-500 min-h-[1.5em]">
                {phases[phase]} {dots}
            </div>
        </div>

        <div className="mt-20 text-zinc-600 text-[10px] uppercase tracking-widest">
            CorpSphere OS v4.0.2 // Initializing Kernal v26.4
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
