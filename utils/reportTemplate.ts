
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
        /* --- DESIGN SYSTEM: "Obsidian & Gold" Premium Theme --- */
        :root {
            /* Core Brand Colors */
            --color-primary: #0f172a;      /* Deepest Navy/Slate */
            --color-primary-light: #334155;
            --color-secondary: #0ea5e9;    /* Vivid Sky Blue */
            --color-accent: #d97706;       /* Deep Gold mixed with Amber */
            
            /* Risk Indicators (Sophisticated Palette) */
            --color-risk-critical: #be123c; /* Rose 700 */
            --color-risk-high: #e11d48;     /* Rose 600 */
            --color-risk-med: #f59e0b;      /* Amber 500 */
            --color-risk-low: #10b981;      /* Emerald 500 */
            --color-neutral: #64748b;
            
            /* Backgrounds & Surfaces */
            --bg-body: #525659;
            --bg-page: #ffffff;
            --bg-subtle: #f8fafc;
            --bg-dark: #1e293b;
            
            /* Borders */
            --border-light: #e2e8f0;
            --border-med: #cbd5e1;
            --border-accent: #0ea5e9;

            /* Typography */
            --font-display: 'Playfair Display', serif;
            --font-body: 'Inter', sans-serif;
            --font-mono: 'JetBrains Mono', monospace;
        }

        /* Markdown Styling */
        .markdown-content p { margin-bottom: 8px; line-height: 1.5; font-size: 9pt; }
        .markdown-content ul { padding-left: 18px; margin-bottom: 8px; }
        .markdown-content li { margin-bottom: 4px; font-size: 9pt; }
        .markdown-content strong { color: var(--color-primary); font-weight: 700; }

        /* Section Cover CSS moved to end of style block for proper cascade */
        
        /* Abstract background shapes to enhance glass refraction */
        .page-section::before {
            content: "";
            position: absolute;
            top: -50%; left: -50%; width: 200%; height: 200%;
            background: 
                radial-gradient(circle at 80% 20%, rgba(14, 165, 233, 0.15) 0%, transparent 40%),
                radial-gradient(circle at 20% 80%, rgba(217, 119, 6, 0.1) 0%, transparent 40%);
            z-index: 0;
            animation: rotate 60s linear infinite; /* Optional subtle movement if supported, otherwise static */
        }

        .section-watermark {
            position: absolute;
            font-family: var(--font-display);
            font-size: 180pt; /* Slightly smaller to ensure fit */
            font-weight: 900;
            color: rgba(255,255,255,0.02);
            z-index: 1;
            line-height:1;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-10deg); /* Center the watermark */
            white-space: nowrap;
            pointer-events: none;
        }

        .section-content {
            position: relative;
            z-index: 10;
            text-align: center;
            
            /* Glassmorphism Core */
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            
            /* Borders & Shadows */
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-top: 1px solid rgba(255, 255, 255, 0.25); /* Highlight top border */
            border-bottom: 1px solid rgba(255, 255, 255, 0.05); /* Subtler bottom */
            box-shadow: 
                0 25px 50px -12px rgba(0, 0, 0, 0.5), /* Deep shadow */
                inset 0 0 0 1px rgba(255, 255, 255, 0.05); /* Inner light ring */
            
            padding: 25mm 20mm;
            border-radius: 4px; /* Slightly tighter radius */
            width: 130mm; /* Slightly narrower for elegance */
        }

        .section-num {
            font-family: var(--font-display);
            font-size: 80pt; /* Larger */
            font-weight: 900;
            background: linear-gradient(135deg, var(--color-accent) 0%, #fbbf24 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1;
            margin-bottom: 5mm;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
        }

        .section-name {
            font-family: var(--font-display);
            font-size: 36pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 4px; /* More airy */
            margin-bottom: 8mm;
            color: #ffffff;
            border-bottom: 1px solid rgba(255,255,255,0.3); /* Integrated separator */
            display: inline-block;
            padding-bottom: 4mm;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .section-desc {
            font-family: var(--font-body);
            font-size: 13pt;
            font-weight: 300;
            color: #cbd5e1;
            max-width: 100mm;
            margin: 0 auto;
            line-height: 1.6;
            letter-spacing: 0.5px;
        }

        /* Graveyard Updates */
        .graveyard-item {
            border-left: 3px solid #ef4444; 
            padding-left: 15px; 
            margin-bottom: 15px;
            background: #fef2f2;
            padding: 10px 15px;
        }

        /* Memo Updates */
        .memo-container { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        
        @page {
            size: 8.5in 11in;
            margin: 0;
            marks: none;
        }
        
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
        }

        body {
            font-family: var(--font-body);
            background-color: var(--bg-body);
            font-size: 9pt;
            color: var(--color-primary-light);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }

        /* --- PAGE CONTAINER --- */
        .page {
            width: 8.5in;
            height: 11in;
            background: var(--bg-page);
            position: relative;
            margin: 0 auto 20px auto;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
            }
        }

        /* --- GLOBAL LAYOUT --- */
        .header {
            height: 16mm;
            padding: 0 15mm;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid var(--color-primary);
            margin-top: 10mm;
            margin-bottom: 8mm;
            flex-shrink: 0;
        }
        
        .content {
            padding: 0 15mm;
            flex-grow: 1;
            overflow: hidden;
            position: relative;
        }

        .footer {
            height: 12mm;
            padding: 0 15mm;
            border-top: 1px solid var(--border-light);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 7pt;
            color: var(--color-neutral);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 500;
            margin-bottom: 8mm; /* Bottom margin of page */
            flex-shrink: 0;
        }

        /* --- TYPOGRAPHY --- */
        h1, h2, h3, h4 { margin: 0; color: var(--color-primary); }
        
        h1 {
            font-family: var(--font-display);
            font-size: 28pt;
            font-weight: 700;
            line-height: 1;
            letter-spacing: -0.5px;
            margin-bottom: 8mm;
            color: var(--color-primary);
        }

        h2 {
            font-family: var(--font-display);
            font-size: 18pt;
            font-weight: 600;
            margin-bottom: 4mm;
            color: var(--color-primary);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        h2::before {
            content: '';
            display: block;
            width: 4px;
            height: 18pt; /* Match font size roughly */
            background: var(--color-accent);
            border-radius: 1px;
        }

        h3 {
            font-family: var(--font-body);
            font-size: 9pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--color-neutral);
            margin-bottom: 2mm;
            border-bottom: 1px solid var(--border-light);
            padding-bottom: 1mm;
            display: inline-block;
        }
        
        /* Special Case: Card Headers shouldn't have the underline usually, but let's see */
        .card h3 {
            border-bottom: none;
            padding-bottom: 0;
            color: var(--color-primary-light);
            margin-bottom: 3mm;
        }

        p {
            margin-top: 0;
            margin-bottom: 4mm;
            text-align: justify;
            hyphens: auto;
        }

        /* --- COMPONENTS --- */
        
        /* Cards */
        .card {
            background: white;
            border: 1px solid var(--border-light);
            padding: 6mm;
            margin-bottom: 6mm;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        
        .card.highlight {
            background: var(--bg-subtle);
            border: 1px solid var(--border-med);
            border-left: 4px solid var(--color-primary);
        }
        
        .card.accent {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-left: 4px solid var(--color-secondary);
        }

        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8.5pt;
            margin-bottom: 6mm;
        }
        
        th {
            text-align: left;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 7.5pt;
            color: var(--color-primary);
            border-top: 2px solid var(--color-primary);
            border-bottom: 1px solid var(--color-primary);
            padding: 3mm 2mm;
            letter-spacing: 0.5px;
            background-color: var(--bg-subtle);
        }
        
        td {
            border-bottom: 1px solid var(--border-light);
            padding: 3mm 2mm;
            vertical-align: top;
            color: var(--color-primary-light);
        }
        
        tbody tr:last-child td {
            border-bottom: 1px solid var(--color-primary); /* Closure line */
        }
        
        /* Badges */
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 2px 8px;
            border-radius: 9999px; /* Pill shape */
            font-size: 6.5pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            line-height: 1.2;
        }
        
        .badge-green { background: #dcfce7; color: #15803d; }
        .badge-amber { background: #fef3c7; color: #b45309; }
        .badge-red   { background: #ffe4e6; color: #be123c; }
        .badge-blue  { background: #e0f2fe; color: #0369a1; }
        .badge-slate { background: #f1f5f9; color: #64748b; }

        /* Grid Utilities */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6mm; }
        .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 4mm; }

        /* Statistics */
        .stat-card {
            padding: 4mm;
            border-left: 1px solid var(--border-light);
        }
        .stat-val {
            display: block;
            font-family: var(--font-display);
            font-size: 18pt;
            font-weight: 700;
            color: var(--color-primary);
            line-height: 1.1;
            margin-bottom: 1mm;
        }
        .stat-lbl {
            font-size: 7pt;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--color-neutral);
            letter-spacing: 1px;
        }

        /* Lists */
        ul.clean-list { list-style: none; padding: 0; margin: 0; }
        ul.clean-list li {
            position: relative;
            padding-left: 4mm;
            margin-bottom: 2mm;
            font-size: 9pt;
        }
        ul.clean-list li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: var(--color-accent);
            font-weight: bold;
        }

        /* 2-Column Text */
        .two-col-text {
            column-count: 2;
            column-gap: 8mm;
            widows: 2;
            orphans: 2;
        }

        /* --- SPECIFIC PAGES --- */
        
        /* Cover Page */
        .page-cover {
            background-color: var(--color-primary);
            color: white;
            padding: 0; /* Reset standard padding */
            display: flex;
            flex-direction: column;
        }
        
        .cover-content {
            padding: 20mm;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(30,41,59,1) 100%);
            position: relative;
        }
        
        /* Decorative Geomtery */
        .cover-accent-bar {
            position: absolute;
            top: 0;
            left: 20mm;
            width: 4px;
            height: 40mm;
            background: var(--color-accent);
        }

        .cover-title {
            font-family: var(--font-display);
            font-size: 42pt;
            font-weight: 600;
            line-height: 1.1;
            margin-bottom: 5mm;
            color: white;
        }
        
        .cover-subtitle {
            font-family: var(--font-body);
            font-size: 14pt;
            font-weight: 300;
            color: #94a3b8;
            max-width: 80%;
        }

        .cover-meta {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15mm;
            padding-top: 10mm;
            border-top: 1px solid rgba(255,255,255,0.15);
        }
        
        .meta-item label {
            display: block;
            font-size: 7pt;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #64748b;
            margin-bottom: 2mm;
        }
        .meta-item div {
            font-size: 11pt;
            color: white;
            font-family: var(--font-display);
        }

        /* Section Breaks */
        /* Legacy Section CSS Removed to prevent conflict with Glassmorphism */

        /* ToC */
        .toc-item {
            display: flex;
            align-items: baseline;
            margin-bottom: 4mm;
            border-bottom: 1px dotted var(--border-med);
            padding-bottom: 1mm;
        }
        .toc-num { width: 30px; color: var(--color-accent); font-weight: 700; font-family: var(--font-mono); }
        .toc-name { flex: 1; font-weight: 600; color: var(--color-primary); }
        .toc-page { color: var(--color-neutral); font-family: var(--font-mono); }

        /* Risk Dashboard */
        .risk-gauge-container {
            display: flex;
            align-items: center;
            gap: 10mm;
            padding: 8mm;
            background: var(--bg-subtle);
            border-radius: 8px;
            margin-bottom: 8mm;
        }
        
        .risk-gauge {
            width: 35mm;
            height: 35mm;
            border-radius: 50%;
            background: conic-gradient(var(--risk-color) 0% var(--risk-percent), #cbd5e1 var(--risk-percent) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .risk-gauge::after {
            content: '';
            position: absolute;
            width: 28mm;
            height: 28mm;
            background: var(--bg-subtle);
            border-radius: 50%;
        }
        .risk-value {
            position: relative;
            z-index: 2;
            text-align: center;
        }
        .risk-score-big { font-size: 20pt; font-weight: 800; color: var(--color-primary); display: block; line-height: 1; }
        .risk-lbl-small { font-size: 6pt; text-transform: uppercase; color: var(--color-neutral); font-weight: 700; }

        /* Memo Style */
        .memo-classic {
            font-family: 'Georgia', serif;
            background: white;
            border-top: 5px solid var(--color-primary);
            padding: 8mm 12mm; /* Reduced padding to ensure fit */
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        
        /* Section Cover Updates - Premium Glassmorphism (Moved here for Cascade) */
        .page-section {
            /* Richer, darker gradient for better contrast with glass */
            background: radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%);
            display: flex; 
            flex-direction: column;
            justify-content: center !important; /* FORCE CENTERING */
            align-items: center !important; /* FORCE CENTERING */
            position: relative;
            overflow: hidden;
            color: #ffffff;
            /* Strict Dimensions to match .page */
            height: 11in !important; 
            width: 8.5in !important;
            padding: 0 !important; /* Reset any page padding */
            margin: 0 !important; /* Override .page auto margins explicitly if needed for print */
        }
        .memo-meta {
            border-bottom: 2px solid #000;
            padding-bottom: 4mm;
            margin-bottom: 6mm;
            flex-shrink: 0;
        }

    </style>
</head>
<body>

    <!-- COVER PAGE -->
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

    <!-- TOC -->
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
                <div class="toc-item"><span class="toc-num">03</span><span class="toc-name">IP Deep Dive</span><span class="toc-page">14</span></div>
                <div class="toc-item"><span class="toc-num">04</span><span class="toc-name">Market Dynamics</span><span class="toc-page">20</span></div>
                <div class="toc-item"><span class="toc-num">05</span><span class="toc-name">Regulatory & Compliance</span><span class="toc-page">27</span></div>
                <div class="toc-item"><span class="toc-num">06</span><span class="toc-name">Financial Roadmap</span><span class="toc-page">30</span></div>
                <div class="toc-item"><span class="toc-num">07</span><span class="toc-name">Strategic Outlook</span><span class="toc-page">34</span></div>
                <div class="toc-item"><span class="toc-num">08</span><span class="toc-name">Director's Insights</span><span class="toc-page">37</span></div>
                <div class="toc-item"><span class="toc-num">09</span><span class="toc-name">Appendix</span><span class="toc-page">40</span></div>
            </div>
        </div>
        <div class="footer">
            <span>Confidential Assessment</span>
            <span>Page 02</span>
        </div>
    </div>

    <!-- SECTION 01 -->
    <div class="page page-section">
        <div class="section-watermark">01</div>
        <div class="section-content">
            <div class="section-num">01</div>
            <div class="section-name">Executive Summary</div>
            <div class="section-desc">Strategic overview of risk, strengths, and commercial viability.</div>
        </div>
    </div>

    <!-- 1.1 RISK PROFILE -->
    <div class="page">
        <div class="header">
            <h3>Executive Summary</h3>
            <div style="font-family:var(--font-display); font-size:11pt; color:var(--color-primary);">1.1 Risk Profile</div>
        </div>
        <div class="content">
            <div class="risk-gauge-container" style="--risk-color: {{RISK_COLOR}}; --risk-percent: {{RISK_SCORE}}%;">
                <div class="risk-gauge">
                    <div class="risk-value">
                        <span class="risk-score-big">{{RISK_SCORE}}</span>
                        <span class="risk-lbl-small">INDEX</span>
                    </div>
                </div>
                <div style="flex:1;">
                    <div style="font-size:7pt; font-weight:700; color:var(--color-neutral); text-transform:uppercase; margin-bottom:5px;">Composite Status</div>
                    <div style="font-family:var(--font-display); font-size:24pt; font-weight:700; color:var(--color-primary); margin-bottom:5px; line-height:1;">{{RISK_LEVEL_TEXT}}</div>
                    <div style="font-size:9pt; color:var(--color-primary-light);">{{RISK_COUNTS_TEXT}}</div>
                </div>
                <!-- Callout Box Style -->
                <div style="border-left:1px solid var(--border-med); padding-left:8mm; max-width: 40%;">
                    <div style="font-size:7pt; font-weight:700; color:var(--color-accent); text-transform:uppercase; margin-bottom:3px;">Advisor Note</div>
                    <p style="font-size:8pt; font-style:italic; margin:0; color:var(--color-primary-light);">"Instant snapshot of technical and market viability based on {{RISK_SCORE}} distinct data points."</p>
                </div>
            </div>

            <div style="display: flex; align-items: baseline; margin-bottom: 4mm; border-bottom: 2px solid var(--color-primary); padding-bottom: 2mm;">
                <h2 style="margin:0; border:none; padding:0; font-size:14pt;">Executive Narrative</h2>
            </div>
            
            <div class="two-col-text markdown-content">
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
        <div class="section-watermark">02</div>
        <div class="section-content">
            <div class="section-num">02</div>
            <div class="section-name">Technology Forensics</div>
            <div class="section-desc">Deep-dive technical due diligence, core technology validation, and TRL.</div>
        </div>
    </div>

    <!-- 2.1 OVERVIEW -->
    <div class="page">
        <div class="header">
            <h3>Tech Forensics</h3>
            <div style="font-family:var(--font-display); font-size:11pt; color:var(--color-primary);">2.1 Architecture</div>
        </div>
        <div class="content">
            <!-- Key Technical Insight Box -->
            <div class="card highlight" style="margin-bottom: 8mm;">
                <h3 style="border:none; margin-bottom:2mm; color:var(--color-primary);"><i class="fa-solid fa-microchip" style="color:var(--color-accent); margin-right:8px;"></i>System Architecture</h3>
                <div class="markdown-content" style="color:var(--color-primary);">{{TECH_OVERVIEW}}</div>
            </div>
            
            <div class="grid-2">
                <div>
                    <h3 style="margin-bottom:4mm;">Core Features</h3>
                    <ul class="clean-list">{{CORE_FEATURES}}</ul>
                </div>
                <div style="background:var(--bg-subtle); padding:5mm; border-radius:4px; border:1px solid var(--border-light);">
                    <h3 style="margin-bottom:4mm;">Differentiation</h3>
                    <p style="font-size:8.5pt; color:var(--color-neutral);">The following architectural decisions provide significant competitive separation:</p>
                    <ul class="clean-list">
                        <li><span style="font-weight:700; color:var(--color-primary);">Modular Design:</span> Allows for rapid scalability.</li>
                        <li><span style="font-weight:700; color:var(--color-primary);">Audit Trail:</span> Immutable logging built-in.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer">
            <span>Confidential Assessment</span>
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
        <div class="section-watermark">03</div>
        <div class="section-content">
            <div class="section-num">03</div>
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
            <h3>IP Analysis</h3>
            <div style="font-family:var(--font-display); font-size:11pt; color:var(--color-primary);">3.2 Whitespace Strategy</div>
        </div>
        <div class="content">
            <h2 style="margin-bottom:6mm;">Whitespace Analysis</h2>
            
            <!-- Opportunity Box -->
            <div class="card" style="background:#f0fdf4; border:1px solid #bbf7d0; border-left:4px solid #16a34a;">
                <div style="display:flex; gap:4mm;">
                    <div style="font-size:16pt; color:#16a34a; padding-top:2px;"><i class="fa-solid fa-magnifying-glass-chart"></i></div>
                    <div style="flex:1;">
                        <h3 style="color:#166534; border:none; margin-bottom:2mm; padding:0; background:transparent;">Identified Opportunities</h3>
                        <div class="markdown-content" style="color:#14532d; font-size:9pt; margin:0; font-weight:500;">{{WHITESPACE_TEXT}}</div>
                    </div>
                </div>
            </div>

            <h2 style="margin-top: 10mm;">Licensing & Partnership Strategy</h2>
            <div class="card">
                <div class="grid-2">
                    <div>
                        <h3 style="color:var(--color-accent);"><i class="fa-solid fa-bullseye" style="margin-right:6px;"></i>Targets</h3>
                        <p style="font-weight: 700; font-family: var(--font-display); font-size: 11pt; color:var(--color-primary);">{{WHITESPACE_TARGETS}}</p>
                    </div>
                    <div>
                        <h3 style="color:var(--color-accent);"><i class="fa-solid fa-handshake" style="margin-right:6px;"></i>Model</h3>
                        <p>{{WHITESPACE_MODEL}}</p>
                    </div>
                </div>
                <div style="margin-top: 6mm; border-top: 1px dashed var(--border-med); padding-top: 4mm;">
                    <div style="font-size:7pt; font-weight:700; text-transform:uppercase; color:var(--color-neutral); margin-bottom:2mm;">Strategic Rationale</div>
                    <p style="font-style:italic; font-family:var(--font-display); color:var(--color-primary-light); font-size:10pt;">"{{WHITESPACE_RATIONALE}}"</p>
                </div>
            </div>
        </div>
        <div class="footer">
            <span>Confidential Assessment</span>
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
        <div class="section-watermark">04</div>
        <div class="section-content">
            <div class="section-num">04</div>
            <div class="section-name">Market Dynamics</div>
            <div class="section-desc">Competitive intelligence, industry trends, and failure mode analysis.</div>
        </div>
    </div>

    <!-- 4.1 OUTLOOK -->
    <div class="page">
        <div class="header">
            <h3>Market Dynamics</h3>
            <div style="font-family:var(--font-display); font-size:11pt; color:var(--color-primary);">4.1 Industry Outlook</div>
        </div>
        <div class="content">
            <h2 style="margin-bottom:6mm;">Market Sizing</h2>
            <div class="grid-3" style="margin-bottom:10mm;">
                <div class="stat-card">
                    <div style="font-size:10pt; color:var(--color-accent); margin-bottom:2mm;"><i class="fa-solid fa-globe"></i></div>
                    <span class="stat-val">{{TAM}}</span>
                    <span class="stat-lbl">Global TAM</span>
                </div>
                <div class="stat-card">
                    <div style="font-size:10pt; color:var(--color-accent); margin-bottom:2mm;"><i class="fa-solid fa-bullseye"></i></div>
                    <span class="stat-val">{{SAM}}</span>
                    <span class="stat-lbl">Serviceable Market</span>
                </div>
                <div class="stat-card">
                    <div style="font-size:10pt; color:var(--color-accent); margin-bottom:2mm;"><i class="fa-solid fa-arrow-trend-up"></i></div>
                    <span class="stat-val">{{CAGR}}</span>
                    <span class="stat-lbl">CAGR {{FORECAST}}</span>
                </div>
            </div>

            <div class="grid-2">
                <div class="card highlight">
                    <h3 style="color:var(--color-primary);"><i class="fa-solid fa-rocket" style="color:#0ea5e9; margin-right:8px;"></i>Growth Drivers</h3>
                    <ul class="clean-list">{{DRIVERS_LIST}}</ul>
                </div>
                <div class="card highlight">
                    <h3 style="color:var(--color-primary);"><i class="fa-solid fa-bolt" style="color:#f59e0b; margin-right:8px;"></i>Emerging Trends</h3>
                    <ul class="clean-list">{{TRENDS_LIST}}</ul>
                </div>
            </div>
        </div>
        <div class="footer">
            <span>Confidential Assessment</span>
            <span>Page 21</span>
        </div>
    </div>

    <!-- 4.2 GRAVEYARD -->
    <div class="page">
        <div class="header">
            <h3>Market Dynamics</h3>
            <div style="font-family:var(--font-display); font-size:11pt; color:var(--color-primary);">4.2 Failure Analysis</div>
        </div>
        <div class="content">
            <h2 style="margin-bottom:6mm;">The Reference Graveyard</h2>
            
            <div class="card" style="background:#fef2f2; border:1px solid #fecaca; border-left:4px solid #ef4444; margin-bottom:8mm;">
                <div style="display:flex; gap:4mm;">
                    <div style="font-size:16pt; color:#ef4444; padding-top:2px;"><i class="fa-solid fa-triangle-exclamation"></i></div>
                    <div style="flex:1;">
                        <h3 style="color:#991b1b; border:none; margin-bottom:2mm; padding:0; background:transparent;">Cautionary Tales</h3>
                        <div class="markdown-content" style="color:#7f1d1d; font-size:9pt; margin:0;">{{GRAVEYARD_INTRO}}</div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4mm;">
                {{GRAVEYARD_BLOCK}}
            </div>
        </div>
        <div class="footer">
            <span>Confidential Assessment</span>
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
            <h3>Market Dynamics</h3>
            <div style="font-family:var(--font-display); font-size:11pt; color:var(--color-primary);">4.5 Beachhead Strategy</div>
        </div>
        <div class="content">
            <h2 style="margin-bottom:6mm;">Ideal Customer Profile</h2>
            
            <!-- Persona Card -->
            <div class="card highlight" style="display:flex; flex-direction:column; gap:6mm;">
                <div style="border-bottom:1px solid var(--border-light); padding-bottom:4mm; display:flex; gap:4mm; align-items:center;">
                    <div style="width:12mm; height:12mm; background:var(--color-primary); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white;">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div>
                        <div style="font-size:7pt; text-transform:uppercase; color:var(--color-neutral); font-weight:700;">Primary Persona</div>
                        <div style="font-size:12pt; font-weight:700; color:var(--color-primary);">{{BEACHHEAD_PROFILE}}</div>
                    </div>
                </div>
                
                <div class="grid-3">
                    <div>
                        <h3 style="border:none; margin-bottom:1mm;"><i class="fa-solid fa-heart-crack" style="color:var(--color-risk-high); margin-right:5px; font-size:8pt;"></i>Pain Point</h3>
                        <p style="font-size:8.5pt;">{{BEACHHEAD_PAIN}}</p>
                    </div>
                    <div>
                        <h3 style="border:none; margin-bottom:1mm;"><i class="fa-solid fa-sliders" style="color:var(--color-accent); margin-right:5px; font-size:8pt;"></i>Adoption Friction</h3>
                        <p style="font-size:8.5pt;">{{BEACHHEAD_TOLERANCE}}</p>
                    </div>
                    <div>
                        <h3 style="border:none; margin-bottom:1mm;"><i class="fa-solid fa-chart-pie" style="color:var(--color-secondary); margin-right:5px; font-size:8pt;"></i>Segment Size</h3>
                        <p style="font-size:14pt; font-weight:700; color:var(--color-primary);">{{BEACHHEAD_SIZE}}</p>
                    </div>
                </div>
            </div>

            <h2 style="margin-top:10mm;">Acquisition Roadmap</h2>
            <table>
                <thead><tr><th>Milestone</th><th>Strategy</th><th>Timeline</th></tr></thead>
                <tbody>{{ACQUISITION_ROWS}}</tbody>
            </table>
        </div>
        <div class="footer">
            <span>Confidential Assessment</span>
            <span>Page 26</span>
        </div>
    </div>

    <!-- SECTION 05 -->
    <div class="page page-section">
        <div class="section-watermark">05</div>
        <div class="section-content">
            <div class="section-num">05</div>
            <div class="section-name">Regulatory & Compliance</div>
            <div class="section-desc">Sector-specific classification, comparable systems, and standards.</div>
        </div>
    </div>

    <!-- 5.1 REGULATORY -->
    <div class="page">
        <div class="header">
            <h3>Regulatory Landscape</h3>
            <div style="font-family:var(--font-display); font-size:11pt; color:var(--color-primary);">5.1 Classification</div>
        </div>
        <div class="content">
            <h2 style="margin-bottom:6mm;">Regulatory Framework</h2>
            <div class="grid-3" style="margin-bottom:10mm;">
                <div class="stat-card">
                    <div style="font-size:10pt; color:var(--color-neutral); margin-bottom:2mm;"><i class="fa-solid fa-file-contract"></i></div>
                    <span class="stat-val" style="font-size:14pt;">{{DEVICE_CLASS}}</span>
                    <span class="stat-lbl">Class / Standard</span>
                </div>
                <div class="stat-card">
                    <div style="font-size:10pt; color:var(--color-neutral); margin-bottom:2mm;"><i class="fa-solid fa-route"></i></div>
                    <span class="stat-val" style="font-size:14pt;">{{REG_PATHWAY}}</span>
                    <span class="stat-lbl">Pathway</span>
                </div>
                <div class="stat-card">
                    <div style="font-size:10pt; color:var(--color-neutral); margin-bottom:2mm;"><i class="fa-solid fa-hourglass-half"></i></div>
                    <span class="stat-val" style="font-size:14pt;">{{REG_TIMELINE}}</span>
                    <span class="stat-lbl">Est. Timeline</span>
                </div>
            </div>
            
            <div class="card highlight">
               <h3 style="border:none; margin-bottom:2mm;"><i class="fa-solid fa-scale-balanced" style="color:var(--color-primary); margin-right:8px;"></i>Compliance Assessment</h3>
               <div class="markdown-content" style="margin:0;">{{REG_NARRATIVE}}</div>
            </div>
        </div>
        <div class="footer">
            <span>Confidential Assessment</span>
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
        <div class="section-watermark">06</div>
        <div class="section-content">
            <div class="section-num">06</div>
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
            <h3>Financial Roadmap</h3>
            <div style="font-family:var(--font-display); font-size:11pt; color:var(--color-primary);">6.2 Economics</div>
        </div>
        <div class="content">
            <h2 style="margin-bottom:6mm;">Unit Economics</h2>
            <table>
                <thead><tr><th>Component/Service</th><th>Cost</th><th>Supplier/Source</th></tr></thead>
                <tbody>{{BOM_ROWS}}</tbody>
            </table>
            
            <div class="grid-3" style="margin-top:10mm;">
                <div class="stat-card">
                    <span class="stat-lbl" style="display:block; margin-bottom:2mm;">Target Price</span>
                    <span class="stat-val">{{TARGET_ASP}}</span>
                </div>
                <div class="stat-card" style="background:#f0fdf4; border-color:#bbf7d0;">
                    <span class="stat-lbl" style="display:block; margin-bottom:2mm; color:#15803d;">Gross Margin</span>
                    <span class="stat-val" style="color:#15803d;">{{GROSS_MARGIN}}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-lbl" style="display:block; margin-bottom:2mm;">COGS</span>
                    <span class="stat-val">{{COGS}}</span>
                </div>
            </div>
        </div>
        <div class="footer">
            <span>Confidential Assessment</span>
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
        <div class="section-watermark">07</div>
        <div class="section-content">
            <div class="section-num">07</div>
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
            <h3>Strategic Outlook</h3>
            <div style="font-family:var(--font-display); font-size:11pt; color:var(--color-primary);">7.2 Decision Matrix</div>
        </div>
        <div class="content">
            <h2 style="margin-bottom:6mm;">Go/No-Go Decision Framework</h2>
            <div class="grid-2">
                <div class="card" style="background:#ecfdf5; border:1px solid #a7f3d0; border-top:4px solid #10b981;">
                    <div style="display:flex; align-items:center; gap:3mm; margin-bottom:4mm; border-bottom:1px solid #a7f3d0; padding-bottom:2mm;">
                        <i class="fa-solid fa-check-circle" style="color:#10b981; font-size:14pt;"></i>
                        <h3 style="color:#064e3b; border:none; padding:0; margin:0; background:transparent;">Green Light Conditions</h3>
                    </div>
                    <ul style="color:#065f46; padding-left:4mm; margin:0; line-height: 1.8; font-size:9pt; list-style-type:circle;">{{GO_CRITERIA}}</ul>
                </div>
                <div class="card" style="background:#fff1f2; border:1px solid #fecdd3; border-top:4px solid #f43f5e;">
                    <div style="display:flex; align-items:center; gap:3mm; margin-bottom:4mm; border-bottom:1px solid #fecdd3; padding-bottom:2mm;">
                        <i class="fa-solid fa-circle-stop" style="color:#f43f5e; font-size:14pt;"></i>
                        <h3 style="color:#881337; border:none; padding:0; margin:0; background:transparent;">Kill / Pivot Triggers</h3>
                    </div>
                    <ul style="color:#9f1239; padding-left:4mm; margin:0; line-height: 1.8; font-size:9pt; list-style-type:circle;">{{NOGO_CRITERIA}}</ul>
                </div>
            </div>
        </div>
        <div class="footer">
            <span>Confidential Assessment</span>
            <span>Page 36</span>
        </div>
    </div>

    <!-- SECTION 08 -->
    <div class="page page-section">
        <div class="section-watermark">08</div>
        <div class="section-content">
            <div class="section-num">08</div>
            <div class="section-name">Director's Insights</div>
            <div class="section-desc">Unvarnished synthesis and strategic mandates from the TTO Director.</div>
        </div>
    </div>

    <!-- 8.1 MEMO (Parchment Page) -->
    <div class="page page-memo">
        <div class="header">
            <h3>Director's Insights</h3>
            <div style="font-family:var(--font-display); font-size:11pt; color:var(--color-primary);">8.1 Memorandum</div>
        </div>
        <div class="content" style="display:flex; justify-content:center;">
            <div class="memo-classic" style="width: 100%;">
                <div class="memo-meta">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8mm;">
                        <div style="font-family:var(--font-display); font-weight:900; font-size:18pt; text-transform:uppercase; letter-spacing:-0.5px; color:#000;">Arcus TTO</div>
                        <div style="text-align:right;">
                            <div style="font-size:7pt; font-weight:700; text-transform:uppercase; color:#94a3b8; letter-spacing:1px;">Internal Memo</div>
                            <div style="font-size:9pt; font-weight:700; color:#dc2626;">STRICTLY CONFIDENTIAL</div>
                        </div>
                    </div>
                
                    <table class="memo-meta-table" style="font-family:'Georgia',serif; font-size:10pt;">
                        <tr><td style="width:15mm; font-weight:700; color:#64748b;">TO:</td><td style="font-weight:700;">Investment Committee; {{CLIENT_NAME}}</td></tr>
                        <tr><td style="width:15mm; font-weight:700; color:#64748b;">FROM:</td><td>Director of Technology Transfer</td></tr>
                        <tr><td style="width:15mm; font-weight:700; color:#64748b;">DATE:</td><td>{{REPORT_DATE}}</td></tr>
                        <tr><td style="width:15mm; font-weight:700; color:#64748b;">RE:</td><td style="font-weight:700; text-decoration:underline;">COMMERCIALIZATION VIABILITY ASSESSMENT -- {{TECHNOLOGY_NAME}}</td></tr>
                    </table>
                </div>
                
                <div class="memo-body" style="font-family:'Georgia',serif; font-size:11pt; line-height:1.7;">
                    "{{INSIGHTS_NARRATIVE}}"
                </div>
                
                <div class="memo-sig" style="font-family:'Georgia',serif;">
                    <div style="font-family:'Brush Script MT', cursive; font-size:16pt; margin-bottom:2mm;">Arcus A.I.</div>
                    <div>Dr. Arcus A.I.</div>
                    <div>Senior Director, Technology Transfer</div>
                </div>
            </div>
        </div>
        <div class="footer">
            <span>Confidential Assessment</span>
            <span>Page 38</span>
        </div>
    </div>

    <!-- 8.2 STRATEGIC MANDATES (Separate Page) -->
    <div class="page">
        <div class="header">
            <h3>Director's Insights</h3>
            <div style="font-family:var(--font-display); font-size:11pt; color:var(--color-primary);">8.2 Strategic Mandates</div>
        </div>
        <div class="content">
            <h2 style="margin-bottom:6mm;">Strategic Mandates</h2>
            <div class="card highlight">
                 <h3 style="border:none; margin-bottom:2mm;"><i class="fa-solid fa-gavel" style="color:var(--color-primary); margin-right:8px;"></i>Executive Directives</h3>
                 <p style="margin:0;">Critical directives required to proceed with investment or development.</p>
            </div>
            <div class="grid-3" style="margin-top:10mm;">
                {{INSIGHTS_RECS}}
            </div>
        </div>
        <div class="footer">
            <span>Confidential Assessment</span>
            <span>Page 39</span>
        </div>
    </div>

    <!-- 9.0 APPENDIX -->
    {{PRODUCT_CONCEPT_IMAGE}}

</body>
</html>
`;
