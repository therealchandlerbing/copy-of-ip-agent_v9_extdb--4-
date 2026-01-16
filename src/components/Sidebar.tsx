
import React from 'react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, isOpen = false }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'assessments', label: 'Assessments', icon: 'fa-folder-open' },
    { id: 'analyst', label: 'Arcus Assistant', icon: 'fa-robot' },
    { id: 'visualizer', label: 'Concept Lab', icon: 'fa-wand-magic-sparkles' },
    { id: 'settings', label: 'Settings', icon: 'fa-cog' },
  ];

  return (
    <div className={`w-64 bg-[#0f172a] h-screen text-slate-300 flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 shadow-2xl border-r border-slate-800/50 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Brand Header */}
      <div className="p-6 flex justify-between items-center shrink-0 border-b border-slate-800/50">
        <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 whitespace-nowrap">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
                <i className="fa-solid fa-compass text-white text-sm"></i>
              </span>
              Arcus<span className="text-blue-500">.ai</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2 ml-1">Innovation Forensics</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-blue-600/10 text-white shadow-inner' 
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              )}
              <i className={`fa-solid ${tab.icon} w-5 text-center transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}></i>
              <span className={`font-semibold text-sm ${isActive ? 'tracking-wide' : ''}`}>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800/50 shrink-0 bg-[#0b1120]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white shadow-lg border border-emerald-400/20">
            AA
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">Senior Analyst</p>
            <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              SYSTEM ONLINE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
