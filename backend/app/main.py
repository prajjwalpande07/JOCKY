import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.logging import logger
from app.api.router import api_router
from app.database.database import init_db, SessionLocal
from app.database.seed import seed_database
from app.websocket.events import ws_manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize tables and seed data if empty
    logger.info("Initializing JOCKY forensic database schema...")
    init_db()
    with SessionLocal() as db:
        seed_database(db)
    logger.info("JOCKY Forensic Framework startup complete.")
    yield
    logger.info("JOCKY Forensic Framework shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Enterprise-grade Cross-Platform Forensic Analysis & Threat Hunting Framework backend API.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Logging & Timing Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    duration = time.perf_counter() - start_time
    
    # Do not log sensitive credentials
    path = request.url.path
    if not any(s in path for s in ("/auth/login", "/auth/register")):
        logger.info(
            f"{request.method} {path} - {response.status_code} ({duration * 1000:.2f}ms)",
            extra={"client_ip": request.client.host if request.client else "unknown"}
        )
    return response

# Custom Error Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "status_code": exc.status_code,
            "message": exc.detail,
            "path": request.url.path
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err.get("loc", []))
        errors.append(f"{field}: {err.get('msg')}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": True,
            "status_code": 422,
            "message": "Validation Error",
            "details": errors,
            "path": request.url.path
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "status_code": 500,
            "message": "Internal Server Error occurred during forensic processing.",
            "path": request.url.path
        }
    )

# Real-time WebSocket Endpoint: /ws/events
@app.websocket("/ws/events")
async def websocket_events_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep-alive loop receiving client pings or heartbeats
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        logger.warning(f"WebSocket connection terminated: {e}")
        ws_manager.disconnect(websocket)

# Health Check Endpoint
@app.get("/health", tags=["Health"])
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "JOCKY Forensic Framework",
        "version": settings.PROJECT_VERSION
    }

# Mount API routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)
