
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
        /* --- DESIGN SYSTEM: "Deep Ocean" Theme --- */
        :root {
            --color-navy: #0B1120;
            --color-slate: #334155;
            --color-text: #1e293b;
            --color-text-light: #64748b;
            --color-border: #e2e8f0;
            --color-bg-subtle: #f8fafc;
            
            --color-accent: #2563eb;       /* Electric Blue */
            --color-risk-high: #dc2626;    /* Red */
            --color-risk-med: #d97706;     /* Amber */
            --color-risk-low: #059669;     /* Emerald */
            
            --font-serif: 'Playfair Display', serif;
            --font-sans: 'Inter', sans-serif;
            --font-mono: 'JetBrains Mono', monospace;
        }

        @page {
            size: letter; /* Letter Standard */
            margin: 0;
        }
        
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        body {
            font-family: var(--font-sans);
            background-color: #525659; /* Gray background for web preview */
            margin: 0;
            padding: 0;
            font-size: 9pt;
            color: var(--color-text);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }

        /* --- PAGE CONTAINER --- */
        .page {
            width: 8.5in;
            height: 11in; /* Letter Standard */
            background: white;
            position: relative;
            margin: 0 auto 20px auto;
            overflow: hidden;
            page-break-after: always;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
        }

        @media print {
            body { background: none; }
            .page { 
                box-shadow: none; 
                margin: 0; 
                width: 8.5in;
                height: 11in;
                page-break-after: always;
                border: none;
                overflow: visible !important;
            }
            .content {
                overflow: visible !important;
            }
        }

        /* --- LAYOUT UTILS --- */
        .header {
            padding: 15mm 15mm 5mm 15mm;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 2px solid var(--color-navy);
            margin-bottom: 8mm;
            flex-shrink: 0;
        }
        
        .content {
            padding: 0 15mm;
            flex-grow: 1;
            overflow: hidden; /* Prevent spillover */
        }

        .footer {
            padding: 5mm 15mm 10mm 15mm;
            border-top: 1px solid var(--color-border);
            display: flex;
            justify-content: space-between;
            font-size: 7pt;
            color: var(--color-text-light);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: auto;
            flex-shrink: 0;
        }

        /* --- TYPOGRAPHY --- */
        h1, h2, h3, h4 { margin: 0; color: var(--color-navy); }
        
        h1 {
            font-family: var(--font-serif);
            font-size: 32pt;
            font-weight: 700;
            line-height: 1.1;
            letter-spacing: -0.5px;
            margin-bottom: 10mm;
        }

        h2 {
            font-family: var(--font-serif);
            font-size: 20pt;
            font-weight: 600;
            color: var(--color-navy);
            margin-bottom: 6mm;
            position: relative;
            padding-left: 12px;
            border-left: 3px solid var(--color-accent);
            line-height: 1.2;
        }
        
        /* Section Sub-headers */
        h3 {
            font-family: var(--font-sans);
            font-size: 8pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: var(--color-text-light);
            margin-bottom: 4mm;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        h4 {
            font-family: var(--font-sans);
            font-size: 10pt;
            font-weight: 700;
            color: var(--color-navy);
            margin-bottom: 2mm;
        }

        p {
            font-size: 9pt;
            color: var(--color-slate);
            margin-bottom: 4mm;
            text-align: justify;
            line-height: 1.6;
        }

        .header-left {
            font-family: var(--font-sans);
            font-weight: 800;
            font-size: 7pt;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--color-navy);
        }
        .header-right {
            font-family: var(--font-serif);
            font-style: italic;
            font-size: 9pt;
            color: var(--color-text-light);
        }

        /* --- COMPONENTS --- */
        .card {
            background: white;
            border: 1px solid var(--color-border);
            padding: 5mm;
            margin-bottom: 5mm;
            position: relative;
            border-radius: 2px; /* Slight rounding, mostly sharp */
        }
        .card.highlight {
            background: var(--color-bg-subtle);
            border: none;
            border-left: 3px solid var(--color-navy);
        }
        
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 6pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            vertical-align: middle;
        }
        .badge-green { background: var(--color-bg-subtle); color: var(--color-risk-low); border: 1px solid var(--color-risk-low); }
        .badge-amber { background: #fffbeb; color: var(--color-risk-med); border: 1px solid var(--color-risk-med); }
        .badge-red { background: #fef2f2; color: var(--color-risk-high); border: 1px solid var(--color-risk-high); }
        .badge-blue { background: #eff6ff; color: var(--color-accent); border: 1px solid #bfdbfe; }
        .badge-slate { background: var(--color-bg-subtle); color: var(--color-text-light); border: 1px solid var(--color-border); }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 6mm;
            font-size: 8.5pt;
        }
        th {
            text-align: left;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 7pt;
            color: var(--color-navy);
            border-bottom: 1px solid var(--color-navy); /* Darker Header Line */
            padding: 3mm 2mm;
            letter-spacing: 0.5px;
        }
        td {
            border-bottom: 1px solid var(--color-border);
            padding: 3mm 2mm;
            vertical-align: top;
            color: var(--color-slate);
        }
        tr:last-child td { border-bottom: none; }

        /* --- COVER PAGE (Reference Style) --- */
        .page-cover {
            background-color: var(--color-navy);
            color: white;
            padding: 20mm;
            justify-content: space-between;
        }
        .cover-top {
            border-top: 1px solid rgba(255,255,255,0.2);
            padding-top: 5mm;
            display: flex;
            justify-content: space-between;
            font-size: 7pt;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #94a3b8;
        }
        .cover-center {
            margin-bottom: 30mm;
        }
        .cover-title {
            font-family: var(--font-serif);
            font-size: 48pt; /* Massive Title */
            line-height: 1;
            margin-bottom: 10mm;
            color: white;
            font-weight: 400; /* Elegant weight */
        }
        .cover-subtitle {
            font-family: var(--font-sans);
            font-size: 14pt;
            font-weight: 300;
            color: #cbd5e1;
            border-left: 4px solid var(--color-accent);
            padding-left: 6mm;
            line-height: 1.4;
        }
        .cover-meta-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15mm;
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 10mm;
        }
        .meta-box label {
            display: block;
            font-size: 6pt;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #64748b;
            margin-bottom: 3mm;
            font-weight: 700;
        }
        .meta-box div {
            font-family: var(--font-serif);
            font-size: 11pt;
            color: white;
            letter-spacing: 0.5px;
        }

        /* --- SECTION DIVIDERS (Massive Number Style) --- */
        .page-section {
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 20mm;
            position: relative;
        }
        .section-num {
            font-family: var(--font-serif);
            font-size: 120pt;
            color: #f1f5f9; /* Very subtle grey */
            line-height: 1;
            position: absolute;
            top: 20mm;
            left: 15mm;
            font-weight: 700;
            z-index: 0;
        }
        .section-content {
            position: relative;
            z-index: 10;
            margin-top: 40mm;
        }
        .section-name {
            font-family: var(--font-serif);
            font-size: 42pt;
            color: var(--color-navy);
            margin-bottom: 8mm;
            font-weight: 400;
        }
        .section-desc {
            font-family: var(--font-sans);
            font-size: 12pt;
            color: var(--color-text-light);
            max-width: 100mm;
            line-height: 1.6;
            font-weight: 300;
        }

        /* --- MEMO STYLE (Light/Parchment) --- */
        .page-memo {
            background-color: #fdfbf7; /* Off-white/Cream */
            color: #1e293b;
        }
        .page-memo .header { border-bottom-color: #cbd5e1; }
        .page-memo .footer { border-top-color: #cbd5e1; color: #64748b; }
        
        .memo-container {
            margin-top: 5mm;
            padding: 10mm;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            position: relative;
        }
        /* Paper clip effect visual */
        .memo-container::before {
            content: '';
            position: absolute;
            top: -10px;
            left: 20px;
            width: 15px;
            height: 30px;
            border-radius: 10px;
            border: 2px solid #94a3b8;
            background: transparent;
            z-index: 10;
            border-bottom: none;
        }

        .memo-header {
            border-bottom: 2px solid #000;
            padding-bottom: 5mm;
            margin-bottom: 8mm;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .memo-brand {
            font-family: var(--font-serif);
            font-weight: 900;
            font-size: 16pt;
            text-transform: uppercase;
            letter-spacing: -0.5px;
            color: #000;
        }
        .memo-meta-table {
            font-family: 'Courier New', Courier, monospace;
            font-size: 8pt;
            width: 100%;
            margin-bottom: 8mm;
        }
        .memo-meta-table td {
            border: none;
            padding: 2px 0;
            vertical-align: top;
        }
        .memo-label {
            font-weight: 700;
            text-transform: uppercase;
            width: 60px;
            color: #64748b;
        }
        .memo-body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 10pt;
            line-height: 1.6;
            color: #334155;
            text-align: justify;
        }
        .memo-sig {
            margin-top: 15mm;
            padding-top: 5mm;
            border-top: 1px solid #cbd5e1;
            width: 60%;
            margin-left: auto;
            font-family: 'Courier New', Courier, monospace;
            font-size: 8pt;
            color: #64748b;
        }

        /* --- RISK DASHBOARD --- */
        .risk-dashboard {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 15mm;
            margin-bottom: 10mm;
            padding: 10mm;
            border: 1px solid var(--color-border);
            border-radius: 4px;
            background: white;
        }
        .risk-circle {
            position: relative;
            width: 30mm;
            height: 30mm;
            border-radius: 50%;
            background: conic-gradient(var(--risk-color) 0% var(--risk-percent), #f1f5f9 var(--risk-percent) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .risk-circle-inner {
            width: 24mm;
            height: 24mm;
            background: white;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .risk-score { font-size: 18pt; font-weight: 800; color: var(--color-navy); line-height: 1; font-family: var(--font-sans); }
        .risk-label { font-size: 5pt; text-transform: uppercase; letter-spacing: 1px; color: var(--color-text-light); margin-top: 2px; }

        /* --- GRID UTILS --- */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6mm; }
        
        .stat-card {
            border: 1px solid var(--color-border);
            padding: 5mm;
            text-align: center;
            background: white;
        }
        .stat-val { display: block; font-family: var(--font-serif); font-size: 16pt; color: var(--color-navy); margin-bottom: 2mm; font-weight: 700; }
        .stat-lbl { font-size: 6pt; font-weight: 700; color: var(--color-text-light); text-transform: uppercase; letter-spacing: 1px; }

        /* --- LISTS --- */
        ul.clean-list { list-style: none; padding: 0; margin: 0; }
        ul.clean-list li {
            padding: 3mm 0;
            border-bottom: 1px dashed var(--color-border);
            display: flex;
            align-items: flex-start;
            gap: 8px;
            font-size: 8.5pt;
        }
        ul.clean-list li:last-child { border-bottom: none; }
        ul.clean-list i { color: var(--color-accent); margin-top: 3px; font-size: 8pt; }

        /* 2-Column Text */
        .two-col-text {
            column-count: 2;
            column-gap: 10mm;
            font-size: 8.5pt;
            line-height: 1.6;
            color: var(--color-slate);
            text-align: justify;
        }
        .two-col-text p { margin-top: 0; }

        .toc-row {
            display: flex;
            align-items: baseline;
            margin-bottom: 15px;
            border-bottom: 1px dotted var(--color-border);
            padding-bottom: 5px;
        }
        .toc-num { width: 40px; font-weight: 700; color: var(--color-accent); font-size: 10pt; font-family: var(--font-mono); }
        .toc-title { flex: 1; font-weight: 600; color: var(--color-navy); font-size: 11pt; font-family: var(--font-serif); }
        .toc-page { font-weight: 700; color: var(--color-text-light); font-size: 10pt; font-family: var(--font-mono); }

    </style>
</head>
<body>

    <!-- COVER PAGE -->
    <div class="page page-cover">
        <div>
            <div class="cover-top">
                <div>Arcus Innovation Studios</div>
                <div>Confidential Assessment</div>
            </div>
        </div>
        <div class="cover-center">
            <div class="cover-title">{{TECHNOLOGY_NAME}}</div>
            <div class="cover-subtitle">{{TECHNOLOGY_SUBTITLE}}</div>
        </div>
        <div class="cover-meta-grid">
            <div class="meta-box"><label>Client</label><div>{{CLIENT_NAME}}</div></div>
            <div class="meta-box"><label>Report Date</label><div>{{REPORT_DATE}}</div></div>
            <div class="meta-box"><label>Inventor</label><div>{{INVENTOR_NAME}}</div></div>
            <div class="meta-box"><label>Reference ID</label><div style="font-family:var(--font-mono); font-size:9pt;">{{REPORT_ID}}</div></div>
        </div>
    </div>

    <!-- TOC -->
    <div class="page">
        <div class="header">
            <div class="header-left">Contents</div>
            <div class="header-right">Innovation Compass</div>
        </div>
        <div class="content">
            <h1>Table of Contents</h1>
            <div style="margin-top: 20mm; max-width: 150mm;">
                <div class="toc-row"><span class="toc-num">01</span><span class="toc-title">Executive Summary</span><span class="toc-page">03</span></div>
                <div class="toc-row"><span class="toc-num">02</span><span class="toc-title">Technology Forensics</span><span class="toc-page">08</span></div>
                <div class="toc-row"><span class="toc-num">03</span><span class="toc-title">IP Deep Dive</span><span class="toc-page">14</span></div>
                <div class="toc-row"><span class="toc-num">04</span><span class="toc-title">Market Dynamics</span><span class="toc-page">20</span></div>
                <div class="toc-row"><span class="toc-num">05</span><span class="toc-title">Regulatory & Compliance</span><span class="toc-page">27</span></div>
                <div class="toc-row"><span class="toc-num">06</span><span class="toc-title">Financial Roadmap</span><span class="toc-page">30</span></div>
                <div class="toc-row"><span class="toc-num">07</span><span class="toc-title">Strategic Outlook</span><span class="toc-page">34</span></div>
                <div class="toc-row"><span class="toc-num">08</span><span class="toc-title">Director's Insights</span><span class="toc-page">37</span></div>
                <div class="toc-row"><span class="toc-num">09</span><span class="toc-title">Appendix</span><span class="toc-page">40</span></div>
            </div>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 02</span>
        </div>
    </div>

    <!-- SECTION 01 -->
    <div class="page page-section">
        <div class="section-num">01</div>
        <div class="section-content">
            <div class="section-name">Executive Summary</div>
            <div class="section-desc">Strategic overview of risk, strengths, and commercial viability.</div>
        </div>
    </div>

    <!-- 1.1 RISK PROFILE -->
    <div class="page">
        <div class="header">
            <div class="header-left">Executive Summary</div>
            <div class="header-right">1.1 Risk Profile</div>
        </div>
        <div class="content">
            <div class="risk-dashboard" style="--risk-color: {{RISK_COLOR}}; --risk-percent: {{RISK_SCORE}}%;">
                <div style="display:flex; justify-content:center; align-items:center;">
                    <div class="risk-circle">
                        <div class="risk-circle-inner">
                            <span class="risk-score">{{RISK_SCORE}}</span>
                            <span class="risk-label">INDEX</span>
                        </div>
                    </div>
                </div>
                <div style="display:flex; flex-direction:column; justify-content:center;">
                    <div style="font-size:7pt; font-weight:700; color:var(--color-text-light); text-transform:uppercase; margin-bottom:5px;">Composite Status</div>
                    <div style="font-family:var(--font-serif); font-size:24pt; color:var(--color-navy); margin-bottom:5px; line-height:1;">{{RISK_LEVEL_TEXT}}</div>
                    <div style="font-size:8.5pt; color:var(--color-slate);">{{RISK_COUNTS_TEXT}}</div>
                </div>
            </div>

            <h3>Executive Narrative</h3>
            <div class="two-col-text">
                {{RISK_SUMMARY_TEXT}}
            </div>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 04</span>
        </div>
    </div>

    <!-- 1.2 CRITICAL CONCERNS -->
    <div class="page">
        <div class="header">
            <div class="header-left">Executive Summary</div>
            <div class="header-right">1.2 Red Flags</div>
        </div>
        <div class="content">
            <h2>Critical Red Flags (Tier 1)</h2>
            <p style="margin-bottom: 8mm; font-style: italic;">Issues that threaten patentability or commercial viability.</p>
            {{CRITICAL_CONCERNS_BLOCK}}
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 05</span>
        </div>
    </div>

    <!-- 1.3 STRENGTHS -->
    <div class="page">
        <div class="header">
            <div class="header-left">Executive Summary</div>
            <div class="header-right">1.3 Key Strengths</div>
        </div>
        <div class="content">
            <h2>Key Strengths</h2>
            <p style="margin-bottom: 8mm;">Differentiating factors that provide an unfair market advantage.</p>
            {{KEY_STRENGTHS_BLOCK}}
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 06</span>
        </div>
    </div>

    <!-- 1.4 COMMERCIALIZATION -->
    <div class="page">
        <div class="header">
            <div class="header-left">Executive Summary</div>
            <div class="header-right">1.4 Commercialization Path</div>
        </div>
        <div class="content">
            <h2>Path to Market</h2>
            
            <div class="grid-3" style="margin-bottom: 10mm;">
                <div class="stat-card">
                    <span class="stat-val">{{SEED_REQ}}</span>
                    <span class="stat-lbl">Est. Dev Cost</span>
                </div>
                <div class="stat-card">
                    <span class="stat-val">{{RUNWAY}} mo</span>
                    <span class="stat-lbl">Time to Market</span>
                </div>
                <div class="stat-card">
                    <span class="stat-val" style="font-size:12pt;">{{MILESTONE}}</span>
                    <span class="stat-lbl">Key Milestone</span>
                </div>
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
        <div class="footer">
            <span>Confidential</span>
            <span>Page 07</span>
        </div>
    </div>

    <!-- SECTION 02 -->
    <div class="page page-section">
        <div class="section-num">02</div>
        <div class="section-content">
            <div class="section-name">Technology Forensics</div>
            <div class="section-desc">Deep-dive technical due diligence, core technology validation, and TRL.</div>
        </div>
    </div>

    <!-- 2.1 OVERVIEW -->
    <div class="page">
        <div class="header">
            <div class="header-left">Tech Forensics</div>
            <div class="header-right">2.1 Architecture</div>
        </div>
        <div class="content">
            <h2>Technical Overview</h2>
            <div class="two-col-text" style="margin-bottom: 8mm;">
                <p>{{TECH_OVERVIEW}}</p>
            </div>
            
            <div class="card highlight">
                <h3>Core Features & Architecture</h3>
                <ul class="clean-list">{{CORE_FEATURES}}</ul>
            </div>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 09</span>
        </div>
    </div>

    <!-- 2.2 MECHANISM -->
    <div class="page">
        <div class="header">
            <div class="header-left">Tech Forensics</div>
            <div class="header-right">2.2 Core Mechanism</div>
        </div>
        <div class="content">
            <h2>Mechanism of Action</h2>
            <div style="font-size: 9pt; margin-bottom: 10mm; background: #f8fafc; padding: 15px; border-left: 3px solid var(--color-navy);">
                <p style="margin:0;">{{MECHANISM_EXPLANATION}}</p>
            </div>

            <h2>Technical Specifications</h2>
            <table>
                <thead><tr><th width="20%">Parameter</th><th width="20%">Specification</th><th width="20%">Benchmark</th><th width="40%">Notes</th></tr></thead>
                <tbody>{{SPECS_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 10</span>
        </div>
    </div>

    <!-- 2.3 RISK DEEP DIVE -->
    <div class="page">
        <div class="header">
            <div class="header-left">Tech Forensics</div>
            <div class="header-right">2.3 Failure Analysis</div>
        </div>
        <div class="content">
            <h2>Physics of Failure (Deep Dive)</h2>
            <p style="margin-bottom: 8mm;">Forensic analysis of failure modes specific to the technology sector.</p>
            {{FULL_RISK_ROWS}}
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 11</span>
        </div>
    </div>

    <!-- 2.4 CLAIMS -->
    <div class="page">
        <div class="header">
            <div class="header-left">Tech Forensics</div>
            <div class="header-right">2.4 Claims Matrix</div>
        </div>
        <div class="content">
            <h2>Claims Verification</h2>
            <table>
                <thead><tr><th>Claim</th><th>Assertion</th><th>Source</th><th>Confidence</th></tr></thead>
                <tbody>{{CLAIMS_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 12</span>
        </div>
    </div>

    <!-- 2.5 TRL -->
    <div class="page">
        <div class="header">
            <div class="header-left">Tech Forensics</div>
            <div class="header-right">2.5 TRL Assessment</div>
        </div>
        <div class="content">
            <h2>Technology Readiness Level</h2>
            <div class="card highlight" style="display:flex; gap:15mm; align-items:center; padding: 10mm;">
                <div style="font-size:60pt; font-weight:700; color:var(--color-navy); line-height: 1;">{{OVERALL_TRL}}</div>
                <div style="border-left:1px solid var(--color-border); padding-left:10mm;">
                    <div style="font-weight:700; text-transform:uppercase; font-size:8pt; color:var(--color-text-light); margin-bottom:2mm;">System Maturity</div>
                    <p style="margin:0; font-size: 9pt; line-height: 1.5;">{{TRL_NARRATIVE}}</p>
                </div>
            </div>

            <div style="margin-top: 10mm;">
                <h3>Subsystem Status</h3>
                <table>
                    <thead><tr><th>Subsystem</th><th>TRL</th><th>Current Status</th></tr></thead>
                    <tbody>{{TRL_ROWS}}</tbody>
                </table>
            </div>

            <h2 style="margin-top: 10mm;">Validation Gaps</h2>
            <table>
                <thead><tr><th>Gap</th><th>Required Testing</th><th>Est. Cost</th><th>Timeline</th></tr></thead>
                <tbody>{{VALIDATION_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 13</span>
        </div>
    </div>

    <!-- SECTION 03 -->
    <div class="page page-section">
        <div class="section-num">03</div>
        <div class="section-content">
            <div class="section-name">IP Deep Dive</div>
            <div class="section-desc">Freedom-to-Operate (FTO) analysis, blocking patent identification, and filing strategy.</div>
        </div>
    </div>

    <!-- 3.1 METHODOLOGY -->
    <div class="page">
        <div class="header">
            <div class="header-left">IP Analysis</div>
            <div class="header-right">3.1 Methodology</div>
        </div>
        <div class="content">
            <h2>Search Methodology</h2>
            <p>{{IP_METHODOLOGY}}</p>
            
            <table>
                <thead><tr><th>Component</th><th>Search Terms</th><th>Databases</th><th>Results</th></tr></thead>
                <tbody>{{IP_SEARCH_ROWS}}</tbody>
            </table>

            <h2 style="margin-top:10mm;">Classification Strategy</h2>
            <p>{{IP_CLASSIFICATION_NARRATIVE}}</p>
            <table>
                <thead><tr><th>Code</th><th>Description</th><th>Strategic Implication</th></tr></thead>
                <tbody>{{IP_CLASS_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 15</span>
        </div>
    </div>

    <!-- 3.2 WHITESPACE -->
    <div class="page">
        <div class="header">
            <div class="header-left">IP Analysis</div>
            <div class="header-right">3.2 Whitespace</div>
        </div>
        <div class="content">
            <h2>Whitespace Analysis & Strategic Leverage</h2>
            <div class="card" style="background: #f0fdf4; border: 1px solid #bbf7d0;">
                <h3 style="color: #166534; border:none; margin-bottom: 2mm;">IDENTIFIED OPPORTUNITIES</h3>
                <p style="color: #14532d; font-size: 9pt; margin: 0;">{{WHITESPACE_TEXT}}</p>
            </div>

            <h2 style="margin-top: 10mm;">Licensing & Partnership Strategy</h2>
            <div class="card">
                <div class="grid-2">
                    <div>
                        <h3>Targets</h3>
                        <p style="font-weight: 700; font-family: var(--font-serif); font-size: 11pt;">{{WHITESPACE_TARGETS}}</p>
                    </div>
                    <div>
                        <h3>Model</h3>
                        <p>{{WHITESPACE_MODEL}}</p>
                    </div>
                </div>
                <div style="margin-top: 6mm; border-top: 1px solid var(--color-border); padding-top: 4mm;">
                    <h3>Strategic Rationale</h3>
                    <p style="font-style:italic;">{{WHITESPACE_RATIONALE}}</p>
                </div>
            </div>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 16</span>
        </div>
    </div>

    <!-- 3.3 BLOCKING (P1) -->
    <div class="page">
        <div class="header">
            <div class="header-left">IP Analysis</div>
            <div class="header-right">3.3 Blocking Patents</div>
        </div>
        <div class="content">
            <h2>Blocking Patent Analysis</h2>
            <p>Identification of high-risk patent families that may impede commercialization.</p>
            {{BLOCKING_PATENTS_PAGE_1}}
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 17</span>
        </div>
    </div>

    <!-- 3.4 BLOCKING (P2) -->
    <div class="page">
        <div class="header">
            <div class="header-left">IP Analysis</div>
            <div class="header-right">3.3 Blocking (Cont.)</div>
        </div>
        <div class="content">
            {{BLOCKING_PATENTS_PAGE_2}}
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 18</span>
        </div>
    </div>

    <!-- 3.5 FTO & STRATEGY -->
    <div class="page">
        <div class="header">
            <div class="header-left">IP Analysis</div>
            <div class="header-right">3.4 Strategy</div>
        </div>
        <div class="content">
            <h2>Freedom to Operate Assessment</h2>
            <table>
                <thead><tr><th>Component</th><th>FTO Risk</th><th>Mitigation Strategy</th></tr></thead>
                <tbody>{{FTO_ROWS}}</tbody>
            </table>

            <h2 style="margin-top: 10mm;">Filing Strategy Recommendations</h2>
            <p>{{FILING_STRATEGY_DESC}}</p>
            <div style="margin-top: 6mm;">{{FILING_PHASES}}</div>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 19</span>
        </div>
    </div>

    <!-- SECTION 04 -->
    <div class="page page-section">
        <div class="section-num">04</div>
        <div class="section-content">
            <div class="section-name">Market Dynamics</div>
            <div class="section-desc">Competitive intelligence, industry trends, and failure mode analysis.</div>
        </div>
    </div>

    <!-- 4.1 OUTLOOK -->
    <div class="page">
        <div class="header">
            <div class="header-left">Market Dynamics</div>
            <div class="header-right">4.1 Industry Outlook</div>
        </div>
        <div class="content">
            <h2>Market Sizing</h2>
            <div class="grid-3" style="margin-bottom:10mm;">
                <div class="stat-card">
                    <span class="stat-val">{{TAM}}</span>
                    <span class="stat-lbl">Global TAM</span>
                </div>
                <div class="stat-card">
                    <span class="stat-val">{{SAM}}</span>
                    <span class="stat-lbl">Serviceable Market</span>
                </div>
                <div class="stat-card">
                    <span class="stat-val">{{CAGR}}</span>
                    <span class="stat-lbl">CAGR {{FORECAST}}</span>
                </div>
            </div>

            <div class="grid-2">
                <div class="card highlight">
                    <h3>Key Growth Drivers</h3>
                    <ul class="clean-list">{{DRIVERS_LIST}}</ul>
                </div>
                <div class="card highlight">
                    <h3>Emerging Trends</h3>
                    <ul class="clean-list">{{TRENDS_LIST}}</ul>
                </div>
            </div>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 21</span>
        </div>
    </div>

    <!-- 4.2 GRAVEYARD -->
    <div class="page">
        <div class="header">
            <div class="header-left">Market Dynamics</div>
            <div class="header-right">4.2 The Graveyard</div>
        </div>
        <div class="content">
            <h2>Failure Analysis</h2>
            <p>{{GRAVEYARD_INTRO}}</p>
            {{GRAVEYARD_BLOCK}}
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 22</span>
        </div>
    </div>

    <!-- 4.3 COMPETITORS -->
    <div class="page">
        <div class="header">
            <div class="header-left">Market Dynamics</div>
            <div class="header-right">4.3 Detailed Competitors</div>
        </div>
        <div class="content">
            <h2>Detailed Competitor Analysis</h2>
            {{COMPETITOR_DETAILED_PAGE_1}}
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 23</span>
        </div>
    </div>

    <div class="page">
        <div class="header">
            <div class="header-left">Market Dynamics</div>
            <div class="header-right">4.3 Competitors (Cont.)</div>
        </div>
        <div class="content">
            {{COMPETITOR_DETAILED_PAGE_2}}
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 24</span>
        </div>
    </div>

    <!-- 4.4 LANDSCAPE SUMMARY -->
    <div class="page">
        <div class="header">
            <div class="header-left">Market Dynamics</div>
            <div class="header-right">4.4 Landscape Summary</div>
        </div>
        <div class="content">
            <h2>Competitive Landscape Summary</h2>
            <table>
                <thead><tr><th>Competitor</th><th>Value Proposition</th><th>Vulnerability</th><th>Status</th></tr></thead>
                <tbody>{{COMPETITOR_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 25</span>
        </div>
    </div>

    <!-- 4.5 BEACHHEAD -->
    <div class="page">
        <div class="header">
            <div class="header-left">Market Dynamics</div>
            <div class="header-right">4.5 Beachhead Market</div>
        </div>
        <div class="content">
            <h2>Target Profile</h2>
            <div class="card highlight">
                <div class="grid-2">
                    <div>
                        <h3>Customer Profile</h3>
                        <p><strong>{{BEACHHEAD_PROFILE}}</strong></p>
                    </div>
                    <div>
                        <h3>Pain Point</h3>
                        <p>{{BEACHHEAD_PAIN}}</p>
                    </div>
                    <div>
                        <h3>Tolerance</h3>
                        <p>{{BEACHHEAD_TOLERANCE}}</p>
                    </div>
                    <div>
                        <h3>Market Size</h3>
                        <p>{{BEACHHEAD_SIZE}}</p>
                    </div>
                </div>
            </div>

            <h2 style="margin-top:10mm;">Acquisition Strategy</h2>
            <table>
                <thead><tr><th>Milestone</th><th>Strategy</th><th>Timeline</th></tr></thead>
                <tbody>{{ACQUISITION_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 26</span>
        </div>
    </div>

    <!-- SECTION 05 -->
    <div class="page page-section">
        <div class="section-num">05</div>
        <div class="section-content">
            <div class="section-name">Regulatory & Compliance</div>
            <div class="section-desc">Sector-specific classification, comparable systems, and standards.</div>
        </div>
    </div>

    <!-- 5.1 REGULATORY -->
    <div class="page">
        <div class="header">
            <div class="header-left">Regulatory</div>
            <div class="header-right">5.1 Classification</div>
        </div>
        <div class="content">
            <h2>Classification and Framework</h2>
            <div class="grid-3" style="margin-bottom:10mm;">
                <div class="stat-card">
                    <span class="stat-val" style="font-size:11pt;">{{DEVICE_CLASS}}</span>
                    <span class="stat-lbl">Class / Standard</span>
                </div>
                <div class="stat-card">
                    <span class="stat-val" style="font-size:11pt;">{{REG_PATHWAY}}</span>
                    <span class="stat-lbl">Pathway</span>
                </div>
                <div class="stat-card">
                    <span class="stat-val" style="font-size:11pt;">{{REG_TIMELINE}}</span>
                    <span class="stat-lbl">Est. Timeline</span>
                </div>
            </div>
            <p>{{REG_NARRATIVE}}</p>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 28</span>
        </div>
    </div>

    <!-- 5.2 PRECEDENTS -->
    <div class="page">
        <div class="header">
            <div class="header-left">Regulatory</div>
            <div class="header-right">5.2 Comparables</div>
        </div>
        <div class="content">
            <h2>Comparable Systems / Predicates</h2>
            <table>
                <thead><tr><th>Product/System</th><th>Ref #</th><th>Relevance</th></tr></thead>
                <tbody>{{PRECEDENT_ROWS}}</tbody>
            </table>

            <h2 style="margin-top: 10mm;">Timeline and Cost Estimates</h2>
            <table>
                <thead><tr><th>Phase</th><th>Activities</th><th>Duration</th><th>Cost</th></tr></thead>
                <tbody>{{REG_COST_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 29</span>
        </div>
    </div>

    <!-- SECTION 06 -->
    <div class="page page-section">
        <div class="section-num">06</div>
        <div class="section-content">
            <div class="section-name">Financial Roadmap</div>
            <div class="section-desc">Budget allocation, unit economics, and licensing/funding requirements.</div>
        </div>
    </div>

    <!-- 6.1 ACTION PLAN -->
    <div class="page">
        <div class="header">
            <div class="header-left">Financials</div>
            <div class="header-right">6.1 Action Plan</div>
        </div>
        <div class="content">
            <h2>12-Month Action Plan</h2>
            <table>
                <thead><tr><th width="20%">Category</th><th width="15%">Allocation</th><th>Key Activities</th></tr></thead>
                <tbody>{{ACTION_PLAN_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 31</span>
        </div>
    </div>

    <!-- 6.2 UNIT ECONOMICS -->
    <div class="page">
        <div class="header">
            <div class="header-left">Financials</div>
            <div class="header-right">6.2 Unit Economics</div>
        </div>
        <div class="content">
            <h2>Unit Economics / Cost Structure</h2>
            <table>
                <thead><tr><th>Component/Service</th><th>Cost</th><th>Supplier/Source</th></tr></thead>
                <tbody>{{BOM_ROWS}}</tbody>
            </table>
            
            <div class="grid-3" style="margin-top:10mm;">
                <div class="stat-card">
                    <span class="stat-val">{{TARGET_ASP}}</span>
                    <span class="stat-lbl">Target Price</span>
                </div>
                <div class="stat-card" style="border-bottom: 3px solid var(--color-risk-low);">
                    <span class="stat-val" style="color:var(--color-risk-low);">{{GROSS_MARGIN}}</span>
                    <span class="stat-lbl">Gross Margin</span>
                </div>
                <div class="stat-card">
                    <span class="stat-val">{{COGS}}</span>
                    <span class="stat-lbl">COGS / Cost</span>
                </div>
            </div>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 32</span>
        </div>
    </div>

    <!-- 6.3 FUNDING -->
    <div class="page">
        <div class="header">
            <div class="header-left">Financials</div>
            <div class="header-right">6.3 Requirements</div>
        </div>
        <div class="content">
            <h2>Development & Licensing Requirements</h2>
            <div class="grid-2">
                <div class="card" style="border-left: 3px solid var(--color-accent);">
                    <h3>Development Budget</h3>
                    <div style="font-family:var(--font-serif); font-size:32pt; font-weight:700; color:var(--color-navy); margin-bottom:4mm; line-height: 1;">{{SEED_AMOUNT}}</div>
                    <p style="font-size: 7pt; font-weight: 700; text-transform: uppercase;">Use of Funds:</p>
                    <ul style="margin:0; padding-left:15px; font-size:9pt;">{{SEED_USES}}</ul>
                </div>
                <div class="card" style="border-left: 3px solid var(--color-navy);">
                    <h3>Future Requirements</h3>
                    <div style="font-family:var(--font-serif); font-size:32pt; font-weight:700; color:var(--color-navy); margin-bottom:4mm; line-height: 1;">{{SERIES_A_AMOUNT}}</div>
                    <p style="font-size:9pt;"><strong>Trigger Milestone:</strong></p>
                    <p style="font-size:9pt; margin: 0;">{{SERIES_A_TRIGGER}}</p>
                </div>
            </div>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 33</span>
        </div>
    </div>

    <!-- SECTION 07 -->
    <div class="page page-section">
        <div class="section-num">07</div>
        <div class="section-content">
            <div class="section-name">Strategic Outlook</div>
            <div class="section-desc">Final recommendation, go/no-go criteria, and execution plan.</div>
        </div>
    </div>

    <!-- 7.1 EXECUTION -->
    <div class="page">
        <div class="header">
            <div class="header-left">Strategy</div>
            <div class="header-right">7.1 Execution</div>
        </div>
        <div class="content">
            <h2>Priority Actions (Next 90 Days)</h2>
            <table>
                <thead><tr><th>Action</th><th>Owner</th><th>Timeline</th><th>Budget</th></tr></thead>
                <tbody>{{PRIORITY_ACTION_ROWS}}</tbody>
            </table>

            <h2 style="margin-top:10mm;">Partnership Opportunities</h2>
            <table>
                <thead><tr><th>Partner Type</th><th>Targets</th><th>Value Exchange</th></tr></thead>
                <tbody>{{PARTNER_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 35</span>
        </div>
    </div>

    <!-- 7.3 FRAMEWORK -->
    <div class="page">
        <div class="header">
            <div class="header-left">Strategy</div>
            <div class="header-right">7.2 Decision</div>
        </div>
        <div class="content">
            <h2>Go/No-Go Decision Framework</h2>
            <div class="grid-2">
                <div class="card" style="background:#f0fdf4; border: 1px solid #bbf7d0;">
                    <h3 style="color:#166534; border:none; padding:0; margin-bottom:10px; background:transparent;">Proceed to Next Stage If:</h3>
                    <ul style="color:#14532d; padding-left:15px; margin:0; line-height: 1.8; font-size:9pt;">{{GO_CRITERIA}}</ul>
                </div>
                <div class="card" style="background:#fef2f2; border: 1px solid #fecaca;">
                    <h3 style="color:#991b1b; border:none; padding:0; margin-bottom:10px; background:transparent;">Halt or Pivot If:</h3>
                    <ul style="color:#7f1d1d; padding-left:15px; margin:0; line-height: 1.8; font-size:9pt;">{{NOGO_CRITERIA}}</ul>
                </div>
            </div>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 36</span>
        </div>
    </div>

    <!-- SECTION 08 -->
    <div class="page page-section">
        <div class="section-num">08</div>
        <div class="section-content">
            <div class="section-name">Director's Insights</div>
            <div class="section-desc">Unvarnished synthesis and strategic mandates from the TTO Director.</div>
        </div>
    </div>

    <!-- 8.1 MEMO (Parchment Page) -->
    <div class="page page-memo">
        <div class="header">
            <div class="header-left">Insights</div>
            <div class="header-right">8.1 Memorandum</div>
        </div>
        <div class="content">
            <div class="memo-container">
                <div class="memo-header">
                    <div class="memo-brand">Arcus TTO</div>
                    <div style="text-align:right;">
                        <div style="font-size:7pt; font-weight:700; text-transform:uppercase; color:#94a3b8; letter-spacing:1px;">Internal Memo</div>
                        <div style="font-size:9pt; font-weight:700;">Confidential</div>
                    </div>
                </div>
                <table class="memo-meta-table">
                    <tr><td class="memo-label">To:</td><td>Investment Committee, {{CLIENT_NAME}}</td></tr>
                    <tr><td class="memo-label">From:</td><td>Director of Technology Transfer</td></tr>
                    <tr><td class="memo-label">Date:</td><td>{{REPORT_DATE}}</td></tr>
                    <tr><td class="memo-label">Re:</td><td style="font-weight:700;">COMMERCIALIZATION VIABILITY ASSESSMENT</td></tr>
                </table>
                <div class="memo-body">
                    "{{INSIGHTS_NARRATIVE}}"
                </div>
                <div class="memo-sig">
                    <div>Dr. Arcus A.I.</div>
                    <div>Senior Director, Technology Transfer</div>
                    <div>Signed Electronically</div>
                </div>
            </div>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 38</span>
        </div>
    </div>

    <!-- 8.2 STRATEGIC MANDATES (Separate Page) -->
    <div class="page">
        <div class="header">
            <div class="header-left">Insights</div>
            <div class="header-right">8.2 Strategic Mandates</div>
        </div>
        <div class="content">
            <h2>Strategic Mandates</h2>
            <p style="margin-bottom: 10mm;">Critical directives required to proceed with investment or development.</p>
            <div class="grid-3">
                {{INSIGHTS_RECS}}
            </div>
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 39</span>
        </div>
    </div>

    <!-- 9.0 APPENDIX -->
    <div class="page">
        <div class="header">
            <div class="header-left">Appendix</div>
            <div class="header-right">9.0 Concept Imagery</div>
        </div>
        <div class="content">
            <h2>Product Concept</h2>
            {{PRODUCT_CONCEPT_IMAGE}}
        </div>
        <div class="footer">
            <span>Confidential</span>
            <span>Page 40</span>
        </div>
    </div>

</body>
</html>
`;
