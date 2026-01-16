
import React from 'react';
import { AssessmentReport } from '../types';
import AssessmentCard from './AssessmentCard';

interface DashboardProps {
  reports: AssessmentReport[];
  onSelectReport: (report: AssessmentReport) => void;
  onNewAssessment: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ reports, onSelectReport, onNewAssessment }) => {
  // --- Calculation Logic (Exclude Examples) ---
  const liveReports = reports.filter(r => !r.isExample);
  const totalReports = liveReports.length;
  
  const avgRiskScore = totalReports > 0 
    ? Math.round(liveReports.reduce((acc, r) => acc + (r.executiveSummary?.riskProfile?.aggregateScore || 0), 0) / totalReports)
    : 0;

  const totalIpThreats = liveReports.reduce((acc, r) => acc + (r.ipDeepDive?.blockingPatents?.length || 0), 0);
  
  const avgTrl = totalReports > 0
    ? (liveReports.reduce((acc, r) => acc + (r.technologyForensics?.trlAssessment?.overallTrl || 0), 0) / totalReports).toFixed(1)
    : "0.0";

  // Risk Distribution for Chart (Live Data Only)
  const riskDist = {
    high: liveReports.filter(r => (r.executiveSummary?.riskProfile?.aggregateScore || 0) >= 60).length,
    elevated: liveReports.filter(r => {
        const s = r.executiveSummary?.riskProfile?.aggregateScore || 0;
        return s >= 40 && s < 60;
    }).length,
    moderate: liveReports.filter(r => {
        const s = r.executiveSummary?.riskProfile?.aggregateScore || 0;
        return s >= 25 && s < 40;
    }).length,
    low: liveReports.filter(r => (r.executiveSummary?.riskProfile?.aggregateScore || 0) < 25).length
  };

  // Sector Breakdown (Live Data Only)
  const sectorCounts: Record<string, number> = {};
  liveReports.forEach(r => {
    sectorCounts[r.sector] = (sectorCounts[r.sector] || 0) + 1;
  });
  const topSectors = Object.entries(sectorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4);

  // SVG Chart Helpers
  const totalRiskCount = Object.values(riskDist).reduce((a,b) => a+b, 0) || 1;
  
  let currentOffset = 0;
  const riskSegments = [
    { label: 'High', value: riskDist.high, color: '#ef4444' }, // Red
    { label: 'Elevated', value: riskDist.elevated, color: '#f97316' }, // Orange
    { label: 'Moderate', value: riskDist.moderate, color: '#eab308' }, // Yellow
    { label: 'Low', value: riskDist.low, color: '#10b981' } // Green
  ].map(seg => {
     const dash = (seg.value / totalRiskCount) * (2 * Math.PI * 40);
     const segment = { ...seg, dash, offset: -currentOffset }; // Negative for clockwise
     currentOffset += dash;
     return segment;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-end">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
            <p className="text-slate-500 font-medium">Real-time portfolio intelligence and risk surveillance.</p>
         </div>
         <button 
           onClick={onNewAssessment}
           className="hidden md:flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
         >
           <i className="fa-solid fa-plus"></i>
           New Assessment
         </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Active Portfolios */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative group z-10 hover:z-20 transition-all">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <i className="fa-solid fa-folder-open text-6xl"></i>
            </div>
            <div className="flex items-center gap-2 relative">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Portfolios</p>
                <div className="relative group/tooltip">
                    <i className="fa-solid fa-circle-info text-slate-300 hover:text-blue-500 cursor-help text-[10px] transition-colors"></i>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-[10px] p-2.5 rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all shadow-xl z-50 font-medium leading-relaxed pointer-events-none">
                        Total number of active innovation assessments. Archived items are excluded.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                </div>
            </div>
            <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-slate-900 leading-none">{totalReports}</span>
                {totalReports > 0 && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded mb-1">
                    <i className="fa-solid fa-arrow-trend-up mr-1"></i>
                    Live
                  </span>
                )}
            </div>
        </div>

        {/* Avg Risk Exposure */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative group z-10 hover:z-20 transition-all">
             <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <i className="fa-solid fa-triangle-exclamation text-6xl text-amber-600"></i>
            </div>
            <div className="flex items-center gap-2 relative">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg Risk Exposure</p>
                <div className="relative group/tooltip">
                    <i className="fa-solid fa-circle-info text-slate-300 hover:text-amber-500 cursor-help text-[10px] transition-colors"></i>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-slate-800 text-white text-[10px] p-2.5 rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all shadow-xl z-50 font-medium leading-relaxed pointer-events-none">
                        Composite risk score (0-100). Score &gt;60 indicates High Risk requiring immediate mitigation.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                </div>
            </div>
            <div className="flex items-end gap-3">
                <span className={`text-4xl font-black leading-none ${avgRiskScore >= 60 ? 'text-red-600' : avgRiskScore >= 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {avgRiskScore}
                </span>
                <span className="text-xs font-bold text-slate-400 mb-1">/ 100</span>
            </div>
        </div>

        {/* Detected IP Threats */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative group z-10 hover:z-20 transition-all">
             <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <i className="fa-solid fa-gavel text-6xl text-red-600"></i>
            </div>
            <div className="flex items-center gap-2 relative">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Detected IP Threats</p>
                <div className="relative group/tooltip">
                    <i className="fa-solid fa-circle-info text-slate-300 hover:text-red-500 cursor-help text-[10px] transition-colors"></i>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-slate-800 text-white text-[10px] p-2.5 rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all shadow-xl z-50 font-medium leading-relaxed pointer-events-none">
                        Total 'Blocking Patents' identified across all portfolios. Represents critical FTO conflicts.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                </div>
            </div>
            <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-red-600 leading-none">{totalIpThreats}</span>
                <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded mb-1">Blocking Patents</span>
            </div>
        </div>

         {/* Portfolio Maturity */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative group z-10 hover:z-20 transition-all">
             <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <i className="fa-solid fa-flask text-6xl text-blue-600"></i>
            </div>
            <div className="flex items-center gap-2 relative">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Portfolio Maturity</p>
                <div className="relative group/tooltip">
                    <i className="fa-solid fa-circle-info text-slate-300 hover:text-blue-500 cursor-help text-[10px] transition-colors"></i>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-slate-800 text-white text-[10px] p-2.5 rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all shadow-xl z-50 font-medium leading-relaxed pointer-events-none">
                        Average Technology Readiness Level (TRL 1-9). TRL 1-3: Research, TRL 4-6: Dev, TRL 7-9: Deploy.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                </div>
            </div>
            <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-blue-600 leading-none">{avgTrl}</span>
                <span className="text-xs font-bold text-slate-400 mb-1">Avg TRL Level</span>
            </div>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Risk Distribution Chart */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Risk Profile Distribution</h3>
                <i className="fa-solid fa-chart-pie text-slate-300"></i>
            </div>
            
            {totalReports > 0 ? (
                <div className="flex items-center gap-8">
                    <div className="relative w-40 h-40 shrink-0">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" className="rotate-[-90deg]">
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                            {riskSegments.map((seg, i) => (
                                <circle 
                                    key={i}
                                    cx="50" cy="50" r="40" 
                                    fill="transparent" 
                                    stroke={seg.color} 
                                    strokeWidth="12" 
                                    strokeDasharray={`${seg.dash} ${2 * Math.PI * 40}`}
                                    strokeDashoffset={seg.offset}
                                />
                            ))}
                            {/* Center Text */}
                            <foreignObject x="20" y="20" width="60" height="60" transform="rotate(90 50 50)">
                                <div className="w-full h-full flex flex-col items-center justify-center text-center">
                                    <span className="text-2xl font-black text-slate-800 leading-none">{totalReports}</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase">Live Docs</span>
                                </div>
                            </foreignObject>
                        </svg>
                    </div>
                    <div className="flex-1 space-y-3">
                        {riskSegments.map((seg, i) => (
                            <div key={i} className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{backgroundColor: seg.color}}></span>
                                    <span className="font-bold text-slate-700">{seg.label}</span>
                                </div>
                                <span className="font-mono text-slate-500 font-medium">{seg.value} ({Math.round(seg.value/totalRiskCount*100)}%)</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                    <i className="fa-solid fa-chart-simple text-2xl mb-2 opacity-50"></i>
                    <p className="text-xs font-medium">No active assessments.</p>
                </div>
            )}
         </div>

         {/* Sector Breakdown */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Sector Density</h3>
                <i className="fa-solid fa-layer-group text-slate-300"></i>
            </div>
            <div className="space-y-5">
                {topSectors.length > 0 ? topSectors.map(([sector, count], i) => (
                    <div key={i}>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="font-bold text-slate-700 capitalize">{sector.replace('_', ' ')}</span>
                            <span className="font-mono text-slate-500">{count} assessments</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-blue-600 rounded-full" 
                                style={{ width: `${(count / totalReports) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                        No active sector data available
                    </div>
                )}
            </div>
         </div>
      </div>

      {/* Recent Activity List */}
      <div className="space-y-4">
          <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Recent & Examples</h3>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-800">View All History</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {reports.slice(0, 3).map((report) => (
                   <AssessmentCard 
                      key={report.id} 
                      report={report} 
                      onClick={() => onSelectReport(report)}
                      compact={true}
                   />
               ))}
               {reports.length === 0 && (
                   <div className="col-span-3 py-12 text-center border-2 border-dashed border-slate-300 rounded-2xl">
                      <p className="text-slate-400">No recent activity. Start a new assessment to see data.</p>
                   </div>
               )}
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
