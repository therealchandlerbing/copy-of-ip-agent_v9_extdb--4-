
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AssessmentLibrary from './components/AssessmentLibrary';
import ReportWizard from './components/ReportWizard';
import AssistantChat from './components/AssistantChat';
import FullReportView from './components/FullReportView';
import Settings from './components/Settings';
import Visualizer from './components/Visualizer';
import Footer from './components/Footer';
import { AssessmentReport, AssessmentStatus, InputType } from './types';
import { generateHtmlReport } from './utils/reportGenerator';
import { MOCK_REPORTS } from './data/mockReports';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<AssessmentReport | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize with saved reports or defaults
  const [reports, setReports] = useState<AssessmentReport[]>(() => {
    try {
      const saved = localStorage.getItem('arcus_reports');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved reports:', e);
    }
    return MOCK_REPORTS;
  });

  // Persist reports to localStorage
  React.useEffect(() => {
    localStorage.setItem('arcus_reports', JSON.stringify(reports));
  }, [reports]);

  const handleReportComplete = (newReport: AssessmentReport) => {
    setReports(prev => [newReport, ...prev]);
    setIsWizardOpen(false);
    setSelectedReport(newReport);
  };

  const handleDownloadReport = (report: AssessmentReport) => {
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

  const handleDeleteReport = (id: string) => {
    if (window.confirm("Are you sure you want to delete this assessment? This action cannot be undone.")) {
      setReports(prev => prev.filter(r => r.id !== id));
      if (selectedReport?.id === id) setSelectedReport(null);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900">
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isOpen={isMobileMenuOpen}
      />

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col h-screen overflow-hidden md:ml-64 transition-all duration-300 relative">
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center shrink-0">
          <div className="font-bold text-slate-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white"><i className="fa-solid fa-compass"></i></span>
            Arcus.ai
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-500" aria-label="Open mobile menu">
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col min-h-0">
          <div className="flex-1 h-full">
            {selectedReport ? (
              <FullReportView
                report={selectedReport}
                onClose={() => setSelectedReport(null)}
                onAskAnalyst={() => {
                  setSelectedReport(null);
                  setCurrentTab('analyst');
                }}
              />
            ) : isWizardOpen ? (
              <ReportWizard
                onCancel={() => setIsWizardOpen(false)}
                onComplete={handleReportComplete}
              />
            ) : (
              <div className="max-w-7xl mx-auto flex flex-col h-full">
                {currentTab === 'dashboard' && (
                  <Dashboard
                    reports={reports}
                    onSelectReport={setSelectedReport}
                    onNewAssessment={() => setIsWizardOpen(true)}
                  />
                )}

                {currentTab === 'assessments' && (
                  <AssessmentLibrary
                    reports={reports}
                    onSelectReport={setSelectedReport}
                    onDownloadReport={handleDownloadReport}
                    onDeleteReport={handleDeleteReport}
                    onNewAssessment={() => setIsWizardOpen(true)}
                  />
                )}

                {currentTab === 'analyst' && (
                  <div className="h-full flex flex-col">
                    <div className="mb-4 shrink-0">
                      <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Analyst</h1>
                      <p className="text-slate-500 font-medium">Real-time market and patent intelligence.</p>
                    </div>
                    <div className="flex-1 min-h-0 pb-4">
                      <AssistantChat reports={reports} />
                    </div>
                  </div>
                )}

                {currentTab === 'visualizer' && (
                  <div className="h-full flex flex-col">
                    <div className="mb-4 shrink-0">
                      <h1 className="text-3xl font-black text-slate-900 tracking-tight">Concept Lab</h1>
                      <p className="text-slate-500 font-medium">Generate high-fidelity product visualizations.</p>
                    </div>
                    <Visualizer />
                  </div>
                )}

                {currentTab === 'settings' && (
                  <Settings />
                )}
              </div>
            )}
          </div>

          {/* Sticky Bottom Footer - Only shows if not in report view/wizard/analyst/visualizer */}
          {!selectedReport && !isWizardOpen && !['analyst', 'visualizer'].includes(currentTab) && (
            <div className="mt-auto pt-8">
              <Footer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
