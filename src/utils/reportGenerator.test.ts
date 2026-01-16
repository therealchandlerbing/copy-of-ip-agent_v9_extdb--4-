
import { describe, it, expect } from 'vitest';
import { generateHtmlReport } from '../utils/reportGenerator';
import { AssessmentReport, AssessmentStatus, InputType } from '../types';

// Minimal mock report to prevent massive boilerplate
const MOCK_REPORT: AssessmentReport = {
    id: 'test-id',
    created_at: '2025-01-01',
    innovation_name: 'Test Innovation',
    sector: 'Test Sector',
    stage: 'Concept',
    location: 'Global',
    version: 1,
    status: AssessmentStatus.COMPLETED,
    input_type: InputType.QUESTIONNAIRE,
    cover: {
        technologyName: 'Test Tech',
        technologySubtitle: 'Subtitle',
        clientName: 'Test Client',
        inventorName: 'John Doe',
        reportDate: 'Jan 1, 2025',
        reportId: 'REF-123',
        contactEmail: 'test@example.com'
    },
    executiveSummary: {
        riskProfile: {
            aggregateScore: 75,
            riskLevel: 'high',
            tier1Count: 2,
            tier2Count: 1,
            tier3Count: 0,
            summaryParagraph: 'Risk summary.',
            scoringBreakdown: { technicalScore: 0, ipScore: 0, marketScore: 0, regulatoryScore: 0, financialScore: 0, appliedWeights: { tech: 0.2, ip: 0.2, market: 0.2, regulatory: 0.2, financial: 0.2 } }
        },
        criticalConcerns: [{ title: 'Concern 1', what: 'What', whyItMatters: 'Why', resolution: 'Fix', tier: 1 }],
        keyStrengths: [{ title: 'Strength 1', description: 'Desc', evidence: 'Proof' }],
        commercializationPath: { estimatedDevelopmentCost: '$1M', timeToMarket: 12, keyMilestone: 'Launch', narrative: 'Path', licensingPotential: 'High' },
        dataConfidence: []
    },
    technologyForensics: {
        overview: { paragraph: 'Tech overview.', coreFeatures: [] },
        coreTechnology: { explanation: 'Core tech.', specifications: [] },
        claimsMatrix: [],
        technicalRisks: [],
        trlAssessment: { overallTrl: 3, overallAssessment: 'TRL 3', subsystems: [] },
        validationGaps: { intro: '', gaps: [] }
    },
    ipDeepDive: {
        searchMethodology: { intro: 'Search', components: [], gaps: '' },
        classificationAnalysis: 'Class analysis',
        classificationCodes: [],
        whitespace: { intro: '', description: 'Whitespace', evidence: '', strategicPartnerships: { licensingTargets: '', partnershipModel: '', rationale: '' } },
        blockingPatents: [{ patentNumber: 'US123', holder: 'Comp', expiration: '2030', relevance: 'High', ftoRisk: 'high', claimsCoverage: 'All', differentiationOpportunity: 'None' }],
        ftoAssessment: { components: [], overallAssessment: 'Risky' },
        filingStrategy: { phases: [], priorityClaims: '', patentProtect: [], tradeSecrets: [] }
    },
    marketDynamics: {
        marketSizeAnalysis: { totalAddressableMarket: '$1B', serviceableAvailableMarket: '$100M', serviceableObtainableMarket: '$10M', cagr: '10%', forecastPeriod: '2030', keyDrivers: [], marketTrends: [] },
        graveyard: { intro: 'Graveyard', failedProducts: [] },
        zombieCompetitors: { intro: '', companies: [] },
        competitiveLandscape: [],
        featureComparison: [],
        gapAnalysis: { intro: '', gaps: [], unmetDemandEvidence: '' },
        beachheadMarket: { profile: 'Beachhead', painPoint: 'Pain', toleranceReason: 'Tol', marketSize: 'Size', expansionPath: 'Path' },
        customerAcquisition: [],
        monetization: { pricingAnalysis: [] }
    },
    regulatoryPathway: {
        classification: { intro: 'Regs', regulatoryClassification: 'Class II', pathway: '510k', timelineEstimate: '12mo', standards: [] },
        comparableSystems: [],
        timelineCost: [],
        recentDevelopments: { intro: '', developments: [] },
        risks: []
    },
    financialRoadmap: {
        actionPlan: [],
        budgetFramework: [],
        unitEconomics: { bom: [], totalCogs: '$50', cogsVolume: '1k', targetAsp: '$100', grossMargin: '50%', breakevenUnits: '5k' },
        fundingRequirements: { seed: { amount: '$2M', useOfFunds: [], sources: '' }, seriesA: { amount: '$10M', useOfFunds: [], trigger: '' } },
        teamGaps: []
    },
    strategicRecommendations: {
        priorityActions: [],
        partnerships: [],
        alternativePathways: { intro: '', alternatives: [] },
        goNoGoFramework: { checkpointTimeline: '', goCriteria: ['Go'], noGoCriteria: ['No'] },
        monitoringMetrics: [],
        riskIndicators: [],
        ttoSynthesis: { insightNarrative: 'Director Memo', keyRecommendations: [] }
    }
};

describe('reportGenerator', () => {
    it('should generate valid HTML with cover data', () => {
        const html = generateHtmlReport(MOCK_REPORT);
        expect(html).toContain('Test Tech');
        expect(html).toContain('Test Client');
        expect(html).toContain('REF-123');
    });

    it('should inject SVG charts', () => {
        const html = generateHtmlReport(MOCK_REPORT);

        // Check for Risk Gauge SVG injection
        expect(html).toContain('<svg width="160" height="160"');
        expect(html).toContain('75</text>'); // The score
        expect(html).toContain('INDEX</text>');

        // Check for Tech Schematic SVG injection
        expect(html).toContain('<svg width="600" height="300"');
        expect(html).toContain('PROCESSING UNIT');
    });

    it('should correctly format markdown content', () => {
        // Create a report with markdown syntax
        const markdownReport = {
            ...MOCK_REPORT,
            executiveSummary: {
                ...MOCK_REPORT.executiveSummary,
                riskProfile: {
                    ...MOCK_REPORT.executiveSummary.riskProfile,
                    summaryParagraph: '> This is a callout block.\n\nAnd specific bold text **here**.'
                }
            }
        };

        const html = generateHtmlReport(markdownReport);

        // Blockquote check
        expect(html).toContain('<blockquote style="border-left: 4px solid #3b82f6;');
        expect(html).toContain('This is a callout block.');

        // Bold check
        expect(html).toContain('<strong>here</strong>');
    });

    it('should render tables with data', () => {
        const html = generateHtmlReport(MOCK_REPORT);
        // Financials table check
        expect(html).toContain('$2M'); // Seed Amount
        expect(html).toContain('US123'); // Patent Number
    });
});
