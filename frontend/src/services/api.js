import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export const api = {
  getStats: async () => {
    const res = await axios.get(`${API_BASE}/alerts/stats`);
    return res.data;
  },
  getAlerts: async () => {
     const res = await axios.get(`${API_BASE}/alerts`);
     return res.data;
  },
  analyzeContent: async (content, filename = null) => {
    const res = await axios.post(`${API_BASE}/analyze`, { content, filename });
    return res.data;
  },
  simulateAttack: async () => {
    const res = await axios.post(`${API_BASE}/alerts/simulate`);
    return res.data;
  }
};
