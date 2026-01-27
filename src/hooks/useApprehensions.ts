import { useState, useEffect, useCallback } from "react";
import { getApprehensions, getStats } from "@/lib/api";
import type {
  Apprehension,
  Pagination,
  ApprehensionFilters,
  StatsData,
  StatsFilters,
} from "@/types/apprehension";

// Hook for paginated apprehension list (table)
interface UseApprehensionsResult {
  data: Apprehension[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  filters: ApprehensionFilters;
  refetch: () => void;
  setPage: (page: number) => void;
  setFilters: (filters: ApprehensionFilters) => void;
}

export function useApprehensions(
  initialFilters: ApprehensionFilters = {}
): UseApprehensionsResult {
  const [data, setData] = useState<Apprehension[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ApprehensionFilters>(initialFilters);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getApprehensions(filters);
      setData(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const updateFilters = useCallback((newFilters: ApprehensionFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  return {
    data,
    pagination,
    isLoading,
    error,
    filters,
    refetch: fetchData,
    setPage,
    setFilters: updateFilters,
  };
}

// Hook for stats (cards and map)
interface UseStatsResult {
  stats: StatsData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStats(filters: StatsFilters = {}): UseStatsResult {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getStats(filters);
      setStats(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setIsLoading(false);
    }
  }, [filters.month, filters.dateFrom, filters.dateTo, filters.agency, filters.violation, filters.placeOfApprehension, filters.topLimit]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}
