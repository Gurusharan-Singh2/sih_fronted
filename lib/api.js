import axios from "axios";

// const API_BASE = "http://localhost:3005";
const API_BASE = "https://sih-backend-gf7j.onrender.com";

// Sample threat detection scenarios (reuse your existing generateSampleAlerts function)
const generateSampleAlerts = () => {
  const now = new Date();
  return [
    // ... your previous sample alerts
  ];
};

// Ingest alerts to your backend
export const ingestAlerts = async () => {
  const alerts = generateSampleAlerts();

  try {
    const response = await axios.post(`${API_BASE}/ingest`, alerts);
    return response.data; // { ok: true, created_alerts: [...] }
  } catch (err) {
    console.error("Failed to ingest alerts:", err.message);
    throw err;
  }
};

// Fetch all alerts from backend
export const fetchAlerts = async () => {
  try {
    const response = await axios.get(`${API_BASE}/alerts`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch alerts:", err.message);
    throw err;
  }
};

// Explain an alert via backend
export const fetchExplain = async (alertId) => {
  try {
    const response = await axios.get(`${API_BASE}/explain/${alertId}`);
    return response.data; // { alert, explanation }
  } catch (err) {
    console.error("Failed to fetch explanation:", err.message);
    throw err;
  }
};

// Remediate an alert via backend
export const remediateAlert = async (alertId, action, reason) => {
  try {
    const response = await axios.post(`${API_BASE}/remediate`, {
      alert_id: alertId,
      action,
      reason,
    });
    return response.data; // { ok: true, remediation: {...} }
  } catch (err) {
    console.error("Failed to remediate alert:", err.message);
    throw err;
  }
};
