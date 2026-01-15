
import React, { useState } from 'react';
import { gemini } from '../services/geminiService';

const Visualizer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      // Prompt Engineering for Product Design
      const enhancedPrompt = `Professional industrial design product photography of ${prompt}. Cinematic studio lighting, neutral grey background, 8k resolution, highly detailed, photorealistic, product visualization, commercial photography style.`;
      
      const img = await gemini.generateProductConcept(enhancedPrompt, size);
      setImage(img);
    } catch (err) {
      alert("Failed to generate image. Please ensure you have a valid API key for Gemini 3 Pro Image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b1120] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden relative font-sans text-slate-200">
      
      {/* --- HEADER --- */}
      <div className="px-6 py-4 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
             <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/50">
                <i className="fa-solid fa-wand-magic-sparkles text-white text-sm"></i>
             </div>
             <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500 border-2 border-[#0b1120]"></span>
              </span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-lg leading-none tracking-tight">Concept Lab Studio</h3>
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              Imagen 3 / Gemini Pro • Online
            </p>
          </div>
        </div>
        <div className="flex gap-2">
             {['1K', '2K', '4K'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    size === s 
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                      : 'bg-slate-800/50 text-slate-500 border-slate-700 hover:border-slate-600 hover:text-slate-300'
                  }`}
                >
                  {s} RES
                </button>
              ))}
        </div>
      </div>

      {/* --- VIEWPORT --- */}
      <div className="flex-1 bg-[#090f1a] relative flex items-center justify-center overflow-hidden group">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0b1120] opacity-80 pointer-events-none"></div>

        {image ? (
            <div className="relative z-10 max-w-[90%] max-h-[85%] shadow-2xl rounded-lg overflow-hidden border border-slate-700/50 animate-fadeIn group/image">
                 <img src={image} className="w-full h-full object-contain bg-[#1e293b]" alt="Generated visual" />
                 
                 {/* Overlay Actions */}
                 <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                    <a href={image} download="concept.png" className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 border border-white/10 transition-colors">
                        <i className="fa-solid fa-download"></i>
                    </a>
                    <button onClick={() => setImage(null)} className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-500/80 border border-white/10 transition-colors">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                 </div>
                 <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                    <p className="text-[10px] font-mono text-slate-300 truncate max-w-md">{prompt}</p>
                 </div>
            </div>
        ) : (
            <div className="relative z-10 text-center space-y-6 max-w-md px-6">
                <div className={`w-24 h-24 mx-auto rounded-3xl bg-slate-800/30 border border-slate-700/50 flex items-center justify-center transition-all ${loading ? 'animate-pulse border-purple-500/30' : ''}`}>
                    {loading ? (
                         <div className="flex gap-1">
                             <div className="w-2 h-8 bg-purple-500 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                             <div className="w-2 h-8 bg-purple-500 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                             <div className="w-2 h-8 bg-purple-500 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                         </div>
                    ) : (
                        <i className="fa-solid fa-image text-4xl text-slate-600"></i>
                    )}
                </div>
                <div>
                     <h3 className="text-xl font-bold text-white mb-2">
                        {loading ? "Rendering Concept..." : "Canvas Empty"}
                     </h3>
                     <p className="text-slate-500 text-sm leading-relaxed">
                        {loading ? "Allocating GPU resources. High-fidelity rendering in progress." : "Describe a product form factor to generate a professional studio visualization."}
                     </p>
                </div>
            </div>
        )}
      </div>

      {/* --- CONTROL PANEL --- */}
      <div className="p-6 bg-[#1e293b]/50 backdrop-blur-xl border-t border-slate-700 shrink-0">
         <div className="flex gap-4">
             <div className="flex-1 relative group">
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                 <input 
                    type="text" 
                    className="relative w-full bg-[#0f172a] text-slate-200 border border-slate-600 rounded-xl pl-4 pr-4 py-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-slate-500 transition-all font-medium"
                    placeholder="e.g. 'A translucent medical inhaler with a brushed titanium finish'..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={loading}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                 />
             </div>
             <button 
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 flex items-center gap-3 overflow-hidden group"
             >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                <span className="hidden md:inline relative z-10">Generate</span>
             </button>
         </div>
         {/* Disclaimer */}
         <div className="mt-3 flex justify-between items-center px-1">
             <p className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                <i className="fa-solid fa-terminal text-purple-500"></i>
                SYSTEM_READY
             </p>
             <p className="text-[10px] text-slate-500">
                Generative AI can produce artifacts.
             </p>
         </div>
      </div>
    </div>
  );
};

export default Visualizer;
