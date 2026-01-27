import { Calendar } from "lucide-react";

interface StatsCardProps {
  value: string | number;
  label: string;
  subtitle: string;
  showCalendar?: boolean;
}

export function StatsCard({
  value,
  label,
  subtitle,
  showCalendar = false,
}: StatsCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-3xl font-bold text-[#1a3a5c]">{value}</p>
      <p className="mt-1 text-sm font-medium text-gray-600">{label}</p>
      <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
        {showCalendar && <Calendar className="h-3 w-3" />}
        {subtitle}
      </p>
    </div>
  );
}
