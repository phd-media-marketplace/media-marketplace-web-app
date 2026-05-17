import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Lightbulb, Tv } from "lucide-react";
import { SimpleAreaChart } from "./charts";
import type { StationAnalysisDetail } from "../types";

interface StationDetailDialogProps {
	selectedStation: StationAnalysisDetail | null;
	recommendations: string[];
	onClose: () => void;
}

export function StationDetailDialog({ selectedStation, recommendations, onClose }: StationDetailDialogProps) {
	return (
		<Dialog open={Boolean(selectedStation)} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
				{selectedStation && (
					<>
						<DialogHeader>
							<DialogTitle className="flex items-center justify-between gap-3 mt-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-4 bg-primary/10 rounded-lg">
                                        <Tv className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-primary text-2xl font-semibold">{selectedStation.stationName} Detailed Analysis</h3>
                                </div>
                                <Badge className="bg-green-600 text-white">Active</Badge>
							</DialogTitle>
							<DialogDescription>
								Peak programs, full trend context, and recommendations for this station.
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-6">
							<div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-3">
								<div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
									<p className="text-xs text-slate-600">Weekly Reach</p>
									<p className="text-lg font-bold text-slate-900">{(selectedStation.weeklyReach / 1000).toFixed(0)}K</p>
								</div>
								<div className="rounded-lg border border-green-200 bg-green-50 p-3">
									<p className="text-xs text-slate-600">Avg Frequency</p>
									<p className="text-lg font-bold text-slate-900">{selectedStation.averageFrequency.toFixed(2)}</p>
								</div>
								<div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
									<p className="text-xs text-slate-600">Average GRP</p>
									<p className="text-lg font-bold text-slate-900">{selectedStation.averageGrp.toFixed(1)}</p>
								</div>
								<div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
									<p className="text-xs text-slate-600">Impressions</p>
									<p className="text-lg font-bold text-slate-900">{(selectedStation.totalImpressions / 1000).toFixed(0)}K</p>
								</div>
								<div className="rounded-lg border border-red-200 bg-red-50 p-3">
									<p className="text-xs text-slate-600">ROI</p>
									<p className="text-lg font-bold text-slate-900">{selectedStation.roi.toFixed(2)}x</p>
								</div>
							</div>

							<div>
								<h3 className="mb-2 text-sm font-semibold text-slate-900">Daily Reach Trend</h3>
								{/* <SimpleLineChart
									data={selectedStation.dailyTrend}
									dataKey="reach"
									xAxisKey="date"
									title=""
									strokeColor="#6366f1"
								/> */}
                                <SimpleAreaChart
                                    data={selectedStation.dailyTrend}
                                    dataKey="reach"
                                    xAxisKey="date"
                                    title=""
                                    strokeColor="#9370DB"
                                    fillColor="#9370DB"
                                    // xAxisLabel="Date"
                                    // yAxisLabel="Reach"
                                />
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="rounded-xl border border-slate-200 bg-white p-4">
									<h3 className="mb-3 text-sm font-semibold text-primary">Peak Programs</h3>
									<div className="space-y-2">
										{selectedStation.peakPrograms.length > 0 ? (
											selectedStation.peakPrograms.map((program) => (
												<div
													key={program.id}
													className="rounded-lg border border-slate-100 bg-slate-50 p-3"
												>
                                                    <div className="flex items-center justify-between gap-2">
													    <p className="text-sm font-medium text-slate-900">{program.name}</p>
													    <Badge className="text-xs bg-purple-50 text-purple-800">{program.timeSlot.replace(/_/g, " ")}</Badge>
                                                    </div>
													{/* <p className="mt-1 text-xs text-slate-600">
														{program.timeSlot.replace(/_/g, " ")} • Reach {(program.reach / 1000).toFixed(0)}K • GRP {program.grp.toFixed(1)}
													</p> */}
                                                    <div className="mt-2 grid grid-cols-3 gap-6">
                                                        <div className="bg-white p-2 text-center rounded shadow-sm shadow-gray-100">
                                                            <h5 className="text-xs text-slate-600">Reach</h5>
                                                            <p className="text-sm font-bold text-primary">{(program.reach / 1000).toFixed(0)}K</p>  
                                                        </div>
                                                        <div className="bg-white p-2 text-center rounded shadow-sm shadow-gray-100">
                                                            <h5 className="text-xs text-slate-600">GRP</h5>
                                                            <p className="text-sm font-bold text-primary">{program.grp.toFixed(1)}</p>  
                                                        </div>
                                                        <div className="bg-white p-2 text-center rounded shadow-sm shadow-gray-100">
                                                            <h5 className="text-xs text-slate-600">Frequency</h5>
                                                            <p className="text-sm font-bold text-primary">{program.frequency}</p>  
                                                        </div>
                                                    </div>
												</div>
											))
										) : (
											<p className="text-sm text-slate-500">No peak programs available for this station.</p>
										)}
									</div>
								</div>

								<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
									<h3 className="mb-3 text-sm font-semibold text-primary inline-flex items-center gap-2">
										<Lightbulb className="h-4 w-4 text-amber-500" />
										Recommendations
									</h3>
									<div className="space-y-2">
										{recommendations.map((rec, idx) => (
											<p key={idx} className="text-sm text-slate-700 rounded-md bg-white border border-slate-200 p-3">
												{rec}
											</p>
										))}
									</div>
								</div>
							</div>

							{/* <div className="border-t border-slate-200 pt-4">
								<Badge className="bg-green-600 text-white">Active</Badge>
							</div> */}
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
