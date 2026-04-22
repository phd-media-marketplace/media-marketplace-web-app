import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, ChevronDown, TimerReset } from "lucide-react";

interface DateRange {
	startDate: string;
	endDate: string;
}

interface DateRangePickerProps {
	onDateRangeChange: (range: DateRange) => void;
	defaultStart?: string;
	defaultEnd?: string;
	label?: string;
}

const PRESET_RANGES = [
	{ label: "This month", getDates: () => getThisMonth() },
	{ label: "Last month", getDates: () => getLastMonth() },
	{ label: "Last 7 days", getDates: () => getLast7Days() },
	{ label: "Last 14 days", getDates: () => getLast14Days() },
	{ label: "Last 30 days", getDates: () => getLast30Days() },
	{ label: "Last 60 days", getDates: () => getLast60Days() },
	{ label: "Last 90 days", getDates: () => getLast90Days() },
	{ label: "This year", getDates: () => getThisYear() },
	{ label: "Last year", getDates: () => getLastYear() },
];

function formatDate(date: Date): string {
	return date.toISOString().split("T")[0];
}

function parseDate(dateStr: string): Date {
	return new Date(dateStr + "T00:00:00");
}

function getThisMonth(): DateRange {
	const today = new Date();
	const start = new Date(today.getFullYear(), today.getMonth(), 1);
	return {
		startDate: formatDate(start),
		endDate: formatDate(today),
	};
}

function getLastMonth(): DateRange {
	const today = new Date();
	const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
	const end = new Date(today.getFullYear(), today.getMonth(), 0);
	return {
		startDate: formatDate(start),
		endDate: formatDate(end),
	};
}

function getLast7Days(): DateRange {
	const today = new Date();
	const start = new Date(today);
	start.setDate(today.getDate() - 7);
	return {
		startDate: formatDate(start),
		endDate: formatDate(today),
	};
}

function getLast14Days(): DateRange {
	const today = new Date();
	const start = new Date(today);
	start.setDate(today.getDate() - 14);
	return {
		startDate: formatDate(start),
		endDate: formatDate(today),
	};
}

function getLast30Days(): DateRange {
	const today = new Date();
	const start = new Date(today);
	start.setDate(today.getDate() - 30);
	return {
		startDate: formatDate(start),
		endDate: formatDate(today),
	};
}

function getLast60Days(): DateRange {
	const today = new Date();
	const start = new Date(today);
	start.setDate(today.getDate() - 60);
	return {
		startDate: formatDate(start),
		endDate: formatDate(today),
	};
}

function getLast90Days(): DateRange {
	const today = new Date();
	const start = new Date(today);
	start.setDate(today.getDate() - 90);
	return {
		startDate: formatDate(start),
		endDate: formatDate(today),
	};
}

function getThisYear(): DateRange {
	const today = new Date();
	const start = new Date(today.getFullYear(), 0, 1);
	return {
		startDate: formatDate(start),
		endDate: formatDate(today),
	};
}

function getLastYear(): DateRange {
	const today = new Date();
	const start = new Date(today.getFullYear() - 1, 0, 1);
	const end = new Date(today.getFullYear() - 1, 11, 31);
	return {
		startDate: formatDate(start),
		endDate: formatDate(end),
	};
}

export function DateRangePicker({
	onDateRangeChange,
	defaultStart,
	defaultEnd,
	// label = "Date Range",
}: DateRangePickerProps) {
	const today = formatDate(new Date());
	const [startDate, setStartDate] = useState(defaultStart || formatDate(new Date(new Date().setDate(new Date().getDate() - 30))));
	const [endDate, setEndDate] = useState(defaultEnd || today);
	const [isOpen, setIsOpen] = useState(false);

	const handlePresetClick = (range: DateRange) => {
		setStartDate(range.startDate);
		setEndDate(range.endDate);
		onDateRangeChange(range);
	};

	const handleApply = () => {
		onDateRangeChange({ startDate, endDate });
		setIsOpen(false);
	};

	const handleReset = () => {
		const defaultRange = getLast30Days();
		setStartDate(defaultRange.startDate);
		setEndDate(defaultRange.endDate);
		onDateRangeChange(defaultRange);
		setIsOpen(false);
	};

	const formatDisplayDate = (dateStr: string) => {
		return parseDate(dateStr).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<div className="relative">
			<Button
				variant="outline"
				onClick={() => setIsOpen(!isOpen)}
				className={`w-full justify-between bg-white border-gray-300 hover:bg-slate-50 ${isOpen ? 'border-secondary' : ''} text-primary`}
			>
				<span className="flex items-center gap-2">
					<Calendar className="w-4 h-4 text-gray-400" />
					{formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
				</span>
				<span className="text-xs text-gray-500"><ChevronDown className="w-4 h-4" /></span>
			</Button>

			{isOpen && (
				<Card className="absolute top-12 right-0 z-50 min-w-95 w-full bg-white p-0 shadow-xl border border-slate-200">
					<div className="grid grid-cols-3 h-72">
						{/* Presets Section */}
						<div className="col-span-1 bg-slate-50 border-r border-slate-200 overflow-y-auto p-1 space-y-1">
							<div className="text-xs font-bold text-primary px-1 py-1">Recently used</div>
							<button
								onClick={() => handlePresetClick(getThisMonth())}
								className="w-full text-left px-1 py-2 text-sm hover:bg-slate-200 rounded transition-colors"
							>
								This month
							</button>
							<button
								onClick={() => handlePresetClick(getLastMonth())}
								className="w-full text-left px-1 py-2 text-sm hover:bg-slate-200 rounded transition-colors"
							>
								Last month
							</button>

							<div className="text-xs font-bold text-primary px-1 py-2 pt-3">Maximum</div>
							{PRESET_RANGES.slice(2).map((preset) => (
								<button
									key={preset.label}
									onClick={() => handlePresetClick(preset.getDates())}
									className="w-full text-left px-1 py-2 text-sm hover:bg-slate-200 rounded transition-colors"
								>
									{preset.label}
								</button>
							))}
						</div>

						{/* Date Inputs Section */}
						<div className="col-span-2 p-4 space-y-4">
							<div>
								<label className="text-xs font-semibold text-gray-700 block mb-2">Start Date</label>
								<Input
									type="date"
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
									max={endDate}
									className="w-full input-field"
								/>
							</div>

							<div>
								<label className="text-xs font-semibold text-gray-700 block mb-2">End Date</label>
								<Input
									type="date"
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
									min={startDate}
									max={today}
									className="w-full input-field"
								/>
							</div>

							<div className="text-xs text-gray-500 pt-2">
								Dates are shown in your local time
							</div>

							<div className="flex gap-2 pt-4">
								<Button
									variant="outline"
									size="sm"
									onClick={handleReset}
									className="flex-1 border-secondary text-primary hover:bg-secondary/10"
								>
									{/* <RotateCcw className="w-3 h-3 mr-1" /> */}
									<TimerReset className="w-3 h-3 mr-1" />
									Reset
								</Button>
								<Button
									size="sm"
									onClick={handleApply}
									className="flex-1 bg-primary text-white hover:bg-primary/80"
								>
									Update
								</Button>
							</div>
						</div>
					</div>
				</Card>
			)}
		</div>
	);
}

// function RotateCcw(props: React.SVGProps<SVGSVGElement>) {
// 	return (
// 		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
// 			<path d="M3 7v6h6M21 17v-6h-6" />
// 			<path d="M16.83 13.83a5 5 0 0 0-5.66-5.66M2.1 10.11a8 8 0 0 1 10.82-2.14" />
// 		</svg>
// 	);
// }
