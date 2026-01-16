
import React, { useState, useEffect, useRef } from 'react';
import { gemini } from '../services/geminiService';
import { AssessmentReport, Question } from '../types';
import { getApiKeySetupInstructions } from '../utils/envCheck';

// --- QUESTIONNAIRE DEFINITIONS (PRD 3.2.1) ---
const CORE_QUESTIONS: Question[] = [
  { id: "q1_innovation_name", question: "What is the name of your innovation?", type: "short_text", required: true },
  { id: "q2_problem_statement", question: "What specific problem does your innovation solve?", type: "long_text", required: true, helper: "Describe the pain point and who experiences it." },
  { id: "q3_solution_description", question: "How does your innovation solve this problem?", type: "long_text", required: true, helper: "Describe the core mechanism or approach." },
  { 
    id: "q4_sector", 
    question: "Which sector best describes your innovation?", 
    type: "single_select", 
    required: true, 
    options: [
      { value: "medical_devices", label: "Medical Devices & HealthTech" },
      { value: "biotech_pharma", label: "Biotech / Pharmaceutical" },
      { value: "enterprise_software", label: "Enterprise Software / SaaS" },
      { value: "ai_ml", label: "AI / Machine Learning" },
      { value: "consumer_hardware", label: "Consumer Electronics / Hardware" },
      { value: "clean_energy", label: "Clean Energy / ClimateTech" },
      { value: "advanced_materials", label: "Advanced Materials / Chemistry" },
      { value: "robotics", label: "Robotics & Automation" },
      { value: "agritech", label: "Agriculture & FoodTech" }
    ]
  },
  {
    id: "q5_development_stage",
    question: "What is the current development stage?",
    type: "single_select",
    required: true,
    options: [
      { value: "Concept", label: "Concept - Idea stage (TRL 1-2)" },
      { value: "Proof of Concept", label: "Proof of Concept (TRL 3-4)" },
      { value: "Prototype", label: "Working Prototype (TRL 5-6)" },
      { value: "Pilot", label: "Pilot / Production (TRL 7-9)" }
    ]
  },
  { id: "q6_key_components", question: "List 3-5 key technical components.", type: "multi_entry", min_entries: 3, max_entries: 5 },
  { id: "q7_technical_claims", question: "Top 3 technical or performance claims.", type: "multi_entry", min_entries: 1, max_entries: 3 },
  { id: "q8_competitors", question: "Name 3-5 competitors.", type: "multi_entry", min_entries: 1, max_entries: 5 },
  { id: "q9_differentiation", question: "Why can't competitors easily replicate this?", type: "long_text", required: true },
  { id: "q10_target_customer", question: "Describe your ideal first customer.", type: "long_text", required: true },
  { 
    id: "q11_ip_status", 
    question: "IP Status", 
    type: "single_select",
    required: true,
    options: [
      { value: "No Filing", label: "No patents filed" },
      { value: "Provisional", label: "Provisional filed" },
      { value: "Pending", label: "Non-provisional pending" },
      { value: "Granted", label: "Patent(s) granted" },
      { value: "Trade Secret", label: "Relies on Trade Secrets" }
    ]
  },
  {
    id: "q12_geographic_focus",
    question: "Primary target markets",
    type: "multi_select",
    required: true,
    options: [
      { value: "US", label: "United States" },
      { value: "EU", label: "European Union" },
      { value: "APAC", label: "Asia-Pacific" },
      { value: "Global", label: "Global" }
    ]
  }
];

// --- CONDITIONAL QUESTIONS ---
const CONDITIONAL_QUESTIONS: Record<string, Question[]> = {
  medical_devices: [
    { id: "q_med_1", question: "Is there an existing FDA-cleared product similar to yours?", type: "long_text", required: true, helper: "Include product name and 510(k) number if known." },
    { id: "q_med_2", question: "Does your device involve software or connectivity?", type: "multi_select", options: [{value: "embedded", label: "Embedded Software"}, {value: "ai", label: "AI/ML"}, {value: "cloud", label: "Cloud Connectivity"}] }
  ],
  enterprise_software: [
    { id: "q_sw_1", question: "What systems does your solution integrate with?", type: "multi_entry", min_entries: 1 },
    { id: "q_sw_2", question: "Data privacy requirements?", type: "multi_select", options: [{value: "soc2", label: "SOC 2"}, {value: "hipaa", label: "HIPAA"}, {value: "gdpr", label: "GDPR"}] }
  ],
  clean_energy: [
    { id: "q_clean_1", question: "Technology type?", type: "single_select", options: [{value: "solar", label: "Solar"}, {value: "wind", label: "Wind"}, {value: "storage", label: "Storage/Battery"}, {value: "grid", label: "Grid Tech"}] },
    { id: "q_clean_2", question: "Dependencies?", type: "multi_select", options: [{value: "rare_earth", label: "Rare Earth Materials"}, {value: "incentives", label: "Govt Incentives"}] }
  ],
  advanced_materials: [
    { id: "q_mat_1", question: "Material Composition?", type: "short_text", required: true },
    { id: "q_mat_2", question: "Manufacturing process scaling?", type: "single_select", options: [{value: "lab", label: "Lab Scale"}, {value: "pilot", label: "Pilot Line"}, {value: "industrial", label: "Industrial Roll-to-Roll"}] }
  ],
  robotics: [
    { id: "q_bot_1", question: "Autonomy Level?", type: "single_select", options: [{value: "teleop", label: "Tele-operated"}, {value: "semi", label: "Semi-Autonomous"}, {value: "full", label: "Fully Autonomous"}] }
  ]
};

interface ReportWizardProps {
  onComplete: (report: AssessmentReport) => void;
  onCancel: () => void;
}

const ReportWizard: React.FC<ReportWizardProps> = ({ onComplete, onCancel }) => {
  const [mode, setMode] = useState<'select' | 'questionnaire' | 'upload' | 'processing'>('select');
  const [responses, setResponses] = useState<any>({});
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(CORE_QUESTIONS);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);
  
  // State for multiple files
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, data: string, type: string, size: number}[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sector = responses['q4_sector'];
    if (sector && CONDITIONAL_QUESTIONS[sector]) {
      const hasConditionals = activeQuestions.some(q => q.id.startsWith('q_'));
      if (!hasConditionals) {
        const q4Index = activeQuestions.findIndex(q => q.id === 'q4_sector');
        if (q4Index !== -1) {
           const newQuestions = [...activeQuestions];
           newQuestions.splice(q4Index + 1, 0, ...CONDITIONAL_QUESTIONS[sector]);
           setActiveQuestions(newQuestions);
        }
      }
    }
  }, [responses['q4_sector']]);

  const currentQ = activeQuestions[currentQIndex];

  const getValidationError = (): string | null => {
    if (!currentQ) return null;
    const val = responses[currentQ.id];

    if (currentQ.required) {
      if (val === undefined || val === null) return "This field is required.";
      if (typeof val === 'string' && val.trim() === '') return "Please provide an answer.";
      if (Array.isArray(val) && val.length === 0) return "Please select at least one option.";
    }

    if (currentQ.type === 'multi_entry') {
      const entries = Array.isArray(val) ? val.filter((s: string) => s.trim() !== '') : [];
      if (currentQ.min_entries && entries.length < currentQ.min_entries) {
        return `Please list at least ${currentQ.min_entries} items.`;
      }
    }

    return null;
  };

  const validationError = getValidationError();
  const isStepValid = validationError === null;

  const handleNext = () => {
    if (!isStepValid) return; 

    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      startProcessing();
    }
  };

  const handleBack = () => {
    if (currentQIndex > 0) setCurrentQIndex(currentQIndex - 1);
  };

  const processFiles = (files: File[]) => {
    const newFiles: {name: string, data: string, type: string, size: number}[] = [];
    let processedCount = 0;

    // Calculate total size including already uploaded files
    const currentSize = uploadedFiles.reduce((acc, f) => acc + f.size, 0);
    const newSize = files.reduce((acc, f) => acc + f.size, 0);
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB

    if (currentSize + newSize > MAX_SIZE) {
        alert(`Total file size limit is 50MB. Current total: ${((currentSize + newSize) / 1024 / 1024).toFixed(2)}MB`);
        return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        newFiles.push({
          name: file.name,
          type: file.type,
          data: base64,
          size: file.size
        });
        processedCount++;
        if (processedCount === files.length) {
            setUploadedFiles(prev => [...prev, ...newFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          processFiles(Array.from(e.dataTransfer.files));
      }
  };

  const removeFile = (index: number) => {
      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (mimeType: string) => {
      if (mimeType.includes('pdf')) return 'fa-file-pdf';
      if (mimeType.includes('image')) return 'fa-file-image';
      if (mimeType.includes('word') || mimeType.includes('document')) return 'fa-file-word';
      return 'fa-file-lines';
  };

  const startProcessing = async () => {
    setMode('processing');
    const logs = [
      "Initializing Arcus Innovation Compass...",
      "Identifying Sector & Technology Domain...",
      "AGENT [Patent Attorney]: Conducting Freedom-to-Operate analysis...",
      "AGENT [Patent Attorney]: Identifying blocking patents and whitespace...",
      "AGENT [Technologist]: Validating core claims against physics/logic...",
      "AGENT [Technologist]: Calculating TRL and failure modes...",
      "AGENT [Market Strategist]: Mapping competitive landscape and adoption barriers...",
      "AGENT [Regulatory Expert]: Determining compliance pathway (FDA/FCC/ISO)...",
      "AGENT [Commercial Lead]: Modeling unit economics and licensing potential...",
      "AGENT [TTO Director]: Synthesizing IP & Market Strategy..."
    ];

    for (let i = 0; i < logs.length; i++) {
      setProcessingLogs(prev => [...prev, logs[i]]);
      const delay = Math.random() * 1000 + 800; 
      await new Promise(r => setTimeout(r, delay));
    }

    try {
      let report;
      if (uploadedFiles.length > 0) {
        const docs = uploadedFiles.map(f => ({
            mimeType: f.type,
            data: f.data.split(',')[1] // Strip header for API
        }));
        report = await gemini.generateAssessmentFromDocuments(docs);
      } else {
        report = await gemini.generateAssessmentFromQuestionnaire(responses);
      }
      onComplete(report);
    } catch (e: any) {
      console.error(e);
      const errorMessage = e?.message || "Analysis failed. Please check inputs.";
      setProcessingLogs(prev => [...prev, `❌ Error: ${errorMessage}`]);

      // Show detailed error message to user
      setTimeout(() => {
        if (errorMessage.includes('API key not found') || errorMessage.includes('VITE_GOOGLE_API_KEY')) {
          alert(getApiKeySetupInstructions());
        } else {
          alert(`Analysis failed: ${errorMessage}\n\nPlease check the console for more details.`);
        }
        setMode('select');
      }, 1000);
    }
  };

  const renderInput = () => {
    if (!currentQ) return null;
    const val = responses[currentQ.id];

    switch (currentQ.type) {
      case 'short_text':
        return (
          <input 
            className={`w-full border rounded-lg p-4 focus:ring-2 focus:ring-blue-500 outline-none ${validationError ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
            value={val || ''}
            onChange={e => setResponses({...responses, [currentQ.id]: e.target.value})}
            placeholder="Type your answer here..."
            autoFocus
          />
        );
      case 'long_text':
        return (
          <textarea 
            className={`w-full border rounded-lg p-4 focus:ring-2 focus:ring-blue-500 outline-none h-40 ${validationError ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
            value={val || ''}
            onChange={e => setResponses({...responses, [currentQ.id]: e.target.value})}
            placeholder="Provide detailed context..."
            autoFocus
          />
        );
      case 'single_select':
        return (
          <div className="space-y-3">
            {currentQ.options?.map(opt => (
              <label key={opt.value} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${val === opt.value ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'hover:bg-slate-50 border-slate-200'}`}>
                <input 
                  type="radio" 
                  name={currentQ.id}
                  className="w-5 h-5 text-blue-600"
                  checked={val === opt.value}
                  onChange={() => setResponses({...responses, [currentQ.id]: opt.value})}
                />
                <span className="ml-3 font-medium text-slate-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );
      case 'multi_select':
        const selected = (val as string[]) || [];
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options?.map(opt => (
              <label key={opt.value} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selected.includes(opt.value) ? 'bg-blue-50 border-blue-500' : 'hover:bg-slate-50 border-slate-200'}`}>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded text-blue-600"
                  checked={selected.includes(opt.value)}
                  onChange={(e) => {
                    const newSel = e.target.checked 
                      ? [...selected, opt.value]
                      : selected.filter(s => s !== opt.value);
                    setResponses({...responses, [currentQ.id]: newSel});
                  }}
                />
                <span className="ml-3 font-medium text-slate-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );
      case 'multi_entry':
        const entries = (val as string[]) || [''];
        return (
          <div className="space-y-3">
            {entries.map((entry, idx) => (
              <div key={idx} className="flex gap-2">
                <input 
                  className={`flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none ${validationError && entry.trim() === '' ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                  value={entry}
                  placeholder={`Item ${idx + 1}`}
                  onChange={e => {
                    const newEntries = [...entries];
                    newEntries[idx] = e.target.value;
                    setResponses({...responses, [currentQ.id]: newEntries});
                  }}
                />
                {entries.length > 1 && (
                  <button 
                    onClick={() => {
                      const newEntries = entries.filter((_, i) => i !== idx);
                      setResponses({...responses, [currentQ.id]: newEntries});
                    }}
                    className="p-3 text-slate-400 hover:text-red-500"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                )}
              </div>
            ))}
            {entries.length < (currentQ.max_entries || 10) && (
              <button 
                onClick={() => setResponses({...responses, [currentQ.id]: [...entries, '']})}
                className="text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                + Add Another
              </button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (mode === 'select') {
    return (
      <div className="bg-white rounded-2xl p-4 md:p-8 w-full max-w-4xl mx-auto border border-slate-200 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">New Assessment</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button onClick={() => setMode('upload')} className="p-6 md:p-8 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 group-hover:bg-blue-200 group-hover:text-blue-600">
              <i className="fa-solid fa-file-arrow-up text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Upload Technical Disclosure</h3>
            <p className="text-sm text-slate-500">Analyze PDF Whitepapers, Patent Drafts, or Technical Specs.</p>
          </button>

          <button onClick={() => setMode('questionnaire')} className="p-6 md:p-8 border-2 border-blue-100 bg-blue-50/30 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <i className="fa-solid fa-clipboard-question text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Structured Interview</h3>
            <p className="text-sm text-slate-500">Step-by-step guidance for any sector (Software, Energy, MedTech, etc).</p>
            <span className="inline-block mt-4 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-1 rounded">Recommended</span>
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'upload') {
    const totalSize = uploadedFiles.reduce((acc, f) => acc + f.size, 0);
    const sizeProgress = (totalSize / (50 * 1024 * 1024)) * 100;

    return (
      <div className="bg-white rounded-2xl p-4 md:p-8 w-full max-w-2xl mx-auto border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Upload Documents</h2>
          <button onClick={() => setMode('select')} className="text-slate-400 hover:text-slate-600">Back</button>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
           <div className="mb-6 space-y-3">
              <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{uploadedFiles.length} Files Selected</span>
                  <span className={`text-xs font-bold ${sizeProgress > 90 ? 'text-red-500' : 'text-slate-500'}`}>{(totalSize / 1024 / 1024).toFixed(2)} / 50 MB</span>
              </div>
              
              <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl animate-fadeIn">
                          <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-8 h-8 bg-white text-blue-600 border border-blue-100 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                                  <i className={`fa-solid ${getFileIcon(file.type)}`}></i>
                              </div>
                              <div className="min-w-0">
                                  <p className="font-bold text-slate-700 text-sm truncate">{file.name}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                          </div>
                          <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500 p-2 transition-colors">
                              <i className="fa-solid fa-trash"></i>
                          </button>
                      </div>
                  ))}
              </div>
           </div>
        )}

        {/* Drop Zone */}
        <div 
          className={`border-2 border-dashed rounded-2xl p-6 md:p-8 text-center transition-colors ${uploadedFiles.length > 0 ? 'border-slate-300 bg-slate-50/50 hover:bg-white' : 'border-slate-300 hover:border-blue-400'}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.docx,.txt,image/*"
            onChange={handleFileUpload}
            multiple
          />
          
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl mx-auto flex items-center justify-center mb-4">
            <i className="fa-solid fa-cloud-arrow-up text-xl"></i>
          </div>
          <p className="font-bold text-slate-800 text-base mb-1">Drag & Drop files here</p>
          <p className="text-xs text-slate-500 mb-4">PDF, PPTX, DOCX, Images (Max 50MB Total)</p>
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all text-sm"
          >
            Browse Files
          </button>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          {uploadedFiles.length > 0 && (
             <button 
                onClick={() => setUploadedFiles([])}
                className="px-4 py-3 text-slate-400 hover:text-red-500 font-bold text-sm transition-colors"
             >
                Clear All
             </button>
          )}
          <button 
            onClick={startProcessing}
            disabled={uploadedFiles.length === 0}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-100 transition-all w-full md:w-auto"
          >
            Start Analysis ({uploadedFiles.length})
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'processing') {
    return (
      <div className="bg-white rounded-2xl p-8 md:p-12 w-full max-w-2xl mx-auto border border-slate-200 shadow-2xl text-center max-h-[90vh] overflow-y-auto">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6 md:mb-8"></div>
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Engaging Senior Analyst Team</h3>
        <p className="text-slate-500 mb-6 md:mb-8">Arcus Compass is synthesizing your IP & Market report...</p>
        
        <div className="bg-slate-900 rounded-xl p-4 md:p-6 text-left font-mono text-xs text-green-400 h-64 overflow-y-auto">
          {processingLogs.map((log, i) => (
            <div key={i} className="mb-2">
              <span className="opacity-50 mr-2">{new Date().toLocaleTimeString()}</span>
              {log}
            </div>
          ))}
          <div className="animate-pulse">_</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 md:p-8 w-full max-w-3xl mx-auto border border-slate-200 shadow-2xl flex flex-col h-[90vh] md:h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 mr-4">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Question {currentQIndex + 1} of {activeQuestions.length}</span>
          <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${((currentQIndex + 1) / activeQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">{currentQ.question}</h2>
        {currentQ.helper && (
          <p className="text-slate-500 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100 inline-block text-sm">
            <i className="fa-solid fa-circle-info mr-2 text-blue-400"></i>
            {currentQ.helper}
          </p>
        )}
        
        <div className="mt-4">
          {renderInput()}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
        <button 
          onClick={handleBack}
          disabled={currentQIndex === 0}
          className="px-6 py-3 font-bold text-slate-500 disabled:opacity-30 hover:bg-slate-50 rounded-xl transition-colors"
        >
          Back
        </button>
        <div className="flex flex-col items-end">
            {validationError && (
                 <span className="text-xs text-red-500 font-bold mb-2 animate-pulse flex items-center gap-1">
                     <i className="fa-solid fa-circle-exclamation"></i>
                     {validationError}
                 </span>
            )}
            <button 
              onClick={handleNext}
              disabled={!isStepValid}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-100 transition-all"
            >
              {currentQIndex === activeQuestions.length - 1 ? 'Start Analysis' : 'Next'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReportWizard;
