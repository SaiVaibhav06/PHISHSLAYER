# API Documentation

## REST Endpoints

### `GET /api/health`
Check system status.
**Response**: `{"status": "healthy", "version": "1.0.0"}`

### `GET /api/alerts`
Retrieve recent alerts.
**Query Params**: 
- `limit` (int): Number of alerts to fetch (default: 50)
**Response**: `{"status": "success", "alerts": [...]}`

### `GET /api/alerts/stats`
Retrieve general statistical counters.
**Response**: `{"status": "success", "stats": {"total_packets_analyzed": ..., "threats_blocked": ..., "active_connections": ...}}`

### `POST /api/analyze`
Analyze text content for phishing signatures.
**Body**: `{"content": "text to analyze"}`
**Response**: 
```json
{
  "risk_score": 80,
  "risk_level": "high",
  "explanation": "Multiple scam indicators found.",
  "detected_keywords": ["urgent", "verify"]
}
```

## WebSocket

### `WS /ws`
Connects client to the live alert stream.
Incoming messages are JSON:
```json
{
  "event": "new_alert",
  "data": {
    "id": "uuid",
    "type": "alert type",
    "ip": "source ip",
    "severity": "high",
    "timestamp": "iso8601",
    "message": "description"
  }
}
```
