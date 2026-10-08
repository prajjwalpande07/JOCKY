from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
import os
from app.core.config import settings
from app.core.logging import logger
from app.database.base import Base

def get_engine():
    db_url = settings.DATABASE_URL
    connect_args = {}
    if db_url.startswith("sqlite"):
        connect_args["check_same_thread"] = False
    
    try:
        engine = create_engine(
            db_url,
            connect_args=connect_args,
            echo=False,
            pool_pre_ping=True
        )
        # Test connection
        with engine.connect() as conn:
            pass
        return engine
    except Exception as e:
        logger.warning(f"Could not connect to {db_url}: {e}. Falling back to local SQLite.")
        fallback_url = f"sqlite:///{settings.DATA_DIR / 'jocky.db'}"
        return create_engine(
            fallback_url,
            connect_args={"check_same_thread": False},
            echo=False
        )

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
