// ===========================================
// API Service - Handles all backend requests
// ===========================================
import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor: Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

// --- Auth Endpoints ---
export const loginUser = (formData) => API.post('/users/login', formData);
export const registerUser = (formData) => API.post('/users/register', formData);
export const getProfile = () => API.get('/users/profile');

// --- Accommodation Endpoints ---
export const getAccommodations = () => API.get('/accommodations');
export const getAccommodation = (id) => API.get('/accommodations/' + id);
export const createAccommodation = (data) => API.post('/accommodations', data);
export const updateAccommodation = (id, data) => API.put('/accommodations/' + id, data);
export const deleteAccommodation = (id) => API.delete('/accommodations/' + id);

// --- Reservation Endpoints ---
export const createReservation = (data) => API.post('/reservations', data);
export const getHostReservations = () => API.get('/reservations/host');
export const getUserReservations = () => API.get('/reservations/user');
export const deleteReservation = (id) => API.delete('/reservations/' + id);

export default API;
