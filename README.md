<div align="center">

# Innovation Compass

### AI-Powered Innovation Assessment & IP Intelligence Platform

[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-CDN-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

**A high-fidelity platform for generating investor-grade Innovation Compass Reports**
*Deep technical forensics • IP landscape analysis • Market reality stress-testing*

[Getting Started](#-getting-started) • [Architecture](#-architecture-overview) • [Features](#-key-features) • [Tutorial](#-usage-tutorial)

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage Tutorial](#-usage-tutorial)
- [Component Reference](#-component-reference)
- [Data Models](#-data-models)
- [AI Integration](#-ai-integration--multi-agent-system)
- [Report Schema](#-report-schema)
- [Configuration](#-configuration)
- [Development Guide](#-development-guide)
- [Troubleshooting](#-troubleshooting)

---

## Overview

**Innovation Compass** is an enterprise-grade platform that leverages Google's Gemini AI to conduct comprehensive innovation assessments. The system orchestrates multiple specialized AI agents to analyze technology claims, intellectual property landscapes, market dynamics, regulatory pathways, and financial viability.

### What It Does

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   📋 Questionnaire     ──►    🤖 AI Analysis    ──►    📊 Comprehensive    │
│      Input                      Engine                   Report            │
│                                                                             │
│   ┌─────────────┐           ┌─────────────┐          ┌─────────────────┐   │
│   │ Innovation  │           │ 6 Parallel  │          │ 50+ Page Report │   │
│   │ Details     │    ──►    │ AI Agents   │   ──►    │ with Scoring    │   │
│   │ Sector Info │           │ Deep CoT    │          │ & Visualizations│   │
│   │ Claims      │           │ Reasoning   │          │ PDF Export      │   │
│   └─────────────┘           └─────────────┘          └─────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Multi-Agent AI Analysis** | 6 specialized AI agents (Technologist, Patent Attorney, Market Strategist, Regulatory Consultant, Commercial Lead, Synthesis Director) work in parallel |
| **Sector-Weighted Scoring** | Deterministic risk scoring with industry-specific weighting for 8 sectors |
| **Interactive Dashboard** | Real-time portfolio KPIs, risk distribution charts, and activity monitoring |
| **AI Chat Assistant** | Context-aware analyst for follow-up questions with Google Search integration |
| **Product Visualizer** | AI-powered concept image generation using Gemini's vision models |
| **Print-Ready Reports** | Professional HTML/PDF export with investor-grade formatting |
| **Technology Readiness Levels** | TRL 1-9 assessment with subsystem-level granularity |
| **IP Deep Dive** | Patent landscape analysis, FTO assessment, and filing strategy recommendations |

---

## Technology Stack

<div align="center">

### Frontend

```
┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                           │
├───────────────┬───────────────┬────────────────┬────────────────┤
│    React      │  TypeScript   │  Tailwind CSS  │   Font Awesome │
│    19.2.3     │    5.8.2      │     (CDN)      │     6.4.0      │
│               │               │                │                │
│  Component    │ Static Type   │  Utility-First │  Icon Library  │
│  Framework    │   Checking    │     CSS        │                │
└───────────────┴───────────────┴────────────────┴────────────────┘
```

### Build & Development

```
┌──────────────────────────────────────────────────────────────────┐
│                      BUILD TOOLCHAIN                             │
├──────────────────────────┬───────────────────────────────────────┤
│         Vite 6.2.0       │            Node.js                    │
│                          │                                       │
│   • Lightning-fast HMR   │   • ES Modules (type: "module")       │
│   • ES Module Bundling   │   • Development Server                │
│   • Environment Vars     │   • Port 3000 (0.0.0.0)               │
└──────────────────────────┴───────────────────────────────────────┘
```

### AI & External Services

```
┌──────────────────────────────────────────────────────────────────┐
│                     AI & SERVICES                                │
├────────────────┬────────────────┬────────────────┬──────────────┤
│ Google Gemini  │    marked.js   │    jsPDF       │ Google Fonts │
│   @google/     │     15.0.0     │    2.5.1       │              │
│   genai 1.34.0 │                │                │  Plus Jakarta│
│                │  Markdown to   │ PDF Generation │  Inter       │
│ • Flash Model  │    HTML        │   Library      │  JetBrains   │
│ • Pro Vision   │  Rendering     │                │  Mono        │
│ • Search Tool  │                │                │              │
└────────────────┴────────────────┴────────────────┴──────────────┘
```

</div>

### Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.3 | UI component framework |
| `react-dom` | ^19.2.3 | React DOM bindings |
| `@google/genai` | ^1.34.0 | Google Gemini AI SDK |
| `marked` | 15.0.0 | Markdown parsing |
| `jspdf` | 2.5.1 | PDF generation |
| `typescript` | ~5.8.2 | Static type checking |
| `vite` | ^6.2.0 | Build tool & dev server |

---

## Architecture Overview

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              INNOVATION COMPASS PLATFORM                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                           PRESENTATION LAYER                                 │   │
│  │                                                                              │   │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │   │
│  │   │Dashboard │  │Assessment│  │ Report   │  │  Chat    │  │Visualizer│     │   │
│  │   │          │  │ Library  │  │  Wizard  │  │ Assistant│  │          │     │   │
│  │   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │   │
│  │        │              │              │              │              │          │   │
│  └────────┼──────────────┼──────────────┼──────────────┼──────────────┼──────────┘   │
│           │              │              │              │              │              │
│           ▼              ▼              ▼              ▼              ▼              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                           APPLICATION LAYER                                  │   │
│  │                                                                              │   │
│  │   ┌──────────────────────────────────────────────────────────────────────┐  │   │
│  │   │                         App.tsx (Root)                                │  │   │
│  │   │  • Tab Navigation    • State Management    • Report Orchestration     │  │   │
│  │   └──────────────────────────────────────────────────────────────────────┘  │   │
│  │                                      │                                       │   │
│  └──────────────────────────────────────┼───────────────────────────────────────┘   │
│                                         │                                           │
│                                         ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                            SERVICE LAYER                                     │   │
│  │                                                                              │   │
│  │   ┌────────────────────────────────────────────────────────────────────┐    │   │
│  │   │                      GeminiService                                  │    │   │
│  │   │                                                                     │    │   │
│  │   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │    │   │
│  │   │  │ generate    │  │ chatWith    │  │ generate    │                 │    │   │
│  │   │  │ Assessment()│  │ Analyst()   │  │ ProductConcept()              │    │   │
│  │   │  └─────────────┘  └─────────────┘  └─────────────┘                 │    │   │
│  │   └────────────────────────────────────────────────────────────────────┘    │   │
│  │                                      │                                       │   │
│  └──────────────────────────────────────┼───────────────────────────────────────┘   │
│                                         │                                           │
│                                         ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                           EXTERNAL SERVICES                                  │   │
│  │                                                                              │   │
│  │   ┌──────────────────────┐  ┌──────────────────────┐                        │   │
│  │   │   Google Gemini AI   │  │   Google Search      │                        │   │
│  │   │                      │  │       Tool           │                        │   │
│  │   │  • gemini-3-flash    │  │                      │                        │   │
│  │   │  • gemini-3-pro      │  │  Market Intelligence │                        │   │
│  │   │    -image-preview    │  │  Real-time Data      │                        │   │
│  │   └──────────────────────┘  └──────────────────────┘                        │   │
│  │                                                                              │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Component Data Flow

```mermaid
flowchart TD
    subgraph UI["User Interface"]
        A[Dashboard] --> B[Assessment Library]
        B --> C[Report Wizard]
        D[Full Report View]
        E[Assistant Chat]
        F[Visualizer]
    end

    subgraph State["State Management"]
        G[App.tsx Root State]
    end

    subgraph Services["Service Layer"]
        H[GeminiService]
        I[Report Generator]
    end

    subgraph External["External APIs"]
        J[Google Gemini API]
        K[Google Search]
    end

    C -->|questionnaire responses| G
    G -->|reports array| A
    G -->|reports array| B
    G -->|selected report| D
    G -->|context data| E

    G -->|generate request| H
    H -->|API calls| J
    H -->|search queries| K
    H -->|AssessmentReport| G

    D -->|export request| I
    I -->|HTML string| D

    E -->|chat message| H
    F -->|image prompt| H
```

### Navigation Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                               APP NAVIGATION                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────┐                                                                │
│  │ SIDEBAR  │                                                                │
│  │          │      ┌────────────────────────────────────────────────────┐   │
│  │ ┌──────┐ │      │                                                    │   │
│  │ │  📊  │─┼──────►              DASHBOARD                             │   │
│  │ └──────┘ │      │   • Portfolio KPIs     • Recent Activity           │   │
│  │          │      │   • Risk Distribution  • Quick Actions             │   │
│  │ ┌──────┐ │      └────────────────────────────────────────────────────┘   │
│  │ │  📁  │─┼──────►              ASSESSMENT LIBRARY                        │
│  │ └──────┘ │      │   • Search & Filter    • Report Cards              │   │
│  │          │      │   • Download/Delete    • Status Indicators         │   │
│  │ ┌──────┐ │      └────────────────────────────────────────────────────┘   │
│  │ │  💬  │─┼──────►              AI ANALYST CHAT                           │
│  │ └──────┘ │      │   • Context Selection  • Markdown Responses        │   │
│  │          │      │   • Thinking Indicators • Search Integration       │   │
│  │ ┌──────┐ │      └────────────────────────────────────────────────────┘   │
│  │ │  🎨  │─┼──────►              PRODUCT VISUALIZER                        │
│  │ └──────┘ │      │   • Concept Prompts    • Image Generation          │   │
│  │          │      │   • Resolution Options • Gallery View              │   │
│  │ ┌──────┐ │      └────────────────────────────────────────────────────┘   │
│  │ │  ⚙️  │─┼──────►              SETTINGS                                  │
│  │ └──────┘ │      │   • API Configuration  • Health Monitoring         │   │
│  │          │      │   • System Status      • Compliance Info           │   │
│  └──────────┘      └────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
innovation-compass/
│
├── 📁 components/                    # React UI Components
│   ├── Sidebar.tsx                   # Navigation sidebar (77 lines)
│   ├── Dashboard.tsx                 # Main dashboard with KPIs (288 lines)
│   ├── AssessmentLibrary.tsx         # Report grid view (120 lines)
│   ├── ReportWizard.tsx              # Multi-step questionnaire (572 lines)
│   ├── FullReportView.tsx            # Detailed report display (1,482 lines)
│   ├── AssistantChat.tsx             # AI chat interface (321 lines)
│   ├── Visualizer.tsx                # Image generation (155 lines)
│   ├── Settings.tsx                  # Configuration panel (194 lines)
│   ├── AssessmentCard.tsx            # Report card component (162 lines)
│   └── Footer.tsx                    # Footer with methodology modal (185 lines)
│
├── 📁 services/
│   └── geminiService.ts              # Gemini AI integration (842 lines)
│
├── 📁 utils/
│   ├── reportGenerator.ts            # HTML report generation (456 lines)
│   └── reportTemplate.ts             # Report HTML template (1,385 lines)
│
├── 📁 data/
│   └── mockReports.ts                # Example report data (35KB)
│
├── 📁 reference-outputs/             # Sample PDF exports
│   ├── Innovation Compass Assessment-004.pdf
│   ├── Innovation Compass Assessment-005-Current.pdf
│   ├── Innovation Compass Assessment-006-Current.pdf
│   └── Innovation Compass Assessment-Edits.pdf
│
├── 📄 App.tsx                        # Root application component
├── 📄 index.tsx                      # React entry point
├── 📄 index.html                     # HTML template with CDN resources
├── 📄 types.ts                       # TypeScript type definitions (436 lines)
├── 📄 vite.config.ts                 # Vite build configuration
├── 📄 tsconfig.json                  # TypeScript configuration
├── 📄 package.json                   # Dependencies & scripts
└── 📄 metadata.json                  # Application metadata
```

### File Size Reference

| Category | Files | Total Lines |
|----------|-------|-------------|
| Components | 10 | ~3,634 |
| Services | 1 | ~842 |
| Utilities | 2 | ~1,841 |
| Types | 1 | ~436 |
| **Total** | **14** | **~6,753** |

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd innovation-compass

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local and add your Gemini API key:
# GEMINI_API_KEY=your_api_key_here

# 4. Start development server
npm run dev
```

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start Vite dev server on port 3000 |
| Build | `npm run build` | Create production build in `dist/` |
| Preview | `npm run preview` | Preview production build locally |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Your Google Gemini API key |

---

## Usage Tutorial

### Step 1: Creating a New Assessment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REPORT WIZARD WORKFLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STEP 1              STEP 2              STEP 3              STEP 4        │
│  ┌─────────┐        ┌─────────┐        ┌─────────┐        ┌─────────┐      │
│  │ Basic   │   ──►  │Technical│   ──►  │ Market  │   ──►  │ IP &    │      │
│  │ Info    │        │ Claims  │        │ Context │        │ Location│      │
│  └─────────┘        └─────────┘        └─────────┘        └─────────┘      │
│                                                                             │
│  • Innovation Name   • Key Components   • Competitors      • IP Status     │
│  • Problem           • Technical        • Differentiation  • Geographic    │
│  • Solution            Claims           • Target Customer    Focus         │
│  • Sector                                                                   │
│  • Stage                                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Questionnaire Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Innovation Name | Short Text | Yes | Name of the technology/product |
| Problem Statement | Long Text | Yes | What problem does it solve? |
| Solution Description | Long Text | Yes | How does your solution work? |
| Sector | Select | Yes | Industry vertical (9 options) |
| Development Stage | Select | Yes | Concept/PoC/Prototype/Pilot |
| Key Technical Components | Multi-Entry | Yes | 3-5 core technology elements |
| Technical Claims | Multi-Entry | Yes | 1-3 key performance claims |
| Competitors | Multi-Entry | Yes | 1-5 existing competitors |
| Differentiation | Long Text | Yes | What makes you different? |
| Target Customer | Long Text | Yes | Who is your ideal customer? |
| IP Status | Select | Yes | Current IP protection level |
| Geographic Focus | Multi-Select | Yes | Target markets |

### Step 2: AI Processing

Once submitted, the platform orchestrates 6 parallel AI agents:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MULTI-AGENT REASONING SYSTEM (MARS)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │                     USER QUESTIONNAIRE INPUT                       │    │
│   └───────────────────────────────────┬───────────────────────────────┘    │
│                                       │                                     │
│                                       ▼                                     │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │                    PARALLEL AGENT EXECUTION                        │    │
│   │                                                                    │    │
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │    │
│   │  │TECHNOLOGIST  │  │PATENT        │  │MARKET        │             │    │
│   │  │              │  │ATTORNEY      │  │STRATEGIST    │             │    │
│   │  │Physics-first │  │Prior art     │  │TAM analysis  │             │    │
│   │  │technical     │  │FTO review    │  │Competitive   │             │    │
│   │  │forensics     │  │Filing        │  │landscape     │             │    │
│   │  │Claims matrix │  │strategy      │  │"Graveyard"   │             │    │
│   │  └──────────────┘  └──────────────┘  └──────────────┘             │    │
│   │                                                                    │    │
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │    │
│   │  │REGULATORY    │  │COMMERCIAL    │  │SYNTHESIS     │             │    │
│   │  │CONSULTANT    │  │LEAD          │  │DIRECTOR      │             │    │
│   │  │              │  │              │  │              │             │    │
│   │  │Pathway       │  │Unit economics│  │Adversarial   │             │    │
│   │  │classification│  │Funding needs │  │reconciliation│             │    │
│   │  │Timeline/cost │  │Team gaps     │  │Final scoring │             │    │
│   │  └──────────────┘  └──────────────┘  └──────────────┘             │    │
│   │                                                                    │    │
│   └───────────────────────────────────┬───────────────────────────────┘    │
│                                       │                                     │
│                                       ▼                                     │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │              WEIGHTED RISK SCORE CALCULATION                       │    │
│   │                                                                    │    │
│   │   Sector-specific weights applied to 5 component scores:          │    │
│   │   Technical • IP • Market • Regulatory • Financial                 │    │
│   └───────────────────────────────────────────────────────────────────┘    │
│                                       │                                     │
│                                       ▼                                     │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │                   COMPREHENSIVE ASSESSMENT REPORT                  │    │
│   └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step 3: Reviewing the Report

The generated report contains 8 major sections:

| Section | Content |
|---------|---------|
| **Executive Summary** | Risk profile, critical concerns, key strengths, commercialization path |
| **Technology Forensics** | Technical deep-dive, claims matrix, TRL assessment, validation gaps |
| **IP Deep Dive** | Patent search, blocking patents, FTO assessment, filing strategy |
| **Market Dynamics** | TAM/SAM, competitive landscape, graveyard analysis, beachhead market |
| **Regulatory Pathway** | Classification, comparable systems, timeline/cost, risks |
| **Financial Roadmap** | Action plan, budget, unit economics, funding requirements |
| **Strategic Recommendations** | Go/No-Go framework, partnerships, monitoring metrics |
| **Product Concept** | AI-generated visualization (optional) |

### Step 4: Using the AI Analyst

After generating a report, use the AI Analyst chat to:

- Ask follow-up questions about any section
- Request deeper analysis on specific topics
- Get real-time market intelligence via Google Search integration
- Compare against industry benchmarks

---

## Component Reference

### Core Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          COMPONENT HIERARCHY                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  App.tsx                                                                    │
│  ├── Sidebar.tsx                                                            │
│  │   └── Tab Navigation Items                                               │
│  │                                                                          │
│  ├── Dashboard.tsx                                                          │
│  │   ├── KPI Cards                                                          │
│  │   ├── Risk Distribution Chart                                            │
│  │   └── Recent Activity List                                               │
│  │                                                                          │
│  ├── AssessmentLibrary.tsx                                                  │
│  │   ├── Search/Filter Bar                                                  │
│  │   └── AssessmentCard.tsx (×n)                                            │
│  │                                                                          │
│  ├── ReportWizard.tsx (Modal)                                               │
│  │   ├── Step Indicator                                                     │
│  │   ├── Question Forms                                                     │
│  │   └── Navigation Buttons                                                 │
│  │                                                                          │
│  ├── FullReportView.tsx (Modal)                                             │
│  │   ├── Cover Section                                                      │
│  │   ├── 8 Report Sections                                                  │
│  │   └── Export Button                                                      │
│  │                                                                          │
│  ├── AssistantChat.tsx                                                      │
│  │   ├── Report Context Selector                                            │
│  │   ├── Message Thread                                                     │
│  │   └── Input Form                                                         │
│  │                                                                          │
│  ├── Visualizer.tsx                                                         │
│  │   ├── Prompt Input                                                       │
│  │   ├── Resolution Selector                                                │
│  │   └── Generated Image Display                                            │
│  │                                                                          │
│  ├── Settings.tsx                                                           │
│  │   ├── API Configuration                                                  │
│  │   └── System Health Status                                               │
│  │                                                                          │
│  └── Footer.tsx                                                             │
│      └── Methodology Modal                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Props Reference

| Component | Key Props | Description |
|-----------|-----------|-------------|
| `Sidebar` | `currentTab`, `onTabChange`, `isOpen` | Navigation state and handlers |
| `Dashboard` | `reports`, `onSelectReport`, `onNewAssessment` | Portfolio data and actions |
| `AssessmentLibrary` | `reports`, `onSelectReport`, `onDownloadReport`, `onDeleteReport` | Library actions |
| `ReportWizard` | `onComplete`, `onCancel` | Wizard completion callbacks |
| `FullReportView` | `report`, `onClose`, `onAskAnalyst` | Report display and actions |
| `AssistantChat` | `reports` | Available reports for context |
| `AssessmentCard` | `report`, `onClick`, `onDownload`, `onDelete` | Card actions |

---

## Data Models

### Core Type Definitions

```typescript
// Enums
enum AssessmentStatus {
  DRAFT = 'Draft',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  FAILED = 'Failed'
}

enum InputType {
  DOCUMENT = 'document',
  QUESTIONNAIRE = 'questionnaire',
  HYBRID = 'hybrid'
}
```

### AssessmentReport Schema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AssessmentReport                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ METADATA                                                             │   │
│  │ id • created_at • innovation_name • sector • stage • location       │   │
│  │ version • status • input_type • isExample                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│  │CoverSection  │ │ExecutiveSumm-│ │Technology    │ │IpDeepDive    │      │
│  │              │ │ary           │ │Forensics     │ │              │      │
│  │• technologyNm│ │• riskProfile │ │• overview    │ │• searchMethod│      │
│  │• subtitle    │ │• concerns    │ │• coreTech    │ │• blocking    │      │
│  │• clientName  │ │• strengths   │ │• claimsMatrix│ │• ftoAssess   │      │
│  │• reportDate  │ │• commercPath │ │• techRisks   │ │• filingStrat │      │
│  │• reportId    │ │• dataConfid  │ │• trlAssess   │ │• whitespace  │      │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘      │
│                                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│  │MarketDynamics│ │Regulatory    │ │Financial     │ │Strategic     │      │
│  │              │ │Pathway       │ │Roadmap       │ │Recommend.    │      │
│  │• marketSize  │ │• classific.  │ │• actionPlan  │ │• priorities  │      │
│  │• graveyard   │ │• comparables │ │• budget      │ │• partnerships│      │
│  │• competitors │ │• timeline    │ │• unitEcon    │ │• goNoGo      │      │
│  │• beachhead   │ │• costs       │ │• funding     │ │• metrics     │      │
│  │• acquisition │ │• risks       │ │• teamGaps    │ │• alternatives│      │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ OPTIONAL                                                             │   │
│  │ productConcept: { imageUrl, prompt }                                │   │
│  │ metadata: { gemini_model, processing_time_seconds, completeness }   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Risk Scoring System

The platform uses sector-specific weights to calculate aggregate risk scores:

| Sector | Tech | IP | Market | Regulatory | Financial |
|--------|------|----|---------|-----------:|---------:|
| Medical Devices | 0.25 | 0.20 | 0.15 | 0.30 | 0.10 |
| Biotech/Pharma | 0.20 | 0.25 | 0.15 | 0.30 | 0.10 |
| Enterprise Software | 0.30 | 0.15 | 0.25 | 0.10 | 0.20 |
| AI/ML | 0.35 | 0.15 | 0.25 | 0.10 | 0.15 |
| Consumer Hardware | 0.25 | 0.20 | 0.25 | 0.15 | 0.15 |
| Clean Energy | 0.25 | 0.20 | 0.20 | 0.20 | 0.15 |
| Advanced Materials | 0.30 | 0.25 | 0.15 | 0.15 | 0.15 |
| Default | 0.25 | 0.20 | 0.20 | 0.20 | 0.15 |

**Risk Levels:**
- **Low** (0-25): Green indicator
- **Moderate** (26-50): Yellow indicator
- **Elevated** (51-75): Orange indicator
- **High** (76-100): Red indicator

---

## AI Integration & Multi-Agent System

### GeminiService Methods

| Method | Model | Purpose |
|--------|-------|---------|
| `generateAssessment()` | gemini-3-flash-preview | Orchestrate 6 parallel agents for full report |
| `chatWithAnalyst()` | gemini-3-flash-preview | Context-aware chat with search tool |
| `generateProductConcept()` | gemini-3-pro-image-preview | Generate product visualization |

### Agent Prompts

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SPECIALIZED AI AGENT PROMPTS                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TECHNOLOGIST_PROMPT                                                        │
│  ───────────────────                                                        │
│  Role: Physics-first technical forensics                                    │
│  Output: Technology overview, specifications, claims matrix, TRL            │
│  Approach: 40+ parameters validated per claim, evidence tiering             │
│                                                                             │
│  PATENT_ATTORNEY_PROMPT                                                     │
│  ─────────────────────                                                      │
│  Role: IP landscape analysis                                                │
│  Output: Search methodology, blocking patents, FTO, filing strategy         │
│  Approach: CPC classification, prior art review, claim charting             │
│                                                                             │
│  MARKET_STRATEGIST_PROMPT                                                   │
│  ───────────────────────                                                    │
│  Role: Market reality stress-testing                                        │
│  Output: TAM/SAM, competitors, graveyard, beachhead market                  │
│  Approach: Failed product analysis, zombie competitor detection             │
│                                                                             │
│  REGULATORY_CONSULTANT_PROMPT                                               │
│  ────────────────────────────                                               │
│  Role: Regulatory pathway mapping                                           │
│  Output: Classification, precedents, timeline, costs, risks                 │
│  Approach: FDA Product Codes, EU MDR, ISO standards                         │
│                                                                             │
│  COMMERCIAL_LEAD_PROMPT                                                     │
│  ─────────────────────                                                      │
│  Role: Financial viability analysis                                         │
│  Output: Action plan, unit economics, funding, team gaps                    │
│  Approach: BOM analysis, milestone budgeting, investor lens                 │
│                                                                             │
│  SYNTHESIS_PROMPT                                                           │
│  ────────────────                                                           │
│  Role: Director-level synthesis                                             │
│  Output: Executive summary, strategic recommendations                       │
│  Approach: Adversarial reconciliation, conflict resolution                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Chain-of-Thought Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `thinkingBudget` | 4096-8192 tokens | Deep reasoning allocation |
| `temperature` | 0.7 | Balanced creativity/consistency |
| `maxOutputTokens` | 16384 | Comprehensive analysis output |

---

## Report Schema

### Section-by-Section Breakdown

#### 1. Executive Summary

```typescript
interface ExecutiveSummary {
  riskProfile: {
    aggregateScore: number;      // 0-100 weighted score
    riskLevel: 'low' | 'moderate' | 'elevated' | 'high';
    tier1Count: number;          // Critical issues
    tier2Count: number;          // Major issues
    tier3Count: number;          // Minor issues
    summaryParagraph: string;
    scoringBreakdown?: ScoringBreakdown;
  };
  criticalConcerns: CriticalConcern[];
  keyStrengths: KeyStrength[];
  commercializationPath: CommercializationPath;
  dataConfidence: DataConfidence[];
}
```

#### 2. Technology Forensics

```typescript
interface TechnologyForensics {
  overview: { paragraph: string; coreFeatures: Feature[] };
  coreTechnology: { explanation: string; specifications: Spec[] };
  claimsMatrix: ClaimValidation[];    // Evidence tiering 1-4
  technicalRisks: TechnicalRisk[];
  trlAssessment: TRLAssessment;       // TRL 1-9 with subsystems
  validationGaps: ValidationGap[];
}
```

#### 3. IP Deep Dive

```typescript
interface IpDeepDive {
  searchMethodology: PatentSearch;
  classificationCodes: CPCCode[];
  whitespace: WhitespaceAnalysis;
  blockingPatents: BlockingPatent[];
  ftoAssessment: FTOAssessment;
  filingStrategy: FilingPhase[];
}
```

---

## Configuration

### Vite Configuration (`vite.config.ts`)

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0'    // External access
  },
  define: {
    'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
});
```

### TypeScript Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| `target` | ES2022 | Modern JavaScript output |
| `jsx` | react-jsx | React 17+ transform |
| `moduleResolution` | bundler | Vite-compatible resolution |
| `experimentalDecorators` | true | Decorator support |

---

## Development Guide

### Adding a New Report Section

1. **Define types** in `types.ts`:
```typescript
export interface NewSection {
  // ... fields
}

// Add to AssessmentReport interface
export interface AssessmentReport {
  // ... existing fields
  newSection: NewSection;
}
```

2. **Add AI prompt** in `geminiService.ts`:
```typescript
const NEW_SECTION_PROMPT = `Your prompt here...`;
```

3. **Update generation logic**:
```typescript
const newSectionResult = await model.generateContent({
  systemInstruction: NEW_SECTION_PROMPT,
  contents: [{ role: 'user', parts: [{ text: JSON.stringify(responses) }] }]
});
```

4. **Add UI components** in `FullReportView.tsx`:
```tsx
<section>
  <h2>New Section</h2>
  {/* Render newSection data */}
</section>
```

5. **Update report template** in `reportTemplate.ts` and `reportGenerator.ts`

### Code Style Guidelines

- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **State**: React useState for local state
- **Types**: Explicit TypeScript types for all props and data
- **Naming**: PascalCase for components, camelCase for functions

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "API key not found" | Missing `GEMINI_API_KEY` | Add key to `.env.local` |
| HTTP 429 errors | Rate limiting | Wait and retry with backoff |
| Empty report sections | API timeout | Increase timeout, check network |
| "Module not found" | Missing dependencies | Run `npm install` |
| Port 3000 in use | Another process | Kill process or change port |

### Debug Mode

Enable verbose logging by checking the browser console for:
- API request/response details
- Component render cycles
- State updates

### API Health Check

Access the Settings panel to view:
- API connection status
- Model availability
- Response latency

---

## License

This project is proprietary software. All rights reserved.

---

<div align="center">

**Built with Google Gemini AI**

*Generating investor-grade innovation intelligence*

</div>
