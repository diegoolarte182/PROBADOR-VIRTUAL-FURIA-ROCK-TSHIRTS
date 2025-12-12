import React, { useRef, useState, useEffect } from 'react';
import { AppState, ViewAngle, DesignLayer, ZoneId } from '../types';
import { TShirtSVG } from './TShirtSVG';
import { ZONES } from '../constants';
import { Eye, EyeOff, Rotate3d } from 'lucide-react';

interface ViewerProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  updateLayer: (zoneId: ZoneId, updates: Partial<DesignLayer>) => void;
  currentZone: ZoneId;
}

export const Viewer: React.FC<ViewerProps> = ({ state, updateState, updateLayer, currentZone }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, valX: 0, valY: 0 });

  // 360 Rotation Simulation
  const [rotationValue, setRotationValue] = useState(0);

  useEffect(() => {
    switch (state.currentView) {
      case 'front': setRotationValue(0); break;
      case 'right': setRotationValue(90); break;
      case 'back': setRotationValue(180); break;
      case 'left': setRotationValue(270); break;
    }
  }, [state.currentView]);

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setRotationValue(val);
    if (val >= 315 || val < 45) updateState({ currentView: 'front' });
    else if (val >= 45 && val < 135) updateState({ currentView: 'right' });
    else if (val >= 135 && val < 225) updateState({ currentView: 'back' });
    else if (val >= 225 && val < 315) updateState({ currentView: 'left' });
  };

  const handleMouseDown = (e: React.MouseEvent, layer: DesignLayer) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY, valX: layer.x, valY: layer.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !state.layers[currentZone]) return;
    const sensitivity = 0.2; 
    const dx = (e.clientX - dragStart.x) * sensitivity;
    const dy = (e.clientY - dragStart.y) * sensitivity;
    updateLayer(currentZone, {
        x: Math.min(100, Math.max(0, dragStart.valX + dx)),
        y: Math.min(100, Math.max(0, dragStart.valY + dy))
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const renderPrintZone = (zoneId: ZoneId) => {
    const layer = state.layers[zoneId];
    const zoneConfig = ZONES[zoneId];
    if (zoneConfig.view !== state.currentView) return null;

    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${(zoneConfig.area.x / 1000) * 100}%`,
        top: `${(zoneConfig.area.y / 1000) * 100}%`,
        width: `${(zoneConfig.area.width / 1000) * 100}%`,
        height: `${(zoneConfig.area.height / 1000) * 100}%`,
        border: state.showGuides ? '1px dashed rgba(255,255,255,0.4)' : 'none',
        pointerEvents: currentZone === zoneId ? 'auto' : 'none',
        zIndex: 10, // Designs sit between Base (0) and Shadows (20)
    };

    return (
        <div key={zoneId} style={style} className="flex items-center justify-center">
             {state.showGuides && (
                 <span className="absolute -top-6 left-0 text-[10px] text-white/50 whitespace-nowrap bg-black/50 px-1 rounded">
                     {zoneConfig.name}
                 </span>
             )}
            {layer.imageSrc && layer.visible && (
                <div 
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        // Note: Multiply is good, but now we have real shadows on top, 
                        // so 'normal' or 'multiply' both work. 'Multiply' integrates better with the base color.
                        mixBlendMode: 'multiply',
                        opacity: layer.opacity / 100,
                        transform: `
                            translate(${layer.x - 50}%, ${layer.y - 50}%) 
                            rotate(${layer.rotation}deg) 
                            scale(${layer.scale})
                        `,
                        cursor: isDragging ? 'grabbing' : 'grab',
                    }}
                    onMouseDown={(e) => currentZone === zoneId && handleMouseDown(e, layer)}
                >
                    <img 
                        src={layer.imageSrc} 
                        alt="print" 
                        className="w-full h-full object-contain pointer-events-none select-none"
                    />
                </div>
            )}
        </div>
    );
  };

  const skullUrl = `data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='50' font-size='24' fill='rgba(0,0,0,0.08)'%3E💀%3C/text%3E%3Ctext x='60' y='90' font-size='18' fill='rgba(0,0,0,0.05)'%3E💀%3C/text%3E%3C/svg%3E`;

  return (
    <div 
        className="h-full flex flex-col bg-slate-600 relative overflow-hidden" 
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
    >
        <style>{`
            @keyframes skullFloat {
                0% { background-position: 0px 0px; }
                100% { background-position: 100px 100px; }
            }
            .skull-bg-animated {
                background-image: url("${skullUrl}");
                animation: skullFloat 20s linear infinite;
            }
        `}</style>

        <div className="absolute inset-0 z-0 pointer-events-none skull-bg-animated"></div>

        <div className="absolute top-4 right-4 z-30 flex gap-2">
            <button 
                onClick={() => updateState({ isComparing: !state.isComparing })}
                className={`p-2 rounded-full border transition-all ${state.isComparing ? 'bg-brand-600 border-brand-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
                title="Comparar (Antes/Después)"
            >
                {state.isComparing ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <div className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs font-mono border border-slate-700 flex items-center">
                {state.currentView.toUpperCase()} VIEW
            </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 relative z-10">
            {/* 
               This container holds the sandwich:
               1. Base SVG (Shape + Color)
               2. Design Layer (Images)
               3. Shadow SVG (Transparent overlay with folds)
            */}
            <div 
                id="preview-container" 
                ref={containerRef} 
                className="relative w-full max-w-[600px] aspect-square select-none"
            >
                {/* 1. Base Layer */}
                <div className="absolute inset-0 z-0">
                    <TShirtSVG 
                        id="tshirt-base"
                        view={state.currentView} 
                        color={state.isComparing ? '#ffffff' : state.tshirtColor} 
                        mode="base"
                        className="w-full h-full drop-shadow-2xl" 
                    />
                </div>

                {/* 2. Design Layer */}
                {!state.isComparing && (
                    <div className="absolute inset-0 z-10 w-full h-full">
                        {(Object.keys(ZONES) as ZoneId[]).map(renderPrintZone)}
                    </div>
                )}
                
                {/* 3. Shadow/Highlight Overlay Layer */}
                {/* This sits ON TOP of designs to create the realistic fabric effect */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                     <TShirtSVG 
                        id="tshirt-shadows"
                        view={state.currentView} 
                        color="transparent" // Color doesn't matter for shadow mode
                        mode="shadows"
                        className="w-full h-full" 
                    />
                </div>

                {/* Watermark */}
                {state.showWatermark && !state.isComparing && (
                    <div className="absolute bottom-10 right-10 text-slate-100/30 font-bold text-3xl pointer-events-none z-30 select-none">
                        Furia Rock T-Shirts
                    </div>
                )}
            </div>
        </div>

        <div className="h-24 bg-slate-800 border-t border-slate-700 flex items-center justify-center px-12 relative z-30">
             <div className="w-full max-w-lg relative">
                 <div className="flex justify-between text-xs text-slate-500 mb-2 font-mono uppercase">
                     <span>Frente</span>
                     <span>Der</span>
                     <span>Espalda</span>
                     <span>Izq</span>
                     <span>Frente</span>
                 </div>
                 <input 
                    type="range"
                    min="0"
                    max="360"
                    step="5"
                    value={rotationValue}
                    onChange={handleRotationChange}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-ew-resize accent-brand-500 hover:accent-brand-400"
                 />
                 <div className="flex justify-center mt-2 text-slate-400 gap-2 items-center text-sm">
                     <Rotate3d size={16} />
                     <span>Rotar Vista 360°</span>
                 </div>
             </div>
        </div>
    </div>
  );
};
