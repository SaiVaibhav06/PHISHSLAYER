# Architecture Overview

PhishSlayer follows a modern client-server architecture with real-time websocket capabilities.

## Backend (FastAPI)
The backend is structured into clear layers to enforce separation of concerns:
- **Routes Layer (`api/`)**: Translates HTTP requests into service calls.
- **Service Layer (`services/`)**: The core business logic, including threat detection and analysis algorithms.
- **Data Layer (`data/`)**: Currently implemented as in-memory storage, but abstracted so it can be swapped for a database (e.g., PostgreSQL or Redis) in the future.
- **Core (`core/`)**: Cross-cutting concerns such as configurations and websocket manager.

## Frontend (React + Vite)
- Relies on **Zustand** for global state management to handle high-frequency websocket updates without prop-drilling or large React context re-renders.
- **Custom Hooks**: Abstract away websocket instability through `useWebSocket`.
- UI is built fully with Tailwind using responsive and modular class patterns. 
