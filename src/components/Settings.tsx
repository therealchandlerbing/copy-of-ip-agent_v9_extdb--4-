
import React, { useState, useEffect } from 'react';
import { checkGoogleApiKey, getApiKeySetupInstructions } from '../utils/envCheck';

const Settings: React.FC = () => {
  const [apiKeyStatus, setApiKeyStatus] = useState(() => checkGoogleApiKey());
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    reports: true,
    security: true
  });

  const [reportConfig, setReportConfig] = useState({
    citationFormat: 'APA',
    currency: 'USD',
    defaultModel: 'gemini-3-pro-preview',
    detailedLogs: true
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Configuration</h1>
          <p className="text-slate-500 font-medium">Manage global preferences, reporting standards, and system diagnostics.</p>
        </div>
        <div className="flex gap-3">
             <button className="px-4 py-2 text-slate-600 hover:text-slate-900 font-bold text-sm bg-white border border-slate-200 rounded-lg shadow-sm transition-all">
                Reset Defaults
             </button>
             <button className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                Save Changes
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Navigation/Status */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">System Health</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-700">API Configuration</span>
                        {apiKeyStatus.isConfigured ? (
                            <span className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Configured
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                                <i className="fa-solid fa-exclamation-triangle"></i>
                                Not Configured
                            </span>
                        )}
                    </div>
                    {apiKeyStatus.isConfigured && apiKeyStatus.apiKey && (
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-700">API Key</span>
                            <span className="text-xs font-mono text-slate-500">{apiKeyStatus.apiKey}</span>
                        </div>
                    )}
                    {!apiKeyStatus.isConfigured && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-2">
                                <i className="fa-solid fa-info-circle text-amber-600 mt-0.5"></i>
                                <div className="text-xs text-amber-900">
                                    <p className="font-bold mb-1">Setup Required</p>
                                    <p className="text-amber-800 mb-2">{apiKeyStatus.error}</p>
                                    <button
                                        onClick={() => alert(getApiKeySetupInstructions())}
                                        className="text-amber-700 hover:text-amber-900 font-bold underline"
                                    >
                                        View Setup Instructions
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-700">Model Latency</span>
                        <span className="text-xs font-mono text-slate-500">142ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-700">Token Usage</span>
                        <span className="text-xs font-mono text-slate-500">45,210 / 1M</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                         <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Active Model Version</div>
                         <div className="font-mono text-xs text-slate-600">gemini-3-pro-preview</div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <i className="fa-solid fa-shield-halved text-blue-400"></i>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Enterprise Security</h3>
                        <p className="text-[10px] text-slate-400">SOC 2 Compliance Active</p>
                    </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Data encryption is enabled at rest and in transit. No proprietary disclosure data is used for model training.
                </p>
                <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors border border-white/5">
                    View Security Audit Log
                </button>
            </div>
        </div>

        {/* Right Column: Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Report Configuration */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <i className="fa-solid fa-file-contract text-blue-600"></i>
                        Assessment Report Standards
                    </h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Citation Style</label>
                            <select 
                                value={reportConfig.citationFormat}
                                onChange={(e) => setReportConfig({...reportConfig, citationFormat: e.target.value})}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="APA">APA 7 (Standard)</option>
                                <option value="IEEE">IEEE (Technical)</option>
                                <option value="Chicago">Chicago Manual</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Financial Currency</label>
                            <select 
                                value={reportConfig.currency}
                                onChange={(e) => setReportConfig({...reportConfig, currency: e.target.value})}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                            <h4 className="font-bold text-slate-700 text-sm">Include Detailed Architect Logs</h4>
                            <p className="text-xs text-slate-500">Append raw chain-of-thought reasoning to the appendix (for internal audit only).</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={reportConfig.detailedLogs} onChange={(e) => setReportConfig({...reportConfig, detailedLogs: e.target.checked})} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <i className="fa-solid fa-bell text-amber-500"></i>
                        Alerts & Notifications
                    </h3>
                </div>
                <div className="p-6 space-y-4">
                     {[
                        { id: 'email', label: 'Email Summaries', desc: 'Receive weekly portfolio risk digests.' },
                        { id: 'reports', label: 'Assessment Completion', desc: 'Notify when a new forensic report is ready.' },
                        { id: 'security', label: 'Security Alerts', desc: 'Immediate alert for unrecognized logins or API spikes.' }
                     ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                             <div>
                                <h4 className="font-bold text-slate-700 text-sm">{item.label}</h4>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={(notifications as any)[item.id]} 
                                    onChange={(e) => setNotifications({...notifications, [item.id]: e.target.checked})} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>
                     ))}
                </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <i className="fa-solid fa-user-gear text-slate-500"></i>
                        Analyst Profile
                    </h3>
                </div>
                <div className="p-6 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-xl font-bold text-white shadow-lg border-2 border-white">
                        AA
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg">Senior Analyst</h4>
                        <p className="text-slate-500 text-sm">Technology Transfer Office (TTO)</p>
                        <button className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800">Edit Profile Details</button>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
