import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Apprehension, Pagination } from "@/types/apprehension";

interface ViolationTableProps {
  data: Apprehension[];
  pagination: Pagination | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDriverName(driver: { lastName: string; firstName: string }): string {
  return `${driver.lastName}, ${driver.firstName}`;
}

function TableSkeleton() {
  return (
    <tbody>
      {[...Array(5)].map((_, i) => (
        <tr key={i}>
          <td className="px-4 py-3">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export function ViolationTable({
  data,
  pagination,
  isLoading,
  onPageChange,
}: ViolationTableProps) {
  const canGoPrev = pagination && pagination.page > 1;
  const canGoNext = pagination && pagination.page < pagination.totalPages;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h3 className="font-semibold text-gray-900">Recent Apprehensions</h3>
        {pagination && (
          <span className="text-xs text-gray-500">
            {pagination.total.toLocaleString()} total records
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Case #</th>
              <th className="px-4 py-3 font-medium">Violation</th>
              <th className="px-4 py-3 font-medium">Driver</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-blue-600">
                    {item.caseNumber}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <span className="line-clamp-1" title={item.violation}>
                      {item.violation}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {formatDriverName(item.driver)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {item.placeOfApprehension}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {formatDate(item.dateOfApprehension)}
                  </td>
                </tr>
              ))}
              {data.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No apprehensions found
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>
      {pagination && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <p className="text-xs text-gray-500">
            Page {pagination.page} of {pagination.totalPages.toLocaleString()}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!canGoPrev || isLoading}
              className="flex items-center gap-1 rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-3 w-3" />
              Prev
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!canGoNext || isLoading}
              className="flex items-center gap-1 rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
