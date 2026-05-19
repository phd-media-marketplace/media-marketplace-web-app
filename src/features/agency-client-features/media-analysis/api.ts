import type {
	AnalysisMediaType,
	AnalysisSegmentClass,
	AnalysisTimeSlot,
	MediaAnalysisFilters,
	MediaAnalysisResult,
	MediaStation,
	StationMetric,
	StationAnalysisDetail,
	PeakProgram,
	ProgramAnalysisResult,
	Program,
} from "./types";

const STATIONS: MediaStation[] = [
	{
		id: "tv-joy-prime",
		name: "Joy Prime TV",
		mediaType: "TV",
		baselineReach: 165000,
		baselineImpressions: 455000,
		baselineFrequency: 2.76,
		baselineRoi: 2.35,
	},
	{
		id: "tv-citi",
		name: "Citi TV",
		mediaType: "TV",
		baselineReach: 148000,
		baselineImpressions: 392000,
		baselineFrequency: 2.65,
		baselineRoi: 2.18,
	},
	{
		id: "tv-ghanatv",
		name: "GTV",
		mediaType: "TV",
		baselineReach: 182000,
		baselineImpressions: 502000,
		baselineFrequency: 2.76,
		baselineRoi: 2.22,
	},
	{
		id: "tv-utv",
		name: "UTV",
		mediaType: "TV",
		baselineReach: 139000,
		baselineImpressions: 338000,
		baselineFrequency: 2.43,
		baselineRoi: 2.05,
	},
	{
		id: "tv-adom",
		name: "Adom TV",
		mediaType: "TV",
		baselineReach: 126000,
		baselineImpressions: 331000,
		baselineFrequency: 2.63,
		baselineRoi: 1.97,
	},
	{
		id: "fm-joy",
		name: "Joy FM",
		mediaType: "FM",
		baselineReach: 98000,
		baselineImpressions: 214000,
		baselineFrequency: 2.18,
		baselineRoi: 1.73,
	},
	{
		id: "digital-pulse",
		name: "Pulse Digital Network",
		mediaType: "DIGITAL",
		baselineReach: 121000,
		baselineImpressions: 486000,
		baselineFrequency: 4.01,
		baselineRoi: 2.4,
	},
	{
		id: "ooh-accra",
		name: "Accra OOH Grid",
		mediaType: "OOH",
		baselineReach: 88000,
		baselineImpressions: 242000,
		baselineFrequency: 2.75,
		baselineRoi: 1.69,
	},
];

const PEAK_PROGRAMS: Record<string, PeakProgram[]> = {
	"tv-joy-prime": [
		{
			id: "p-1",
			name: "Joy News",
			timeSlot: "PRIME_TIME",
			reach: 145000,
			impressions: 392000,
			frequency: 2.7,
			grp: 87.4,
			scheduledDays: 5,
		},
		{
			id: "p-2",
			name: "The Seat",
			timeSlot: "PRIME_TIME",
			reach: 128000,
			impressions: 341000,
			frequency: 2.66,
			grp: 77.3,
			scheduledDays: 5,
		},
		{
			id: "p-3",
			name: "Entertainment Tonight",
			timeSlot: "PRIME_TIME",
			reach: 112000,
			impressions: 298000,
			frequency: 2.66,
			grp: 67.6,
			scheduledDays: 7,
		},
	],
	"tv-citi": [
		{
			id: "p-4",
			name: "Breakfast Show",
			timeSlot: "MORNING",
			reach: 98000,
			impressions: 241000,
			frequency: 2.46,
			grp: 59.1,
			scheduledDays: 5,
		},
		{
			id: "p-5",
			name: "Midday News",
			timeSlot: "DAYTIME",
			reach: 102000,
			impressions: 267000,
			frequency: 2.62,
			grp: 61.5,
			scheduledDays: 5,
		},
		{
			id: "p-6",
			name: "Evening Drive",
			timeSlot: "PRIME_TIME",
			reach: 115000,
			impressions: 301000,
			frequency: 2.62,
			grp: 69.4,
			scheduledDays: 5,
		},
	],
	"tv-ghanatv": [
		{
			id: "p-7",
			name: "GTV News",
			timeSlot: "PRIME_TIME",
			reach: 162000,
			impressions: 451000,
			frequency: 2.78,
			grp: 97.8,
			scheduledDays: 7,
		},
		{
			id: "p-8",
			name: "Sports Tonight",
			timeSlot: "PRIME_TIME",
			reach: 138000,
			impressions: 382000,
			frequency: 2.77,
			grp: 83.2,
			scheduledDays: 5,
		},
		{
			id: "p-9",
			name: "Lifestyle Magazine",
			timeSlot: "DAYTIME",
			reach: 95000,
			impressions: 245000,
			frequency: 2.58,
			grp: 57.3,
			scheduledDays: 7,
		},
	],
	"tv-utv": [
		{
			id: "p-10",
			name: "UTV News",
			timeSlot: "PRIME_TIME",
			reach: 102000,
			impressions: 268000,
			frequency: 2.63,
			grp: 61.5,
			scheduledDays: 6,
		},
		{
			id: "p-11",
			name: "Comedy Night",
			timeSlot: "LATE_NIGHT",
			reach: 85000,
			impressions: 201000,
			frequency: 2.36,
			grp: 51.3,
			scheduledDays: 3,
		},
	],
	"tv-adom": [
		{
			id: "p-12",
			name: "Adom News",
			timeSlot: "PRIME_TIME",
			reach: 95000,
			impressions: 241000,
			frequency: 2.54,
			grp: 57.4,
			scheduledDays: 7,
		},
		{
			id: "p-13",
			name: "Adom Okyer",
			timeSlot: "MORNING",
			reach: 78000,
			impressions: 198000,
			frequency: 2.54,
			grp: 47.1,
			scheduledDays: 7,
		},
	],
};

const TIME_SLOT_FACTOR: Record<AnalysisTimeSlot, number> = {
	EARLY_MORNING: 0.76,
	MORNING: 0.92,
	DAYTIME: 0.86,
	PRIME_TIME: 1.24,
	LATE_NIGHT: 0.64,
};

const SEGMENT_CLASS_FACTOR: Record<AnalysisSegmentClass, number> = {
	PREMIUM: 1.28,
	M1: 1.12,
	M2: 1,
	M3: 0.88,
	M4: 0.78,
};

const MEDIA_TYPE_FACTOR: Record<AnalysisMediaType, number> = {
	TV: 1,
	FM: 0.82,
	DIGITAL: 1.12,
	OOH: 0.74,
};

const TREND_PERIODS = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(value, max));
}

function parseTimeToMinutes(t: string) {
	// expect HH:MM
	const [hStr, mStr] = t.split(":");
	const h = Number(hStr || 0);
	const m = Number(mStr || 0);
	return h * 60 + m;
}

function computeTimeIntervalFactor(filters: MediaAnalysisFilters) {
	// If explicit interval provided, compute factor based on midpoint hour
	if (filters.startTime && filters.endTime) {
		const start = parseTimeToMinutes(filters.startTime);
		const end = parseTimeToMinutes(filters.endTime);
		// handle wrap-around (e.g., 23:00 - 03:00)
		const duration = ((end - start + 24 * 60) % (24 * 60)) || (24 * 60);
		const mid = (start + duration / 2) % (24 * 60);
		const midHour = mid / 60;

		if (midHour >= 17 && midHour < 22) return 1.24; // prime
		if (midHour >= 5 && midHour < 9) return 0.92; // morning
		if (midHour >= 9 && midHour < 17) return 0.86; // daytime
		if (midHour >= 22 || midHour < 1) return 0.64; // late-night
		return 0.76; // early morning fallback
	}
	return 1; // default neutral factor
}

function computeDaysFromFilters(filters: MediaAnalysisFilters, defaultDays = 30) {
	if (filters.startDate && filters.endDate) {
		const s = new Date(filters.startDate);
		const e = new Date(filters.endDate);
		const diff = Math.max(1, Math.round((e.getTime() - s.getTime()) / (24 * 60 * 60 * 1000)) + 1);
		return diff;
	}
	switch (filters.dateRange) {
		case "7_days":
			return 7;
		case "30_days":
			return 30;
		case "60_days":
			return 60;
		case "90_days":
			return 90;
		default:
			return defaultDays;
	}
}

function getBudgetFactor(totalBudget: number, selectedCount: number): number {
	const perStationBudget = totalBudget / Math.max(selectedCount, 1);
	const normalized = Math.log10(perStationBudget + 1) / 6;
	return clamp(0.68 + normalized, 0.68, 1.32);
}

function computeStationMetric(station: MediaStation, filters: MediaAnalysisFilters): StationMetric {
	// prefer explicit time interval if available, otherwise fall back to time slot factor
	// fallbacks for removed UI fields: use defaults when fields are not present
	const filterExtras = filters as unknown as { timeSlot?: AnalysisTimeSlot; segmentClass?: AnalysisSegmentClass; budget?: number };
	const timeSlotFallback = filterExtras.timeSlot as AnalysisTimeSlot | undefined;
	const segFallback = filterExtras.segmentClass as AnalysisSegmentClass | undefined;
	const budgetVal = filterExtras.budget ?? 100000;

	const timeFactor = filters.startTime && filters.endTime ? computeTimeIntervalFactor(filters) : (TIME_SLOT_FACTOR[timeSlotFallback ?? 'PRIME_TIME'] ?? 1);
	// keep segment factor but reduce weight slightly since segment UI was removed
	const segmentFactor = (SEGMENT_CLASS_FACTOR[segFallback ?? 'M2'] ?? 1) * 0.95;
	const mediaFactor = MEDIA_TYPE_FACTOR[station.mediaType];
	const budgetFactor = getBudgetFactor(budgetVal, filters.selectedStationIds.length);

	const reach = Math.round(station.baselineReach * timeFactor * segmentFactor * mediaFactor * budgetFactor);
	const impressions = Math.round(
		station.baselineImpressions * timeFactor * segmentFactor * (0.9 + budgetFactor / 4)
	);
	const averageFrequency = Number((impressions / Math.max(reach, 1)).toFixed(2));

	// Adjust ROI with time and date context: shorter campaigns or prime time increase ROI slightly
	const days = computeDaysFromFilters(filters, 30);
	const daysFactor = clamp(1 + (30 - days) / 200, 0.88, 1.12); // small adjustment based on campaign length
	const roi = Number(
		(
			station.baselineRoi *
			clamp(timeFactor * 0.85 + segmentFactor * 0.1 + budgetFactor * 0.1, 0.7, 1.6) *
			daysFactor
		).toFixed(2)
	);

	const grp = Number(((reach / 4000000) * 100).toFixed(2));

	return {
		stationId: station.id,
		stationName: station.name,
		mediaType: station.mediaType,
		reach,
		impressions,
		averageFrequency,
		roi,
		budgetUsed: 0,
		grp,
	};
}

export function getMediaStations(mediaType: AnalysisMediaType): MediaStation[] {
	return STATIONS.filter((station) => station.mediaType === mediaType);
}

export function compareStations(filters: MediaAnalysisFilters): MediaAnalysisResult {
	const filteredStations = STATIONS.filter(
		(station) =>
			station.mediaType === filters.mediaType && filters.selectedStationIds.includes(station.id)
	);

	const stationMetrics = filteredStations.map((station) => computeStationMetric(station, filters));

	const filterExtras = filters as unknown as { GRP?: number };
	const GRPVal = filterExtras.GRP ?? 100;

	const totalScore = stationMetrics.reduce((sum, metric) => sum + metric.reach * metric.roi, 0) || 1;
	const GRPDistribution = stationMetrics.map((metric) => {
		const recommendedBudget = (GRPVal * metric.reach * metric.roi) / totalScore;
		return {
			name: metric.stationName,
			value: Math.round(recommendedBudget),
		};
	});

	const GRPMap = new Map(GRPDistribution.map((slice) => [slice.name, slice.value]));
	stationMetrics.forEach((metric) => {
		metric.grp = GRPMap.get(metric.stationName) ?? 0;
	});

	const stationTrends = stationMetrics.map((metric) => {
		const points = TREND_PERIODS.map((period, index) => {
			const stepFactor = 0.62 + (index + 1) * 0.08;
			const stabilityFactor = 0.96 + ((index + metric.stationName.length) % 3) * 0.02;

			return {
				period,
				reach: Math.round(metric.reach * stepFactor * stabilityFactor),
				impressions: Math.round(metric.impressions * stepFactor * stabilityFactor),
				roi: Number((metric.roi * (0.9 + (index + 1) * 0.03)).toFixed(2)),
			};
		});

		return {
			stationId: metric.stationId,
			stationName: metric.stationName,
			points,
		};
	});

	return {
		stationMetrics,
		stationTrends,
		GRPDistribution,
	};
}

function generateDailyTrends(station: MediaStation, filters: MediaAnalysisFilters, days?: number) {
	const d = typeof days === 'number' ? days : computeDaysFromFilters(filters, 30);
	const dailyPoints = [];
	const filterExtras = filters as unknown as { timeSlot?: AnalysisTimeSlot; segmentClass?: AnalysisSegmentClass; budget?: number };
	const timeSlotFallback = filterExtras.timeSlot as AnalysisTimeSlot | undefined;
	const segFallback = filterExtras.segmentClass as AnalysisSegmentClass | undefined;
	const budgetVal = filterExtras.budget ?? 100000;
	const timeFactor = filters.startTime && filters.endTime ? computeTimeIntervalFactor(filters) : (TIME_SLOT_FACTOR[timeSlotFallback ?? 'PRIME_TIME'] ?? 1);
	const segmentFactor = (SEGMENT_CLASS_FACTOR[segFallback ?? 'M2'] ?? 1) * 0.95;
	const mediaFactor = MEDIA_TYPE_FACTOR[station.mediaType];
	const budgetFactor = getBudgetFactor(budgetVal, 1);

	for (let i = 0; i < d; i++) {
		const date = new Date();
		date.setDate(date.getDate() - (d - i - 1));

		// Add some daily variance (±10-15%)
		const variance = 0.85 + Math.random() * 0.3;
		const dayOfWeek = date.getDay();
		const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 1.15 : 0.95;

		const reach = Math.round(
			station.baselineReach * timeFactor * segmentFactor * mediaFactor * budgetFactor * variance * weekendFactor
		);
		const impressions = Math.round(
			station.baselineImpressions * timeFactor * segmentFactor * (0.9 + budgetFactor / 4) * variance * weekendFactor
		);
		const frequency = Number((impressions / Math.max(reach, 1)).toFixed(2));
		const grp = Number(
			(
				(reach / 4000000) * 100 * timeFactor * segmentFactor * variance * weekendFactor
			).toFixed(2)
		);

		dailyPoints.push({
			date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
			reach,
			impressions,
			frequency,
			grp,
		});
	}
	return dailyPoints;
}

export function getStationAnalysisDetail(stationId: string, filters: MediaAnalysisFilters): StationAnalysisDetail | null {
	const station = STATIONS.find((s) => s.id === stationId);
	if (!station) return null;

	const metric = computeStationMetric(station, filters);
	const dailyTrend = generateDailyTrends(station, filters, 30);
	const peakPrograms = (PEAK_PROGRAMS[stationId] || []).slice(0, 5);

	return {
		stationId: station.id,
		stationName: station.name,
		mediaType: station.mediaType,
		weeklyReach: metric.reach,
		averageGrp: Number(((metric.reach / 4000000) * 100).toFixed(2)),
		averageFrequency: metric.averageFrequency,
		totalImpressions: metric.impressions,
		roi: metric.roi,
		dailyTrend,
		peakPrograms,
	};
}

export function getProgramAnalysis(stationId: string): ProgramAnalysisResult | null {
	const station = STATIONS.find((s) => s.id === stationId);
	if (!station) return null;

	const programs = (PEAK_PROGRAMS[stationId] || []).map((program) => ({
		id: program.id,
		name: program.name,
		timeSlot: program.timeSlot,
		averageReach: program.reach,
		averageImpressions: program.impressions,
		averageFrequency: program.frequency,
		grp: program.grp,
		timeslotDistribution: {
			[program.timeSlot]: 100,
		},
	})) as Program[];

	const topPrograms = programs.sort((a, b) => b.averageReach - a.averageReach).slice(0, 3);

	return {
		stationId: station.id,
		stationName: station.name,
		programs,
		topPrograms,
	};
}

export function getTopStationAnalytics(filters: MediaAnalysisFilters): StationAnalysisDetail[] {
	const stations = STATIONS.filter(
		(station) => station.mediaType === filters.mediaType
	);

	return stations
		.map((station) => getStationAnalysisDetail(station.id, filters))
		.filter((detail): detail is StationAnalysisDetail => detail !== null);
}
