# JOCKY — Cross-Platform Forensic Analysis & Threat Hunting Framework

Enterprise-grade asynchronous FastAPI backend engineered specifically for the existing **JOCKY** frontend command center. JOCKY provides digital forensics acquisition, process lineage tracing, network socket telemetry, log analysis, cryptographic chain-of-custody verification, behavioral anomaly detection, and a proprietary domain-specific language (JOCKY DSL) with multi-stage compilation to Forensic Intermediate Representation (FIR).

---

## Technology Stack

- **Python 3.12+ / 3.14**
- **FastAPI** — High-performance async REST & WebSocket web framework
- **SQLAlchemy 2.0** — Advanced ORM supporting PostgreSQL & SQLite
- **Alembic** — Schema migrations management
- **Pydantic v2** — Request/response contract serialization matching frontend TypeScript interfaces
- **JWT (python-jose + bcrypt)** — Stateless access/refresh token authentication with role-based access control (RBAC)
- **NetworkX** — Forensic entity graph correlation (Process ↔ File ↔ Network ↔ Log ↔ Finding)
- **Scikit-learn** — Behavioral anomaly detection (IsolationForest)
- **ReportLab** — Court-ready forensic PDF report generation
- **psutil / hashlib / pathlib** — Safe local forensic telemetry acquisition
- **Pytest + Pytest-asyncio + HTTPX** — Automated unit and integration testing suite

---

## Directory Architecture

```
backend/
├── app/
│   ├── main.py                     # FastAPI application entry point, middleware, WebSocket
│   ├── core/
│   │   ├── config.py               # Pydantic settings & environment configuration
│   │   ├── security.py             # Native bcrypt hashing, JWT issuance & verification, RBAC
│   │   └── logging.py              # Structured JSON forensic logging & audit trail
│   ├── database/
│   │   ├── base.py                 # DeclarativeBase for SQLAlchemy 2.x
│   │   ├── database.py             # Engine, session factory, auto-fallback connection pool
│   │   └── seed.py                 # Comprehensive realistic demo data seeder
│   ├── models/                     # SQLAlchemy Models (15 tables)
│   │   ├── user.py                 # Users & RBAC roles
│   │   ├── investigation.py        # Case management
│   │   ├── system.py               # Connected system hosts
│   │   ├── process.py              # Running process table
│   │   ├── file_artifact.py        # File artifacts & entropy
│   │   ├── network.py              # Network socket connections
│   │   ├── log_event.py            # Event logs (Security, System, Auditd)
│   │   ├── evidence.py             # Evidence items & chain-of-custody ledgers
│   │   ├── finding.py              # Threat findings & confidence scores
│   │   ├── timeline.py             # Chronological timeline checkpoints
│   │   ├── report.py               # Generated forensic reports
│   │   ├── audit.py                # Cryptographic audit logs
│   │   ├── jocky_script.py         # Stored JOCKY DSL scripts
│   │   ├── compiler_run.py         # Compiler execution metrics & bytecode runs
│   │   └── security_test.py        # Controlled validation scenarios
│   ├── schemas/                    # Pydantic v2 Schemas (exact match to Frontend TypeScript types)
│   │   ├── auth.py
│   │   ├── dashboard.py
│   │   ├── investigation.py
│   │   ├── system.py
│   │   ├── process.py
│   │   ├── file.py
│   │   ├── network.py
│   │   ├── log.py
│   │   ├── evidence.py
│   │   ├── finding.py
│   │   ├── timeline.py
│   │   ├── report.py
│   │   ├── jocky.py
│   │   ├── audit.py
│   │   └── security_test.py
│   ├── api/
│   │   ├── router.py               # Master API router
│   │   └── routes/                 # Endpoint route controllers
│   │       ├── auth.py
│   │       ├── dashboard.py
│   │       ├── investigations.py
│   │       ├── systems.py
│   │       ├── processes.py
│   │       ├── files.py
│   │       ├── network.py
│   │       ├── logs.py
│   │       ├── evidence.py
│   │       ├── findings.py
│   │       ├── timeline.py
│   │       ├── reports.py
│   │       ├── jocky.py
│   │       ├── compiler.py
│   │       ├── security_validation.py
│   │       ├── audit.py
│   │       └── analysis.py
│   ├── services/                   # Business logic & domain services
│   │   ├── dashboard_service.py
│   │   ├── investigation_service.py
│   │   ├── collection_service.py
│   │   ├── evidence_service.py
│   │   ├── analysis_service.py
│   │   ├── report_service.py
│   │   ├── audit_service.py
│   │   └── jocky_service.py
│   ├── jocky/                      # JOCKY Forensic Domain-Specific Language Engine
│   │   ├── lexer.py                # Lexical tokenizer
│   │   ├── parser.py               # AST generator
│   │   ├── ast.py                  # Abstract syntax tree data structures
│   │   ├── validator.py            # Syntax & prohibited safety validator
│   │   ├── ir.py                   # Forensic Intermediate Representation (FIR) generator
│   │   ├── compiler.py             # Multi-stage compiler orchestrator
│   │   └── runtime/                # Safe cross-platform execution runtimes
│   │       ├── base.py
│   │       ├── windows.py
│   │       └── linux.py
│   ├── analysis/                   # Advanced forensic analytics
│   │   ├── rules.py                # Rule-based threat heuristic engine
│   │   ├── anomaly_detection.py    # IsolationForest behavioral anomaly detection
│   │   ├── correlation.py          # Cross-channel artifact correlation
│   │   ├── risk.py                 # Composite risk scoring
│   │   └── graph.py                # NetworkX graph builder
│   ├── collectors/                 # Safe host data collectors
│   │   ├── system_collector.py
│   │   ├── process_collector.py
│   │   ├── file_collector.py
│   │   ├── network_collector.py
│   │   └── log_collector.py
│   └── websocket/
│       └── events.py               # Real-time WebSocket connection manager
├── alembic/                        # Migration scripts
├── tests/                          # Automated Pytest suite (37 unit & integration tests)
├── data/                           # Seed datasets and SQLite fallback database
├── reports/                        # Court-admissible generated PDF / JSON / CSV reports
├── .env.example                    # Environment configuration template
├── requirements.txt                # Production dependencies
├── alembic.ini                     # Alembic configuration
├── pytest.ini                      # Pytest runner configuration
└── README.md                       # Documentation
```

---

## Quickstart & Installation

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default parameters include:
- `DATABASE_URL`: `sqlite:///./data/jocky.db` (auto-falls back if PostgreSQL is not active)
- `POSTGRES_URL`: `postgresql+psycopg://postgres:postgres@localhost:5432/jocky_forensics`
- `SECRET_KEY`: Secure JWT signing key
- `CORS_ORIGINS`: `http://localhost:3000,http://localhost:5173`

### 3. Database Migrations
Run Alembic migrations:
```bash
python -m alembic upgrade head
```

### 4. Database Seeding (Realistic Demo Data)
The backend automatically initializes and seeds the database on initial startup. To explicitly seed or re-seed:
```bash
python -c "from app.database.database import SessionLocal, init_db; from app.database.seed import seed_database; init_db(); db=SessionLocal(); seed_database(db); db.close()"
```
This populates:
- **12+ Investigations** (`JCK-2026-001` through `JCK-2026-012`)
- **24 Connected Systems** (`WIN-FORENSIC-01`, `WIN-ANALYSIS-02`, `UBUNTU-FORENSIC-01`, etc.)
- **110 Processes** with command lines, memory, CPU, parent linkage, and risk scores
- **110 File Artifacts** with Shannon entropy, SHA-256 hashes, and YARA flags
- **110 Network Sockets** with GeoIP, protocol, status, and egress indicators
- **110 Security & System Logs** (Event IDs 4688, 4624, 4769, 7045, Auditd 1300)
- **105 Sealed Evidence Items** with cryptographic chain-of-custody steps
- **35 Threat Findings** with detection confidence, rules, and investigator notes
- **30 Timeline Events**
- **35 Cryptographic Audit Logs** with tamper-evident hashes
- **JOCKY Scripts & Security Validation Scenarios**

### 5. Running the Backend Server
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive API documentation:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## Authentication & Default Accounts

| Role | Email | Password |
|---|---|---|
| **ADMIN** | `admin@jocky.local` | `Admin@123` |
| **INVESTIGATOR** | `analyst@jocky.local` | `Analyst@123` |
| **ANALYST** | `examiner@jocky.local` | `Examiner@123` |
| **VIEWER** | `viewer@jocky.local` | `Viewer@123` |

---

## API Endpoints Overview

| Category | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register` | Register new investigator account |
| | `POST` | `/api/auth/login` | Authenticate and obtain JWT access/refresh token |
| | `GET` | `/api/auth/me` | Current user profile |
| | `POST` | `/api/auth/refresh` | Rotate JWT access token |
| **Dashboard** | `GET` | `/api/dashboard` | Aggregated dashboard telemetry matching frontend types |
| **Investigations** | `GET` | `/api/investigations` | List cases with search, platform & status filters |
| | `POST` | `/api/investigations` | Initialize new investigation workspace |
| | `GET` | `/api/investigations/{id}` | Detailed case metadata and stats |
| | `PUT` | `/api/investigations/{id}` | Update case attributes |
| | `DELETE` | `/api/investigations/{id}` | Archive case |
| **Systems** | `GET` | `/api/systems` | Enumerate connected forensic agent hosts |
| | `GET` | `/api/systems/{id}` | Host telemetry and active case info |
| | `POST` | `/api/systems` | Register new host agent |
| | `PUT` | `/api/systems/{id}` | Update host agent state |
| **Processes** | `GET` | `/api/processes` | Process table with filters by case, risk, and search |
| | `GET` | `/api/processes/{pid}` | Process memory and handle details |
| **Files** | `GET` | `/api/files` | File catalog with Shannon entropy and SHA-256 |
| | `GET` | `/api/files/{id}` | Single file artifact details |
| **Network** | `GET` | `/api/network` | Active network sockets and connections |
| | `GET` | `/api/network/stats` | Protocol and connection status statistics |
| | `GET` | `/api/network/{id}` | Socket details |
| **Logs** | `GET` | `/api/logs` | Security, Application, System, and Auditd event logs |
| | `GET` | `/api/logs/{id}` | Single log event |
| **Evidence** | `GET` | `/api/evidence` | Evidence repository with chain of custody |
| | `POST` | `/api/evidence` | Catalog new physical or digital evidence item |
| | `POST` | `/api/evidence/{id}/verify` | Cryptographically verify SHA-256 seal |
| **Findings** | `GET` | `/api/findings` | Threat findings filtered by case or severity |
| | `POST` | `/api/findings` | Record new threat hunting finding |
| | `PATCH` / `PUT` | `/api/findings/{id}` | Update status (`confirmed`, `false_positive`, `under_review`) |
| **Timeline** | `GET` | `/api/timeline` | Chronological case event sequence |
| | `GET` | `/api/timeline/{case_id}` | Case-specific timeline events |
| **Reports** | `GET` | `/api/reports` | List generated reports |
| | `POST` | `/api/reports/generate` | Generate court-ready PDF, JSON, or CSV report |
| | `GET` | `/api/reports/{id}/download` | Download generated report document |
| **JOCKY DSL** | `GET` | `/api/jocky/scripts` | Retrieve stored forensic script files |
| | `POST` | `/api/jocky/compile` | Compile script into AST and Forensic IR (FIR) |
| | `POST` | `/api/jocky/validate` | Validate DSL script syntax and safety rules |
| **Analysis** | `GET` | `/api/correlation` | NetworkX correlation graph (`nodes`, `edges`) |
| | `GET` | `/api/analysis/graph/{case_id}`| Case correlation graph |
| | `GET` | `/api/learning` | Continuous learning metrics & feedback loops |
| | `GET` | `/api/analysis/anomaly/{case_id}` | Behavioral anomaly detection score |
| **Security Test**| `GET` | `/api/validation` | Controlled security validation scenarios |
| | `POST` | `/api/security-validation/tests` | Execute controlled benchmark scenario |
| **Audit** | `GET` | `/api/audit` | Tamper-evident cryptographic audit logs |
| **WebSocket** | `WS` | `/ws/events` | Real-time event streaming |

---

## JOCKY DSL Architecture

JOCKY DSL empowers forensic analysts to write expressive acquisition and threat hunting queries:

```jocky
// 1. Host Baseline
system.info()

// 2. Process Lineage Inspection
process.list()
process.find("powershell.exe")

// 3. Network Connection Audit
network.connections()

// 4. File Integrity & Entropy Analysis
file.search("*.dll", "C:/Windows/Temp")
file.hash("C:/Windows/Temp/stager_drop.dll")

// 5. Evidence Sealing
evidence.collect()
evidence.export("case-001")
```

### Compiler Pipeline:
```
JOCKY SOURCE
     ↓
LEXICAL TOKENIZER (Token Stream: IDENTIFIER, DOT, LPAREN, STRING...)
     ↓
AST PARSER (Abstract Syntax Tree: ProgramNode, FunctionCallNode...)
     ↓
SAFETY VALIDATOR (Checks syntax balance & rejects dangerous evasion primitives)
     ↓
FORENSIC IR GENERATOR (Platform-independent FIR bytecode: FIR_OP_PROCESS_LIST...)
     ↓
CROSS-PLATFORM RUNTIME DISPATCH (WindowsRuntime / LinuxRuntime)
```

---

## Testing

Run the automated test suite covering all 37 test specifications:
```bash
python -m pytest -v
```

All 37 tests execute and pass in under 2 seconds.
