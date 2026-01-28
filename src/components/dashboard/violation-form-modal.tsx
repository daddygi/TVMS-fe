import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { Apprehension, ApprehensionInput } from "@/types/apprehension";

interface ViolationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ApprehensionInput) => Promise<void>;
  initialData?: Apprehension | null;
  isLoading?: boolean;
}

const AGENCIES = ["DLET", "DPWH", "PNP", "RLEU"];
const GENDERS = ["M", "F"];
const MV_TYPES = ["Sedan", "SUV", "Van", "Motorcycle", "Truck", "Bus", "Jeepney", "Tricycle"];
const CONFISCATED_TYPES = ["License", "Plate", "OR/CR", "None"];

const initialFormState: ApprehensionInput = {
  dateOfSubmission: new Date().toISOString().split("T")[0],
  dateOfApprehension: "",
  timeOfApprehension: "",
  agency: "",
  apprehendingOfficer: "",
  caseNumber: "",
  driver: { lastName: "", firstName: "" },
  violation: "",
  confiscatedItem: { type: null, number: null },
  restrictionCode: "",
  conditions: "",
  nationality: "Filipino",
  gender: "",
  mvType: "",
  plateNumber: "",
  placeOfApprehension: "",
  remarks: "",
};

function formatDateForInput(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
}

function getFormState(data: Apprehension | null | undefined): ApprehensionInput {
  if (!data) return initialFormState;
  return {
    dateOfSubmission: formatDateForInput(data.dateOfSubmission),
    dateOfApprehension: formatDateForInput(data.dateOfApprehension),
    timeOfApprehension: data.timeOfApprehension || "",
    agency: data.agency || "",
    apprehendingOfficer: data.apprehendingOfficer || "",
    caseNumber: data.caseNumber || "",
    driver: {
      lastName: data.driver?.lastName || "",
      firstName: data.driver?.firstName || "",
    },
    violation: data.violation || "",
    confiscatedItem: {
      type: data.confiscatedItem?.type || null,
      number: data.confiscatedItem?.number || null,
    },
    restrictionCode: data.restrictionCode || "",
    conditions: data.conditions || "",
    nationality: data.nationality || "Filipino",
    gender: data.gender || "",
    mvType: data.mvType || "",
    plateNumber: data.plateNumber || "",
    placeOfApprehension: data.placeOfApprehension || "",
    remarks: data.remarks || "",
  };
}

export function ViolationFormModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading,
}: ViolationFormModalProps) {
  const [form, setForm] = useState<ApprehensionInput>(() => getFormState(initialData));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastInitialDataId, setLastInitialDataId] = useState<string | undefined>(
    initialData?._id
  );

  const isEditMode = !!initialData;

  // Reset form when initialData changes (sync external state)
  if (initialData?._id !== lastInitialDataId) {
    setForm(getFormState(initialData));
    setErrors({});
    setLastInitialDataId(initialData?._id);
  }

  const updateField = <K extends keyof ApprehensionInput>(
    field: K,
    value: ApprehensionInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.dateOfApprehension) newErrors.dateOfApprehension = "Required";
    if (!form.timeOfApprehension) newErrors.timeOfApprehension = "Required";
    if (!form.agency) newErrors.agency = "Required";
    if (!form.apprehendingOfficer) newErrors.apprehendingOfficer = "Required";
    if (!form.caseNumber) newErrors.caseNumber = "Required";
    if (!form.driver.lastName) newErrors.driverLastName = "Required";
    if (!form.driver.firstName) newErrors.driverFirstName = "Required";
    if (!form.violation) newErrors.violation = "Required";
    if (!form.plateNumber) newErrors.plateNumber = "Required";
    if (!form.placeOfApprehension) newErrors.placeOfApprehension = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Violation Record" : "New Violation Record"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dates Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfSubmission">Date of Submission</Label>
              <Input
                id="dateOfSubmission"
                type="date"
                value={form.dateOfSubmission}
                onChange={(e) => updateField("dateOfSubmission", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfApprehension">
                Date of Apprehension <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateOfApprehension"
                type="date"
                value={form.dateOfApprehension}
                onChange={(e) => updateField("dateOfApprehension", e.target.value)}
                aria-invalid={!!errors.dateOfApprehension}
              />
              {errors.dateOfApprehension && (
                <p className="text-xs text-red-500">{errors.dateOfApprehension}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeOfApprehension">
                Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="timeOfApprehension"
                type="time"
                value={form.timeOfApprehension}
                onChange={(e) => updateField("timeOfApprehension", e.target.value)}
                aria-invalid={!!errors.timeOfApprehension}
              />
              {errors.timeOfApprehension && (
                <p className="text-xs text-red-500">{errors.timeOfApprehension}</p>
              )}
            </div>
          </div>

          {/* Agency and Officer */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agency">
                Agency <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.agency}
                onValueChange={(value) => updateField("agency", value)}
              >
                <SelectTrigger aria-invalid={!!errors.agency}>
                  <SelectValue placeholder="Select agency" />
                </SelectTrigger>
                <SelectContent>
                  {AGENCIES.map((agency) => (
                    <SelectItem key={agency} value={agency}>
                      {agency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.agency && (
                <p className="text-xs text-red-500">{errors.agency}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="apprehendingOfficer">
                Apprehending Officer <span className="text-red-500">*</span>
              </Label>
              <Input
                id="apprehendingOfficer"
                value={form.apprehendingOfficer}
                onChange={(e) => updateField("apprehendingOfficer", e.target.value)}
                placeholder="Officer name"
                aria-invalid={!!errors.apprehendingOfficer}
              />
              {errors.apprehendingOfficer && (
                <p className="text-xs text-red-500">{errors.apprehendingOfficer}</p>
              )}
            </div>
          </div>

          {/* Case Number and Violation */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="caseNumber">
                Case Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="caseNumber"
                value={form.caseNumber}
                onChange={(e) => updateField("caseNumber", e.target.value)}
                placeholder="CASE-2025-001"
                aria-invalid={!!errors.caseNumber}
              />
              {errors.caseNumber && (
                <p className="text-xs text-red-500">{errors.caseNumber}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="violation">
                Violation <span className="text-red-500">*</span>
              </Label>
              <Input
                id="violation"
                value={form.violation}
                onChange={(e) => updateField("violation", e.target.value)}
                placeholder="e.g., Illegal Parking"
                aria-invalid={!!errors.violation}
              />
              {errors.violation && (
                <p className="text-xs text-red-500">{errors.violation}</p>
              )}
            </div>
          </div>

          {/* Driver Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="driverLastName">
                Driver Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="driverLastName"
                value={form.driver.lastName}
                onChange={(e) =>
                  updateField("driver", { ...form.driver, lastName: e.target.value })
                }
                placeholder="Last name"
                aria-invalid={!!errors.driverLastName}
              />
              {errors.driverLastName && (
                <p className="text-xs text-red-500">{errors.driverLastName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverFirstName">
                Driver First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="driverFirstName"
                value={form.driver.firstName}
                onChange={(e) =>
                  updateField("driver", { ...form.driver, firstName: e.target.value })
                }
                placeholder="First name"
                aria-invalid={!!errors.driverFirstName}
              />
              {errors.driverFirstName && (
                <p className="text-xs text-red-500">{errors.driverFirstName}</p>
              )}
            </div>
          </div>

          {/* Gender, Nationality */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={form.gender}
                onValueChange={(value) => updateField("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g === "M" ? "Male" : "Female"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={form.nationality}
                onChange={(e) => updateField("nationality", e.target.value)}
                placeholder="Filipino"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restrictionCode">Restriction Code</Label>
              <Input
                id="restrictionCode"
                value={form.restrictionCode}
                onChange={(e) => updateField("restrictionCode", e.target.value)}
                placeholder="e.g., 1,2"
              />
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mvType">Motor Vehicle Type</Label>
              <Select
                value={form.mvType}
                onValueChange={(value) => updateField("mvType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {MV_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plateNumber">
                Plate Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="plateNumber"
                value={form.plateNumber}
                onChange={(e) => updateField("plateNumber", e.target.value)}
                placeholder="ABC 1234"
                aria-invalid={!!errors.plateNumber}
              />
              {errors.plateNumber && (
                <p className="text-xs text-red-500">{errors.plateNumber}</p>
              )}
            </div>
          </div>

          {/* Place of Apprehension */}
          <div className="space-y-2">
            <Label htmlFor="placeOfApprehension">
              Place of Apprehension <span className="text-red-500">*</span>
            </Label>
            <Input
              id="placeOfApprehension"
              value={form.placeOfApprehension}
              onChange={(e) => updateField("placeOfApprehension", e.target.value)}
              placeholder="e.g., EDSA Guadalupe"
              aria-invalid={!!errors.placeOfApprehension}
            />
            {errors.placeOfApprehension && (
              <p className="text-xs text-red-500">{errors.placeOfApprehension}</p>
            )}
          </div>

          {/* Confiscated Item */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="confiscatedType">Confiscated Item Type</Label>
              <Select
                value={form.confiscatedItem.type || ""}
                onValueChange={(value) =>
                  updateField("confiscatedItem", {
                    ...form.confiscatedItem,
                    type: value === "None" ? null : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {CONFISCATED_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confiscatedNumber">Confiscated Item Number</Label>
              <Input
                id="confiscatedNumber"
                value={form.confiscatedItem.number || ""}
                onChange={(e) =>
                  updateField("confiscatedItem", {
                    ...form.confiscatedItem,
                    number: e.target.value || null,
                  })
                }
                placeholder="N01-12-345678"
              />
            </div>
          </div>

          {/* Conditions and Remarks */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="conditions">Conditions</Label>
              <Input
                id="conditions"
                value={form.conditions}
                onChange={(e) => updateField("conditions", e.target.value)}
                placeholder="None"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={form.remarks}
                onChange={(e) => updateField("remarks", e.target.value)}
                placeholder="Additional notes"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
