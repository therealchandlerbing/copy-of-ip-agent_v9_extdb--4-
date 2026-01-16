
import { GoogleGenAI } from "@google/genai";
import { AssessmentReport, AssessmentStatus, InputType, ChatMessage } from "../types";



// --- SECTOR WEIGHTING RUBRIC (DETERMINISTIC) ---
const SECTOR_WEIGHTS: Record<string, { tech: number, ip: number, market: number, regulatory: number, financial: number }> = {
  "medical_devices": { tech: 0.20, ip: 0.30, market: 0.15, regulatory: 0.25, financial: 0.10 },
  "biotech_pharma": { tech: 0.30, ip: 0.30, market: 0.10, regulatory: 0.20, financial: 0.10 },
  "enterprise_software": { tech: 0.15, ip: 0.10, market: 0.40, regulatory: 0.05, financial: 0.30 },
  "ai_ml": { tech: 0.25, ip: 0.15, market: 0.30, regulatory: 0.10, financial: 0.20 },
  "consumer_hardware": { tech: 0.20, ip: 0.15, market: 0.35, regulatory: 0.10, financial: 0.20 },
  "clean_energy": { tech: 0.30, ip: 0.20, market: 0.15, regulatory: 0.15, financial: 0.20 },
  "advanced_materials": { tech: 0.35, ip: 0.25, market: 0.15, regulatory: 0.10, financial: 0.15 },
  "default": { tech: 0.20, ip: 0.20, market: 0.20, regulatory: 0.20, financial: 0.20 }
};

// --- DEFAULT FALLBACKS TO PREVENT UI CRASHES ---

const DEFAULT_IP_DEEP_DIVE = {
  searchMethodology: { intro: "Search data unavailable due to processing error.", components: [], gaps: "N/A" },
  classificationAnalysis: "Classification analysis unavailable.",
  classificationCodes: [],
  whitespace: {
    intro: "N/A",
    description: "Analysis unavailable.",
    evidence: "N/A",
    strategicPartnerships: { licensingTargets: "N/A", partnershipModel: "N/A", rationale: "N/A" }
  },
  blockingPatents: [],
  ftoAssessment: { components: [], overallAssessment: "Assessment unavailable." },
  filingStrategy: { phases: [], priorityClaims: "N/A", patentProtect: [], tradeSecrets: [] }
};

const DEFAULT_TECH_FORENSICS = {
  overview: { paragraph: "Technical forensics analysis unavailable due to processing error.", coreFeatures: [] },
  coreTechnology: { explanation: "Core technology analysis unavailable.", specifications: [] },
  claimsMatrix: [],
  technicalRisks: [],
  trlAssessment: { overallTrl: 0, overallAssessment: "TRL assessment unavailable.", subsystems: [] },
  validationGaps: { intro: "N/A", gaps: [] }
};

const DEFAULT_MARKET_DYNAMICS = {
  marketSizeAnalysis: {
    totalAddressableMarket: "N/A",
    serviceableAvailableMarket: "N/A",
    serviceableObtainableMarket: "N/A",
    cagr: "N/A",
    forecastPeriod: "N/A",
    keyDrivers: [],
    marketTrends: []
  },
  graveyard: { intro: "Graveyard analysis unavailable.", failedProducts: [] },
  zombieCompetitors: { intro: "Competitor analysis unavailable.", companies: [] },
  competitiveLandscape: [],
  featureComparison: [],
  gapAnalysis: { intro: "Gap analysis unavailable.", gaps: [], unmetDemandEvidence: "N/A" },
  beachheadMarket: { profile: "Analysis unavailable", painPoint: "N/A", toleranceReason: "N/A", marketSize: "N/A", expansionPath: "N/A" },
  customerAcquisition: [],
  monetization: { pricingAnalysis: [] }
};

const DEFAULT_REGULATORY = {
  classification: { intro: "Regulatory analysis unavailable.", regulatoryClassification: "Unknown", pathway: "Unknown", timelineEstimate: "N/A", standards: [] },
  comparableSystems: [],
  timelineCost: [],
  recentDevelopments: { intro: "N/A", developments: [] },
  risks: []
};

const DEFAULT_FINANCIAL = {
  actionPlan: [],
  budgetFramework: [],
  unitEconomics: { bom: [], totalCogs: "N/A", cogsVolume: "N/A", targetAsp: "N/A", grossMargin: "N/A", breakevenUnits: "N/A" },
  fundingRequirements: { seed: { amount: "N/A", useOfFunds: [], sources: "N/A" }, seriesA: { amount: "N/A", useOfFunds: [], trigger: "N/A" } },
  teamGaps: []
};

const DEFAULT_SYNTHESIS = {
  executiveSummary: {
    riskProfile: {
      aggregateScore: 0,
      riskLevel: "moderate" as "low" | "moderate" | "elevated" | "high",
      tier1Count: 0,
      tier2Count: 0,
      tier3Count: 0,
      summaryParagraph: "Executive summary unavailable due to processing error.",
      recommendation: "N/A",
      keyCondition: "N/A",
      investmentRequired: "N/A"
    },
    criticalConcerns: [],
    keyStrengths: [],
    commercializationPath: { estimatedDevelopmentCost: "N/A", timeToMarket: 0, keyMilestone: "N/A", narrative: "Analysis unavailable.", licensingPotential: "Low" as "High" | "Medium" | "Low" },
    dataConfidence: []
  },
  strategicRecommendations: {
    priorityActions: [],
    partnerships: [],
    alternativePathways: { intro: "N/A", alternatives: [] },
    goNoGoFramework: { checkpointTimeline: "N/A", goCriteria: [], noGoCriteria: [] },
    monitoringMetrics: [],
    riskIndicators: [],
    ttoSynthesis: {
      insightNarrative: "Director's synthesis unavailable due to processing error.",
      keyRecommendations: []
    }
  }
};

// --- HIGH-FIDELITY AGENT PROMPTS ---

const TECHNOLOGIST_PROMPT = `
ACT AS: Chief Engineer & Forensic Technical Auditor (Ex-DARPA / Ex-Apple / Ex-FDA).
TASK: Conduct a rigorous, physics-first technical due diligence. Output strict JSON matching the 'TechnologyForensics' schema.
PRIORITY: EXTREME DEPTH. We have a 50-page report to fill. Provide long, detailed explanations.

STYLE GUIDE:
- Use **Markdown bolding** for key terms, numbers, and engineering concepts within the text fields.
- Example: "The system utilizes a **Class 4 Laser** which exceeds the safety threshold of **500mW**."
- Be clinical, objective, and precise.
- **IMPORTANT**: Do NOT use LaTeX formatting (like \\sigma, \\mu, \\approx, \\frac). Use standard unicode symbols (σ, μ, ≈) if needed.
- Do NOT use backslashes for text formatting. If you must use a backslash (e.g. for units), you MUST double escape it (\\\\).

INSTRUCTIONS:
1. OVERVIEW (MINIMUM 500 WORDS): Deconstruct the system architecture in high detail.
   - Explain the "Why" and "How" of the physics/logic involved.
   - Analyze the "Energy Budget", "Compute Budget", or "Mass Budget".
   - Provide at least 4-6 core features, each with detailed descriptions (80+ words each).
2. CORE TECHNOLOGY (MINIMUM 350 WORDS): Explain the "Magic" mechanism in deep technical terms.
   - SPECIFICATIONS: Provide 5-8 specific parameter estimates based on physics/industry standards.
   - Each specification must include detailed notes (40+ words) explaining its significance.
   - BENCHMARK: You MUST compare against the absolute best competitor for each parameter.
3. CLAIMS MATRIX: Extract 5-7 inventor promises.
   - INTERROGATE each claim with detailed evidence analysis (80+ words per claim).
   - Cite specific sources (peer-reviewed papers, patents, test data) or explicitly flag as "Unvalidated - Inventor Assertion Only".
4. TECHNICAL RISKS (Physics of Failure):
   - Identify 5-7 failure modes spanning all risk levels.
   - Each description must be 70+ words explaining the specific failure mechanism.
   - Each mitigation must be 70+ words detailing the ENGINEERING solution.
5. TRL ASSESSMENT (MINIMUM 250 WORDS for overallAssessment): Be conservative.
   - Provide detailed justification based on NASA/DoD definitions.
   - Assess 4-6 critical subsystems with comprehensive analysis for each.
   - Each subsystem must have detailed status and evidence (70+ words).
6. VALIDATION GAPS (MINIMUM 180 WORDS for intro): What test is missing?
   - Identify 5-7 critical testing gaps with specific test standards.
   - Each gap description must be comprehensive (50+ words).

OUTPUT JSON FORMAT:
{
  "overview": { "paragraph": "string (Deep technical breakdown with **bolding**, 500+ words)", "coreFeatures": [{ "name": "string", "description": "string (80+ words each, provide 4-6 features)" }] },
  "coreTechnology": {
    "explanation": "string (Physics-based explanation, 350+ words, use **bolding**)",
    "specifications": [{ "parameter": "string", "value": "string (Estimated)", "benchmark": "string (SOTA Comparison)", "notes": "string (40+ words explaining significance, provide 5-8 specs)" }]
  },
  "claimsMatrix": [{
    "claimName": "string",
    "inventorAssertion": "string (50+ words)",
    "evidence": "string (80+ words with detailed analysis)",
    "validationSource": "string (MUST cite specific source: paper title, patent number, test report, or 'Unvalidated - Inventor Assertion Only')",
    "evidenceTier": number,
    "confidence": "High|Medium|Low|Unvalidated"
  }],
  "technicalRisks": [{ "component": "string", "riskLevel": "high|medium|low", "description": "string (70+ words explaining failure mechanism, provide 5-7 risks)", "mitigation": "string (70+ words detailing engineering solution)" }],
  "trlAssessment": {
    "overallTrl": number,
    "overallAssessment": "string (250+ words with detailed justification based on NASA/DoD definitions)",
    "subsystems": [{ "name": "string", "trl": number, "status": "string (70+ words)", "evidence": "string (70+ words)", "gapToTrl6": "string (50+ words, provide 4-6 critical subsystems)" }]
  },
  "validationGaps": {
    "intro": "string (180+ words explaining testing philosophy and gaps overview)",
    "gaps": [{ "name": "string", "requiredTesting": "string (Specific Test Standard e.g., ASTM/ISO with 50+ words detail)", "estimatedCost": "string", "timeline": "string", "priority": "high|medium|low" }]
  }
}
`;

const PATENT_ATTORNEY_PROMPT = `
ACT AS: Senior IP Litigation Partner (Top Tier Firm).
TASK: Conduct a "Freedom-to-Operate" (FTO) Stress Test. Output strict JSON matching the 'IpDeepDive' schema.
PRIORITY: SPECIFICITY & VOLUME. Provide extensive detail for a 50-page report.

STYLE GUIDE:
- Use **Markdown bolding** for patent numbers, assignees, and legal terms.
- Example: "Potential infringement of **US-9,123,456** assigned to **Medtronic**."
- Avoid backslashes.

INSTRUCTIONS:
1. SEARCH STRATEGY (MINIMUM 250 WORDS for intro): Define at least 4-5 specific CPC/IPC subclasses.
   - For each component, provide comprehensive search terms and detailed results analysis (70+ words each).
   - Gaps analysis must be thorough (120+ words explaining search limitations).
2. CLASSIFICATION ANALYSIS (MINIMUM 350 WORDS): Deep analysis of patent landscape density.
   - Analyze 4-6 classification codes with detailed strategic implications (70+ words each).
3. BLOCKING PATENTS (QUALITY GATE - CRITICAL):
   - Identify MINIMUM 3 blocking patents OR document comprehensive search showing legitimate whitespace.
   - **CRITICAL VALIDATION RULE**: ALL patent numbers MUST be real and verifiable. Format: US-XXXXXXX, EP-XXXXXXX, etc.
   - **ABSOLUTELY NO PROXY/PLACEHOLDER NUMBERS** like US-10,123,XXX or US-Patent-Pending.
   - If legitimate whitespace exists (< 3 blocking patents found), document: (a) search databases used, (b) date ranges searched, (c) why landscape is genuinely clear.
   - For every patent, provide detailed relevance analysis (90+ words).
   - Claims coverage must be comprehensive (90+ words per patent).
   - Differentiation opportunities must be detailed (90+ words per patent).
4. WHITESPACE (MINIMUM 400 WORDS for description): Detailed technical description of the open lane.
   - Intro must be 120+ words.
   - Evidence section must be 180+ words with specific search data.
   - Each strategic partnership element must be 80+ words.
5. FTO ASSESSMENT (MINIMUM 350 WORDS for overallAssessment): Legal opinion summary.
   - Analyze 5-7 key components with detailed risk analysis and mitigation (90+ words each).
6. FILING STRATEGY (MINIMUM 220 WORDS for priorityClaims): Propose a comprehensive "Picket Fence" strategy.
   - Define 4-5 filing phases with extensive details (80+ words each).
   - List 6-8 specific items to patent protect.
   - List 4-6 specific trade secrets.

OUTPUT JSON FORMAT:
{
  "searchMethodology": {
    "intro": "string (250+ words explaining search philosophy and approach)",
    "components": [{ "component": "string", "searchTerms": "string (comprehensive list)", "databases": "string", "dateRange": "string", "resultsCount": "string (with 70+ words analysis, provide 4-5 components)" }],
    "gaps": "string (120+ words on search limitations and areas of uncertainty)"
  },
  "classificationAnalysis": "string (350+ words deep analysis of patent landscape density, trends, and implications)",
  "classificationCodes": [{ "code": "string (CPC/IPC)", "description": "string (50+ words)", "strategicImplication": "string (70+ words, provide 4-6 codes)" }],
  "whitespace": {
    "intro": "string (120+ words on whitespace opportunity)",
    "description": "string (400+ words detailed technical description with **bolding**)",
    "evidence": "string (180+ words with specific search data and analysis)",
    "strategicPartnerships": {
        "licensingTargets": "string (80+ words on specific companies and why)",
        "partnershipModel": "string (80+ words on commercial structure)",
        "rationale": "string (80+ words on strategic value)"
    }
  },
  "blockingPatents": [{
    "patentNumber": "string (VALIDATION REQUIRED: Must be real patent number in format US-XXXXXXX, EP-XXXXXXX, etc. NO proxies/placeholders)",
    "holder": "string",
    "expiration": "string",
    "relevance": "string (90+ words detailed analysis)",
    "ftoRisk": "high|medium|low",
    "claimsCoverage": "string (90+ words on specific claim elements that overlap)",
    "differentiationOpportunity": "string (90+ words on how to engineer around it, provide minimum 3 OR document whitespace search)"
  }],
  "ftoAssessment": {
    "components": [{ "component": "string", "riskLevel": "high|medium|low|zero", "blockingPatents": "string (70+ words)", "mitigation": "string (90+ words with specific strategies, provide 5-7 components)" }],
    "overallAssessment": "string (350+ words legal opinion summary with specific recommendations)"
  },
  "filingStrategy": {
    "phases": [{ "name": "string", "timeline": "string", "focus": "string (50+ words)", "cost": "string", "details": "string (80+ words on specific claims and approach, provide 4-5 phases)" }],
    "priorityClaims": "string (220+ words on priority claim strategy and rationale)",
    "patentProtect": ["string (6-8 specific items with technical detail)"],
    "tradeSecrets": ["string (4-6 specific items with rationale)"]
  }
}
`;

const MARKET_STRATEGIST_PROMPT = `
ACT AS: Venture Capital Partner & Market Strategist.
TASK: Analyze Market Dynamics, Competition, and Unit Economics. Output strict JSON matching the 'MarketDynamics' schema.
PRIORITY: REAL NUMBERS & HARD DATA. Detailed explanations.

STYLE GUIDE:
- Use **Markdown bolding** for dollar amounts, percentages, and company names.
- Example: "The **$5.2B** market is dominated by **Stryker**, controlling **45%** share."

INSTRUCTIONS:
1. MARKET SIZING:
   - Provide specific dollar amounts ($B) with detailed methodology (180+ words).
   - List 4-5 specific "Key Drivers" (each 40+ words explaining impact).
   - Identify 4-5 "Market Trends" (each with 60+ words impact analysis).
2. THE GRAVEYARD (MINIMUM 200 WORDS for intro): Identify *specific* failed startups. Why did they die?
   - Provide 4 detailed examples minimum.
   - Each failure mode must be comprehensive (80+ words).
   - Each lesson must be actionable (60+ words).
3. ZOMBIE COMPETITORS (MINIMUM 150 WORDS for intro): Companies showing decline signs.
   - Identify 3-4 zombie companies.
   - Each warning sign analysis must be detailed (70+ words).
4. COMPETITORS:
   - Identify 4-6 key Incumbents and Challengers across all statuses.
   - Each competitor must have detailed value proposition (80+ words).
   - Each vulnerability must be comprehensive (80+ words).
5. FEATURE WAR ROOM:
   - List 6-8 Critical Features with detailed advantage analysis (50+ words each).
6. GAP ANALYSIS (MINIMUM 250 WORDS for intro, 200+ WORDS for unmetDemandEvidence):
   - Identify 5-7 specific market gaps with detailed explanations (each 70+ words).
   - **VALIDATION REQUIREMENT**: For each gap, cite evidence type: [Market Research | Customer Interviews | Survey Data | Hypothesis - Requires Validation]
7. BEACHHEAD MARKET (150+ WORDS for each field):
   - Define the *exact* first customer profile with demographics and psychographics.
   - Explain specific "Pain Point" with quantified impact where possible.
   - Detail tolerance reasoning with competitive analysis.
   - Provide expansion path with specific milestones.
   - **VALIDATION REQUIREMENT**: Flag evidence basis as [Validated | Hypothesis - Requires Customer Discovery]
8. CUSTOMER ACQUISITION: Define 5-6 acquisition milestones.
   - Each strategy must be detailed (80+ words).
9. MONETIZATION: Analyze 3-5 pricing tiers/models.
   - Each with comprehensive value proposition (80+ words).

OUTPUT JSON FORMAT:
{
  "marketSizeAnalysis": {
    "totalAddressableMarket": "string (with 180+ words methodology and data sources)",
    "serviceableAvailableMarket": "string (with detailed reasoning)",
    "serviceableObtainableMarket": "string (Year 1 Realistic Capture Target with strategy)",
    "cagr": "string (with supporting data)",
    "forecastPeriod": "string",
    "keyDrivers": ["string (4-5 drivers, each 40+ words explaining impact)"],
    "marketTrends": [{ "trend": "string", "impact": "string (60+ words detailed impact analysis, provide 4-5 trends)" }]
  },
  "graveyard": {
    "intro": "string (200+ words on failure patterns and lessons)",
    "failedProducts": [{ "name": "string", "company": "string", "timeline": "string", "failureMode": "string (80+ words on why they failed)", "lesson": "string (60+ words actionable lesson, provide 4 minimum examples)" }]
  },
  "zombieCompetitors": {
    "intro": "string (150+ words on decline indicators in the sector)",
    "companies": [{ "name": "string", "lastUpdate": "string", "warningSigns": "string (70+ words detailed analysis)", "implication": "string (70+ words, provide 3-4 companies)" }]
  },
  "competitiveLandscape": [{
    "name": "string", "segment": "string", "geography": "string", "valueProposition": "string (80+ words)", "vulnerability": "string (80+ words detailed weakness analysis)", "status": "Active|Zombie|Exited (provide 4-6 key competitors)"
  }],
  "featureComparison": [{
     "feature": "string",
     "us": boolean,
     "competitor": boolean,
     "advantage": "string (50+ words explaining competitive advantage, provide 6-8 features)"
  }],
  "gapAnalysis": {
    "intro": "string (250+ words on market analysis approach)",
    "gaps": ["string (5-7 gaps, each 70+ words with specific unmet needs. INCLUDE evidence type: Market Research | Customer Interviews | Survey Data | Hypothesis - Requires Validation)"],
    "unmetDemandEvidence": "string (200+ words with specific data, surveys, quotes, or flag as requiring validation)"
  },
  "beachheadMarket": {
    "profile": "string (150+ words with specific demographics. FLAG as: Validated | Hypothesis - Requires Customer Discovery)",
    "painPoint": "string (150+ words with quantified impact where possible)",
    "toleranceReason": "string (150+ words on why they'll pay premium)",
    "marketSize": "string (with detailed calculation)",
    "expansionPath": "string (150+ words with specific milestones and timeline)"
  },
  "customerAcquisition": [{ "milestone": "string", "strategy": "string (80+ words detailed strategy)", "channels": "string (specific channels with rationale)", "timeline": "string (provide 5-6 milestones)" }],
  "monetization": { "pricingAnalysis": [{ "category": "string", "priceRange": "string", "valueProposition": "string (80+ words justifying price point, provide 3-5 pricing tiers)" }] }
}
`;

const REGULATORY_CONSULTANT_PROMPT = `
ACT AS: Senior Regulatory Affairs Consultant.
TASK: Map the Compliance & Certification Pathway. Output strict JSON matching the 'RegulatoryPathway' schema.
PRIORITY: SPECIFIC STANDARDS & TIMELINES. COMPREHENSIVE ANALYSIS.

STYLE GUIDE:
- Use **Markdown bolding** for Standards (ISO, ASTM) and Regulation Codes (21 CFR).

INSTRUCTIONS:
1. CLASSIFICATION (MINIMUM 250 WORDS for intro): Be precise (FDA Codes, ISO Standards).
   - Provide detailed regulatory classification with rationale (120+ words).
   - Explain pathway selection with precedents (120+ words).
   - List 5-8 applicable standards with detailed explanations of each.
2. PREDICATES: Identify 4-6 existing certified products.
   - Each must have comprehensive relevance analysis (80+ words).
   - Include detailed review timeline breakdown.
3. TIMELINE & COST: Be realistic and comprehensive.
   - Define 5-8 regulatory phases from concept to approval.
   - Each phase must have detailed activities breakdown (80+ words).
   - Include cost ranges with justification.
4. RECENT DEVELOPMENTS (MINIMUM 180 WORDS for intro): Regulatory landscape analysis.
   - Identify 4-6 recent regulatory changes or guidances.
   - Each impact analysis must be detailed (70+ words).
5. RISKS: What tests are most likely to fail?
   - Identify 5-6 regulatory risks across all phases.
   - Each description must be comprehensive (80+ words).
   - Each mitigation must be actionable and detailed (80+ words).

OUTPUT JSON FORMAT:
{
  "classification": {
    "intro": "string (250+ words explaining regulatory landscape for this technology)",
    "regulatoryClassification": "string (120+ words with specific codes and rationale)",
    "pathway": "string (120+ words explaining pathway selection with precedents)",
    "timelineEstimate": "string (with detailed breakdown and assumptions)",
    "standards": ["string (5-8 standards with detailed explanation of each requirement)"]
  },
  "comparableSystems": [{
    "productName": "string",
    "referenceNumber": "string",
    "approvalDate": "string",
    "relevance": "string (80+ words detailed comparison to our technology)",
    "reviewTime": "string (with phase breakdown, provide 4-6 comparable systems)"
  }],
  "timelineCost": [{
    "phase": "string",
    "activities": "string (80+ words detailed breakdown of activities and deliverables)",
    "duration": "string (with range and assumptions)",
    "cost": "string (with itemized estimate, provide 5-8 phases)"
  }],
  "recentDevelopments": {
    "intro": "string (180+ words on evolving regulatory landscape)",
    "developments": [{
      "title": "string",
      "date": "string",
      "impact": "string (70+ words on how this affects approval pathway, provide 4-6 developments)"
    }]
  },
  "risks": [{
    "title": "string",
    "description": "string (80+ words on specific regulatory failure mode)",
    "mitigation": "string (80+ words with actionable strategies, provide 5-6 risks)"
  }]
}
`;

const COMMERCIAL_LEAD_PROMPT = `
ACT AS: CFO & Manufacturing Operations Lead.
TASK: Build the Financial Roadmap & Unit Economics. Output strict JSON matching the 'FinancialRoadmap' schema.
PRIORITY: DETAILED BOM & FUNDING STRATEGY. COMPREHENSIVE FINANCIAL MODELING.

STYLE GUIDE:
- Use **Markdown bolding** for financial figures.

INSTRUCTIONS:
1. ACTION PLAN: Create comprehensive development roadmap.
   - Define 6-10 time-based phases from concept to commercialization.
   - Each phase must have detailed activities (80+ words).
   - Each milestone must have clear success criteria (60+ words).
2. BUDGET FRAMEWORK: Break down all cost categories.
   - Provide 6-8 budget categories with detailed allocation rationale.
   - Each category must explain activities in detail (80+ words).
3. UNIT ECONOMICS (The BOM):
   - Break down the COGS into 6-10 detailed line items (complexity varies by product).
   - Each component must have comprehensive notes (70+ words) on sourcing, risks, and scaling.
   - Include detailed breakeven analysis (180+ words) with sensitivity analysis.
   - Provide volume-based COGS projections at 3-4 different production scales.
4. FUNDING (COMPREHENSIVE ANALYSIS):
   - Seed Round: Detailed requirements (180+ words on what we need to prove).
   - List 6-8 specific use of funds items with detailed justification.
   - Series A: Detailed milestone analysis (180+ words).
   - List 6-8 specific use of funds items with ROI projections.
   - Include sources with detailed investor targeting strategy.
5. TEAM GAPS: Comprehensive hiring roadmap.
   - Identify 6-8 critical roles with detailed job descriptions.
   - Each must have comprehensive budget impact analysis (70+ words).

OUTPUT JSON FORMAT:
{
  "actionPlan": [{
    "months": "string",
    "phase": "string",
    "activities": "string (80+ words with specific deliverables and tasks)",
    "budget": "string (with itemized breakdown)",
    "milestone": "string (60+ words with clear success criteria, provide 6-10 phases)"
  }],
  "budgetFramework": [{
    "category": "string",
    "allocation": "string (with justification)",
    "activities": "string (80+ words on what this funds and why, provide 6-8 categories)"
  }],
  "unitEconomics": {
    "bom": [{
      "component": "string",
      "cost": "string (with volume assumptions)",
      "supplier": "string (with alternatives)",
      "notes": "string (70+ words on sourcing strategy, risks, and scaling considerations, provide 6-10 components based on product complexity)"
    }],
    "totalCogs": "string (with detailed calculation breakdown)",
    "cogsVolume": "string (provide 3-4 volume tiers with corresponding COGS)",
    "targetAsp": "string (with pricing strategy rationale, 130+ words)",
    "grossMargin": "string (with sensitivity analysis and assumptions)",
    "breakevenUnits": "string (180+ words with detailed breakeven analysis, time to breakeven, and sensitivity to key assumptions)"
  },
  "fundingRequirements": {
    "seed": {
      "amount": "string (with range and justification)",
      "useOfFunds": ["string (6-8 detailed line items with specific amounts and ROI projections)"],
      "sources": "string (180+ words on investor targeting strategy, types of investors, and approach)"
    },
    "seriesA": {
      "amount": "string (with range and justification)",
      "useOfFunds": ["string (6-8 detailed line items with specific amounts and growth projections)"],
      "trigger": "string (180+ words on specific milestones that unlock Series A, with metrics and timing)"
    }
  },
  "teamGaps": [{
    "role": "string (with detailed job description)",
    "priority": "high|medium|low",
    "timing": "string (with hiring rationale)",
    "budgetImpact": "string (70+ words on fully-loaded cost, ROI, and alternatives, provide 6-8 critical roles)"
  }]
}
`;

const SYNTHESIS_PROMPT = `
ACT AS: Senior Director of Technology Transfer & Commercialization SME.
TASK: Synthesize the final Executive Summary and provide DETERMINISTIC SCORING. Output strict JSON.
PRIORITY: PROFESSIONAL REALISM & STRATEGIC CLARITY. WRITE EXTENSIVELY FOR 50-PAGE REPORT.

SCORING RULES (STRICT RUBRIC):
You must output "rawScores" (0-100) for each dimension based on data.

STYLE GUIDE:
- Use **Markdown bolding** to emphasize risks, key opportunities, and critical figures.
- Use bullet points (- ) for lists within text fields.
- Tone: Clinical, precise, advisory. "Investor-Grade".

INSTRUCTIONS:
1. RISK PROFILE (MAXIMUM 500 WORDS): Synthesize all constraints. Professional, scannable.
   - Integrate findings from all 5 dimensions (technical, IP, market, regulatory, financial).
   - Discuss cross-functional risks and interdependencies.
   - Provide specific, actionable insights with quantified impacts.
   - **QUALITY OVER LENGTH**: Executive Summary must be scannable.
2. CRITICAL CONCERNS: Identify TOP 4-6 major hurdles (not more - prioritize ruthlessly).
   - Each "what" field must be detailed (80+ words).
   - Each "whyItMatters" must quantify impact (80+ words).
   - Each "resolution" must be actionable and comprehensive (120+ words).
3. KEY STRENGTHS: Identify TOP 2-4 competitive advantages (forces prioritization).
   - Each description must be detailed (80+ words).
   - Each evidence section must cite specific data (80+ words).
4. COMMERCIALIZATION PATH (MINIMUM 350 WORDS for narrative):
   - Provide comprehensive go-to-market strategy.
   - Detail specific milestones with timeline and success criteria.
5. DATA CONFIDENCE: Assess 5-7 key areas.
   - Each known gaps analysis must be detailed (80+ words).
6. PRIORITY ACTIONS: Define MAXIMUM 5-7 critical next steps (framework limit).
   - Each action must be detailed with specific deliverables (80+ words).
   - Too many priorities = no priorities. Focus on what matters most.
7. PARTNERSHIPS: Identify 4-6 strategic partnership opportunities.
   - Each targets section must name specific companies (80+ words).
   - Each approach must be tactical and detailed (80+ words).
8. ALTERNATIVE PATHWAYS (MINIMUM 250 WORDS for intro): Explore strategic options.
   - Provide 3-5 alternative paths with comprehensive analysis.
   - Each description must be detailed (120+ words).
   - Each tradeoffs analysis must be thorough (120+ words).
9. GO/NO-GO FRAMEWORK: Create comprehensive decision framework.
   - Provide 5-8 go criteria with specific metrics.
   - Provide 4-6 no-go criteria with thresholds (red lines only).
10. MONITORING METRICS: Define 8-10 key performance indicators.
    - Each significance analysis must be detailed (70+ words).
11. RISK INDICATORS: List 8-10 specific red flags to watch (must be monitorable).
12. TTO DIRECTOR'S INSIGHTS (The Memo):
    - Standalone Memorandum (500-700 WORDS - sharp, not exhaustive).
    - Focus: Asset transferability, licensing viability, strategic positioning.
    - Provide 4-6 "Strategic Mandates" with detailed justification.

OUTPUT JSON FORMAT:
{
  "executiveSummary": {
    "rawScores": { "technical": number, "ip": number, "market": number, "regulatory": number, "financial": number },
    "riskProfile": {
      "tier1Count": number,
      "tier2Count": number,
      "tier3Count": number,
      "summaryParagraph": "string (MAXIMUM 500 words for scannability. Use **bolding**. Comprehensive synthesis integrating all dimensions with specific quantified impacts and cross-functional risk analysis.)",
      "recommendation": "string (Short, punchy verdict e.g. 'CONDITIONAL PROCEED')",
      "keyCondition": "string (Detailed description of the single most important condition, 80+ words)",
      "investmentRequired": "string (Detailed breakdown of total capital required with phasing and use of funds)"
    },
    "criticalConcerns": [{
      "title": "string",
      "what": "string (80+ words detailed description)",
      "whyItMatters": "string (80+ words quantifying business impact)",
      "resolution": "string (120+ words with actionable steps and timeline)",
      "tier": 1|2 (provide TOP 4-6 only - prioritize ruthlessly)"
    }],
    "keyStrengths": [{
      "title": "string",
      "description": "string (80+ words explaining the competitive advantage)",
      "evidence": "string (80+ words citing specific data, comparisons, and validation, provide TOP 2-4 only - forces prioritization)"
    }],
    "commercializationPath": {
      "estimatedDevelopmentCost": "string (with detailed breakdown by phase)",
      "timeToMarket": number,
      "keyMilestone": "string (comprehensive milestone with timeline)",
      "narrative": "string (MINIMUM 350 words comprehensive go-to-market strategy with specific tactical steps)",
      "licensingPotential": "High|Medium|Low"
    },
    "dataConfidence": [{
      "area": "string",
      "evidenceTier": number,
      "confidenceLevel": "High|Medium|Low",
      "knownGaps": "string (80+ words on what data is missing and how to obtain it, provide 5-7 areas)"
    }]
  },
  "strategicRecommendations": {
    "priorityActions": [{
      "action": "string (80+ words with specific deliverables and success criteria)",
      "owner": "string (role description)",
      "timeline": "string (detailed with milestones)",
      "budget": "string (itemized estimate, MAXIMUM 5-7 actions - framework limit. Too many priorities = no priorities)"
    }],
    "partnerships": [{
      "type": "string (partnership model)",
      "targets": "string (80+ words naming 3-5 specific companies with rationale)",
      "valueExchange": "string (70+ words on what each party contributes)",
      "approach": "string (80+ words tactical outreach strategy, provide 4-6 partnership types)"
    }],
    "alternativePathways": {
      "intro": "string (250+ words on strategic options philosophy)",
      "alternatives": [{
        "name": "string",
        "description": "string (120+ words comprehensive description with specific steps)",
        "tradeoffs": "string (120+ words detailed pros/cons analysis, provide 3-5 alternatives)"
      }]
    },
    "goNoGoFramework": {
      "checkpointTimeline": "string (detailed timeline with specific decision points)",
      "goCriteria": ["string (5-8 specific criteria with metrics and thresholds)"],
      "noGoCriteria": ["string (4-6 specific red lines with clear thresholds)"]
    },
    "monitoringMetrics": [{
      "category": "string",
      "metric": "string (specific KPI with measurement method)",
      "significance": "string (70+ words on why this matters and how to interpret, provide 8-10 metrics)"
    }],
    "riskIndicators": ["string (8-10 specific, monitorable early warning signals)"],
    "ttoSynthesis": {
       "insightNarrative": "string (The 'Director's Memo' - blunt, strategic advice. 500-700 WORDS (sharp, not exhaustive). Use highly professional, authoritative tone. Cover asset transferability, licensing strategy, strategic positioning, market timing, and partnership approach with specific recommendations.)",
       "keyRecommendations": [{
         "title": "string",
         "description": "string (120+ words with specific action steps and rationale)",
         "priority": "Critical|High|Medium (provide 4-6 strategic mandates)"
       }]
    }
  }
}
`;

const EXTRACTION_PROMPT = `
You are analyzing innovation disclosure documents. Combine the context from all provided documents to extract key details.

**CRITICAL INSTRUCTION**: You must make every effort to identify the specific names involved.
1. **Innovation Name**: Look for the product name, project title, or system name (e.g., "Hypen", "Arcus", "Project X"). Do NOT use "Untitled Innovation" unless the document is literally blank.
2. **Client Name**: Look for the company name, university, or entity submitting the disclosure (e.g., "ERVIEGAS", "Stanford University").
3. **Inventor Name**: Look for the lead researcher or inventor.

If specific names are absolutely missing after a thorough search, only then use "Confidential Client" or "Undisclosed Inventor".

Output JSON:
{
  "q1_innovation_name": "string (The specific name found. Do not use generic placeholders.)",
  "q2_problem_statement": "string",
  "q3_solution_description": "string",
  "q4_sector": "string (Infer best fit: Medical Devices, Software, Energy, Consumer, Materials, Biotech, etc.)",
  "q5_development_stage": "string",
  "q12_geographic_focus": ["string"],
  "inventor_name": "string",
  "client_name": "string",
  "report_date": "string (YYYY-MM-DD)"
}
`;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class GeminiService {
  private ai?: GoogleGenAI;

  constructor() {
    // AI client will be lazily initialized on first use
  }

  private getAIClient(): GoogleGenAI {
    if (this.ai) {
      return this.ai;
    }

    // Access API key from Vite environment variables
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    if (!apiKey) {
      throw new Error(
        'Google API key not found. Please set VITE_GOOGLE_API_KEY in your .env file.\n' +
        'Create a .env file in the project root with:\n' +
        'VITE_GOOGLE_API_KEY=your_api_key_here'
      );
    }

    const client = new GoogleGenAI({ apiKey });
    this.ai = client;
    return client;
  }

  // Helper to clean JSON string with robust escape handling
  private cleanJsonString(text: string): string {
    if (!text) return "{}";

    // 1. Remove markdown wrapping
    let clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    // 2. Extract JSON object/array
    const firstOpen = clean.indexOf('{');
    const firstArray = clean.indexOf('[');

    let startIndex = -1;
    if (firstOpen !== -1 && (firstArray === -1 || firstOpen < firstArray)) startIndex = firstOpen;
    else if (firstArray !== -1) startIndex = firstArray;

    if (startIndex === -1) return "{}";

    const lastCloseBrace = clean.lastIndexOf('}');
    const lastCloseArray = clean.lastIndexOf(']');
    let endIndex = -1;

    if (lastCloseBrace !== -1 && (lastCloseArray === -1 || lastCloseBrace > lastCloseArray)) endIndex = lastCloseBrace;
    else if (lastCloseArray !== -1) endIndex = lastCloseArray;

    if (endIndex !== -1) clean = clean.substring(startIndex, endIndex + 1);
    else return "{}";

    clean = clean.trim();

    // 3. Remove control characters (0x00-0x1F) except standard whitespace to prevent parse errors
    clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

    // 4. Fix single quotes (invalid in JSON)
    clean = clean.replace(/\\'/g, "'");

    // 5. Robust Backslash Escaping
    // We want to turn invalid escapes (like \s, \c, \m) into \\s, \\c, \\m
    // while preserving valid escapes: " \ / b f n r t u
    // Regex: Match \ NOT followed by (valid escape chars or unicode sequence)
    clean = clean.replace(/\\(?!(["\\/bfnrt]|u[0-9a-fA-F]{4}))/g, '\\\\');

    return clean;
  }

  private isRetryableError(e: any): boolean {
    try {
      const str = JSON.stringify(e);
      return (
        str.includes('429') ||
        str.includes('RESOURCE_EXHAUSTED') ||
        str.includes('Quota exceeded') ||
        str.includes('503') ||
        str.includes('500')
      );
    } catch {
      return false;
    }
  }

  private async executeDirective(
    promptName: string,
    promptText: string,
    context: any,
    defaultValue: any,
    useSearch: boolean = false,
    thinkingBudget: number = 0
  ): Promise<any> {
    const contextStr = JSON.stringify(context, null, 2);
    let delay = 5000;
    const maxRetries = 3;

    for (let i = 0; i <= maxRetries; i++) {
      let responseText = "{}";
      try {
        const config: any = {
          tools: useSearch ? [{ googleSearch: {} }] : [],
          responseMimeType: "application/json",
          systemInstruction: "You are the Arcus Innovation Compass, a forensic technology and IP auditing engine. You provide 'Investor-Grade' due diligence. Use Markdown formatting (bolding, lists) within JSON string values to enhance readability. Be objective, rigorous, and data-driven. IMPORTANT: Return valid JSON only. Escape all internal double quotes and backslashes properly. Do NOT use LaTeX or unsupported escape sequences.",
        };

        if (thinkingBudget > 0) {
          config.thinkingConfig = { thinkingBudget };
        }

        const response = await this.getAIClient().models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: `CONTEXT:\n${contextStr}\n\nTASK:\n${promptText}\n\nIMPORTANT: Return valid JSON only. Do not use Markdown block syntax if possible. Escape all special characters in strings (especially backslashes). Ensure deep, investor-grade analysis with high specificity and real data where possible.`,
          config: config
        });

        responseText = response.text || "{}";
        const text = this.cleanJsonString(responseText);
        return JSON.parse(text);
      } catch (e: any) {
        const isRetryable = this.isRetryableError(e);
        const isLastAttempt = i === maxRetries;

        if (isRetryable && !isLastAttempt) {
          console.warn(`[Arcus Engine] Rate limit/Error hit for ${promptName}. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }

        // Fallback: Aggressive backslash sanitization if syntax error persists
        if (e instanceof SyntaxError) {
          console.warn(`[Arcus Engine] JSON Syntax Error in ${promptName}. Attempting aggressive repair.`);
          try {
            // Aggressive repair: Replace problematic backslashes that aren't common escapes with forward slashes
            // to salvage the structure.
            // We preserve \", \/, \b, \f, \n, \r, \t, \uXXXX
            const aggressive = this.cleanJsonString(responseText)
              .replace(/\\(?!(["\\/bfnrt]|u[0-9a-fA-F]{4}))/g, "/");
            return JSON.parse(aggressive);
          } catch (e2) {
            console.error(`[Arcus Engine] Aggressive repair failed for ${promptName}.`, e2);
          }
        }

        console.error(`Directive ${promptName} failed:`, e);
        return defaultValue;
      }
    }
    return defaultValue;
  }

  private async extractContext(files: { mimeType: string, data: string }[]): Promise<any> {
    let delay = 5000;
    const maxRetries = 3;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        const parts: any[] = files.map(file => ({
          inlineData: { mimeType: file.mimeType, data: file.data }
        }));
        parts.push({ text: EXTRACTION_PROMPT });

        const response = await this.getAIClient().models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: { parts: parts },
          config: { responseMimeType: "application/json" }
        });
        const text = this.cleanJsonString(response.text || "{}");
        return JSON.parse(text);
      } catch (e: any) {
        const isRetryable = this.isRetryableError(e);
        const isLastAttempt = i === maxRetries;

        if (isRetryable && !isLastAttempt) {
          console.warn(`[Arcus Engine] Rate limit hit for Context Extraction. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }

        console.error("Context extraction failed:", e);
        return {
          "q1_innovation_name": "Document Analysis Failed",
          "q2_problem_statement": "Analysis incomplete.",
          "q4_sector": "Unknown",
          "q5_development_stage": "Unknown",
          "error": true
        };
      }
    }
    return {};
  }

  async generateAssessmentFromQuestionnaire(responses: any): Promise<AssessmentReport> {
    return this.runAssessmentPipeline(responses, InputType.QUESTIONNAIRE);
  }

  async generateAssessmentFromDocuments(files: { mimeType: string, data: string }[]): Promise<AssessmentReport> {
    const extractedResponses = await this.extractContext(files);
    return this.runAssessmentPipeline(extractedResponses, InputType.DOCUMENT);
  }

  async generateAssessmentFromDocument(base64Data: string, mimeType: string): Promise<AssessmentReport> {
    return this.generateAssessmentFromDocuments([{ mimeType, data: base64Data }]);
  }

  private calculateWeightedRiskScore(
    sector: string,
    rawScores: { technical: number, ip: number, market: number, regulatory: number, financial: number }
  ) {
    const weights = SECTOR_WEIGHTS[sector] || SECTOR_WEIGHTS["default"];

    const weightedViability =
      (rawScores.technical * weights.tech) +
      (rawScores.ip * weights.ip) +
      (rawScores.market * weights.market) +
      (rawScores.regulatory * weights.regulatory) +
      (rawScores.financial * weights.financial);

    const riskScore = Math.round(100 - weightedViability);

    let riskLevel: 'low' | 'moderate' | 'elevated' | 'high' = 'moderate';

    if (riskScore >= 60) riskLevel = 'high';
    else if (riskScore >= 40) riskLevel = 'elevated';
    else if (riskScore >= 25) riskLevel = 'moderate';
    else riskLevel = 'low';

    return {
      aggregateScore: riskScore,
      riskLevel,
      breakdown: {
        technicalScore: rawScores.technical,
        ipScore: rawScores.ip,
        marketScore: rawScores.market,
        regulatoryScore: rawScores.regulatory,
        financialScore: rawScores.financial,
        appliedWeights: weights
      }
    };
  }

  private async runAssessmentPipeline(responses: any, inputType: InputType): Promise<AssessmentReport> {
    const startTime = Date.now();

    if (responses.error) {
      return {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        innovation_name: "Analysis Failed",
        sector: "Unknown",
        stage: "Unknown",
        location: "Global",
        version: 1,
        status: AssessmentStatus.FAILED,
        input_type: inputType,
        cover: {
          technologyName: "Analysis Unavailable",
          technologySubtitle: "Service Quota Exceeded or Connection Error",
          clientName: "User",
          inventorName: "Unknown",
          reportDate: new Date().toLocaleDateString(),
          reportId: "ERR-429",
          contactEmail: "support@arcus.ai"
        },
        executiveSummary: {
          ...DEFAULT_SYNTHESIS.executiveSummary,
          riskProfile: {
            ...DEFAULT_SYNTHESIS.executiveSummary.riskProfile,
            summaryParagraph: "The assessment could not be generated because the AI service is currently unavailable (Rate Limit/Quota Exceeded)."
          }
        },
        technologyForensics: DEFAULT_TECH_FORENSICS,
        ipDeepDive: DEFAULT_IP_DEEP_DIVE,
        marketDynamics: DEFAULT_MARKET_DYNAMICS,
        regulatoryPathway: DEFAULT_REGULATORY,
        financialRoadmap: DEFAULT_FINANCIAL,
        strategicRecommendations: DEFAULT_SYNTHESIS.strategicRecommendations,
        metadata: {
          gemini_model: "gemini-3-pro-preview",
          processing_time_seconds: 0,
          completeness_score: 0
        }
      };
    }

    const sector = responses['q4_sector'] || 'default';
    const innovationName = responses['q1_innovation_name'] || "Untitled Innovation";
    const innovationDesc = responses['q3_solution_description'] || "";

    const sectorContext = { ...responses, explicitSector: sector };

    // Optimized Thinking Budgets - Balanced for quality without excessive token usage
    const [ipDeepDive, marketDynamicsResponse, visualConcept] = await Promise.all([
      this.executeDirective("IP Analysis", PATENT_ATTORNEY_PROMPT, sectorContext, DEFAULT_IP_DEEP_DIVE, true, 4096),
      this.executeDirective("Market Dynamics", MARKET_STRATEGIST_PROMPT, sectorContext, DEFAULT_MARKET_DYNAMICS, true, 4096),
      this.generateProductConcept(`Industrial design concept for ${innovationName}. Context: ${innovationDesc}. Device Form Factor: Use context to determine if handheld, wearyable, or benchtop. Photorealistic product photography.`, '1K').then(url => ({ imageUrl: url, prompt: innovationDesc })).catch(() => undefined)
    ]);

    const marketDynamics = { ...DEFAULT_MARKET_DYNAMICS, ...marketDynamicsResponse };
    marketDynamics.graveyard = marketDynamics.graveyard || DEFAULT_MARKET_DYNAMICS.graveyard;
    marketDynamics.zombieCompetitors = marketDynamics.zombieCompetitors || DEFAULT_MARKET_DYNAMICS.zombieCompetitors;
    marketDynamics.gapAnalysis = marketDynamics.gapAnalysis || DEFAULT_MARKET_DYNAMICS.gapAnalysis;

    const technologyForensics = await this.executeDirective("Technical Validation", TECHNOLOGIST_PROMPT, { ...sectorContext, subsystems: ipDeepDive.searchMethodology?.components }, DEFAULT_TECH_FORENSICS, true, 6144);

    const regulatoryPathway = await this.executeDirective("Regulatory", REGULATORY_CONSULTANT_PROMPT, { ...sectorContext, tech: technologyForensics }, DEFAULT_REGULATORY, true, 6144);

    const financialRoadmap = await this.executeDirective("Financials", COMMERCIAL_LEAD_PROMPT, { ...sectorContext, market: marketDynamics, reg: regulatoryPathway }, DEFAULT_FINANCIAL, false, 4096);

    const synthesisContext = {
      responses,
      ipDeepDive,
      technologyForensics,
      marketDynamics,
      regulatoryPathway,
      financialRoadmap
    };

    // Optimal synthesis budget - adequate without being excessive
    const synthesis = await this.executeDirective("Synthesis", SYNTHESIS_PROMPT, synthesisContext, DEFAULT_SYNTHESIS, false, 8192);

    const rawScores = synthesis.executiveSummary?.rawScores || { technical: 50, ip: 50, market: 50, regulatory: 50, financial: 50 };
    const calculatedRisk = this.calculateWeightedRiskScore(sector, rawScores);

    const report: AssessmentReport = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      innovation_name: innovationName,
      sector: sector,
      stage: responses['q5_development_stage'] || "Unknown",
      location: Array.isArray(responses['q12_geographic_focus']) ? responses['q12_geographic_focus'].join(', ') : (responses['q12_geographic_focus'] || "Global"),
      version: 3,
      status: AssessmentStatus.COMPLETED,
      input_type: inputType,

      cover: {
        technologyName: innovationName,
        technologySubtitle: "Technology Transfer & Market Assessment",
        clientName: responses['client_name'] || "Confidential Client",
        inventorName: responses['inventor_name'] || "Undisclosed",
        reportDate: responses['report_date'] || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        reportId: `ICS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        contactEmail: "tech.transfer@arcus.ai"
      },

      executiveSummary: {
        ...synthesis.executiveSummary || DEFAULT_SYNTHESIS.executiveSummary,
        riskProfile: {
          ...synthesis.executiveSummary?.riskProfile || DEFAULT_SYNTHESIS.executiveSummary.riskProfile,
          aggregateScore: calculatedRisk.aggregateScore,
          riskLevel: calculatedRisk.riskLevel,
          scoringBreakdown: calculatedRisk.breakdown
        }
      },
      technologyForensics: technologyForensics || DEFAULT_TECH_FORENSICS,
      ipDeepDive: ipDeepDive || DEFAULT_IP_DEEP_DIVE,
      marketDynamics: marketDynamics || DEFAULT_MARKET_DYNAMICS,
      regulatoryPathway: regulatoryPathway || DEFAULT_REGULATORY,
      financialRoadmap: financialRoadmap || DEFAULT_FINANCIAL,
      strategicRecommendations: synthesis.strategicRecommendations || DEFAULT_SYNTHESIS.strategicRecommendations,

      productConcept: visualConcept,

      metadata: {
        gemini_model: "gemini-3-pro-preview",
        processing_time_seconds: (Date.now() - startTime) / 1000,
        completeness_score: 100
      }
    };

    return report;
  }

  async chatWithAnalyst(message: string, history: ChatMessage[] = [], contextData: string = ''): Promise<string> {
    // Construct conversation history for the model
    let historyPrompt = "";
    if (history.length > 0) {
      historyPrompt = "PREVIOUS CONVERSATION:\n" + history.map(h => `${h.role.toUpperCase()}: ${h.content}`).join("\n") + "\n\n";
    }

    // --- ENHANCED SYSTEM INSTRUCTION FOR "INVESTOR-GRADE" OUTPUT ---
    let systemContext = `
    ACT AS: Arcus Analyst, a Senior Investment Partner & Technical Forensics Expert.
    
    CORE DIRECTIVE:
    You provide "Investor-Grade" intelligence. You DO NOT chat casually. You output structured, high-density analysis.
    
    OUTPUT FORMATTING RULES (STRICT):
    1. Use Markdown H3 (###) for section headers.
    2. Use **bolding** for all metrics, dollar amounts, and key entities.
    3. Use numbered lists (1. 2. 3.) for sequential arguments.
    4. Use bullet points (* ) for supporting evidence.
    
    TONE:
    - Clinical, objective, and extremely precise.
    - No filler words ("Here is the info", "I hope this helps"). Start directly with the data.
    - If data is missing, state: "**Data Unavailable** in current context."
    
    EXAMPLE OUTPUT STRUCTURE:
    ### 1. Market Opportunity
    The total addressable market is **$4.2B**, driven by **Tier 1 OEMs**.
    * **CAGR:** 12.5% (2024-2030)
    * **Key Risk:** Regulatory headwinds in the **EU**.
    
    ### 2. IP Landscape
    Identified **3 Blocking Patents** assigned to **Medtronic**.
    `;

    if (contextData) {
      systemContext += `\n\nACTIVE ANALYSIS CONTEXT (READ-ONLY):\n${contextData}`;
    }

    const fullPrompt = `${historyPrompt}USER QUERY: ${message}`;

    const response = await this.getAIClient().models.generateContent({
      model: 'gemini-3-flash-preview', // Use Flash for faster chat reasoning
      contents: fullPrompt,
      config: {
        systemInstruction: systemContext,
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text || "No response generated.";
  }

  async generateProductConcept(prompt: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string> {
    const response = await this.getAIClient().models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `Professional industrial design product photography of ${prompt}. Cinematic studio lighting, neutral grey background, 8k resolution, highly detailed, photorealistic, product visualization, commercial photography style.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: size
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Failed to generate image.");
  }
}

export const gemini = new GeminiService();
