import axios from 'axios';
import { createProxiedUrl } from '../utils/api';

const API_BASE_URL = 'http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
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
  if (config.url && config.url.includes(API_BASE_URL)) {
    config.url = createProxiedUrl(config.url);
  }
  // If baseURL is used, we need to proxy that too
  if (config.baseURL && config.baseURL.includes(API_BASE_URL)) {
    // For baseURL, we can simply set it to empty and handle the full URL in the url
    config.baseURL = '';
    config.url = createProxiedUrl(`${API_BASE_URL}${config.url}`);
  }
  return config;
});

export default axiosInstance;