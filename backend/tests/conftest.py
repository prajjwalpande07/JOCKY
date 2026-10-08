import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.database import SessionLocal, init_db
from app.database.seed import seed_database

@pytest.fixture(scope="session")
def client():
    init_db()
    with SessionLocal() as db:
        seed_database(db)
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
def db_session():
    with SessionLocal() as session:
        yield session
