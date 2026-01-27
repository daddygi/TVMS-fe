import { useSyncExternalStore } from "react";
import { authStore, type User } from "@/stores/auth";

const subscribe = (callback: () => void) => authStore.subscribe(callback);
const getSnapshot = () => authStore.getSnapshot();

export function useAuth() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export type { User };
