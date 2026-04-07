import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import NetworkMonitor from './pages/NetworkMonitor';
import PhishingAnalyzer from './pages/PhishingAnalyzer';
import History from './pages/History';
import { useWebSocket } from './hooks/useWebSocket';
import { Toaster } from 'react-hot-toast';
import AlertToastNotification from './components/alerts/AlertToastNotification';

function App() {
  // Mount websocket at root so it records data regardless of the page we are on
  useWebSocket("ws://localhost:8000/ws");

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-slate-200 selection:bg-primary/30 font-sans">
        <Toaster position="top-right" toastOptions={{ className: 'glass-panel text-white' }} />
        <AlertToastNotification />
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/network" element={<NetworkMonitor />} />
            <Route path="/analyzer" element={<PhishingAnalyzer />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </Layout>
      </div>
    </BrowserRouter>
  );
}

export default App;
