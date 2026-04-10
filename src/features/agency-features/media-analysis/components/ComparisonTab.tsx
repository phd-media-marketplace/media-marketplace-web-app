import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	MultiLineChart,
	GroupedBarChart,
	SimplePieChart,
	MetricCard,
} from "./charts";
import type { MediaAnalysisResult } from "../types";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { AlertCircle, Eye, Trash2 } from "lucide-react";

interface ComparisonTabProps {
	comparisonData: MediaAnalysisResult | null;
	selectedStations: string[];
	isLoading?: boolean;
	minStationsSelected?: number;
}

export function ComparisonTab({
	comparisonData,
	selectedStations,
	isLoading = false,
	minStationsSelected = 2,
}: ComparisonTabProps) {
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

	if (isLoading) {
		return <div className="text-center py-12 text-gray-500">Generating comparison...</div>;
	}

	if (!comparisonData || selectedStations.length < minStationsSelected) {
		return (
			<div className="flex items-center justify-center py-16 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
				<div className="text-center">
					<AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
					<p className="text-gray-700 font-medium">Select at least {minStationsSelected} stations to compare</p>
					<p className="text-sm text-gray-500 mt-1">Use the filter panel above to select stations</p>
				</div>
			</div>
		);
	}

	const { stationMetrics, stationTrends, budgetDistribution } = comparisonData;

	// Find best stations for each metric
	const bestReach = stationMetrics.reduce((a, b) => (a.reach > b.reach ? a : b));
	const bestROI = stationMetrics.reduce((a, b) => (a.roi > b.roi ? a : b));
	const bestFrequency = stationMetrics.reduce((a, b) => (a.averageFrequency > b.averageFrequency ? a : b));

	// Row selection handlers
	const toggleRowSelection = (stationId: string) => {
		const newSelected = new Set(selectedRows);
		if (newSelected.has(stationId)) {
			newSelected.delete(stationId);
		} else {
			newSelected.add(stationId);
		}
		setSelectedRows(newSelected);
	};

	const toggleSelectAll = () => {
		if (selectedRows.size === stationMetrics.length) {
			setSelectedRows(new Set());
		} else {
			setSelectedRows(new Set(stationMetrics.map((m) => m.stationId)));
		}
	};

	const handleDeleteSelected = () => {
		alert(
			`Delete ${selectedRows.size} selected station${selectedRows.size !== 1 ? "s" : ""}?`
		);
		setSelectedRows(new Set());
	};

	const handleViewSelected = (stationId?: string) => {
		if (stationId) {
			const station = stationMetrics.find((m) => m.stationId === stationId);
			alert(`View details for station: ${station?.stationName}`);
		} else {
			alert(
				`View details for ${selectedRows.size} selected station${selectedRows.size !== 1 ? "s" : ""}?`
			);
		}
	};

	// Prepare chart data
	const comparisonChartData = stationMetrics.map((metric) => ({
		name: metric.stationName,
		reach: metric.reach,
		impressions: metric.impressions,
		roi: metric.roi,
		budgetUsed: metric.budgetUsed,
	}));

	const trendChartData =
		stationTrends.length > 0
			? stationTrends[0]?.points.map((point, index) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const obj: Record<string, any> = { period: point.period };
					stationTrends.forEach((trend) => {
						obj[trend.stationName] = trend.points[index]?.reach || 0;
					});
					return obj;
			  })
			: [];

	const trendLines = stationTrends.map((trend, index) => ({
		dataKey: trend.stationName,
		strokeColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][
			index % 5
		],
		name: trend.stationName,
	}));

	return (
		<div className="space-y-6">
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

			{/* Selection Action Bar */}
			{selectedRows.size > 0 && (
				<div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<span className="text-sm font-medium text-gray-700">
						{selectedRows.size} station{selectedRows.size !== 1 ? "s" : ""} selected
					</span>
					<div className="flex gap-2 ml-auto">
						<Button
							size="sm"
							variant="outline"
							onClick={() => handleViewSelected()}
							className="gap-2"
						>
							<Eye className="w-4 h-4" />
							View
						</Button>
						<Button
							size="sm"
							variant="destructive"
							onClick={handleDeleteSelected}
							className="gap-2"
						>
							<Trash2 className="w-4 h-4" />
							Delete
						</Button>
					</div>
				</div>
			)}

			{/* Comparison Table */}
			<Card className="overflow-hidden border border-slate-300">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader className="bg-slate-100">
							<TableRow className="border-b border-slate-200">
								<TableHead className="w-12 pl-4">
									<input
										type="checkbox"
										checked={
											selectedRows.size === stationMetrics.length &&
											stationMetrics.length > 0
										}
										onChange={toggleSelectAll}
										className="w-4 h-4 rounded"
										title="Select all stations"
									/>
								</TableHead>
								<TableHead className="font-semibold text-gray-900">
									Station
								</TableHead>
								<TableHead className="text-right">Reach</TableHead>
								<TableHead className="text-right">Impressions</TableHead>
								<TableHead className="text-right">Frequency</TableHead>
								<TableHead className="text-right">ROI</TableHead>
								<TableHead className="text-right">Budget</TableHead>
								<TableHead className="text-right w-20">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{stationMetrics.map((metric) => {
								const isSelected = selectedRows.has(metric.stationId);
								return (
									<TableRow
										key={metric.stationId}
										className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
											isSelected ? "bg-blue-50" : ""
										}`}
									>
										<TableCell className="pl-4">
											<input
												type="checkbox"
												checked={isSelected}
												onChange={() => toggleRowSelection(metric.stationId)}
												className="w-4 h-4 rounded"
											/>
										</TableCell>
										<TableCell className="font-medium">
											<div>
												<p className="text-gray-900">{metric.stationName}</p>
												<Badge variant="outline" className="mt-1 text-xs">
													{metric.mediaType}
												</Badge>
											</div>
										</TableCell>
										<TableCell className="text-right">
											<span className="font-semibold text-gray-900">
												{(metric.reach / 1000).toFixed(0)}K
											</span>
											{metric.stationId === bestReach.stationId && (
												<p className="text-xs text-green-600 font-medium">
													Best
												</p>
											)}
										</TableCell>
										<TableCell className="text-right text-gray-700">
											{(metric.impressions / 1000).toFixed(0)}K
										</TableCell>
										<TableCell className="text-right text-gray-700">
											{metric.averageFrequency.toFixed(2)}
											{metric.stationId === bestFrequency.stationId && (
												<p className="text-xs text-green-600 font-medium">
													Best
												</p>
											)}
										</TableCell>
										<TableCell className="text-right">
											<span className="font-bold text-blue-600">
												{metric.roi.toFixed(2)}x
											</span>
											{metric.stationId === bestROI.stationId && (
												<p className="text-xs text-green-600 font-medium">
													Best
												</p>
											)}
										</TableCell>
										<TableCell className="text-right text-gray-700">
											₵{(metric.budgetUsed / 1000).toFixed(0)}K
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<button
													onClick={() => handleViewSelected(metric.stationId)}
													className="p-1.5 hover:bg-blue-100 rounded transition-colors text-blue-600"
													title="View details"
												>
													<Eye className="w-4 h-4" />
												</button>
												<button
													onClick={() => handleDeleteSelected()}
													className="p-1.5 hover:bg-red-100 rounded transition-colors text-red-600"
													title="Delete"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</div>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</Card>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Reach Comparison */}
				<GroupedBarChart
					data={comparisonChartData}
					bars={[
						{
							dataKey: "reach",
							fillColor: "#3b82f6",
							name: "Reach",
						},
					]}
					title="Reach Comparison"
					xAxisKey="name"
				/>

				{/* Budget Allocation */}
				<SimplePieChart
					data={budgetDistribution}
					title="Recommended Budget Allocation"
					colors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]}
				/>

				{/* Reach Trend over Time */}
				{trendChartData.length > 0 && (
					<MultiLineChart
						data={trendChartData}
						lines={trendLines}
						title="Reach Trend Comparison"
						xAxisKey="period"
					/>
				)}

				{/* ROI Comparison */}
				<GroupedBarChart
					data={comparisonChartData}
					bars={[
						{
							dataKey: "roi",
							fillColor: "#10b981",
							name: "ROI",
						},
					]}
					title="ROI Comparison"
					xAxisKey="name"
				/>
			</div>

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
							Consider allocating {budgetDistribution[0]?.name} as it offers optimal
							performance across selected metrics.
						</span>
					</li>
				</ul>
			</Card>
		</div>
	);
}
