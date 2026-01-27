import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard";

export const Route = createFileRoute("/dashboard/spatial")({
  component: SpatialAnalyticsPage,
});

function SpatialAnalyticsPage() {
  return (
    <DashboardLayout title="Spatial Analytics">
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">Spatial Analytics - Coming Soon</p>
      </div>
    </DashboardLayout>
  );
}
