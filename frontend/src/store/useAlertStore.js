import { create } from 'zustand';

export const useAlertStore = create((set) => ({
  alerts: [],
  stats: {
    total_packets_analyzed: 0,
    threats_blocked: 0,
    active_connections: 0,
  },
  addAlert: (alert) => set((state) => ({ 
    alerts: [alert, ...state.alerts].slice(0, 100) 
  })),
  setInitialAlerts: (alerts) => set({ alerts }),
  setStats: (stats) => set({ stats }),
}));
