
import React from 'react';
import { AssessmentReport, AssessmentStatus } from '../types';

interface AssessmentCardProps {
  report: AssessmentReport;
  onClick: () => void;
  onDownload?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  compact?: boolean;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ report, onClick, onDownload, onDelete, compact = false }) => {
  const getStatusStyles = (status: AssessmentStatus) => {
    switch (status) {
      case AssessmentStatus.COMPLETED: return { bg: 'bg-emerald-500/10', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', glow: 'shadow-emerald-500/20' };
      case AssessmentStatus.PROCESSING: return { bg: 'bg-amber-500/10', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500 animate-pulse', glow: 'shadow-amber-500/20' };
      case AssessmentStatus.FAILED: return { bg: 'bg-red-500/10', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', glow: 'shadow-red-500/20' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400', glow: 'shadow-slate-500/20' };
    }
  };

  const statusStyle = getStatusStyles(report.status);
  const score = report.executiveSummary?.riskProfile?.aggregateScore || 0;
  
  // Score Color Logic (High Score = High Risk = Red)
  const getScoreColor = (s: number) => {
      if (s >= 60) return 'text-red-600';
      if (s >= 40) return 'text-amber-600';
      return 'text-emerald-600';
  };

  const blockingRisks = report.ipDeepDive?.blockingPatents || [];
  const claims = report.technologyForensics?.claimsMatrix || [];
  const validatedCount = claims.filter(c => c.confidence === 'High').length;
  const trl = report.technologyForensics?.trlAssessment?.overallTrl || 0;

  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col h-full bg-white rounded-2xl border border-slate-200 transition-all duration-300 ease-out hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-blue-300/50 hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
      {/* Background Gradient Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Example Badge */}
      {report.isExample && (
         <div className="absolute top-0 right-0 z-20">
            <div className="bg-slate-100 text-slate-400 text-[9px] font-bold px-2 py-1 rounded-bl-lg border-l border-b border-slate-200 uppercase tracking-wider">
               Example Data
            </div>
         </div>
      )}

      {/* Top Decorative Line with Gradient (High Score = Red/Risk) */}
      <div className={`absolute top-0 left-0 w-full h-1.5 ${score >= 60 ? 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-500' : score >= 40 ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-400' : 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500'}`} />

      <div className="relative p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-4">
             <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-slate-200 truncate max-w-[150px]">
                  {report.sector.replace('_', ' ')}
                </span>
             </div>
             <h3 className={`font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-tight tracking-tight font-heading ${compact ? 'text-lg' : 'text-xl'}`}>
               {report.innovation_name}
             </h3>
          </div>
          
          <div className={`px-2.5 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.border} flex items-center gap-2 shadow-sm ${statusStyle.glow} backdrop-blur-sm shrink-0 ${report.isExample ? 'mt-4' : ''}`}>
             <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
             {!compact && <span className={`text-[10px] font-extrabold uppercase tracking-wide ${statusStyle.text}`}>{report.status}</span>}
          </div>
        </div>

        {/* Metrics Grid - Glassmorphism Style */}
        <div className={`grid grid-cols-2 gap-3 ${compact ? 'mb-4' : 'mb-6'}`}>
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Score</p>
                <div className="flex items-end gap-1.5">
                    <span className={`text-3xl font-black tracking-tighter leading-none ${getScoreColor(score)}`}>{score}</span>
                    <span className="text-xs font-bold text-slate-400 mb-0.5">/100</span>
                </div>
            </div>
             <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">IP Threats</p>
                <div className="flex items-end gap-2">
                    <span className={`text-3xl font-black tracking-tighter leading-none ${blockingRisks.length > 0 ? 'text-red-600' : 'text-slate-700'}`}>
                        {blockingRisks.length}
                    </span>
                    {blockingRisks.length > 0 && !compact && (
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold uppercase animate-pulse">Critical</span>
                    )}
                </div>
            </div>
        </div>

        {/* Footer Info */}
        <div className={`mt-auto pt-4 border-t border-slate-100 flex items-center justify-between ${compact ? 'hidden md:flex' : ''}`}>
            <div className="flex gap-4">
               <div className="flex items-center gap-1.5 group/tooltip relative">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${validatedCount === claims.length ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    <i className="fa-solid fa-check-double text-xs"></i>
                  </div>
                  {!compact && (
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Claims</span>
                        <span className="text-xs font-bold text-slate-700">{validatedCount}/{claims.length}</span>
                    </div>
                  )}
               </div>

               <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <i className="fa-solid fa-layer-group text-xs"></i>
                  </div>
                  {!compact && (
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Readiness</span>
                        <span className="text-xs font-bold text-slate-700">TRL {trl}</span>
                    </div>
                  )}
               </div>
            </div>
            
            <div className="text-right">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created</p>
               <p className="text-xs font-mono font-medium text-slate-600">{new Date(report.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit'})}</p>
            </div>
        </div>

        {/* Action Bar (Only shows if handlers are provided) */}
        {(onDownload || onDelete) && (
          <div className="absolute bottom-0 left-0 w-full p-4 bg-white/95 backdrop-blur-sm border-t border-slate-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between gap-3 z-20">
             {onDownload && (
               <button 
                onClick={(e) => { e.stopPropagation(); onDownload(e); }}
                className="flex-1 py-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-bold text-xs border border-slate-200 hover:border-blue-200 transition-colors flex items-center justify-center gap-2"
               >
                 <i className="fa-solid fa-file-pdf"></i>
                 Export
               </button>
             )}
             {onDelete && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(e); }}
                  className="px-3 py-2 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-colors"
                  title="Delete Assessment"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentCard;
