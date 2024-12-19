import axios from "axios";
import { getAuthToken, removeAuthToken } from "./auth";

const baseURL = process.env.NODE_ENV === 'production'
  ? "https://ec2-51-20-127-39.eu-north-1.compute.amazonaws.com"
  : "http://localhost:3000";

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAuthToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
