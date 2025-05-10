import axios from 'axios';
import { createProxiedUrl } from '../utils/api';

const API_BASE_URL = 'http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'  // Required by some CORS proxies
  }
});

// Add a request interceptor to add auth token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a request interceptor to apply the proxy to all requests
axiosInstance.interceptors.request.use(config => {
  // Only apply proxy in production environment
  if (!import.meta.env.DEV) {
    // If we have a full URL in the config.url
    if (config.url && config.url.startsWith('http')) {
      config.url = createProxiedUrl(config.url);
    } 
    // If we're using baseURL (more common case)
    else if (config.baseURL) {
      // Remove baseURL and build the complete URL
      const fullUrl = `${config.baseURL}${config.url || ''}`;
      config.baseURL = '';
      config.url = createProxiedUrl(fullUrl);
    }
  }
  return config;
});

export default axiosInstance;