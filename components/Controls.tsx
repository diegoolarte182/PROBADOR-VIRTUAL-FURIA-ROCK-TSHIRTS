import React, { useRef } from 'react';
import { Upload, Download, RotateCcw, Check, X, Sliders, MessageCircle, Wand2, RefreshCw, Home } from 'lucide-react';
import { AppState, ZoneId, DesignLayer } from '../types';
import { PRESET_COLORS, ZONES } from '../constants';

interface ControlsProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  updateLayer: (zoneId: ZoneId, updates: Partial<DesignLayer>) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>, zoneId: ZoneId) => void;
  onDownload: () => void;
  onAITryOn: (file: File) => void;
  onResetProject: () => void;
  onGoHome: () => void; // New prop
  currentZone: ZoneId;
  setCurrentZone: (z: ZoneId) => void;
  isGeneratingAI: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  state,
  updateState,
  updateLayer,
  onUpload,
  onDownload,
  onAITryOn,
  onResetProject,
  onGoHome,
  currentZone,
  setCurrentZone,
  isGeneratingAI
}) => {
  const layer = state.layers[currentZone];
  const aiInputRef = useRef<HTMLInputElement>(null);

  const handleResetLayer = () => {
    updateLayer(currentZone, {
      scale: 1,
      rotation: 0,
      x: 50,
      y: 50,
      opacity: 100
    });
  };

  const handleWhatsApp = () => {
    const message = `Hola Furia Rock, estoy interesado en cotizar mi diseño "${state.projectName}". Ya he descargado el mockup.`;
    const url = `https://wa.me/573125854503?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleAIUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAITryOn(file);
    }
    // Reset input
    if (e.target) e.target.value = '';
  };

  const activeZoneConfig = ZONES[currentZone];

  // Simple skull pattern SVG as background
  const skullBg = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='40' font-size='24' fill='rgba(255,255,255,0.03)'%3E💀%3C/text%3E%3C/svg%3E")`;

  return (
    <div 
        className="h-full overflow-y-auto bg-slate-900 border-r border-slate-700 p-6 space-y-8 custom-scrollbar relative"
        style={{ backgroundImage: skullBg }}
    >
      
      {/* Header & Navigation */}
      <div className="relative z-50 space-y-4"> {/* Increased Z-Index to ensure clickability */}
        <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-white tracking-tight leading-none">Furia Rock <br/> <span className="text-brand-500 text-lg">Studio</span></h1>
            
            <div className="flex gap-2">
                <button 
                    onClick={onGoHome}
                    type="button"
                    className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand-400 transition-colors group cursor-pointer"
                    title="Volver al Inicio"
                >
                    <div className="p-2 border border-slate-600 rounded-full hover:border-brand-400 hover:bg-slate-800 transition-all group-hover:scale-110 shadow-md">
                        <Home size={16} />
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider">Inicio</span>
                </button>

                <button 
                    onClick={onResetProject}
                    type="button"
                    className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-400 transition-colors group cursor-pointer"
                    title="Nuevo Proyecto (Borrar todo)"
                >
                    <div className="p-2 border border-slate-600 rounded-full hover:border-red-400 hover:bg-slate-800 transition-all group-hover:scale-110 shadow-md">
                        <RefreshCw size={16} />
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider">Nuevo</span>
                </button>
            </div>
        </div>

        <input
          type="text"
          value={state.projectName}
          onChange={(e) => updateState({ projectName: e.target.value })}
          placeholder="Nombre del Proyecto"
          className="w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors placeholder:text-slate-500"
        />
      </div>

      {/* T-Shirt Color */}
      <div className="relative z-10">
        <h3 className="text-xs uppercase text-slate-400 font-semibold mb-3 tracking-wider">Color de Prenda</h3>
        <div className="flex flex-wrap gap-3">
          {PRESET_COLORS.map(color => (
            <button
              key={color}
              onClick={() => updateState({ tshirtColor: color })}
              className={`w-8 h-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${state.tshirtColor === color ? 'border-brand-500 scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Zone Selection */}
      <div className="relative z-10">
        <h3 className="text-xs uppercase text-slate-400 font-semibold mb-3 tracking-wider">Zona de Impresión</h3>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(ZONES) as ZoneId[]).map((zoneId) => (
            <button
              key={zoneId}
              onClick={() => {
                  setCurrentZone(zoneId);
                  updateState({ currentView: ZONES[zoneId].view });
              }}
              className={`px-3 py-2 text-sm rounded border transition-all ${
                currentZone === zoneId
                  ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-900/50'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-750'
              }`}
            >
              {ZONES[zoneId].name}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Controls */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-lg p-4 border border-slate-700 relative z-10 shadow-xl">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                {activeZoneConfig.name}
                {layer?.imageSrc && <Check size={14} className="text-green-400" />}
            </h3>
            {layer?.imageSrc && (
                <button 
                    onClick={() => updateLayer(currentZone, { imageSrc: null })} 
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                >
                    <X size={12} /> Eliminar
                </button>
            )}
        </div>

        {!layer?.imageSrc ? (
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:bg-slate-750 transition-colors group relative cursor-pointer">
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => onUpload(e, currentZone)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-brand-400">
              <Upload size={24} className="mb-2" />
              <span className="text-sm font-medium">Subir Diseño</span>
              <span className="text-xs text-slate-500 mt-1">PNG, JPG (Max 5MB)</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
             {/* Preview Thumbnail */}
             <div className="flex items-center justify-center bg-slate-900/50 p-2 rounded mb-4">
                 <img src={layer.imageSrc} alt="Preview" className="h-16 object-contain" />
             </div>

            {/* Sliders */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Escala</span>
                <span>{Math.round(layer.scale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={layer.scale}
                onChange={(e) => updateLayer(currentZone, { scale: parseFloat(e.target.value) })}
                className="w-full accent-brand-500 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Rotación</span>
                <span>{layer.rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={layer.rotation}
                onChange={(e) => updateLayer(currentZone, { rotation: parseInt(e.target.value) })}
                className="w-full accent-brand-500 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="space-y-1">
                 <div className="flex justify-between text-xs text-slate-400">
                    <span>Posición X ({Math.round(layer.x)}%)</span>
                 </div>
                 <input type="range" min="0" max="100" value={layer.x} onChange={e => updateLayer(currentZone, { x: parseInt(e.target.value)})} className="w-full accent-brand-500 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"/>
            </div>
             <div className="space-y-1">
                 <div className="flex justify-between text-xs text-slate-400">
                    <span>Posición Y ({Math.round(layer.y)}%)</span>
                 </div>
                 <input type="range" min="0" max="100" value={layer.y} onChange={e => updateLayer(currentZone, { y: parseInt(e.target.value)})} className="w-full accent-brand-500 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"/>
            </div>

            <button
              onClick={handleResetLayer}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-400 bg-slate-750 hover:bg-slate-700 rounded transition-colors cursor-pointer"
            >
              <RotateCcw size={12} /> Restablecer Ajustes
            </button>
          </div>
        )}
      </div>
        
      {/* Toggles */}
      <div className="space-y-3 relative z-10">
         <label className="flex items-center justify-between text-sm text-slate-300 cursor-pointer">
            <span>Mostrar Guías de Impresión</span>
            <input 
                type="checkbox" 
                checked={state.showGuides} 
                onChange={(e) => updateState({ showGuides: e.target.checked })} 
                className="accent-brand-500 w-4 h-4 cursor-pointer"
            />
         </label>
         <label className="flex items-center justify-between text-sm text-slate-300 cursor-pointer">
            <span>Marca de Agua</span>
            <input 
                type="checkbox" 
                checked={state.showWatermark} 
                onChange={(e) => updateState({ showWatermark: e.target.checked })} 
                className="accent-brand-500 w-4 h-4 cursor-pointer"
            />
         </label>
      </div>

      {/* Main Actions */}
      <div className="space-y-3 relative z-10">
          <button
            onClick={onDownload}
            disabled={state.isComparing}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-900/20 cursor-pointer"
          >
            <Download size={20} />
            Descargar Mockup PNG
          </button>

          {/* AI Virtual Try On */}
          <div className="relative">
             <input 
                type="file" 
                ref={aiInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleAIUpload}
             />
             <button
                onClick={() => aiInputRef.current?.click()}
                disabled={isGeneratingAI}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-70 disabled:cursor-wait text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20 cursor-pointer"
            >
                {isGeneratingAI ? (
                    <span className="animate-pulse">Generando...</span>
                ) : (
                    <>
                        <Wand2 size={20} />
                        Probador Virtual IA
                    </>
                )}
            </button>
             <p className="text-[10px] text-purple-400 mt-1 text-center">
                *Sube una foto tuya y la IA pondrá la camiseta.
              </p>
          </div>
          
          <button
            onClick={handleWhatsApp}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20 cursor-pointer"
          >
            <MessageCircle size={20} />
            Cotizar por WhatsApp
          </button>
      </div>

    </div>
  );
};