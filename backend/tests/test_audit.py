import pytest

def test_list_audit_logs(client):
    res = client.get("/api/audit")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 30
    first = data[0]
    assert "action" in first
    assert "user" in first
    assert "hash" in first

def test_create_audit_log(client):
    res = client.post("/api/audit", json={
        "action": "Manual Cryptographic Re-seal",
        "object": "Case JCK-2026-001 Vault",
        "caseId": "JCK-2026-001",
        "result": "SUCCESS",
        "details": "Evidence container sealed with SHA-256."
    })
    assert res.status_code == 201
    data = res.json()
    assert data["action"] == "Manual Cryptographic Re-seal"
    assert data["hash"] != ""
