
import React, { useState } from 'react';
import { AssessmentReport } from '../types';
import AssessmentCard from './AssessmentCard';

interface AssessmentLibraryProps {
  reports: AssessmentReport[];
  onSelectReport: (report: AssessmentReport) => void;
  onDownloadReport: (report: AssessmentReport) => void;
  onDeleteReport: (reportId: string) => void;
  onNewAssessment: () => void;
}

const AssessmentLibrary: React.FC<AssessmentLibraryProps> = ({ 
  reports, 
  onSelectReport, 
  onDownloadReport,
  onDeleteReport,
  onNewAssessment 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'risk'>('newest');

  // Filter Logic
  const filteredReports = reports.filter(r => {
      const matchesSearch = r.innovation_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            r.cover.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = sectorFilter === 'all' || r.sector === sectorFilter;
      return matchesSearch && matchesSector;
  }).sort((a, b) => {
      if (sortOrder === 'risk') {
          return (b.executiveSummary?.riskProfile?.aggregateScore || 0) - (a.executiveSummary?.riskProfile?.aggregateScore || 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Extract unique sectors for dropdown
  const sectors = Array.from(new Set(reports.map(r => r.sector))) as string[];

  return (
    <div className="space-y-6 animate-fadeIn h-full flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200 shrink-0">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assessment Library</h1>
            <p className="text-slate-500 font-medium">Manage and review technical disclosures.</p>
         </div>
         <button 
           onClick={onNewAssessment}
           className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
         >
           <i className="fa-solid fa-plus"></i>
           New Assessment
         </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 shrink-0">
         <div className="flex-1 relative">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search innovation name, client..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
         </div>
         <div className="flex gap-4">
             <select 
               value={sectorFilter}
               onChange={(e) => setSectorFilter(e.target.value)}
               className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
             >
                <option value="all">All Sectors</option>
                {sectors.map(s => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
             </select>
             <select 
               value={sortOrder}
               onChange={(e) => setSortOrder(e.target.value as any)}
               className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
             >
                <option value="newest">Newest First</option>
                <option value="risk">Highest Risk</option>
             </select>
         </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto min-h-0 pb-12 custom-scrollbar pr-2">
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                    <AssessmentCard 
                        key={report.id} 
                        report={report} 
                        onClick={() => onSelectReport(report)}
                        onDownload={() => onDownloadReport(report)}
                        onDelete={() => onDeleteReport(report.id)}
                    />
                ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
                 <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <i className="fa-solid fa-filter-circle-xmark text-2xl"></i>
                 </div>
                 <h3 className="text-lg font-bold text-slate-600">No assessments found</h3>
                 <p className="text-slate-400 text-sm">Try adjusting your filters or search terms.</p>
             </div>
          )}
      </div>
    </div>
  );
};

export default AssessmentLibrary;
