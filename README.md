# 🔐 JOCKY — Cross-Platform Forensic Investigation & Threat Hunting Platform

> **From complex forensic commands to one unified investigation language.**

JOCKY is a **domain-specific forensic investigation language and orchestration platform** designed to simplify computer and network forensic analysis across **Windows and Ubuntu/Linux** environments.

It provides a unified approach for forensic evidence collection, system analysis, investigation management, event correlation, findings, timeline analysis, graph visualization, and report generation.

---

# 📖 The Story Behind JOCKY

JOCKY started with a simple question:

> **Can forensic investigation be made simpler, more structured, and easier to perform across different operating systems?**

While exploring cybersecurity and digital forensics, we observed that investigators often need to work with different tools, operating-system-specific commands, system logs, processes, network information, files, and forensic artifacts.

This creates a complex investigation workflow.

Instead of creating just another standalone security tool, we wanted to explore a different approach:

> **What if investigators could describe what they want to investigate using one common forensic language?**

That idea became **JOCKY**.

---

# 🌱 From an Idea to a Platform

The project started with the concept of creating a programming language specifically for forensic investigation.

As the idea evolved, we expanded it into a complete investigation platform containing:

```text
Forensic Investigation
        ↓
Custom Investigation Language
        ↓
JOCKY DSL
        ↓
Compiler Pipeline
        ↓
Forensic Collectors
        ↓
Analysis Engine
        ↓
Investigation Dashboard
        ↓
Findings & Reports
```
#### The project gradually developed core components such as:
- Custom JOCKY language
- Lexer and Parser
- Abstract Syntax Tree (AST)
- Intermediate Representation (IR)
- Validation
- Windows runtime
- Linux runtime
- Forensic collectors
- Process analysis
- Network analysis
- File and log analysis
- Evidence management
- Investigation management
- Timeline analysis
- Graph analysis
- Findings management
- Audit logging
- Automated reports

---

# 🚨 Problem Statement
#### Modern computer and network forensic investigations often require investigators to work with:
- Multiple forensic tools
- OS-specific commands
- Large volumes of system data
- Processes and network activity
- Files and logs
- Manual event correlation
- Complex investigation workflows

The original problem statement proposes creating a new programming language/framework called JOCKY for systematic computer and network forensic analysis across Windows and Ubuntu environments.

The goal is to provide investigators with a structured and consistent way to perform forensic investigations instead of relying completely on different commands and tools for every operating system.

---

# 💡 Our Solution
### JOCKY — A Unified Forensic Investigation Platform
JOCKY introduces a Domain-Specific Language (DSL) for forensic investigation.

Instead of directly working with multiple OS-specific commands, investigators can describe forensic operations using the JOCKY language.

The platform processes the investigation through its compiler pipeline and connects it with appropriate forensic collection and analysis components.
### Core Concept
```text
Investigator
      ↓
JOCKY Investigation
      ↓
Lexer
      ↓
Parser
      ↓
AST
      ↓
Validation
      ↓
Intermediate Representation
      ↓
Windows / Linux Runtime
      ↓
Forensic Collectors
      ↓
Analysis Engine
      ↓
Findings
      ↓
Timeline / Network Graph
      ↓
Investigation Report
```
---

# ⭐ Key Features
## 1. 🧑‍💻 JOCKY Forensic DSL
JOCKY provides a custom language for describing forensic investigations.
#### Example:
```text
CASE "INCIDENT-2026-001"

TARGET endpoint-01

COLLECT:
    processes
    network_connections
    file_events
    users
    authentication_logs

ANALYZE:
    suspicious_processes
    unusual_network_activity
    persistence

GENERATE REPORT
```
The DSL is processed through the JOCKY compiler pipeline.

---

## 2. 🧩 Custom Compiler Pipeline
JOCKY contains a language-processing pipeline including:
```text
Source Code
    ↓
Lexer
    ↓
Parser
    ↓
AST
    ↓
Validator
    ↓
Intermediate Representation
    ↓
Runtime
```

This allows forensic investigation commands to be converted into a structured representation before execution.

---

## 3. 🪟 Windows + 🐧 Linux Support
#### JOCKY is designed as a cross-platform framework.
The project contains runtime components for:
- Windows
- Linux / Ubuntu
  
The common JOCKY investigation layer can interact with OS-specific runtime implementations.

---

## 4. 🔍 Forensic Evidence Collection
#### The project contains dedicated collectors for multiple system sources.
### Collector Categories
- File collection
- Log collection
- Network collection
- Process collection
- System information collection
  
These components provide the foundation for systematic forensic investigation.

---

## 5. 🖥️ Process Analysis
#### JOCKY provides process-related collection and analysis capabilities.
### This supports investigation of:
- Running processes
- Process relationships
- Suspicious process activity
- Process-related forensic evidence
- 
---

## 6. 🌐 Network Analysis
#### JOCKY contains network investigation components for collecting and analyzing network-related information.
### This helps investigators examine:
- Network connections
- Communication relationships
- Suspicious network activity
- Connections associated with investigated processes

  ---
  
## 7. 📁 File & Log Investigation
#### JOCKY provides components for collecting and analyzing:
- Files
- File artifacts
- System logs
- Log events
- Related investigation evidence
  
This information can be correlated with other investigation data.

---

## 8. ⏱️ Investigation Timeline
#### Investigation events can be organized chronologically.
### Example:
```text
10:02 → User Login
   ↓
10:05 → Process Started
   ↓
10:06 → File Event
   ↓
10:07 → Network Connection
   ↓
10:08 → Suspicious Activity
```
The timeline helps investigators understand the sequence of events during an incident.

---

## 9. 🕸️ Network & Relationship Graph
#### JOCKY includes graph-based investigation components for representing relationships between entities.
### Example:
```text
User
 │
 ▼
Process
 ├──────────► File
 │
 ├──────────► Network Connection
 │
 └──────────► Child Process
```

Graph visualization can help investigators understand relationships between processes, files, systems, and network activity.

---

## 10. 🧠 Analysis Engine
#### The backend contains multiple analysis components, including:
- Anomaly detection
- Correlation
- Graph analysis
- Risk analysis
- Rule-based analysis
  
These components help transform collected forensic data into meaningful investigation findings.

---

## 11. 📊 Risk Analysis
#### JOCKY contains risk-analysis functionality to help prioritize suspicious activities.
#### Instead of examining every event manually, investigators can focus on activities that require further investigation.

---

## 12. 🔎 Findings Management
#### Investigation findings are maintained separately from raw collected data.
### A finding can contain information such as:
```text
Finding
 ├── Description
 ├── Severity
 ├── Evidence
 ├── Related Activity
 └── Investigation
```
This makes investigation results easier to review and report.

---
## 13. 🧾 Evidence Management
#### JOCKY provides dedicated models, schemas, and services for forensic evidence.

### Evidence can be associated with:
- Investigations
- Findings
- Files
- Systems
- Events
- Reports
  
  ---
  
## 14. 📋 Investigation Management
#### JOCKY provides a central investigation workflow.
### The platform contains functionality for:
- Creating investigations
- Managing investigation information
- Collecting evidence
- Reviewing findings
- Viewing timelines
- Generating reports
- Maintaining audit information

---
## 15. 📄 Automated Reports
#### JOCKY includes report-generation functionality.
### The project contains generated report artifacts in formats such as:
```text
PDF
JSON
```
Reports can bring together investigation information, findings, and collected evidence.

---
## 16. 🔐 Audit & Security Validation
#### The project contains dedicated components for:
- Authentication
- Audit logging
- Security validation
- User management
- Investigation activity tracking
  
This helps maintain accountability throughout the investigation process.

---
## 17. 🧪 Testing
#### JOCKY includes a backend test suite covering areas such as:
- Authentication
- Dashboard
- Forensics
- Investigations
- JOCKY DSL
- Reports
- Security validation
- Systems
- Integration
- Audit
  
Testing helps validate the core functionality of the platform.

---
# 🏗️ System Architecture
```text
                         ┌──────────────────────┐
                         │     Investigator     │
                         │          UI          │
                         └───────────┬──────────┘
                                     │
                                     ▼
                         ┌──────────────────────┐
                         │    JOCKY Console     │
                         │ Dashboard / Cases    │
                         └───────────┬──────────┘
                                     │
                                  REST API
                                     │
                                     ▼
                         ┌──────────────────────┐
                         │    FastAPI Backend   │
                         └───────────┬──────────┘
                                     │
             ┌───────────────────────┼──────────────────────┐
             │                       │                      │
             ▼                       ▼                      ▼
      ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
      │   JOCKY     │        │ Collectors  │        │  Analysis   │
      │  Compiler   │        │             │        │   Engine    │
      └──────┬──────┘        └──────┬──────┘        └──────┬──────┘
             │                      │                      │
             ▼                      ▼                      ▼
      ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
      │ Lexer       │        │ Processes   │        │ Anomaly     │
      │ Parser      │        │ Network     │        │ Correlation │
      │ AST         │        │ Files       │        │ Risk        │
      │ IR          │        │ Logs        │        │ Rules       │
      │ Validator   │        │ Systems     │        │ Graph       │
      └─────────────┘        └─────────────┘        └──────┬──────┘
                                                           │
                                                           ▼
                                                ┌────────────────────┐
                                                │ Investigation Data │
                                                ├────────────────────┤
                                                │ Evidence           │
                                                │ Findings           │
                                                │ Timeline           │
                                                │ Reports            │
                                                │ Audit              │
                                                └────────────────────┘
```
---
# 🔄 Investigation Workflow
```text
Login
  ↓
Dashboard
  ↓
Create / Select Investigation
  ↓
Define Investigation
  ↓
JOCKY DSL
  ↓
Compile & Validate
  ↓
Execute Collection
  ↓
Collect Evidence
  ↓
Analyze Data
  ↓
Correlate Events
  ↓
Generate Findings
  ↓
Timeline / Graph
  ↓
Review Investigation
  ↓
Generate Report
```
---
# 💻 Technology Stack
### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Components
- Data Visualization
- Investigation UI
### Backend
- Python
- FastAPI
- Pydantic
- SQLAlchemy
- Alembic
- Uvicorn
### JOCKY Language
- Python-based compiler implementation
- Lexer
- Parser
- Abstract Syntax Tree (AST)
- Intermediate Representation (IR)
- Validator
- Runtime
### Analysis
- Python
- Rule-based Analysis
- Anomaly Detection
- Correlation
- Graph Analysis
- Risk Analysis
### Database
- SQLAlchemy
- Alembic
- Relational Database Architecture
### Real-Time
- WebSocket support
### Security
- Authentication
- Role-based access
- Security validation
- Audit logging
- Environment-based configuration
### Deployment
- Docker-ready architecture
- Docker Compose support

---
# 📁 Project Structure
```text
JOCKY/
│
├── backend/
│   ├── app/
│   │   ├── analysis/
│   │   │   ├── anomaly_detection.py
│   │   │   ├── correlation.py
│   │   │   ├── graph.py
│   │   │   ├── risk.py
│   │   │   └── rules.py
│   │   │
│   │   ├── api/
│   │   │   ├── router.py
│   │   │   └── routes/
│   │   │
│   │   ├── collectors/
│   │   │   ├── file_collector.py
│   │   │   ├── log_collector.py
│   │   │   ├── network_collector.py
│   │   │   ├── process_collector.py
│   │   │   └── system_collector.py
│   │   │
│   │   ├── core/
│   │   ├── database/
│   │   ├── jocky/
│   │   │   ├── ast.py
│   │   │   ├── compiler.py
│   │   │   ├── ir.py
│   │   │   ├── lexer.py
│   │   │   ├── parser.py
│   │   │   ├── validator.py
│   │   │   └── runtime/
│   │   │
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── websocket/
│   │   └── main.py
│   │
│   ├── data/
│   ├── reports/
│   ├── tests/
│   ├── requirements.txt
│   ├── pytest.ini
│   └── alembic.ini
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── .gitignore
└── README.md
```
---

# ⚙️ Getting Started
### 1. Clone Repository
```text
git clone https://github.com/prajjwalpande07/JOCKY.git
cd JOCKY
```
### 🔧 Backend Setup
#### Go to the backend:
```text
cd backend
```
#### Create a Python virtual environment:
```text
python -m venv venv
```
### Windows
```text
venv\Scripts\activate
```
### Ubuntu / Linux
```text
source venv/bin/activate
```
### Install dependencies:
```text
pip install -r requirements.txt
```
### Create your .env file using:
```text
.env.example
```
### Then start the FastAPI server:
```text
uvicorn app.main:app --reload
```
# Backend:
```text
http://localhost:8000
```
# 🎨 Frontend Setup
### Open another terminal:
```text
cd frontend
```
### Install dependencies:
```text
npm install
```
### Start the development server:
```text
npm run dev
```
Vite will display the local frontend URL in the terminal.

---

# 🧪 Running Tests
### From the backend directory:
```text
pytest
```
The repository contains tests for multiple areas of the JOCKY platform.

---

# 🐳 Docker
#### The project includes Docker-related configuration for containerized deployment.
#### Docker can be used to provide a consistent environment for running application components.

---
# 📊 Example Investigation
#### An investigator can define an investigation using the JOCKY DSL.
### Example:
```text
CASE "INCIDENT-2026-001"

TARGET endpoint-01

COLLECT:
    processes
    network_connections
    file_events
    users
    authentication_logs

ANALYZE:
    suspicious_processes
    unusual_network_activity
    persistence

GENERATE REPORT
```
The investigation is processed through:
```text
JOCKY Script
     ↓
Lexer
     ↓
Parser
     ↓
AST
     ↓
Validation
     ↓
Intermediate Representation
     ↓
Runtime
     ↓
Forensic Collection
     ↓
Analysis
     ↓
Findings
     ↓
Report
```
# 📈 Analysis Pipeline
```text
Raw System Data
      ↓
Collection
      ↓
Normalization
      ↓
Rule-Based Analysis
      +
Anomaly Detection
      ↓
Correlation
      ↓
Graph Analysis
      ↓
Risk Analysis
      ↓
Investigation Findings
      ↓
```

---
# 🔐 Security & Responsible Use
### JOCKY is intended for:
- Authorized digital forensics
- Incident response
- Threat hunting
- Cybersecurity research
- Security investigation
- Defensive analysis
#### Only use JOCKY on systems, endpoints, and networks for which you have explicit authorization.
#### Do not use the platform to access, modify, or analyze systems without permission.
#### Security-related capabilities should always be used within applicable organizational policies and laws.

---
# 🔮 Future Scope
#### The current repository provides the foundation for a broader forensic investigation ecosystem.
#### Future development may include:
### 🤖 AI-Assisted Investigation
- GenAI investigation assistant
- Natural-language investigation planning
- Retrieval-Augmented Generation (RAG)
- Evidence-grounded investigation assistance
### 🎯 Threat Intelligence
- MITRE ATT&CK integration
- STIX/TAXII integration
- OpenCTI integration
- External threat-intelligence enrichment
### 🧠 Advanced Machine Learning
- Advanced anomaly detection
- Graph-based ML
- Behavioural analysis
- Advanced risk scoring
### 🌐 Large-Scale Investigation
- Multi-endpoint orchestration
- Distributed forensic collection
- Cloud-scale investigation
- Large-scale security operations
### 💾 Advanced Evidence Management
- Enhanced chain of custody
- Evidence signing
- Immutable evidence storage
- Advanced artifact storage
### 🖥️ Platform Expansion
- macOS forensics
- Cloud workload forensics
- Mobile forensics
- IoT / OT forensics
#### These capabilities represent future/proposed extensions and are not all part of the current prototype.

---

# 🎯 What Makes JOCKY Different?
### JOCKY is designed around a central idea:
```text
Complex Forensic Commands
          ↓
      JOCKY DSL
          ↓
 Unified Investigation
          ↓
 Evidence Collection
          ↓
    Data Analysis
          ↓
 Correlation & Graph
          ↓
       Findings
          ↓
        Reports
```
Instead of forcing investigators to work independently with different commands and tools, JOCKY aims to provide a common investigation language and orchestration layer.

---
# 📌 Project Goals
### JOCKY aims to:
- Simplify forensic investigation workflows
- Provide a unified investigation language
- Support Windows and Linux environments
- Organize evidence collection
- Correlate forensic events
- Identify suspicious activity
- Visualize investigation relationships
- Generate structured investigation reports
- Provide a foundation for AI-assisted forensic investigation

---
# 👥 Target Users
### JOCKY can be useful for:
- 🔍 Digital Forensic Investigators
- 🛡️ SOC Analysts
- 🚨 Incident Response Teams
- 🕵️ Threat Hunters
- 🔐 Cybersecurity Researchers
- 🏢 Enterprise Security Teams
- 🎓 Cybersecurity Students & Researchers

---
# 🏆 Project Highlights
```text
🔐 Cross-Platform Forensic Investigation
🧑‍💻 Custom Forensic DSL
🧩 Lexer / Parser / AST / IR Pipeline
🪟 Windows Runtime
🐧 Linux Runtime
🔍 Evidence Collection
📊 Analysis Engine
🕸️ Graph Analysis
⏱️ Investigation Timeline
📋 Findings Management
📄 PDF / JSON Reports
🔐 Authentication & Audit
🧪 Automated Testing
⚡ FastAPI Backend
⚛️ React + TypeScript Frontend
```

---
# 🚀 Future Vision
#### Our long-term vision is to evolve JOCKY from a forensic investigation platform into a broader intelligent investigation ecosystem.
### The vision is:
```text
Investigator
     ↓
Natural Language
     ↓
JOCKY Investigation Language
     ↓
Automated Evidence Collection
     ↓
Intelligent Analysis
     ↓
Correlation
     ↓
Attack Understanding
     ↓
Explainable Findings
     ↓
Investigation Report
```
#### The ultimate goal is to reduce the complexity of forensic investigation while keeping the investigator in control of the investigation process.
Think about the investigation, not the complexity of the commands.

---

# 📜 License
#### This project is currently developed as a cybersecurity and digital forensics prototype.
#### A formal open-source license can be added before public distribution.

---
# 👨‍💻 Project
### JOCKY
#### Cross-Platform Forensic Investigation & Threat Hunting Platform
From complex forensic commands to one unified investigation language.

---

# 🌟 Core Innovation
```text
Investigator
     ↓
JOCKY DSL
     ↓
Compiler
     ↓
Forensic Collection
     ↓
Analysis
     ↓
Correlation
     ↓
Findings
     ↓
Timeline / Graph
     ↓
Investigation Report
```
