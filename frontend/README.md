# JOCKY: Cross-Platform Forensic Analysis & Threat Hunting Framework

> **Academic & Enterprise Digital Forensics Platform**  
> Built around the proprietary **JOCKY Forensic DSL & Compiler Architecture** (FIR-VM v2.4).

---

## 🛡️ Executive Overview

**JOCKY** is a specialized cybersecurity forensic investigation platform designed to unify computer and network forensic telemetry across heterogeneous operating systems (**Windows 11 / Server 2022** and **Ubuntu 24.04 LTS / Linux eBPF**) using a domain-specific declarative language.

```
JOCKY Source (.jocky)
         ↓
       Lexer
         ↓
       Parser
         ↓
  Abstract Syntax Tree (AST)
         ↓
  Semantic Validation
         ↓
Forensic Intermediate Representation (FIR Bytecode)
         ↓
  Cross-Platform Runtime (Windows Win32 + Ubuntu eBPF)
         ↓
Forensic Evidence Acquisition & Sealing (SHA-256 / BLAKE3)
         ↓
Multi-Stage Correlation & Anomaly Graph
         ↓
Triage Findings & Court-Ready Forensic Dossiers
         ↓
Continuous Learning Feedback Loop
```

---

## 🚀 Key Framework Modules & Navigation

| Route | Page | Description |
|---|---|---|
| `/` | **Dashboard** | SOC Command Center with 6 KPI metrics, area activity charts, severity distribution, and "Start Investigation" flow. |
| `/investigations` | **Investigations** | Central case repository with multi-attribute filtering, search, and lifecycle statuses (Open, Collecting, Analyzing, Review, Completed, Archived). |
| `/workspace/:id?` | **Workspace** | Deep-dive forensic workspace with 11 specialized tabs: Overview, Evidence, Processes, Files, Network, Logs, Timeline, Analysis, Findings, Reports, and Audit. |
| `/studio` | **JOCKY Studio** | Interactive DSL IDE featuring file explorer, syntax-aware code editor, AST tree viewer, FIR bytecode synthesis, and live simulated collector terminal. |
| `/reference` | **Language Reference** | Formal documentation manual for all JOCKY modules (`system`, `process`, `file`, `network`, `log`, `evidence`, `report`) with runnable syntax examples. |
| `/compiler` | **Compiler & FIR** | Connected 7-stage visual compiler pipeline with interactive bytecode breakdown and compilation latency metrics. |
| `/systems` | **Systems** | Cross-platform fleet manager monitoring Windows Win32 probes and Ubuntu eBPF daemons with real-time CPU/memory meters and side drawer. |
| `/processes` | **Process Analysis** | Volatile process execution lineage tree, token privilege inspection, parent/child PPID mapping, and matched anomaly rules. |
| `/files` | **File Forensics** | File system analysis with Shannon entropy gauge (detecting packed/encrypted payloads), SHA-256 verification, and YARA rule matching. |
| `/network` | **Network Forensics** | Passive socket analysis, egress beaconing identification, traffic time-series, and L4/L7 protocol distribution. |
| `/logs` | **Log Analysis** | Centralized event log stream correlating Windows EVTX (4688, 7045, 4624) and Linux auditd syscall records with XML drawer. |
| `/evidence` | **Evidence Vault** | Cryptographically sealed digital evidence ledger featuring 6-step immutable chain of custody (`Collected → Hashed → Stored → Analyzed → Reviewed → Exported`). |
| `/analysis` | **Analysis & Correlation** | Multi-stage correlation graph mapping `Process → File → Network Socket → Security Log → Forensic Finding`. |
| `/findings` | **Findings** | Forensic indicator review cards with confidence scores, qualified cautious language (*"Potentially Suspicious"*, *"Requires Review"*), and status verification. |
| `/timeline` | **Timeline** | Chronological forensic event reconstruction with microsecond timestamps and category filtering. |
| `/management` | **Central Console** | Multi-endpoint investigation management with real-time collection job queues (Running, Queued, Completed). |
| `/validation` | **Security Validation** | Controlled laboratory sandbox harness benchmarking telemetry fidelity, execution completeness, and false-positive suppression. |
| `/reports` | **Reports** | Official forensic report generator with court-ready PDF/JSON preview, executive summary, and digital examiner signature block. |
| `/audit` | **Audit Trail** | Immutable blockchain-style governance ledger tracking all investigator actions with cryptographic block hashes. |
| `/learning` | **Continuous Learning** | Closed-loop feedback mechanism translating investigator triage verdicts into refined heuristic rules and module updates. |
| `/architecture` | **Architecture Pipeline** | Interactive end-to-end framework lifecycle map linking all stages together. |

---

## 💻 Tech Stack & Design System

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Forensic Color Theme (Professional SOC Navy `#0F172A`, Slate, Sky, Emerald, Amber, Rose accents)
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Responsive Area, Bar, and Donut charts)
- **Routing**: React Router v7
- **Architecture**: Modular service layer (`/src/services/api.ts` and `mockData.ts`) structured to mirror future **FastAPI** backend endpoints.

---

## 🔒 Security & Research Boundary

This platform is strictly designed for **authorized digital forensic investigation, incident response, and academic research**. 
In adherence to ethical cybersecurity standards, the interface contains no offensive exploits, credential theft mechanisms, or security-control disabling features. All evaluation tools operate in read-only telemetry capture mode within isolated laboratory test environments.

---

## 🛠️ Local Development & Build

```bash
# Install dependencies
npm install

# Run Vite development server
npm run dev

# Compile TypeScript and build production bundle
npm run build
```
