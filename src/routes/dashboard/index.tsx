import { useMemo, useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import {
  DashboardLayout,
  StatsCard,
  ViolationMap,
  ViolationTable,
} from "@/components/dashboard";
import type { LocationAggregation } from "@/components/dashboard/violation-map";
import { useAuth } from "@/hooks/useAuth";
import { useApprehensions, useStats } from "@/hooks/useApprehensions";
import { NCR_LOCATIONS, normalizeLocation } from "@/lib/locations";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

// Generate month options for 2025 (dataset range)
function getMonthOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [
    { value: "", label: "All Time" },
  ];

  // Generate all months of 2025
  for (let month = 11; month >= 0; month--) {
    const date = new Date(2025, month, 1);
    const value = `2025-${String(month + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    options.push({ value, label });
  }

  return options;
}

const MONTH_OPTIONS = getMonthOptions();

// Map location names from API to coordinates (aggregates duplicates)
function mapLocationsToCoords(
  locations: { location: string; count: number }[]
): LocationAggregation[] {
  const aggregated = new Map<string, { name: string; coords: [number, number]; count: number }>();

  for (const item of locations) {
    const normalized = normalizeLocation(item.location);
    if (normalized && NCR_LOCATIONS[normalized]) {
      const existing = aggregated.get(normalized);
      if (existing) {
        existing.count += item.count;
      } else {
        aggregated.set(normalized, {
          name: NCR_LOCATIONS[normalized].name,
          coords: NCR_LOCATIONS[normalized].coords,
          count: item.count,
        });
      }
    }
  }

  return Array.from(aggregated.entries()).map(([key, data]) => ({
    key,
    ...data,
  }));
}

function DashboardPage() {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState("");

  // Convert month to API date format
  const dateFilter = selectedMonth ? `${selectedMonth}-01` : undefined;

  // Table data - paginated for display
  const {
    data: tableData,
    pagination,
    isLoading: tableLoading,
    setPage,
  } = useApprehensions({ limit: 10, date: dateFilter });

  // Stats data - from dedicated endpoint
  const { stats, isLoading: statsLoading } = useStats({
    month: selectedMonth || undefined,
    topLimit: 10,
  });

  const handleMonthChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedMonth(e.target.value);
    },
    []
  );

  // Map locations from stats to coordinates
  const locationAggregations = useMemo(
    () => (stats?.topLocations ? mapLocationsToCoords(stats.topLocations) : []),
    [stats?.topLocations]
  );

  // Get display label for selected month
  const selectedMonthLabel = selectedMonth
    ? MONTH_OPTIONS.find((o) => o.value === selectedMonth)?.label ?? "Selected Month"
    : "All Time";

  const isLoading = tableLoading || statsLoading;

  return (
    <DashboardLayout
      title="Operations Overview"
      headerRight={
        <div className="text-right text-sm">
          <p className="font-semibold text-[#1a3a5c]">{user?.username}</p>
          <p className="text-gray-500">ID: {user?.id}</p>
        </div>
      }
    >
      {/* Filter Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1a3a5c]/10">
              <Calendar className="h-4 w-4 text-[#1a3a5c]" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Filter by Month</p>
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                disabled={isLoading}
                className="mt-0.5 w-40 cursor-pointer rounded border-none bg-transparent p-0 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {MONTH_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {stats && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
            <span>Data as of {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          value={stats?.total.toLocaleString() ?? "-"}
          label="TOTAL APPREHENSIONS"
          subtitle={selectedMonthLabel}
        />
        <StatsCard
          value={stats?.topAgencies[0]?.agency ?? "-"}
          label="TOP AGENCY"
          subtitle={
            stats?.topAgencies[0]
              ? `${stats.topAgencies[0].count.toLocaleString()} apprehensions`
              : "Loading..."
          }
        />
        <StatsCard
          value={stats?.topLocations.length ?? "-"}
          label="LOCATIONS"
          subtitle="Top areas"
        />
        <StatsCard
          value={stats?.topViolations[0]?.violation ?? "-"}
          label="TOP VIOLATION"
          subtitle={
            stats?.topViolations[0]
              ? `${stats.topViolations[0].count.toLocaleString()} cases`
              : "Loading..."
          }
        />
      </div>

      {/* Map and Table Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Map Section */}
        <div className="xl:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h3 className="font-semibold text-gray-900">
                Top Apprehension Locations
              </h3>
              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                LIVE DATA
              </span>
            </div>
            <div className="h-[400px] p-2 sm:h-[500px]">
              <ViolationMap locations={locationAggregations} isLoading={statsLoading} />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="xl:col-span-1">
          <ViolationTable
            data={tableData}
            pagination={pagination}
            isLoading={tableLoading}
            onPageChange={setPage}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
