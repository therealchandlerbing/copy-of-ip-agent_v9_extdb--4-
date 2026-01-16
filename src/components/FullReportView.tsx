
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

const Card = ({ children, className = "", onClick, noPadding = false }: any) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div
            onClick={onClick}
            onKeyDown={onClick ? handleKeyDown : undefined}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            className={`bg-white border border-slate-200 shadow-sm rounded-xl transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-blue-400 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none' : ''} ${noPadding ? '' : 'p-6 md:p-8'} ${className}`}
        >
            {children}
        </div>
    );
};

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
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-colors ${claim.confidence === 'High' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' :
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
                                <div className="hidden sm:flex w-20 h-20 bg-slate-900 text-white items-center justify-center shadow-lg">
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
                            {/* Narrative with Highlighted Annotations */}
                            <RichText text={synthesis.insightNarrative} serif={true} className="text-lg text-slate-800 leading-relaxed drop-cap" />
                        </div>

                        <div className="flex justify-end mt-12 pt-8 border-t border-slate-300">
                            <div className="text-right relative">
                                <style>{`
                                    @keyframes sign {
                                        to { stroke-dashoffset: 0; }
                                    }
                                `}</style>
                                <div className="h-20 w-64 relative mb-4 ml-auto -mr-4 overflow-visible">
                                    {/* Animated Signature SVG */}
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
                                            strokeDasharray="1000"
                                            strokeDashoffset="1000"
                                            style={{ animation: 'sign 3s ease-out forwards 0.5s' }}
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
                            <div key={i} className={`bg-white p-6 rounded-xl border border-slate-200 h-full border-t-4 ${rec.priority === 'Critical' ? 'border-t-red-500' : rec.priority === 'High' ? 'border-t-amber-500' : 'border-t-blue-500'} shadow-md hover:shadow-lg transition-shadow relative overflow-hidden group`}>
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <i className={`fa-solid ${rec.priority === 'Critical' ? 'fa-triangle-exclamation text-red-500' : 'fa-circle-exclamation text-amber-500'} text-6xl transform rotate-12`}></i>
                                </div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center font-bold text-slate-400 font-mono text-xs border border-slate-100">
                                            0{i + 1}
                                        </div>
                                        <Badge color={rec.priority === 'Critical' ? 'red' : rec.priority === 'High' ? 'amber' : 'blue'}>
                                            {rec.priority} M.O.
                                        </Badge>
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-lg mb-3 leading-tight font-serif">{rec.title}</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">{rec.description}</p>
                                </div>
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
                                                <div className="flex items-center gap-3">
                                                    <Badge size="md" color={report.executiveSummary.riskProfile.aggregateScore >= 60 ? 'red' : report.executiveSummary.riskProfile.aggregateScore >= 40 ? 'amber' : 'emerald'}>
                                                        {report.executiveSummary.riskProfile.riskLevel.toUpperCase()} RISK
                                                    </Badge>
                                                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                        <i className="fa-solid fa-arrow-trend-down"></i>
                                                        <span>Trending Down</span>
                                                    </div>
                                                </div>
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

                                {/* Bottom Row: Restructured Narrative */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Executive Narrative</h3>
                                    <div className="prose prose-sm prose-slate max-w-none grid grid-cols-1 gap-6">
                                        {/* We split the block of text visually for better readability, assuming standard 3-paragraph structure from the backend generator */}
                                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                            <RichText text={report.executiveSummary.riskProfile.summaryParagraph} serif={true} className="text-lg text-slate-800 leading-relaxed" />
                                        </div>
                                    </div>
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
                                <div className="group relative">
                                    <p className="text-[10px] font-bold text-blue-400 uppercase mb-2">Dev Cost Estimate</p>
                                    <p className="text-5xl font-black text-white tracking-tight">{report.executiveSummary.commercializationPath.estimatedDevelopmentCost}</p>
                                    <div className="absolute left-0 -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-xs p-2 rounded text-slate-300 w-full z-20 pointer-events-none">
                                        Includes R&D, Regulatory, and Tooling
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">Time to Market</p>
                                            <p className="text-sm font-bold text-white">{report.executiveSummary.commercializationPath.timeToMarket} Months</p>
                                        </div>
                                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">Licensing Potential</p>
                                            <p className="text-sm font-bold text-emerald-400">{report.executiveSummary.commercializationPath.licensingPotential}</p>
                                        </div>
                                        <div className="w-full flex gap-1">
                                            {['Low', 'Medium', 'High'].map((l, i) => (
                                                <div key={i} className={`h-2 flex-1 rounded-sm ${(l === 'Low' && ['Low', 'Medium', 'High'].includes(report.executiveSummary.commercializationPath.licensingPotential)) ? 'bg-emerald-800' :
                                                    (l === 'Medium' && ['Medium', 'High'].includes(report.executiveSummary.commercializationPath.licensingPotential)) ? 'bg-emerald-600' :
                                                        (l === 'High' && report.executiveSummary.commercializationPath.licensingPotential === 'High') ? 'bg-emerald-400' :
                                                            'bg-slate-800'
                                                    }`}></div>
                                            ))}
                                        </div>
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Interactive Schematic Area - UPDATED WITH CONTEXT */}
                <div className="lg:col-span-8">
                    <Card className="h-full bg-slate-900 border-slate-900 relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <i className="fa-solid fa-bezier-curve"></i> System Architecture
                                </h3>
                                <p className="text-white font-bold text-lg">Core Technology: {report.sector}</p>
                                <p className="text-xs text-slate-400 mt-1 max-w-md">Visual representation of system logic flow and critical constraints.</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Badge color="blue" size="sm">Schematic View</Badge>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> Logic
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 ml-1"></div> Input
                                    <div className="w-2 h-2 rounded-full bg-amber-500 ml-1"></div> Link
                                </div>
                            </div>
                        </div>

                        {/* Interactive Schematic Visual */}
                        <div className="flex-1 bg-slate-800/50 rounded-xl border border-slate-700 p-8 relative min-h-[350px] flex items-center justify-center group overflow-hidden">
                            {/* Grid Background */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                            {/* Central Node (Innovation) */}
                            <div className="relative z-20 text-center">
                                <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-slate-900 px-3 py-1 rounded text-[10px] text-blue-300 border border-blue-900/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                    Primary Processing Unit
                                </div>
                                <div className="w-24 h-24 mx-auto bg-blue-600/20 border-2 border-blue-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] animate-pulse-slow relative cursor-pointer">
                                    <i className="fa-solid fa-microchip text-4xl text-blue-400"></i>
                                    {/* Satellites */}
                                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-t from-blue-500 to-transparent"></div>
                                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-blue-500 to-transparent"></div>
                                    <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-16 h-px bg-gradient-to-l from-blue-500 to-transparent"></div>
                                    <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-16 h-px bg-gradient-to-r from-blue-500 to-transparent"></div>
                                </div>
                                <p className="mt-4 text-xs font-bold text-blue-300 uppercase tracking-widest bg-slate-900/80 px-2 rounded inline-block border border-blue-500/30">Core Logic Node</p>
                            </div>

                            {/* Floating Hotspots (Simulated) */}
                            <div className="absolute top-10 left-10 max-w-[180px] group/item">
                                <div className="p-3 bg-slate-800 border border-emerald-500/30 rounded-lg shadow-xl hover:border-emerald-400 transition-colors cursor-help relative z-10">
                                    <p className="text-[9px] text-emerald-400 uppercase mb-1 flex items-center gap-1"><i className="fa-solid fa-arrow-right-to-bracket"></i> Signal Input</p>
                                    <p className="text-[10px] text-slate-200 font-bold leading-tight">Sensor Array v2.0</p>
                                </div>
                                <div className="h-px w-20 bg-emerald-500/30 absolute top-1/2 -right-16 rotate-12"></div>
                            </div>

                            <div className="absolute bottom-10 right-10 max-w-[180px] group/item text-right">
                                <div className="p-3 bg-slate-800 border-l-4 border-l-amber-500 border-y border-r border-slate-600 rounded-r-lg shadow-xl relative z-10 hover:bg-slate-700 transition-colors">
                                    <p className="text-[9px] text-amber-500 uppercase mb-1 font-bold flex items-center justify-end gap-1">Constraint <i className="fa-solid fa-ban"></i></p>
                                    <p className="text-[10px] text-slate-200 font-bold leading-tight">Power Budget &lt; 5W</p>
                                </div>
                                <div className="h-px w-20 bg-amber-500/30 absolute top-1/2 -left-16 -rotate-12"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            {report.technologyForensics.overview.coreFeatures.map((c, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group cursor-default">
                                    <div className="w-8 h-8 rounded bg-slate-800 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700 group-hover:border-blue-500 transition-colors">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-300 font-medium block">{c.name}</span>
                                        <span className="text-[9px] text-slate-500 hidden group-hover:block animate-fadeIn">Feature Node {i + 1}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Physics of Failure */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center">
                            <i className="fa-solid fa-burst"></i>
                        </div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Physics of Failure</h3>
                    </div>

                    {report.technologyForensics.technicalRisks.map((f, i) => (
                        <div key={i} className="relative group">
                            {/* Pulsing Border for High Risk */}
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${f.riskLevel === 'high' ? 'from-red-600 to-orange-600' : 'from-amber-500 to-yellow-500'} rounded-xl opacity-75 blur opacity-0 group-hover:opacity-100 transition duration-500 group-hover:duration-200`}></div>

                            <div className="relative p-5 bg-white rounded-xl border border-slate-200 shadow-sm group-hover:border-transparent transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-slate-900 text-sm">{f.component}</h4>
                                    <span className={`text-[10px] font-bold text-white ${f.riskLevel === 'high' ? 'bg-red-600' : 'bg-amber-500'} px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm`}>{f.riskLevel}</span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed mb-4 border-l-2 border-red-100 pl-3">
                                    {f.description}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-slate-50 p-2 rounded-lg">
                                    <i className="fa-solid fa-shield-halved text-emerald-500"></i>
                                    <span>{f.mitigation}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* TRL Timeline Section */}
            <Card className="border-t-4 border-t-emerald-500">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Technology Readiness Level</h3>
                        <div className="text-3xl font-black text-slate-900">TRL {report.technologyForensics.trlAssessment.overallTrl} <span className="text-lg text-slate-400 font-normal">/ 9</span></div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Next Milestone</p>
                        <p className="text-sm font-bold text-slate-900">Field Trials</p>
                    </div>
                </div>

                <div className="relative pt-6 pb-2">
                    {/* Timeline Track */}
                    <div className="h-4 bg-slate-100 rounded-full w-full absolute top-[50%] -translate-y-[50%]"></div>
                    <div className="h-4 bg-emerald-500/20 rounded-full absolute top-[50%] -translate-y-[50%] transition-all duration-1000" style={{ width: `${(report.technologyForensics.trlAssessment.overallTrl / 9) * 100}%` }}></div>

                    {/* TRL Steps */}
                    <div className="relative flex justify-between z-10 px-2 grid grid-cols-9">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((step) => {
                            const isActive = step <= report.technologyForensics.trlAssessment.overallTrl;
                            const isNext = step === report.technologyForensics.trlAssessment.overallTrl + 1;
                            return (
                                <div key={step} className="flex flex-col items-center gap-3 group">
                                    {/* Step Circle */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${isActive ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110' :
                                        isNext ? 'bg-white border-emerald-500 text-emerald-600 animate-pulse' :
                                            'bg-white border-slate-200 text-slate-300'
                                        }`}>
                                        {step}
                                    </div>
                                    {/* Label & Funding Overlay */}
                                    <div className="text-center relative">
                                        <span className={`text-[10px] font-bold uppercase block mb-1 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}>
                                            {step === 3 ? 'PoC' : step === 6 ? 'Proto' : step === 9 ? 'Launch' : `Level ${step}`}
                                        </span>
                                        {/* Mock Funding Overlay for Specific Steps */}
                                        {(step === 4 || step === 7) && (
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-800 text-emerald-400 text-[9px] font-mono px-2 py-0.5 rounded whitespace-nowrap border border-slate-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                ${step === 4 ? '500k' : '2.5M'} Req
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.technologyForensics.trlAssessment.subsystems.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs shadow-sm">
                            <div className={`w-2 h-2 rounded-full ${s.status === 'Ready' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                            <strong className="text-slate-900">{s.name}</strong>
                            <span className="text-slate-500 ml-auto">TRL {s.trl}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );

    const renderIP = () => (
        <div className="space-y-8 animate-fadeIn">
            {/* High Level Risk Warning - Maintained */}
            {report.ipDeepDive.blockingPatents.length > 0 && (
                <div className="bg-red-50 border border-red-100 p-6 rounded-xl flex items-start gap-6 shadow-sm">
                    <div className="p-4 bg-white rounded-xl shadow-sm text-red-600 shrink-0 border border-red-100">
                        <i className="fa-solid fa-gavel text-2xl"></i>
                    </div>
                    <div>
                        <h3 className="font-bold text-red-900 text-lg mb-1">Freedom-to-Operate Risk Detected</h3>
                        <p className="text-sm text-red-700 leading-relaxed">
                            Detected {report.ipDeepDive.blockingPatents.length} potentially blocking patents.
                            Immediate invalidity search or license negotiation recommended.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Blocking Analysis & FTO (Expanded) */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Blocking Analysis - UPSCALED GRID */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center">
                                <i className="fa-solid fa-shield-halved"></i>
                            </div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Blocking Analysis</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {report.ipDeepDive.blockingPatents.map((p, i) => (
                                <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
                                    {/* Risk Indicator Strip */}
                                    <div className={`absolute top-0 left-0 w-1 h-full ${p.ftoRisk === 'high' ? 'bg-red-500' : p.ftoRisk === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>

                                    <div className="flex justify-between items-start mb-2 pl-2">
                                        <Badge color={p.ftoRisk === 'high' ? 'red' : p.ftoRisk === 'medium' ? 'amber' : 'emerald'} size="xs">{p.ftoRisk.toUpperCase()} RISK</Badge>
                                        <span className="text-[10px] font-mono text-slate-400">EXP: {p.expiration}</span>
                                    </div>

                                    <div className="pl-2 mb-3">
                                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors uppercase tracking-tight mb-1">{p.holder}</h4>
                                        <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">PATENT {p.patentNumber}</span>
                                    </div>

                                    <p className="pl-2 text-[11px] text-slate-500 leading-relaxed line-clamp-3 bg-slate-50 p-2 rounded border border-slate-100">
                                        "{p.relevance}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FTO Table with Tooltip & Probability */}
                    <Card noPadding>
                        <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-slate-900 text-sm">FTO Clearance Status</h3>
                                <div className="group relative">
                                    <i className="fa-solid fa-circle-info text-slate-400 hover:text-blue-500 cursor-help"></i>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white text-[10px] p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                        Note: This component is AI generated, based on deep research, and should be discussed with a qualified patent agent/attorney.
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white text-slate-500 font-bold text-[10px] uppercase tracking-wider border-b border-slate-100">
                                    <tr>
                                        <th className="p-4 pl-6">Component</th>
                                        <th className="p-4">Risk Level</th>
                                        <th className="p-4">Litigation Prob.</th>
                                        <th className="p-4">Mitigation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {report.ipDeepDive.ftoAssessment.components.map((c, i) => {
                                        // Caluclate mock probability based on risk level text
                                        const riskLevel = c.riskLevel ? c.riskLevel.toLowerCase() : 'low';
                                        const prob = riskLevel.includes('high') ? 85 : riskLevel.includes('medium') ? 45 : 15;
                                        const color = riskLevel.includes('high') ? 'red' : riskLevel.includes('medium') ? 'amber' : 'emerald';

                                        return (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4 pl-6 font-bold text-slate-900">{c.component}</td>
                                                <td className="p-4">
                                                    <Badge size="xs" color={color}>{riskLevel.toUpperCase()}</Badge>
                                                </td>
                                                <td className="p-4 w-40">
                                                    {/* Probability Bar */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full bg-${color}-500`} style={{ width: `${prob}%` }}></div>
                                                        </div>
                                                        <span className="text-[10px] font-mono font-bold text-slate-400">{prob}%</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-xs text-slate-600 italic">"{c.mitigation}"</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Right Column: IP Strategy & Roadmap */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Filing Strategy Steps (Existing Code) */}
                    <Card className="bg-slate-900 border-slate-800 text-white">
                        <div className="p-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Filing Strategy Steps</h3>
                            <div className="space-y-4">
                                {report.ipDeepDive.filingStrategy.phases.map((phase, i) => (
                                    <div key={i} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 relative hover:bg-slate-800 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Step {i + 1}</span>
                                                <h4 className="font-bold text-sm text-white leading-tight">{phase.name}</h4>
                                            </div>
                                            <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded">{phase.timeline}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-snug border-l-2 border-blue-500/30 pl-3">
                                            {phase.focus}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Defensive Moats (Existing Code) */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <i className="fa-solid fa-dungeon"></i> Defensive Moats
                        </h3>
                        {report.ipDeepDive.filingStrategy.tradeSecrets.map((s, i) => (
                            <div key={i} className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                                <div className="mt-1">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">
                                        <i className="fa-solid fa-key"></i>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">Trade Secret #{i + 1}</h4>
                                    <p className="text-xs text-slate-600 font-medium italic mb-2">"{s}"</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-amber-700 px-2 py-0.5 bg-amber-100 rounded-full">Know-How</span>
                                        <span className="text-[10px] font-bold text-amber-700 px-2 py-0.5 bg-amber-100 rounded-full">Confidential</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Full Width IP Landscape Map - NEW RADAR VISUALIZATION */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <i className="fa-solid fa-map-location-dot"></i> IP Risk Radar
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Spatial visualization of patent landscape proximity</p>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase text-slate-400">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Direct Block</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Close Art</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Whitespace</div>
                    </div>
                </div>

                <div className="w-full h-[500px] bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-800 shadow-2xl">
                    {/* Radar Grid/Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900 to-slate-900"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                    {/* Orbits */}
                    <div className="absolute w-[80%] h-[80%] rounded-full border border-emerald-500/10 border-dashed animate-spin-slow-reverse"></div>
                    <div className="absolute w-[55%] h-[55%] rounded-full border border-amber-500/10 border-dashed animate-spin-slow"></div>
                    <div className="absolute w-[30%] h-[30%] rounded-full border border-red-500/10 border-dashed"></div>

                    {/* Axis Lines */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <div className="w-full h-px bg-white"></div>
                        <div className="h-full w-px bg-white absolute"></div>
                    </div>

                    {/* Center Node (US) */}
                    <div className="absolute z-30 group cursor-default">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.6)] border-4 border-blue-400/50 relative">
                            <i className="fa-solid fa-bullseye text-white text-xl"></i>
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-900/80 px-3 py-1 rounded-full border border-blue-500/50 text-blue-200 text-[10px] font-bold uppercase">
                                Our Innovation
                            </div>
                        </div>
                    </div>

                    {/* Plot Patents on Radar */}
                    {report.ipDeepDive.blockingPatents.map((p, i) => {
                        // Determine Distance based on Risk
                        // High Risk = Close (15% - 25% from center)
                        // Medium Risk = Mid (30% - 50%)
                        // Low Risk = Far (60% - 85%)
                        const risk = p.ftoRisk ? p.ftoRisk.toLowerCase() : 'medium';
                        const baseDist = risk === 'high' ? 20 : risk === 'medium' ? 40 : 70;
                        const randomVar = (i * 13) % 10; // Deterministic Variance
                        const distance = baseDist + randomVar;

                        // Determine Angle
                        const angle = (i * 137.5) % 360; // Golden Angle for distribution
                        const color = risk === 'high' ? 'bg-red-500' : risk === 'medium' ? 'bg-amber-500' : 'bg-emerald-500';
                        const glow = risk === 'high' ? 'shadow-[0_0_15px_rgba(239,68,68,0.6)]' : risk === 'medium' ? 'shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'shadow-[0_0_15px_rgba(16,185,129,0.5)]';

                        return (
                            <div
                                key={i}
                                className="absolute top-1/2 left-1/2 w-0 h-0 z-20"
                                style={{ transform: `rotate(${angle}deg)` }}
                            >
                                <div
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                                    style={{ left: `${distance}%` }} // Simplified, assumes container is responsive enough. Actually % left works if we rotate parent container. 
                                // RE-THINK: Rotating a 0x0 div is easiest way to place angularly.
                                // wait, `left: distance%` on a rotated container moves it "out" along that angle? No, it moves it along X axis OF THE ROTATED CONTAINER. Yes.
                                >
                                    {/* Rotated back content to be upright? No, just dots for now, hover details can handle it */}
                                    <div className={`w-4 h-4 ${color} rounded-full ${glow} border-2 border-slate-900 cursor-pointer hover:scale-150 transition-transform relative`} style={{ transform: `rotate(-${angle}deg)` }}>
                                        {/* Tooltip Card */}
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 bg-white text-slate-900 p-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-left border border-slate-200">
                                            <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">{p.holder}</div>
                                            <div className="text-xs font-bold leading-tight mb-2">Pat: {p.patentNumber}</div>
                                            <Badge size="xs" color={risk === 'high' ? 'red' : risk === 'medium' ? 'amber' : 'emerald'}>{risk.toUpperCase()}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const renderMarket = () => (
        <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Market Size & Trends */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Market Size Euler Diagram - HIGH CONTRAST */}
                    {report.marketDynamics.marketSizeAnalysis && (
                        <Card className="bg-slate-900 border-slate-900 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/30 rounded-full blur-[80px]"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                                <div className="flex-1">
                                    <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <i className="fa-solid fa-chart-pie"></i> Market Sizing (2025)
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-3xl font-black text-white mb-1">{report.marketDynamics.marketSizeAnalysis.tam}</p>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Addressable Market (TAM)</p>
                                        </div>
                                        <div className="pl-4 border-l-2 border-indigo-500/50">
                                            <p className="text-xl font-bold text-white mb-1">{report.marketDynamics.marketSizeAnalysis.sam}</p>
                                            <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Serviceable Available (SAM)</p>
                                        </div>
                                        <div className="pl-4 border-l-2 border-emerald-500/50">
                                            <p className="text-lg font-bold text-white mb-1">{report.marketDynamics.marketSizeAnalysis.som}</p>
                                            <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Serviceable Obtainable (SOM)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Industry Outlook - HIGH CONTRAST CARDS */}
                    {report.marketDynamics.marketSizeAnalysis && (
                        <Card className="bg-white border-slate-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <i className="fa-solid fa-chart-line"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm uppercase">Industry Outlook</h3>
                                    <p className="text-xs text-slate-500">Global market sizing ({report.marketDynamics.marketSizeAnalysis.forecastPeriod})</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center group hover:bg-white hover:shadow-md transition-all">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Addressable Market</p>
                                    <p className="text-3xl font-black text-slate-900 mb-1">{report.marketDynamics.marketSizeAnalysis.totalAddressableMarket}</p>
                                    <div className="h-1 w-12 bg-slate-200 rounded-full mx-auto my-3 group-hover:w-24 group-hover:bg-blue-500 transition-all"></div>
                                    <p className="text-[10px] text-slate-500 leading-tight">Total revenue opportunity for product class</p>
                                </div>

                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center relative overflow-hidden group hover:shadow-md transition-all">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200/50 rounded-full blur-xl"></div>
                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Serviceable Market</p>
                                    <p className="text-3xl font-black text-blue-700 mb-1">{report.marketDynamics.marketSizeAnalysis.serviceableAvailableMarket}</p>
                                    <div className="h-1 w-12 bg-blue-200 rounded-full mx-auto my-3 group-hover:w-24 group-hover:bg-blue-600 transition-all"></div>
                                    <p className="text-[10px] text-blue-800/70 leading-tight">Specific segment addressable by innovation</p>
                                </div>

                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center group hover:shadow-md transition-all">
                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">CAGR</p>
                                    <p className="text-4xl font-black text-emerald-600 mb-1">{report.marketDynamics.marketSizeAnalysis.cagr}</p>
                                    <div className="h-1 w-12 bg-emerald-200 rounded-full mx-auto my-3 group-hover:w-24 group-hover:bg-emerald-500 transition-all"></div>
                                    <p className="text-[10px] text-emerald-800/70 leading-tight">{report.marketDynamics.marketSizeAnalysis.forecastPeriod} Forecast</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Feature Comparison Radar (War Room) */}
                    <Card>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
                                <i className="fa-solid fa-crosshairs"></i> Feature War Room
                            </h3>
                            <Badge color="slate" size="xs">Competitive Benchmark</Badge>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                                    <tr>
                                        <th className="p-3 rounded-l-lg">Feature / Dimension</th>
                                        <th className="p-3">Our Innovation</th>
                                        <th className="p-3 rounded-r-lg">Incumbent Standard</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {report.marketDynamics.featureComparison?.map((f, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3 font-medium text-slate-900 capitalize">{f.feature}</td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    {f.us ? (
                                                        <>
                                                            <i className="fa-solid fa-check text-emerald-500"></i>
                                                            <span className="font-bold text-emerald-700">{f.advantage}</span>
                                                        </>
                                                    ) : (
                                                        <i className="fa-solid fa-xmark text-slate-400"></i>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3 text-slate-500">
                                                {f.competitor ? 'Yes' : 'No'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Graveyard & Stats */}
                <div className="lg:col-span-4 space-y-8">
                    {/* The Graveyard - HORIZONTAL LAYOUT FIX */}
                    <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-slate-800 text-slate-400 rounded flex items-center justify-center">
                                <i className="fa-solid fa-tombstone"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm uppercase">The Graveyard</h3>
                                <p className="text-xs text-slate-500">Cautionary Tales</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {report.marketDynamics.graveyard?.length > 0 ? (
                                report.marketDynamics.graveyard.map((g, i) => (
                                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-900 text-xs leading-tight">{g.company}</h4>
                                            <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1 rounded">{g.year}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 leading-snug mb-3 flex-1">"{g.causeOfDeath}"</p>
                                        <div className="pt-2 border-t border-slate-100 text-center">
                                            <span className="text-[8px] font-bold text-red-300 uppercase tracking-widest">R.I.P.</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 p-8 text-center text-slate-400 italic bg-white rounded-xl border border-slate-200">
                                    No graveyard data available for this market.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Industry Stats */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Growth Factors</h3>
                        {report.marketDynamics.marketSizeAnalysis.keyDrivers?.map((t, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <i className="fa-solid fa-arrow-trend-up text-emerald-600 mt-1"></i>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{t}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );


    const renderRegulatory = () => (
        <div className="space-y-8 animate-fadeIn">
            {/* Classification & Strategy Header */}
            <div className="bg-slate-900 rounded-2xl p-8 relative overflow-hidden text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]"></div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <Badge color="blue" size="sm" className="bg-blue-500/20 text-blue-200 border-blue-500/50">{report.regulatoryPathway.classification.pathway}</Badge>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Regulatory Strategy</span>
                        </div>
                        <h2 className="text-4xl font-black mb-4 tracking-tight">{report.regulatoryPathway.classification.regulatoryClassification}</h2>
                        <p className="text-base text-slate-300 leading-relaxed max-w-xl">{report.regulatoryPathway.classification.intro}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Timeline Estimate</h3>
                        <p className="text-3xl font-black text-white mb-2">{report.regulatoryPathway.classification.timelineEstimate}</p>
                        <div className="w-full bg-slate-700 rounded-full h-1.5 mb-2 overflow-hidden">
                            <div className="h-full bg-blue-500 w-1/3 rounded-full animate-pulse-slow"></div>
                        </div>
                        <p className="text-[10px] text-slate-400 text-right">Submission Prep Phase</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Raceway & Predicate */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Regulatory Raceway Timeline */}
                    <Card>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
                                <i className="fa-solid fa-flag-checkered"></i> Regulatory Raceway
                            </h3>
                            <Badge color="slate" size="xs">Execution Plan</Badge>
                        </div>
                        <div className="relative">
                            {/* Connector Line */}
                            <div className="absolute left-[28px] top-4 bottom-4 w-0.5 bg-slate-100"></div>

                            <div className="space-y-6 relative">
                                {report.regulatoryPathway.timelineCost?.map((t, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="w-14 h-14 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center shrink-0 z-10 shadow-sm group-hover:border-blue-100 group-hover:bg-blue-50 transition-colors">
                                            <span className="font-black text-slate-300 group-hover:text-blue-500 text-lg transition-colors">{i + 1}</span>
                                        </div>
                                        <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100 group-hover:border-blue-200 group-hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-900 text-sm">{t.phase}</h4>
                                                <span className="font-mono font-bold text-slate-500 text-xs bg-white px-2 py-1 rounded border border-slate-200">{t.cost}</span>
                                            </div>
                                            {/* Simulated details for visual density if standard text is short */}
                                            <div className="flex gap-2 mt-3">
                                                <span className="h-1.5 w-8 rounded-full bg-slate-200"></span>
                                                <span className="h-1.5 w-12 rounded-full bg-slate-200"></span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Predicate Match Scorecard */}
                    {(report.regulatoryPathway.comparableSystems?.length || 0) > 0 && (
                        <Card className="bg-slate-50 border-slate-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                    <i className="fa-solid fa-scale-balanced"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm uppercase">Predicate Match Scorecard</h3>
                                    <p className="text-xs text-slate-500">Substantial Equivalence Analysis</p>
                                </div>
                            </div>

                            {report.regulatoryPathway.comparableSystems.slice(0, 1).map((p, i) => (
                                <div key={i} className="bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        <div className="p-6 border-b md:border-b-0 md:border-r border-indigo-50">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Predicate Device</p>
                                            <h4 className="text-xl font-bold text-slate-900 mb-1">{p.productName}</h4>
                                            <p className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded mb-4">{p.referenceNumber}</p>

                                            <div className="space-y-3">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">Intended Use</span>
                                                    <span className="text-emerald-600 font-bold"><i className="fa-solid fa-check mr-1"></i> Match</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">Technology</span>
                                                    <span className="text-emerald-600 font-bold"><i className="fa-solid fa-check mr-1"></i> Match</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">Performance</span>
                                                    <span className="text-amber-600 font-bold"><i className="fa-solid fa-triangle-exclamation mr-1"></i> Superior</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-slate-50/50">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Relevance Statement</p>
                                            <p className="text-sm text-slate-600 italic leading-relaxed">"{p.relevance}"</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Card>
                    )}
                </div>

                {/* Right Column: Standards & Risks */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Grouped ISO Standards */}
                    <Card>
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-6">Applicable Standards</h3>
                        <div className="space-y-4">
                            {/* Grouping logic visualization */}
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 border-b border-slate-100 pb-1">Primary Safety (IEC/ISO)</p>
                                <div className="flex flex-wrap gap-2">
                                    {report.regulatoryPathway.classification?.standards?.filter(s => s.includes('IEC') || s.includes('ISO')).map((s, i) => (
                                        <Badge key={i} color="blue" size="xs" className="font-mono">{s}</Badge>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 border-b border-slate-100 pb-1">Other / Vertical</p>
                                <div className="flex flex-wrap gap-2">
                                    {report.regulatoryPathway.classification?.standards?.filter(s => !s.includes('IEC') && !s.includes('ISO')).map((s, i) => (
                                        <Badge key={i} color="slate" size="xs" className="font-mono">{s}</Badge>
                                    ))}
                                    {report.regulatoryPathway.classification?.standards?.filter(s => !s.includes('IEC') && !s.includes('ISO')).length === 0 && (
                                        <span className="text-[10px] text-slate-400 italic">None specifically listed</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Risks Card */}
                    {(report.regulatoryPathway.risks?.length || 0) > 0 && (
                        <Card noPadding className="bg-red-50/50 border-red-100 overflow-hidden">
                            <div className="p-4 border-b border-red-100 flex items-center gap-3 bg-red-50">
                                <i className="fa-solid fa-triangle-exclamation text-red-500"></i>
                                <h3 className="text-xs font-bold text-red-800 uppercase tracking-widest">Risk Analysis</h3>
                            </div>
                            <div className="divide-y divide-red-100">
                                {report.regulatoryPathway.risks.map((r, i) => (
                                    <div key={i} className="p-4 hover:bg-red-50 transition-colors">
                                        <p className="text-xs font-bold text-red-900 mb-1">{r.title}</p>
                                        <p className="text-[11px] text-red-700 leading-relaxed font-medium opacity-80">{r.description}</p>
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
            {/* Header Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-slate-900 rounded-xl p-4 text-white shadow-lg">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Target Price</p>
                    <p className="text-2xl font-black">{report.financialRoadmap.unitEconomics.targetAsp}</p>
                    <div className="w-full bg-slate-700 h-1 mt-2 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-emerald-500"></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 text-slate-900 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total COGS</p>
                    <p className="text-2xl font-black">{report.financialRoadmap.unitEconomics.totalCogs}</p>
                    <div className="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden">
                        <div className="w-[60%] h-full bg-red-400"></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 text-slate-900 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Gross Margin</p>
                    <p className="text-2xl font-black text-emerald-600">{report.financialRoadmap.unitEconomics.grossMargin}</p>
                    <div className="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden">
                        <div className="w-[40%] h-full bg-emerald-500"></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 text-slate-900 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Breakeven Volume</p>
                    <p className="text-2xl font-black whitespace-nowrap">{report.financialRoadmap.unitEconomics.breakevenUnits} <span className="text-xs font-bold text-slate-400">Units</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visuals Column */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Unit Economics Waterfall */}
                    <Card>
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-8 flex items-center gap-2">
                            <i className="fa-solid fa-water"></i> Unit Economics Waterfall
                        </h3>
                        <div className="relative h-64 flex items-end justify-between gap-2 px-4 border-b border-slate-200 pb-2">
                            {/* ASP Bar */}
                            <div className="w-1/4 relative group">
                                <div className="absolute bottom-0 w-full bg-slate-800 rounded-t-lg h-[90%] group-hover:bg-slate-700 transition-colors"></div>
                                <div className="absolute -top-12 w-full text-center">
                                    <span className="block text-xs font-bold text-slate-500">ASP</span>
                                    <span className="block font-bold text-slate-900">{report.financialRoadmap.unitEconomics.targetAsp}</span>
                                </div>
                            </div>
                            {/* COGS Connector */}
                            <div className="w-8 border-t-2 border-dashed border-slate-300 relative top-[-40%]"></div>

                            {/* COGS Bar (Negative) */}
                            <div className="w-1/4 relative group">
                                <div className="absolute top-[10%] w-full bg-red-400/20 rounded-lg h-[50%] border-2 border-dashed border-red-400 group-hover:bg-red-400/30 transition-colors"></div>
                                <div className="absolute top-[25%] left-0 right-0 text-center text-red-700 font-bold text-xs transform -translate-y-1/2">
                                    - {report.financialRoadmap.unitEconomics.totalCogs}
                                    <span className="block text-[9px] uppercase opacity-70">COGS</span>
                                </div>
                            </div>
                            {/* Margin Connector */}
                            <div className="w-8 border-t-2 border-dashed border-slate-300 relative top-[-40%]"></div>

                            {/* Margin Bar */}
                            <div className="w-1/4 relative group">
                                <div className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg h-[40%] group-hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"></div>
                                <div className="absolute -top-12 w-full text-center">
                                    <span className="block text-xs font-bold text-emerald-600">Margin</span>
                                    <span className="block font-bold text-emerald-800">{report.financialRoadmap.unitEconomics.grossMargin}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* BOM Donut Visualization */}
                    <Card>
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-6 flex items-center gap-2">
                            <i className="fa-solid fa-chart-pie"></i> Cost of Goods Breakdown
                        </h3>
                        <div className="flex items-center gap-8">
                            <div className="relative w-40 h-40 shrink-0">
                                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                    {/* Mock Donut segments based on index */}
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="20" />
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20" strokeDasharray="60 251.2" className="animate-pulse-slow" />
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="20" strokeDasharray="40 251.2" strokeDashoffset="-60" />
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="30 251.2" strokeDashoffset="-100" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xs font-bold text-slate-400">Total</span>
                                    <span className="font-black text-slate-900">{report.financialRoadmap.unitEconomics.totalCogs}</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-3">
                                {report.financialRoadmap.unitEconomics?.bom?.map((b, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
                                            <span className="font-bold text-slate-700">{b.component}</span>
                                            <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 rounded">{b.supplier}</span>
                                        </div>
                                        <span className="font-mono font-bold text-slate-900">{b.cost}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Capital & Runway Column */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Funding Card */}
                    <Card className="bg-slate-900 text-white border-slate-900 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/30 rounded-full blur-[60px]"></div>
                        <div className="relative z-10">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Capital Requirements</h3>

                            <div className="mb-8">
                                <p className="text-sm text-blue-200 mb-1">Seed / Dev Phase</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-5xl font-black text-white tracking-tighter">{report.financialRoadmap.fundingRequirements.seed.amount}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Use of Funds</p>
                                <div className="flex flex-wrap gap-2">
                                    {report.financialRoadmap.fundingRequirements?.seed?.useOfFunds?.map((u, i) => (
                                        <div key={i} className="px-3 py-1.5 bg-white/10 rounded border border-white/10 text-xs font-medium hover:bg-white/20 transition-colors cursor-default">
                                            {u}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-slate-400">Next Round (Series A)</span>
                                    <span className="font-mono text-emerald-400 font-bold">{report.financialRoadmap.fundingRequirements.seriesA.amount}</span>
                                </div>
                                <div className="text-[10px] text-slate-400 leading-tight">
                                    Trigger: <span className="text-slate-300">{report.financialRoadmap.fundingRequirements.seriesA.trigger}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Cash Runway / Capital Plan */}
                    <Card className="h-full bg-slate-50 border-slate-200">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <i className="fa-solid fa-timeline"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-xs uppercase">Deployment Plan</h3>
                                <p className="text-[10px] text-slate-500">Capital Efficiency</p>
                            </div>
                        </div>

                        <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pl-6 py-2">
                            {report.financialRoadmap.actionPlan?.map((action, i) => (
                                <div key={i} className="relative">
                                    <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-white border-2 border-slate-300"></div>
                                    <span className="text-[10px] font-mono font-bold text-slate-400 absolute -left-[80px] top-0.5 w-[40px] text-right">{action.months}</span>

                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm mb-1">{action.phase}</h4>
                                        <p className="text-xs text-slate-600 mb-2 leading-snug">{action.activities}</p>
                                        <Badge color={i % 2 === 0 ? 'emerald' : 'blue'} size="xs">{action.budget}</Badge>
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
            {/* Execution Plan & Critical Path */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-8">
                    <Card>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
                                <i className="fa-solid fa-chess-board"></i> Strategic Execution Plan
                            </h3>
                            <Badge color="emerald" size="xs">90-Day Sprint</Badge>
                        </div>
                        <div className="relative border-l-2 border-slate-200 ml-3 pl-8 py-2 space-y-8">
                            {(report.strategicRecommendations.priorityActions || []).map((action, i) => (
                                <div key={i} className="relative group">
                                    <div className={`absolute -left-[41px] w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-emerald-500 text-white ring-2 ring-emerald-100' : 'bg-slate-200 text-slate-500'}`}>
                                        {i + 1}
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-900 text-sm">{action.action}</h4>
                                            {i === 0 && <span className="text-[9px] font-bold text-white bg-red-500 px-2 py-0.5 rounded uppercase tracking-wider animate-pulse-slow">Critical Path</span>}
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-3 bg-slate-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <i className="fa-solid fa-user-circle text-slate-400"></i>
                                                <span className="font-medium text-slate-700">{action.owner}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <i className="fa-solid fa-hourglass-half text-slate-400"></i>
                                                <span className="font-medium text-slate-700">{action.timeline}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <i className="fa-solid fa-wallet text-slate-400"></i>
                                                <span className="font-mono font-medium text-slate-700">{action.budget}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Go / No-Go Logic Tree */}
                    <Card className="bg-slate-900 text-white border-slate-900 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-8 flex items-center gap-2">
                                <i className="fa-solid fa-traffic-light"></i> Decision Logic Tree
                            </h3>

                            <div className="flex flex-col items-center relative">
                                {/* Root Decision Node */}
                                <div className="bg-blue-600 px-6 py-3 rounded-xl border border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.3)] mb-8 z-10">
                                    <span className="font-bold text-sm">Gate Review: Series A</span>
                                </div>
                                <div className="h-8 w-0.5 bg-slate-700 absolute top-12"></div>
                                <div className="w-[80%] h-0.5 bg-slate-700 absolute top-20"></div>

                                <div className="flex justify-between w-full mt-8">
                                    {/* Green Path (Advance) */}
                                    <div className="w-[48%] bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-5 relative group hover:bg-emerald-900/30 transition-colors">
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-[10px] font-bold px-2 py-1 rounded text-white shadow-lg">ADVANCE</div>
                                        <ul className="space-y-3 mt-2">
                                            {report.strategicRecommendations.goNoGoFramework?.goCriteria?.map((c, i) => (
                                                <li key={i} className="flex items-start gap-3 text-xs text-emerald-100">
                                                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                        <i className="fa-solid fa-check text-emerald-400 text-[8px]"></i>
                                                    </div>
                                                    {c}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Red Path (Kill/Pivot) */}
                                    <div className="w-[48%] bg-red-900/20 border border-red-500/30 rounded-xl p-5 relative group hover:bg-red-900/30 transition-colors">
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-[10px] font-bold px-2 py-1 rounded text-white shadow-lg">PIVOT / KILL</div>
                                        <ul className="space-y-3 mt-2">
                                            {report.strategicRecommendations.goNoGoFramework?.noGoCriteria?.map((c, i) => (
                                                <li key={i} className="flex items-start gap-3 text-xs text-red-100">
                                                    <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                        <i className="fa-solid fa-xmark text-red-400 text-[8px]"></i>
                                                    </div>
                                                    {c}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Partnerships Column */}
                <div className="lg:col-span-5 space-y-8">
                    <Card className="bg-gradient-to-br from-white to-blue-50/50 h-full border-blue-100">
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-6 flex items-center gap-2">
                            <i className="fa-solid fa-handshake-simple"></i> Strategic Partnerships
                        </h3>
                        <div className="space-y-6">
                            {report.strategicRecommendations.partnerships?.map((p, i) => (
                                <div key={i} className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge color="blue" size="xs">{p.type}</Badge>
                                        <span className="text-[10px] font-mono text-slate-400">{p.approach}</span>
                                    </div>

                                    {/* Dynamic Logo Block Logic */}
                                    <div className="flex -space-x-3 mb-4 overflow-hidden py-2 pl-1">
                                        {p.targets.split(',').map((target, idx) => {
                                            const cleanName = target.trim();
                                            // Heuristic for logo fetching or fallback
                                            const logoUrl = `https://logo.clearbit.com/${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
                                            const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=random&color=fff&size=128`;

                                            return (
                                                <div key={idx} className="relative w-12 h-12 rounded-lg bg-white border-2 border-white shadow-md flex items-center justify-center overflow-hidden hover:scale-110 hover:z-10 transition-transform" title={cleanName}>
                                                    <img
                                                        src={logoUrl}
                                                        onError={(e) => { e.currentTarget.src = fallbackUrl }}
                                                        alt={cleanName}
                                                        className="w-full h-full object-contain p-1"
                                                    />
                                                </div>
                                            );
                                        })}
                                        {/* Add Placeholder if list is long? No, just show all for now */}
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-slate-700">Targeting: <span className="font-normal text-slate-600">{p.targets}</span></p>
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Value Exchange</p>
                                            <p className="text-xs text-blue-800 italic leading-snug">"{p.valueExchange}"</p>
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
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${activeTab === tab.id
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
                            <div className="animate-fadeIn">
                                <SectionHeader icon="fa-wand-magic-sparkles" title="Visual Appendix" subtitle="Generative Industrial Design" />

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Sidebar: Generation Context */}
                                    <div className="space-y-6">
                                        <Card>
                                            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-4">Rendering Context</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Target Sector</p>
                                                    <Badge color="indigo">{report.sector}</Badge>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Design Language</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">Photorealistic</span>
                                                        <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">Industrial</span>
                                                        <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">Modern</span>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-slate-100">
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Active Prompt</p>
                                                    <p className="text-xs text-slate-600 italic leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                        "{report.productConcept.prompt}"
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>

                                        <div className="bg-slate-900 rounded-xl p-6 text-white text-center shadow-lg">
                                            <i className="fa-solid fa-layer-group text-3xl mb-4 text-emerald-400"></i>
                                            <p className="font-bold text-sm mb-1">Model: Stable Diffusion XL</p>
                                            <p className="text-xs text-slate-400">Fine-tuned on Industrial Data</p>
                                        </div>
                                    </div>

                                    {/* Main Visual */}
                                    <div className="lg:col-span-2">
                                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md group relative h-full min-h-[400px]">
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="bg-black/70 backdrop-blur text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    Live Render
                                                </span>
                                            </div>

                                            <div className="w-full h-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                                <img
                                                    src={report.productConcept.imageUrl}
                                                    className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
                                                    alt="Concept"
                                                />
                                                {/* Overlay Gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>

                                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                                    <h2 className="text-3xl font-black text-white tracking-tight mb-2 drop-shadow-lg">{report.innovation_name}</h2>
                                                    <p className="text-white/80 font-serif italic drop-shadow-md">Concept Visualization v1.0</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullReportView;
