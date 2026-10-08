from fastapi import APIRouter
from app.api.routes import (
    auth,
    dashboard,
    investigations,
    systems,
    processes,
    files,
    network,
    logs,
    evidence,
    findings,
    timeline,
    reports,
    jocky,
    compiler,
    security_validation,
    audit,
    analysis
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(dashboard.router)
api_router.include_router(investigations.router)
api_router.include_router(systems.router)
api_router.include_router(processes.router)
api_router.include_router(files.router)
api_router.include_router(network.router)
api_router.include_router(logs.router)
api_router.include_router(evidence.router)
api_router.include_router(findings.router)
api_router.include_router(timeline.router)
api_router.include_router(reports.router)
api_router.include_router(jocky.router)
api_router.include_router(compiler.router)
api_router.include_router(security_validation.router)
api_router.include_router(audit.router)
api_router.include_router(analysis.router)
