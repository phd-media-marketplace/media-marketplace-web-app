import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";
import { useMemo } from "react";
import { DateRangePicker } from "@/components/universal/DateRangePicker";
import type {
	MediaAnalysisFilters,
	AnalysisMediaType,
	MediaStation,
} from "../types";

type DateRangeValue = {
	startDate: string;
	endDate: string;
};

interface AnalysisFiltersProps {
	filters: MediaAnalysisFilters;
	availableStations: MediaStation[];
	onMediaTypeChange: (type: AnalysisMediaType) => void;
	onTimeIntervalChange?: (interval: { startTime: string; endTime: string }) => void;
	onDateRangeChange: (range: DateRangeValue) => void;
	onStationToggle: (stationId: string) => void;
	onReset: () => void;
	
}

export function AnalysisFilters({
	filters,
	// availableStations,
	onMediaTypeChange,
	onTimeIntervalChange,
	onDateRangeChange,
	// onStationToggle,
	onReset,
}: AnalysisFiltersProps) {
	// const canDeselectStation = selectedCount > (minStations - 1);

	// Compute default dates only once (memoized)
	const defaultDates = useMemo(() => {
		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
		return {
			start: startDate.toISOString().split("T")[0],
			end: endDate.toISOString().split("T")[0],
		};
	}, []);

	const startTime = filters.startTime ?? "00:00";
	const endTime = filters.endTime ?? "23:59";

	return (
		<Card className="px-4 py-5 space-y-6 bg-linear-to-br from-slate-50 to-white border-slate-200">
			{/* Filter Controls Row */}
			<div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-[1fr_1fr_1fr_auto] xl:grid-cols-[1fr_1fr_1fr_auto] gap-4">
				{/* Media Type */}
				<div className="space-y-2">
					<label className="text-sm font-semibold text-gray-700">Media Type</label>
					<Select value={filters.mediaType} onValueChange={(value) => onMediaTypeChange(value as AnalysisMediaType)}>
						<SelectTrigger className="input-field w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="select-trigger-bg w-full">
							<SelectItem value="TV">TV</SelectItem>
							<SelectItem value="FM">Radio</SelectItem>
							<SelectItem value="DIGITAL">Digital</SelectItem>
							<SelectItem value="OOH">OOH</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Time Interval (start - end) */}
				<div className="space-y-2">
					<label className="text-sm font-semibold text-gray-700">Time Interval</label>
					<div className="flex items-center space-x-2">
						<Input
							type="time"
							value={startTime}
							onChange={(e) => {
								const v = e.target.value;
								onTimeIntervalChange?.({ startTime: v, endTime });
							}}
							className="input-field w-full"
						/>
						<span className="text-sm text-gray-500">to</span>
						<Input
							type="time"
							value={endTime}
							onChange={(e) => {
								const v = e.target.value;
								onTimeIntervalChange?.({ startTime, endTime: v });
							}}
							className="input-field w-full"
						/>
					</div>
				</div>

				{/* Date Range */}
			<div className="space-y-2">
				<label className="text-sm font-semibold text-gray-700">Date Range</label>
				<DateRangePicker
					defaultStart={defaultDates.start}
					defaultEnd={defaultDates.end}
						onDateRangeChange={(range) => {
							onDateRangeChange(range);
						}}
				/>
			</div>

				{/* Budget removed per new requirements */}

			{/* Reset Button */}
			<div className="flex items-end">
				<Button
					variant="outline"
					size="sm"
					onClick={onReset}
					className="w-full bg-white border-red-300 text-red-600 hover:bg-red-50"
				>
					<RotateCcw className="w-4 h-4 mr-2" />
					Reset
				</Button>
			</div>
			</div>
		</Card>
	);
}
