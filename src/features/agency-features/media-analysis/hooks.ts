import { useState, useCallback, useMemo } from "react";
import type {
	MediaAnalysisFilters,
	AnalysisMediaType,
	AnalysisTimeSlot,
	AnalysisSegmentClass,
	DateRangeFilter,
	MediaAnalysisResult,
	StationAnalysisDetail,
	ProgramAnalysisResult,
	MediaStation,
} from "./types";
import { compareStations, getStationAnalysisDetail, getProgramAnalysis, getTopStationAnalytics, getMediaStations } from "./api";

const DEFAULT_FILTERS: MediaAnalysisFilters = {
	mediaType: "TV",
	timeSlot: "PRIME_TIME",
	segmentClass: "M2",
	budget: 100000,
	selectedStationIds: [],
	dateRange: "30_days",
};

export function useMediaAnalysisFilters() {
	const [filters, setFilters] = useState<MediaAnalysisFilters>(DEFAULT_FILTERS);

	const updateMediaType = useCallback((mediaType: AnalysisMediaType) => {
		setFilters((prev) => ({ ...prev, mediaType, selectedStationIds: [] }));
	}, []);

	const updateTimeSlot = useCallback((timeSlot: AnalysisTimeSlot) => {
		setFilters((prev) => ({ ...prev, timeSlot }));
	}, []);

	const updateSegmentClass = useCallback((segmentClass: AnalysisSegmentClass) => {
		setFilters((prev) => ({ ...prev, segmentClass }));
	}, []);

	const updateBudget = useCallback((budget: number) => {
		setFilters((prev) => ({ ...prev, budget }));
	}, []);

	const updateDateRange = useCallback((dateRange: DateRangeFilter) => {
		setFilters((prev) => ({ ...prev, dateRange }));
	}, []);

	const toggleStationSelection = useCallback((stationId: string) => {
		setFilters((prev) => ({
			...prev,
			selectedStationIds: prev.selectedStationIds.includes(stationId)
				? prev.selectedStationIds.filter((id) => id !== stationId)
				: [...prev.selectedStationIds, stationId],
		}));
	}, []);

	const setSelectedStations = useCallback((stationIds: string[]) => {
		setFilters((prev) => ({ ...prev, selectedStationIds: stationIds }));
	}, []);

	const resetFilters = useCallback(() => {
		setFilters(DEFAULT_FILTERS);
	}, []);

	return {
		filters,
		updateMediaType,
		updateTimeSlot,
		updateSegmentClass,
		updateBudget,
		updateDateRange,
		toggleStationSelection,
		setSelectedStations,
		resetFilters,
		setFilters,
	};
}

export function useStationAnalysis(filters: MediaAnalysisFilters) {
	return useMemo(() => {
		const stations = getTopStationAnalytics(filters);
		return stations;
	}, [filters]);
}

export function useComparisonData(filters: MediaAnalysisFilters): MediaAnalysisResult | null {
	return useMemo(() => {
		if (filters.selectedStationIds.length === 0) return null;
		return compareStations(filters);
	}, [filters]);
}

export function useDetailedStationAnalysis(stationId: string, filters: MediaAnalysisFilters) {
	return useMemo(() => {
		if (!stationId) return null;
		return getStationAnalysisDetail(stationId, filters);
	}, [stationId, filters]);
}

export function useProgramAnalysis(stationId: string): ProgramAnalysisResult | null {
	return useMemo(() => {
		if (!stationId) return null;
		return getProgramAnalysis(stationId);
	}, [stationId]);
}

export function useAvailableStations(mediaType: AnalysisMediaType) {
	return useMemo(() => {
		return getMediaStations(mediaType);
	}, [mediaType]);
}
