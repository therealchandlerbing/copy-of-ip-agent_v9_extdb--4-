
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
1. OVERVIEW (MINIMUM 400 WORDS): Deconstruct the system architecture in high detail.
   - Explain the "Why" and "How" of the physics/logic involved.
   - Analyze the "Energy Budget", "Compute Budget", or "Mass Budget".
2. CORE TECHNOLOGY: Explain the "Magic" mechanism in deep technical terms.
   - SPECIFICATIONS: Estimate 5-7 specific numbers based on physics/industry standards.
   - BENCHMARK: You MUST compare against the absolute best competitor.
3. CLAIMS MATRIX: Extract 4-5 inventor promises.
   - INTERROGATE them. Is there peer-reviewed evidence?
4. TECHNICAL RISKS (Physics of Failure):
   - Identify 3-5 CATASTROPHIC failure modes.
   - Mitigation must be an ENGINEERING solution.
5. TRL ASSESSMENT: Be conservative.
6. VALIDATION GAPS: What test is missing?

OUTPUT JSON FORMAT:
{
  "overview": { "paragraph": "string (Deep technical breakdown with **bolding**, 400+ words)", "coreFeatures": [{ "name": "string", "description": "string" }] },
  "coreTechnology": {
    "explanation": "string (Physics-based explanation, high detail, use **bolding**)",
    "specifications": [{ "parameter": "string", "value": "string (Estimated)", "benchmark": "string (SOTA Comparison)", "notes": "string (Why this matters)" }]
  },
  "claimsMatrix": [{
    "claimName": "string",
    "inventorAssertion": "string",
    "evidence": "string",
    "validationSource": "string (e.g., 'Physics Calculation', 'Literature Review')",
    "evidenceTier": number,
    "confidence": "High|Medium|Low|Unvalidated"
  }],
  "technicalRisks": [{ "component": "string", "riskLevel": "high|medium|low", "description": "string (Specific Failure Mode)", "mitigation": "string (Engineering Fix)" }],
  "trlAssessment": {
    "overallTrl": number,
    "overallAssessment": "string (Justification based on NASA/DoD definitions)",
    "subsystems": [{ "name": "string", "trl": number, "status": "string", "evidence": "string", "gapToTrl6": "string" }]
  },
  "validationGaps": {
    "intro": "string",
    "gaps": [{ "name": "string", "requiredTesting": "string (Specific Test Standard e.g., ASTM/ISO)", "estimatedCost": "string", "timeline": "string", "priority": "high|medium|low" }]
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
1. SEARCH STRATEGY: Define at least 3 specific CPC/IPC subclasses.
2. BLOCKING PATENTS:
   - Identify 3-4 REAL, high-threat assignees with ACTUAL patent numbers.
   - **CRITICAL**: Do NOT use "Proxy" or placeholder numbers. You MUST find and cite real patent numbers (e.g., US-10,xxx,xxx or EP-3,xxx,xxx).
   - If exact blocking text isn't found, cite the most relevant existing patent in the space.
   - For every block, provide a "Differentiation Opportunity" (Design-around).
3. WHITESPACE (300 Words): Detailed technical description of the open lane.
4. COMMERCIAL LEVERAGE: Who would PAY for this?
5. FILING STRATEGY: Propose a "Picket Fence" strategy.

OUTPUT JSON FORMAT:
{
  "searchMethodology": {
    "intro": "string",
    "components": [{ "component": "string", "searchTerms": "string", "databases": "string", "dateRange": "string", "resultsCount": "string" }],
    "gaps": "string"
  },
  "classificationAnalysis": "string (Deep analysis of the patent landscape density)",
  "classificationCodes": [{ "code": "string (CPC/IPC)", "description": "string", "strategicImplication": "string" }],
  "whitespace": { 
    "intro": "string", 
    "description": "string (Detailed technical description with **bolding**, 300 words)", 
    "evidence": "string",
    "strategicPartnerships": {
        "licensingTargets": "string",
        "partnershipModel": "string",
        "rationale": "string"
    }
  },
  "blockingPatents": [{
    "patentNumber": "string",
    "holder": "string",
    "expiration": "string",
    "relevance": "string",
    "ftoRisk": "high|medium|low",
    "claimsCoverage": "string (Specific claim elements that overlap)",
    "differentiationOpportunity": "string (How to engineer around it)"
  }],
  "ftoAssessment": {
    "components": [{ "component": "string", "riskLevel": "high|medium|low|zero", "blockingPatents": "string", "mitigation": "string" }],
    "overallAssessment": "string (Legal opinion summary)"
  },
  "filingStrategy": {
    "phases": [{ "name": "string", "timeline": "string", "focus": "string", "cost": "string", "details": "string" }],
    "priorityClaims": "string",
    "patentProtect": ["string"],
    "tradeSecrets": ["string"]
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
   - Provide specific dollar amounts ($B).
   - List 3 specific "Key Drivers".
   - Identify 3 "Market Trends".
2. THE GRAVEYARD: Identify *specific* failed startups. Why did they die?
   - Provide at least 2 detailed examples.
3. COMPETITORS:
   - Identify 3-4 Incumbents and Challengers.
   - Find their specific VULNERABILITY.
4. FEATURE WAR ROOM:
   - List 4-5 Critical Features.
5. BEACHHEAD MARKET:
   - Define the *exact* first customer profile.
   - Define the specific "Pain Point".
6. MONETIZATION: Pricing strategy.

OUTPUT JSON FORMAT:
{
  "marketSizeAnalysis": {
    "totalAddressableMarket": "string",
    "serviceableAvailableMarket": "string",
    "serviceableObtainableMarket": "string (Year 1 Realistic Capture Target)",
    "cagr": "string",
    "forecastPeriod": "string",
    "keyDrivers": ["string"],
    "marketTrends": [{ "trend": "string", "impact": "string" }]
  },
  "graveyard": {
    "intro": "string",
    "failedProducts": [{ "name": "string", "company": "string", "timeline": "string", "failureMode": "string (Why they failed)", "lesson": "string" }]
  },
  "zombieCompetitors": {
    "intro": "string",
    "companies": [{ "name": "string", "lastUpdate": "string", "warningSigns": "string", "implication": "string" }]
  },
  "competitiveLandscape": [{
    "name": "string", "segment": "string", "geography": "string", "valueProposition": "string", "vulnerability": "string (Detailed weakness)", "status": "Active|Zombie|Exited"
  }],
  "featureComparison": [{
     "feature": "string",
     "us": boolean,
     "competitor": boolean,
     "advantage": "string"
  }],
  "gapAnalysis": { "intro": "string", "gaps": ["string"], "unmetDemandEvidence": "string" },
  "beachheadMarket": { "profile": "string", "painPoint": "string", "toleranceReason": "string", "marketSize": "string", "expansionPath": "string" },
  "customerAcquisition": [{ "milestone": "string", "strategy": "string", "channels": "string", "timeline": "string" }],
  "monetization": { "pricingAnalysis": [{ "category": "string", "priceRange": "string", "valueProposition": "string" }] }
}
`;

const REGULATORY_CONSULTANT_PROMPT = `
ACT AS: Senior Regulatory Affairs Consultant.
TASK: Map the Compliance & Certification Pathway. Output strict JSON matching the 'RegulatoryPathway' schema.
PRIORITY: SPECIFIC STANDARDS & TIMELINES.

STYLE GUIDE:
- Use **Markdown bolding** for Standards (ISO, ASTM) and Regulation Codes (21 CFR).

INSTRUCTIONS:
1. CLASSIFICATION: Be precise (FDA Codes, ISO Standards).
2. PREDICATES: Identify existing certified products.
3. TIMELINE & COST: Be realistic.
4. RISKS: What test is most likely to fail?

OUTPUT JSON FORMAT:
{
  "classification": { "intro": "string", "regulatoryClassification": "string", "pathway": "string", "timelineEstimate": "string", "standards": ["string"] },
  "comparableSystems": [{ "productName": "string", "referenceNumber": "string", "approvalDate": "string", "relevance": "string", "reviewTime": "string" }],
  "timelineCost": [{ "phase": "string", "activities": "string", "duration": "string", "cost": "string" }],
  "recentDevelopments": { "intro": "string", "developments": [{ "title": "string", "date": "string", "impact": "string" }] },
  "risks": [{ "title": "string", "description": "string", "mitigation": "string" }]
}
`;

const COMMERCIAL_LEAD_PROMPT = `
ACT AS: CFO & Manufacturing Operations Lead.
TASK: Build the Financial Roadmap & Unit Economics. Output strict JSON matching the 'FinancialRoadmap' schema.
PRIORITY: DETAILED BOM & FUNDING STRATEGY.

STYLE GUIDE:
- Use **Markdown bolding** for financial figures.

INSTRUCTIONS:
1. UNIT ECONOMICS (The BOM):
   - Break down the COGS into 5-7 line items.
2. FUNDING:
   - Seed Round: What do we need to prove?
   - Series A: What is the milestone?
3. TEAM: Who are we missing?

OUTPUT JSON FORMAT:
{
  "actionPlan": [{ "months": "string", "phase": "string", "activities": "string", "budget": "string", "milestone": "string" }],
  "budgetFramework": [{ "category": "string", "allocation": "string", "activities": "string" }],
  "unitEconomics": {
    "bom": [{ "component": "string", "cost": "string", "supplier": "string", "notes": "string" }],
    "totalCogs": "string", "cogsVolume": "string", "targetAsp": "string", "grossMargin": "string", "breakevenUnits": "string"
  },
  "fundingRequirements": {
    "seed": { "amount": "string", "useOfFunds": ["string"], "sources": "string" },
    "seriesA": { "amount": "string", "useOfFunds": ["string"], "trigger": "string" }
  },
  "teamGaps": [{ "role": "string", "priority": "high|medium|low", "timing": "string", "budgetImpact": "string" }]
}
`;

const SYNTHESIS_PROMPT = `
ACT AS: Senior Director of Technology Transfer & Commercialization SME.
TASK: Synthesize the final Executive Summary and provide DETERMINISTIC SCORING. Output strict JSON.
PRIORITY: PROFESSIONAL REALISM & STRATEGIC CLARITY. WRITE EXTENSIVELY.

SCORING RULES (STRICT RUBRIC):
You must output "rawScores" (0-100) for each dimension based on data.

STYLE GUIDE:
- Use **Markdown bolding** to emphasize risks, key opportunities, and critical figures.
- Use bullet points (- ) for lists within text fields.
- Tone: Clinical, precise, advisory. "Investor-Grade".

INSTRUCTIONS:
1. RISK PROFILE: Write a MINIMUM of 400 words. Synthesize constraints. Professional tone.
2. CRITICAL CONCERNS: Top 3-5 hurdles.
3. TTO DIRECTOR'S INSIGHTS (The Memo):
   - Standalone Memorandum (400+ words).
   - Focus: Asset transferability, licensing viability.
   - Provide 3-5 "Strategic Mandates".

OUTPUT JSON FORMAT:
{
  "executiveSummary": {
    "rawScores": { "technical": number, "ip": number, "market": number, "regulatory": number, "financial": number },
    "riskProfile": {
      "tier1Count": number,
      "tier2Count": number,
      "tier3Count": number,
      "summaryParagraph": "string (min 400 words. Use **bolding**. Comprehensive synthesis.)",
      "recommendation": "string (Short, punchy verdict e.g. 'CONDITIONAL PROCEED')",
      "keyCondition": "string (The single most important condition e.g. 'Pending Sensor POC')",
      "investmentRequired": "string (Total to FDA e.g. 'Est. $18-22M')"
    },
    "criticalConcerns": [{ "title": "string", "what": "string", "whyItMatters": "string", "resolution": "string", "tier": 1|2 }],
    "keyStrengths": [{ "title": "string", "description": "string", "evidence": "string" }],
    "commercializationPath": { "estimatedDevelopmentCost": "string", "timeToMarket": number, "keyMilestone": "string", "narrative": "string", "licensingPotential": "High|Medium|Low" },
    "dataConfidence": [{ "area": "string", "evidenceTier": number, "confidenceLevel": "High|Medium|Low", "knownGaps": "string" }]
  },
  "strategicRecommendations": {
    "priorityActions": [{ "action": "string", "owner": "string", "timeline": "string", "budget": "string" }],
    "partnerships": [{ "type": "string", "targets": "string", "valueExchange": "string", "approach": "string" }],
    "alternativePathways": { "intro": "string", "alternatives": [{ "name": "string", "description": "string", "tradeoffs": "string" }] },
    "goNoGoFramework": { "checkpointTimeline": "string", "goCriteria": ["string"], "noGoCriteria": ["string"] },
    "monitoringMetrics": [{ "category": "string", "metric": "string", "significance": "string" }],
    "riskIndicators": ["string"],
    "ttoSynthesis": {
       "insightNarrative": "string (The 'Director's Memo' - blunt, strategic advice. EXTENSIVE ANALYSIS (400-600 words). Use highly professional, authoritative tone.)",
       "keyRecommendations": [{ "title": "string", "description": "string", "priority": "Critical|High|Medium" }]
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
  private ai: GoogleGenAI;

  constructor() {
    // Fallback to dummy key if env var is missing to prevent browser crash on startup
    const apiKey = (typeof process !== 'undefined' ? process.env.API_KEY : undefined)
      || (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_GOOGLE_API_KEY : undefined)
      || 'dummy_key_for_init';

    this.ai = new GoogleGenAI({ apiKey });
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

        const response = await this.ai.models.generateContent({
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

        const response = await this.ai.models.generateContent({
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

    // Increased Thinking Budgets for Deep Analysis
    const [ipDeepDive, marketDynamicsResponse, visualConcept] = await Promise.all([
      this.executeDirective("IP Analysis", PATENT_ATTORNEY_PROMPT, sectorContext, DEFAULT_IP_DEEP_DIVE, true, 4096),
      this.executeDirective("Market Dynamics", MARKET_STRATEGIST_PROMPT, sectorContext, DEFAULT_MARKET_DYNAMICS, true, 4096),
      this.generateProductConcept(`Industrial design concept for ${innovationName}. Context: ${innovationDesc}. Device Form Factor: Use context to determine if handheld, wearyable, or benchtop. Photorealistic product photography.`, '1K').then(url => ({ imageUrl: url, prompt: innovationDesc })).catch(() => undefined)
    ]);

    const marketDynamics = { ...DEFAULT_MARKET_DYNAMICS, ...marketDynamicsResponse };
    marketDynamics.graveyard = marketDynamics.graveyard || DEFAULT_MARKET_DYNAMICS.graveyard;
    marketDynamics.zombieCompetitors = marketDynamics.zombieCompetitors || DEFAULT_MARKET_DYNAMICS.zombieCompetitors;
    marketDynamics.gapAnalysis = marketDynamics.gapAnalysis || DEFAULT_MARKET_DYNAMICS.gapAnalysis;

    const technologyForensics = await this.executeDirective("Technical Validation", TECHNOLOGIST_PROMPT, { ...sectorContext, subsystems: ipDeepDive.searchMethodology?.components }, DEFAULT_TECH_FORENSICS, true, 4096);

    const regulatoryPathway = await this.executeDirective("Regulatory", REGULATORY_CONSULTANT_PROMPT, { ...sectorContext, tech: technologyForensics }, DEFAULT_REGULATORY, true);

    const financialRoadmap = await this.executeDirective("Financials", COMMERCIAL_LEAD_PROMPT, { ...sectorContext, market: marketDynamics, reg: regulatoryPathway }, DEFAULT_FINANCIAL);

    const synthesisContext = {
      responses,
      ipDeepDive,
      technologyForensics,
      marketDynamics,
      regulatoryPathway,
      financialRoadmap
    };

    // Maximum budget for synthesis to handle 50-page depth
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

    const response = await this.ai.models.generateContent({
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
    const response = await this.ai.models.generateContent({
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
