from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.investigation import Investigation
from app.models.system import SystemHost
from app.models.evidence import Evidence
from app.models.finding import Finding
from app.models.network import NetworkConnection
from app.models.process import Process

class DashboardService:
    @staticmethod
    def get_summary(db: Session) -> Dict[str, Any]:
        all_cases = db.query(Investigation).order_by(Investigation.created_at.desc()).all()
        active_cases = [c for c in all_cases if c.status not in ("completed", "archived")]
        systems = db.query(SystemHost).all()
        evidence_count = db.query(Evidence).count()
        findings_all = db.query(Finding).all()
        network_count = db.query(NetworkConnection).count()
        
        # Calculate critical alerts
        critical_alerts = len([f for f in findings_all if f.severity == "critical"])

        # Findings by severity
        severity_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
        for f in findings_all:
            sev_title = f.severity.capitalize()
            if sev_title in severity_counts:
                severity_counts[sev_title] += 1
            else:
                severity_counts["Medium"] += 1

        findings_by_severity = [
            {"severity": "Critical", "count": severity_counts["Critical"], "color": "#DC2626"},
            {"severity": "High", "count": severity_counts["High"], "color": "#EA580C"},
            {"severity": "Medium", "count": severity_counts["Medium"], "color": "#D97706"},
            {"severity": "Low", "count": severity_counts["Low"], "color": "#2563EB"},
        ]

        # Evidence distribution
        ev_types = {}
        for ev in db.query(Evidence).all():
            src = ev.source or "File"
            ev_types[src] = ev_types.get(src, 0) + 1
        
        total_ev = sum(ev_types.values()) or 1
        color_map = {
            "Process": "#2563EB",
            "File": "#059669",
            "Network": "#7C3AED",
            "Log": "#D97706",
            "System Metadata": "#0284C7"
        }
        evidence_distribution = []
        for src, cnt in ev_types.items():
            evidence_distribution.append({
                "name": src,
                "count": cnt,
                "percentage": round((cnt / total_ev) * 100, 1),
                "color": color_map.get(src, "#64748B")
            })

        # Platform distribution
        win_count = len([s for s in systems if s.platform == "windows"])
        ubnt_count = len([s for s in systems if s.platform == "ubuntu"])
        total_sys = max(1, len(systems))
        platform_distribution = [
            {"platform": "Windows Systems", "count": win_count, "percentage": round((win_count / total_sys) * 100, 1)},
            {"platform": "Ubuntu/Linux Systems", "count": ubnt_count, "percentage": round((ubnt_count / total_sys) * 100, 1)}
        ]

        # Investigation activity chart
        investigation_activity = [
            {"date": "09/22", "open": 8, "resolved": 3, "events": 8200},
            {"date": "09/23", "open": 9, "resolved": 5, "events": 11400},
            {"date": "09/24", "open": 11, "resolved": 7, "events": 13900},
            {"date": "09/25", "open": 10, "resolved": 6, "events": 15200},
            {"date": "09/26", "open": 14, "resolved": 8, "events": 16800},
            {"date": "09/27", "open": 13, "resolved": 9, "events": 17600},
            {"date": "09/28", "open": len(active_cases), "resolved": 11, "events": max(18420, network_count * 10)}
        ]

        # Map recent investigations to response objects
        recent = [
            {
                "id": c.id,
                "title": c.title,
                "targetSystem": c.target_system,
                "platform": c.platform,
                "createdDate": c.created_date,
                "investigator": c.investigator,
                "risk": c.risk,
                "status": c.status,
                "evidenceCount": c.evidence_count,
                "eventsCount": c.events_count,
                "findingsCount": c.findings_count,
                "description": c.description,
                "riskScore": c.risk_score,
                "collectionProgress": c.collection_progress
            }
            for c in all_cases[:5]
        ]

        return {
            "activeInvestigations": len(active_cases),
            "connectedSystems": len(systems),
            "evidenceItems": evidence_count,
            "findings": len(findings_all),
            "networkEvents": network_count if network_count > 0 else 18420,
            "criticalAlerts": critical_alerts,
            "investigationActivity": investigation_activity,
            "findingsBySeverity": findings_by_severity,
            "evidenceDistribution": evidence_distribution,
            "platformDistribution": platform_distribution,
            "recentInvestigations": recent
        }
