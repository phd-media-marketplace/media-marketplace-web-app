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
	AnalysisTimeSlot,
	AnalysisSegmentClass,
	DateRangeFilter,
	MediaStation,
} from "../types";

interface AnalysisFiltersProps {
	filters: MediaAnalysisFilters;
	availableStations: MediaStation[];
	onMediaTypeChange: (type: AnalysisMediaType) => void;
	onTimeSlotChange: (slot: AnalysisTimeSlot) => void;
	onSegmentClassChange: (cls: AnalysisSegmentClass) => void;
	onBudgetChange: (budget: number) => void;
	onDateRangeChange: (range: DateRangeFilter) => void;
	onStationToggle: (stationId: string) => void;
	onReset: () => void;
	showStationSelection?: boolean;
	minStations?: number;
	maxStations?: number;
}

export function AnalysisFilters({
	filters,
	availableStations,
	onMediaTypeChange,
	onTimeSlotChange,
	onSegmentClassChange,
	onBudgetChange,
	// onDateRangeChange, // Now handled by DateRangePicker internally
	onStationToggle,
	onReset,
	showStationSelection = false,
	minStations = 2,
	maxStations = 5,
}: AnalysisFiltersProps) {
	const selectedCount = filters.selectedStationIds.length;
	const canDeselectStation = selectedCount > (minStations - 1);

	// Compute default dates only once (memoized)
	const defaultDates = useMemo(() => {
		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
		return {
			start: startDate.toISOString().split("T")[0],
			end: endDate.toISOString().split("T")[0],
		};
	}, []);

	return (
		<Card className="p-6 space-y-6 bg-linear-to-br from-slate-50 to-white border-slate-200">
			{/* Filter Controls Row */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
				{/* Media Type */}
				<div className="space-y-2">
					<label className="text-sm font-semibold text-gray-700">Media Type</label>
					<Select value={filters.mediaType} onValueChange={(value) => onMediaTypeChange(value as AnalysisMediaType)}>
						<SelectTrigger className="bg-white">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="TV">TV</SelectItem>
							<SelectItem value="FM">FM</SelectItem>
							<SelectItem value="DIGITAL">Digital</SelectItem>
							<SelectItem value="OOH">OOH</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Time Slot */}
				<div className="space-y-2">
					<label className="text-sm font-semibold text-gray-700">Time Slot</label>
					<Select value={filters.timeSlot} onValueChange={(value) => onTimeSlotChange(value as AnalysisTimeSlot)}>
						<SelectTrigger className="bg-white">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="EARLY_MORNING">Early Morning</SelectItem>
							<SelectItem value="MORNING">Morning</SelectItem>
							<SelectItem value="DAYTIME">Daytime</SelectItem>
							<SelectItem value="PRIME_TIME">Prime Time</SelectItem>
							<SelectItem value="LATE_NIGHT">Late Night</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Segment Class */}
				<div className="space-y-2">
					<label className="text-sm font-semibold text-gray-700">Segment</label>
					<Select value={filters.segmentClass} onValueChange={(value) => onSegmentClassChange(value as AnalysisSegmentClass)}>
						<SelectTrigger className="bg-white">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="PREMIUM">Premium</SelectItem>
							<SelectItem value="M1">M1</SelectItem>
							<SelectItem value="M2">M2</SelectItem>
							<SelectItem value="M3">M3</SelectItem>
							<SelectItem value="M4">M4</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Date Range */}
			<div className="space-y-2 lg:col-span-2">
				<label className="text-sm font-semibold text-gray-700">Date Range</label>
				<DateRangePicker
					defaultStart={defaultDates.start}
					defaultEnd={defaultDates.end}
					onDateRangeChange={(range) => {
						console.log("Date range updated:", range);
						// This logs the custom date range but doesn't update the main filter yet
						// Future: Extend MediaAnalysisFilters type to support custom date ranges
					}}
				/>
			</div>

			{/* Budget */}
			<div className="space-y-2">
				<label className="text-sm font-semibold text-gray-700">Budget (₵)</label>
				<Input
					type="number"
					value={filters.budget}
					onChange={(e) => onBudgetChange(Number(e.target.value))}
					className="bg-white"
					min={10000}
					step={10000}
				/>
			</div>

			{/* Reset Button */}
			<div className="flex items-end">
				<Button
					variant="outline"
					size="sm"
					onClick={onReset}
					className="w-full"
				>
					<RotateCcw className="w-4 h-4 mr-2" />
					Reset
				</Button>
			</div>
			</div>

			{/* Station Selection Grid (for comparison tab) */}
			{showStationSelection && (
				<div className="space-y-3 pt-4 border-t border-slate-200">
					<div className="flex justify-between items-center">
						<label className="text-sm font-semibold text-gray-700">
							Select Stations ({selectedCount}/{maxStations})
						</label>
						{selectedCount >= minStations && (
							<span className="text-xs text-green-600 font-medium">✓ Ready to compare</span>
						)}
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
						{availableStations.map((station) => {
							const isSelected = filters.selectedStationIds.includes(station.id);
							const isDisabled = !isSelected && selectedCount >= maxStations;

							return (
								<Button
									key={station.id}
									variant={isSelected ? "default" : "outline"}
									size="sm"
									onClick={() => {
										if (isSelected && !canDeselectStation) return;
										onStationToggle(station.id);
									}}
									disabled={isDisabled}
									className={`text-xs font-medium transition-all ${
										isSelected
											? "bg-blue-600 hover:bg-blue-700 text-white"
											: "hover:border-blue-400"
									}`}
									title={
										isDisabled
											? `Maximum ${maxStations} stations allowed`
											: isSelected && !canDeselectStation
												? `Minimum ${minStations} stations required`
												: ""
									}
								>
									{isSelected && <span className="mr-1">✓</span>}
									{station.name}
								</Button>
							);
						})}
					</div>
				</div>
			)}
		</Card>
	);
}
