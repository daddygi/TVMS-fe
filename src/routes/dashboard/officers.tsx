import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard";

export const Route = createFileRoute("/dashboard/officers")({
  component: OfficersPage,
});

function OfficersPage() {
  return (
    <DashboardLayout title="Officers">
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">Officers Management - Coming Soon</p>
      </div>
    </DashboardLayout>
  );
}
