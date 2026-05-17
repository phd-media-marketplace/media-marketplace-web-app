import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingUp, BarChart3, Drama } from "lucide-react";
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
	useComparisonStationSelections,
} from "../hooks";
import Header from "@/components/universal/Header";
import { useAuthStore } from "@/features/auth/store/auth-store";

/**
 * MediaAnalysisPage
 * Comprehensive media analysis with three tabs:
 * 1. Station Analysis - Individual station performance cards
 * 2. Comparison - Side-by-side comparison of selected stations
 * 3. Program Analysis - Individual program performance within selected station
 */
export default function MediaAnalysisPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("stations");
	const selectedStationForPrograms = "";
	const user = useAuthStore((state) => state.user);

	// Hooks
	const {
		filters,
		updateMediaType,
		updateDateRange,
		updateTimeInterval,
		toggleStationSelection,
		setSelectedStations,
		resetFilters,
	} = useMediaAnalysisFilters();

	const stationAnalysisData = useStationAnalysis(filters);
	const comparisonData = useComparisonData(filters);
	const availableStations = useAvailableStations(filters.mediaType);
	const {
		stationSelections,
		selectedCount: comparisonSelectedCount,
		handleStationSelection,
	} = useComparisonStationSelections(filters.selectedStationIds, setSelectedStations, 5);
	const comparisonSelection = {
		stationSelections,
		selectedCount: comparisonSelectedCount,
		handleStationSelection,
	};
	const programAnalysisData = useProgramAnalysis(selectedStationForPrograms);

	return (
		<div className="space-y-6">
			{/* Header */}
			{/* <div className="bg-white border-b border-slate-200 sticky top-0 z-40"> */}
				<Header
					title="Media Analysis"
					description="Compare stations, analyze programs, and optimize your media spend"
					backbtnVisible={true}
					returnTofunc={() => navigate(`/${user?.tenantType}/dashboard`)}
				/>
			{/* </div> */}

			{/* Main Content */}
			<div className="space-y-6">
				{/* Filters */}
				<AnalysisFilters
					filters={filters}
					availableStations={availableStations}
					onMediaTypeChange={updateMediaType}
					onTimeIntervalChange={updateTimeInterval}
					onDateRangeChange={updateDateRange}
					onStationToggle={toggleStationSelection}
					onReset={resetFilters}
				/>

				{/* Tabs */}
				<Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
					<TabsList variant="line" className="border-b border-slate-200 bg-transparent justify-start gap-4">
						<TabsTrigger value="stations" className="gap-2 data-[state=active]:text-primary after:bg-primary group-data-[variant=line]/tabs-list:data-[state=active]:bg-[#9370DB]/10 rounded-none">
							<TrendingUp className="w-4 h-4" />
							Station Analysis
						</TabsTrigger>
						<TabsTrigger value="comparison" className="gap-2 data-[state=active]:text-primary data-[state=active]:border-primary after:bg-primary group-data-[variant=line]/tabs-list:data-[state=active]:bg-[#9370DB]/10 rounded-none">
							<BarChart3 className="w-4 h-4" />
							Comparison
							{filters.selectedStationIds.length > 0 && (
								<span className="ml-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
									{filters.selectedStationIds.length}
								</span>
							)}
						</TabsTrigger>
						<TabsTrigger value="programs" className="gap-2 data-[state=active]:text-primary data-[state=active]:border-primary after:bg-primary group-data-[variant=line]/tabs-list:data-[state=active]:bg-[#9370DB]/10 rounded-none" disabled={!selectedStationForPrograms}>
							<Drama className="w-4 h-4" />
							Program Analysis
							{selectedStationForPrograms && (
								<span className="ml-2 text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">
									{availableStations.find((s) => s.id === selectedStationForPrograms)?.name.split(" ")[0]}
								</span>
							)}
						</TabsTrigger>
					</TabsList>

					{/* Tab Content */}
					<TabsContent value="stations" className="space-y-6">
						<StationAnalysisTab
							stations={stationAnalysisData}
							isLoading={!stationAnalysisData}
						/>
					</TabsContent>

					<TabsContent value="comparison" className="space-y-6">
						<ComparisonTab
							comparisonSelection={comparisonSelection}
							comparisonData={comparisonData}
							availableStations={availableStations}
							isLoading={!comparisonData && filters.selectedStationIds.length > 0}
						/>
					</TabsContent>

					<TabsContent value="programs" className="space-y-6">
						<ProgramAnalysisTab
							programData={programAnalysisData}
							stationId={selectedStationForPrograms}
							isLoading={!programAnalysisData && selectedStationForPrograms !== ""}
						/>
					</TabsContent>
				</Tabs>

				{/* Footer Tips */}
				<Card className="mt-12 p-6 bg-linear-to-r from-primary/5 to-primary/10 border border-primary/20">
					<h3 className="font-semibold text-gray-900 mb-2">
						✨Tips for Better Results
					</h3>
					<ul className="text-sm text-gray-700 space-y-1">
						<li>• Use the <strong>Station Analysis</strong> tab to understand individual station performance</li>
						<li>• Select 2-5 stations in <strong>Comparison</strong> tab to make data-driven decisions</li>
						<li>• Review <strong>Program Analysis</strong> to identify top-performing shows</li>
						<li>• Adjust the date range and time interval filters to see real-time impact on metrics</li>
					</ul>
				</Card>
			</div>
		</div>
	);
}
