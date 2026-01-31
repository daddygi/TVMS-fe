// Trends API
export interface TrendsFilters {
  granularity?: "day" | "week" | "month";
  dateFrom?: string;
  dateTo?: string;
  agency?: string;
  violation?: string;
  placeOfApprehension?: string;
}

export interface TrendsSeries {
  date: string;
  count: number;
}

export interface TrendsResponse {
  data: {
    granularity: "day" | "week" | "month";
    series: TrendsSeries[];
  };
}

// Distributions API
export interface DistributionsFilters {
  groupBy?: "agency" | "violation" | "location" | "mvType" | "gender";
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  agency?: string;
  violation?: string;
  placeOfApprehension?: string;
}

export interface DistributionItem {
  label: string;
  count: number;
}

export interface DistributionsResponse {
  data: {
    groupBy: string;
    items: DistributionItem[];
    total: number;
  };
}

// Time Patterns API
export interface TimePatternsFilters {
  dateFrom?: string;
  dateTo?: string;
  agency?: string;
  violation?: string;
  placeOfApprehension?: string;
}

export interface HourPattern {
  hour: number;
  count: number;
}

export interface DayOfWeekPattern {
  day: number;
  label: string;
  count: number;
}

export interface TimePatternsResponse {
  data: {
    byHour: HourPattern[];
    byDayOfWeek: DayOfWeekPattern[];
  };
}

// Summary API
export interface SummaryFilters {
  dateFrom?: string;
  dateTo?: string;
  comparePrevious?: boolean;
}

export interface SummaryPeriod {
  total: number;
  period: {
    from: string;
    to: string;
  };
}

export interface SummaryResponse {
  data: {
    current: SummaryPeriod;
    previous?: SummaryPeriod;
    growth?: {
      absolute: number;
      percentage: number;
    };
  };
}
