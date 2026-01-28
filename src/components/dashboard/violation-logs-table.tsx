import { ChevronLeft, ChevronRight, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Apprehension, Pagination } from "@/types/apprehension";

interface ViolationLogsTableProps {
  data: Apprehension[];
  pagination: Pagination | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onView: (item: Apprehension) => void;
  onEdit: (item: Apprehension) => void;
  onDelete: (item: Apprehension) => void;
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
      {[...Array(10)].map((_, i) => (
        <tr key={i}>
          {[...Array(7)].map((__, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export function ViolationLogsTable({
  data,
  pagination,
  isLoading,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: ViolationLogsTableProps) {
  const canGoPrev = pagination && pagination.page > 1;
  const canGoNext = pagination && pagination.page < pagination.totalPages;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Case #</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Violation</th>
              <th className="px-4 py-3 font-medium">Driver</th>
              <th className="px-4 py-3 font-medium">Plate #</th>
              <th className="px-4 py-3 font-medium">Agency</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
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
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {formatDate(item.dateOfApprehension)}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <span className="line-clamp-1 max-w-[200px]" title={item.violation}>
                      {item.violation}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {formatDriverName(item.driver)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {item.plateNumber}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {item.agency}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onView(item)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(item)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onDelete(item)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No violation records found
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>
      {pagination && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of <span className="font-medium">{pagination.total.toLocaleString()}</span>{" "}
            records
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!canGoPrev || isLoading}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!canGoNext || isLoading}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
