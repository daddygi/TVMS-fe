import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  StatsCard,
  ViolationMap,
  ViolationTable,
} from "@/components/dashboard";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <DashboardLayout
      title="Operations Overview"
      headerRight={
        <div className="text-right text-sm">
          <p className="font-semibold text-[#1a3a5c]">NCRJO-17-558</p>
          <p className="text-gray-500">Admin ID: 2025-01</p>
        </div>
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          value="61,792"
          label="VIOLATIONS PROCESSED"
          subtitle="Jan - Dec 2025"
          showCalendar
        />
        <StatsCard value="8" label="CRITICAL HOTSPOTS" subtitle="NCR Region" />
        <StatsCard
          value="34%"
          label="BEHAVIORAL RISKS"
          subtitle="NLP Detection Rate"
        />
        <StatsCard
          value="12"
          label="ACTIVE PATROLS"
          subtitle="Real-time Status"
        />
      </div>

      {/* Map and Table Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Map Section */}
        <div className="xl:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h3 className="font-semibold text-gray-900">
                Critical Enforcement Zones
              </h3>
              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                GEOCODING ACTIVE
              </span>
            </div>
            <div className="h-[400px] p-2 sm:h-[500px]">
              <ViolationMap />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="xl:col-span-1">
          <ViolationTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
