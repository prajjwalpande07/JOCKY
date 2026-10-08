import json
import random
from pathlib import Path
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.investigation import Investigation
from app.models.system import SystemHost
from app.models.process import Process
from app.models.file_artifact import FileArtifact
from app.models.network import NetworkConnection
from app.models.log_event import LogEvent
from app.models.evidence import Evidence
from app.models.finding import Finding
from app.models.timeline import TimelineEvent
from app.models.report import Report
from app.models.audit import AuditLog
from app.models.jocky_script import JockyScript
from app.models.security_test import SecurityTest
from app.core.security import get_password_hash
from app.core.logging import logger

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).count() > 0:
        logger.info("Database already seeded. Skipping initial seeding.")
        return

    logger.info("Seeding JOCKY database with forensic triage and threat hunting demo data...")

    # 1. Users
    users_data = [
        User(
            name="Dr. Sarah Chen, CISSP / GCFE",
            email="admin@jocky.local",
            password_hash=get_password_hash("Admin@123"),
            role="ADMIN"
        ),
        User(
            name="Marcus Vance, GCFA",
            email="analyst@jocky.local",
            password_hash=get_password_hash("Analyst@123"),
            role="INVESTIGATOR"
        ),
        User(
            name="Elena Rostova, CISM",
            email="examiner@jocky.local",
            password_hash=get_password_hash("Examiner@123"),
            role="ANALYST"
        ),
        User(
            name="Auditor General",
            email="viewer@jocky.local",
            password_hash=get_password_hash("Viewer@123"),
            role="VIEWER"
        )
    ]
    db.add_all(users_data)
    db.commit()

    # Load base extracted mocks
    extracted_path = DATA_DIR / "extracted_mocks.json"
    mocks = {}
    if extracted_path.exists():
        with open(extracted_path, "r", encoding="utf-8") as f:
            mocks = json.load(f)

    # 2. Investigations (12 cases)
    base_invs = mocks.get("MOCK_INVESTIGATIONS", [])
    investigations: list[Investigation] = []
    for inv in base_invs:
        investigations.append(Investigation(
            id=inv["id"],
            title=inv["title"],
            target_system=inv.get("targetSystem", "WIN-FORENSIC-01"),
            platform=inv.get("platform", "windows"),
            created_date=inv.get("createdDate", "2026-09-28 09:14:22"),
            investigator=inv.get("investigator", "Dr. Sarah Chen, CISSP"),
            risk=inv.get("risk", "medium"),
            status=inv.get("status", "open"),
            evidence_count=inv.get("evidenceCount", 0),
            events_count=inv.get("eventsCount", 0),
            findings_count=inv.get("findingsCount", 0),
            description=inv.get("description", ""),
            risk_score=inv.get("riskScore", 50),
            collection_progress=inv.get("collectionProgress", 100)
        ))

    # Add 6 more to reach 12
    extra_inv_titles = [
        ("Cloud K8s Worker Pod Escape Triage", "UBUNTU-K8S-01", "ubuntu", "critical", "analyzing", 92),
        ("Ransomware Stage-1 Dropper Canary", "WIN-ANALYSIS-02", "windows", "high", "review", 78),
        ("Domain Admin Privilege Escalation Audit", "WIN-DC-02", "windows", "critical", "open", 89),
        ("Linux Shadow File Tampering Investigation", "UBUNTU-FORENSIC-01", "ubuntu", "medium", "completed", 42),
        ("Encrypted DNS Exfiltration Triage", "UBUNTU-LAB-02", "ubuntu", "high", "analyzing", 71),
        ("Exchange Server WebShell Discovery", "WIN-EXCH-01", "windows", "critical", "collecting", 95)
    ]
    for i, (title, target, plat, rsk, stat, score) in enumerate(extra_inv_titles, start=7):
        case_id = f"JCK-2026-{str(i).zfill(3)}"
        investigations.append(Investigation(
            id=case_id,
            title=title,
            target_system=target,
            platform=plat,
            created_date=(datetime.now(timezone.utc) - timedelta(days=i)).strftime("%Y-%m-%d %H:%M:%S"),
            investigator="Dr. Sarah Chen, CISSP",
            risk=rsk,
            status=stat,
            evidence_count=random.randint(15, 45),
            events_count=random.randint(80, 250),
            findings_count=random.randint(3, 10),
            description=f"Automated threat triage and forensic baseline acquisition for {target}.",
            risk_score=score,
            collection_progress=random.randint(40, 100)
        ))
    db.add_all(investigations)
    db.commit()

    # 3. Systems (24 systems)
    systems: list[SystemHost] = []
    base_sys = mocks.get("MOCK_SYSTEMS", [])
    for s in base_sys:
        systems.append(SystemHost(
            id=s["id"],
            hostname=s["hostname"],
            ip=s["ip"],
            os=s["os"],
            platform=s["platform"],
            version=s.get("version", "JOCKY-Collector-v2.4.0"),
            status=s.get("status", "online"),
            last_seen=s.get("lastSeen", "Just now"),
            agent_version=s.get("agentVersion", "2.4.0"),
            cpu_usage=s.get("cpuUsage", 10.0),
            memory_usage=s.get("memoryUsage", 40.0),
            active_case_id=s.get("activeCaseId"),
            evidence_collected=s.get("evidenceCollected", 0)
        ))

    # Add required specific systems and pad to 24 systems
    sys_templates = [
        ("WIN-FORENSIC-01", "192.168.1.20", "Windows 11 Enterprise (Build 22631)", "windows", "collecting", "JCK-2026-001"),
        ("WIN-ANALYSIS-02", "192.168.1.22", "Windows 11 Pro (Build 22631)", "windows", "online", "JCK-2026-008"),
        ("UBUNTU-FORENSIC-01", "192.168.1.30", "Ubuntu 24.04 LTS (Noble)", "ubuntu", "online", "JCK-2026-010"),
        ("UBUNTU-LAB-02", "192.168.1.32", "Ubuntu 22.04.4 LTS (Jammy)", "ubuntu", "online", "JCK-2026-011"),
        ("WIN-DC-01", "10.0.0.5", "Windows Server 2022 Datacenter", "windows", "online", None),
        ("WIN-DC-02", "10.0.0.6", "Windows Server 2022 Datacenter", "windows", "warning", "JCK-2026-009"),
        ("WIN-EXCH-01", "10.0.0.12", "Windows Server 2019 Standard", "windows", "collecting", "JCK-2026-012"),
        ("WIN-FINANCE-04", "192.168.2.14", "Windows 10 Enterprise", "windows", "online", "JCK-2026-005"),
        ("WIN-SEC-SRV-03", "10.0.1.18", "Windows Server 2022", "windows", "warning", "JCK-2026-003"),
        ("UBUNTU-FORENSIC-02", "192.168.1.21", "Ubuntu 24.04 LTS", "ubuntu", "online", "JCK-2026-002"),
        ("UBUNTU-DB-01", "10.0.4.50", "Ubuntu 22.04 LTS", "ubuntu", "online", "JCK-2026-004"),
        ("GATEWAY-PRX-01", "10.0.0.1", "Ubuntu 22.04 LTS", "ubuntu", "online", "JCK-2026-006"),
        ("UBUNTU-K8S-01", "10.0.8.10", "Ubuntu 24.04 LTS", "ubuntu", "warning", "JCK-2026-007"),
        ("UBUNTU-K8S-02", "10.0.8.11", "Ubuntu 24.04 LTS", "ubuntu", "online", None),
        ("UBUNTU-CI-RUNNER-01", "10.0.6.20", "Ubuntu 22.04 LTS", "ubuntu", "online", None),
        ("UBUNTU-CI-RUNNER-02", "10.0.6.21", "Ubuntu 22.04 LTS", "ubuntu", "online", None),
    ]

    existing_hostnames = {s.hostname for s in systems}
    sys_idx = len(systems) + 1
    for host, ip, os_str, plat, stat, case_ref in sys_templates:
        if host not in existing_hostnames:
            systems.append(SystemHost(
                id=f"SYS-{str(sys_idx).zfill(2)}",
                hostname=host,
                ip=ip,
                os=os_str,
                platform=plat,
                version="JOCKY-Collector-v2.4.0",
                status=stat,
                last_seen="Just now",
                agent_version="2.4.0",
                cpu_usage=round(random.uniform(5.0, 35.0), 1),
                memory_usage=round(random.uniform(20.0, 65.0), 1),
                active_case_id=case_ref,
                evidence_collected=random.randint(10, 40)
            ))
            existing_hostnames.add(host)
            sys_idx += 1

    # Fill up to 24 systems
    while len(systems) < 24:
        is_win = (sys_idx % 2 == 0)
        hname = f"WIN-NODE-{sys_idx:02d}" if is_win else f"UBUNTU-SRV-{sys_idx:02d}"
        systems.append(SystemHost(
            id=f"SYS-{str(sys_idx).zfill(2)}",
            hostname=hname,
            ip=f"192.168.10.{sys_idx}",
            os="Windows 11 Pro" if is_win else "Ubuntu 24.04 LTS",
            platform="windows" if is_win else "ubuntu",
            version="JOCKY-Collector-v2.4.0",
            status="online",
            last_seen="2 minutes ago",
            agent_version="2.4.0",
            cpu_usage=round(random.uniform(4.0, 25.0), 1),
            memory_usage=round(random.uniform(15.0, 50.0), 1),
            active_case_id=None,
            evidence_collected=random.randint(5, 20)
        ))
        sys_idx += 1

    db.add_all(systems)
    db.commit()

    # 4. Processes (100+ items)
    base_procs = mocks.get("MOCK_PROCESSES", [])
    processes: list[Process] = []
    for p in base_procs:
        processes.append(Process(
            case_id="JCK-2026-001",
            system_id="SYS-WIN-01",
            pid=p["pid"],
            name=p["name"],
            ppid=p.get("ppid", 0),
            parent_name=p.get("parentName", "System"),
            user=p.get("user", "SYSTEM"),
            cpu=p.get("cpu", "0.0%"),
            memory=p.get("memory", "0.0 MB"),
            start_time=p.get("startTime", "09:00:00"),
            path=p.get("path", ""),
            sha256=p.get("sha256", ""),
            risk=p.get("risk", "normal"),
            status=p.get("status", "running"),
            command_line=p.get("commandLine", ""),
            connections_count=p.get("connectionsCount", 0),
            related_events_count=p.get("relatedEventsCount", 0),
            matched_rules=p.get("matchedRules", [])
        ))

    common_procs = [
        ("svchost.exe", "services.exe", "NT AUTHORITY\\SYSTEM", "C:\\Windows\\System32\\svchost.exe", "normal"),
        ("explorer.exe", "userinit.exe", "CONTOSO\\analyst", "C:\\Windows\\explorer.exe", "clean"),
        ("cmd.exe", "explorer.exe", "CONTOSO\\analyst", "C:\\Windows\\System32\\cmd.exe", "low"),
        ("powershell.exe", "cmd.exe", "CONTOSO\\analyst", "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe", "high"),
        ("msedge.exe", "explorer.exe", "CONTOSO\\analyst", "C:\\Program Files (x86)\\Microsoft\\Edge\\msedge.exe", "normal"),
        ("conhost.exe", "powershell.exe", "CONTOSO\\analyst", "C:\\Windows\\System32\\conhost.exe", "clean"),
        ("lsass.exe", "wininit.exe", "NT AUTHORITY\\SYSTEM", "C:\\Windows\\System32\\lsass.exe", "critical"),
        ("csrss.exe", "smss.exe", "NT AUTHORITY\\SYSTEM", "C:\\Windows\\System32\\csrss.exe", "normal"),
        ("winlogon.exe", "smss.exe", "NT AUTHORITY\\SYSTEM", "C:\\Windows\\System32\\winlogon.exe", "normal"),
        ("systemd", "kernel", "root", "/sbin/init", "clean"),
        ("sshd", "systemd", "root", "/usr/sbin/sshd", "normal"),
        ("nginx", "systemd", "www-data", "/usr/sbin/nginx", "normal"),
        ("cron", "systemd", "root", "/usr/sbin/cron", "medium"),
        ("bash", "sshd", "marcus", "/bin/bash", "low"),
        ("python3", "bash", "marcus", "/usr/bin/python3", "normal"),
        ("docker-containerd", "systemd", "root", "/usr/bin/containerd", "normal")
    ]

    p_counter = 1000
    while len(processes) < 110:
        tpl = random.choice(common_procs)
        pid = p_counter
        p_counter += 16
        c_id = f"JCK-2026-{str(random.randint(1, 6)).zfill(3)}"
        processes.append(Process(
            case_id=c_id,
            system_id="SYS-WIN-01" if "exe" in tpl[0] else "SYS-UBNT-02",
            pid=pid,
            name=tpl[0],
            ppid=random.choice([4, 650, 800, 1024]),
            parent_name=tpl[1],
            user=tpl[2],
            cpu=f"{round(random.uniform(0.1, 5.0), 1)}%",
            memory=f"{round(random.uniform(10.0, 150.0), 1)} MB",
            start_time="2026-09-28 09:15:00",
            path=tpl[3],
            sha256=f"{random.getrandbits(256):064x}",
            risk=tpl[4],
            status="running",
            command_line=f"{tpl[3]} --worker={pid}",
            connections_count=random.randint(0, 5),
            related_events_count=random.randint(1, 12),
            matched_rules=[] if tpl[4] in ("clean", "normal") else ["JOCKY-RULE-PROC-ANOMALY"]
        ))
    db.add_all(processes)
    db.commit()

    # 5. Files (100+ items)
    base_files = mocks.get("MOCK_FILES", [])
    files: list[FileArtifact] = []
    for f in base_files:
        files.append(FileArtifact(
            id=f["id"],
            case_id="JCK-2026-001",
            system_id="SYS-WIN-01",
            name=f["name"],
            path=f["path"],
            size=f.get("size", "0 B"),
            modified=f.get("modified", ""),
            sha256=f.get("sha256", ""),
            type=f.get("type", "Binary"),
            risk=f.get("risk", "clean"),
            related_process=f.get("relatedProcess"),
            permissions=f.get("permissions", "rw-r--r--"),
            entropy=f.get("entropy", 0.0),
            evidence_status=f.get("evidenceStatus", "cataloged"),
            matched_yara_rule=f.get("matchedYaraRule")
        ))

    file_names = [
        ("ntdll.dll", "C:\\Windows\\System32\\ntdll.dll", "DLL", 1.8, "clean"),
        ("kernel32.dll", "C:\\Windows\\System32\\kernel32.dll", "DLL", 2.2, "clean"),
        ("stager_drop.dll", "C:\\Windows\\Temp\\stager_drop.dll", "DLL", 7.84, "critical"),
        ("mimilib.dll", "C:\\Users\\Public\\mimilib.dll", "DLL", 7.91, "critical"),
        ("payload.ps1", "C:\\Windows\\Temp\\payload.ps1", "Script", 6.8, "high"),
        ("authorized_keys", "/root/.ssh/authorized_keys", "Config", 3.1, "medium"),
        ("sudoers", "/etc/sudoers", "Config", 2.5, "clean"),
        ("cron.daily", "/etc/cron.daily/check_sec", "Script", 5.2, "high"),
        ("libcrypto.so.3", "/usr/lib/x86_64-linux-gnu/libcrypto.so.3", "SharedLib", 6.1, "clean"),
        ("access.log", "/var/log/nginx/access.log", "Log", 4.2, "normal"),
        ("syslog", "/var/log/syslog", "Log", 4.0, "normal"),
        ("dump.bin", "C:\\Users\\Public\\debug_dump.bin", "Binary", 7.4, "high")
    ]

    f_counter = len(files) + 1
    while len(files) < 110:
        name, path, ftype, entropy, rsk = random.choice(file_names)
        fid = f"FILE-{str(f_counter).zfill(3)}"
        c_id = f"JCK-2026-{str(random.randint(1, 6)).zfill(3)}"
        files.append(FileArtifact(
            id=fid,
            case_id=c_id,
            system_id="SYS-WIN-01" if "C:" in path else "SYS-UBNT-02",
            name=name if f_counter <= 12 else f"{Path(name).stem}_{f_counter}{Path(name).suffix}",
            path=path,
            size=f"{round(random.uniform(0.1, 15.0), 1)} MB",
            modified="2026-09-28 09:20:15",
            sha256=f"{random.getrandbits(256):064x}",
            type=ftype,
            risk=rsk,
            related_process="powershell.exe" if rsk in ("critical", "high") else None,
            permissions="rwxr-xr-x" if "root" in path else "rw-r--r--",
            entropy=entropy,
            evidence_status="flagged" if rsk == "critical" else "cataloged",
            matched_yara_rule="APT_STAGER_RULE" if rsk == "critical" else None
        ))
        f_counter += 1
    db.add_all(files)
    db.commit()

    # 6. Network Connections (100+ items)
    base_nets = mocks.get("MOCK_NETWORK_CONNECTIONS", [])
    networks: list[NetworkConnection] = []
    for n in base_nets:
        networks.append(NetworkConnection(
            id=n["id"],
            case_id="JCK-2026-001",
            system_id="SYS-WIN-01",
            source_ip=n.get("sourceIp", "192.168.1.20"),
            source_port=n.get("sourcePort", 49152),
            dest_ip=n.get("destIp", "185.220.101.4"),
            dest_port=n.get("destPort", 443),
            protocol=n.get("protocol", "TCP"),
            process_name=n.get("processName", "powershell.exe"),
            pid=n.get("pid", 2840),
            timestamp=n.get("timestamp", "2026-09-28 09:14:22"),
            status=n.get("status", "ESTABLISHED"),
            risk=n.get("risk", "normal"),
            destination_geo=n.get("destinationGeo", "Unknown"),
            bytes_transferred=n.get("bytesTransferred", "0 B"),
            suspicious_indicator=n.get("suspiciousIndicator")
        ))

    net_patterns = [
        ("192.168.1.20", 52140, "185.220.101.4", 443, "TLS", "powershell.exe", 2840, "critical", "Germany / Tor Exit", "Tor C2 Beacon"),
        ("192.168.1.20", 52144, "104.244.42.1", 80, "HTTP", "curl.exe", 3120, "high", "United States", "Untrusted Egress"),
        ("192.168.1.21", 44210, "8.8.8.8", 53, "DNS", "systemd-resolved", 600, "clean", "Google Anycast", None),
        ("192.168.1.21", 22, "192.168.1.100", 55432, "TCP", "sshd", 1204, "normal", "Internal LAN", None),
        ("192.168.1.20", 49670, "10.0.0.5", 88, "TCP", "lsass.exe", 710, "high", "Internal DC", "Kerberoasting Probe"),
        ("192.168.1.22", 50110, "142.250.190.46", 443, "TLS", "msedge.exe", 4110, "normal", "Google LLC", None)
    ]

    net_counter = len(networks) + 1
    while len(networks) < 110:
        src, sp, dst, dp, proto, p_name, p_id, rsk, geo, ind = random.choice(net_patterns)
        nid = f"NET-{str(net_counter).zfill(3)}"
        c_id = f"JCK-2026-{str(random.randint(1, 6)).zfill(3)}"
        networks.append(NetworkConnection(
            id=nid,
            case_id=c_id,
            system_id="SYS-WIN-01" if "exe" in p_name else "SYS-UBNT-02",
            source_ip=src,
            source_port=sp + net_counter,
            dest_ip=dst if net_counter <= 10 else f"{random.randint(40, 190)}.{random.randint(10, 240)}.{random.randint(1, 250)}.{random.randint(1, 250)}",
            dest_port=dp,
            protocol=proto,
            process_name=p_name,
            pid=p_id,
            timestamp="2026-09-28 09:14:30",
            status="ESTABLISHED" if net_counter % 3 != 0 else "CLOSE_WAIT",
            risk=rsk,
            destination_geo=geo,
            bytes_transferred=f"{random.randint(10, 850)} KB",
            suspicious_indicator=ind
        ))
        net_counter += 1
    db.add_all(networks)
    db.commit()

    # 7. Logs (100+ items)
    base_logs = mocks.get("MOCK_LOGS", [])
    logs: list[LogEvent] = []
    for l in base_logs:
        logs.append(LogEvent(
            id=l["id"],
            case_id="JCK-2026-001",
            system_id="SYS-WIN-01",
            timestamp=l.get("timestamp", "2026-09-28 09:14:22"),
            source=l.get("source", "System"),
            event_id=str(l.get("eventId", "0")),
            message=l.get("message", ""),
            severity=l.get("severity", "info"),
            related_process=l.get("relatedProcess"),
            user=l.get("user", "SYSTEM"),
            raw=l.get("raw")
        ))

    log_templates = [
        ("Security", "4688", "A new process has been created. Creator Process: cmd.exe, Target: powershell.exe", "high", "powershell.exe", "CONTOSO\\analyst"),
        ("Security", "4624", "An account was successfully logged on. Logon Type: 3 (Network)", "normal", "lsass.exe", "ANONYMOUS LOGON"),
        ("Security", "4769", "A Kerberos service ticket was requested. Ticket Encryption: 0x17 (RC4)", "critical", "lsass.exe", "krbtgt"),
        ("Security", "7045", "A new service was installed in the system: PSEXESVC", "critical", "services.exe", "SYSTEM"),
        ("System", "1000", "Application error in svchost.exe crash dump written", "medium", "svchost.exe", "SYSTEM"),
        ("Auditd", "1300", "SYSCALL arch=c000003e syscall=59 success=yes exit=0 ppid=1204 pid=3410", "high", "bash", "root"),
        ("Application", "2001", "Database query execution spike exceeded threshold (1800 qps)", "medium", "postgres", "postgres")
    ]

    log_counter = len(logs) + 1
    while len(logs) < 110:
        src, eid, msg, sev, proc, usr = random.choice(log_templates)
        lid = f"LOG-{str(log_counter).zfill(3)}"
        c_id = f"JCK-2026-{str(random.randint(1, 6)).zfill(3)}"
        logs.append(LogEvent(
            id=lid,
            case_id=c_id,
            system_id="SYS-WIN-01" if src != "Auditd" else "SYS-UBNT-02",
            timestamp=(datetime.now(timezone.utc) - timedelta(minutes=log_counter)).strftime("%Y-%m-%d %H:%M:%S"),
            source=src,
            event_id=eid,
            message=f"{msg} [Telemetry batch #{log_counter}]",
            severity=sev,
            related_process=proc,
            user=usr,
            raw=f"RAW_EVENT_LOG_{lid}_XML"
        ))
        log_counter += 1
    db.add_all(logs)
    db.commit()

    # 8. Evidence Items (100+ items)
    base_ev = mocks.get("MOCK_EVIDENCE", [])
    evidence: list[Evidence] = []
    for e in base_ev:
        evidence.append(Evidence(
            id=e["id"],
            case_id=e.get("caseId", "JCK-2026-001"),
            system_id="SYS-WIN-01",
            title=e["title"],
            source=e.get("source", "File"),
            timestamp=e.get("timestamp", "2026-09-28 09:14:22"),
            sha256=e.get("sha256", ""),
            collection_status=e.get("collectionStatus", "collected"),
            integrity_status=e.get("integrityStatus", "verified"),
            collector_agent=e.get("collectorAgent", "JOCKY-Collector-v2.4"),
            size_bytes=e.get("sizeBytes", "0 B"),
            chain_of_custody=e.get("chainOfCustody", [])
        ))

    ev_titles = [
        ("PowerShell Process Memory Dump", "Process", "45.2 MB"),
        ("stager_drop.dll Binary Artifact", "File", "1.2 MB"),
        ("Sysmon Event Log Container (EVTX)", "Log", "12.4 MB"),
        ("Outbound TLS Socket PCAP Packet Capture", "Network", "8.9 MB"),
        ("Host Master Boot Record & Registry Hive", "System Metadata", "24.0 MB"),
        ("Unauthorized Cron Job /etc/cron.d/sync", "File", "2.1 KB"),
        ("Auditd Raw System Call Audit Stream", "Log", "18.3 MB"),
        ("Kerberos Ticket Request Triage Export", "Network", "512 KB")
    ]

    ev_counter = len(evidence) + 1
    while len(evidence) < 105:
        title, src, sz = random.choice(ev_titles)
        eid = f"EVD-{str(ev_counter).zfill(3)}"
        c_id = f"JCK-2026-{str(random.randint(1, 6)).zfill(3)}"
        sha = f"{random.getrandbits(256):064x}"
        evidence.append(Evidence(
            id=eid,
            case_id=c_id,
            system_id="SYS-WIN-01",
            title=f"{title} #{ev_counter}",
            source=src,
            timestamp=(datetime.now(timezone.utc) - timedelta(hours=ev_counter % 24)).strftime("%Y-%m-%d %H:%M:%S"),
            sha256=sha,
            collection_status="verified",
            integrity_status="verified",
            collector_agent="JOCKY-Collector-v2.4",
            size_bytes=sz,
            chain_of_custody=[
                {"step": 1, "action": "COLLECTED", "timestamp": "2026-09-28 09:14:22", "actor": "JOCKY-Collector-v2.4", "hash": sha[:16], "notes": "Initial acquisition."},
                {"step": 2, "action": "VERIFIED", "timestamp": "2026-09-28 09:15:00", "actor": "Dr. Sarah Chen, CISSP", "hash": sha[:16], "notes": "Hash verified."}
            ]
        ))
        ev_counter += 1
    db.add_all(evidence)
    db.commit()

    # 9. Findings (30+ items)
    base_fnd = mocks.get("MOCK_FINDINGS", [])
    findings: list[Finding] = []
    for f in base_fnd:
        findings.append(Finding(
            id=f["id"],
            case_id=f.get("caseId", "JCK-2026-001"),
            title=f["title"],
            severity=f.get("severity", "medium"),
            confidence=f.get("confidence", 80),
            related_evidence_count=f.get("relatedEvidenceCount", 0),
            related_events_count=f.get("relatedEventsCount", 0),
            status=f.get("status", "under_review"),
            detected_at=f.get("detectedAt", "2026-09-28 09:14:22"),
            rule_id=f.get("ruleId", "JOCKY-RULE-GEN-001"),
            rule_name=f.get("ruleName", "General Forensic Anomaly"),
            description=f.get("description", ""),
            recommendation=f.get("recommendation", ""),
            investigator_notes=f.get("investigatorNotes", [])
        ))

    finding_templates = [
        ("Base64 Encoded PowerShell Command Execution", "critical", 94, "JOCKY-RULE-PROC-044", "Suspicious Execution Lineage"),
        ("Outbound TLS Beacon to Tor Exit Relay", "critical", 96, "JOCKY-RULE-NET-088", "Untrusted Egress IP"),
        ("Anomalous High-Entropy DLL Created in %TEMP%", "high", 88, "JOCKY-RULE-FILE-012", "Binary Dropper Detection"),
        ("RC4 Encrypted Kerberos TGS Ticket Request", "critical", 92, "JOCKY-RULE-KERB-091", "Kerberoasting Offline Hash Target"),
        ("Unauthorized Sudo Privilege Escalation Attempt", "high", 85, "JOCKY-RULE-AUTH-004", "Privilege Escalation Indicator"),
        ("Cron Persistence Modification in /etc/cron.d", "medium", 79, "JOCKY-RULE-CRON-008", "Rogue Task Scheduler"),
        ("High-Frequency Outbound Database Replica Socket", "high", 83, "JOCKY-RULE-DB-022", "Potential Exfiltration Pattern"),
        ("Pass-the-Hash NTLM Relay Authentication Artifact", "critical", 95, "JOCKY-RULE-AUTH-071", "Lateral Movement Artifact")
    ]

    fnd_counter = len(findings) + 1
    while len(findings) < 35:
        title, sev, conf, rid, rname = random.choice(finding_templates)
        fid = f"FND-{str(fnd_counter).zfill(3)}"
        c_id = f"JCK-2026-{str(random.randint(1, 6)).zfill(3)}"
        findings.append(Finding(
            id=fid,
            case_id=c_id,
            title=f"{title} (Instance #{fnd_counter})",
            severity=sev,
            confidence=conf,
            related_evidence_count=random.randint(2, 6),
            related_events_count=random.randint(10, 45),
            status=random.choice(["under_review", "confirmed", "under_review"]),
            detected_at=(datetime.now(timezone.utc) - timedelta(hours=fnd_counter)).strftime("%Y-%m-%d %H:%M:%S"),
            rule_id=rid,
            rule_name=rname,
            description=f"Automated threat hunting rule matched telemetry pattern for {title}.",
            recommendation="Isolate associated host node and inspect process parent memory tables.",
            investigator_notes=["Correlated with Sysmon channel telemetry.", "Under review by triage lead."]
        ))
        fnd_counter += 1
    db.add_all(findings)
    db.commit()

    # 10. Timeline Events
    base_tml = mocks.get("MOCK_TIMELINE", [])
    timeline_events: list[TimelineEvent] = []
    for t in base_tml:
        timeline_events.append(TimelineEvent(
            id=t["id"],
            case_id="JCK-2026-001",
            timestamp=t.get("timestamp", "2026-09-28 09:14:22"),
            time_only=t.get("timeOnly", "09:14:22"),
            title=t["title"],
            description=t.get("description", ""),
            category=t.get("category", "system"),
            severity=t.get("severity", "info"),
            user=t.get("user"),
            details=t.get("details", {})
        ))

    # Pad timeline to 30 events
    while len(timeline_events) < 30:
        idx = len(timeline_events) + 1
        timeline_events.append(TimelineEvent(
            id=f"TL-{str(idx).zfill(3)}",
            case_id=f"JCK-2026-{str(random.randint(1, 6)).zfill(3)}",
            timestamp=(datetime.now(timezone.utc) - timedelta(minutes=idx * 15)).strftime("%Y-%m-%d %H:%M:%S"),
            time_only=(datetime.now(timezone.utc) - timedelta(minutes=idx * 15)).strftime("%H:%M:%S"),
            title=f"Telemetry Checkpoint {idx}",
            description="Automated baseline integrity checkpoint verified by JOCKY runtime.",
            category=random.choice(["process", "file", "network", "log", "system"]),
            severity=random.choice(["info", "low", "medium"]),
            user="SYSTEM",
            details={"Status": "Verified", "Artifact": f"Checkpoint-{idx}"}
        ))
    db.add_all(timeline_events)
    db.commit()

    # 11. Reports
    base_rpts = mocks.get("MOCK_REPORTS", [])
    reports: list[Report] = []
    for r in base_rpts:
        reports.append(Report(
            id=r["id"],
            case_id=r.get("caseId", "JCK-2026-001"),
            title=r["title"],
            created=r.get("created", "2026-09-28 10:00:00"),
            investigator=r.get("investigator", "Dr. Sarah Chen, CISSP"),
            format=r.get("format", "PDF"),
            status=r.get("status", "ready"),
            summary=r.get("summary", ""),
            pages_count=r.get("pagesCount", 3),
            size_mb=r.get("sizeMb", "0.5 MB"),
            report_type=r.get("reportType", "Investigation")
        ))
    db.add_all(reports)
    db.commit()

    # 12. Audit Logs
    base_aud = mocks.get("MOCK_AUDIT_LOGS", [])
    audit_logs: list[AuditLog] = []
    for a in base_aud:
        audit_logs.append(AuditLog(
            id=a["id"],
            timestamp=a.get("timestamp", "2026-09-28 09:14:22"),
            user=a.get("user", "Dr. Sarah Chen, CISSP"),
            action=a["action"],
            case_id=a.get("caseId", "JCK-2026-001"),
            object=a.get("object", "Case Artifact"),
            result=a.get("result", "SUCCESS"),
            details=a.get("details", ""),
            hash=a.get("hash", "")
        ))

    # Pad audit logs to 30+ items
    while len(audit_logs) < 35:
        idx = len(audit_logs) + 1
        audit_logs.append(AuditLog(
            id=f"AUD-{str(idx).zfill(3)}",
            timestamp=(datetime.now(timezone.utc) - timedelta(minutes=idx * 10)).strftime("%Y-%m-%d %H:%M:%S"),
            user="Dr. Sarah Chen, CISSP",
            action="Integrity Audit Check",
            case_id=f"JCK-2026-{str(random.randint(1, 6)).zfill(3)}",
            object=f"Vault Container #{idx}",
            result="SUCCESS",
            details="Cryptographic verification matched Merkle tree root.",
            hash=f"{random.getrandbits(64):016x}"
        ))
    db.add_all(audit_logs)
    db.commit()

    # 13. JOCKY Scripts
    base_scripts = mocks.get("MOCK_JOCKY_SCRIPTS", [])
    scripts: list[JockyScript] = []
    for s in base_scripts:
        scripts.append(JockyScript(
            id=s["id"],
            name=s["name"],
            description=s.get("description", ""),
            target_platform=s.get("targetPlatform", "cross_platform"),
            code=s["code"]
        ))
    db.add_all(scripts)
    db.commit()

    # 14. Validation Scenarios (Security Tests)
    base_vals = mocks.get("MOCK_VALIDATION_SCENARIOS", [])
    val_scenarios: list[SecurityTest] = []
    for v in base_vals:
        val_scenarios.append(SecurityTest(
            id=v["id"],
            name=v["name"],
            test_environment=v.get("testEnvironment", "Windows Sandbox"),
            scenario_type=v.get("scenarioType", "Process Lineage"),
            expected_result=v.get("expectedResult", ""),
            observed_result=v.get("observedResult", ""),
            telemetry=v.get("telemetry", ""),
            status=v.get("status", "PASSED"),
            execution_time_ms=v.get("executionTimeMs", 100),
            timestamp=v.get("timestamp", "2026-09-28 09:00:00"),
            evidence_items_collected=v.get("evidenceItemsCollected", 4)
        ))
    db.add_all(val_scenarios)
    db.commit()

    logger.info("Successfully seeded JOCKY database:")
    logger.info(f" - Users: {len(users_data)}")
    logger.info(f" - Investigations: {len(investigations)}")
    logger.info(f" - Systems: {len(systems)}")
    logger.info(f" - Processes: {len(processes)}")
    logger.info(f" - Files: {len(files)}")
    logger.info(f" - Network Connections: {len(networks)}")
    logger.info(f" - Logs: {len(logs)}")
    logger.info(f" - Evidence Items: {len(evidence)}")
    logger.info(f" - Findings: {len(findings)}")
    logger.info(f" - Timeline Events: {len(timeline_events)}")
    logger.info(f" - Reports: {len(reports)}")
    logger.info(f" - Audit Logs: {len(audit_logs)}")
    logger.info(f" - JOCKY Scripts: {len(scripts)}")
    logger.info(f" - Validation Scenarios: {len(val_scenarios)}")
