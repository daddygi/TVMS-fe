type AuthListener = () => void;

export interface User {
  id: string;
  username: string;
}

function parseJwt(token: string): User | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return {
      id: payload.userId,
      username: payload.username,
    };
  } catch {
    return null;
  }
}

class AuthStore {
  private accessToken: string | null = null;
  private user: User | null = null;
  private listeners: Set<AuthListener> = new Set();
  private _isInitialized = false;

  getAccessToken() {
    return this.accessToken;
  }

  getUser() {
    return this.user;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    this.user = parseJwt(token);
    this.notify();
  }

  clear() {
    this.accessToken = null;
    this.user = null;
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

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export const authStore = new AuthStore();
