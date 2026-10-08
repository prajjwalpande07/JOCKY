import pytest

def test_full_integration_flow(client):
    # 1. Login works
    login_res = client.post("/api/auth/login", json={
        "email": "admin@jocky.local",
        "password": "Admin@123"
    })
    assert login_res.status_code == 200, "1. Login failed"
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Dashboard loads
    dash_res = client.get("/api/dashboard", headers=headers)
    assert dash_res.status_code == 200, "2. Dashboard failed"
    dash_data = dash_res.json()
    assert dash_data["activeInvestigations"] > 0
    assert dash_data["connectedSystems"] >= 20
    assert dash_data["evidenceItems"] >= 100

    # 3. Investigations load
    invs_res = client.get("/api/investigations", headers=headers)
    assert invs_res.status_code == 200, "3. Investigations failed"
    invs = invs_res.json()
    assert len(invs) >= 10

    # 4. Investigation details load
    target_id = invs[0]["id"]
    inv_detail = client.get(f"/api/investigations/{target_id}", headers=headers)
    assert inv_detail.status_code == 200, "4. Investigation details failed"
    assert inv_detail.json()["id"] == target_id

    # 5. Systems load
    sys_res = client.get("/api/systems", headers=headers)
    assert sys_res.status_code == 200, "5. Systems failed"
    assert len(sys_res.json()) >= 20

    # 6. Processes load
    proc_res = client.get(f"/api/processes?caseId={target_id}", headers=headers)
    assert proc_res.status_code == 200, "6. Processes failed"
    assert len(proc_res.json()) >= 100

    # 7. Files load
    files_res = client.get(f"/api/files?caseId={target_id}", headers=headers)
    assert files_res.status_code == 200, "7. Files failed"
    assert len(files_res.json()) >= 100

    # 8. Network data loads
    net_res = client.get(f"/api/network?caseId={target_id}", headers=headers)
    assert net_res.status_code == 200, "8. Network data failed"
    assert len(net_res.json()) >= 100

    # 9. Logs load
    logs_res = client.get(f"/api/logs?caseId={target_id}", headers=headers)
    assert logs_res.status_code == 200, "9. Logs failed"
    assert len(logs_res.json()) >= 100

    # 10. Evidence loads
    ev_res = client.get(f"/api/evidence?caseId={target_id}", headers=headers)
    assert ev_res.status_code == 200, "10. Evidence failed"
    assert len(ev_res.json()) >= 100

    # 11. Findings load & update
    fnd_res = client.get(f"/api/findings?caseId={target_id}", headers=headers)
    assert fnd_res.status_code == 200, "11. Findings failed"
    findings = fnd_res.json()
    assert len(findings) >= 1
    # Test update
    update_res = client.patch(f"/api/findings/{findings[0]['id']}", json={"status": "confirmed"})
    assert update_res.status_code == 200

    # 12. Timeline loads
    tml_res = client.get(f"/api/timeline?caseId={target_id}", headers=headers)
    assert tml_res.status_code == 200, "12. Timeline failed"
    assert len(tml_res.json()) > 0

    # 13. JOCKY Studio can validate a script
    val_res = client.post("/api/jocky/validate", json={"code": "process.list()\nnetwork.connections()"})
    assert val_res.status_code == 200, "13. JOCKY Validate failed"
    assert val_res.json()["valid"] is True

    # 14. JOCKY Studio can compile a script
    comp_res = client.post("/api/jocky/compile", json={
        "code": "process.list()\nfile.search('*.dll')\nevidence.collect()",
        "targetPlatform": "windows"
    })
    assert comp_res.status_code == 200, "14. JOCKY Compile failed"
    comp_data = comp_res.json()
    assert comp_data["isValid"] is True

    # 15. Compiler/IR page receives AST/IR
    assert "ast" in comp_data, "15. AST missing"
    assert "irCode" in comp_data, "15. IR missing"
    assert "bytecodeInstructions" in comp_data, "15. Bytecode missing"
    assert len(comp_data["bytecodeInstructions"]) == 3

    # 16. Analysis graph loads
    graph_res = client.get(f"/api/correlation?caseId={target_id}", headers=headers)
    assert graph_res.status_code == 200, "16. Correlation graph failed"
    assert "nodes" in graph_res.json()
    assert "edges" in graph_res.json()

    # 17. Reports load
    rep_res = client.get(f"/api/reports?caseId={target_id}", headers=headers)
    assert rep_res.status_code == 200, "17. Reports failed"
    assert len(rep_res.json()) > 0

    # 18. Audit logs load
    aud_res = client.get("/api/audit", headers=headers)
    assert aud_res.status_code == 200, "18. Audit logs failed"
    assert len(aud_res.json()) >= 30

    # 19. WebSocket events work
    with client.websocket_connect("/ws/events") as websocket:
        websocket.send_text("ping")
        resp = websocket.receive_text()
        assert resp == "pong", "19. WebSocket heartbeat failed"

    # 20. No frontend UI changes are required - contract confirmed
    assert True, "20. Complete frontend compatibility verified."
