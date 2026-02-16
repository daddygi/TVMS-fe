import { useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  ViolationLogsTable,
  ViolationFormModal,
  ViolationDetailModal,
  DeleteConfirmDialog,
  ImportModal,
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApprehensions } from "@/hooks/useApprehensions";
import {
  createApprehension,
  updateApprehension,
  deleteApprehension,
} from "@/lib/api";
import { Plus, Search, X, Upload } from "lucide-react";
import type { Apprehension, ApprehensionInput } from "@/types/apprehension";

export const Route = createFileRoute("/dashboard/violations")({
  component: ViolationLogsPage,
});

const AGENCIES = ["DLET", "DPWH", "PNP", "RLEU"];

function ViolationLogsPage() {
  const { data, pagination, isLoading, refetch, setPage, setFilters } =
    useApprehensions({ limit: 10 });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Apprehension | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgency, setSelectedAgency] = useState<string>("");

  // Handle search
  const handleSearch = useCallback(() => {
    setFilters({
      driverName: searchTerm || undefined,
      agency: selectedAgency && selectedAgency !== "all" ? selectedAgency : undefined,
    });
  }, [searchTerm, selectedAgency, setFilters]);

  // Handle agency change - auto filter immediately
  const handleAgencyChange = useCallback(
    (value: string) => {
      setSelectedAgency(value);
      setFilters({
        driverName: searchTerm || undefined,
        agency: value && value !== "all" ? value : undefined,
      });
    },
    [searchTerm, setFilters]
  );

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedAgency("");
    setFilters({});
  }, [setFilters]);

  // CRUD handlers
  const handleCreate = useCallback(() => {
    setSelectedRecord(null);
    setIsFormOpen(true);
  }, []);

  const handleView = useCallback((record: Apprehension) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  }, []);

  const handleEdit = useCallback((record: Apprehension) => {
    setSelectedRecord(record);
    setIsFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((record: Apprehension) => {
    setSelectedRecord(record);
    setIsDeleteOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (formData: ApprehensionInput) => {
      setIsSubmitting(true);
      setError(null);

      try {
        if (selectedRecord) {
          await updateApprehension(selectedRecord._id, formData);
        } else {
          await createApprehension(formData);
        }
        setIsFormOpen(false);
        setSelectedRecord(null);
        refetch();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to save record";
        setError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedRecord, refetch]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedRecord) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await deleteApprehension(selectedRecord._id);
      setIsDeleteOpen(false);
      setSelectedRecord(null);
      refetch();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete record";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedRecord, refetch]);

  const hasActiveFilters = searchTerm || (selectedAgency && selectedAgency !== "all");

  return (
    <DashboardLayout title="Violation Logs">
      <div className="space-y-4">
        {/* Header with Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Apprehension Records
            </h2>
            <p className="text-sm text-gray-500">
              Manage and track all violation records
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsImportOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New Record
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Search Driver
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by driver name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Agency
            </label>
            <Select value={selectedAgency} onValueChange={handleAgencyChange}>
              <SelectTrigger>
                <SelectValue placeholder="All agencies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All agencies</SelectItem>
                {AGENCIES.map((agency) => (
                  <SelectItem key={agency} value={agency}>
                    {agency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch}>Search</Button>
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters}>
                <X className="mr-1 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <ViolationLogsTable
          data={data}
          pagination={pagination}
          isLoading={isLoading}
          onPageChange={setPage}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Modals */}
      <ViolationFormModal
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setSelectedRecord(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedRecord}
        isLoading={isSubmitting}
      />

      <ViolationDetailModal
        open={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open);
          if (!open) setSelectedRecord(null);
        }}
        data={selectedRecord}
      />

      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) setSelectedRecord(null);
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={isSubmitting}
        title="Delete Violation Record"
        description={`Are you sure you want to delete case #${selectedRecord?.caseNumber}? This action cannot be undone.`}
      />

      <ImportModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onComplete={refetch}
      />
    </DashboardLayout>
  );
}
