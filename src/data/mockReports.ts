
import { AssessmentReport, AssessmentStatus, InputType } from '../types';

export const MOCK_REPORTS: AssessmentReport[] = [
  {
    id: "mock-med-01",
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    innovation_name: "AccuFlow: Non-Invasive Hemodynamic Monitor",
    sector: "medical_devices",
    stage: "Prototype",
    location: "US, EU",
    version: 1,
    status: AssessmentStatus.COMPLETED,
    input_type: InputType.HYBRID,
    isExample: true,

    cover: {
      technologyName: "AccuFlow Hemodynamic Sensor",
      technologySubtitle: "Continuous Cardiac Output Monitoring",
      clientName: "MedTech Ventures",
      inventorName: "Dr. Elena Vasquez",
      reportDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      reportId: "ICS-2024-8842",
      contactEmail: "elena.v@accuflow.bio"
    },

    executiveSummary: {
      riskProfile: {
        aggregateScore: 68,
        riskLevel: "high",
        tier1Count: 2,
        tier2Count: 4,
        tier3Count: 1,
        summaryParagraph: "While the clinical value proposition of non-invasive hemodynamic monitoring is immense ($2.4B TAM), AccuFlow faces a CRITICAL IP BLOCK. The core sensor geometry appears to infringe on claim 14 of Edwards Lifesciences' patent US-RE45999. Furthermore, technical validation data shows signal degradation in patients with BMI > 35, a demographic constituting 40% of the target market. Without a hardware redesign to navigate the IP thicket and improve signal-to-noise ratio, this is a 'No-Go' for Series A investment. The regulatory pathway is also clearer than anticipated (510(k)), but the IP risk outweighs this benefit.",
        scoringBreakdown: {
          technicalScore: 60,
          ipScore: 30,
          marketScore: 85,
          regulatoryScore: 75,
          financialScore: 65,
          appliedWeights: { tech: 0.20, ip: 0.30, market: 0.15, regulatory: 0.25, financial: 0.10 }
        }
      },
      criticalConcerns: [
        {
          title: "Freedom-to-Operate Block",
          what: "Direct overlap with Edwards Lifesciences patent on 'cuff-based oscillometric sensing'.",
          whyItMatters: "High probability of litigation or injunction upon commercial launch.",
          resolution: "Requires immediate 'Design-Around' of the sensor housing or licensing deal.",
          tier: 1
        },
        {
          title: "Signal Fidelity in High BMI",
          what: "Signal-to-noise ratio drops by 40% in patients with BMI > 35.",
          whyItMatters: "Excludes a massive portion of the hypertensive patient population.",
          resolution: "Algorithm update required (Deep Learning denoiser).",
          tier: 1
        }
      ],
      keyStrengths: [
        {
          title: "Clear Regulatory Predicate",
          description: "Substantial equivalence to Clearsight System establishes a clear 510(k) pathway.",
          evidence: "FDA K-Number Match Analysis"
        },
        {
          title: "High Gross Margins",
          description: "Unit economics suggest 75% margin at scale due to low-cost sensor components.",
          evidence: "BOM Analysis"
        }
      ],
      commercializationPath: {
        estimatedDevelopmentCost: "$4.5M",
        timeToMarket: 18,
        keyMilestone: "FDA 510(k) Clearance",
        narrative: "Capital efficient path to FDA clearance, but commercial launch requires resolving IP issues first.",
        licensingPotential: "High"
      },
      dataConfidence: [
        { area: "IP Landscape", evidenceTier: 4, confidenceLevel: "High", knownGaps: "None" },
        { area: "Clinical Data", evidenceTier: 2, confidenceLevel: "Medium", knownGaps: "No pivotal trial data." }
      ]
    },

    technologyForensics: {
      overview: {
        paragraph: "The system utilizes photoplethysmography (PPG) combined with oscillometric pressure sensing to derive continuous cardiac output. While the physics is sound for healthy cohorts, the 'Transfer Function' relies on arterial compliance assumptions that fail in calcified arteries (elderly patients).",
        coreFeatures: [
          { name: "Dual-Sensor Fusion", description: "Combines optical and pressure waveforms." },
          { name: "Wireless Patch", description: "Bluetooth LE transmission to bedside monitor." }
        ]
      },
      coreTechnology: {
        explanation: "Algorithmic derivation of Stroke Volume (SV) from Pulse Pressure Analysis (PPA).",
        specifications: [
          { parameter: "Accuracy (Bias)", value: "< 5%", benchmark: "< 10%", notes: "Beats standard" },
          { parameter: "Battery Life", value: "24 Hours", benchmark: "48 Hours", notes: "Sub-par" },
          { parameter: "Latency", value: "500ms", benchmark: "200ms", notes: "Acceptable" }
        ]
      },
      claimsMatrix: [
        { claimName: "Hospital-Grade Accuracy", inventorAssertion: "Matches Swan-Ganz catheter within 2%", evidence: "Internal bench data shows 4% variance.", validationSource: "Internal Lab", evidenceTier: 3, confidence: "Medium" },
        { claimName: "Motion Artifact Rejection", inventorAssertion: "Works during patient transport", evidence: "No dynamic testing data provided.", validationSource: "Assertion", evidenceTier: 1, confidence: "Low" }
      ],
      technicalRisks: [
        { component: "Optical Sensor", riskLevel: "high", description: "Skin pigmentation interference (Melanin absorption).", mitigation: "Multi-wavelength LED array." },
        { component: "Battery", riskLevel: "medium", description: "Thermal runaway in sterile field.", mitigation: "Current limiting circuit." }
      ],
      trlAssessment: {
        overallTrl: 5,
        overallAssessment: "Component validation in relevant environment completed. System integration pending.",
        subsystems: [
          { name: "Sensor Hardware", trl: 6, status: "Prototype", evidence: "Lab Tested", gapToTrl6: "None" },
          { name: "Algorithm", trl: 4, status: "Alpha", evidence: "Simulation", gapToTrl6: "Clinical Dataset validation" }
        ]
      },
      validationGaps: {
        intro: "Critical need for diverse population testing.",
        gaps: [
          { name: "Pigmentation Study", requiredTesting: "ISO 80601-2-61", estimatedCost: "$150k", timeline: "3 Months", priority: "high" }
        ]
      }
    },

    ipDeepDive: {
      searchMethodology: {
        intro: "Deep semantic search across USPTO and WIPO databases focusing on CPC A61B5/021.",
        components: [
          { component: "Sensor Housing", searchTerms: "Oscillometric + Cuffless", databases: "USPTO", dateRange: "2010-2024", resultsCount: "412" }
        ],
        gaps: "Asian patent databases not fully indexed."
      },
      classificationAnalysis: "Highly crowded space. 'Patent Thicket' detected around cuffless calibration.",
      classificationCodes: [
        { code: "A61B 5/021", description: "Measuring Fluid Pressure", strategicImplication: "Primary Blocking Area" }
      ],
      whitespace: {
        intro: "Gap identified in 'AI-based calibration' methods which bypass mechanical coupling claims.",
        description: "Competitors focus on hardware. A pure software calibration approach is less protected.",
        evidence: "Low patent density in AI-driven hemodynamic calibration.",
        strategicPartnerships: {
          licensingTargets: "GE Healthcare, Philips",
          partnershipModel: "Algorithm Licensing",
          rationale: "Integrate into existing bedside monitors."
        }
      },
      blockingPatents: [
        {
          patentNumber: "US-RE45999",
          holder: "Edwards Lifesciences",
          expiration: "2031",
          relevance: "High",
          ftoRisk: "high",
          claimsCoverage: "Method for deriving cardiac output from arterial pressure waveform.",
          differentiationOpportunity: "Use a stochastic model instead of deterministic transfer function."
        },
        {
          patentNumber: "US-9871234",
          holder: "Masimo Corp",
          expiration: "2029",
          relevance: "Medium",
          ftoRisk: "medium",
          claimsCoverage: "Optical sensor attachment mechanism.",
          differentiationOpportunity: "Modify adhesive form factor."
        }
      ],
      ftoAssessment: {
        components: [
          { component: "Algorithm", riskLevel: "high", blockingPatents: "Edwards", mitigation: "Rewrite core logic." },
          { component: "Housing", riskLevel: "low", blockingPatents: "None", mitigation: "N/A" }
        ],
        overallAssessment: "High risk of litigation."
      },
      filingStrategy: {
        phases: [
          { name: "Provisional (AI)", timeline: "Month 1", focus: "ML Calibration", cost: "$15k", details: "Protect the software pivot." }
        ],
        priorityClaims: "Machine Learning Calibration",
        patentProtect: ["Algorithm"],
        tradeSecrets: ["Training Data Source"]
      }
    },

    marketDynamics: {
      marketSizeAnalysis: {
        totalAddressableMarket: "$2.4B",
        serviceableAvailableMarket: "$600M",
        serviceableObtainableMarket: "$50M",
        cagr: "8.5%",
        forecastPeriod: "2024-2030",
        keyDrivers: ["Aging Population", "Shift to Home Care"],
        marketTrends: [{ trend: "Remote Monitoring", impact: "High demand for wireless" }]
      },
      graveyard: {
        intro: "Many have failed due to accuracy issues.",
        failedProducts: [
          { name: "Sotera ViSi", company: "Sotera", timeline: "2015-2020", failureMode: "Bankruptcy", lesson: "Unit economics didn't work." }
        ]
      },
      zombieCompetitors: {
        intro: "Several startups stuck in pilot purgatory.",
        companies: [{ name: "BioBeat", lastUpdate: "2022", warningSigns: "No press releases", implication: "Tech stalled" }]
      },
      competitiveLandscape: [
        { name: "Edwards Lifesciences", segment: "Incumbent", geography: "Global", valueProposition: "Gold Standard", vulnerability: "Invasive", status: "Active" },
        { name: "CareTaker Medical", segment: "Challenger", geography: "US", valueProposition: "Wireless", vulnerability: "Cost", status: "Active" }
      ],
      featureComparison: [
        { feature: "Non-Invasive", us: true, competitor: false, advantage: "Patient Comfort" },
        { feature: "Continuous", us: true, competitor: true, advantage: "Parity" },
        { feature: "Low Cost (<$50)", us: true, competitor: false, advantage: "Disposability" }
      ],
      gapAnalysis: {
        intro: "Hospitals need a cheap, disposable option.",
        gaps: ["Cost-effective continuous monitoring"],
        unmetDemandEvidence: "Hospital survey data"
      },
      beachheadMarket: {
        profile: "ICU Step-down Units",
        painPoint: "Nurse staffing shortage",
        toleranceReason: "Need automation",
        marketSize: "$400M",
        expansionPath: "Home Health"
      },
      customerAcquisition: [
        { milestone: "Pilot", strategy: "Key Opinion Leaders", channels: "Academic Conferences", timeline: "Year 1" }
      ],
      monetization: {
        pricingAnalysis: [{ category: "Hardware", priceRange: "$200", valueProposition: "10x cheaper than catheter" }]
      }
    },

    regulatoryPathway: {
      classification: {
        intro: "Class II Medical Device via 510(k).",
        regulatoryClassification: "21 CFR 870.1130",
        pathway: "510(k)",
        timelineEstimate: "12-14 Months",
        standards: ["IEC 60601", "ISO 13485"]
      },
      comparableSystems: [
        { productName: "ClearSight", referenceNumber: "K142345", approvalDate: "2014", relevance: "Direct Predicate", reviewTime: "180 Days" }
      ],
      timelineCost: [
        { phase: "V&V Testing", activities: "Biocompatibility, EMC", duration: "6 Months", cost: "$500k" }
      ],
      recentDevelopments: { intro: "N/A", developments: [] },
      risks: [{ title: "Clinical Data Request", description: "FDA may ask for human trial.", mitigation: "Pre-sub meeting." }]
    },

    financialRoadmap: {
      actionPlan: [],
      budgetFramework: [{ category: "R&D", allocation: "60%", activities: "Algorithm Dev" }],
      unitEconomics: {
        bom: [{ component: "Optical Sensor", cost: "$4.50", supplier: "Osram", notes: "" }],
        totalCogs: "$22.00",
        cogsVolume: "10k Units",
        targetAsp: "$150.00",
        grossMargin: "85%",
        breakevenUnits: "5000"
      },
      fundingRequirements: {
        seed: { amount: "$2M", useOfFunds: ["IP Cleanup", "V&V Testing"], sources: "VC" },
        seriesA: { amount: "$10M", useOfFunds: ["FDA Submission"], trigger: "Pivotal Trial" }
      },
      teamGaps: [{ role: "Regulatory Affairs", priority: "high", timing: "Now", budgetImpact: "$200k" }]
    },

    strategicRecommendations: {
      priorityActions: [
        { action: "Design-Around Patent", owner: "CTO", timeline: "Month 1-3", budget: "$50k" },
        { action: "Pre-Sub FDA Meeting", owner: "CEO", timeline: "Month 4", budget: "$10k" }
      ],
      partnerships: [
        { type: "Distribution", targets: "McKesson", valueExchange: "Volume sales", approach: "Direct" }
      ],
      alternativePathways: {
        intro: "If FDA fails, pivot to consumer wellness.",
        alternatives: [{ name: "Wellness Device", description: "Sell as 'Fitness Tracker'", tradeoffs: "Lower price point" }]
      },
      goNoGoFramework: {
        checkpointTimeline: "6 Months",
        goCriteria: ["Patent non-infringement opinion", "Algorithm fix for high BMI"],
        noGoCriteria: ["Injunction threat", "Failed V&V"]
      },
      monitoringMetrics: [{ category: "Tech", metric: "Signal Accuracy", significance: "Critical" }],
      riskIndicators: ["Competitor Lawsuit"],
      ttoSynthesis: {
        insightNarrative: "The disclosed technology addresses a clinically significant need in the pediatric diabetes market; however, the current embodiment faces substantial barriers to commercialization. The analysis identifies a critical Freedom-to-Operate (FTO) conflict with the Edwards Lifesciences patent estate, specifically regarding the sensor geometry and control logic. \n\nFrom a Technology Transfer perspective, the asset is currently 'encumbered' and unsuitable for immediate licensing or spin-out. Proceeding with the current architecture would likely result in litigation or an immediate injunction upon market entry. \n\nTherefore, the recommendation is to halt commercial development of the current hardware and focus resources on a 'reconstructive pivot.' The team must validate a non-infringing 'soft start' actuation mechanism that bypasses the protected feedback loops. Without this technical remediation, the IP risk outweighs the clinical value proposition.",
        keyRecommendations: [
          { title: "IP Clean Room", description: "Isolate dev team to build clean-room algorithm.", priority: "Critical" },
          { title: "Hire General Counsel", description: "Need IP strategy in-house.", priority: "High" }
        ]
      }
    },

    // Add visual concept
    productConcept: {
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070",
      prompt: "Wearable medical sensor patch, sleek white design, placed on wrist, soft glowing blue indicator, sterile hospital environment"
    }
  },

  // --- REPORT 2: SaaS / AI ---
  {
    id: "mock-saas-02",
    created_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    innovation_name: "CogniChain: Predictive Logistics Engine",
    sector: "ai_ml",
    stage: "Pilot",
    location: "Global",
    version: 2,
    status: AssessmentStatus.COMPLETED,
    input_type: InputType.QUESTIONNAIRE,
    isExample: true,

    cover: {
      technologyName: "CogniChain AI",
      technologySubtitle: "Autonomous Supply Chain Orchestration",
      clientName: "Global Logistics Corp",
      inventorName: "James Wu",
      reportDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      reportId: "ICS-2024-1102",
      contactEmail: "j.wu@cognichain.ai"
    },

    executiveSummary: {
      riskProfile: {
        aggregateScore: 32, // Low Risk
        riskLevel: "moderate",
        tier1Count: 0,
        tier2Count: 2,
        tier3Count: 3,
        summaryParagraph: "CogniChain represents a strong Series A candidate with a low technical risk profile but moderate market execution risk. The core 'Self-Healing' logistics algorithm is functional and currently deployed in 2 pilot sites. The primary concern is defensibility: the IP is largely trade-secret based, and the barrier to entry for competitors like Google/Amazon is purely data access, not technology. However, the 'Unit Economics' are stellar (90% Gross Margin), and the team has secured a unique data partnership with Maersk, creating a temporary moat.",
        scoringBreakdown: {
          technicalScore: 85,
          ipScore: 50,
          marketScore: 70,
          regulatoryScore: 90,
          financialScore: 95,
          appliedWeights: { tech: 0.25, ip: 0.15, market: 0.30, regulatory: 0.10, financial: 0.20 }
        }
      },
      criticalConcerns: [
        {
          title: "Low IP Defensibility",
          what: "Core tech is software logic, difficult to patent.",
          whyItMatters: "Competitors can replicate features quickly.",
          resolution: "Focus on 'Data Moat' and network effects.",
          tier: 2
        },
        {
          title: "Data Dependency",
          what: "Model requires real-time API access to carriers.",
          whyItMatters: "If API pricing increases, margins erode.",
          resolution: "Long-term data contracts.",
          tier: 2
        }
      ],
      keyStrengths: [
        {
          title: "High Scalability",
          description: "Cloud-native architecture scales to millions of SKUs instantly.",
          evidence: "Load Test Results"
        },
        {
          title: "Exclusive Data Access",
          description: "Exclusive 3-year agreement with major shipping line.",
          evidence: "Signed MOU"
        }
      ],
      commercializationPath: {
        estimatedDevelopmentCost: "$1.2M",
        timeToMarket: 3,
        keyMilestone: "$1M ARR",
        narrative: "Immediate path to revenue. Focus on sales velocity over R&D.",
        licensingPotential: "Medium"
      },
      dataConfidence: [
        { area: "Market Size", evidenceTier: 3, confidenceLevel: "High", knownGaps: "None" },
        { area: "Tech Scalability", evidenceTier: 4, confidenceLevel: "High", knownGaps: "None" }
      ]
    },

    technologyForensics: {
      overview: {
        paragraph: "CogniChain utilizes a Graph Neural Network (GNN) to model supply chain nodes. Unlike traditional linear optimization, the GNN can predict downstream disruptions (e.g., port strike) and autonomously re-route cargo.",
        coreFeatures: [
          { name: "Graph Neural Net", description: "Node-based prediction." },
          { name: "Auto-Rebooking", description: "API integration with carriers." }
        ]
      },
      coreTechnology: {
        explanation: "Dynamic re-routing using Reinforcement Learning (RL).",
        specifications: [
          { parameter: "Inference Speed", value: "20ms", benchmark: "100ms", notes: "Best in class" },
          { parameter: "Prediction Accuracy", value: "92%", benchmark: "85%", notes: "Vs Legacy ERP" }
        ]
      },
      claimsMatrix: [
        { claimName: "Autonomous Rebooking", inventorAssertion: "Zero human intervention", evidence: "Logs show 95% auto-approval.", validationSource: "System Logs", evidenceTier: 4, confidence: "High" }
      ],
      technicalRisks: [
        { component: "AI Model", riskLevel: "medium", description: "Model drift / Hallucination on routing.", mitigation: "Human-in-the-loop guardrails." }
      ],
      trlAssessment: {
        overallTrl: 8,
        overallAssessment: "System is live in operational environment (Pilot).",
        subsystems: [
          { name: "Frontend", trl: 9, status: "Live", evidence: "Deployed", gapToTrl6: "None" },
          { name: "Prediction Engine", trl: 7, status: "Beta", evidence: "Pilot Data", gapToTrl6: "None" }
        ]
      },
      validationGaps: {
        intro: "Need to prove ROI attribution.",
        gaps: []
      }
    },

    ipDeepDive: {
      searchMethodology: {
        intro: "Software patent search (Alice Corp check).",
        components: [],
        gaps: "N/A"
      },
      classificationAnalysis: "Software methods difficult to protect via patent.",
      classificationCodes: [],
      whitespace: {
        intro: "N/A",
        description: "N/A",
        evidence: "N/A",
        strategicPartnerships: { licensingTargets: "SAP, Oracle", partnershipModel: "App Store Integration", rationale: "Distribution" }
      },
      blockingPatents: [],
      ftoAssessment: {
        components: [],
        overallAssessment: "Low patent risk, but low patent protection."
      },
      filingStrategy: {
        phases: [],
        priorityClaims: "N/A",
        patentProtect: [],
        tradeSecrets: ["Graph Structure", "Carrier API Keys"]
      }
    },

    marketDynamics: {
      marketSizeAnalysis: {
        totalAddressableMarket: "$15B",
        serviceableAvailableMarket: "$2B",
        serviceableObtainableMarket: "$20M",
        cagr: "18%",
        forecastPeriod: "2025-2029",
        keyDrivers: ["Supply Chain Volatility"],
        marketTrends: [{ trend: "GenAI in Logistics", impact: "High Hype" }]
      },
      graveyard: {
        intro: "Crowded market with many zombies.",
        failedProducts: [
          { name: "Slync.io", company: "Slync", timeline: "2022", failureMode: "Fraud/Burn", lesson: "Governance matters." }
        ]
      },
      zombieCompetitors: {
        intro: "",
        companies: []
      },
      competitiveLandscape: [
        { name: "Project44", segment: "Unicorn", geography: "Global", valueProposition: "Visibility", vulnerability: "Legacy Tech Debt", status: "Active" },
        { name: "Flexport", segment: "Competitor", geography: "Global", valueProposition: "Service + Tech", vulnerability: "High Cost", status: "Active" }
      ],
      featureComparison: [
        { feature: "Predictive Re-routing", us: true, competitor: false, advantage: "Actionable" },
        { feature: "Real-time Vis", us: true, competitor: true, advantage: "None" }
      ],
      gapAnalysis: { intro: "", gaps: [], unmetDemandEvidence: "" },
      beachheadMarket: {
        profile: "Mid-market Freight Forwarders",
        painPoint: "Margin compression",
        toleranceReason: "Desperate for efficiency",
        marketSize: "$500M",
        expansionPath: "Enterprise Shippers"
      },
      customerAcquisition: [
        { milestone: "$1M ARR", strategy: "Outbound Sales", channels: "LinkedIn", timeline: "12 Months" }
      ],
      monetization: {
        pricingAnalysis: [{ category: "SaaS Fee", priceRange: "$50k/yr", valueProposition: "ROI > 5x" }]
      }
    },

    regulatoryPathway: {
      classification: {
        intro: "Standard Software Compliance.",
        regulatoryClassification: "N/A",
        pathway: "SOC 2 Type II",
        timelineEstimate: "3 Months",
        standards: ["GDPR", "CCPA"]
      },
      comparableSystems: [],
      timelineCost: [],
      recentDevelopments: { intro: "N/A", developments: [] },
      risks: []
    },

    financialRoadmap: {
      actionPlan: [],
      budgetFramework: [],
      unitEconomics: {
        bom: [{ component: "Hosting (AWS)", cost: "$200/mo", supplier: "AWS", notes: "" }],
        totalCogs: "$500/mo",
        cogsVolume: "Per Tenant",
        targetAsp: "$5000/mo",
        grossMargin: "90%",
        breakevenUnits: "10 Customers"
      },
      fundingRequirements: {
        seed: { amount: "$1.5M", useOfFunds: ["Sales Team", "Engineering"], sources: "VC" },
        seriesA: { amount: "$8M", useOfFunds: ["Global Scale"], trigger: "$2M ARR" }
      },
      teamGaps: [{ role: "VP Sales", priority: "high", timing: "Immediately", budgetImpact: "$250k" }]
    },

    strategicRecommendations: {
      priorityActions: [
        { action: "Hire Sales Leader", owner: "CEO", timeline: "Month 1", budget: "$20k" }
      ],
      partnerships: [],
      alternativePathways: { intro: "", alternatives: [] },
      goNoGoFramework: { checkpointTimeline: "3 Months", goCriteria: ["3 Paid Pilots"], noGoCriteria: ["Zero Churn"] },
      monitoringMetrics: [{ category: "Sales", metric: "CAC", significance: "High" }],
      riskIndicators: [],
      ttoSynthesis: {
        insightNarrative: "The 'CogniChain' asset demonstrates high technical readiness (TRL 8) and clear operational utility. However, the commercialization strategy relies heavily on trade secret protection rather than a robust patent portfolio, which limits traditional licensing leverage.\n\nFrom a transferability standpoint, the asset is best positioned as a direct spin-out or an exclusive field-of-use license to a strategic partner who values the immediate operational efficiency over long-term IP exclusivity. The primary risk to value is the commoditization of the underlying data sources. \n\nThe strategic mandate is to secure long-term data exclusivity agreements to create a defensible 'moat' in the absence of strong patent protection. Immediate commercial deployment is recommended to capture market share before competitors replicate the logic.",
        keyRecommendations: [
          { title: "Secure Data Exclusivity", description: "Lock in long-term data agreements to create a moat.", priority: "Critical" }
        ]
      }
    },

    productConcept: {
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2070",
      prompt: "Futuristic digital dashboard, holographic supply chain map, data streams, dark mode UI, glowing nodes"
    }
  },

  // --- REPORT 3: Clean Energy ---
  {
    id: "mock-clean-03",
    created_at: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
    innovation_name: "HelioGen: Perovskite Solar Coating",
    sector: "clean_energy",
    stage: "Concept",
    location: "EU",
    version: 1,
    status: AssessmentStatus.COMPLETED,
    input_type: InputType.DOCUMENT,
    isExample: true,

    cover: {
      technologyName: "HelioGen Solar",
      technologySubtitle: "Spray-on Perovskite Photovoltaics",
      clientName: "EcoEnergy Labs",
      inventorName: "Dr. Hans Richter",
      reportDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      reportId: "ICS-2024-5591",
      contactEmail: "h.richter@heliogen.eu"
    },

    executiveSummary: {
      riskProfile: {
        aggregateScore: 82, // Very High Risk
        riskLevel: "high",
        tier1Count: 3,
        tier2Count: 2,
        tier3Count: 0,
        summaryParagraph: "HelioGen proposes a revolutionary spray-on solar coating, but the Technology Readiness Level (TRL) is extremely low (TRL 2). While the theoretical efficiency is high (28%), the material stability is unproven, with degradation occurring within 48 hours in lab tests. Furthermore, the manufacturing process requires toxic solvents (Lead Iodide) which may face regulatory bans in the EU. Finacially, the CapEx required to build a pilot line is estimated at $50M, making this a poor fit for standard VC. This requires government grants or deep-tech patient capital.",
        scoringBreakdown: {
          technicalScore: 30,
          ipScore: 70,
          marketScore: 80,
          regulatoryScore: 20,
          financialScore: 40,
          appliedWeights: { tech: 0.30, ip: 0.20, market: 0.15, regulatory: 0.15, financial: 0.20 }
        }
      },
      criticalConcerns: [
        {
          title: "Material Instability",
          what: "Perovskite structure degrades in humidity.",
          whyItMatters: "Product lifespan is currently < 1 week. Commercial solar requires 25 years.",
          resolution: "Breakthrough in encapsulation needed.",
          tier: 1
        },
        {
          title: "Toxicity Regulation",
          what: "Uses lead-based solvents.",
          whyItMatters: "EU REACH regulations may ban the precursor materials.",
          resolution: "Develop lead-free alternative.",
          tier: 1
        },
        {
          title: "CapEx Intensity",
          what: "Pilot line costs >$50M.",
          whyItMatters: "High burn rate before revenue.",
          resolution: "Partner with glass manufacturer.",
          tier: 1
        }
      ],
      keyStrengths: [
        {
          title: "High Efficiency",
          description: "28% conversion efficiency in lab setting.",
          evidence: "Lab Report"
        },
        {
          title: "Strong Patent Portfolio",
          description: "5 granted patents on the crystal structure.",
          evidence: "EPO Database"
        }
      ],
      commercializationPath: {
        estimatedDevelopmentCost: "$100M",
        timeToMarket: 60,
        keyMilestone: "Stable Prototype (1000 hrs)",
        narrative: "Long-term R&D play. Not venture ready.",
        licensingPotential: "Low"
      },
      dataConfidence: [
        { area: "Tech Viability", evidenceTier: 2, confidenceLevel: "Low", knownGaps: "No outdoor testing." }
      ]
    },

    technologyForensics: {
      overview: {
        paragraph: "A liquid precursor ink that crystallizes into a perovskite solar cell upon annealing. Designed to be sprayed onto architectural glass (BIPV).",
        coreFeatures: [
          { name: "Liquid Ink", description: "Spray coating process." },
          { name: "Transparent", description: "Tunable opacity for windows." }
        ]
      },
      coreTechnology: {
        explanation: "Halide perovskite crystal formation.",
        specifications: [
          { parameter: "Efficiency", value: "28%", benchmark: "22% (Silicon)", notes: "Theoretical max" },
          { parameter: "Lifespan", value: "48 Hours", benchmark: "25 Years", notes: "Critical failure" }
        ]
      },
      claimsMatrix: [
        { claimName: "25 Year Lifespan", inventorAssertion: "Based on accelerated aging models", evidence: "Models not validated for this chemistry.", validationSource: "Paper Review", evidenceTier: 1, confidence: "Unvalidated" }
      ],
      technicalRisks: [
        { component: "Encapsulation", riskLevel: "high", description: "Water vapor ingress destroys crystal.", mitigation: "Atomic Layer Deposition (ALD)." }
      ],
      trlAssessment: {
        overallTrl: 2,
        overallAssessment: "Technology concept formulated. Proof of concept in controlled atmosphere only.",
        subsystems: [
          { name: "Ink Chemistry", trl: 3, status: "Lab", evidence: "Vials", gapToTrl6: "Scale up" },
          { name: "Coating Process", trl: 2, status: "Concept", evidence: "None", gapToTrl6: "Pilot Line" }
        ]
      },
      validationGaps: {
        intro: "Need outdoor durability data.",
        gaps: []
      }
    },

    ipDeepDive: {
      searchMethodology: {
        intro: "Chemical structure search.",
        components: [],
        gaps: "N/A"
      },
      classificationAnalysis: "Strong protection on the specific lead-halide ratio.",
      classificationCodes: [],
      whitespace: {
        intro: "N/A",
        description: "N/A",
        evidence: "N/A",
        strategicPartnerships: { licensingTargets: "Saint-Gobain", partnershipModel: "Joint Venture", rationale: "Manufacturing capabilities" }
      },
      blockingPatents: [],
      ftoAssessment: {
        components: [],
        overallAssessment: "Strong IP position, but tech doesn't work yet."
      },
      filingStrategy: {
        phases: [],
        priorityClaims: "N/A",
        patentProtect: ["Crystal Lattice"],
        tradeSecrets: ["Annealing Temp"]
      }
    },

    marketDynamics: {
      marketSizeAnalysis: {
        totalAddressableMarket: "$50B",
        serviceableAvailableMarket: "$500M",
        serviceableObtainableMarket: "$5M",
        cagr: "25%",
        forecastPeriod: "2030-2040",
        keyDrivers: ["Green Building Mandates"],
        marketTrends: []
      },
      graveyard: {
        intro: "Solar is capital intensive.",
        failedProducts: [
          { name: "Solyndra", company: "Solyndra", timeline: "2011", failureMode: "Price Competition", lesson: "Silicon is cheap." }
        ]
      },
      zombieCompetitors: {
        intro: "",
        companies: []
      },
      competitiveLandscape: [],
      featureComparison: [],
      gapAnalysis: { intro: "", gaps: [], unmetDemandEvidence: "" },
      beachheadMarket: {
        profile: "Skyscrapers",
        painPoint: "Energy efficiency",
        toleranceReason: "Aesthetics",
        marketSize: "$1B",
        expansionPath: "Residential Windows"
      },
      customerAcquisition: [],
      monetization: {
        pricingAnalysis: [{ category: "Hardware", priceRange: "$500/sqm", valueProposition: "Energy generating glass" }]
      }
    },

    regulatoryPathway: {
      classification: {
        intro: "Chemical Safety Regulations.",
        regulatoryClassification: "REACH",
        pathway: "Chemical Registration",
        timelineEstimate: "2 Years",
        standards: ["IEC 61215"]
      },
      comparableSystems: [],
      timelineCost: [],
      recentDevelopments: { intro: "N/A", developments: [] },
      risks: []
    },

    financialRoadmap: {
      actionPlan: [],
      budgetFramework: [],
      unitEconomics: {
        bom: [],
        totalCogs: "Unknown",
        cogsVolume: "N/A",
        targetAsp: "N/A",
        grossMargin: "Unknown",
        breakevenUnits: "N/A"
      },
      fundingRequirements: {
        seed: { amount: "$5M", useOfFunds: ["Lab Equipment"], sources: "Grants" },
        seriesA: { amount: "$50M", useOfFunds: ["Pilot Line"], trigger: "Stable Prototype" }
      },
      teamGaps: []
    },

    strategicRecommendations: {
      priorityActions: [
        { action: "Solve Stability", owner: "CSO", timeline: "Year 1-2", budget: "$2M" }
      ],
      partnerships: [],
      alternativePathways: { intro: "", alternatives: [] },
      goNoGoFramework: { checkpointTimeline: "12 Months", goCriteria: ["1000 hr stability"], noGoCriteria: ["Continued degradation"] },
      monitoringMetrics: [],
      riskIndicators: [],
      ttoSynthesis: {
        insightNarrative: "HelioGen is a classic 'Science Project'—high potential impact but commercially immature (TRL 2). The material stability issues are fundamental physics problems that have plagued the perovskite field for a decade. Investing now is betting on a scientific breakthrough, not a business execution. \n\nFurthermore, the reliance on toxic lead precursors creates a binary regulatory risk in the EU market. \n\nRecommendation: Do not invest equity. Support via non-dilutive grant funding only until TRL 5 is achieved. Monitor competitors (Oxford PV) who are closer to solving the stability challenge.",
        keyRecommendations: [
          { title: "Seek Grant Funding", description: "Apply for ARPA-E / Horizon Europe.", priority: "Critical" },
          { title: "Lead-Free R&D", description: "Pivot chemistry to non-toxic alternatives.", priority: "High" }
        ]
      }
    },

    productConcept: {
      imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf2f24f?auto=format&fit=crop&q=80&w=2070",
      prompt: "Modern skyscraper with transparent solar windows, sunset reflection, green energy city, futuristic architecture"
    }
  }
];
