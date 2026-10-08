import pytest

def test_validation_endpoint(client):
    res = client.get("/api/validation")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 4
    first = data[0]
    assert "name" in first
    assert "status" in first
    assert "executionTimeMs" in first

def test_security_validation_tests_endpoint(client):
    res = client.get("/api/security-validation/tests")
    assert res.status_code == 200
    assert len(res.json()) >= 4

def test_create_validation_scenario(client):
    res = client.post("/api/security-validation/tests", json={
        "name": "Controlled Process Tree Verification",
        "testEnvironment": "Windows Sandbox",
        "scenarioType": "Process Lineage",
        "expectedResult": "Parent PID tracked correctly",
        "observedResult": "cmd.exe -> powershell.exe confirmed",
        "telemetry": "Event ID 4688",
        "status": "PASSED"
    })
    assert res.status_code == 201
    assert res.json()["status"] == "PASSED"
