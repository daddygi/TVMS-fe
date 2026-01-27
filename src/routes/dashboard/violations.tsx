import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard";

export const Route = createFileRoute("/dashboard/violations")({
  component: ViolationLogsPage,
});

function ViolationLogsPage() {
  return (
    <DashboardLayout title="Violation Logs">
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">Violation Logs - Coming Soon</p>
      </div>
    </DashboardLayout>
  );
}
