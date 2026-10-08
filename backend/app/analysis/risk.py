from typing import List, Dict, Any

class RiskEngine:
    """Calculates composite forensic risk score (0 - 100) and risk tier."""

    @staticmethod
    def calculate_investigation_risk(
        critical_findings: int,
        high_findings: int,
        medium_findings: int,
        unverified_evidence: int,
        critical_network_events: int
    ) -> Dict[str, Any]:
        score = 0
        score += critical_findings * 25
        score += high_findings * 15
        score += medium_findings * 8
        score += unverified_evidence * 5
        score += critical_network_events * 10

        composite_score = min(100, max(0, score))

        if composite_score >= 80:
            level = "critical"
        elif composite_score >= 60:
            level = "high"
        elif composite_score >= 40:
            level = "medium"
        elif composite_score >= 20:
            level = "low"
        else:
            level = "clean"

        return {
            "risk_score": composite_score,
            "risk_level": level
        }
