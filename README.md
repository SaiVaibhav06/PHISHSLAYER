# PhishSlayer

A production-grade full-stack cybersecurity platform built with FastAPI, React, and WebSockets.

## Features
- **Real-time Monitoring:** Live alerts via WebSockets.
- **Threat Detection:** Detects suspicious IP addresses and unusual network activity.
- **Content Analyzer:** On-the-fly scam and phishing detection for text inputs.
- **Built-in Simulator:** Includes a background threat generator and packet sniffer for easy demonstration.

## Architecture Highlights
- Separation of concerns between API, Services, and Core layers.
- Global application state in frontend with Zustand.
- Custom `useWebSocket` hook in React for robust connections.
- Tailwind CSS styling tailored for a dark, cybersecurity-themed dashboard.

## Setup Instructions

### Backend
1. Navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the complete backend application stack locally:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend
1. Navigate to the `frontend` folder.
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development sever:
   ```bash
   npm run dev
   ```

The backend starts on `http://127.0.0.1:8000` by default.  
The frontend starts on `http://localhost:5173`. Open your browser to view the application.
