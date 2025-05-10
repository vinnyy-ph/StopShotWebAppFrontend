import axios from 'axios';

// Original API URL
const API_BASE_URL = 'http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api';

// CORS Proxy URL to bypass HTTPS restriction
// Using a public CORS proxy service
const CORS_PROXY = 'https://corsproxy.io/?';

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
  }
});

// Request interceptor to apply the proxy to all requests
api.interceptors.request.use(config => {
  if (config.url && config.url.includes(API_BASE_URL)) {
    config.url = createProxiedUrl(config.url);
  }
  return config;
});

export default api;

// Helper functions for API endpoints
export const getEndpoint = (endpoint: string) => {
  return `${API_BASE_URL}/${endpoint.replace(/^\//, '')}`;
};

// Common API functions
export const getFeedback = (config = {}) => {
  return api.get(getEndpoint('feedback/'), config);
};

export const postFeedback = (data: any, config = {}) => {
  return api.post(getEndpoint('feedback/'), data, config);
};

export const deleteFeedback = (id: string, config = {}) => {
  return api.delete(getEndpoint(`feedback/${id}/`), config);
};

export const getReservations = (config = {}) => {
  return api.get(getEndpoint('reservations/'), config);
};

export const postReservation = (data: any, config = {}) => {
  return api.post(getEndpoint('reservations/'), data, config);
};

export const logout = (config = {}) => {
  return api.post(getEndpoint('auth/logout/'), {}, config);
}; 