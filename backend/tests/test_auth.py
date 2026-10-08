import time
import pytest

def test_login_success(client):
    res = client.post("/api/auth/login", json={
        "email": "admin@jocky.local",
        "password": "Admin@123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["role"] == "ADMIN"
    assert "refresh_token" in data

def test_login_invalid_password(client):
    res = client.post("/api/auth/login", json={
        "email": "admin@jocky.local",
        "password": "WrongPassword"
    })
    assert res.status_code == 401

def test_get_me(client):
    login_res = client.post("/api/auth/login", json={
        "email": "admin@jocky.local",
        "password": "Admin@123"
    })
    token = login_res.json()["access_token"]
    res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.json()["email"] == "admin@jocky.local"

def test_register_user(client):
    unique_email = f"dana_{int(time.time() * 1000)}@jocky.local"
    res = client.post("/api/auth/register", json={
        "name": "Special Agent Dana",
        "email": unique_email,
        "password": "SecurePassword@123",
        "role": "INVESTIGATOR"
    })
    assert res.status_code == 201
    assert "access_token" in res.json()
    assert res.json()["email"] == unique_email
