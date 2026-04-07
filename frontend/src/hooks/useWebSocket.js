import { useEffect, useRef, useState } from 'react';
import { useAlertStore } from '../store/useAlertStore';

export function useWebSocket(url) {
  const ws = useRef(null);
  const addAlert = useAlertStore(state => state.addAlert);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setIsConnected(true);
        console.log("WebSocket connected");
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.event === 'new_alert') {
            addAlert(message.data);
          }
        } catch (err) {
          console.error("Error parsing WS message", err);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        console.log("WebSocket disconnected. Reconnecting in 3s...");
        setTimeout(connect, 3000);
      };
      
      ws.current.onerror = (err) => {
         console.error("WebSocket error", err);
      };
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url, addAlert]);

  return { isConnected };
}
