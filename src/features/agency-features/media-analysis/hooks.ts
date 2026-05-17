import { useState, useCallback, useMemo } from "react";
import type {
	MediaAnalysisFilters,
	AnalysisMediaType,
	MediaAnalysisResult,
	ProgramAnalysisResult,
	StationAnalysisDetail,
} from "./types";
import { compareStations, getStationAnalysisDetail, getProgramAnalysis, getTopStationAnalytics, getMediaStations } from "./api";

type DateRangeValue = {
	startDate: string;
	endDate: string;
};

const DEFAULT_FILTERS: MediaAnalysisFilters = {
	mediaType: "TV",
	// timeSlot: "PRIME_TIME",
	// segmentClass: "M2",
	// budget: 100000,
	selectedStationIds: [],
	dateRange: "30_days",
	startTime: "00:00",
	endTime: "23:59",
};

export function useMediaAnalysisFilters() {
	const [filters, setFilters] = useState<MediaAnalysisFilters>(DEFAULT_FILTERS);

	const updateMediaType = useCallback((mediaType: AnalysisMediaType) => {
		setFilters((prev) => ({ ...prev, mediaType, selectedStationIds: [] }));
	}, []);

	const updateDateRange = useCallback((dateRange: DateRangeValue) => {
		setFilters((prev) => ({
			...prev,
			dateRange: "custom",
			startDate: dateRange.startDate,
			endDate: dateRange.endDate,
		}));
	}, []);

	const updateTimeInterval = useCallback((timeInterval: { startTime: string; endTime: string }) => {
		setFilters((prev) => ({
			...prev,
			startTime: timeInterval.startTime,
			endTime: timeInterval.endTime,
		}));
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
		updateDateRange,
		updateTimeInterval,
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

export function useComparisonStationSelections(
	selectedStations: string[],
	setSelectedStations: (stationIds: string[]) => void,
	maxStations = 5
) {
	const stationSelections = useMemo<string[]>(() => {
		const selectedSubset = selectedStations.slice(0, maxStations);
		const emptySlots = Array.from(
			{ length: Math.max(0, maxStations - selectedSubset.length) },
			() => ""
		);
		return [...selectedSubset, ...emptySlots];
	}, [selectedStations, maxStations]);

	const handleStationSelection = useCallback(
		(stationId: string, index: number) => {
			const nextSelections = [...stationSelections];
			nextSelections[index] = stationId;
			setSelectedStations(nextSelections.filter((id): id is string => Boolean(id)));
		},
		[stationSelections, setSelectedStations]
	);

	return {
		stationSelections,
		selectedCount: selectedStations.length,
		handleStationSelection,
	};
}

export function useSelectedStation(stations: StationAnalysisDetail[]) {
	const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

	const selectedStation = useMemo(
		() => stations.find((station) => station.stationId === selectedStationId) ?? null,
		[stations, selectedStationId]
	);

	const closeSelectedStation = useCallback(() => {
		setSelectedStationId(null);
	}, []);

	return {
		selectedStationId,
		setSelectedStationId,
		selectedStation,
		closeSelectedStation,
	};
}

export function useStationRecommendations(station: StationAnalysisDetail | null) {
	return useMemo(() => {
		if (!station) return [] as string[];

		const recs: string[] = [];

		if (station.roi >= 2.2) {
			recs.push("Increase allocation gradually for this station in the next planning cycle because ROI is already strong.");
		} else {
			recs.push("Test new dayparts and program mixes to improve ROI before scaling budget aggressively.");
		}

		if (station.averageFrequency < 2.2) {
			recs.push("Raise frequency with more repeat placements in top-performing programs to improve message recall.");
		} else {
			recs.push("Maintain current frequency levels and prioritize incremental reach rather than repetition.");
		}

		const topProgram = station.peakPrograms[0];
		if (topProgram) {
			recs.push(`Prioritize ${topProgram.name} (${topProgram.timeSlot.replace(/_/g, " ")}) as an anchor slot for this station.`);
		}

		return recs.slice(0, 3);
	}, [station]);
}
