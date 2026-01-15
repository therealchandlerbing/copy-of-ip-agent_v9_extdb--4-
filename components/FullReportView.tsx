
import React, { useState } from 'react';
import { AssessmentReport } from '../types';
import { generateHtmlReport } from '../utils/reportGenerator';
import { marked } from 'marked';

interface FullReportViewProps {
  report: AssessmentReport;
  onClose: () => void;
  onAskAnalyst: () => void;
}

// --- RICH TEXT RENDERER (POWERED BY MARKED) ---
const RichText = ({ text, className = "", serif = false }: { text: string; className?: string, serif?: boolean }) => {
  if (!text) return null;
  
  // Parse markdown to HTML
  const html = marked.parse(text) as string;
  
  return (
    <div 
        className={`
            ${serif ? 'font-serif' : 'font-sans'} 
            ${className} 
            text-slate-700 leading-relaxed
            [&>h3]:text-xs [&>h3]:font-bold [&>h3]:text-slate-500 [&>h3]:uppercase [&>h3]:tracking-widest [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:border-b [&>h3]:border-slate-100 [&>h3]:pb-1
            [&>p]:mb-4 last:[&>p]:mb-0
            [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ul]:space-y-1
            [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>ol]:space-y-1
            [&>li]:text-slate-700
            [&>strong]:text-slate-900 [&>strong]:font-bold
            [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:bg-slate-50 [&>blockquote]:py-2 [&>blockquote]:pr-2 [&>blockquote]:my-4 [&>blockquote]:rounded-r
            [&>code]:bg-slate-100 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-slate-800 [&>code]:font-mono [&>code]:text-xs
        `}
        dangerouslySetInnerHTML={{ __html: html }} 
    />
  )
}

// --- REUSABLE UI COMPONENTS ---

const Card = ({ children, className = "", onClick, noPadding = false }: any) => (
  <div 
    onClick={onClick}
    className={`bg-white border border-slate-200 shadow-sm rounded-xl transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-blue-400 hover:shadow-md' : ''} ${noPadding ? '' : 'p-6 md:p-8'} ${className}`}
  >
    {children}
  </div>
);

const SectionHeader = ({ icon, title, subtitle, color = "slate" }: any) => {
  return (
    <div className="flex items-start md:items-center gap-6 mb-12 animate-fadeIn border-b border-slate-200 pb-8">
      <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-lg shadow-slate-200">
        <i className={`fa-solid ${icon} text-2xl`}></i>
      </div>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{subtitle}</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase border border-slate-200">Confidential</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight font-serif">{title}</h2>
      </div>
    </div>
  );
};

const Badge = ({ children, color = "slate", size = "sm" }: any) => {
  const colors: any = {
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    dark: "bg-slate-900 text-white border-slate-700"
  };
  const sizes = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm"
  };
  return (
    <span className={`inline-flex items-center justify-center rounded-md font-bold uppercase tracking-wide border ${colors[color] || colors.slate} ${sizes[size as keyof typeof sizes]}`}>
      {children}
    </span>
  );
};

const StatCard = ({ label, value, subtext, trend }: any) => (
  <div className="flex flex-col items-center justify-center text-center p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-colors">
     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</span>
     <span className="text-3xl font-black text-slate-900 tracking-tight mb-2 font-mono">{value}</span>
     {subtext && (
       <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend === 'positive' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'}`}>
         {subtext}
       </span>
     )}
  </div>
);

const RiskGauge = ({ score }: { score: number }) => {
  const size = 160;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  let colorClass = "text-emerald-500";
  
  if (score >= 40) colorClass = "text-amber-500";
  if (score >= 60) colorClass = "text-red-500";

  return (
    <div className="relative flex items-center justify-center">
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
                <circle
                    cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth}
                    strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                    className={`${colorClass} transition-all duration-1000 ease-out`}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                <span className={`text-5xl font-black tracking-tighter leading-none ${colorClass}`}>{score}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Risk Index</span>
            </div>
      </div>
    </div>
  );
};

const ClaimItem: React.FC<{ claim: any }> = ({ claim }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`group border-b border-slate-200 last:border-0 transition-all duration-300 ${isOpen ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
        <div className="p-5 pl-6 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4" onClick={() => setIsOpen(!isOpen)}>
            <div className="flex-1">
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                        claim.confidence === 'High' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' :
                        claim.confidence === 'Low' ? 'bg-red-100 text-red-600 border-red-200' :
                        claim.confidence === 'Unvalidated' ? 'bg-slate-200 text-slate-500 border-slate-300' :
                        'bg-amber-100 text-amber-600 border-amber-200'
                    }`}>
                         <i className={`fa-solid ${claim.confidence === 'High' ? 'fa-check' : claim.confidence === 'Low' ? 'fa-xmark' : 'fa-minus'} text-xs`}></i>
                    </div>
                    <div>
                        <span className="font-bold text-slate-900 block">{claim.claimName}</span>
                        <span className="text-xs text-slate-500 font-mono">{claim.validationSource}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Evidence Tier</span>
                    <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4].map((tier) => (
                            <div key={tier} className={`h-1.5 w-6 rounded-full ${tier <= claim.evidenceTier ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                        ))}
                    </div>
                </div>
                <div className={`transition-transform duration-300 text-slate-400 ${isOpen ? 'rotate-180' : ''}`}>
                    <i className="fa-solid fa-chevron-down"></i>
                </div>
            </div>
        </div>

        <div className={`grid transition-all duration-300 ease-out overflow-hidden ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="min-h-0 px-6 pl-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-200">
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Inventor Assertion</p>
                        <p className="text-sm text-slate-700 italic border-l-2 border-blue-500 pl-4 py-1 bg-white rounded-r-lg">
                            "{claim.inventorAssertion}"
                        </p>
                     </div>
                     <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Forensic Analysis</p>
                        <RichText text={claim.evidence} className="text-sm" />
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const FullReportView: React.FC<FullReportViewProps> = ({ report, onClose, onAskAnalyst }) => {
  const [activeTab, setActiveTab] = useState('executive');

  const handlePrint = () => {
    const fullHtml = generateHtmlReport(report);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(fullHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const tabs = [
    { id: 'executive', label: 'Executive Summary', icon: 'fa-chart-pie' },
    { id: 'tech', label: 'Tech Forensics', icon: 'fa-microchip' },
    { id: 'ip', label: 'IP Deep Dive', icon: 'fa-scale-balanced' },
    { id: 'market', label: 'Market Dynamics', icon: 'fa-users-viewfinder' },
    { id: 'regulatory', label: 'Compliance', icon: 'fa-file-shield' },
    { id: 'financial', label: 'Financials', icon: 'fa-coins' },
    { id: 'strategy', label: 'Strategy', icon: 'fa-chess' },
    { id: 'insights', label: 'Director\'s Insights', icon: 'fa-lightbulb' },
  ];
  
  if (report.productConcept) {
      tabs.push({ id: 'appendix', label: 'Visual Appendix', icon: 'fa-image' });
  }

  const renderInsights = () => {
    const synthesis = report.strategicRecommendations.ttoSynthesis;
    if (!synthesis) return <div className="p-8 text-center text-slate-400">No director insights available for this report.</div>;

    return (
      <div className="space-y-8 animate-fadeIn">
         {/* Director's Memo Card */}
         <Card className="bg-slate-50 border-slate-300 relative overflow-hidden shadow-sm">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <i className="fa-solid fa-signature text-9xl text-slate-900"></i>
             </div>
             
             {/* Official Header */}
             <div className="relative z-10 border-b-2 border-slate-900 pb-8 mb-8 mx-4 mt-4">
                <div className="flex justify-between items-end">
                    <div className="flex items-center gap-6">
                         <div className="w-20 h-20 bg-slate-900 text-white flex items-center justify-center">
                            <i className="fa-solid fa-scale-balanced text-4xl"></i>
                         </div>
                         <div>
                             <h3 className="font-black text-3xl text-slate-900 uppercase tracking-tighter leading-none mb-1">Arcus TTO</h3>
                             <p className="font-serif italic text-slate-600 text-xl">Official Memorandum</p>
                         </div>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date</p>
                        <p className="font-mono text-base font-bold text-slate-900">{new Date(report.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
             </div>
             
             <div className="relative z-10 px-8 pb-8">
                <div className="mb-10 p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <div className="grid grid-cols-[80px_1fr] gap-4 text-sm font-mono text-slate-600 mb-2">
                        <span className="font-bold uppercase text-slate-400 text-right">TO:</span>
                        <span className="font-bold text-slate-900">Investment Committee, {report.cover.clientName}</span>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] gap-4 text-sm font-mono text-slate-600 mb-2">
                        <span className="font-bold uppercase text-slate-400 text-right">FROM:</span>
                        <span className="font-bold text-slate-900">Director, Technology Transfer</span>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] gap-4 text-sm font-mono text-slate-600">
                        <span className="font-bold uppercase text-slate-400 text-right">RE:</span>
                        <span className="font-bold text-slate-900 uppercase">{report.innovation_name} (REF: {report.id.split('-').pop()})</span>
                    </div>
                </div>

                <div className="mb-12">
                     <RichText text={synthesis.insightNarrative} serif={true} className="text-lg text-slate-800" />
                </div>

                <div className="flex justify-end mt-12 pt-8 border-t border-slate-300">
                     <div className="text-right relative">
                         <div className="h-20 w-64 relative mb-4 ml-auto -mr-4 overflow-visible">
                            {/* Signature SVG */}
                            <svg viewBox="0 0 300 100" className="w-full h-full pointer-events-none">
                                <defs>
                                    <linearGradient id="sigGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#1e293b" />
                                        <stop offset="100%" stopColor="#2563eb" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M50,75 Q70,10 90,75 Q100,45 80,55 Q60,65 100,60 Q110,50 115,60 Q120,70 125,60 Q130,50 125,60 Q120,70 135,70 Q140,50 140,70 Q145,70 150,50 Q150,70 155,70 Q160,50 165,60 Q160,75 175,70 Q190,60 220,65 M40,85 Q150,95 260,55"
                                    fill="none"
                                    stroke="url(#sigGradient)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                         </div>
                         <p className="font-bold text-slate-900 uppercase text-sm border-t border-slate-900 pt-2 inline-block min-w-[200px]">Dr. Arcus A.I.</p>
                         <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Senior Director, TTO</p>
                     </div>
                </div>
             </div>
         </Card>

         {/* Key Recommendations */}
         <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <i className="fa-solid fa-gavel"></i> Strategic Mandates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {synthesis.keyRecommendations.map((rec, i) => (
                    <div key={i} className={`bg-white p-6 rounded-xl border border-slate-200 h-full border-t-4 ${rec.priority === 'Critical' ? 'border-t-red-500' : rec.priority === 'High' ? 'border-t-amber-500' : 'border-t-blue-500'} shadow-sm`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center font-bold text-slate-400 font-mono text-xs border border-slate-100">
                                0{i+1}
                            </div>
                            <Badge color={rec.priority === 'Critical' ? 'red' : rec.priority === 'High' ? 'amber' : 'blue'}>
                                {rec.priority} PRIORITY
                            </Badge>
                        </div>
                        <h4 className="font-bold text-slate-900 text-lg mb-3 leading-tight font-serif">{rec.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{rec.description}</p>
                    </div>
                ))}
            </div>
         </div>
      </div>
    );
  };

  const renderExecutive = () => {
    // Scoring Logic Extraction
    const breakdown = report.executiveSummary.riskProfile.scoringBreakdown || {
        technicalScore: 0,
        ipScore: 0,
        marketScore: 0,
        regulatoryScore: 0,
        financialScore: 0,
        appliedWeights: { tech: 0.2, ip: 0.2, market: 0.2, regulatory: 0.2, financial: 0.2 }
    };

    const metrics = [
        { label: 'Technical', score: breakdown.technicalScore, weight: breakdown.appliedWeights.tech, color: 'blue', icon: 'fa-microchip' },
        { label: 'IP Strategy', score: breakdown.ipScore, weight: breakdown.appliedWeights.ip, color: 'purple', icon: 'fa-shield-halved' },
        { label: 'Market', score: breakdown.marketScore, weight: breakdown.appliedWeights.market, color: 'emerald', icon: 'fa-users-viewfinder' },
        { label: 'Regulatory', score: breakdown.regulatoryScore, weight: breakdown.appliedWeights.regulatory, color: 'amber', icon: 'fa-scale-balanced' },
        { label: 'Financial', score: breakdown.financialScore, weight: breakdown.appliedWeights.financial, color: 'indigo', icon: 'fa-coins' },
    ];

    const totalViability = metrics.reduce((acc, m) => acc + (m.score * m.weight), 0);
    const calculatedRisk = 100 - Math.round(totalViability);

    return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Narrative & Risks */}
        <div className="lg:col-span-8 space-y-8">
            <Card className="p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <i className="fa-solid fa-quote-right text-9xl"></i>
            </div>
            
            <div className="flex flex-col gap-10 relative z-10">
                {/* Top Row: Metrics & Score */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-12 border-b border-slate-100 pb-10">
                    <div className="shrink-0 pt-2">
                    <RiskGauge score={report.executiveSummary.riskProfile.aggregateScore} />
                    </div>
                    
                    <div className="flex-1 w-full pt-1">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Composite Risk Profile</h3>
                                <Badge size="md" color={report.executiveSummary.riskProfile.aggregateScore >= 60 ? 'red' : report.executiveSummary.riskProfile.aggregateScore >= 40 ? 'amber' : 'emerald'}>
                                    {report.executiveSummary.riskProfile.riskLevel.toUpperCase()} RISK
                                </Badge>
                            </div>
                            <div className="text-right hidden sm:block">
                                <span className="text-xs font-mono text-slate-400">{new Date(report.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100 flex flex-col justify-center">
                                <div className="text-4xl font-black text-red-600 leading-none mb-1">{report.executiveSummary.riskProfile.tier1Count}</div>
                                <div className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Critical</div>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100 flex flex-col justify-center">
                                <div className="text-4xl font-black text-amber-600 leading-none mb-1">{report.executiveSummary.riskProfile.tier2Count}</div>
                                <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Major</div>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100 flex flex-col justify-center">
                                <div className="text-4xl font-black text-blue-600 leading-none mb-1">{report.executiveSummary.riskProfile.tier3Count}</div>
                                <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Minor</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Narrative */}
                <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Executive Narrative</h3>
                <RichText text={report.executiveSummary.riskProfile.summaryParagraph} serif={true} className="text-lg text-slate-800" />
                </div>
            </div>
            </Card>
        </div>

        {/* Right Column: Commercialization & Strengths */}
        <div className="lg:col-span-4 space-y-8">
             {/* Commercialization Sidebar */}
            <div className="bg-slate-900 rounded-xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-50"></div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8 border-b border-slate-800 pb-4 relative z-10">Commercialization Path</h3>
            <div className="space-y-8 relative z-10">
                <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase mb-2">Dev Cost Estimate</p>
                    <p className="text-5xl font-black text-white tracking-tight">{report.executiveSummary.commercializationPath.estimatedDevelopmentCost}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Time to Market</p>
                        <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">{report.executiveSummary.commercializationPath.timeToMarket} Mo</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Licensing Potential</p>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border block truncate text-center ${report.executiveSummary.commercializationPath.licensingPotential === 'High' ? 'bg-emerald-900/50 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                            {report.executiveSummary.commercializationPath.licensingPotential}
                        </span>
                    </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Key Milestone</p>
                    <p className="text-sm font-bold text-white">{report.executiveSummary.commercializationPath.keyMilestone}</p>
                </div>
                
                <p className="text-sm text-slate-400 italic leading-relaxed pt-6 border-t border-slate-800">
                "{report.executiveSummary.commercializationPath.narrative}"
                </p>
            </div>
            </div>

            {/* Strengths List */}
            <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Validated Strengths</h3>
            <div className="space-y-4">
                {report.executiveSummary.keyStrengths.map((s, i) => (
                    <div key={i} className="p-6 bg-white border border-emerald-100 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <i className="fa-solid fa-check-circle text-emerald-500 text-lg"></i>
                            <h4 className="font-bold text-slate-900 text-sm">{s.title}</h4>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed pl-7">{s.description}</p>
                    </div>
                ))}
            </div>
            </div>
        </div>
      </div>

      {/* NEW SCORE VALIDATION CARD */}
      <Card className="bg-slate-50 border-slate-200">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-slate-200">
             <div>
                 <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 uppercase tracking-wide">
                    <i className="fa-solid fa-calculator text-slate-400"></i>
                    Algorithmic Score Validation
                 </h3>
                 <p className="text-xs text-slate-500 mt-1">Deterministic weightings applied based on sector: <strong>{report.sector.replace('_', ' ').toUpperCase()}</strong></p>
             </div>
             <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
                 <div className="text-right">
                     <p className="text-[10px] font-bold text-slate-400 uppercase">Composite Viability</p>
                     <p className="text-lg font-black text-slate-700">{Math.round(totalViability)}/100</p>
                 </div>
                 <i className="fa-solid fa-arrow-right text-slate-300"></i>
                 <div className="text-right">
                     <p className="text-[10px] font-bold text-slate-400 uppercase">Risk Index</p>
                     <p className={`text-2xl font-black ${calculatedRisk >= 60 ? 'text-red-600' : calculatedRisk >= 40 ? 'text-amber-600' : 'text-emerald-600'}`}>{calculatedRisk}</p>
                 </div>
             </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
             {metrics.map((m, i) => {
                 // Dynamic classes for colors
                 const bg50 = {
                    blue: 'bg-blue-50', purple: 'bg-purple-50', emerald: 'bg-emerald-50', amber: 'bg-amber-50', indigo: 'bg-indigo-50'
                 }[m.color];
                 const text600 = {
                     blue: 'text-blue-600', purple: 'text-purple-600', emerald: 'text-emerald-600', amber: 'text-amber-600', indigo: 'text-indigo-600'
                 }[m.color];
                 const bg500 = {
                     blue: 'bg-blue-500', purple: 'bg-purple-500', emerald: 'bg-emerald-500', amber: 'bg-amber-500', indigo: 'bg-indigo-500'
                 }[m.color];

                 return (
                    <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full">
                            <div style={{ width: `${m.score}%` }} className={`h-full ${bg500} opacity-50`}></div>
                        </div>
                        
                        <div className="flex justify-between items-start mb-2">
                            <div className={`w-8 h-8 rounded-lg ${bg50} ${text600} flex items-center justify-center`}>
                                <i className={`fa-solid ${m.icon} text-xs`}></i>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{(m.weight * 100).toFixed(0)}% WGT</span>
                        </div>
                        
                        <p className="text-xs font-bold text-slate-700 uppercase mb-1 truncate">{m.label}</p>
                        <div className="flex items-end gap-1">
                            <span className="text-2xl font-black text-slate-900 leading-none">{m.score}</span>
                            <span className="text-[10px] font-bold text-slate-400 mb-0.5">/100</span>
                        </div>
                        
                        <div className="mt-2 text-[10px] text-slate-500 font-medium">
                            Contribution: <span className="text-slate-900 font-bold">+{Math.round(m.score * m.weight)}</span>
                        </div>
                    </div>
                 )
             })}
         </div>
      </Card>
    </div>
  );
  };

  const renderTechFull = () => (
    <div className="space-y-8 animate-fadeIn">
      <Card className="bg-gradient-to-br from-white to-slate-50">
        <div className="flex flex-col md:flex-row gap-12">
           <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
                <i className="fa-solid fa-gear text-slate-400"></i>
                Core Technology / Architecture
              </h3>
              <RichText text={report.technologyForensics.coreTechnology.explanation} className="text-slate-700" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                 {report.technologyForensics.overview.coreFeatures.map((feature, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-4 rounded-lg text-xs shadow-sm">
                        <strong className="block text-blue-600 mb-1 text-sm">{feature.name}</strong>
                        <span className="text-slate-600">{feature.description}</span>
                    </div>
                 ))}
              </div>
           </div>
           <div className="w-px bg-slate-200 hidden md:block"></div>
           <div className="md:w-1/3 space-y-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Specifications</h3>
              <div className="space-y-4">
                {report.technologyForensics.coreTechnology.specifications.map((s, i) => (
                   <div key={i} className="py-3 border-b border-slate-200 last:border-0 group">
                      <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-slate-700 font-bold">{s.parameter}</span>
                          <span className="font-mono text-sm font-bold text-slate-900">{s.value}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-500">vs. {s.benchmark}</span>
                          <span className="text-blue-600 font-medium italic opacity-0 group-hover:opacity-100 transition-opacity">{s.notes}</span>
                      </div>
                   </div>
                ))}
              </div>
           </div>
        </div>
      </Card>

      {/* Physics of Failure */}
      <div>
         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Physics of Failure (Technical Risks)</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {report.technologyForensics.technicalRisks.map((risk, i) => (
               <Card key={i} className={`border-t-4 ${risk.riskLevel === 'high' ? 'border-t-red-500' : 'border-t-amber-500'}`}>
                  <div className="flex justify-between items-start mb-4">
                     <h4 className="font-bold text-slate-900 text-sm">{risk.component}</h4>
                     <Badge color={risk.riskLevel === 'high' ? 'red' : 'amber'} size="xs">{risk.riskLevel.toUpperCase()} RISK</Badge>
                  </div>
                  <p className="text-xs text-slate-600 mb-6 leading-relaxed min-h-[40px]"><strong>Failure Mode:</strong> {risk.description}</p>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-[10px]">
                     <strong className="block text-slate-400 uppercase mb-2">Engineering Mitigation</strong>
                     <span className="text-slate-700">{risk.mitigation}</span>
                  </div>
               </Card>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card noPadding>
           <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <i className="fa-solid fa-list-check text-blue-600"></i>
                Technical Claims Matrix
              </h3>
              <Badge color="blue" size="xs">Audit</Badge>
           </div>
           
           <div className="divide-y divide-slate-100">
              {report.technologyForensics.claimsMatrix.map((c, i) => (
                  <ClaimItem key={i} claim={c} />
              ))}
           </div>
        </Card>

        <div className="space-y-8">
            <Card>
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">TRL Assessment</h3>
                <div className="text-right">
                    <div className="text-6xl font-black text-slate-900 tracking-tighter">TRL {report.technologyForensics.trlAssessment.overallTrl}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Readiness Level</div>
                </div>
            </div>
            <div className="space-y-6">
                {report.technologyForensics.trlAssessment.subsystems.map((s, i) => (
                    <div key={i}>
                        <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-slate-700">{s.name}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 rounded font-medium">{s.status}</span>
                            <span className="text-[10px] font-bold text-slate-900">Level {s.trl}/9</span>
                        </div>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            style={{ width: `${(s.trl / 9) * 100}%` }} 
                            className={`h-full rounded-full ${s.trl >= 7 ? 'bg-emerald-500' : s.trl >= 4 ? 'bg-blue-500' : 'bg-amber-500'}`}
                        ></div>
                        </div>
                    </div>
                ))}
            </div>
            </Card>

            <Card noPadding className="bg-amber-50 border-amber-100">
               <div className="p-4 border-b border-amber-200/50 flex justify-between items-center">
                  <h3 className="text-xs font-bold text-amber-800 uppercase tracking-widest flex items-center gap-2">
                    <i className="fa-solid fa-triangle-exclamation"></i> Validation Gaps
                  </h3>
               </div>
               <div className="divide-y divide-amber-200/50">
                  {report.technologyForensics.validationGaps.gaps.map((g, i) => (
                    <div key={i} className="p-4">
                        <div className="flex justify-between mb-1">
                            <span className="text-xs font-bold text-slate-800">{g.name}</span>
                            <Badge size="xs" color="slate">{g.estimatedCost}</Badge>
                        </div>
                        <p className="text-[11px] text-slate-600 italic mt-1">Req: {g.requiredTesting}</p>
                    </div>
                  ))}
               </div>
            </Card>
        </div>
      </div>
    </div>
  );

  const renderIP = () => (
    <div className="space-y-8 animate-fadeIn">
       {/* High Level Risk Warning */}
       {report.ipDeepDive.blockingPatents.length > 0 && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-xl flex items-start gap-6 shadow-sm">
             <div className="p-4 bg-white rounded-xl shadow-sm text-red-600 shrink-0 border border-red-100">
                <i className="fa-solid fa-gavel text-2xl"></i>
             </div>
             <div>
                <h3 className="font-bold text-red-900 text-lg mb-1">Freedom-to-Operate Risk Detected</h3>
                <p className="text-sm text-red-700 leading-relaxed">
                   Analysis identified <strong>{report.ipDeepDive.blockingPatents.length} patent families</strong> with significant claim overlap. Immediate legal review recommended.
                </p>
             </div>
          </div>
       )}

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
             {/* Blocking Patents Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.ipDeepDive.blockingPatents.map((p, i) => (
                   <Card key={i} className="bg-white border-red-100 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-red-200">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                         <i className="fa-solid fa-ban text-8xl text-red-600"></i>
                      </div>
                      <div className="relative z-10">
                          <div className="flex justify-between items-center mb-4">
                             <Badge color="red" size="xs">Blocking Risk</Badge>
                             <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">Exp: {p.expiration}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-lg mb-1">{p.holder}</h4>
                          <p className="font-mono text-xs text-slate-500 mb-6">{p.patentNumber}</p>
                          <p className="text-xs font-medium text-slate-700 leading-relaxed mb-6 bg-slate-50 p-4 rounded border border-slate-100 italic">
                             "{p.claimsCoverage}"
                          </p>
                          
                          <div className="pt-4 border-t border-slate-100">
                             <p className="text-[10px] font-bold text-blue-600 uppercase mb-2 flex items-center gap-1">
                                <i className="fa-solid fa-lightbulb"></i> Differentiation Pivot
                             </p>
                             <p className="text-xs text-slate-600 leading-relaxed">{p.differentiationOpportunity}</p>
                          </div>
                      </div>
                   </Card>
                ))}
             </div>

             {/* FTO Assessment Table (NEW) */}
             <Card>
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                     <i className="fa-solid fa-shield-halved"></i>
                   </div>
                   <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Freedom-to-Operate Assessment</h3>
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-100 mb-6">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                            <tr>
                                <th className="px-4 py-3 border-b border-slate-200">Component</th>
                                <th className="px-4 py-3 border-b border-slate-200">Risk Level</th>
                                <th className="px-4 py-3 border-b border-slate-200">Mitigation Strategy</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {report.ipDeepDive.ftoAssessment.components.map((c, i) => (
                                <tr key={i} className="hover:bg-slate-50/50">
                                    <td className="px-4 py-3 font-bold text-slate-700">{c.component}</td>
                                    <td className="px-4 py-3">
                                        <Badge color={c.riskLevel === 'high' ? 'red' : c.riskLevel === 'medium' ? 'amber' : c.riskLevel === 'low' ? 'emerald' : 'slate'} size="xs">
                                            {c.riskLevel.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-600 leading-relaxed">{c.mitigation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Overall Opinion</p>
                    <p className="text-sm text-slate-700 italic">"{report.ipDeepDive.ftoAssessment.overallAssessment}"</p>
                </div>
             </Card>

             <Card>
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                     <i className="fa-solid fa-chess-knight"></i>
                   </div>
                   <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Classification Strategy</h3>
                </div>
                <div className="text-sm text-slate-600 mb-8 leading-relaxed border-l-4 border-blue-600 pl-4 py-2 bg-slate-50 rounded-r-lg">
                  <RichText text={report.ipDeepDive.classificationAnalysis} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   {report.ipDeepDive.classificationCodes.map((c, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center hover:bg-white hover:shadow-md transition-all">
                         <div className="font-mono font-bold text-blue-600 text-lg mb-1">{c.code}</div>
                         <div className="text-[10px] text-slate-500 leading-tight font-bold uppercase">{c.description}</div>
                      </div>
                   ))}
                </div>
             </Card>

             {/* Filing Roadmap */}
             <Card className="bg-slate-50 border-slate-200">
                <div className="p-2 border-b border-slate-200 mb-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <i className="fa-solid fa-timeline"></i> IP Filing Roadmap
                    </h3>
                </div>
                <div className="space-y-6">
                    {report.ipDeepDive.filingStrategy.phases.map((phase, i) => (
                        <div key={i} className="flex gap-6 relative">
                            {/* Timeline line */}
                            {i !== report.ipDeepDive.filingStrategy.phases.length - 1 && (
                                <div className="absolute left-[15px] top-8 bottom-[-24px] w-0.5 bg-slate-200"></div>
                            )}
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 z-10 font-bold text-xs border-2 border-white shadow-sm">
                                {i + 1}
                            </div>
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-1 w-full">
                                    <h4 className="font-bold text-slate-900 text-sm">{phase.name}</h4>
                                    <span className="text-[10px] font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500 font-bold">{phase.timeline}</span>
                                </div>
                                <p className="text-xs text-slate-600 mb-3">{phase.focus}</p>
                                <div className="text-[10px] text-slate-500 bg-white border border-slate-200 p-3 rounded">
                                    <span className="font-bold text-slate-700">Details:</span> {phase.details} <span className="mx-2 text-slate-300">|</span> 
                                    <span className="font-bold text-slate-700">Est. Cost:</span> {phase.cost}
                                </div>
                            </div>
                        </div>
                    ))}
                    {report.ipDeepDive.filingStrategy.phases.length === 0 && (
                        <p className="text-xs text-slate-400 italic">No filing phases defined.</p>
                    )}
                </div>
            </Card>
          </div>

          <div className="space-y-8">
             <div className="bg-slate-900 rounded-2xl p-8 text-white h-full relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/30 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-600/20 rounded-full blur-[60px]"></div>
                
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 relative z-10 flex items-center gap-2">
                   <i className="fa-solid fa-map"></i> Whitespace Map
                </h3>
                
                <div className="relative z-10 space-y-12 pl-8 border-l border-slate-700 ml-2">
                   <div className="relative">
                      <span className="absolute -left-[37px] top-1 w-4 h-4 bg-emerald-500 rounded-full ring-4 ring-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                      <p className="text-[10px] font-bold text-emerald-400 uppercase mb-3">Technical Opportunity</p>
                      <div className="text-sm font-medium leading-relaxed text-slate-200">
                          <RichText text={report.ipDeepDive.whitespace.intro} className="text-slate-200" />
                      </div>
                   </div>
                   <div className="relative">
                      <span className="absolute -left-[37px] top-1 w-4 h-4 bg-blue-500 rounded-full ring-4 ring-slate-900 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                      <p className="text-[10px] font-bold text-blue-400 uppercase mb-3">Filing Priority</p>
                      <p className="text-sm font-medium leading-relaxed text-slate-200">{report.ipDeepDive.filingStrategy.priorityClaims}</p>
                   </div>
                   <div className="relative">
                      <span className="absolute -left-[37px] top-1 w-4 h-4 bg-amber-500 rounded-full ring-4 ring-slate-900 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></span>
                      <p className="text-[10px] font-bold text-amber-400 uppercase mb-3">Trade Secrets</p>
                      <div className="flex flex-wrap gap-2">
                         {report.ipDeepDive.filingStrategy.tradeSecrets.map((s, i) => (
                             <span key={i} className="px-3 py-1 bg-slate-800 rounded text-[10px] text-slate-300 border border-slate-700 font-bold tracking-wide">{s}</span>
                         ))}
                      </div>
                   </div>
                   
                   {/* Strategic Partnerships Section */}
                   {report.ipDeepDive.whitespace.strategicPartnerships && (
                       <div className="relative">
                          <span className="absolute -left-[37px] top-1 w-4 h-4 bg-indigo-500 rounded-full ring-4 ring-slate-900 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                          <p className="text-[10px] font-bold text-indigo-400 uppercase mb-3">Commercial Leverage</p>
                          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 space-y-3">
                              <div>
                                  <p className="text-[9px] text-slate-400 uppercase tracking-wide">Licensing Targets</p>
                                  <p className="text-xs text-slate-200 font-bold">{report.ipDeepDive.whitespace.strategicPartnerships.licensingTargets}</p>
                              </div>
                              <div>
                                  <p className="text-[9px] text-slate-400 uppercase tracking-wide">Model</p>
                                  <p className="text-xs text-slate-300">{report.ipDeepDive.whitespace.strategicPartnerships.partnershipModel}</p>
                              </div>
                              <div className="pt-3 border-t border-slate-700">
                                  <p className="text-[10px] text-slate-400 italic">"{report.ipDeepDive.whitespace.strategicPartnerships.rationale}"</p>
                              </div>
                          </div>
                       </div>
                   )}
                </div>

                <div className="mt-16 pt-8 border-t border-slate-800">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-4">Search Methodology</p>
                    <div className="space-y-3">
                        {report.ipDeepDive.searchMethodology.components.map((c, i) => (
                            <div key={i} className="text-[10px] text-slate-400 flex justify-between border-b border-slate-800 pb-2 last:border-0">
                                <span className="text-slate-300">{c.databases}</span>
                                <span className="font-mono text-slate-500">{c.resultsCount} hits</span>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  const renderMarket = () => (
     <div className="space-y-8 animate-fadeIn">
        
        {/* Industry Trends & Market Sizing Section */}
        {report.marketDynamics.marketSizeAnalysis && (
            <Card className="bg-blue-50/50 border-blue-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <i className="fa-solid fa-chart-line text-2xl"></i>
                    </div>
                    <div>
                    <h3 className="font-bold text-blue-900 text-lg uppercase tracking-tight">Industry Outlook</h3>
                    <p className="text-xs text-blue-700 font-medium">Global market sizing ({report.marketDynamics.marketSizeAnalysis.forecastPeriod})</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Total Addressable Market</p>
                    <p className="text-4xl font-black text-slate-900">{report.marketDynamics.marketSizeAnalysis.totalAddressableMarket}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Serviceable Market</p>
                    <p className="text-4xl font-black text-blue-600">{report.marketDynamics.marketSizeAnalysis.serviceableAvailableMarket}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">CAGR</p>
                    <p className="text-4xl font-black text-emerald-600">{report.marketDynamics.marketSizeAnalysis.cagr}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-4">Key Growth Drivers</h4>
                        <ul className="space-y-3">
                        {report.marketDynamics.marketSizeAnalysis.keyDrivers.map((d, i) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-700 items-start">
                                <i className="fa-solid fa-arrow-trend-up text-emerald-500 mt-1"></i>
                                {d}
                            </li>
                        ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-4">Emerging Trends</h4>
                        <div className="space-y-4">
                        {report.marketDynamics.marketSizeAnalysis.marketTrends.map((t, i) => (
                            <div key={i} className="text-sm bg-white p-3 rounded-lg border border-blue-100">
                                <span className="font-bold text-slate-900 block mb-1">{t.trend}</span>
                                <span className="text-slate-500 text-xs">{t.impact}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </Card>
        )}

        {/* Feature Comparison War Room */}
        {report.marketDynamics.featureComparison && report.marketDynamics.featureComparison.length > 0 && (
             <Card noPadding className="overflow-hidden">
                <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-red-600 text-white flex items-center justify-center font-bold text-sm">VS</div>
                        <div>
                            <h3 className="font-bold text-white text-base uppercase">Feature War Room</h3>
                            <p className="text-xs text-slate-400">Head-to-Head vs. Incumbent</p>
                        </div>
                     </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="p-5 text-left w-1/3">Critical Feature</th>
                                <th className="p-5 text-center w-32 bg-blue-50/50 text-blue-700">Us</th>
                                <th className="p-5 text-center w-32">Incumbent</th>
                                <th className="p-5 text-left">Strategic Advantage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {report.marketDynamics.featureComparison.map((f, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-5 font-bold text-slate-900">{f.feature}</td>
                                    <td className="p-5 text-center bg-blue-50/30 border-x border-slate-100 font-bold">
                                        {f.us ? <i className="fa-solid fa-check text-emerald-500 text-lg"></i> : <i className="fa-solid fa-xmark text-slate-300"></i>}
                                    </td>
                                    <td className="p-5 text-center">
                                         {f.competitor ? <i className="fa-solid fa-check text-slate-600"></i> : <i className="fa-solid fa-xmark text-slate-300"></i>}
                                    </td>
                                    <td className="p-5 text-slate-600 text-xs font-medium">{f.advantage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Graveyard - Left Column */}
           <div className="lg:col-span-4 space-y-8">
             <Card className="h-full bg-slate-50 border-slate-200 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
                   <i className="fa-solid fa-skull text-9xl text-slate-900"></i>
                </div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 relative z-10">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center">
                        <i className="fa-solid fa-tombstone"></i>
                    </div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">The Graveyard</h3>
                </div>
                <div className="space-y-6 relative z-10">
                   {(report.marketDynamics?.graveyard?.failedProducts || []).slice(0, 3).map((f, i) => (
                      <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-red-200 transition-colors group">
                         <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-slate-600 text-sm line-through decoration-slate-300 decoration-2 group-hover:text-red-600 group-hover:decoration-red-300 transition-colors">{f.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{f.timeline}</span>
                         </div>
                         <p className="text-xs text-red-600 font-bold mb-3 uppercase tracking-wide">{f.failureMode}</p>
                         <p className="text-xs text-slate-500 italic border-l-2 border-slate-200 pl-3 leading-relaxed">"{f.lesson}"</p>
                      </div>
                   ))}
                </div>
             </Card>
           </div>

           {/* Landscape - Right Column */}
           <div className="lg:col-span-8 space-y-8">
              <Card>
                 <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-8">Competitive Landscape</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {report.marketDynamics.competitiveLandscape.map((c, i) => (
                       <div key={i} className="p-6 rounded-xl border border-slate-100 hover:border-blue-400 hover:shadow-lg transition-all group bg-white">
                          <div className="flex justify-between items-start mb-4">
                             <div>
                                <h4 className="font-bold text-slate-900 text-lg mb-1">{c.name}</h4>
                                <p className="text-xs text-slate-400 font-medium">{c.segment}</p>
                             </div>
                             <Badge color={c.status === 'Active' ? 'blue' : 'slate'} size="xs">{c.status}</Badge>
                          </div>
                          <div className="text-xs bg-slate-50 p-4 rounded-lg text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                             <span className="font-bold uppercase text-[10px] text-slate-400 block mb-2">Vulnerability</span>
                             {c.vulnerability}
                          </div>
                       </div>
                    ))}
                 </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-tr from-indigo-50 to-white border-indigo-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                        <i className="fa-solid fa-bullseye text-2xl"></i>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Beachhead Market</h3>
                            <p className="text-xs text-slate-500 font-medium">Initial entry point</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase mb-2">Persona</p>
                            <p className="font-bold text-slate-900 text-sm leading-snug">{report.marketDynamics.beachheadMarket.profile}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase mb-2">Pain Point</p>
                            <p className="font-bold text-slate-900 text-sm leading-snug">{report.marketDynamics.beachheadMarket.painPoint}</p>
                        </div>
                        <div className="pt-4 border-t border-indigo-100 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase">SAM Size</span>
                            <span className="font-black text-indigo-600 text-2xl">{report.marketDynamics.beachheadMarket.marketSize}</span>
                        </div>
                    </div>
                </Card>

                <Card noPadding>
                    <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                         <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monetization</h3>
                         <i className="fa-solid fa-tag text-slate-400"></i>
                    </div>
                    <div className="p-6 space-y-6">
                        {report.marketDynamics.monetization.pricingAnalysis.map((p, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{p.category}</p>
                                    <p className="text-[10px] text-slate-500">{p.valueProposition}</p>
                                </div>
                                <div className="text-right">
                                    <span className="font-mono font-bold text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">{p.priceRange}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                     <div className="p-6 border-t border-slate-200 bg-slate-50">
                         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Acquisition Timeline</h3>
                         <div className="space-y-3">
                            {report.marketDynamics.customerAcquisition.map((a, i) => (
                                <div key={i} className="text-xs flex gap-3">
                                    <span className="font-mono text-slate-400 min-w-[70px] font-bold">{a.timeline}</span>
                                    <span className="font-bold text-slate-800">{a.strategy}</span>
                                </div>
                            ))}
                         </div>
                    </div>
                </Card>
              </div>
           </div>
        </div>
     </div>
  );

  const renderRegulatory = () => (
     <div className="space-y-8 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Classification Card */}
            <Card className="flex flex-col justify-between border-t-4 border-t-slate-900">
                <div>
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Regulatory Classification</h3>
                   <div className="text-6xl font-black text-slate-900 mb-3 tracking-tighter">{report.regulatoryPathway.classification.regulatoryClassification}</div>
                   <div className="text-sm font-bold text-blue-600 mb-8 bg-blue-50 inline-block px-4 py-1.5 rounded-full border border-blue-100">{report.regulatoryPathway.classification.pathway}</div>
                   <p className="text-sm text-slate-600 leading-relaxed font-medium mb-8">{report.regulatoryPathway.classification.intro}</p>
                   
                   <div className="flex flex-wrap gap-2">
                        {report.regulatoryPathway.classification.standards.map((s, i) => (
                            <Badge key={i} color="slate" size="xs">{s}</Badge>
                        ))}
                   </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                   <span className="text-xs font-bold text-slate-400 uppercase">Est. Timeline</span>
                   <span className="text-xl font-bold text-slate-900">{report.regulatoryPathway.classification.timelineEstimate}</span>
                </div>
            </Card>

             {/* Precedent & Risks Card */}
            <div className="space-y-8">
                <Card className="border-t-4 border-t-slate-400">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Comparable System / Predicate</h3>
                    {report.regulatoryPathway.comparableSystems.slice(0,1).map((p, i) => (
                        <div key={i}>
                            <div className="text-3xl font-bold text-slate-900 mb-3 font-serif">{p.productName}</div>
                            <div className="inline-block px-3 py-1 bg-slate-100 rounded text-xs font-mono font-bold text-slate-600 mb-6">{p.referenceNumber}</div>
                            <p className="text-sm text-slate-600 bg-slate-50 p-6 rounded-xl border border-slate-200 italic">"{p.relevance}"</p>
                        </div>
                    ))}
                    
                    <div className="mt-8">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Cost Breakdown</h4>
                        <div className="space-y-4">
                            {report.regulatoryPathway.timelineCost.map((t, k) => (
                                <div key={k} className="flex justify-between text-xs border-b border-slate-100 pb-3 last:border-0 items-center">
                                <span className="text-slate-600 font-medium">{t.phase}</span>
                                <span className="font-mono font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded">{t.cost}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {report.regulatoryPathway.risks.length > 0 && (
                    <Card noPadding className="bg-red-50/50 border-red-100">
                        <div className="p-4 border-b border-red-100 flex items-center gap-3">
                             <i className="fa-solid fa-triangle-exclamation text-red-500"></i>
                             <h3 className="text-xs font-bold text-red-800 uppercase tracking-widest">Regulatory Risks</h3>
                        </div>
                        <div className="p-4 space-y-4">
                             {report.regulatoryPathway.risks.map((r, i) => (
                                 <div key={i}>
                                     <p className="text-xs font-bold text-red-900 mb-1">{r.title}</p>
                                     <p className="text-xs text-red-700 leading-relaxed">{r.description}</p>
                                 </div>
                             ))}
                        </div>
                    </Card>
                )}
            </div>
        </div>
     </div>
  );

  const renderFinancial = () => (
     <div className="space-y-8 animate-fadeIn">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           <StatCard label="Target Price" value={report.financialRoadmap.unitEconomics.targetAsp} />
           <StatCard label="Total COGS" value={report.financialRoadmap.unitEconomics.totalCogs} />
           <StatCard label="Gross Margin" value={report.financialRoadmap.unitEconomics.grossMargin} trend="positive" />
           <StatCard label="Breakeven" value={report.financialRoadmap.unitEconomics.breakevenUnits} subtext="Units" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Funding Box */}
           <div className="space-y-8">
               <Card className="bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20">
                  <div className="flex justify-between items-start mb-6 opacity-60">
                     <span className="text-xs font-bold uppercase tracking-widest">Dev / Seed Req</span>
                     <i className="fa-solid fa-seedling text-lg"></i>
                  </div>
                  <div className="text-6xl font-black mb-8 tracking-tighter text-blue-400">{report.financialRoadmap.fundingRequirements.seed.amount}</div>
                  <div className="flex flex-wrap gap-2">
                     {report.financialRoadmap.fundingRequirements.seed.useOfFunds.map((u, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold uppercase border border-white/10">{u}</span>
                     ))}
                  </div>
               </Card>

               {/* Series A Lookahead */}
               <Card className="bg-white border-slate-200">
                    <div className="flex justify-between items-start mb-6">
                     <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Series A Target</span>
                     <i className="fa-solid fa-rocket text-slate-300"></i>
                  </div>
                   <div className="text-4xl font-black mb-2 tracking-tighter text-slate-900">{report.financialRoadmap.fundingRequirements.seriesA.amount}</div>
                   <p className="text-xs text-slate-500 mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100"><strong>Trigger:</strong> {report.financialRoadmap.fundingRequirements.seriesA.trigger}</p>
               </Card>
           </div>

           {/* BOM Table */}
           <div className="lg:col-span-2 space-y-8">
                <Card noPadding>
                    <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 text-sm">Unit Economics / BOM</h3>
                        <Badge color="slate" size="xs">Analysis</Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-white text-slate-400 font-bold text-[10px] uppercase tracking-wider border-b border-slate-100">
                            <tr>
                                <th className="p-5 pl-8 text-left">Component</th>
                                <th className="p-5 text-left">Supplier</th>
                                <th className="p-5 pr-8 text-right">Cost</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                            {report.financialRoadmap.unitEconomics.bom.map((b, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-5 pl-8 font-bold text-slate-900">{b.component}</td>
                                    <td className="p-5 text-slate-500 text-xs font-medium">{b.supplier}</td>
                                    <td className="p-5 pr-8 text-right font-mono text-slate-900 font-bold">{b.cost}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Capital Action Plan */}
                <Card noPadding className="bg-slate-50 border-slate-200">
                    <div className="p-6 border-b border-slate-200">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-3">
                             <i className="fa-solid fa-money-check-dollar"></i> Capital Deployment Plan
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {report.financialRoadmap.actionPlan.map((action, i) => (
                            <div key={i} className="flex gap-6 items-start">
                                <div className="text-[10px] font-mono font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded shrink-0 min-w-[80px] text-center shadow-sm">
                                    {action.months}
                                </div>
                                <div className="flex-1 text-xs pt-0.5">
                                    <div className="font-bold text-slate-900 text-sm mb-1">{action.phase}</div>
                                    <div className="text-slate-600 mb-3">{action.activities}</div>
                                    <div className="flex gap-3">
                                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{action.budget}</span>
                                        <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{action.milestone}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
           </div>
        </div>
     </div>
  );

  const renderStrategy = () => (
     <div className="space-y-8 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <i className="fa-solid fa-person-running"></i>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Execution Plan (90 Days)</h3>
                </div>
                <div className="space-y-6">
                    {report.strategicRecommendations.priorityActions.map((action, i) => (
                        <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                {i + 1}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">{action.action}</h4>
                                <div className="flex gap-3 mt-1 text-xs text-slate-500">
                                    <span><i className="fa-solid fa-user mr-1"></i> {action.owner}</span>
                                    <span><i className="fa-solid fa-clock mr-1"></i> {action.timeline}</span>
                                    <span><i className="fa-solid fa-coins mr-1"></i> {action.budget}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="space-y-8">
                 <Card className="bg-white border-blue-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <i className="fa-solid fa-handshake"></i>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Partnerships</h3>
                    </div>
                    <div className="space-y-4">
                        {report.strategicRecommendations.partnerships.map((p, i) => (
                            <div key={i} className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-blue-800 text-sm">{p.type}</span>
                                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-blue-100 text-blue-600">{p.approach}</span>
                                </div>
                                <p className="text-xs text-slate-600 mb-1"><strong>Target:</strong> {p.targets}</p>
                                <p className="text-xs text-slate-500 italic">"{p.valueExchange}"</p>
                            </div>
                        ))}
                    </div>
                 </Card>

                 <Card className="bg-slate-900 text-white border-slate-700">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-6">Go / No-Go Criteria</h3>
                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-bold text-emerald-400 uppercase mb-2">Advance If:</p>
                            <ul className="space-y-2">
                                {report.strategicRecommendations.goNoGoFramework.goCriteria.map((c, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                                        <i className="fa-solid fa-check text-emerald-500 mt-0.5"></i>
                                        {c}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="pt-4 border-t border-slate-700">
                            <p className="text-[10px] font-bold text-red-400 uppercase mb-2">Kill / Pivot If:</p>
                            <ul className="space-y-2">
                                {report.strategicRecommendations.goNoGoFramework.noGoCriteria.map((c, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                                        <i className="fa-solid fa-xmark text-red-500 mt-0.5"></i>
                                        {c}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                 </Card>
            </div>
        </div>
     </div>
  );

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col animate-slideUp">
      {/* Top Navbar */}
      <div className="h-16 bg-[#0f172a] border-b border-slate-800 flex justify-between items-center px-6 shrink-0 z-20">
         <div className="flex items-center gap-4">
             <button 
                onClick={onClose} 
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
             >
                <i className="fa-solid fa-arrow-left"></i>
             </button>
             <div>
                <h1 className="text-white font-bold text-sm tracking-tight">{report.innovation_name}</h1>
                <p className="text-slate-400 text-[10px] font-mono">ID: {report.id} • {report.sector}</p>
             </div>
         </div>

         <div className="flex items-center gap-3">
             <button 
                onClick={onAskAnalyst}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/50"
             >
                <i className="fa-solid fa-robot"></i>
                Discuss with Analyst
             </button>
             <button 
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-all border border-slate-700"
             >
                <i className="fa-solid fa-print mr-2"></i>
                Export PDF
             </button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Sidebar Navigation */}
         <div className="w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto hidden md:block shrink-0">
             <div className="p-4 space-y-1">
                 {tabs.map(tab => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                            activeTab === tab.id 
                            ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
                            : 'text-slate-500 hover:bg-white hover:text-slate-700'
                        }`}
                     >
                        <i className={`fa-solid ${tab.icon} w-5 text-center`}></i>
                        {tab.label}
                     </button>
                 ))}
             </div>
             
             {/* Report Metadata */}
             <div className="p-6 mt-8 border-t border-slate-200">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Metadata</p>
                 <div className="space-y-3">
                     <div>
                         <p className="text-[10px] text-slate-500 font-bold uppercase">Client</p>
                         <p className="text-xs text-slate-800 font-medium">{report.cover.clientName}</p>
                     </div>
                     <div>
                         <p className="text-[10px] text-slate-500 font-bold uppercase">Inventor</p>
                         <p className="text-xs text-slate-800 font-medium">{report.cover.inventorName}</p>
                     </div>
                     <div>
                         <p className="text-[10px] text-slate-500 font-bold uppercase">Date</p>
                         <p className="text-xs text-slate-800 font-medium">{report.cover.reportDate}</p>
                     </div>
                 </div>
             </div>
         </div>

         {/* Main Content Area */}
         <div className="flex-1 overflow-y-auto bg-white p-6 md:p-12 relative">
             <div className="max-w-5xl mx-auto pb-20">
                 {activeTab === 'executive' && (
                     <>
                        <SectionHeader icon="fa-chart-pie" title="Executive Summary" subtitle="Risk & Opportunity Profile" />
                        {renderExecutive()}
                     </>
                 )}
                 {activeTab === 'tech' && (
                     <>
                        <SectionHeader icon="fa-microchip" title="Technology Forensics" subtitle="Architecture & TRL Assessment" />
                        {renderTechFull()}
                     </>
                 )}
                 {activeTab === 'ip' && (
                     <>
                        <SectionHeader icon="fa-scale-balanced" title="IP Deep Dive" subtitle="Freedom-to-Operate & Strategy" />
                        {renderIP()}
                     </>
                 )}
                 {activeTab === 'market' && (
                     <>
                        <SectionHeader icon="fa-users-viewfinder" title="Market Dynamics" subtitle="Competition & Commercial Viability" />
                        {renderMarket()}
                     </>
                 )}
                 {activeTab === 'regulatory' && (
                     <>
                        <SectionHeader icon="fa-file-shield" title="Regulatory Pathway" subtitle="Compliance & Certification" />
                        {renderRegulatory()}
                     </>
                 )}
                 {activeTab === 'financial' && (
                     <>
                        <SectionHeader icon="fa-coins" title="Financial Roadmap" subtitle="Unit Economics & Funding" />
                        {renderFinancial()}
                     </>
                 )}
                 {activeTab === 'strategy' && (
                     <>
                        <SectionHeader icon="fa-chess" title="Strategic Outlook" subtitle="Execution Plan & Go/No-Go" />
                        {renderStrategy()}
                     </>
                 )}
                 {activeTab === 'insights' && (
                     <>
                        {renderInsights()}
                     </>
                 )}
                 {activeTab === 'appendix' && report.productConcept && (
                     <>
                        <SectionHeader icon="fa-image" title="Visual Appendix" subtitle="Generated Concept Art" />
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <img src={report.productConcept.imageUrl} className="w-full h-auto" alt="Concept" />
                            <div className="p-6 border-t border-slate-200">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Generation Prompt</p>
                                <p className="text-sm text-slate-700 italic">"{report.productConcept.prompt}"</p>
                            </div>
                        </div>
                     </>
                 )}
             </div>
         </div>
      </div>
    </div>
  );
};

export default FullReportView;
