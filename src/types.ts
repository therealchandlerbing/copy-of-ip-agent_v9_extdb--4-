
export enum AssessmentStatus {
  DRAFT = 'Draft',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  FAILED = 'Failed'
}

export enum InputType {
  DOCUMENT = 'document',
  QUESTIONNAIRE = 'questionnaire',
  HYBRID = 'hybrid'
}

// --- Innovation Compass Report Schema ---

export interface CoverSection {
  technologyName: string;
  technologySubtitle: string;
  clientName: string;
  inventorName: string;
  reportDate: string;
  reportId: string;
  contactEmail: string;
}

export interface ScoringBreakdown {
  technicalScore: number; // 0-100
  ipScore: number;        // 0-100
  marketScore: number;    // 0-100
  regulatoryScore: number;// 0-100
  financialScore: number; // 0-100
  appliedWeights: {
    tech: number;
    ip: number;
    market: number;
    regulatory: number;
    financial: number;
  };
}

export interface ExecutiveSummary {
  riskProfile: {
    aggregateScore: number;
    riskLevel: 'low' | 'moderate' | 'elevated' | 'high';
    tier1Count: number;
    tier2Count: number;
    tier3Count: number;
    summaryParagraph: string;
    scoringBreakdown?: ScoringBreakdown; // New deterministic scoring data
  };
  criticalConcerns: {
    title: string;
    what: string;
    whyItMatters: string;
    resolution: string;
    tier: 1 | 2;
  }[];
  keyStrengths: {
    title: string;
    description: string;
    evidence: string;
  }[];
  commercializationPath: { // Renamed from capitalEfficiency
    estimatedDevelopmentCost: string; // was seedFundingAmount
    timeToMarket: number; // was runwayMonths
    keyMilestone: string;
    narrative: string;
    licensingPotential: 'High' | 'Medium' | 'Low';
  };
  dataConfidence: {
    area: string;
    evidenceTier: number; // 1-4
    confidenceLevel: 'High' | 'Medium' | 'Low';
    knownGaps: string;
  }[];
}

export interface TechnologyForensics {
  overview: {
    paragraph: string;
    coreFeatures: { name: string; description: string }[];
  };
  coreTechnology: { // Renamed from mechanism
    explanation: string;
    specifications: {
      parameter: string;
      value: string;
      benchmark: string;
      notes: string;
    }[];
  };
  claimsMatrix: {
    claimName: string;
    inventorAssertion: string;
    evidence: string;
    validationSource: string;
    evidenceTier: number; // 1-4
    confidence: 'High' | 'Medium' | 'Low' | 'Unvalidated';
  }[];
  technicalRisks: {
    component: string;
    riskLevel: 'high' | 'medium' | 'low';
    description: string;
    mitigation: string;
  }[];
  trlAssessment: {
    overallTrl: number; // 1-9
    overallAssessment: string;
    subsystems: {
      name: string;
      trl: number; // 1-9
      status: string;
      evidence: string;
      gapToTrl6: string;
    }[];
  };
  validationGaps: {
    intro: string;
    gaps: {
      name: string;
      requiredTesting: string;
      estimatedCost: string;
      timeline: string;
      priority: 'high' | 'medium' | 'low';
    }[];
  };
}

export interface IpDeepDive {
  searchMethodology: {
    intro: string;
    components: {
      component: string;
      searchTerms: string;
      databases: string;
      dateRange: string;
      resultsCount: string;
    }[];
    gaps: string;
  };
  classificationAnalysis: string;
  classificationCodes: {
    code: string;
    description: string;
    strategicImplication: string;
  }[];
  whitespace: {
    intro: string;
    description: string;
    evidence: string;
    strategicPartnerships: {
      licensingTargets: string;
      partnershipModel: string;
      rationale: string;
    };
  };
  blockingPatents: {
    patentNumber: string;
    holder: string;
    expiration: string;
    relevance: string;
    ftoRisk: 'high' | 'medium' | 'low';
    claimsCoverage: string;
    differentiationOpportunity: string;
  }[];
  ftoAssessment: {
    components: {
      component: string;
      riskLevel: 'high' | 'medium' | 'low' | 'zero';
      blockingPatents: string;
      mitigation: string;
    }[];
    overallAssessment: string;
  };
  filingStrategy: {
    phases: {
      name: string;
      timeline: string;
      focus: string;
      cost: string;
      details: string;
    }[];
    priorityClaims: string;
    patentProtect: string[];
    tradeSecrets: string[];
  };
}

export interface MarketDynamics {
  marketSizeAnalysis: {
    totalAddressableMarket: string;
    serviceableAvailableMarket: string;
    serviceableObtainableMarket: string;
    cagr: string;
    forecastPeriod: string;
    keyDrivers: string[];
    marketTrends: { trend: string; impact: string }[];
  };
  graveyard: {
    intro: string;
    failedProducts: {
      name: string;
      company: string;
      timeline: string;
      failureMode: string;
      lesson: string;
    }[];
  };
  zombieCompetitors: {
    intro: string;
    companies: {
      name: string;
      lastUpdate: string;
      warningSigns: string;
      implication: string;
    }[];
  };
  competitiveLandscape: {
    name: string;
    segment: string;
    geography: string;
    valueProposition: string;
    vulnerability: string;
    status: 'Active' | 'Zombie' | 'Exited';
  }[];
  featureComparison: { // New Feature Matrix
    feature: string;
    us: boolean;
    competitor: boolean;
    advantage: string;
  }[];
  gapAnalysis: {
    intro: string;
    gaps: string[];
    unmetDemandEvidence: string;
  };
  beachheadMarket: {
    profile: string;
    painPoint: string;
    toleranceReason: string;
    marketSize: string;
    expansionPath: string;
  };
  customerAcquisition: {
    milestone: string;
    strategy: string;
    channels: string;
    timeline: string;
  }[];
  monetization: {
    pricingAnalysis: {
      category: string;
      priceRange: string;
      valueProposition: string;
    }[];
  };
}

export interface RegulatoryPathway {
  classification: {
    intro: string;
    regulatoryClassification: string; // Generalized from deviceClass
    pathway: string;
    timelineEstimate: string;
    standards: string[];
  };
  comparableSystems: { // Generalized from precedents
    productName: string;
    referenceNumber: string;
    approvalDate: string;
    relevance: string;
    reviewTime: string;
  }[];
  timelineCost: {
    phase: string;
    activities: string;
    duration: string;
    cost: string;
  }[];
  recentDevelopments: {
    intro: string;
    developments: {
      title: string;
      date: string;
      impact: string;
    }[];
  };
  risks: {
    title: string;
    description: string;
    mitigation: string;
  }[];
}

export interface FinancialRoadmap {
  actionPlan: {
    months: string;
    phase: string;
    activities: string;
    budget: string;
    milestone: string;
  }[];
  budgetFramework: {
    category: string;
    allocation: string;
    activities: string;
  }[];
  unitEconomics: {
    bom: {
      component: string;
      cost: string;
      supplier: string;
      notes: string;
    }[];
    totalCogs: string;
    cogsVolume: string;
    targetAsp: string;
    grossMargin: string;
    breakevenUnits: string;
  };
  fundingRequirements: { // Can also interpret as Investment/Licensing costs
    seed: {
      amount: string;
      useOfFunds: string[];
      sources: string;
    };
    seriesA: {
      amount: string;
      useOfFunds: string[];
      trigger: string;
    };
  };
  teamGaps: {
    role: string;
    priority: 'high' | 'medium' | 'low';
    timing: string;
    budgetImpact: string;
  }[];
}

export interface StrategicRecommendations {
  priorityActions: {
    action: string;
    owner: string;
    timeline: string;
    budget: string;
  }[];
  partnerships: {
    type: string;
    targets: string;
    valueExchange: string;
    approach: string;
  }[];
  alternativePathways: {
    intro: string;
    alternatives: {
      name: string;
      description: string;
      tradeoffs: string;
    }[];
  };
  goNoGoFramework: {
    checkpointTimeline: string;
    goCriteria: string[];
    noGoCriteria: string[];
  };
  monitoringMetrics: {
    category: string;
    metric: string;
    significance: string;
  }[];
  riskIndicators: string[];
  ttoSynthesis?: {
    insightNarrative: string;
    keyRecommendations: {
      title: string;
      description: string;
      priority: 'Critical' | 'High' | 'Medium';
    }[];
  };
}

// Root Report Object
export interface AssessmentReport {
  id: string;
  created_at: string;
  innovation_name: string;
  sector: string;
  stage: string;
  location: string;
  version: number;
  status: AssessmentStatus;
  input_type: InputType;
  isExample?: boolean; // New Flag to separate mock data from live data

  // Sections matching Schema
  cover: CoverSection;
  executiveSummary: ExecutiveSummary;
  technologyForensics: TechnologyForensics;
  ipDeepDive: IpDeepDive;
  marketDynamics: MarketDynamics;
  regulatoryPathway: RegulatoryPathway;
  financialRoadmap: FinancialRoadmap;
  strategicRecommendations: StrategicRecommendations;

  // New Concept Feature
  productConcept?: {
    imageUrl: string;
    prompt: string;
  };

  metadata?: {
    gemini_model: string;
    processing_time_seconds: number;
    completeness_score: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  isThinking?: boolean;
}

// Re-export specific question types for Wizard
export interface Question {
  id: string;
  question: string;
  type: 'short_text' | 'long_text' | 'single_select' | 'multi_select' | 'multi_entry';
  required?: boolean;
  options?: { value: string; label: string }[];
  helper?: string;
  min_entries?: number;
  max_entries?: number;
}
