import { useSyncExternalStore } from "react";
import { authStore } from "@/lib/auth";

export function useAuth() {
  const isAuthenticated = useSyncExternalStore(
    (callback) => authStore.subscribe(callback),
    () => authStore.isAuthenticated()
  );

  return { isAuthenticated };
}
