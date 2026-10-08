import json
from datetime import datetime, timezone
from typing import List, Dict, Any
from fastapi import WebSocket, WebSocketDisconnect
from app.core.logging import logger

class ConnectionManager:
    """Manages active WebSocket connections for real-time forensic event telemetry."""

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket client disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast_event(self, event_type: str, data: Dict[str, Any]):
        """Broadcasts real-time forensic event payload to all connected clients."""
        payload = {
            "type": event_type,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "data": data
        }
        message = json.dumps(payload)
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                disconnected.append(connection)

        for dead_conn in disconnected:
            self.disconnect(dead_conn)

ws_manager = ConnectionManager()
