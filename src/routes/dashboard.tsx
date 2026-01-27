import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api";
import { authStore } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (!authStore.isAuthenticated()) {
      throw new Error("Not authenticated");
    }
  },
  onError: () => {
    window.location.href = "/";
  },
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#1a3a5c] text-white shadow">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/lto-logo.jpeg"
              alt="LTO Logo"
              className="h-10 w-10 rounded-full bg-white object-contain p-1"
            />
            <span className="text-lg font-semibold">TVMS Dashboard</span>
          </div>
          <Button
            variant="ghost"
            className="cursor-pointer text-white hover:bg-white/10 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome to the Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          You have successfully logged in to the Traffic Violation Monitoring
          System.
        </p>

        {/* Placeholder cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="font-semibold text-gray-900">Total Violations</h3>
            <p className="mt-2 text-3xl font-bold text-[#1a3a5c]">0</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="font-semibold text-gray-900">Pending Cases</h3>
            <p className="mt-2 text-3xl font-bold text-[#1a3a5c]">0</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="font-semibold text-gray-900">Resolved Cases</h3>
            <p className="mt-2 text-3xl font-bold text-[#1a3a5c]">0</p>
          </div>
        </div>
      </main>
    </div>
  );
}
