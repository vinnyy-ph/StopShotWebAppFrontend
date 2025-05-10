import axios from 'axios';

// Original API URL
const API_BASE_URL = 'http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api';

// CORS Proxy URL to bypass HTTPS restriction
// Using a more reliable CORS proxy service
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// Helper function to create a proxied URL
export const createProxiedUrl = (url: string) => {
  // Check if we're in development or production
  if (import.meta.env.DEV) {
    // In development, use the direct URL
    return url;
  }
  // In production, use the proxied URL
  return `${CORS_PROXY}${encodeURIComponent(url)}`;
};

// Create configured axios instance
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'  // Required by some CORS proxies
  }
});

// Request interceptor to apply the proxy to all requests
api.interceptors.request.use(config => {
  if (config.url && !import.meta.env.DEV) {
    // Only in production: check if the URL is already absolute
    if (!config.url.startsWith('http')) {
      // If it's a relative URL, make it absolute first
      config.url = `${API_BASE_URL}/${config.url.replace(/^\//, '')}`;
    }
    // Then apply the proxy
    config.url = createProxiedUrl(config.url);
  }
  return config;
});

// Helper to get full endpoint URL
export const getEndpoint = (endpoint: string) => {
  return `${API_BASE_URL}/${endpoint.replace(/^\//, '')}`;
};

// API endpoints
export const getFeedback = (config = {}) => {
  return api.get('feedback/', config);
};

export const postFeedback = (data: any, config = {}) => {
  return api.post('feedback/', data, config);
};

export const deleteFeedback = (id: string, config = {}) => {
  return api.delete(`feedback/${id}/`, config);
};

export const getReservations = (config = {}) => {
  return api.get('reservations/list', config);
};

export const postReservation = (data: any, config = {}) => {
  return api.post('reservations/create', data, config);
};

export const logout = (config = {}) => {
  return api.post('auth/logout/', {}, config);
};

// Menu endpoints
export const getMenus = (config = {}) => {
  // Fix: use the correct endpoint
  return api.get('menus/list/', config);
};

// Generic fetch method
export const fetchFromApi = (endpoint: string, config = {}) => {
  return api.get(endpoint, config);
};

// Utility function to get a proxied URL directly
export const getProxiedUrl = (url: string) => {
  if (import.meta.env.DEV) {
    return url;
  }
  return createProxiedUrl(url);
};

// Add message endpoint
export const sendContactMessage = (data: any, config = {}) => {
  return api.post('message/', data, config);
}; 