import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import {
	GroupedBarChart,
	SimplePieChart,
	MetricCard,
	// MultiAreaChart,
	MultiLineChart,
} from "./charts";
import type { MediaAnalysisResult } from "../types";
import { AlertCircle } from "lucide-react";
import Loader from "@/components/universal/Loader";
import { DataTable, type UniversalDataTableColumn } from "@/components/universal/DataTable";
import type {
	// MediaAnalysisFilters,
	MediaStation,
} from "../types";

interface ComparisonTabProps {
	comparisonSelection: {
		stationSelections: string[];
		selectedCount: number;
		handleStationSelection: (stationId: string, index: number) => void;
	};
	comparisonData: MediaAnalysisResult | null;
	availableStations?: MediaStation[];
	isLoading?: boolean;
	minStationsSelected?: number;
	minStations?: number;
	maxStations?: number;
}

export function ComparisonTab({
	comparisonSelection,
	comparisonData,
	availableStations,
	isLoading = false,
	minStationsSelected = 2,
	minStations = 2,
	maxStations = 5,
}: ComparisonTabProps) {
	const { stationSelections, selectedCount, handleStationSelection } = comparisonSelection;

	if (isLoading) {
		return (
			<Loader 
				title="Loading comparison data..." 
				message="Fetching insights for selected stations." 
			/>
		) 
	}

	const shouldShowComparison = comparisonData && selectedCount >= minStationsSelected;
	const { stationMetrics, stationTrends, GRPDistribution } = comparisonData || {
		stationMetrics: [],
		stationTrends: [],
		GRPDistribution: [],
	};

	// Find best stations for each metric (safely handle empty arrays)
	const bestReach = stationMetrics.length > 0 ? stationMetrics.reduce((a, b) => (a.reach > b.reach ? a : b)) : stationMetrics[0] || {};
	const bestROI = stationMetrics.length > 0 ? stationMetrics.reduce((a, b) => (a.roi > b.roi ? a : b)) : stationMetrics[0] || {};
	const bestFrequency = stationMetrics.length > 0 ? stationMetrics.reduce((a, b) => (a.averageFrequency > b.averageFrequency ? a : b)) : stationMetrics[0] || {};
	const bestGRP = stationMetrics.length > 0 ? stationMetrics.reduce((a, b) => (a.grp! > b.grp! ? a : b)) : stationMetrics[0] || {};

	// Prepare chart data
	const comparisonChartData = stationMetrics.map((metric) => ({
		name: metric.stationName,
		reach: metric.reach,
		impressions: metric.impressions,
		roi: metric.roi,
		grp: metric.grp,
	}));

	const trendChartData =
		stationTrends.length > 0
			? stationTrends[0]?.points?.map((point, index) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const obj: Record<string, any> = { period: point.period };
					stationTrends.forEach((trend) => {
						obj[trend.stationName] = trend.points[index]?.reach || 0;
					});
					return obj;
			  }) ?? []
			: [];

	// Shared palette (5 colors) used across trend lines, bar charts and pie chart
	const palette = [
		// "#FF6B6B", // Vibrant Red
		// "#4ECDC4", // Bright Teal
		// "#45B7D1", // Sky Blue
		// "#F7DC6F", // Golden Yellow
		// "#BB8FCE", // Soft Purple
		"#8b5cf6",
		"#3b82f6",
		"#10b981",
		"#f59e0b",
		"#ef4444",
	];

	const trendLines = stationTrends.map((trend, index) => {
		const strokeColor = palette[index % palette.length];
		return {
			dataKey: trend.stationName,
			strokeColor,
			// keep fillColor same as strokeColor; chart will apply light gradient opacities
			fillColor: strokeColor,
			name: trend.stationName,
		};
	});

	return (
		<div className="space-y-6">
			{/* Station Selection */}
		<div>
			<div className="flex justify-between items-center">
				<label className="text-sm font-semibold text-gray-700">
					Select Stations ({selectedCount}/{maxStations})
				</label>
				{selectedCount >= minStations && (
					<span className="text-xs text-green-600 font-medium">✓ Ready to compare</span>
				)}
			</div>
			
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
				{Array.from({ length: maxStations }).map((_, index) => {
					const availableForSelection = availableStations?.filter(
						(station) => !stationSelections.includes(station.id)
					);
					return (
						<Select 
							key={index}
							value={stationSelections[index] || ""}
							onValueChange={(value) => handleStationSelection(value, index)}
						>
							<SelectTrigger className="w-full input-field">
								<SelectValue placeholder="Select stations">
									{stationSelections[index] && availableStations?.find((s) => s.id === stationSelections[index])?.name}
								</SelectValue>
							</SelectTrigger>
							<SelectContent className="select-trigger-bg">
								{availableForSelection?.map((station) => (
									<SelectItem key={station.id} value={station.id}>
										{station.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					);
				})}
			</div>
		</div>

		{/* Comparison Results - Only show when enough stations selected */}
		{!shouldShowComparison ? (
			<div className="flex items-center justify-center py-16 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
				<div className="text-center">
					<AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
					<p className="text-gray-700 font-medium">Select at least {minStationsSelected} stations to compare</p>
					<p className="text-sm text-gray-500 mt-1">Pick stations above to view comparison analysis</p>
				</div>
			</div>
		) : (
			<>
			{/* Top Performers */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<MetricCard
					label="Best Reach"
					value={(bestReach.reach / 1000).toFixed(0)}
					unit="K"
					color="blue"
				/>
				<MetricCard label="Best ROI" value={bestROI.roi.toFixed(2)} unit="x" color="green" />
				<MetricCard
					label="Best Frequency"
					value={bestFrequency.averageFrequency.toFixed(2)}
					color="purple"
				/>
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Reach Comparison */}
				<Card className="border border-primary/5 bg-slate-50/70">
					<GroupedBarChart
						data={comparisonChartData}
						bars={[
							{
								dataKey: "reach",
								fillColor: palette[0],
								name: "Reach",
							},
						]}
						title="Reach Comparison"
						xAxisKey="name"
					/>
				</Card>

				{/* Budget Allocation */}
				<Card className="border border-primary/5 bg-slate-50/70">
					<SimplePieChart
						data={GRPDistribution}
						title="Recommended Budget Allocation"
						colors={palette}
					/>
				</Card>

				{/* Reach Trend over Time */}
				<Card className="border border-primary/5 bg-slate-50/70">
					{trendChartData.length > 0 && (
						// <MultiAreaChart
						// 	data={trendChartData}
						// 	areas={stationTrends.map((trend) => ({
						// 		dataKey: trend.stationName,
						// 		strokeColor: trendLines.find((line) => line.dataKey === trend.stationName)?.strokeColor || "#3b82f6",
						// 		fillColor: trendLines.find((line) => line.dataKey === trend.stationName)?.strokeColor + "33" || "#3b82f633",
						// 		name: trend.stationName,
						// 	}))}
						// 	title="Reach Trend Comparison"
						// 	xAxisKey="period"
						// 	xAxisInterval={0}
						// />
						<MultiLineChart
							data={trendChartData}
							lines={trendLines}
							title="Reach Trend Comparison"
							xAxisKey="period"
							xAxisInterval={0}
						/>
					)}
				</Card>

				{/* ROI Comparison */}
				<Card className="border border-primary/5 bg-slate-50/70">
					<GroupedBarChart
						data={comparisonChartData}
						bars={[
							{
								dataKey: "roi",
								fillColor: palette[2],
								name: "ROI",
							},
						]}
						title="ROI Comparison"
						xAxisKey="name"
					/>
				</Card>
			</div>
			{/* Comparison Table */}
			<Card className="border border-primary/5 bg-gray-50/70">
				<DataTable
					rows={stationMetrics}
					rowKey={(metric) => metric.stationId}
					columns={[
						{
							id: 'station',
							header: 'Station',
							cell: (metric) => (
								<div>
									<p className="text-gray-900 font-medium">{metric.stationName}</p>
								</div>
							),
						},
						{
							id: 'mediaType',
							header: 'Media Type',
							align: 'center',
							cell: (metric) => (
								<div>
									<Badge variant="outline" className="mt-1 text-xs">
										{metric.mediaType}
									</Badge>
								</div>
							),
						},
						{
							id: 'reach',
							header: 'Reach',
							align: 'right',
							cell: (metric) => (
								<div>
									<p className="font-semibold text-gray-900">{(metric.reach / 1000).toFixed(0)}K</p>
									{metric.stationId === bestReach.stationId && (
										<p className="text-xs text-green-600 font-medium">Best</p>
									)}
								</div>
							),
						},
						{
							id: 'impressions',
							header: 'Impressions',
							align: 'right',
							cell: (metric) => `${(metric.impressions / 1000).toFixed(0)}K`,
						},
						{
							id: 'frequency',
							header: 'Frequency',
							align: 'right',
							cell: (metric) => (
								<div>
									<p>{metric.averageFrequency.toFixed(2)}</p>
									{metric.stationId === bestFrequency.stationId && (
										<p className="text-xs text-green-600 font-medium">Best</p>
									)}
								</div>
							),
						},
						{
							id: 'grp',
							header: 'GRP',
							align: 'right',
							cell: (metric) => (
								<div>
									<p>{metric.grp?.toFixed(1)}</p>
									{metric.stationId === bestGRP.stationId && (
										<p className="text-xs text-green-600 font-medium">Best</p>
									)}
								</div>
							),
							tooltip: "Gross Rating Points - a measure of the size of an advertising campaign by a specific medium or schedule",
						},
						{
							id: 'roi',
							header: 'ROI',
							align: 'right',
							cell: (metric) => (
								<div>
									<p className="font-bold text-blue-600">{metric.roi.toFixed(2)}x</p>
									{metric.stationId === bestROI.stationId && (
										<p className="text-xs text-green-600 font-medium">Best</p>
									)}
								</div>
							),
						},
					] as UniversalDataTableColumn<typeof stationMetrics[0]>[]}
					emptyState={<p className="text-gray-500">No stations selected for comparison</p>}
				/>
			</Card>


			{/* Recommendations */}
			<Card className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 border border-blue-200">
				<h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
				<ul className="space-y-2 text-sm text-gray-700">
					<li className="flex items-start gap-2">
						<span className="text-blue-600 font-bold">•</span>
						<span>
							<strong>{bestReach.stationName}</strong> provides the highest reach of{" "}
							{(bestReach.reach / 1000).toFixed(0)}K, making it ideal for broad
							audience targeting.
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-green-600 font-bold">•</span>
						<span>
							<strong>{bestROI.stationName}</strong> offers the best ROI of{" "}
							{bestROI.roi.toFixed(2)}x, maximizing your investment returns.
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-purple-600 font-bold">•</span>
						<span>
							Consider allocating {GRPDistribution[0]?.name} as it offers optimal
							performance across selected metrics.
						</span>
					</li>
				</ul>
			</Card>
			</>
		)}
		</div>
	);
}
