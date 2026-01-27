import axios from "axios";
import { authStore } from "@/stores/auth";
import type {
  ApprehensionsResponse,
  ApprehensionFilters,
  StatsResponse,
  StatsFilters,
} from "@/types/apprehension";

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

// Initialize auth state on app load
export async function initAuth() {
  try {
    const { data } = await api.post("/auth/refresh");
    authStore.setAccessToken(data.data.accessToken);
  } catch {
    // No valid session, user will need to login
    authStore.clear();
  } finally {
    authStore.setInitialized(true);
  }
}

// Apprehensions API
export async function getApprehensions(
  filters: ApprehensionFilters = {}
): Promise<ApprehensionsResponse> {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));
  if (filters.date) params.append("date", filters.date);
  if (filters.agency) params.append("agency", filters.agency);
  if (filters.violation) params.append("violation", filters.violation);
  if (filters.plateNumber) params.append("plateNumber", filters.plateNumber);
  if (filters.driverName) params.append("driverName", filters.driverName);

  const { data } = await api.get(`/apprehensions?${params.toString()}`);
  return data;
}

// Stats API
export async function getStats(filters: StatsFilters = {}): Promise<StatsResponse> {
  const params = new URLSearchParams();

  if (filters.month) params.append("month", filters.month);
  if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.append("dateTo", filters.dateTo);
  if (filters.agency) params.append("agency", filters.agency);
  if (filters.violation) params.append("violation", filters.violation);
  if (filters.placeOfApprehension) params.append("placeOfApprehension", filters.placeOfApprehension);
  if (filters.topLimit) params.append("topLimit", String(filters.topLimit));

  const { data } = await api.get(`/apprehensions/stats?${params.toString()}`);
  return data;
}
