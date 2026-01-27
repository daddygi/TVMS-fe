type AuthListener = () => void;

class AuthStore {
  private accessToken: string | null = null;
  private listeners: Set<AuthListener> = new Set();
  private _isInitialized = false;

  getAccessToken() {
    return this.accessToken;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    this.notify();
  }

  clear() {
    this.accessToken = null;
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
