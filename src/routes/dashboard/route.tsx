import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authStore } from "@/stores/auth";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (!authStore.isAuthenticated()) {
      throw redirect({ to: "/" });
    }
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return <Outlet />;
}
