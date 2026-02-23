import axios from "axios";

const API_URL = "http://127.0.0.1:8000/core";  

export const getLastMeasure = async (abonneId) => {
  const res = await axios.get(`${API_URL}/mesures/last/${abonneId}/`);
  return res.data;
};

export const getTodayMeasures = async (abonneId) => {
  const res = await axios.get(`${API_URL}/mesures/today/${abonneId}/`);
  return res.data;
};

export const getYesterdayTotal = async (abonneId) => {
  const res = await axios.get(`${API_URL}/mesures/yesterday/${abonneId}/`);
  return res.data.total;
};

export const getAlerts = async (abonneId) => {
  const res = await axios.get(`${API_URL}/alertes/${abonneId}/`);
  return res.data;
};

