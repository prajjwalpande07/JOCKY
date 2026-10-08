import pytest

def test_processes_endpoint(client):
    res = client.get("/api/processes")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 100
    first = data[0]
    assert "pid" in first
    assert "name" in first
    assert "user" in first
    assert "risk" in first

def test_files_endpoint(client):
    res = client.get("/api/files")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 100
    first = data[0]
    assert "name" in first
    assert "sha256" in first
    assert "entropy" in first

def test_network_endpoint(client):
    res = client.get("/api/network")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 100
    first = data[0]
    assert "sourceIp" in first
    assert "destIp" in first
    assert "destPort" in first

def test_network_stats(client):
    res = client.get("/api/network/stats")
    assert res.status_code == 200
    data = res.json()
    assert "totalConnections" in data
    assert "protocols" in data

def test_logs_endpoint(client):
    res = client.get("/api/logs")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 100
    first = data[0]
    assert "eventId" in first
    assert "message" in first

def test_evidence_endpoint_and_verify(client):
    res = client.get("/api/evidence")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 100
    ev_id = data[0]["id"]

    verify_res = client.post(f"/api/evidence/{ev_id}/verify")
    assert verify_res.status_code == 200
    assert verify_res.json()["verified"] is True

def test_findings_endpoint_and_patch_status(client):
    res = client.get("/api/findings")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 30
    finding_id = data[0]["id"]

    # Test PATCH to update finding status (Frontend specific contract)
    patch_res = client.patch(f"/api/findings/{finding_id}", json={
        "status": "confirmed",
        "note": "Analyst verified malicious hash via sandbox execution."
    })
    assert patch_res.status_code == 200
    updated = patch_res.json()
    assert updated["status"] == "confirmed"
    assert "Analyst verified malicious hash via sandbox execution." in updated["investigatorNotes"]

def test_timeline_endpoint(client):
    res = client.get("/api/timeline")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 20

def test_correlation_graph(client):
    res = client.get("/api/correlation?caseId=JCK-2026-001")
    assert res.status_code == 200
    data = res.json()
    assert "nodes" in data
    assert "edges" in data

def test_continuous_learning(client):
    res = client.get("/api/learning")
    assert res.status_code == 200
    data = res.json()
    assert "detectionAccuracy" in data
    assert "feedbackHistory" in data
