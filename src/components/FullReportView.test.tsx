
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FullReportView from '../components/FullReportView';
import { AssessmentReport, AssessmentStatus, InputType } from '../types';

// Mock report data again (simplified)
const MOCK_REPORT: AssessmentReport = {
    id: 'test-id',
    created_at: '2025-01-01',
    innovation_name: 'React Tech',
    sector: 'Test Sector',
    stage: 'Concept',
    location: 'Global',
    version: 1,
    status: AssessmentStatus.COMPLETED,
    input_type: InputType.QUESTIONNAIRE,
    cover: {
        technologyName: 'React Tech',
        technologySubtitle: 'Subtitle',
        clientName: 'Test Client',
        inventorName: 'Jane Doe',
        reportDate: 'Jan 1, 2025',
        reportId: 'REF-456',
        contactEmail: 'test@example.com'
    },
    // Populate simplified sections needed for rendering tabs
    executiveSummary: {
        riskProfile: {
            aggregateScore: 88,
            riskLevel: 'high',
            tier1Count: 5,
            tier2Count: 0,
            tier3Count: 0,
            summaryParagraph: 'Summary.',
            scoringBreakdown: { technicalScore: 0, ipScore: 0, marketScore: 0, regulatoryScore: 0, financialScore: 0, appliedWeights: { tech: 0.2, ip: 0.2, market: 0.2, regulatory: 0.2, financial: 0.2 } }
        },
        criticalConcerns: [],
        keyStrengths: [],
        commercializationPath: { estimatedDevelopmentCost: '$1M', timeToMarket: 12, keyMilestone: 'Launch', narrative: 'Path', licensingPotential: 'High' },
        dataConfidence: []
    },
    technologyForensics: {
        overview: { paragraph: 'Forensics overview', coreFeatures: [] },
        coreTechnology: { explanation: '', specifications: [] },
        claimsMatrix: [],
        technicalRisks: [],
        trlAssessment: { overallTrl: 1, overallAssessment: 'TRL 1', subsystems: [] },
        validationGaps: { intro: '', gaps: [] }
    },
    ipDeepDive: {
        searchMethodology: { intro: '', components: [], gaps: '' },
        classificationAnalysis: '', classificationCodes: [], whitespace: { intro: '', description: '', evidence: '', strategicPartnerships: { licensingTargets: '', partnershipModel: '', rationale: '' } },
        blockingPatents: [], ftoAssessment: { components: [], overallAssessment: '' },
        filingStrategy: { phases: [], priorityClaims: '', patentProtect: [], tradeSecrets: [] }
    },
    marketDynamics: {
        marketSizeAnalysis: { totalAddressableMarket: '10B', serviceableAvailableMarket: '1B', cagr: '10%', forecastPeriod: '2030', keyDrivers: [], marketTrends: [] },
        graveyard: { intro: '', failedProducts: [] }, zombieCompetitors: { intro: '', companies: [] }, competitiveLandscape: [], featureComparison: [], gapAnalysis: { intro: '', gaps: [], unmetDemandEvidence: '' }, beachheadMarket: { profile: '', painPoint: '', toleranceReason: '', marketSize: '', expansionPath: '' }, customerAcquisition: [], monetization: { pricingAnalysis: [] }
    },
    regulatoryPathway: { classification: { intro: '', regulatoryClassification: '', pathway: '', timelineEstimate: '', standards: [] }, comparableSystems: [], timelineCost: [], recentDevelopments: { intro: '', developments: [] }, risks: [] },
    financialRoadmap: { actionPlan: [], budgetFramework: [], unitEconomics: { bom: [], totalCogs: '', cogsVolume: '', targetAsp: '', grossMargin: '', breakevenUnits: '' }, fundingRequirements: { seed: { amount: '', useOfFunds: [], sources: '' }, seriesA: { amount: '', useOfFunds: [], trigger: '' } }, teamGaps: [] },
    strategicRecommendations: { priorityActions: [], partnerships: [], alternativePathways: { intro: '', alternatives: [] }, goNoGoFramework: { checkpointTimeline: '', goCriteria: [], noGoCriteria: [] }, monitoringMetrics: [], riskIndicators: [], ttoSynthesis: { insightNarrative: '', keyRecommendations: [] } }
};

describe('FullReportView', () => {
    it('renders the cover page initially', () => {
        render(<FullReportView report={MOCK_REPORT} />);
        expect(screen.getByText('React Tech')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('navigates to Executive Summary tab', async () => {
        render(<FullReportView report={MOCK_REPORT} />);
        // Click the tab - Use getAllByText as there are multiple instances (button + header)
        // The button is in the sidebar, which usually appears first or we can look for the button specifically
        const buttons = screen.getAllByRole('button', { name: /Executive Summary/i });
        fireEvent.click(buttons[0]);

        // Check for content specific to Exec Summary
        // The component renders "Composite Risk Profile" in the executive summary view
        expect(await screen.findByText(/Composite Risk Profile/i)).toBeInTheDocument();
        expect(screen.getByText('88')).toBeInTheDocument(); // The risk score
    });

    it('navigates to Tech Forensics tab', async () => {
        render(<FullReportView report={MOCK_REPORT} />);
        fireEvent.click(screen.getByText('Tech Forensics'));

        // Check for the section header or unique content
        expect(await screen.findByText(/System Architecture/i)).toBeInTheDocument();
        // Also check for "Physics of Failure" which is in the right column
        expect(screen.getByText(/Physics of Failure/i)).toBeInTheDocument();
    });

    it('shows the Print/Export button', () => {
        render(<FullReportView report={MOCK_REPORT} />);
        expect(screen.getByText('Export PDF')).toBeInTheDocument();
    });
});
