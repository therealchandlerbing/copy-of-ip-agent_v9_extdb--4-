
import { AssessmentReport } from '../types';
import { REPORT_TEMPLATE } from './reportTemplate';

export const generateHtmlReport = (report: AssessmentReport): string => {
  let html = REPORT_TEMPLATE;

  // Helper to replace text safely with MarkDown processing
  const replace = (key: string, value: string | number | undefined, isMarkdown: boolean = false) => {
    let valStr = value !== undefined ? String(value) : '';

    if (isMarkdown) {
      // 1. Bold: **text** -> <strong>text</strong>
      valStr = valStr.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // 2. Blockquotes / Callouts: > text
      valStr = valStr.replace(/^> (.*$)/gm, '<blockquote style="border-left: 4px solid #3b82f6; background-color: #f8fafc; padding: 10px; margin: 10px 0; font-style: italic; color: #475569;">$1</blockquote>');

      // 3. Lists: * item -> <li>item</li>
      // Check if there are any list items
      if (valStr.includes('\n* ') || valStr.includes('\n- ') || valStr.startsWith('* ') || valStr.startsWith('- ')) {
        const lines = valStr.split('\n');
        let inList = false;
        let newList = [];

        for (let line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            if (!inList) {
              newList.push('<ul class="markdown-list">');
              inList = true;
            }
            newList.push(`<li>${trimmed.substring(2)}</li>`);
          } else {
            if (inList) {
              newList.push('</ul>');
              inList = false;
            }
            // Check for blockquotes already processed (they start with <blockquote)
            if (line.startsWith('<blockquote')) {
              newList.push(line);
            }
            // Wrap paragraph text if it's not empty/header and not already HTML tag
            else if (trimmed.length > 0 && !trimmed.startsWith('#') && !trimmed.startsWith('<')) {
              newList.push(`<p>${line}</p>`);
            } else {
              newList.push(line);
            }
          }
        }
        if (inList) newList.push('</ul>');
        valStr = newList.join('\n');
      } else {
        // Just paragraphs, but respect existing HTML tags like blockquotes
        valStr = valStr.split('\n\n').map(p => {
          if (p.trim().startsWith('<')) return p; // Don't wrap HTML
          return `<p>${p}</p>`;
        }).join('');
      }
    }

    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, valStr);
  };

  // --- 1. COVER PAGE ---
  replace('TECHNOLOGY_NAME', report.cover.technologyName);
  replace('TECHNOLOGY_SUBTITLE', report.cover.technologySubtitle);
  replace('CLIENT_NAME', report.cover.clientName);
  replace('INVENTOR_NAME', report.cover.inventorName);
  replace('REPORT_DATE', report.cover.reportDate);
  replace('REPORT_ID', report.cover.reportId);

  // --- SVG GENERATORS (New for High Fidelity Print) ---

  const generateRiskGauge = (score: number, color: string) => {
    // Simple SVG gauge
    const radius = 50;
    const stroke = 10;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return `
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle stroke="#e2e8f0" stroke-width="${stroke}" fill="transparent" r="${normalizedRadius}" cx="60" cy="60" />
        <circle stroke="${color}" stroke-width="${stroke}" stroke-dasharray="${circumference} ${circumference}" style="stroke-dashoffset: ${strokeDashoffset}; transform-origin: 60px 60px; transform: rotate(-90deg);" stroke-linecap="round" fill="transparent" r="${normalizedRadius}" cx="60" cy="60" />
        <text x="60" y="65" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="28" fill="#0f172a">${score}</text>
        <text x="60" y="80" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="8" fill="#64748b">INDEX</text>
      </svg>
    `;
  };

  const generateTechSchematic = () => {
    // Abstract "Node Graph" for visual flair
    return `
       <svg width="600" height="200" viewBox="0 0 600 200">
           <defs>
               <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                   <feGaussianBlur stdDeviation="3" result="blur" />
                   <feComposite in="SourceGraphic" in2="blur" operator="over" />
               </filter>
           </defs>
           <!-- Connections -->
           <path d="M100,100 L250,100" stroke="#334155" stroke-width="2" />
           <path d="M350,100 L500,100" stroke="#334155" stroke-width="2" />
           <path d="M300,50 L300,150" stroke="#334155" stroke-width="2" />
           
           <!-- Nodes -->
           <rect x="250" y="50" width="100" height="100" rx="10" fill="#1e293b" stroke="#3b82f6" stroke-width="2" filter="url(#glow)" />
           <circle cx="100" cy="100" r="30" fill="#0f172a" stroke="#10b981" stroke-width="2" />
           <circle cx="500" cy="100" r="30" fill="#0f172a" stroke="#fbbf24" stroke-width="2" />
           
           <!-- Labels -->
           <text x="300" y="105" text-anchor="middle" fill="#e2e8f0" font-family="monospace" font-size="12">CORE LOGIC</text>
           <text x="100" y="105" text-anchor="middle" fill="#e2e8f0" font-family="monospace" font-size="10">INPUT</text>
           <text x="500" y="105" text-anchor="middle" fill="#e2e8f0" font-family="monospace" font-size="10">OUTPUT</text>
       </svg>
     `;
  };

  // --- 2. EXECUTIVE SUMMARY ---
  const riskScore = report.executiveSummary.riskProfile.aggregateScore;
  let riskColor = '#10b981'; // green
  if (riskScore >= 60) riskColor = '#ef4444'; // red
  else if (riskScore >= 40) riskColor = '#f97316'; // orange/amber

  // Inject SVG
  replace('RISK_GAUGE_SVG', generateRiskGauge(riskScore, riskColor));

  // Inject Tech Schematic SVG
  replace('TECH_SCHEMATIC_SVG', generateTechSchematic());

  replace('RISK_COLOR', riskColor);
  replace('RISK_SCORE', riskScore);
  replace('RISK_LEVEL_TEXT', `${report.executiveSummary.riskProfile.riskLevel.toUpperCase()} RISK PROFILE`);
  replace('RISK_COUNTS_TEXT', `${report.executiveSummary.riskProfile.tier1Count} Critical Issues | ${report.executiveSummary.riskProfile.tier2Count} Major Issues`);
  replace('RISK_SUMMARY_TEXT', report.executiveSummary.riskProfile.summaryParagraph, true);

  // Formatting concerns - Numbered List for Critical Red Flags
  const concernsHtml = `<ol style="margin-left:20px; padding-left:0;">` + report.executiveSummary.criticalConcerns.map(c => `
    <li style="margin-bottom: 15px; padding-left: 10px;">
        <h4 style="margin-bottom: 2px; margin-top:0;">${c.title}</h4>
        <div style="font-size: 9pt; color: #475569; margin-bottom: 2px;"><strong style="color: #64748b;">What:</strong> ${c.what}</div>
        <div style="font-size: 9pt; color: #475569; margin-bottom: 2px;"><strong style="color: #64748b;">Why it matters:</strong> ${c.whyItMatters}</div>
        <div style="font-size: 9pt; color: #0f172a; margin-bottom: 2px;"><strong style="color: #64748b;">Resolution:</strong> ${c.resolution}</div>
    </li>
  `).join('') + `</ol>`;
  replace('CRITICAL_CONCERNS_BLOCK', concernsHtml);

  // Formatting Strengths - Bulleted List
  const strengthsHtml = `<ul style="margin-left:20px; padding-left:0;">` + report.executiveSummary.keyStrengths.map(s => `
    <li style="margin-bottom: 15px; padding-left: 10px;">
        <h4 style="margin-bottom: 2px; margin-top:0;">${s.title}</h4>
        <p style="margin-bottom: 2px; font-size:9pt;">${s.description}</p>
        <p style="font-size: 8.5pt; font-weight: 700; color: #059669; margin: 0;">Evidence: ${s.evidence}</p>
    </li>
  `).join('') + `</ul>`;
  replace('KEY_STRENGTHS_BLOCK', strengthsHtml);

  // Commercialization Path
  replace('SEED_REQ', report.executiveSummary.commercializationPath.estimatedDevelopmentCost);
  replace('RUNWAY', report.executiveSummary.commercializationPath.timeToMarket);
  replace('MILESTONE', report.executiveSummary.commercializationPath.keyMilestone);
  replace('CAPITAL_NARRATIVE', report.executiveSummary.commercializationPath.narrative);

  const confHtml = report.executiveSummary.dataConfidence.map(d => `
    <tr>
        <td>${d.area}</td>
        <td>Tier ${d.evidenceTier}</td>
        <td><span class="badge ${d.confidenceLevel === 'High' ? 'badge-green' : d.confidenceLevel === 'Medium' ? 'badge-amber' : 'badge-red'}">${d.confidenceLevel.toUpperCase()}</span></td>
        <td>${d.knownGaps}</td>
    </tr>
  `).join('');
  replace('DATA_CONFIDENCE_ROWS', confHtml);

  // --- 3. TECHNOLOGY FORENSICS ---
  replace('TECH_OVERVIEW', report.technologyForensics.overview.paragraph, true);

  const featuresHtml = report.technologyForensics.overview.coreFeatures.map(f => `
    <li style="margin-bottom:4px;">
        <span style="font-weight:700; color:var(--color-navy);">${f.name}:</span> ${f.description}
    </li>
  `).join('');
  replace('CORE_FEATURES', featuresHtml);
  replace('MECHANISM_EXPLANATION', report.technologyForensics.coreTechnology.explanation, true);

  const specsHtml = report.technologyForensics.coreTechnology.specifications.map(s => `
    <tr>
        <td>${s.parameter}</td>
        <td><strong>${s.value}</strong></td>
        <td>${s.benchmark}</td>
        <td><span style="font-style:italic;">${s.notes}</span></td>
    </tr>
  `).join('');
  replace('SPECS_ROWS', specsHtml);

  // Claims
  const claimsHtml = report.technologyForensics.claimsMatrix.map(c => `
    <tr>
        <td>
            <strong>${c.claimName}</strong>
            <div style="font-size:7.5pt; color:#64748b; margin-top:3px; font-style:italic;">"${c.inventorAssertion}"</div>
        </td>
        <td>Tier ${c.evidenceTier}</td>
        <td>${c.validationSource}</td>
        <td><span class="badge ${c.confidence === 'High' ? 'badge-green' : c.confidence === 'Low' ? 'badge-red' : 'badge-amber'}">${c.confidence.toUpperCase()}</span></td>
    </tr>
  `).join('');
  replace('CLAIMS_ROWS', claimsHtml);

  // Full Risk Matrix
  const fullRiskHtml = report.technologyForensics.technicalRisks.map(r => `
    <div style="margin-bottom: 20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <div style="font-weight:700; font-size:10pt; color:var(--color-navy);">${r.component}</div>
            <span class="badge ${r.riskLevel === 'high' ? 'badge-red' : 'badge-amber'}">${r.riskLevel.toUpperCase()} RISK</span>
        </div>
        <p style="margin-bottom:6px; font-size:9pt;"><strong>Failure Mode:</strong> ${r.description}</p>
        <div style="background:#f8fafc; padding:8px; border-left: 2px solid var(--color-navy);">
            <strong style="font-size: 7pt; text-transform: uppercase; color: #64748b;">Mitigation:</strong> ${r.mitigation}
        </div>
    </div>
  `).join('');
  replace('FULL_RISK_ROWS', fullRiskHtml);

  const validationRowsHtml = report.technologyForensics.validationGaps.gaps.map(g => `
    <tr>
        <td><strong>${g.name}</strong></td>
        <td>${g.requiredTesting}</td>
        <td>
            <strong>${g.estimatedCost}</strong>
            <div style="font-size:7.5pt; color:#64748b;">${g.timeline}</div>
        </td>
    </tr>
  `).join('');
  replace('VALIDATION_ROWS', validationRowsHtml);

  // TRL
  const trlHtml = report.technologyForensics.trlAssessment.subsystems.map(s => `
    <tr>
        <td>${s.name}</td>
        <td>TRL ${s.trl}</td>
        <td>${s.status}</td>
    </tr>
  `).join('');
  replace('TRL_ROWS', trlHtml);

  replace('OVERALL_TRL', report.technologyForensics.trlAssessment.overallTrl);
  replace('TRL_NARRATIVE', report.technologyForensics.trlAssessment.overallAssessment);

  // --- 4. IP DEEP DIVE ---
  replace('IP_METHODOLOGY', report.ipDeepDive.searchMethodology.intro);

  const searchHtml = report.ipDeepDive.searchMethodology.components.map(c => `
    <tr>
        <td>${c.component}</td>
        <td>${c.searchTerms}</td>
        <td>${c.databases}</td>
        <td>${c.resultsCount}</td>
    </tr>
  `).join('');
  replace('IP_SEARCH_ROWS', searchHtml);

  replace('IP_CLASSIFICATION_NARRATIVE', report.ipDeepDive.classificationAnalysis, true);

  const classHtml = report.ipDeepDive.classificationCodes.map(c => `
    <tr>
        <td style="font-weight:700; color:#1e40af;">${c.code}</td>
        <td>${c.description}</td>
        <td>${c.strategicImplication}</td>
    </tr>
  `).join('');
  replace('IP_CLASS_ROWS', classHtml);
  replace('WHITESPACE_TEXT', report.ipDeepDive.whitespace.description, true);

  const partnerships = report.ipDeepDive.whitespace.strategicPartnerships;
  if (partnerships) {
    replace('WHITESPACE_TARGETS', partnerships.licensingTargets);
    replace('WHITESPACE_MODEL', partnerships.partnershipModel);
    replace('WHITESPACE_RATIONALE', partnerships.rationale);
  } else {
    replace('WHITESPACE_TARGETS', 'N/A');
    replace('WHITESPACE_MODEL', 'N/A');
    replace('WHITESPACE_RATIONALE', 'No strategy defined.');
  }

  // Render Blocking Patents - Explicitly split into 2 per page for clarity
  const renderBlocking = (p: any) => `
    <div class="card" style="border-left: 4px solid #ef4444;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
             <div>
                <span style="font-weight:700; color:#1e40af; font-size:10pt;">${p.patentNumber}</span>
                <span style="color:#64748b; margin-left:10px; font-size:9pt;">${p.holder}</span>
             </div>
             <span class="badge badge-red">BLOCKING</span>
        </div>
        <div style="display:flex; gap:30px; margin-bottom:12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
            <div>
                <div style="font-size:6.5pt; color:#94a3b8; font-weight:700; text-transform:uppercase;">RELEVANCE</div>
                <div style="font-size:8.5pt; font-weight: 700;">${p.relevance}</div>
            </div>
             <div>
                <div style="font-size:6.5pt; color:#94a3b8; font-weight:700; text-transform:uppercase;">EXPIRATION</div>
                <div style="font-size:8.5pt; font-weight: 700;">${p.expiration}</div>
            </div>
        </div>
        <p style="font-size:9pt; margin-bottom:8px;"><strong>Claim Coverage:</strong> ${p.claimsCoverage}</p>
        <div style="background:#eff6ff; padding:10px; color:#1e40af; font-size:8.5pt; font-weight:500; border-radius: 4px;">
            Pivot Opportunity: ${p.differentiationOpportunity}
        </div>
    </div>
  `;

  const patents = report.ipDeepDive.blockingPatents;
  replace('BLOCKING_PATENTS_PAGE_1', patents.slice(0, 2).map(renderBlocking).join(''));
  replace('BLOCKING_PATENTS_PAGE_2', patents.slice(2).map(renderBlocking).join('') || '<div style="color:#64748b; font-style:italic; text-align: center; margin-top: 40px; font-size:9pt; border: 1px dashed #cbd5e1; padding: 20px;">No additional blocking patents identified for this section.</div>');

  const ftoHtml = report.ipDeepDive.ftoAssessment.components.map(c => `
    <tr>
        <td>${c.component}</td>
        <td><span class="badge ${c.riskLevel === 'high' ? 'badge-red' : c.riskLevel === 'low' ? 'badge-green' : 'badge-amber'}">${c.riskLevel.toUpperCase()}</span></td>
        <td>${c.mitigation}</td>
    </tr>
  `).join('');
  replace('FTO_ROWS', ftoHtml);

  replace('FILING_STRATEGY_DESC', report.ipDeepDive.filingStrategy.priorityClaims);
  const phasesHtml = report.ipDeepDive.filingStrategy.phases.map(p => `
    <div style="margin-bottom:15px; padding-left:15px; border-left:3px solid #2563eb;">
        <div style="color:#2563eb; font-weight:700; font-size:10pt; margin-bottom: 2px;">${p.name}</div>
        <div style="font-size:8.5pt; color:#64748b; margin-bottom:4px;">${p.timeline} • Cost: ${p.cost}</div>
        <div style="font-size:9pt;">${p.details}</div>
    </div>
  `).join('');
  replace('FILING_PHASES', phasesHtml);

  // --- 5. MARKET DYNAMICS ---

  // Market Sizing
  const sizing = report.marketDynamics.marketSizeAnalysis || {
    totalAddressableMarket: "N/A",
    serviceableAvailableMarket: "N/A",
    cagr: "N/A",
    forecastPeriod: "",
    keyDrivers: [],
    marketTrends: []
  };
  replace('TAM', sizing.totalAddressableMarket);
  replace('SAM', sizing.serviceableAvailableMarket);
  replace('CAGR', sizing.cagr);
  replace('FORECAST', sizing.forecastPeriod);

  const driversHtml = sizing.keyDrivers.map(d => `<li style="margin-bottom:4px;">${d}</li>`).join('');
  replace('DRIVERS_LIST', driversHtml || '<li>No drivers identified.</li>');

  const trendsHtml = sizing.marketTrends.map(t => `<li style="margin-bottom:4px;"><strong>${t.trend}:</strong> ${t.impact}</li>`).join('');
  replace('TRENDS_LIST', trendsHtml || '<li>No trends identified.</li>');

  // Graveyard
  const graveyard = report.marketDynamics?.graveyard || { intro: 'N/A', failedProducts: [] };
  replace('GRAVEYARD_INTRO', graveyard.intro, true);

  const graveyardHtml = (graveyard.failedProducts || []).map(f => `
    <div class="graveyard-item">
        <div style="font-weight:700; color:var(--color-accent); margin-bottom:4mm; font-size:10pt;">${f.name} <span style="font-weight:400; color:#64748b;">(${f.company})</span></div>
        <div style="font-size:9pt; line-height:1.5;">
            <div style="margin-bottom:2mm;"><strong style="color:var(--color-primary);">Timeline:</strong> ${f.timeline}</div>
            <div style="margin-bottom:2mm;"><strong style="color:var(--color-risk-high);">Failure Mode:</strong> ${f.failureMode}</div>
            <div style="margin-top:6px; font-style:italic; color:#475569; background:rgba(255,255,255,0.5); padding:8px; border-radius:4px;"><strong>Lesson:</strong> ${f.lesson}</div>
        </div>
    </div>
  `).join('');
  replace('GRAVEYARD_BLOCK', graveyardHtml);

  // Competitors - Render 4 per page max
  const renderCompetitor = (c: any) => `
    <div style="margin-bottom: 15px; border-top: 4px solid ${c.status === 'Active' ? '#2563eb' : '#94a3b8'}; background: white; padding: 12px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <div style="font-weight:700; font-size:10pt; color: var(--color-navy);">${c.name}</div>
            <span class="badge ${c.status === 'Active' ? 'badge-blue' : 'badge-slate'}" style="font-size:7pt;">${c.status.toUpperCase()}</span>
        </div>
        <div style="display:flex; gap:20px; margin-bottom:8px;">
             <div>
                <div style="font-size:6pt; color:#94a3b8; font-weight:700; text-transform:uppercase;">SEGMENT</div>
                <div style="font-size:8pt; font-weight: 600;">${c.segment}</div>
            </div>
             <div>
                <div style="font-size:6pt; color:#94a3b8; font-weight:700; text-transform:uppercase;">GEOGRAPHY</div>
                <div style="font-size:8pt; font-weight: 600;">${c.geography}</div>
            </div>
        </div>
        <p style="font-size:8.5pt; margin-bottom:6px;"><strong>Value Proposition:</strong> ${c.valueProposition}</p>
        <div style="background:#fef2f2; color:#b91c1c; padding:8px; font-size:8pt;">
            <strong>Vulnerability:</strong> ${c.vulnerability}
        </div>
    </div>
  `;

  const competitors = report.marketDynamics.competitiveLandscape;
  replace('COMPETITOR_DETAILED_PAGE_1', competitors.slice(0, 4).map(renderCompetitor).join(''));
  replace('COMPETITOR_DETAILED_PAGE_2', competitors.slice(4).map(renderCompetitor).join('') || '<div style="color:#64748b; font-style:italic; text-align: center; margin-top: 40px; font-size:9pt; border: 1px dashed #cbd5e1; padding: 20px;">No additional competitors detailed.</div>');

  const compRowHtml = report.marketDynamics.featureComparison.map(f => `
    <tr>
        <td><strong>${f.feature}</strong></td>
        <td>${f.us ? f.advantage : 'N/A'}</td>
        <td>${f.competitor ? 'Yes' : 'No'}</td>
        <td><span class="badge ${f.us ? 'badge-blue' : 'badge-slate'}">${f.us ? 'Superior' : 'Standard'}</span></td>
    </tr>
  `).join('');
  replace('COMPETITOR_ROWS', compRowHtml);

  replace('BEACHHEAD_PROFILE', report.marketDynamics.beachheadMarket.profile);
  replace('BEACHHEAD_PAIN', report.marketDynamics.beachheadMarket.painPoint);
  replace('BEACHHEAD_TOLERANCE', report.marketDynamics.beachheadMarket.toleranceReason);
  replace('BEACHHEAD_SIZE', report.marketDynamics.beachheadMarket.marketSize);

  const acqHtml = report.marketDynamics.customerAcquisition.map(a => `
    <tr>
        <td>${a.milestone}</td>
        <td>${a.strategy}</td>
        <td>${a.timeline}</td>
    </tr>
  `).join('');
  replace('ACQUISITION_ROWS', acqHtml);

  // --- 6. REGULATORY ---
  replace('DEVICE_CLASS', report.regulatoryPathway.classification.regulatoryClassification);
  replace('REG_PATHWAY', report.regulatoryPathway.classification.pathway);
  replace('REG_TIMELINE', report.regulatoryPathway.classification.timelineEstimate);
  replace('REG_NARRATIVE', report.regulatoryPathway.classification.intro, true);

  const precedentHtml = report.regulatoryPathway.comparableSystems.map(p => `
    <tr>
        <td><strong>${p.productName}</strong></td>
        <td>${p.referenceNumber}</td>
        <td>${p.relevance}</td>
    </tr>
  `).join('');
  replace('PRECEDENT_ROWS', precedentHtml);

  const regCostHtml = report.regulatoryPathway.timelineCost.map(t => `
    <tr>
        <td>${t.phase}</td>
        <td>${t.activities}</td>
        <td>${t.duration}</td>
        <td><strong>${t.cost}</strong></td>
    </tr>
  `).join('');
  replace('REG_COST_ROWS', regCostHtml);

  // --- 7. FINANCIAL ---
  const actionPlanHtml = report.financialRoadmap.actionPlan.map(a => `
    <tr>
        <td>
            <strong>${a.phase}</strong>
            <div style="font-size: 7.5pt; color: #64748b;">${a.months}</div>
        </td>
        <td>${a.budget}</td>
        <td>${a.activities}</td>
    </tr>
  `).join('');
  replace('ACTION_PLAN_ROWS', actionPlanHtml);

  const bomHtml = report.financialRoadmap.unitEconomics.bom.map(b => `
    <tr>
        <td>${b.component}</td>
        <td>${b.cost}</td>
        <td>${b.supplier}</td>
    </tr>
  `).join('');
  replace('BOM_ROWS', bomHtml || '<tr><td colspan="3">N/A</td></tr>');

  replace('TARGET_ASP', report.financialRoadmap.unitEconomics.targetAsp);
  replace('GROSS_MARGIN', report.financialRoadmap.unitEconomics.grossMargin);
  replace('COGS', report.financialRoadmap.unitEconomics.totalCogs);

  replace('SEED_AMOUNT', report.financialRoadmap.fundingRequirements.seed.amount);
  const seedUses = report.financialRoadmap.fundingRequirements.seed.useOfFunds.map(u => `<li style="margin-bottom: 4px;">${u}</li>`).join('');
  replace('SEED_USES', seedUses);

  replace('SERIES_A_AMOUNT', report.financialRoadmap.fundingRequirements.seriesA.amount);
  replace('SERIES_A_TRIGGER', report.financialRoadmap.fundingRequirements.seriesA.trigger);

  // --- 8. STRATEGY ---
  const priorityHtml = report.strategicRecommendations.priorityActions.map(a => `
    <tr>
        <td><strong>${a.action}</strong></td>
        <td>${a.owner}</td>
        <td>${a.timeline}</td>
        <td>${a.budget}</td>
    </tr>
  `).join('');
  replace('PRIORITY_ACTION_ROWS', priorityHtml);

  const partnerHtml = report.strategicRecommendations.partnerships.map(p => `
    <tr>
        <td>${p.type}</td>
        <td>${p.targets}</td>
        <td>${p.valueExchange}</td>
    </tr>
  `).join('');
  replace('PARTNER_ROWS', partnerHtml);

  const goHtml = report.strategicRecommendations.goNoGoFramework.goCriteria.map(c => `<li style="margin-bottom:6px;">${c}</li>`).join('');
  replace('GO_CRITERIA', goHtml);

  const nogoHtml = report.strategicRecommendations.goNoGoFramework.noGoCriteria.map(c => `<li style="margin-bottom:6px;">${c}</li>`).join('');
  replace('NOGO_CRITERIA', nogoHtml);

  // --- 9. DIRECTOR'S INSIGHTS ---
  const synthesis = report.strategicRecommendations.ttoSynthesis;
  if (synthesis) {
    replace('INSIGHTS_NARRATIVE', synthesis.insightNarrative, true);

    // Updated recommendation style for light background
    const recsHtml = synthesis.keyRecommendations.map(r => `
      <div class="card" style="border-top: 4px solid ${r.priority === 'Critical' ? '#ef4444' : r.priority === 'High' ? '#f59e0b' : '#3b82f6'}; background: #ffffff; color:#1e293b;">
          <div style="font-weight:700; color:#1e293b; font-size:10pt; margin-bottom:6px;">${r.title}</div>
          <span class="badge ${r.priority === 'Critical' ? 'badge-red' : r.priority === 'High' ? 'badge-amber' : 'badge-blue'}" style="margin-bottom:8px;">${r.priority} PRIORITY</span>
          <p style="font-size:8.5pt; line-height:1.5; color:#334155;">${r.description}</p>
      </div>
    `).join('');
    replace('INSIGHTS_RECS', recsHtml);
  } else {
    replace('INSIGHTS_NARRATIVE', 'Director synthesis unavailable.');
    replace('INSIGHTS_RECS', '<p>No mandates generated.</p>');
  }

  // --- 10. APPENDIX IMAGE ---
  if (report.productConcept) {
    const appendixHtml = `
      <div class="page page-section">
          <div class="section-watermark">09</div>
          <div class="section-content">
              <div class="section-num">09</div>
              <div class="section-name">Appendix</div>
              <div class="section-desc">Concept Visualization</div>
          </div>
      </div>
      <div class="page">
          <div class="header"><div class="header-left">Appendix</div><div class="header-right">Concept Art</div></div>
          <div class="content">
              <h2>Visual Concept</h2>
              <div class="card" style="padding:0; overflow:hidden;">
                  <img src="${report.productConcept.imageUrl}" style="width:100%; height:auto; display:block;" />
                  <div style="padding:15px; background:#f8fafc; border-top:1px solid #e2e8f0;">
                      <p style="font-size:9pt; margin:0; color:#64748b;"><strong>Generated Concept:</strong> ${report.productConcept.prompt}</p>
                  </div>
              </div>
          </div>
          <div class="footer"><span>Confidential Assessment</span><span>Page 40</span></div>
      </div>
      `;
    replace('PRODUCT_CONCEPT_IMAGE', appendixHtml);
  } else {
    replace('PRODUCT_CONCEPT_IMAGE', '');
  }

  return html;
};
