type AuthListener = () => void;

export type UserRole = "admin" | "user";

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

function parseJwt(token: string): User | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return {
      id: payload.userId,
      username: payload.username,
      role: payload.role || "user",
    };
  } catch {
    return null;
  }
}

export interface AuthSnapshot {
  user: User | null;
  isAuthenticated: boolean;
}

class AuthStore {
  private accessToken: string | null = null;
  private user: User | null = null;
  private listeners: Set<AuthListener> = new Set();
  private _isInitialized = false;
  private snapshot: AuthSnapshot = { user: null, isAuthenticated: false };

  getAccessToken() {
    return this.accessToken;
  }

  getSnapshot() {
    return this.snapshot;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    this.user = parseJwt(token);
    this.updateSnapshot();
    this.notify();
  }

  clear() {
    this.accessToken = null;
    this.user = null;
    this.updateSnapshot();
    this.notify();
  }

  isAuthenticated() {
    return !!this.accessToken;
  }

  isInitialized() {
    return this._isInitialized;
  }

  setInitialized(value: boolean) {
    this._isInitialized = value;
    this.notify();
  }

  subscribe(listener: AuthListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private updateSnapshot() {
    this.snapshot = {
      user: this.user,
      isAuthenticated: !!this.accessToken,
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export const authStore = new AuthStore();
