import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SimpleAreaChart } from "./charts";
import type { StationAnalysisDetail } from "../types";
import { useSelectedStation, useStationRecommendations } from "../hooks";
import { StationDetailDialog } from "./StationDetailDialog";
import { ArrowUpRight, Tv } from "lucide-react";

interface StationAnalysisTabProps {
	stations: StationAnalysisDetail[];
	isLoading?: boolean;
}

export function StationAnalysisTab({ stations, isLoading = false }: StationAnalysisTabProps) {
	const { selectedStation, setSelectedStationId, closeSelectedStation } = useSelectedStation(stations);
	const recommendations = useStationRecommendations(selectedStation);

	if (isLoading) {
		return <div className="text-center py-12 text-gray-500">Loading station data...</div>;
	}

	if (stations.length === 0) {
		return (
			<div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
				<p className="text-gray-600 font-medium">No stations available for selected filters</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Station Cards Grid (2 per row) */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{stations.map((station) => (
					<Card
						key={station.stationId}
						className="overflow-hidden border border-slate-200 bg-slate-50/70 hover:shadow-lg transition-all"
					>
						{/* Card Header */}
						<div className="bg-slate-100 p-6 border-b border-slate-200">
							<div className="flex items-start justify-between gap-3">
								<div className="flex items-center gap-2">
									<Tv className="w-5 h-5 text-slate-500" />
									<h2 className="text-xl font-bold text-slate-900">{station.stationName}</h2>
								</div>
								<Badge className="bg-slate-200 text-slate-700">{station.mediaType}</Badge>
							</div>
						</div>

						{/* Card Body */}
						<div className="px-6 space-y-6">
							{/* Key Metrics */}
							<div className="grid grid-cols-3 gap-4">
								<div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
									<p className="text-xs text-gray-600 font-medium mb-1">Weekly Reach</p>
									<p className="text-2xl font-bold text-blue-900">
										{(station.weeklyReach / 1000).toFixed(0)}K
									</p>
								</div>
								<div className="bg-green-50 p-4 rounded-lg border border-green-100">
									<p className="text-xs text-gray-600 font-medium mb-1">Avg Frequency</p>
									<p className="text-2xl font-bold text-green-900">{station.averageFrequency.toFixed(2)}</p>
								</div>
								<div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
									<p className="text-xs text-gray-600 font-medium mb-1">Average GRP</p>
									<p className="text-2xl font-bold text-purple-900">{station.averageGrp.toFixed(1)}</p>
								</div>
							</div>

							{/* Daily Reach Trend */}
							<div>
								<h3 className="text-sm font-semibold text-gray-900 mb-3">Daily Reach Trend (Last 30 Days)</h3>
								{/* <SimpleLineChart
									data={station.dailyTrend}
									dataKey="reach"
									xAxisKey="date"
									title=""
									strokeColor="#9370DB"
								/> */}
								<SimpleAreaChart
									data={station.dailyTrend}
									dataKey="reach"
									xAxisKey="date"
									title=""
									strokeColor="#9370DB"
									fillColor="#9370DB"
									// xAxisLabel="Date"
									// yAxisLabel="Reach"
								/>
							</div>


							{/* Additional Stats */}
							<div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
								<div className="text-center">
									<p className="text-xs text-gray-600">Impressions</p>
									<p className="font-bold text-gray-900 mt-1">
										{(station.totalImpressions / 1000).toFixed(0)}K
									</p>
								</div>
								<div className="text-center">
									<p className="text-xs text-gray-600">Days</p>
									<p className="font-bold text-gray-900 mt-1">30</p>
								</div>
								<div className="text-center">
									<p className="text-xs text-gray-600">Status</p>
									<Badge className="mt-1 justify-center bg-green-600 text-white text-xs">Active</Badge>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setSelectedStationId(station.stationId)}
								className="w-full rounded-lg border border-secondary bg-white px-4 py-2.5 text-sm font-medium text-primary hover:bg-secondary/10 transition-colors inline-flex items-center justify-center gap-2"
							>
								Click to view more details
								<ArrowUpRight className="h-4 w-4" />
							</button>
						</div>
					</Card>
				))}
			</div>

			<StationDetailDialog
				selectedStation={selectedStation}
				recommendations={recommendations}
				onClose={closeSelectedStation}
			/>
		</div>
	);
}
