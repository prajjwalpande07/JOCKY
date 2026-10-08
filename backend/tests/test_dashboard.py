import pytest

def test_get_dashboard(client):
    res = client.get("/api/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert "activeInvestigations" in data
    assert "connectedSystems" in data
    assert "evidenceItems" in data
    assert "findings" in data
    assert "networkEvents" in data
    assert "criticalAlerts" in data
    assert "investigationActivity" in data
    assert "findingsBySeverity" in data
    assert "evidenceDistribution" in data
    assert "platformDistribution" in data
    assert "recentInvestigations" in data
    assert len(data["recentInvestigations"]) <= 5
