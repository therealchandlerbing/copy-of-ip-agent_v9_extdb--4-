
import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-slate-200 pt-8 pb-4 animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-xs text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} Innovation Compass Tool. Powered by Google Gemini.
           </p>
           <button 
             onClick={() => setIsOpen(true)}
             className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors group"
           >
             <i className="fa-solid fa-book-open text-blue-400 group-hover:text-blue-600"></i>
             Forensic Methodology & Architecture
           </button>
        </div>
      </footer>

      {/* Reference Guide Modal Module */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
           <div 
             className="bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fadeIn"
             onClick={e => e.stopPropagation()}
           >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white z-10 shrink-0">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-compass text-blue-600"></i>
                  Technical Reference: Innovation Compass Engine
                </h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center transition-colors"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="overflow-y-auto p-8 space-y-12 bg-slate-50/50">
                  
                  {/* Architecture Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">
                        Forensic Architecture
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4">
                        The Innovation Compass utilizes a <strong>Multi-Agent Reasoning System (MARS)</strong>. Unlike standard LLM chat interfaces, this system deploys seven distinct specialized agents that operate in parallel and adversarial loops.
                      </p>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        This architecture enforces <span className="font-semibold text-slate-700">Adversarial Review</span>: The 'Technologist' agent validates claims against physics, while the 'Patent Attorney' agent simultaneously checks those validated claims against prior art. Conflicting outputs are reconciled by the 'Director' synthesis node.
                      </p>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
                        <i className="fa-solid fa-network-wired text-blue-600"></i>
                        Reasoning Chain & Data Corpus
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase">1. Hallucination Suppression</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                We utilize <strong>Chain-of-Thought (CoT)</strong> verification. Every technical claim extracted from a disclosure is cross-referenced against a grounding corpus. If the model cannot identify a physical mechanism or peer-reviewed precedent for a claim, it is flagged as "Unvalidated" (Tier 0).
                            </p>
                        </div>
                         <div>
                            <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase">2. Patent Search Vectors</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                The IP Deep Dive agent generates semantic search vectors compatible with USPTO, EPO (Espacenet), and WIPO databases. It specifically targets CPC (Cooperative Patent Classification) intersections to identify "patent thickets" and whitespace density.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase">3. Regulatory Mapping</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Regulatory pathways are determined by mapping device characteristics to FDA Product Codes (21 CFR) and EU MDR classifications. Predicate devices are identified via 510(k) summary databases.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase">4. Data Privacy</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                All analysis is performed on ephemeral instances. Input data (PDFs/Text) is processed in-memory and is <strong>not persisted</strong> for model training. The system is architected for SOC 2 Type II compliance environments.
                            </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 7-Part Report Module */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <i className="fa-solid fa-layer-group"></i>
                       Assessment Modules (Standard Operating Procedure)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                step: "01",
                                title: "Risk Scoring (Deterministic)",
                                desc: "Proprietary algorithm weighting Technical Readiness (TRL) against IP Freedom-to-Operate. Scores >60 indicate high venture risk."
                            },
                            {
                                step: "02",
                                title: "Technology Forensics",
                                desc: "First-principles engineering audit. Identifies thermodynamic, mechanical, or chemical failure modes often glossed over in pitch decks."
                            },
                            {
                                step: "03",
                                title: "Freedom-to-Operate",
                                desc: "Identification of blocking assignees. We focus on claim overlap, not just keyword matching, to determine litigation risk."
                            },
                            {
                                step: "04",
                                title: "Market Reality",
                                desc: "SAM/SOM analysis grounded in bottom-up unit economics, not top-down analyst reports. Includes 'Graveyard' analysis of failed predecessors."
                            },
                            {
                                step: "05",
                                title: "Regulatory Pathway",
                                desc: "Timeline modeling for FDA/CE/ISO compliance. Identifies the critical path testing (e.g., Biocompatibility, EMC) that drives burn rate."
                            },
                            {
                                step: "06",
                                title: "Unit Economics",
                                desc: "Bill of Materials (BOM) estimation and Gross Margin analysis to validate commercial viability at scale."
                            },
                            {
                                step: "07",
                                title: "Strategic Synthesis",
                                desc: "The 'Director's Cut'. A synthesized Go/No-Go framework and prioritized execution plan for the first 90 days."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className={`p-5 rounded-xl border border-slate-200 bg-white group hover:border-blue-300 transition-colors ${idx === 6 ? 'lg:col-span-2' : ''}`}>
                                <div className="text-xs font-mono font-bold text-blue-200 group-hover:text-blue-600 mb-2 transition-colors">{item.step}</div>
                                <h4 className="font-bold text-slate-800 text-sm mb-2">{item.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                  </div>

                  {/* Legal Disclaimer */}
                  <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                      <div className="flex items-start gap-3">
                         <i className="fa-solid fa-scale-balanced text-amber-600 text-xl mt-0.5"></i>
                         <div>
                             <h3 className="text-sm font-bold text-amber-900 mb-2 uppercase">Legal Disclaimer & Indemnification</h3>
                             <p className="text-xs text-amber-800 leading-relaxed text-justify">
                                The Innovation Compass reports are generated via advanced AI reasoning chains but <strong>do not constitute legal advice, a formal legal opinion, or a Freedom-to-Operate clearance</strong>. All outputs, including patent landscape analysis and regulatory pathways, should be evaluated in coordination with a registered patent agent or qualified IP lawyer in the appropriate jurisdiction.
                             </p>
                             <p className="text-xs text-amber-800 leading-relaxed text-justify mt-2">
                                By using this tool, the user acknowledges the automated nature of the analysis and agrees to <strong>waive any claims against and indemnify Arcus Innovation Studios</strong> regarding investment decisions, legal filings, or strategic actions taken based on this data.
                             </p>
                         </div>
                      </div>
                  </div>
              </div>
              
              <div className="p-6 border-t border-slate-200 bg-white flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                      <i className="fa-solid fa-lock"></i>
                      <span>CONFIDENTIAL METHODOLOGY • DO NOT DISTRIBUTE</span>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors text-sm"
                  >
                    Close Reference
                  </button>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default Footer;
