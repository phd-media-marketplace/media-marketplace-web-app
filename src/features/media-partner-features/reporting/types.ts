
export type ReportQuarter = "ALL" | "Q1" | "Q2" | "Q3" | "Q4";

export interface ReportFiltersState {
  quarter: ReportQuarter;
  startDate: string;
  endDate: string;
  clients: string[];
}

export interface ReportFiltersProps {
  value: ReportFiltersState;
  clientOptions: string[];
  onQuarterChange: (quarter: ReportQuarter) => void;
  onStartDateChange: (startDate: string) => void;
  onEndDateChange: (endDate: string) => void;
  onClientsChange: (clients: string[]) => void;
  onReset: () => void;
}

export interface ReportingRecord {
	date: string;
	clientName: string;
	revenue: number;
	debt: number;
	workOrders: number;
}