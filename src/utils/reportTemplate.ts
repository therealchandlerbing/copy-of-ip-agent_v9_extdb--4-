
export const REPORT_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Innovation Compass Assessment</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* --- DESIGN SYSTEM: "Obsidian & Gold" Premium Theme (Print Optimized) --- */
        :root {
            /* Core Brand Colors */
            --color-primary: #0f172a;      /* Deepest Navy/Slate */
            --color-primary-light: #334155;
            --color-secondary: #0ea5e9;    /* Vivid Sky Blue */
            --color-accent: #d97706;       /* Deep Gold mixed with Amber */
            
            /* Risk Indicators */
            --color-risk-critical: #be123c; /* Rose 700 */
            --color-risk-high: #e11d48;     /* Rose 600 */
            --color-risk-med: #f59e0b;      /* Amber 500 */
            --color-risk-low: #10b981;      /* Emerald 500 */
            --color-neutral: #64748b;
            
            /* Backgrounds */
            --bg-body: #525659;
            --bg-page: #ffffff;
            --bg-subtle: #f8fafc;
            --bg-dark: #1e293b;
            
            /* Borders */
            --border-light: #e2e8f0;
            --border-med: #cbd5e1;
            
            /* Typography */
            --font-display: 'Playfair Display', serif;
            --font-body: 'Inter', sans-serif;
            --font-mono: 'JetBrains Mono', monospace;
        }

        /* --- GLOBAL & PAGE SETUP --- */
        * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        html, body { margin: 0; padding: 0; width: 100%; }
        body { font-family: var(--font-body); background-color: var(--bg-body); font-size: 9pt; color: var(--color-primary-light); line-height: 1.6; }

        .page {
            width: 8.5in; height: 11in; background: var(--bg-page); position: relative;
            margin: 0 auto 20px auto; overflow: hidden; display: flex; flex-direction: column;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        @media print {
            @page { size: 8.5in 11in; margin: 0; }
            body { background: none; -webkit-print-color-adjust: exact; }
            .page { box-shadow: none; margin: 0; page-break-after: always; width: 8.5in; height: 11in; overflow: hidden; }
        }

        /* --- LAYOUT UTILS --- */
        .header { height: 16mm; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--color-primary); margin-top: 10mm; margin-bottom: 8mm; flex-shrink: 0; }
        .content { padding: 0 15mm; flex-grow: 1; overflow: hidden; position: relative; }
        .footer { height: 12mm; padding: 0 15mm; border-top: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; font-size: 7pt; color: var(--color-neutral); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 500; margin-bottom: 8mm; flex-shrink: 0; }

        /* --- TYPOGRAPHY --- */
        h1, h2, h3, h4 { margin: 0; color: var(--color-primary); }
        h1 { font-family: var(--font-display); font-size: 28pt; font-weight: 700; line-height: 1; margin-bottom: 8mm; }
        h2 { font-family: var(--font-display); font-size: 18pt; font-weight: 600; margin-bottom: 4mm; display: flex; align-items: center; gap: 10px; }
        h2::before { content: ''; display: block; width: 4px; height: 18pt; background: var(--color-accent); }
        h3 { font-family: var(--font-body); font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--color-neutral); margin-bottom: 2mm; border-bottom: 1px solid var(--border-light); padding-bottom: 1mm; display: inline-block; }
        p { margin-top: 0; margin-bottom: 4mm; text-align: justify; }

        /* --- COMPONENTS --- */
        .card { background: white; border: 1px solid var(--border-light); padding: 5mm; margin-bottom: 5mm; border-radius: 4px; }
        .card.highlight { background: var(--bg-subtle); border-left: 4px solid var(--color-primary); }
        
        /* Table Styles (Updated for Readability) */
        table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-bottom: 6mm; }
        th { text-align: left; font-weight: 700; text-transform: uppercase; font-size: 7pt; color: var(--color-primary); background-color: var(--bg-subtle); padding: 3mm 2mm; border-bottom: 1px solid var(--color-primary); }
        td { border-bottom: 1px solid var(--border-light); padding: 3mm 2mm; vertical-align: top; }
        
        .badge { display: inline-flex; align-items: center; padding: 2px 6px; border-radius: 4px; font-size: 6.5pt; font-weight: 700; text-transform: uppercase; border: 1px solid transparent; }
        .badge-green { background: #dcfce7; color: #15803d; border-color: #bbf7d0; }
        .badge-amber { background: #fef3c7; color: #b45309; border-color: #fde68a; }
        .badge-red   { background: #ffe4e6; color: #be123c; border-color: #fecdd3; }
        .badge-blue  { background: #e0f2fe; color: #0369a1; border-color: #bae6fd; }
        .badge-slate { background: #f1f5f9; color: #64748b; border-color: #e2e8f0; }

        /* Grid & Stats */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6mm; }
        .stat-card { padding: 4mm; border-left: 2px solid var(--border-light); }
        .stat-val { display: block; font-family: var(--font-display); font-size: 18pt; font-weight: 700; color: var(--color-primary); line-height: 1.1; }
        .stat-lbl { font-size: 7pt; font-weight: 600; text-transform: uppercase; color: var(--color-neutral); letter-spacing: 1px; }

        /* --- SVG CONTAINER --- */
        .svg-container { line-height: 0; margin-bottom: 4mm; }
        .svg-container svg { width: 100%; height: auto; display: block; }
        
        /* --- SECTION COVERS (Glassmorphism Print Fallback) --- */
        .page-section {
            background: radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%);
            display: flex; flex-direction: column; justify-content: center !important; align-items: center !important;
            color: #ffffff; padding: 0 !important; margin: 0 auto !important;
        }
        .section-content {
            text-align: center; width: 130mm; padding: 20mm;
            border: 1px solid rgba(255,255,255,0.2); 
            background: rgba(255,255,255,0.05); /* Print-safe glass */
            box-shadow: 0 20px 50px rgba(0,0,0,0.5); /* Deep shadow */
        }
        .section-num { font-family: var(--font-display); font-size: 80pt; font-weight: 900; color: var(--color-accent); line-height: 1; margin-bottom: 5mm; }
        .section-name { font-family: var(--font-display); font-size: 36pt; font-weight: 700; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 8mm; border-bottom: 1px solid rgba(255,255,255,0.3); display: inline-block; padding-bottom: 4mm; }
        .section-desc { font-family: var(--font-body); font-size: 13pt; font-weight: 300; color: #cbd5e1; max-width: 100mm; margin: 0 auto; }
        .section-watermark { position: absolute; font-family: var(--font-display); font-size: 180pt; font-weight: 900; color: rgba(255,255,255,0.03); z-index: 0; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-10deg); white-space: nowrap; }

        /* --- COVER PAGE --- */
        .page-cover { background: var(--color-primary); color: white; padding: 0; }
        .cover-content { padding: 20mm; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); position: relative; }
        .cover-accent-bar { position: absolute; top: 0; left: 20mm; width: 4px; height: 40mm; background: var(--color-accent); }
        .cover-title { font-family: var(--font-display); font-size: 42pt; font-weight: 600; line-height: 1.1; margin-bottom: 5mm; }
        .cover-subtitle { font-family: var(--font-body); font-size: 14pt; font-weight: 300; color: #94a3b8; max-width: 80%; }
        .cover-meta { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15mm; padding-top: 10mm; border-top: 1px solid rgba(255,255,255,0.15); }
        .meta-item label { display: block; font-size: 7pt; text-transform: uppercase; letter-spacing: 2px; color: #64748b; margin-bottom: 2mm; }
        .meta-item div { font-size: 11pt; color: white; font-family: var(--font-display); }

        /* --- TOC --- */
        .toc-item { display: flex; align-items: baseline; margin-bottom: 4mm; border-bottom: 1px dotted var(--border-med); padding-bottom: 1mm; }
        .toc-num { width: 30px; color: var(--color-accent); font-weight: 700; font-family: var(--font-mono); }
        .toc-name { flex: 1; font-weight: 600; color: var(--color-primary); }
        .toc-page { color: var(--color-neutral); font-family: var(--font-mono); }
        
        /* --- MARKDOWN OVERRIDES --- */
        .markdown-content p { margin-bottom: 8px; font-size: 9pt; }
        .markdown-content ul { padding-left: 18px; margin-bottom: 8px; }
        .markdown-content li { margin-bottom: 4px; }
        .markdown-content strong { color: var(--color-primary); font-weight: 700; }
        /* Custom Blockquote/Callout */
        .callout-block { background: var(--bg-subtle); border-left: 3px solid var(--color-secondary); padding: 10px; margin: 10px 0; font-style: italic; color: var(--color-primary-light); }

    </style>
</head>
<body>

    <!-- COVER PAGE (Page 1) -->
    <div class="page page-cover">
        <div class="cover-content">
            <div class="cover-accent-bar"></div>
            <div style="width: 100%;">
                <div style="display:flex; justify-content:space-between; margin-bottom: 20mm; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5mm;">
                    <div style="font-size:8pt; letter-spacing:3px; text-transform:uppercase; color:#cbd5e1; font-weight:600;">Arcus Innovation Compass</div>
                    <div style="font-size:8pt; letter-spacing:3px; text-transform:uppercase; color:#94a3b8;">Confidential & Proprietary</div>
                </div>
                <div class="cover-title">{{TECHNOLOGY_NAME}}</div>
                <div class="cover-subtitle">{{TECHNOLOGY_SUBTITLE}}</div>
            </div>
            <div class="cover-meta">
                <div class="meta-item"><label>Prepared For</label><div>{{CLIENT_NAME}}</div></div>
                <div class="meta-item"><label>Date of Issue</label><div>{{REPORT_DATE}}</div></div>
                <div class="meta-item"><label>Lead Inventor</label><div>{{INVENTOR_NAME}}</div></div>
                <div class="meta-item"><label>Reference ID</label><div style="font-family:var(--font-mono); font-size:9pt; color:#94a3b8;">{{REPORT_ID}}</div></div>
            </div>
        </div>
    </div>

    <!-- TOC (Page 2) -->
    <div class="page">
        <div class="header">
            <div>
                <div style="font-size:14pt; font-weight:700; color:var(--color-primary); font-family:var(--font-display);">Table of Contents</div>
                <div style="font-size:7pt; text-transform:uppercase; letter-spacing:1px; color:var(--color-neutral); margin-top:2px;">Navigation Guide</div>
            </div>
            <div style="font-size:7pt; color:var(--color-neutral); text-transform:uppercase; letter-spacing:1px;">Arcus Innovation Compass</div>
        </div>
        <div class="content" style="display: flex; flex-direction: column; justify-content: center;">
            <div style="max-width: 150mm; margin-left: 10mm;">
                <div class="toc-item"><span class="toc-num">01</span><span class="toc-name">Executive Summary</span><span class="toc-page">03</span></div>
                <div class="toc-item"><span class="toc-num">02</span><span class="toc-name">Technology Forensics</span><span class="toc-page">08</span></div>
                <div class="toc-item"><span class="toc-num">03</span><span class="toc-name">IP Deep Dive</span><span class="toc-page">15</span></div>
                <div class="toc-item"><span class="toc-num">04</span><span class="toc-name">Market Dynamics</span><span class="toc-page">21</span></div>
                <div class="toc-item"><span class="toc-num">05</span><span class="toc-name">Regulatory & Compliance</span><span class="toc-page">28</span></div>
                <div class="toc-item"><span class="toc-num">06</span><span class="toc-name">Financial Roadmap</span><span class="toc-page">31</span></div>
                <div class="toc-item"><span class="toc-num">07</span><span class="toc-name">Strategic Outlook</span><span class="toc-page">35</span></div>
                <div class="toc-item"><span class="toc-num">08</span><span class="toc-name">Director's Insights</span><span class="toc-page">38</span></div>
                <div class="toc-item"><span class="toc-num">09</span><span class="toc-name">Appendix</span><span class="toc-page">41</span></div>
            </div>
        </div>
        <div class="footer"><span>Confidential Assessment</span><span>Page 02</span></div>
    </div>

    <!-- SECTION 01 (Page 3) -->
    <div class="page page-section">
        <div class="section-watermark">01</div>
        <div class="section-content">
            <div class="section-num">01</div>
            <div class="section-name">Executive Summary</div>
            <div class="section-desc">Strategic overview of risk, strengths, and commercial viability.</div>
        </div>
    </div>

    <!-- 1.1 RISK PROFILE (Page 4) -->
    <div class="page">
        <div class="header">
            <h3>Executive Summary</h3>
            <div style="font-family:var(--font-display); font-size:11pt; color:var(--color-primary);">1.1 Risk Profile</div>
        </div>
        <div class="content">
            <div style="display: flex; align-items: center; gap: 30px; margin-bottom: 8mm; background: var(--bg-subtle); padding: 8mm; border-radius: 4px;">
                <!-- SVG GAUGE PLACEHOLDER -->
                <div class="svg-container" style="width: 120px; height: 120px; flex-shrink: 0; margin-bottom:0;">
                    {{RISK_GAUGE_SVG}}
                </div>
                
                <div style="flex: 1;">
                    <div style="font-size:7pt; font-weight:700; color:var(--color-neutral); text-transform:uppercase; margin-bottom:5px;">Composite Status</div>
                    <div style="font-family:var(--font-display); font-size:24pt; font-weight:700; color:var(--color-primary); margin-bottom:5px; line-height:1;">{{RISK_LEVEL_TEXT}}</div>
                    <div style="font-size:9pt; color:var(--color-primary-light);">{{RISK_COUNTS_TEXT}}</div>
                </div>
                <div style="border-left:1px solid var(--border-med); padding-left:8mm; max-width: 40%;">
                    <div style="font-size:7pt; font-weight:700; color:var(--color-accent); text-transform:uppercase; margin-bottom:3px;">Advisor Note</div>
                    <p style="font-size:8pt; font-style:italic; margin:0; color:var(--color-primary-light);">"Instant snapshot of technical and market viability based on {{RISK_SCORE}} distinct data points."</p>
                </div>
            </div>
            
            <div style="display: flex; align-items: baseline; margin-bottom: 4mm; border-bottom: 2px solid var(--color-primary); padding-bottom: 2mm;">
                <h2 style="margin:0; border:none; padding:0; font-size:14pt;">Executive Narrative</h2>
            </div>
            <div style="column-count: 2; column-gap: 8mm;">
                <div class="markdown-content">{{RISK_SUMMARY_TEXT}}</div>
            </div>
        </div>
        <div class="footer"><span>Confidential</span><span>Page 04</span></div>
    </div>

    <!-- 1.2 RED FLAGS (Page 5) -->
    <div class="page">
        <div class="header"><div>Executive Summary</div><div>1.2 Red Flags</div></div>
        <div class="content">
            <h2>Critical Red Flags (Tier 1)</h2>
            <p style="margin-bottom: 8mm; font-style: italic;">Issues that threaten patentability or commercial viability.</p>
            {{CRITICAL_CONCERNS_BLOCK}}
        </div>
        <div class="footer"><span>Confidential</span><span>Page 05</span></div>
    </div>

    <!-- 1.3 STRENGTHS (Page 6) -->
    <div class="page">
        <div class="header"><div>Executive Summary</div><div>1.3 Key Strengths</div></div>
        <div class="content">
            <h2>Key Strengths</h2>
            <p style="margin-bottom: 8mm;">Differentiating factors that provide an unfair market advantage.</p>
            {{KEY_STRENGTHS_BLOCK}}
        </div>
        <div class="footer"><span>Confidential</span><span>Page 06</span></div>
    </div>

    <!-- 1.4 COMMERCIALIZATION (Page 7) -->
    <div class="page">
        <div class="header"><div>Executive Summary</div><div>1.4 Commercialization Path</div></div>
        <div class="content">
            <h2>Path to Market</h2>
            <div class="grid-3" style="margin-bottom: 10mm;">
                <div class="stat-card"><span class="stat-val">{{SEED_REQ}}</span><span class="stat-lbl">Est. Dev Cost</span></div>
                <div class="stat-card"><span class="stat-val">{{RUNWAY}} mo</span><span class="stat-lbl">Time to Market</span></div>
                <div class="stat-card"><span class="stat-val" style="font-size:12pt;">{{MILESTONE}}</span><span class="stat-lbl">Key Milestone</span></div>
            </div>
            <div class="card highlight" style="margin-bottom: 10mm;">
                <p style="font-style: italic; font-size: 10pt; color: #475569; margin: 0;">"{{CAPITAL_NARRATIVE}}"</p>
            </div>
            <h2>Data Confidence</h2>
            <table>
                <thead><tr><th>Area</th><th>Evidence Quality</th><th>Confidence</th><th>Known Gaps</th></tr></thead>
                <tbody>{{DATA_CONFIDENCE_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer"><span>Confidential</span><span>Page 07</span></div>
    </div>

    <!-- SECTION 02 (Page 8) -->
    <div class="page page-section">
        <div class="section-watermark">02</div>
        <div class="section-content">
            <div class="section-num">02</div>
            <div class="section-name">Technology Forensics</div>
            <div class="section-desc">Deep-dive technical due diligence, core technology validation, and TRL.</div>
        </div>
    </div>

    <!-- 2.1 OVERVIEW & SCHEMATIC (Page 9) -->
    <div class="page">
        <div class="header">
            <h3>Tech Forensics</h3>
            <div style="font-family:var(--font-display); font-size:11pt; color:var(--color-primary);">2.1 Architecture</div>
        </div>
        <div class="content">
            <!-- SCHEMATIC PLACEHOLDER -->
            <div class="card" style="background:#1e293b; color:white; border:none; margin-bottom:8mm;">
                <h3 style="border:none; margin-bottom:2mm; color:#94a3b8;">System Architecture</h3>
                <div class="svg-container" style="height: 200px; background: rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:4px; display:flex; align-items:center; justify-content:center;">
                    <!-- SVG LOGIC MAP -->
                    {{TECH_SCHEMATIC_SVG}}
                </div>
                <div class="markdown-content" style="color:#e2e8f0; font-size:8.5pt;">{{TECH_OVERVIEW}}</div>
            </div>
            
            <div class="grid-2">
                <div>
                    <h3 style="margin-bottom:4mm;">Core Features</h3>
                    <ul style="padding-left:14px; margin:0;" class="markdown-content">{{CORE_FEATURES}}</ul>
                </div>
                <div style="background:var(--bg-subtle); padding:5mm; border-radius:4px; border:1px solid var(--border-light);">
                    <h3 style="margin-bottom:4mm;">Differentiation</h3>
                    <p style="font-size:8.5pt; color:var(--color-neutral);">Architectural decisions providing competitive separation:</p>
                    <ul style="padding-left:14px; color:var(--color-primary-light); font-size:8.5pt;">
                        <li><strong style="color:var(--color-primary);">Modular Design:</strong> Allows for rapid scalability.</li>
                        <li><strong style="color:var(--color-primary);">Audit Trail:</strong> Immutable logging built-in.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer"><span>Confidential</span><span>Page 09</span></div>
    </div>

    <!-- 2.2 CORE TECHNOLOGY (Page 10) -->
    <div class="page">
        <div class="header"><div>Tech Forensics</div><div>2.2 Core Tech</div></div>
        <div class="content">
            <h2>Mechanism of Action</h2>
            <div class="markdown-content" style="margin-bottom:8mm;">{{MECHANISM_EXPLANATION}}</div>
            
            <h2>Technical Specifications</h2>
            <table>
                <thead><tr><th>Parameter</th><th>Value</th><th>Benchmark (SOTA)</th><th>Notes</th></tr></thead>
                <tbody>{{SPECS_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer"><span>Confidential</span><span>Page 10</span></div>
    </div>

    <!-- 2.3 CLAIMS MATRIX (Page 11) -->
    <div class="page">
        <div class="header"><div>Tech Forensics</div><div>2.3 Claims Validation</div></div>
        <div class="content">
            <h2>Inventor Claims Matrix</h2>
            <p style="margin-bottom:6mm;"> rigorous verification of key performance assertions.</p>
            <table>
                <thead><tr><th style="width:40%;">Claim / Assertion</th><th>Tier</th><th>Source</th><th>Confidence</th></tr></thead>
                <tbody>{{CLAIMS_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer"><span>Confidential</span><span>Page 11</span></div>
    </div>

    <!-- 2.4 RISKS (Page 12) -->
    <div class="page">
        <div class="header"><div>Tech Forensics</div><div>2.4 Physics of Failure</div></div>
        <div class="content">
            <h2 style="color:var(--color-risk-high);">Technical Risks</h2>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                {{FULL_RISK_ROWS}}
            </div>
        </div>
        <div class="footer"><span>Confidential</span><span>Page 12</span></div>
    </div>

    <!-- 2.5a TRL (Page 13) -->
    <div class="page">
        <div class="header"><div>Tech Forensics</div><div>2.5 Readiness Level</div></div>
        <div class="content">
            <div style="display:flex; justify-content:space-between; align-items:end; margin-bottom:8mm; background:var(--bg-subtle); padding:6mm; border-bottom:4px solid var(--color-risk-low);">
                <div>
                    <div style="font-size:8pt; text-transform:uppercase; color:var(--color-neutral); font-weight:700;">Overall Status</div>
                    <div style="font-size:32pt; font-weight:900; color:var(--color-primary); line-height:1;">TRL {{OVERALL_TRL}}</div>
                </div>
                <div style="text-align:right; max-width:60%;">
                    <div style="font-size:8pt; text-transform:uppercase; color:var(--color-neutral); font-weight:700; margin-bottom:4px;">Assessment</div>
                    <div style="font-style:italic; font-size:9pt; color:var(--color-primary-light);">"{{TRL_NARRATIVE}}"</div>
                </div>
            </div>
            
            <h2>Subsystem Breakdown</h2>
            <table>
                <thead><tr><th>Subsystem</th><th>TRL</th><th>Status</th></tr></thead>
                <tbody>{{TRL_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer"><span>Confidential</span><span>Page 13</span></div>
    </div>

    <!-- 2.5b VALIDATION GAPS (Page 14) -->
    <div class="page">
        <div class="header"><div>Tech Forensics</div><div>2.5 Readiness Level (Cont.)</div></div>
        <div class="content">
            <h2>Validation Gaps</h2>
            <p style="margin-bottom: 6mm;">Critical testing required to advance TRL.</p>
            <table>
                <thead><tr><th>Gap</th><th>Required Test</th><th>Cost & Timeline</th></tr></thead>
                <tbody>{{VALIDATION_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer"><span>Confidential</span><span>Page 14</span></div>
    </div>

    <!-- SECTION 03 (Page 15) -->
    <div class="page page-section">
        <div class="section-watermark">03</div>
        <div class="section-content">
            <div class="section-num">03</div>
            <div class="section-name">IP Deep Dive</div>
            <div class="section-desc">Freedom-to-operate analysis, patent landscape, and strategy.</div>
        </div>
    </div>

    <!-- 3.1 METHODOLOGY (Page 16) -->
    <div class="page">
        <div class="header"><div>IP Deep Dive</div><div>3.1 Search Strategy</div></div>
        <div class="content">
            <h2>Search Methodology</h2>
            <div class="markdown-content">{{IP_METHODOLOGY}}</div>
            <table>
                <thead><tr><th>Component</th><th>Keywords / Terms</th><th>Databases</th><th>Hits</th></tr></thead>
                <tbody>{{IP_SEARCH_ROWS}}</tbody>
            </table>
            
            <h2 style="margin-top:8mm;">Classification Analysis</h2>
            <div class="markdown-content" style="margin-bottom:6mm;">{{IP_CLASSIFICATION_NARRATIVE}}</div>
            <table>
                <thead><tr><th>Code</th><th>Description</th><th>Strategic Implication</th></tr></thead>
                <tbody>{{IP_CLASS_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer"><span>Confidential</span><span>Page 16</span></div>
    </div>

    <!-- 3.2 WHITESPACE (Page 17) -->
    <div class="page">
        <div class="header"><div>IP Deep Dive</div><div>3.2 Whitespace</div></div>
        <div class="content">
            <h2>White Space Analysis</h2>
            <div class="markdown-content">{{WHITESPACE_TEXT}}</div>
            
            <div class="card highlight" style="margin-top:8mm;">
                <h3>Strategic Partnerships</h3>
                <div class="grid-3" style="margin-top:4mm;">
                    <div><span class="stat-lbl">Targets</span><br/><strong>{{WHITESPACE_TARGETS}}</strong></div>
                    <div><span class="stat-lbl">Model</span><br/><strong>{{WHITESPACE_MODEL}}</strong></div>
                    <div><span class="stat-lbl">Rationale</span><br/><span style="font-size:8pt;">{{WHITESPACE_RATIONALE}}</span></div>
                </div>
            </div>
        </div>
        <div class="footer"><span>Confidential</span><span>Page 17</span></div>
    </div>

    <!-- 3.3 BLOCKING (Page 18) -->
    <div class="page">
        <div class="header"><div>IP Deep Dive</div><div>3.3 Blocking Patents</div></div>
        <div class="content">
            <h2 style="color:var(--color-risk-critical);">Freedom-to-Operate Risks</h2>
            <p style="margin-bottom:8mm;">High-priority patents identified as potential blocking art.</p>
            {{BLOCKING_PATENTS_PAGE_1}}
        </div>
        <div class="footer"><span>Confidential</span><span>Page 18</span></div>
    </div>

    <!-- 3.3 BLOCKING (Page 19) -->
    <div class="page">
        <div class="header"><div>IP Deep Dive</div><div>3.3 Blocking Patents (Cont.)</div></div>
        <div class="content">
            <h2 style="color:var(--color-risk-critical);">Freedom-to-Operate Risks</h2>
            {{BLOCKING_PATENTS_PAGE_2}}
        </div>
        <div class="footer"><span>Confidential</span><span>Page 19</span></div>
    </div>

    <!-- 3.4 FTO & STRATEGY (Page 20) -->
    <div class="page">
        <div class="header"><div>IP Deep Dive</div><div>3.4 Strategy</div></div>
        <div class="content">
           <h2>FTO Assessment</h2>
           <table>
               <thead><tr><th>Component</th><th>Risk Level</th><th>Mitigation Strategy</th></tr></thead>
               <tbody>{{FTO_ROWS}}</tbody>
           </table>
           
           <h2 style="margin-top:10mm;">Filing Strategy</h2>
           <p>{{FILING_STRATEGY_DESC}}</p>
           <div style="margin-top:6mm;">
               {{FILING_PHASES}}
           </div>
        </div>
        <div class="footer"><span>Confidential</span><span>Page 20</span></div>
    </div>

    <!-- SECTION 04 (Page 21) -->
    <div class="page page-section">
        <div class="section-watermark">04</div>
        <div class="section-content">
            <div class="section-num">04</div>
            <div class="section-name">Market Dynamics</div>
            <div class="section-desc">Size, trends, competition, and graveyard analysis.</div>
        </div>
    </div>

    <!-- 4.1 Market Sizing (Page 22) -->
    <div class="page">
        <div class="header"><div>Market Dynamics</div><div>4.1 Market Sizing</div></div>
        <div class="content">
            <h2>Market Opportunity</h2>
            <div class="grid-2" style="margin-bottom:8mm;">
                <div class="stat-card" style="background:var(--bg-subtle);">
                    <span class="stat-lbl">TAM (Total Addressable)</span>
                    <span class="stat-val" style="font-size:24pt;">{{TAM}}</span>
                    <span class="badge badge-blue">Global</span>
                </div>
                <div class="stat-card" style="background:var(--bg-subtle);">
                    <span class="stat-lbl">SAM (Serviceable)</span>
                    <span class="stat-val" style="font-size:24pt;">{{SAM}}</span>
                    <span class="badge badge-green">Target</span>
                </div>
            </div>
            
            <div style="margin-top:8mm; padding:5mm; background:var(--bg-subtle); border-radius:4px;">
                <div style="display:flex; justify-content:space-between;">
                    <div><span class="stat-lbl">CAGR</span><br/><strong>{{CAGR}}</strong></div>
                    <div><span class="stat-lbl">Forecast Period</span><br/><strong>{{FORECAST}}</strong></div>
                </div>
            </div>
        </div>
        <div class="footer"><span>Confidential</span><span>Page 22</span></div>
    </div>

    <!-- 4.2 Market Trends (Page 23) -->
    <div class="page">
        <div class="header"><div>Market Dynamics</div><div>4.2 Trends & Drivers</div></div>
        <div class="content">
            <div class="grid-2">
                <div>
                     <h3>Key Drivers</h3>
                     <ul class="clean-list">{{DRIVERS_LIST}}</ul>
                </div>
                <div>
                     <h3>Market Trends</h3>
                     <ul class="clean-list">{{TRENDS_LIST}}</ul>
                </div>
            </div>
        </div>
        <div class="footer"><span>Confidential</span><span>Page 23</span></div>
    </div>

    <!-- 4.3 Graveyard (Page 24) -->
    <div class="page">
        <div class="header"><div>Market Dynamics</div><div>4.3 The Graveyard</div></div>
        <div class="content">
            <h2 style="color:var(--color-risk-med);">Failures & Lessons</h2>
            <div class="markdown-content" style="margin-bottom:6mm;">{{GRAVEYARD_INTRO}}</div>
            {{GRAVEYARD_BLOCK}}
        </div>
        <div class="footer"><span>Confidential</span><span>Page 24</span></div>
    </div>

    <!-- 4.4 Competition P1 (Page 25) -->
    <div class="page">
        <div class="header"><div>Market Dynamics</div><div>4.4 Competitive Landscape</div></div>
        <div class="content">
            <h2>Incumbents & Challengers</h2>
            {{COMPETITOR_DETAILED_PAGE_1}}
        </div>
        <div class="footer"><span>Confidential</span><span>Page 25</span></div>
    </div>

    <!-- 4.4 Competition P2 (Page 26) -->
    <div class="page">
        <div class="header"><div>Market Dynamics</div><div>4.4 Competitive Landscape</div></div>
        <div class="content">
             <h2>Incumbents & Challengers (Cont.)</h2>
             {{COMPETITOR_DETAILED_PAGE_2}}
        </div>
        <div class="footer"><span>Confidential</span><span>Page 26</span></div>
    </div>

    <!-- 4.5 Comparison (Page 27) -->
    <div class="page">
        <div class="header"><div>Market Dynamics</div><div>4.5 Feature War Room</div></div>
        <div class="content">
            <h2>Feature Comparison</h2>
            <table>
                <thead><tr><th>Feature / Capability</th><th>Our Advantage</th><th>Competitor Status</th><th>Verdict</th></tr></thead>
                <tbody>{{COMPETITOR_ROWS}}</tbody>
            </table>
            
            <h2 style="margin-top:10mm;">Beachhead Strategy</h2>
            <div class="card highlight">
                <div class="grid-2">
                    <div><span class="stat-lbl">Profile</span><br/><strong>{{BEACHHEAD_PROFILE}}</strong></div>
                    <div><span class="stat-lbl">Pain Point</span><br/><strong>{{BEACHHEAD_PAIN}}</strong></div>
                </div>
                <div style="margin-top:4mm; padding-top:4mm; border-top:1px solid rgba(0,0,0,0.05);">
                    <span class="stat-lbl">Why They Will Buy</span><br/>
                    <span style="font-style:italic;">"{{BEACHHEAD_TOLERANCE}}"</span>
                </div>
            </div>
            
            <h3>Customer Acquisition</h3>
            <table>
                <thead><tr><th>Milestone</th><th>Strategy</th><th>Timeline</th></tr></thead>
                <tbody>{{ACQUISITION_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer"><span>Confidential</span><span>Page 27</span></div>
    </div>
    
    <!-- SECTION 05 (Page 28) -->
    <div class="page page-section">
         <div class="section-watermark">05</div>
         <div class="section-content">
             <div class="section-num">05</div>
             <div class="section-name">Regulatory</div>
             <div class="section-desc">Compliance pathway, classification, and testing standards.</div>
         </div>
     </div>

     <!-- 5.1 CLASSIFICATION (Page 29) -->
     <div class="page">
         <div class="header"><div>Regulatory</div><div>5.1 Pathway</div></div>
         <div class="content">
             <h2>Classification & Strategy</h2>
             <div class="markdown-content">{{REG_NARRATIVE}}</div>
             
             <div class="grid-2" style="margin-top:8mm;">
                 <div class="stat-card">
                     <span class="stat-lbl">Classification</span>
                     <span class="stat-val">{{DEVICE_CLASS}}</span>
                 </div>
                 <div class="stat-card">
                     <span class="stat-lbl">Submission Pathway</span>
                     <span class="stat-val">{{REG_PATHWAY}}</span>
                 </div>
             </div>
             
             <h3 style="margin-top:8mm;">Predicate Devices</h3>
             <table>
                 <thead><tr><th>Device / System</th><th>Ref #</th><th>Relevance</th></tr></thead>
                 <tbody>{{PRECEDENT_ROWS}}</tbody>
             </table>
         </div>
         <div class="footer"><span>Confidential</span><span>Page 29</span></div>
     </div>

     <!-- 5.2 Timeline & Cost (Page 30) -->
     <div class="page">
         <div class="header"><div>Regulatory</div><div>5.2 Timeline & Resource</div></div>
         <div class="content">
             <h2>Timeline & Cost</h2>
             <p style="margin-bottom: 6mm;">Estimated regulatory burden to approval.</p>
             <table>
                 <thead><tr><th>Phase</th><th>Activity</th><th>Duration</th><th>Est. Cost</th></tr></thead>
                 <tbody>{{REG_COST_ROWS}}</tbody>
             </table>
         </div>
         <div class="footer"><span>Confidential</span><span>Page 30</span></div>
     </div>

     <!-- SECTION 06 (Page 31) -->
     <div class="page page-section">
          <div class="section-watermark">06</div>
          <div class="section-content">
              <div class="section-num">06</div>
              <div class="section-name">Financials</div>
              <div class="section-desc">Unit economics, capital requirements, and roadmap.</div>
          </div>
      </div>

    <!-- 6.1 UNIT ECONOMICS (Page 32) -->
    <div class="page">
        <div class="header"><div>Financial</div><div>6.1 Unit Economics</div></div>
        <div class="content">
            <h2>Unit Economics (Estimated)</h2>
            <div class="grid-3" style="margin-bottom:8mm;">
                <div class="stat-card">
                     <span class="stat-lbl">Target ASP</span>
                     <span class="stat-val">{{TARGET_ASP}}</span>
                </div>
                <div class="stat-card">
                     <span class="stat-lbl">COGS (At Scale)</span>
                     <span class="stat-val">{{COGS}}</span>
                </div>
                <div class="stat-card">
                     <span class="stat-lbl">Gross Margin</span>
                     <span class="stat-val" style="color:var(--color-risk-low);">{{GROSS_MARGIN}}</span>
                </div>
            </div>
            
            <h3>Bill of Materials (High-Level)</h3>
            <table>
                <thead><tr><th>Component Group</th><th>Est. Cost</th><th>Potential Supplier</th></tr></thead>
                <tbody>{{BOM_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer"><span>Confidential</span><span>Page 32</span></div>
    </div>
    
    <!-- 6.2 Funding Strategy (Page 33) -->
    <div class="page">
        <div class="header"><div>Financial</div><div>6.2 Capital Requirements</div></div>
        <div class="content">
            <h2>Funding Strategy</h2>
            <div class="grid-2">
                <div class="card">
                    <h3 style="margin:0; border:none; color:var(--color-secondary);">Seed Round</h3>
                    <div style="font-size:20pt; font-weight:700; color:var(--color-primary);">{{SEED_AMOUNT}}</div>
                    <ul class="clean-list" style="margin-top:4mm;">{{SEED_USES}}</ul>
                </div>
                <div class="card">
                    <h3 style="margin:0; border:none; color:var(--color-accent);">Series A</h3>
                    <div style="font-size:20pt; font-weight:700; color:var(--color-primary);">{{SERIES_A_AMOUNT}}</div>
                    <div style="font-size:8pt; margin-top:4mm;"><strong>Trigger:</strong> {{SERIES_A_TRIGGER}}</div>
                </div>
            </div>
        </div>
        <div class="footer"><span>Confidential</span><span>Page 33</span></div>
    </div>

    <!-- 6.3 ROADMAP (Page 34) -->
    <div class="page">
        <div class="header"><div>Financial</div><div>6.3 18-Month Plan</div></div>
        <div class="content">
            <h2>Action Plan</h2>
            <table>
                <thead><tr><th style="width:25%;">Phase / Timing</th><th>Budget</th><th>Key Activities</th></tr></thead>
                <tbody>{{ACTION_PLAN_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer"><span>Confidential</span><span>Page 34</span></div>
    </div>

    <!-- SECTION 07 (Page 35) -->
    <div class="page page-section">
         <div class="section-watermark">07</div>
         <div class="section-content">
             <div class="section-num">07</div>
             <div class="section-name">Strategic Outlook</div>
             <div class="section-desc">Priorities, partnerships, and go/no-go framework.</div>
         </div>
     </div>
     
     <!-- 7.1 Priorities (Page 36) -->
     <div class="page">
         <div class="header"><div>Strategy</div><div>7.1 Priorities</div></div>
         <div class="content">
             <h2>Priority Actions</h2>
             <table>
                 <thead><tr><th>Action</th><th>Owner</th><th>Timeline</th><th>Budget</th></tr></thead>
                 <tbody>{{PRIORITY_ACTION_ROWS}}</tbody>
             </table>
         </div>
         <div class="footer"><span>Confidential</span><span>Page 36</span></div>
     </div>
     
     <!-- 7.2 Go/No-Go (Page 37) -->
     <div class="page">
         <div class="header"><div>Strategy</div><div>7.2 Go / No-Go</div></div>
         <div class="content">
             <h2>Framework</h2>
             <div class="grid-2">
                 <div class="card" style="border-top:4px solid var(--color-risk-low);">
                     <h3 style="border:none;">Green Light Criteria</h3>
                     <ul class="clean-list">{{GO_CRITERIA}}</ul>
                 </div>
                 <div class="card" style="border-top:4px solid var(--color-risk-critical);">
                     <h3 style="border:none;">Kill Signals</h3>
                     <ul class="clean-list">{{NOGO_CRITERIA}}</ul>
                 </div>
             </div>
         </div>
         <div class="footer"><span>Confidential</span><span>Page 37</span></div>
     </div>

     <!-- SECTION 08 (Page 38) -->
     <div class="page page-section">
          <div class="section-watermark">08</div>
          <div class="section-content">
              <div class="section-num">08</div>
              <div class="section-name">Director Insights</div>
              <div class="section-desc">Official memorandum and synthesis from the TTO Director.</div>
          </div>
      </div>
      
      <!-- 8.1 Memo (Page 39) -->
      <div class="page">
          <div class="header"><div>Director Insights</div><div>8.1 Memorandum</div></div>
          <div class="content">
              <!-- MEMO HEADER -->
              <div style="border-bottom:2px solid black; padding-bottom:4mm; margin-bottom:8mm; display:flex; justify-content:space-between; align-items:end;">
                  <div>
                      <div style="font-family:var(--font-display); font-size:22pt; font-weight:700; color:black; line-height:1;">Dr. Arcus A.I.</div>
                      <div style="text-transform:uppercase; font-size:7pt; letter-spacing:1px; color:#475569; font-weight:700;">Senior Director, Technology Transfer Office</div>
                  </div>
                  <div style="text-align:right;">
                      <div style="font-family:var(--font-mono); font-size:9pt; font-weight:700;">DATE: {{REPORT_DATE}}</div>
                  </div>
              </div>
              
              <div style="margin-bottom:8mm; font-family:var(--font-mono); font-size:9pt; background:#f1f5f9; padding:4mm; border-radius:4px;">
                  <div><strong>TO:</strong> Investment Committee</div>
                  <div><strong>RE:</strong> Commercial Viability Assessment - {{TECHNOLOGY_NAME}}</div>
                  <div><strong>REF:</strong> {{REPORT_ID}}</div>
              </div>
              
              <div class="markdown-content" style="font-size:10pt; line-height:1.7; color:#1e293b;">
                  {{INSIGHTS_NARRATIVE}}
              </div>
          </div>
          <div class="footer"><span>Confidential</span><span>Page 39</span></div>
      </div>

      <!-- 8.2 Mandates (Page 40) -->
      <div class="page">
          <div class="header"><div>Director Insights</div><div>8.2 Mandates</div></div>
          <div class="content">
              <h2>Strategic Mandates</h2>
              <div class="grid-3">
                  {{INSIGHTS_RECS}}
              </div>
              
              <div style="margin-top:15mm; text-align:right;">
                  <div style="width:50mm; height:10mm; margin-left:auto; border-bottom:1px solid black; margin-bottom:2mm;"></div>
                  <div style="font-size:8pt; font-weight:700; text-transform:uppercase;">Digital Signature Verified</div>
              </div>
          </div>
          <div class="footer"><span>Confidential</span><span>Page 40</span></div>
      </div>

    {{PRODUCT_CONCEPT_IMAGE}}

</body>
</html>
`;
