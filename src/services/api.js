/**
 * api.js - API service for Airbnb Admin Dashboard
 * Connects to deployed backend on Render.com
 */

import axios from "axios";

const API_BASE_URL = "https://YOUR_RENDER_URL.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (email, password) => {
  const res = await api.post("/users/login", { email, password });
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data));
  }
  return res.data;
};

export const getUserProfile = async () => (await api.get("/users/profile")).data;
export const logoutUser = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); };
export const isLoggedIn = () => localStorage.getItem("token") !== null;
export const getStoredUser = () => { const u = localStorage.getItem("user"); return u ? JSON.parse(u) : null; };
export const createAccommodation = async (data) => (await api.post("/accommodations", data)).data;
export const getAccommodations = async () => (await api.get("/accommodations")).data;
export const getAccommodationById = async (id) => (await api.get("/accommodations/" + id)).data;
export const updateAccommodation = async (id, data) => (await api.put("/accommodations/" + id, data)).data;
export const deleteAccommodation = async (id) => (await api.delete("/accommodations/" + id)).data;
export const createReservation = async (data) => (await api.post("/reservations", data)).data;
export const getUserReservations = async () => (await api.get("/reservations/user")).data;
export const getHostReservations = async () => (await api.get("/reservations/host")).data;
export const deleteReservation = async (id) => (await api.delete("/reservations/" + id)).data;

export default api;
