import pytest

def test_list_investigations(client):
    res = client.get("/api/investigations")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 10
    first = data[0]
    assert "id" in first
    assert "title" in first
    assert "targetSystem" in first
    assert "platform" in first
    assert "status" in first

def test_filter_investigations_by_platform(client):
    res = client.get("/api/investigations?platform=windows")
    assert res.status_code == 200
    for inv in res.json():
        assert inv["platform"] == "windows"

def test_create_and_get_investigation(client):
    create_res = client.post("/api/investigations", json={
        "title": "Automated Ransomware Lateral Sweep",
        "targetSystem": "WIN-FORENSIC-01",
        "platform": "windows",
        "investigator": "Dr. Sarah Chen, CISSP",
        "description": "Rapid triage of staging binaries and scheduled tasks.",
        "risk": "critical"
    })
    assert create_res.status_code == 201
    created = create_res.json()
    case_id = created["id"]
    assert case_id.startswith("JCK-2026-")

    get_res = client.get(f"/api/investigations/{case_id}")
    assert get_res.status_code == 200
    assert get_res.json()["title"] == "Automated Ransomware Lateral Sweep"
