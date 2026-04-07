import { useEffect } from 'react';
import { useAlertStore } from '../../store/useAlertStore';
import toast from 'react-hot-toast';

export default function AlertToastNotification() {
  const alerts = useAlertStore(state => state.alerts);
  
  useEffect(() => {
    if (alerts.length > 0) {
      const latest = alerts[0];
      // Only toast if it's super fresh inside the last 3-4 seconds, to avoid old toasts on load
      const isFresh = (new Date() - new Date(latest.timestamp)) < 4000;
      
      if (isFresh) {
        if (latest.severity === 'critical' || latest.severity === 'high') {
          // Play beep sound
          try {
             const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
             const oscillator = audioCtx.createOscillator();
             const gainNode = audioCtx.createGain();
             oscillator.type = 'square';
             oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // 440 Hz Beep
             oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
             gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); 
             gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
             oscillator.connect(gainNode);
             gainNode.connect(audioCtx.destination);
             oscillator.start();
             oscillator.stop(audioCtx.currentTime + 0.5);
          } catch(e) {
             console.error("Audio beep failed", e);
          }

          toast.error(`⚠️ ${latest.type} Detected! from ${latest.ip}`, {
            style: {
              background: '#450a0a', // very dark red
              border: '1px solid #7f1d1d',
              color: '#fca5a5'
            },
            duration: 5000,
          });
        } else {
          toast(`Log: ${latest.type}`, {
             icon: 'ℹ️',
             style: { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }
          });
        }
      }
    }
  }, [alerts]);
  
  return null; // pure headless component listening to store
}
