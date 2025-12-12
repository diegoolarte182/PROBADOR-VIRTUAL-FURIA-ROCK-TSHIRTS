import React from 'react';
import { ViewAngle } from '../types';

interface TShirtSVGProps {
  view: ViewAngle;
  color: string;
  className?: string;
  id?: string;
  mode?: 'base' | 'shadows'; // New prop to control render mode
}

export const TShirtSVG: React.FC<TShirtSVGProps> = ({ view, color, className, id, mode = 'base' }) => {
  
  // -- DEFINITIONS & FILTERS --
  const Defs = () => (
    <defs>
      {/* 1. Cotton Texture: Fine grain */}
      <filter id="cottonTexture">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" result="noise"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.6  0 0 0 0 0.6  0 0 0 0 0.6  0 0 0 0.1 0" in="noise"/>
      </filter>

      {/* 2. Soft Shadows for large folds */}
      <filter id="foldBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" />
      </filter>
      
      {/* 3. Detail Shadows for seams */}
      <filter id="seamBlur">
        <feGaussianBlur stdDeviation="1.5" />
      </filter>

      {/* 4. Highlight Blur */}
      <filter id="highlightBlur">
        <feGaussianBlur stdDeviation="10" />
      </filter>
    </defs>
  );

  // -- PATHS (Geometry) --
  // Drawn to mimic a fitted athletic/regular cut cotton t-shirt
  
  const frontOutline = "M260,140 C300,150 360,150 400,120 Q500,170 600,120 C640,150 700,150 740,140 L860,280 C865,290 860,305 845,310 L780,350 L720,310 Q715,500 715,850 C600,865 400,865 285,850 Q285,500 280,310 L220,350 L155,310 C140,305 135,290 140,280 Z";

  // -- RENDERERS --

  const renderFrontBase = () => (
    <path d={frontOutline} fill={color} />
  );

  const renderFrontShadows = () => (
    <g>
      {/* A. TEXTURE OVERLAY (Global) */}
      <path d={frontOutline} filter="url(#cottonTexture)" fill="transparent" style={{ mixBlendMode: 'multiply' }} opacity="0.5" />

      {/* B. NECK AREA */}
      {/* Back collar visible inside */}
      <path d="M400,120 Q500,170 600,120 Q500,145 400,120" fill="#1a1a1a" opacity="0.3" />
      {/* Front Collar Ribbing */}
      <path d="M400,120 Q500,170 600,120" fill="none" stroke="#000" strokeWidth="18" opacity="0.1" strokeLinecap="round" />
      <path d="M400,120 Q500,170 600,120" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      
      {/* C. REALISTIC FOLDS (The "Photo" look) */}
      {/* These are filled shapes with blur, not just strokes */}
      
      <g style={{ mixBlendMode: 'multiply' }} opacity="0.6">
        {/* 1. Left Armpit Tension Folds */}
        <path d="M280,310 Q350,380 420,450 L400,480 Q320,400 280,330" fill="#000" opacity="0.1" filter="url(#foldBlur)" />
        <path d="M280,350 Q380,450 450,550 L420,580 Q350,480 280,380" fill="#000" opacity="0.08" filter="url(#foldBlur)" />

        {/* 2. Right Armpit Tension Folds */}
        <path d="M720,310 Q650,380 580,450 L600,480 Q680,400 720,330" fill="#000" opacity="0.1" filter="url(#foldBlur)" />
        <path d="M720,350 Q620,450 550,550 L580,580 Q650,480 720,380" fill="#000" opacity="0.08" filter="url(#foldBlur)" />

        {/* 3. Vertical Stomach Drapes (Gravity) */}
        <path d="M350,600 Q400,750 380,850 L420,850 Q450,750 400,600" fill="#000" opacity="0.05" filter="url(#foldBlur)" />
        <path d="M650,600 Q600,750 620,850 L580,850 Q550,750 600,600" fill="#000" opacity="0.05" filter="url(#foldBlur)" />
        
        {/* 4. Hem Shadow */}
        <path d="M285,850 C400,865 600,865 715,850 L715,840 C600,855 400,855 285,840 Z" fill="#000" opacity="0.4" filter="url(#seamBlur)" />
      </g>

      {/* D. HIGHLIGHTS (To create 3D volume) */}
      <g style={{ mixBlendMode: 'screen' }} opacity="0.4">
          {/* Pecs / Chest Volume */}
          <ellipse cx="400" cy="280" rx="80" ry="60" fill="#fff" filter="url(#highlightBlur)" opacity="0.3" />
          <ellipse cx="600" cy="280" rx="80" ry="60" fill="#fff" filter="url(#highlightBlur)" opacity="0.3" />
          
          {/* Shoulder Tops */}
          <path d="M260,140 L400,120 L400,160 Z" fill="#fff" filter="url(#highlightBlur)" opacity="0.2" />
          <path d="M740,140 L600,120 L600,160 Z" fill="#fff" filter="url(#highlightBlur)" opacity="0.2" />

          {/* Folds Ridges (Next to shadows) */}
          <path d="M290,300 Q360,370 430,440" stroke="#fff" strokeWidth="15" fill="none" filter="url(#foldBlur)" opacity="0.1" />
          <path d="M710,300 Q640,370 570,440" stroke="#fff" strokeWidth="15" fill="none" filter="url(#foldBlur)" opacity="0.1" />
      </g>

      {/* E. OUTLINES & SEAMS (Clean finish) */}
      <path d={frontOutline} stroke="rgba(0,0,0,0.1)" strokeWidth="1" fill="none" />
      {/* Sleeve Seams */}
      <path d="M280,310 C270,250 260,180 260,140" stroke="#000" strokeWidth="1" opacity="0.1" fill="none" />
      <path d="M720,310 C730,250 740,180 740,140" stroke="#000" strokeWidth="1" opacity="0.1" fill="none" />
    </g>
  );

  // -- BACK VIEW --
  const backOutline = "M260,140 C300,135 360,135 400,140 Q500,150 600,140 C640,135 700,135 740,140 L860,280 L780,350 L720,310 Q715,500 715,850 C600,865 400,865 285,850 Q285,500 280,310 L220,350 L140,280 Z";

  const renderBackBase = () => (
     <path d={backOutline} fill={color} />
  );

  const renderBackShadows = () => (
    <g>
       <path d={backOutline} filter="url(#cottonTexture)" fill="transparent" style={{ mixBlendMode: 'multiply' }} opacity="0.5" />
       
       {/* Neck Ribbing Back */}
       <path d="M400,140 Q500,150 600,140" fill="none" stroke="#000" strokeWidth="15" opacity="0.1" strokeLinecap="round" />
       
       {/* Spine Valley */}
       <path d="M500,160 L500,800" stroke="#000" strokeWidth="20" opacity="0.05" filter="url(#foldBlur)" />
       
       {/* Highlights on shoulder blades */}
       <g style={{ mixBlendMode: 'screen' }} opacity="0.3">
           <ellipse cx="380" cy="250" rx="70" ry="50" fill="#fff" filter="url(#highlightBlur)" />
           <ellipse cx="620" cy="250" rx="70" ry="50" fill="#fff" filter="url(#highlightBlur)" />
       </g>

       {/* Outlines */}
       <path d={backOutline} stroke="rgba(0,0,0,0.1)" strokeWidth="1" fill="none" />
    </g>
  );

  // -- SIDE VIEWS --
  // Simplified for brevity, but matching style
  const sideOutline = "M400,140 L600,140 L620,160 L650,280 L580,320 L550,280 L550,850 L450,850 L450,280 L420,320 L350,280 L380,160 Z";
  
  const renderSideBase = () => (
      <path d={sideOutline} fill={color} />
  );
  
  const renderSideShadows = () => (
      <g>
          <path d={sideOutline} filter="url(#cottonTexture)" fill="transparent" style={{ mixBlendMode: 'multiply' }} opacity="0.5" />
          <rect x="450" y="140" width="100" height="710" fill="black" opacity="0.1" filter="url(#foldBlur)" />
          <path d={sideOutline} stroke="rgba(0,0,0,0.1)" strokeWidth="1" fill="none" />
      </g>
  );


  // -- MAIN RENDER --
  const renderContent = () => {
      if (mode === 'base') {
          if (view === 'front') return renderFrontBase();
          if (view === 'back') return renderBackBase();
          return renderSideBase();
      } else {
          // Shadows mode
          if (view === 'front') return renderFrontShadows();
          if (view === 'back') return renderBackShadows();
          return renderSideShadows();
      }
  };

  const transform = view === 'right' ? 'scale(-1, 1) translate(-1000, 0)' : undefined;

  return (
    <svg id={id} viewBox="0 0 1000 1000" className={className} xmlns="http://www.w3.org/2000/svg" style={{ transform }}>
      <Defs />
      
      {/* Drop Shadow (Only needed in base or separate, putting in base for now) */}
      {mode === 'base' && (
         <ellipse cx="500" cy="870" rx="280" ry="25" fill="#000" opacity="0.25" filter="url(#foldBlur)" />
      )}

      {renderContent()}
    </svg>
  );
};
