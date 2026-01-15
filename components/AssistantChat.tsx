
import React, { useState, useRef, useEffect } from 'react';
import { gemini } from '../services/geminiService';
import { ChatMessage, AssessmentReport } from '../types';
import { marked } from 'marked';

interface AssistantChatProps {
    reports?: AssessmentReport[];
}

const AssistantChat: React.FC<AssistantChatProps> = ({ reports = [] }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
  const [isContextSelectorOpen, setIsContextSelectorOpen] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Click outside to close selector
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsContextSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleReportSelection = (id: string) => {
      setSelectedReportIds(prev => 
          prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
      );
  };

  const getSelectedReports = () => reports.filter(r => selectedReportIds.includes(r.id));

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Prepare Context Data
    const selectedReports = getSelectedReports();
    let activeContext = "";
    if (selectedReports.length > 0) {
        activeContext = "ANALYSIS CONTEXT (The user has selected the following reports to discuss):\n" + 
                        selectedReports.map(r => JSON.stringify(r)).join("\n\n-- NEXT REPORT --\n\n");
    }

    try {
      const response = await gemini.chatWithAnalyst(textToSend, messages, activeContext);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "System Error: Unable to establish connection with reasoning engine." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
      setMessages([]);
  };

  const suggestedPrompts = [
      { label: "Market Performance", query: "Analyze the Total Addressable Market (TAM) and CAGR growth drivers." },
      { label: "IP Landscape", query: "Identify the top 3 blocking patents and propose a design-around strategy." },
      { label: "Technical Forensics", query: "What are the critical failure modes and TRL risks for this technology?" },
      { label: "Financial Health", query: "Evaluate the Unit Economics and Gross Margin potential." }
  ];

  // Markdown renderer helper
  const renderMarkdown = (text: string) => {
      return { __html: marked.parse(text) };
  };

  return (
    <div className="flex flex-col h-full bg-[#0b1120] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden relative font-sans text-slate-200">
      
      {/* --- HEADER --- */}
      <div className="px-6 py-4 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
             <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
                <i className="fa-solid fa-terminal text-white text-sm"></i>
             </div>
             <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-[#0b1120]"></span>
              </span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-lg leading-none tracking-tight">Arcus Analyst Terminal</h3>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Gemini 3 Flash • Online
            </p>
          </div>
        </div>
        
        <button 
            onClick={clearChat} 
            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider border border-transparent hover:border-slate-700"
        >
            <i className="fa-solid fa-eraser"></i>
            Clear
        </button>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#0b1120] relative custom-scrollbar">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        
        {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center relative z-10 max-w-2xl mx-auto">
                <div className="bg-white/5 rounded-2xl p-8 border border-slate-800 w-full backdrop-blur-sm shadow-xl">
                    <div className="flex items-start gap-4 mb-6">
                         <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                            <i className="fa-solid fa-robot text-xl"></i>
                         </div>
                         <div>
                             <h3 className="text-xl font-bold text-white mb-2">Greetings. I am the Arcus Analyst.</h3>
                             <p className="text-slate-400 text-sm leading-relaxed">
                                 Powered by Gemini 3 Flash for high-speed reasoning. I can audit your reports, 
                                 reference specific claims, and perform live market lookups.
                             </p>
                         </div>
                    </div>

                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 pl-1">Direct Me. Select an analysis vector:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {suggestedPrompts.map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(prompt.query)}
                                className="text-left p-3 rounded-lg bg-[#1e293b] hover:bg-blue-600 hover:border-blue-500 border border-slate-700 transition-all group"
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-slate-300 group-hover:text-white uppercase tracking-wider">{prompt.label}</span>
                                    <i className="fa-solid fa-arrow-right text-slate-600 group-hover:text-white text-xs opacity-0 group-hover:opacity-100 transition-all"></i>
                                </div>
                                <p className="text-[11px] text-slate-500 group-hover:text-blue-100 line-clamp-2">{prompt.query}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        ) : (
            <>
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex gap-4 animate-fadeIn relative z-10 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                                <i className="fa-solid fa-robot text-xs"></i>
                            </div>
                        )}
                        
                        <div className={`max-w-[85%] rounded-2xl p-4 shadow-lg ${
                            msg.role === 'user' 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : 'bg-[#1e293b] border border-slate-700 rounded-tl-none'
                        }`}>
                            <div className="prose-chat text-sm" dangerouslySetInnerHTML={renderMarkdown(msg.content)} />
                        </div>

                        {msg.role === 'user' && (
                             <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 mt-1">
                                <i className="fa-solid fa-user text-xs"></i>
                            </div>
                        )}
                    </div>
                ))}
                
                {loading && (
                    <div className="flex gap-4 animate-fadeIn relative z-10">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                             <i className="fa-solid fa-robot text-xs"></i>
                        </div>
                        <div className="bg-[#1e293b] border border-slate-700 rounded-2xl rounded-tl-none p-4 shadow-lg flex items-center gap-3">
                            <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
                            </div>
                            <span className="text-xs font-mono text-emerald-500">Gemini 3 Flash Reasoning...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </>
        )}
      </div>

      {/* --- INPUT AREA --- */}
      <div className="p-4 bg-[#0f172a] border-t border-slate-800 relative z-20">
         
         {/* Context Selector Toggle */}
         {reports.length > 0 && (
            <div className="mb-3 flex items-center justify-between" ref={selectorRef}>
                <button 
                  onClick={() => setIsContextSelectorOpen(!isContextSelectorOpen)}
                  className={`text-xs font-bold px-3 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                    selectedReportIds.length > 0 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20' 
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-300 hover:border-slate-600'
                  }`}
                >
                   <i className="fa-solid fa-database"></i>
                   {selectedReportIds.length > 0 ? `${selectedReportIds.length} Reports Active` : 'Select Context'}
                </button>
                
                {/* Refined Available Reports Modal */}
                {isContextSelectorOpen && (
                   <div className="absolute bottom-20 left-4 w-96 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl animate-slideDown z-50 overflow-hidden ring-1 ring-white/10">
                      <div className="px-4 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                              <i className="fa-solid fa-layer-group text-blue-400"></i>
                              Available Reports
                          </div>
                          {selectedReportIds.length > 0 && (
                             <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                                {selectedReportIds.length} Selected
                             </span>
                          )}
                      </div>

                      <div className="max-h-80 overflow-y-auto custom-scrollbar p-2 space-y-1">
                         {reports.map(report => {
                             const isSelected = selectedReportIds.includes(report.id);
                             return (
                                 <button
                                    key={report.id}
                                    onClick={() => toggleReportSelection(report.id)}
                                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 group relative overflow-hidden ${
                                       isSelected 
                                         ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                                         : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
                                    }`}
                                 >
                                    <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0 ${
                                        isSelected 
                                            ? 'bg-blue-500 border-blue-500 text-white shadow-sm' 
                                            : 'bg-white/5 border-slate-600 group-hover:border-slate-500'
                                    }`}>
                                        {isSelected && <i className="fa-solid fa-check text-[10px]"></i>}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className={`text-xs font-bold truncate transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                            {report.innovation_name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                                isSelected 
                                                ? 'bg-blue-400/10 text-blue-300 border-blue-400/20' 
                                                : 'bg-slate-800 text-slate-500 border-slate-700'
                                            }`}>
                                                {report.sector.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                 </button>
                             );
                         })}
                      </div>
                      
                      <div className="px-4 py-2 bg-white/5 border-t border-white/5 text-[10px] text-slate-500 text-center font-medium">
                          Select reports to enable context-aware analysis
                      </div>
                   </div>
                )}
            </div>
         )}

         <div className="relative">
            <input 
              type="text" 
              className="w-full bg-[#1e293b] text-slate-200 border border-slate-700 rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-slate-500 transition-all shadow-inner"
              placeholder="Ask a question about your reports..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
            >
              <i className="fa-solid fa-paper-plane text-sm"></i>
            </button>
         </div>
         <p className="text-[10px] text-slate-500 text-center mt-3 font-mono">
            Arcus Analyst can make mistakes. Verify critical data.
         </p>
      </div>
    </div>
  );
};

export default AssistantChat;
