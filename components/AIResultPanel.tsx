import React from 'react';
import { Sparkles, Download, Loader2 } from 'lucide-react';

interface AIResultPanelProps {
  isGenerating: boolean;
  resultImage: string | null;
}

export const AIResultPanel: React.FC<AIResultPanelProps> = ({ isGenerating, resultImage }) => {
  if (isGenerating) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-4 bg-slate-900 relative">
        {/* Animated background hint */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
             <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-transparent to-transparent animate-pulse" />
        </div>
        
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin relative z-10" />
        <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-bold text-white">Generando Probador Virtual...</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                La IA está analizando tu foto y aplicando el diseño sobre la camiseta. <br/>
                <span className="text-xs opacity-70">Esto puede tomar de 10 a 20 segundos.</span>
            </p>
        </div>
      </div>
    );
  }

  if (!resultImage) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-6 bg-slate-900 border-l border-slate-800">
        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-700">
            <Sparkles className="w-10 h-10 text-slate-600" />
        </div>
        <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-300">Visor de Resultado IA</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                Aquí verás el resultado del <strong>Probador Virtual</strong>. 
            </p>
            <div className="p-3 bg-slate-800/50 rounded text-xs text-slate-400 text-left max-w-xs mx-auto border border-slate-700/50">
                <p className="font-semibold text-purple-400 mb-1">Cómo funciona:</p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Sube tu diseño en el panel izquierdo.</li>
                    <li>Haz clic en "Probador Virtual IA".</li>
                    <li>Sube una foto tuya.</li>
                    <li>¡Listo! La IA te vestirá con la camiseta.</li>
                </ol>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col relative bg-black border-l border-slate-700">
       {/* Header Overlay */}
       <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-start pointer-events-none">
           <div className="bg-purple-900/80 backdrop-blur px-3 py-1 rounded-full border border-purple-500/30 text-xs font-bold text-purple-100 flex items-center gap-2 shadow-lg shadow-purple-900/50">
               <Sparkles size={12} />
               Generado por IA
           </div>
       </div>

       {/* Main Image Area */}
       <div className="flex-1 flex items-center justify-center overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgydjJIMUMxeiIgZmlsbD0iIzIyMiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48L3N2Zz4=')]">
           <img 
            src={resultImage} 
            alt="AI Result" 
            className="w-full h-full object-contain animate-in fade-in duration-700" 
           />
       </div>

       {/* Footer Actions */}
       <div className="p-6 bg-slate-900 border-t border-slate-800 flex flex-col items-center gap-3">
            <a 
                href={resultImage} 
                download={`furia-rock-ai-${Date.now()}.png`}
                className="w-full max-w-xs flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-purple-900/20 hover:scale-105"
            >
                <Download size={18} />
                Descargar Imagen IA
            </a>
            <p className="text-[10px] text-slate-500 text-center max-w-xs">
                *La imagen es una aproximación generada por IA.
            </p>
       </div>
    </div>
  );
};