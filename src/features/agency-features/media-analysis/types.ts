export type AnalysisMediaType = "TV" | "FM" | "DIGITAL" | "OOH";

export type AnalysisTimeSlot =
	| "EARLY_MORNING"
	| "MORNING"
	| "DAYTIME"
	| "PRIME_TIME"
	| "LATE_NIGHT";

export type AnalysisSegmentClass = "PREMIUM" | "M1" | "M2" | "M3" | "M4";

export type DateRangeFilter = "7_days" | "30_days" | "60_days" | "90_days" | "custom";

export interface MediaStation {
	id: string;
	name: string;
	mediaType: AnalysisMediaType;
	baselineReach: number;
	baselineImpressions: number;
	baselineFrequency: number;
	baselineRoi: number;
}

export interface MediaAnalysisFilters {
	mediaType: AnalysisMediaType;
	timeSlot: AnalysisTimeSlot;
	segmentClass: AnalysisSegmentClass;
	budget: number;
	selectedStationIds: string[];
	dateRange: DateRangeFilter;
	startDate?: string;
	endDate?: string;
}

export interface StationMetric {
	stationId: string;
	stationName: string;
	mediaType: AnalysisMediaType;
	reach: number;
	impressions: number;
	averageFrequency: number;
	roi: number;
	budgetUsed: number;
}

export interface TrendPoint {
	period: string;
	reach: number;
	impressions: number;
	roi: number;
}

export interface DailyTrendPoint {
	date: string;
	reach: number;
	impressions: number;
	frequency: number;
	grp: number;
}

export interface StationTrendSeries {
	stationId: string;
	stationName: string;
	points: TrendPoint[];
}

export interface DailyTrendSeries {
	stationId: string;
	stationName: string;
	dailyPoints: DailyTrendPoint[];
}

export interface PeakProgram {
	id: string;
	name: string;
	timeSlot: AnalysisTimeSlot;
	reach: number;
	impressions: number;
	frequency: number;
	grp: number;
	scheduledDays: number;
}

export interface BudgetSlice {
	name: string;
	value: number;
}

export interface StationAnalysisDetail {
	stationId: string;
	stationName: string;
	mediaType: AnalysisMediaType;
	weeklyReach: number;
	averageGrp: number;
	averageFrequency: number;
	totalImpressions: number;
	roi: number;
	dailyTrend: DailyTrendPoint[];
	peakPrograms: PeakProgram[];
}

export interface MediaAnalysisResult {
	stationMetrics: StationMetric[];
	stationTrends: StationTrendSeries[];
	budgetDistribution: BudgetSlice[];
}

export interface Program {
	id: string;
	name: string;
	timeSlot: AnalysisTimeSlot;
	averageReach: number;
	averageImpressions: number;
	averageFrequency: number;
	grp: number;
	timeslotDistribution: Record<string, number>;
}

export interface ProgramAnalysisResult {
	stationId: string;
	stationName: string;
	programs: Program[];
	topPrograms: Program[];
}
