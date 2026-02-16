import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type {
  DistributionItem,
  HourPattern,
  DayOfWeekPattern,
  SummaryResponse,
} from "@/types/analytics";

interface ReportData {
  dateFrom: string;
  dateTo: string;
  summary: SummaryResponse["data"] | null;
  agencyDist: DistributionItem[];
  violationDist: DistributionItem[];
  vehicleDist: DistributionItem[];
  hourPatterns: HourPattern[];
  dayPatterns: DayOfWeekPattern[];
}

const PAGE_MARGIN = 20;
const HEADER_COLOR: [number, number, number] = [26, 58, 92]; // #1a3a5c

function addHeader(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Republic of the Philippines", centerX, 20, { align: "center" });
  doc.text("Department of Transportation", centerX, 26, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TRAFFIC VIOLATION MANAGEMENT SYSTEM", centerX, 35, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Operations Division", centerX, 41, { align: "center" });

  // Separator line
  doc.setDrawColor(...HEADER_COLOR);
  doc.setLineWidth(0.5);
  doc.line(PAGE_MARGIN, 45, pageWidth - PAGE_MARGIN, 45);

  return 50; // y position after header
}

function addSectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...HEADER_COLOR);
  doc.text(title, PAGE_MARGIN, y);
  doc.setTextColor(0, 0, 0);
  return y + 6;
}

function addPageFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on ${generatedDate}`, PAGE_MARGIN, pageHeight - 10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - PAGE_MARGIN,
      pageHeight - 10,
      { align: "right" }
    );
  }
}

function formatDateRange(from: string, to: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return `${new Date(from).toLocaleDateString("en-US", opts)} — ${new Date(to).toLocaleDateString("en-US", opts)}`;
}

export function generateReport(data: ReportData) {
  const doc = new jsPDF("portrait", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = addHeader(doc);

  // Report title & period
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Analytics Report", pageWidth / 2, y, { align: "center" });
  y += 7;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Report Period: ${formatDateRange(data.dateFrom, data.dateTo)}`,
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 10;

  // Summary section
  if (data.summary) {
    y = addSectionTitle(doc, "Summary", y);

    const summaryRows: string[][] = [
      [
        "Total Apprehensions (Current Period)",
        data.summary.current.total.toLocaleString(),
      ],
    ];

    if (data.summary.previous) {
      summaryRows.push([
        "Total Apprehensions (Previous Period)",
        data.summary.previous.total.toLocaleString(),
      ]);
    }

    if (data.summary.growth) {
      const sign = data.summary.growth.percentage >= 0 ? "+" : "";
      summaryRows.push([
        "Growth",
        `${sign}${data.summary.growth.percentage.toFixed(1)}% (${sign}${data.summary.growth.absolute.toLocaleString()})`,
      ]);
    }

    autoTable(doc, {
      startY: y,
      head: [["Metric", "Value"]],
      body: summaryRows,
      theme: "grid",
      headStyles: {
        fillColor: HEADER_COLOR,
        fontSize: 9,
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 9 },
      margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 10;
  }

  // Top Agencies
  if (data.agencyDist.length > 0) {
    y = addSectionTitle(doc, "Top Agencies", y);
    const total = data.agencyDist.reduce((sum, d) => sum + d.count, 0);

    autoTable(doc, {
      startY: y,
      head: [["Rank", "Agency", "Count", "% of Total"]],
      body: data.agencyDist.map((item, i) => [
        (i + 1).toString(),
        item.label,
        item.count.toLocaleString(),
        `${((item.count / total) * 100).toFixed(1)}%`,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: HEADER_COLOR,
        fontSize: 9,
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
      margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } })
      .lastAutoTable.finalY + 10;
  }

  // Top Violations
  if (data.violationDist.length > 0) {
    y = addSectionTitle(doc, "Top Violations", y);
    const total = data.violationDist.reduce((sum, d) => sum + d.count, 0);

    autoTable(doc, {
      startY: y,
      head: [["Rank", "Violation", "Count", "% of Total"]],
      body: data.violationDist.map((item, i) => [
        (i + 1).toString(),
        item.label,
        item.count.toLocaleString(),
        `${((item.count / total) * 100).toFixed(1)}%`,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: HEADER_COLOR,
        fontSize: 9,
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
      margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } })
      .lastAutoTable.finalY + 10;
  }

  // Vehicle Type Distribution
  if (data.vehicleDist.length > 0) {
    y = addSectionTitle(doc, "Vehicle Type Distribution", y);
    const total = data.vehicleDist.reduce((sum, d) => sum + d.count, 0);

    autoTable(doc, {
      startY: y,
      head: [["Vehicle Type", "Count", "% of Total"]],
      body: data.vehicleDist.map((item) => [
        item.label,
        item.count.toLocaleString(),
        `${((item.count / total) * 100).toFixed(1)}%`,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: HEADER_COLOR,
        fontSize: 9,
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "right" },
      },
      margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } })
      .lastAutoTable.finalY + 10;
  }

  // Apprehensions by Hour of Day
  if (data.hourPatterns.length > 0) {
    y = addSectionTitle(doc, "Apprehensions by Hour of Day", y);

    autoTable(doc, {
      startY: y,
      head: [["Time", "Count"]],
      body: data.hourPatterns.map((item) => [
        `${item.hour.toString().padStart(2, "0")}:00 – ${item.hour.toString().padStart(2, "0")}:59`,
        item.count.toLocaleString(),
      ]),
      theme: "grid",
      headStyles: {
        fillColor: HEADER_COLOR,
        fontSize: 9,
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        1: { halign: "right" },
      },
      margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } })
      .lastAutoTable.finalY + 10;
  }

  // Apprehensions by Day of Week
  if (data.dayPatterns.length > 0) {
    y = addSectionTitle(doc, "Apprehensions by Day of Week", y);

    autoTable(doc, {
      startY: y,
      head: [["Day", "Count"]],
      body: data.dayPatterns.map((item) => [
        item.label,
        item.count.toLocaleString(),
      ]),
      theme: "grid",
      headStyles: {
        fillColor: HEADER_COLOR,
        fontSize: 9,
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        1: { halign: "right" },
      },
      margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
    });
  }

  // Footer on all pages
  addPageFooter(doc);

  // Download
  const filename = `TVMS_Analytics_Report_${data.dateFrom}_to_${data.dateTo}.pdf`;
  doc.save(filename);
}
