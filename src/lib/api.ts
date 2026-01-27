import axios from "axios";
import { authStore } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL environment variable is not defined");
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to requests
api.interceptors.request.use((config) => {
  const token = authStore.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401 (skip for auth endpoints)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest?.url?.startsWith("/auth/");

    // Don't retry auth endpoints (login, refresh, logout)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post("/auth/refresh");
        authStore.setAccessToken(data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch {
        authStore.clear();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export async function login(username: string, password: string) {
  const { data } = await api.post("/auth/login", { username, password });
  authStore.setAccessToken(data.data.accessToken);
  return data;
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } finally {
    authStore.clear();
  }
}

export async function refreshToken() {
  const { data } = await api.post("/auth/refresh");
  authStore.setAccessToken(data.data.accessToken);
  return data;
}
