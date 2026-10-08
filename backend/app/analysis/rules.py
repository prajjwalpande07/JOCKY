from typing import List, Dict, Any

class ForensicRule:
    def __init__(
        self,
        rule_id: str,
        name: str,
        severity: str,
        confidence: int,
        description: str,
        recommendation: str
    ):
        self.rule_id = rule_id
        self.name = name
        self.severity = severity # critical, high, medium, low, info
        self.confidence = confidence # 0 - 100
        self.description = description
        self.recommendation = recommendation

    def evaluate(self, context: Dict[str, Any]) -> bool:
        raise NotImplementedError

class UntrustedTempExecRule(ForensicRule):
    def __init__(self):
        super().__init__(
            rule_id="JOCKY-RULE-PROC-044",
            name="Untrusted Temp Directory Execution",
            severity="critical",
            confidence=94,
            description="Process execution originating from %TEMP% or /tmp directory with anomalous entropy or parent linkage.",
            recommendation="Quarantine the target executable, capture memory dump, and inspect process parent lineage."
        )

    def evaluate(self, context: Dict[str, Any]) -> bool:
        path = str(context.get("path", "")).lower()
        return "temp" in path or "/tmp/" in path

class SuspiciousPowerShellEncodedRule(ForensicRule):
    def __init__(self):
        super().__init__(
            rule_id="JOCKY-RULE-PROC-012",
            name="PowerShell Encoded Command Invocations",
            severity="high",
            confidence=89,
            description="PowerShell process initiated with -enc, -encodedcommand or hidden window parameters.",
            recommendation="Decode Base64 command arguments, review child processes, and inspect outgoing socket connections."
        )

    def evaluate(self, context: Dict[str, Any]) -> bool:
        cmd = str(context.get("command_line", "")).lower()
        return "-enc" in cmd or "-encodedcommand" in cmd or "-w hidden" in cmd

class TorEgressBeaconRule(ForensicRule):
    def __init__(self):
        super().__init__(
            rule_id="JOCKY-RULE-NET-088",
            name="Anomalous Tor Exit / Untrusted CIDR Beacon",
            severity="critical",
            confidence=95,
            description="Outbound network socket connected to known anonymization proxy, Tor exit relay, or high-risk autonomous system.",
            recommendation="Sever socket connection, block remote IP on perimeter gateway, and extract associated PID memory."
        )

    def evaluate(self, context: Dict[str, Any]) -> bool:
        dest_geo = str(context.get("destination_geo", "")).lower()
        indicator = str(context.get("suspicious_indicator", "")).lower()
        return "tor" in dest_geo or "tor" in indicator or "untrusted" in indicator

class CronPersistenceRule(ForensicRule):
    def __init__(self):
        super().__init__(
            rule_id="JOCKY-RULE-CRON-008",
            name="Unauthorized Scheduled Task / Cron Modification",
            severity="medium",
            confidence=85,
            description="New scheduled job created in /etc/cron.d or Task Scheduler with remote download instruction.",
            recommendation="Audit cron entry owner, compare with baseline cron table, and disable rogue schedule."
        )

    def evaluate(self, context: Dict[str, Any]) -> bool:
        path = str(context.get("path", "")).lower()
        name = str(context.get("name", "")).lower()
        return "cron" in path or "scheduled" in name

RULES_REGISTRY: List[ForensicRule] = [
    UntrustedTempExecRule(),
    SuspiciousPowerShellEncodedRule(),
    TorEgressBeaconRule(),
    CronPersistenceRule()
]
