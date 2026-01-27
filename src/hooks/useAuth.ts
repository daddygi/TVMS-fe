import { useSyncExternalStore } from "react";
import { authStore, type User } from "@/lib/auth";

export function useAuth() {
  const user = useSyncExternalStore(
    (callback) => authStore.subscribe(callback),
    () => authStore.getUser()
  );

  const isAuthenticated = useSyncExternalStore(
    (callback) => authStore.subscribe(callback),
    () => authStore.isAuthenticated()
  );

  return { user, isAuthenticated };
}

export type { User };
