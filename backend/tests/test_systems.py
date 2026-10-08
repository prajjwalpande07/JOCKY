import pytest

def test_list_systems(client):
    res = client.get("/api/systems")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 20
    first = data[0]
    assert "hostname" in first
    assert "ip" in first
    assert "platform" in first

def test_filter_systems_platform(client):
    res = client.get("/api/systems?platform=ubuntu")
    assert res.status_code == 200
    for s in res.json():
        assert s["platform"] == "ubuntu"
