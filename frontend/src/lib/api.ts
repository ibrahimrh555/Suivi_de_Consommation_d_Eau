import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/core",
  timeout: 10_000,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getLastMeasure = (abonneId: number) => api.get(`/mesures/last/${abonneId}/`).then(({ data }) => data);
export const getTodayMeasures = (abonneId: number) => api.get(`/mesures/today/${abonneId}/`).then(({ data }) => data);
export const getYesterdayTotal = (abonneId: number) => api.get(`/mesures/yesterday/${abonneId}/`).then(({ data }) => data.total);
export const getAlerts = (abonneId: number) => api.get(`/alertes/${abonneId}/`).then(({ data }) => data);
