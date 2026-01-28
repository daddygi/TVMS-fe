import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Apprehension } from "@/types/apprehension";

interface ViolationDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Apprehension | null;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between border-b border-gray-100 py-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value || "—"}</span>
    </div>
  );
}

export function ViolationDetailModal({
  open,
  onOpenChange,
  data,
}: ViolationDetailModalProps) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Case #{data.caseNumber}</span>
            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              {data.agency}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Apprehension Details */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">
              Apprehension Details
            </h4>
            <div className="rounded-lg bg-gray-50 p-4">
              <DetailRow label="Violation" value={data.violation} />
              <DetailRow
                label="Date of Apprehension"
                value={formatDate(data.dateOfApprehension)}
              />
              <DetailRow label="Time" value={data.timeOfApprehension} />
              <DetailRow label="Location" value={data.placeOfApprehension} />
              <DetailRow label="Apprehending Officer" value={data.apprehendingOfficer} />
              <DetailRow
                label="Days Interval"
                value={data.daysInterval?.toString() || "0"}
              />
            </div>
          </div>

          {/* Driver Information */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">
              Driver Information
            </h4>
            <div className="rounded-lg bg-gray-50 p-4">
              <DetailRow
                label="Name"
                value={`${data.driver.firstName} ${data.driver.lastName}`}
              />
              <DetailRow
                label="Gender"
                value={data.gender === "M" ? "Male" : data.gender === "F" ? "Female" : data.gender}
              />
              <DetailRow label="Nationality" value={data.nationality} />
              <DetailRow label="Restriction Code" value={data.restrictionCode} />
              <DetailRow label="Conditions" value={data.conditions} />
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">
              Vehicle Information
            </h4>
            <div className="rounded-lg bg-gray-50 p-4">
              <DetailRow label="Plate Number" value={data.plateNumber} />
              <DetailRow label="Vehicle Type" value={data.mvType} />
            </div>
          </div>

          {/* Confiscated Items */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">
              Confiscated Items
            </h4>
            <div className="rounded-lg bg-gray-50 p-4">
              <DetailRow label="Type" value={data.confiscatedItem?.type} />
              <DetailRow label="Number" value={data.confiscatedItem?.number} />
            </div>
          </div>

          {/* Remarks */}
          {data.remarks && (
            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-900">Remarks</h4>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-700">{data.remarks}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Created: {formatDateTime(data.createdAt)}</span>
              <span>Updated: {formatDateTime(data.updatedAt)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
