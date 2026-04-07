from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio

from app.core.config import settings
from app.core.websocket_manager import manager
from app.api.routes import health, alerts, analyze
from app.services.packet_sniffer import sniffer
from app.data.store import stats_store

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Includes
app.include_router(health.router, prefix="/api/health", tags=["health"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])
app.include_router(analyze.router, prefix="/api/analyze", tags=["analyze"])

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    stats_store["active_connections"] += 1
    try:
        while True:
            # Just keep connection open, could handle incoming messages here
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        stats_store["active_connections"] -= 1

@app.on_event("startup")
async def startup_event():
    if settings.SIMULATE_TRAFFIC:
        sniffer.start()

@app.on_event("shutdown")
async def shutdown_event():
    if settings.SIMULATE_TRAFFIC:
        sniffer.stop()
