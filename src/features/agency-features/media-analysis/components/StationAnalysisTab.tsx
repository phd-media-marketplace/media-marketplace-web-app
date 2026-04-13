import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SimpleLineChart, MetricCard } from "./charts";
import type { StationAnalysisDetail } from "../types";
// import { TrendingUp, Users, Radio, Zap } from "lucide-react";

interface StationAnalysisTabProps {
	stations: StationAnalysisDetail[];
	isLoading?: boolean;
}

export function StationAnalysisTab({ stations, isLoading = false }: StationAnalysisTabProps) {
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
			{/* Summary Stats */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{stations.slice(0, 4).map((station) => (
					<MetricCard
						key={station.stationId}
						label={station.stationName}
						value={(station.weeklyReach / 1000).toFixed(0)}
						unit="K Reach"
						color="blue"
						trend={{ value: 12, isPositive: true }}
					/>
				))}
			</div>

			{/* Station Cards Grid (2 per row) */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{stations.map((station) => (
					<Card key={station.stationId} className="overflow-hidden hover:shadow-lg transition-shadow">
						{/* Card Header */}
						<div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 text-white">
							<div className="flex items-start justify-between">
								<div>
									<h2 className="text-xl font-bold">{station.stationName}</h2>
									<p className="text-blue-100 text-sm mt-1">{station.mediaType}</p>
								</div>
								<Badge className="bg-blue-500 text-white">{station.mediaType}</Badge>
							</div>
						</div>

						{/* Card Body */}
						<div className="p-6 space-y-6">
							{/* Key Metrics */}
							<div className="grid grid-cols-2 gap-4">
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
								<div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
									<p className="text-xs text-gray-600 font-medium mb-1">ROI</p>
									<p className="text-2xl font-bold text-orange-900">{station.roi.toFixed(2)}x</p>
								</div>
							</div>

							{/* Daily Reach Trend */}
							<div>
								<h3 className="text-sm font-semibold text-gray-900 mb-3">Daily Reach Trend (Last 30 Days)</h3>
								<SimpleLineChart
									data={station.dailyTrend}
									dataKey="reach"
									xAxisKey="date"
									title=""
									strokeColor="#3b82f6"
								/>
							</div>

							{/* Peak Programs */}
							<div>
								<h3 className="text-sm font-semibold text-gray-900 mb-3">Peak Programs</h3>
								<div className="space-y-2">
									{station.peakPrograms.map((program) => (
										<div
											key={program.id}
											className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
										>
											<div className="flex-1 min-w-0">
												<p className="font-medium text-gray-900 text-sm truncate">{program.name}</p>
												<div className="flex items-center gap-2 mt-1 flex-wrap">
													<Badge variant="outline" className="text-xs">
														{program.timeSlot.replace(/_/g, " ")}
													</Badge>
													<span className="text-xs text-gray-600">
														Reach: {(program.reach / 1000).toFixed(0)}K
													</span>
												</div>
											</div>
											<div className="text-right ml-2">
												<p className="font-bold text-blue-600 text-sm">{program.grp.toFixed(1)}</p>
												<p className="text-xs text-gray-500">GRP</p>
											</div>
										</div>
									))}
								</div>
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
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
