import { cn } from "@/lib/utils";

type RiskLevel = "HIGH" | "HAZARD" | "ROUTINE";

interface ViolationLog {
  ticketNumber: string;
  behavior: string;
  location: string;
  risk: RiskLevel;
}

const riskStyles: Record<RiskLevel, string> = {
  HIGH: "bg-red-500 text-white",
  HAZARD: "bg-yellow-500 text-white",
  ROUTINE: "bg-blue-500 text-white",
};

const sampleLogs: ViolationLog[] = [
  {
    ticketNumber: "22022115",
    behavior: "Reckless Driving",
    location: "G. Araneta Ave",
    risk: "HIGH",
  },
  {
    ticketNumber: "22158636",
    behavior: "Overloading (RA 8794)",
    location: "R10 / Navotas",
    risk: "HIGH",
  },
  {
    ticketNumber: "21812847",
    behavior: "Obstructing Traffic",
    location: "EDSA / Cubao",
    risk: "HAZARD",
  },
  {
    ticketNumber: "22021617",
    behavior: "Disregarding Signs",
    location: "Roxas Blvd",
    risk: "HIGH",
  },
  {
    ticketNumber: "22159590",
    behavior: "Illegal Change Color",
    location: "Katipunan Ave",
    risk: "ROUTINE",
  },
  {
    ticketNumber: "21966249",
    behavior: "Unregistered MV",
    location: "C5 Road",
    risk: "ROUTINE",
  },
];

export function ViolationTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="font-semibold text-gray-900">Narrative Analysis Logs</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Top Ticket #</th>
              <th className="px-4 py-3 font-medium">Behavior</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sampleLogs.map((log) => (
              <tr key={log.ticketNumber} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-blue-600">
                  {log.ticketNumber}
                </td>
                <td className="px-4 py-3 text-gray-700">{log.behavior}</td>
                <td className="px-4 py-3 text-gray-700">{log.location}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-block rounded px-2 py-0.5 text-xs font-medium",
                      riskStyles[log.risk]
                    )}
                  >
                    {log.risk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
