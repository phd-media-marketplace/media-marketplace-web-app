import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, BarChart3, Drama } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
	AnalysisFilters,
	StationAnalysisTab,
	ComparisonTab,
	ProgramAnalysisTab,
} from "../components";
import {
	useMediaAnalysisFilters,
	useStationAnalysis,
	useComparisonData,
	useProgramAnalysis,
	useAvailableStations,
} from "../hooks";

type TabType = "stations" | "comparison" | "programs";

/**
 * MediaAnalysisPage
 * Comprehensive media analysis with three tabs:
 * 1. Station Analysis - Individual station performance cards
 * 2. Comparison - Side-by-side comparison of selected stations
 * 3. Program Analysis - Individual program performance within selected station
 */
export default function MediaAnalysisPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<TabType>("stations");
	const selectedStationForPrograms = "";

	// Hooks
	const {
		filters,
		updateMediaType,
		updateTimeSlot,
		updateSegmentClass,
		updateBudget,
		updateDateRange,
		toggleStationSelection,
		resetFilters,
	} = useMediaAnalysisFilters();

	const stationAnalysisData = useStationAnalysis(filters);
	const comparisonData = useComparisonData(filters);
	const availableStations = useAvailableStations(filters.mediaType);
	const programAnalysisData = useProgramAnalysis(selectedStationForPrograms);

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
			{/* Header */}
			<div className="bg-white border-b border-slate-200 sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => navigate("/agency/dashboard")}
								className="hover:bg-slate-100"
							>
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back
							</Button>
							<div>
								<h1 className="text-3xl font-bold text-gray-900">Media Analysis</h1>
								<p className="text-sm text-gray-600 mt-1">
									Compare stations, analyze programs, and optimize your media spend
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				{/* Filters */}
				<AnalysisFilters
					filters={filters}
					availableStations={availableStations}
					onMediaTypeChange={updateMediaType}
					onTimeSlotChange={updateTimeSlot}
					onSegmentClassChange={updateSegmentClass}
					onBudgetChange={updateBudget}
					onDateRangeChange={updateDateRange}
					onStationToggle={toggleStationSelection}
					onReset={resetFilters}
					showStationSelection={activeTab === "comparison"}
					minStations={2}
					maxStations={5}
				/>

				{/* Tabs */}
				<div className="mt-8">
					<div className="flex gap-2 mb-6 border-b border-slate-200">
						<Button
							variant={activeTab === "stations" ? "default" : "ghost"}
							onClick={() => setActiveTab("stations")}
							className={`gap-2 border-b-2 rounded-none px-4 py-3 font-medium text-sm transition-all ${
								activeTab === "stations"
									? "border-blue-600 text-blue-600 bg-blue-50"
									: "border-transparent text-gray-600 hover:text-gray-900"
							}`}
						>
							<TrendingUp className="w-4 h-4" />
							Station Analysis
						</Button>
						<Button
							variant={activeTab === "comparison" ? "default" : "ghost"}
							onClick={() => setActiveTab("comparison")}
							className={`gap-2 border-b-2 rounded-none px-4 py-3 font-medium text-sm transition-all ${
								activeTab === "comparison"
									? "border-blue-600 text-blue-600 bg-blue-50"
									: "border-transparent text-gray-600 hover:text-gray-900"
							}`}
						>
							<BarChart3 className="w-4 h-4" />
							Comparison
							{filters.selectedStationIds.length > 0 && (
								<span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
									{filters.selectedStationIds.length}
								</span>
							)}
						</Button>
						<Button
							variant={activeTab === "programs" ? "default" : "ghost"}
							onClick={() => setActiveTab("programs")}
							disabled={!selectedStationForPrograms}
							className={`gap-2 border-b-2 rounded-none px-4 py-3 font-medium text-sm transition-all ${
								activeTab === "programs"
									? "border-blue-600 text-blue-600 bg-blue-50"
									: "border-transparent text-gray-600 hover:text-gray-900 disabled:opacity-50"
							}`}
						>
							<Drama className="w-4 h-4" />
							Program Analysis
							{selectedStationForPrograms && (
								<span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
									{availableStations.find((s) => s.id === selectedStationForPrograms)?.name.split(" ")[0]}
								</span>
							)}
						</Button>
					</div>

					{/* Tab Content */}
					<div className="space-y-6">
						{activeTab === "stations" && (
							<StationAnalysisTab
								stations={stationAnalysisData}
								isLoading={!stationAnalysisData}
							/>
						)}

						{activeTab === "comparison" && (
							<ComparisonTab
								comparisonData={comparisonData}
								selectedStations={filters.selectedStationIds}
								isLoading={!comparisonData && filters.selectedStationIds.length > 0}
								minStationsSelected={2}
							/>
						)}

						{activeTab === "programs" && (
							<ProgramAnalysisTab
								programData={programAnalysisData}
								stationId={selectedStationForPrograms}
								isLoading={!programAnalysisData && selectedStationForPrograms !== ""}
							/>
						)}
					</div>
				</div>

				{/* Footer Tips */}
				<Card className="mt-12 p-6 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200">
					<h3 className="font-semibold text-gray-900 mb-2">Tips for Better Results</h3>
					<ul className="text-sm text-gray-700 space-y-1">
						<li>• Use the <strong>Station Analysis</strong> tab to understand individual station performance</li>
						<li>• Select 2-5 stations in <strong>Comparison</strong> tab to make data-driven decisions</li>
						<li>• Review <strong>Program Analysis</strong> to identify top-performing shows</li>
						<li>• Adjust budget and time slot filters to see real-time impact on metrics</li>
					</ul>
				</Card>
			</div>
		</div>
	);
}
