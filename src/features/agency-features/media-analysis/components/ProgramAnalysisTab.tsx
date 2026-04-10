import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { GroupedBarChart, MetricCard } from "./charts";
import type { 
    ProgramAnalysisResult, 
    // Program
} from "../types";
import { AlertCircle, Drama } from "lucide-react";
import { useState } from "react";

interface ProgramAnalysisTabProps {
	programData: ProgramAnalysisResult | null;
	stationId: string;
	isLoading?: boolean;
}

export function ProgramAnalysisTab({ programData, stationId, isLoading = false }: ProgramAnalysisTabProps) {
	const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("ALL");

	if (isLoading) {
		return <div className="text-center py-12 text-gray-500">Loading program data...</div>;
	}

	if (!programData || !stationId) {
		return (
			<div className="flex items-center justify-center py-16 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
				<div className="text-center">
					<AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
					<p className="text-gray-700 font-medium">Select a station to analyze programs</p>
					<p className="text-sm text-gray-500 mt-1">Switch to Station Analysis tab first</p>
				</div>
			</div>
		);
	}

	// Filter programs by selected time slot
	const filteredPrograms =
		selectedTimeSlot === "ALL"
			? programData.programs
			: programData.programs.filter((p) => p.timeSlot === selectedTimeSlot);

	// Sort by reach descending
	const sortedPrograms = [...filteredPrograms].sort((a, b) => b.averageReach - a.averageReach);

	// Top programs for metrics
	const topProgram = sortedPrograms[0];
	const topByROI = sortedPrograms.reduce((a, b) =>
		a.grp > b.grp ? a : b
	);

	// Prepare chart data
	const chartData = sortedPrograms.slice(0, 10).map((program) => ({
		name: program.name,
		reach: program.averageReach,
		impressions: program.averageImpressions,
		grp: program.grp,
	}));

	const timeSlots = ["ALL", ...Array.from(new Set(programData.programs.map((p) => p.timeSlot)))];

	return (
		<div className="space-y-6">
			{/* Station Header */}
			<Card className="bg-linear-to-r from-indigo-600 to-purple-600 p-6 text-white border-0">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold">{programData.stationName}</h2>
						<p className="text-indigo-100 mt-2">Analyzing {programData.programs.length} programs</p>
					</div>
					<Drama className="w-12 h-12 opacity-20" />
				</div>
			</Card>

			{/* Filter by Time Slot */}
			<div className="flex items-center gap-4">
				<label className="text-sm font-semibold text-gray-700">Filter by Time Slot:</label>
				<Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
					<SelectTrigger className="w-48 bg-white">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{timeSlots.map((slot) => (
							<SelectItem key={slot} value={slot}>
								{slot === "ALL" ? "All Time Slots" : slot.replace(/_/g, " ")}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Top Programs Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{topProgram && (
					<MetricCard
						label="Top Reach Program"
						value={topProgram.name}
						color="blue"
						trend={{ value: 15, isPositive: true }}
					/>
				)}
				{topByROI && (
					<MetricCard
						label="Highest GRP"
						value={topByROI.grp.toFixed(1)}
						unit="%"
						color="green"
						trend={{ value: 8, isPositive: true }}
					/>
				)}
				<MetricCard
					label="Total Programs"
					value={filteredPrograms.length}
					color="purple"
				/>
			</div>

			{/* Top Programs Chart */}
			{chartData.length > 0 && (
				<GroupedBarChart
					data={chartData}
					bars={[
						{
							dataKey: "reach",
							fillColor: "#3b82f6",
							name: "Reach",
						},
					]}
					title="Top 10 Programs by Reach"
					xAxisKey="name"
				/>
			)}

			{/* Programs Table */}
			<Card className="overflow-hidden">
				<div className="p-4 border-b border-gray-200 bg-slate-50">
					<h3 className="font-semibold text-gray-900">Program Performance</h3>
				</div>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader className="bg-slate-50">
							<TableRow>
								<TableHead className="font-semibold text-gray-900">Program Name</TableHead>
								<TableHead className="text-center">Time Slot</TableHead>
								<TableHead className="text-right">Avg Reach</TableHead>
								<TableHead className="text-right">Impressions</TableHead>
								<TableHead className="text-right">Frequency</TableHead>
								<TableHead className="text-right">GRP</TableHead>
								<TableHead className="text-center">Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedPrograms.map((program) => {
								const isTopReach = program.id === topProgram?.id;
								const isTopGRP = program.id === topByROI?.id;

								return (
									<TableRow key={program.id} className={isTopReach ? "bg-blue-50" : ""}>
										<TableCell className="font-medium text-gray-900">
											<div>
												<p>{program.name}</p>
												{isTopReach && (
													<Badge className="mt-1 bg-blue-600">Top Reach</Badge>
												)}
											</div>
										</TableCell>
										<TableCell className="text-center">
											<Badge variant="outline" className="justify-center">
												{program.timeSlot.replace(/_/g, " ")}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<span className="font-bold text-blue-600">
												{(program.averageReach / 1000).toFixed(0)}K
											</span>
										</TableCell>
										<TableCell className="text-right text-gray-700">
											{(program.averageImpressions / 1000).toFixed(0)}K
										</TableCell>
										<TableCell className="text-right text-gray-700">
											{program.averageFrequency.toFixed(2)}
										</TableCell>
										<TableCell className="text-right">
											<span
												className={`font-bold ${
													isTopGRP ? "text-green-600" : "text-gray-900"
												}`}
											>
												{program.grp.toFixed(1)}%
											</span>
										</TableCell>
										<TableCell className="text-center">
											<Badge className="bg-green-600 text-white justify-center">
												Active
											</Badge>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</Card>

			{/* Insights */}
			<Card className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 border border-amber-200">
				<h3 className="font-semibold text-gray-900 mb-3">Program Insights</h3>
				<ul className="space-y-2 text-sm text-gray-700">
					<li className="flex items-start gap-2">
						<span className="text-amber-600 font-bold">•</span>
						<span>
							<strong>{topProgram?.name}</strong> is your best performing program with{" "}
							{(topProgram?.averageReach || 0 / 1000).toFixed(0)}K reach.
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-orange-600 font-bold">•</span>
						<span>
							Programs scheduled during{" "}
							<strong>{selectedTimeSlot === "ALL" ? "various time slots" : selectedTimeSlot}</strong> show
							consistent engagement rates.
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-orange-600 font-bold">•</span>
						<span>
							Consider increasing frequency for <strong>{topByROI?.name}</strong> to maximize GRP
							contribution.
						</span>
					</li>
				</ul>
			</Card>
		</div>
	);
}
