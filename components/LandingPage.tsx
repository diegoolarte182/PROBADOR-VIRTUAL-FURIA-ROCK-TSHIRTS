import React, { useEffect, useState } from 'react';
import { ChevronRight, Zap, Radio, Skull, HandMetal, Truck, Printer, Shirt } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

// Improved Lightning Bolt Component
const LightningBolt = () => {
    const [style, setStyle] = useState<React.CSSProperties>({});
    const [flashStyle, setFlashStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        // Randomize timing and position
        const randomDelay = Math.random() * 5;
        const randomDuration = 4 + Math.random() * 3; // Slower cadence
        const randomLeft = Math.random() * 80; // Keep slightly within bounds
        const randomTop = Math.random() * 30;
        
        // Adjusted Scale: Smaller than previous "Massive" version, but clearly visible
        const randomScale = 1 + Math.random() * 1.5; // Range: 1.0x to 2.5x
        
        const randomRotation = Math.random() * 30 - 15;
        
        setStyle({
            left: `${randomLeft}%`,
            top: `${randomTop}%`,
            animationDelay: `${randomDelay}s`,
            animationDuration: `${randomDuration}s`,
            transform: `scale(${randomScale}) rotate(${randomRotation}deg)`,
        });

        // Sync flash with bolt
        setFlashStyle({
            animationDelay: `${randomDelay}s`,
            animationDuration: `${randomDuration}s`,
        });
    }, []);

    return (
        <>
            {/* Screen Flash Effect (Illumination) */}
            <div 
                className="absolute inset-0 bg-purple-300/10 mix-blend-color-dodge pointer-events-none z-0 opacity-0 animate-lightning"
                style={flashStyle}
            />

            {/* The Bolt */}
            <div className="absolute w-[500px] h-[500px] pointer-events-none z-0 opacity-0 animate-lightning origin-top" style={style}>
                {/* SVG Bolt */}
                <svg viewBox="0 0 100 200" className="w-full h-full overflow-visible drop-shadow-[0_0_50px_#d8b4fe]">
                    <path d="M50,0 L30,70 L70,70 L20,150 L60,150 L10,240" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {/* Glow Bloom */}
                <div className="absolute inset-0 bg-purple-600/30 blur-[80px] rounded-full transform scale-150"></div>
            </div>
        </>
    );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  
  // Background Icons (Increased visibility significantly)
  const bgIcons = Array.from({ length: 20 }).map((_, i) => {
     const Icon = [Zap, Radio, Skull, HandMetal][i % 4];
     return (
         <div 
            key={i} 
            // Removed mix-blend-screen for better visibility
            // Increased opacity to 0.5
            // Lighter color (slate-600)
            className="absolute text-slate-600 opacity-50 pointer-events-none animate-float"
            style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `rotate(${Math.random() * 360}deg) scale(${0.8 + Math.random()})`
            }}
         >
             <Icon size={60 + Math.random() * 80} strokeWidth={1.5} />
         </div>
     );
  });

  return (
    <div className="h-screen w-screen bg-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background Layer with Lightning */}
      <div className="absolute inset-0 z-0 overflow-hidden">
          {bgIcons}
          {/* Lightning Bolts */}
          <LightningBolt />
          <LightningBolt />
          <LightningBolt />
      </div>

      {/* Radial Gradient for focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_90%)] z-0 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center max-w-5xl px-6 w-full animate-in fade-in zoom-in duration-700">
        
        {/* OFFICIAL LOGO RECONSTRUCTION */}
        <div className="mb-6 relative w-60 h-64 md:w-72 md:h-80 drop-shadow-[0_0_60px_rgba(255,255,255,0.15)]">
            <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
                <defs>
                    <radialGradient id="redEye" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#ff5555" />
                        <stop offset="100%" stopColor="#ff0000" />
                    </radialGradient>
                    <filter id="eyeGlow">
                         <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                         <feMerge>
                             <feMergeNode in="coloredBlur"/>
                             <feMergeNode in="SourceGraphic"/>
                         </feMerge>
                     </filter>
                </defs>

                {/* --- HEAD GROUP --- */}
                <g>
                    {/* CRANIUM BASE (White) */}
                    {/* This shape mimics the outer contour of the skull head */}
                    <path 
                        d="M 100,20 
                           C 60,20 20,50 20,100
                           C 20,120 25,135 30,145
                           L 35,160
                           L 100,165 
                           L 165,160
                           L 170,145
                           C 175,135 180,120 180,100
                           C 180,50 140,20 100,20 Z"
                        fill="#f1f5f9"
                    />

                    {/* TEMPLE CUTS (Black Overlay) */}
                    {/* Left Temple Cut - Sharp hook shape */}
                    <path d="M 20,80 Q 45,95 35,130 L 20,100 Z" fill="#020617" />
                    {/* Extra tribal detail left */}
                    <path d="M 28,95 Q 40,105 32,125 Z" fill="#020617" />

                    {/* Right Temple Cut - Mirror */}
                    <path d="M 180,80 Q 155,95 165,130 L 180,100 Z" fill="#020617" />
                    {/* Extra tribal detail right */}
                    <path d="M 172,95 Q 160,105 168,125 Z" fill="#020617" />

                    {/* EYES (Black Sockets) */}
                    {/* Left Eye - Angular */}
                    <path d="M 45,115 L 90,125 L 85,145 L 45,135 Z" fill="#020617" />
                    {/* Right Eye - Angular */}
                    <path d="M 155,115 L 110,125 L 115,145 L 155,135 Z" fill="#020617" />
                    
                    {/* GLOWING PUPILS */}
                    <circle cx="65" cy="130" r="3" fill="url(#redEye)" filter="url(#eyeGlow)" className="animate-pulse" />
                    <circle cx="135" cy="130" r="3" fill="url(#redEye)" filter="url(#eyeGlow)" className="animate-pulse" />

                    {/* NOSE (Black Triangle) */}
                    <path d="M 100,145 L 92,160 L 108,160 Z" fill="#020617" />
                </g>

                {/* --- JAW GROUP (Animated) --- */}
                <g className="animate-laugh-evil origin-[100px_160px]">
                    {/* Jaw Base (White Trapezoid) */}
                    <path 
                        d="M 50,170 
                           L 150,170 
                           L 135,220 
                           L 65,220 
                           Z" 
                        fill="#f1f5f9"
                    />
                    
                    {/* TEETH (Black Lines) */}
                    <line x1="70" y1="170" x2="70" y2="200" stroke="#020617" strokeWidth="3" />
                    <line x1="85" y1="170" x2="85" y2="210" stroke="#020617" strokeWidth="3" />
                    <line x1="100" y1="170" x2="100" y2="215" stroke="#020617" strokeWidth="3" />
                    <line x1="115" y1="170" x2="115" y2="210" stroke="#020617" strokeWidth="3" />
                    <line x1="130" y1="170" x2="130" y2="200" stroke="#020617" strokeWidth="3" />
                </g>

            </svg>
        </div>

        {/* Header Text */}
        <div className="space-y-2 text-center relative z-20">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-white to-neon-pink drop-shadow-[0_0_15px_rgba(176,38,255,0.8)]">
                FURIA ROCK
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-300 tracking-[0.2em] uppercase">
                T-Shirts
            </h2>
        </div>

        {/* PROBADOR VIRTUAL BIG TEXT */}
        <div className="mt-8 mb-6 transform -rotate-2">
            <span className="bg-neon-cyan text-black px-6 py-2 text-3xl md:text-5xl font-black uppercase tracking-tighter shadow-[0_0_30px_rgba(0,247,255,0.6)] animate-pulse border-2 border-white">
                ¡Probador Virtual!
            </span>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl text-center font-light leading-relaxed">
          Crea tu propio diseño brutal, personaliza cada detalle y <span className="text-neon-pink font-bold">sube tu foto</span> para ver cómo te queda esa prenda legendaria.
        </p>

        {/* CTA Button */}
        <div className="mt-10">
            <button 
            onClick={onStart}
            className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-neon-purple to-neon-pink text-white px-12 py-6 font-black text-2xl md:text-3xl uppercase tracking-widest rounded-full transition-all duration-300 shadow-[0_0_50px_-10px_rgba(176,38,255,0.8)] hover:shadow-[0_0_80px_-5px_rgba(176,38,255,1)] animate-heartbeat hover:scale-110"
            >
                <span>Personaliza tu Idea</span>
                <div className="bg-white text-black rounded-full p-2 group-hover:rotate-12 transition-transform">
                    <ChevronRight size={28} strokeWidth={3} />
                </div>
            </button>
        </div>

        {/* Features Grid */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 text-slate-400">
            <div className="flex flex-col items-center gap-2 group">
                <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl group-hover:border-neon-purple transition-colors">
                    <Printer size={24} className="text-neon-purple" />
                </div>
                <span className="text-xs uppercase tracking-widest font-bold">Impresión DTG & DTF</span>
            </div>
            <div className="flex flex-col items-center gap-2 group">
                <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl group-hover:border-neon-pink transition-colors">
                    <Shirt size={24} className="text-neon-pink" />
                </div>
                <span className="text-xs uppercase tracking-widest font-bold">Algodón Premium</span>
            </div>
            <div className="flex flex-col items-center gap-2 group">
                <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl group-hover:border-neon-cyan transition-colors">
                    <Truck size={24} className="text-neon-cyan" />
                </div>
                <span className="text-xs uppercase tracking-widest font-bold">Envíos Nacionales</span>
            </div>
        </div>

      </div>

      <div className="absolute bottom-4 text-slate-600 text-[10px] uppercase tracking-widest">
        Estampa tu idea • Furia Rock Colombia
      </div>
    </div>
  );
};