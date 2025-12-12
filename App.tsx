import React, { useState } from 'react';
import { Controls } from './components/Controls';
import { Viewer } from './components/Viewer';
import { AIResultPanel } from './components/AIResultPanel';
import { LandingPage } from './components/LandingPage';
import { AppState, DesignLayer, ZoneId } from './types';
import { ZONES, INITIAL_LAYER, DEFAULT_TSHIRT_COLOR } from './constants';
import { downloadMockup } from './utils/canvasUtils';
import { GoogleGenAI } from "@google/genai";

// Initial State Factory defined outside to be stable
const getInitialState = (): AppState => ({
  projectName: '',
  tshirtColor: DEFAULT_TSHIRT_COLOR,
  selectedSize: 'M',
  currentView: 'front',
  showGuides: true,
  showWatermark: true,
  isComparing: false,
  layers: Object.keys(ZONES).reduce((acc, zoneId) => {
    acc[zoneId as ZoneId] = { ...INITIAL_LAYER, id: `layer-${zoneId}`, zoneId: zoneId as ZoneId };
    return acc;
  }, {} as Record<ZoneId, DesignLayer>),
});

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  
  // Initialize State
  const [state, setState] = useState<AppState>(getInitialState());

  const [currentZone, setCurrentZone] = useState<ZoneId>('front_center');
  
  // AI State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiResultImage, setAiResultImage] = useState<string | null>(null);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const updateLayer = (zoneId: ZoneId, updates: Partial<DesignLayer>) => {
    setState(prev => ({
      ...prev,
      layers: {
        ...prev.layers,
        [zoneId]: { ...prev.layers[zoneId], ...updates }
      }
    }));
  };

  const handleResetProject = () => {
    if (window.confirm("¿Estás seguro de crear un nuevo proyecto? Se borrará todo.")) {
        setState(getInitialState());
        setCurrentZone('front_center');
        setAiResultImage(null);
        // Ensure we reset to landing if that was the intent, or just clear the workspace
        // Usually 'New' keeps you in the workspace, 'Home' takes you out. 
        // Based on user request "Volver al inicio", let's make sure Home does that.
    }
  };

  const handleGoHome = () => {
      // Logic: If there is work, confirm. If not, just go.
      const hasWork = state.projectName.trim() !== '' || Object.values(state.layers).some(l => l.imageSrc !== null);

      if (hasWork) {
         if (window.confirm("¿Volver al inicio? Se perderá el progreso actual.")) {
             setState(getInitialState());
             setCurrentZone('front_center');
             setAiResultImage(null);
             setShowLanding(true);
         }
      } else {
         // No work done, just go home immediately
         setShowLanding(true);
      }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, zoneId: ZoneId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo es demasiado grande (Máx 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updateLayer(zoneId, {
          imageSrc: event.target.result as string,
          scale: 1,
          x: 50,
          y: 50,
          rotation: 0
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
      setTimeout(() => {
         downloadMockup(
             state.currentView, 
             state.tshirtColor, 
             state.layers, 
             state.projectName,
             state.showWatermark
         );
      }, 100);
  };

  // --- AI Virtual Try-On Logic ---
  const handleAITryOn = async (userPhotoFile: File) => {
    const currentLayer = state.layers[currentZone];
    if (!currentLayer.imageSrc) {
        alert("Primero sube un diseño a la camiseta para usar el probador IA.");
        return;
    }

    setIsGeneratingAI(true);
    setAiResultImage(null); 

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // 1. Convert User Photo to Base64 (remove prefix)
        const userPhotoBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                 const result = reader.result as string;
                 resolve(result.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(userPhotoFile);
        });

        // 2. Get Design Image Base64 (remove prefix)
        const designBase64 = currentLayer.imageSrc.split(',')[1];
        
        // 3. Determine Pose Instructions based on the current Zone View
        const zoneConfig = ZONES[currentZone];
        let poseInstruction = "";
        
        switch (zoneConfig.view) {
            case 'back':
                poseInstruction = "CRITICAL: Generate the person standing with their BACK facing the camera. We need to see the BACK of the t-shirt to apply the design there. Turn the person around 180 degrees.";
                break;
            case 'left':
                poseInstruction = "CRITICAL: Generate the person in a side profile view, showing their LEFT arm and side clearly. We need to apply the design on the left sleeve.";
                break;
            case 'right':
                poseInstruction = "CRITICAL: Generate the person in a side profile view, showing their RIGHT arm and side clearly. We need to apply the design on the right sleeve.";
                break;
            default: // front
                poseInstruction = "Generate the person facing the camera directly (Front view). Ensure the chest area is visible.";
                break;
        }

        // 4. Construct Prompt
        const prompt = `
            Act as a professional fashion photographer and photo editor.
            Input 1: A photo of a person (User Reference).
            Input 2: A graphic design / logo.
            
            Task: Create a realistic photo of the person from Input 1 wearing a plain ${state.tshirtColor} cotton t-shirt.
            
            POSE REQUIREMENT: ${poseInstruction}
            
            COMPOSITION: Apply the graphic design from Input 2 onto the t-shirt realistically. 
            - If Back view: Place design on the center of the back.
            - If Side view: Place design on the sleeve.
            - If Front view: Place design on the chest.
            
            Follow the fabric folds, lighting, and shadows of the shirt.
            Keep the person's identity (hair, skin tone, build) consistent with Input 1, but adapt their pose to match the POSE REQUIREMENT strictly.
        `;

        const imageResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                     { text: prompt },
                     { inlineData: { mimeType: 'image/jpeg', data: userPhotoBase64 } },
                     { inlineData: { mimeType: 'image/png', data: designBase64 } }
                ]
            }
        });

        // Extract image
        let foundImage = false;
        if (imageResponse.candidates?.[0]?.content?.parts) {
            for (const part of imageResponse.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64Str = part.inlineData.data;
                    setAiResultImage(`data:image/png;base64,${base64Str}`);
                    foundImage = true;
                    break;
                }
            }
        }
        
        if (!foundImage) {
           console.warn("No image returned", imageResponse.text);
           alert("La IA no pudo generar la imagen. Intenta con una foto diferente.");
        }

    } catch (error) {
        console.error("AI Generation Error", error);
        alert("Error al generar la imagen con IA. Verifica tu conexión.");
    } finally {
        setIsGeneratingAI(false);
    }
  };

  if (showLanding) {
      return <LandingPage onStart={() => setShowLanding(false)} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-800 text-white animate-in fade-in duration-500">
      {/* Mobile Header */}
      <div className="md:hidden p-4 bg-slate-800 border-b border-slate-700 shrink-0">
         <h1 className="text-lg font-bold">Furia Rock T-Shirts</h1>
      </div>

      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
        
        {/* COLUMN 1: CONTROLS (Fixed Width) */}
        <div className="w-full md:w-[340px] shrink-0 h-[40%] md:h-full border-r border-slate-700 z-20 shadow-xl overflow-hidden">
          <Controls 
            state={state}
            updateState={updateState}
            updateLayer={updateLayer}
            onUpload={handleUpload}
            onDownload={handleDownload}
            onAITryOn={handleAITryOn}
            onResetProject={handleResetProject}
            onGoHome={handleGoHome}
            currentZone={currentZone}
            setCurrentZone={setCurrentZone}
            isGeneratingAI={isGeneratingAI}
          />
        </div>

        {/* COLUMN 2 & 3: VIEWERS (Flex) */}
        <div className="flex-1 flex flex-col lg:flex-row h-[60%] md:h-full">
            
            {/* COLUMN 2: 360 MOCKUP EDITOR */}
            <div className="flex-1 h-full relative border-b lg:border-b-0 lg:border-r border-slate-700 bg-slate-800 min-h-[300px]">
                <Viewer 
                    state={state}
                    updateState={updateState}
                    updateLayer={updateLayer}
                    currentZone={currentZone}
                />
            </div>

            {/* COLUMN 3: AI RESULT VIEWER */}
            <div className="flex-1 h-full relative bg-slate-900 min-h-[300px]">
                <AIResultPanel 
                    isGenerating={isGeneratingAI} 
                    resultImage={aiResultImage} 
                />
            </div>

        </div>
      </div>
    </div>
  );
};

export default App;