import pytest

def test_list_reports(client):
    res = client.get("/api/reports")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 4
    first = data[0]
    assert "format" in first
    assert "title" in first
    assert "status" in first

def test_generate_pdf_report(client):
    res = client.post("/api/reports/generate", json={
        "caseId": "JCK-2026-001",
        "title": "Forensic Court Admissible Dossier",
        "format": "PDF",
        "reportType": "Investigation"
    })
    assert res.status_code == 201
    created = res.json()
    assert created["format"] == "PDF"
    assert created["status"] == "ready"

def test_generate_json_report(client):
    res = client.post("/api/reports/generate", json={
        "caseId": "JCK-2026-001",
        "title": "JSON Evidence Export",
        "format": "JSON",
        "reportType": "Evidence"
    })
    assert res.status_code == 201
    assert res.json()["format"] == "JSON"
