import {
	LineChart,
	Line,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

interface SimpleLineChartProps {
    
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Record<string, any>[];
	dataKey: string;
	title: string;
	xAxisKey: string;
	strokeColor?: string;
}

export function SimpleLineChart({
	data,
	dataKey,
	title,
	xAxisKey,
	strokeColor = "#2563eb",
}: SimpleLineChartProps) {
	return (
		<Card className="p-4">
			<h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
			<ResponsiveContainer width="100%" height={300}>
				<LineChart data={data}>
					<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
					<XAxis dataKey={xAxisKey} stroke="#6b7280" />
					<YAxis stroke="#6b7280" />
					<Tooltip
						contentStyle={{
							backgroundColor: "#1f2937",
							border: "1px solid #374151",
							borderRadius: "8px",
						}}
						labelStyle={{ color: "#f3f4f6" }}
					/>
					<Line
						type="monotone"
						dataKey={dataKey}
						stroke={strokeColor}
						dot={{ fill: strokeColor, r: 4 }}
						activeDot={{ r: 6 }}
						strokeWidth={2}
					/>
				</LineChart>
			</ResponsiveContainer>
		</Card>
	);
}

interface MultiLineChartProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Record<string, any>[];
	lines: Array<{ dataKey: string; strokeColor: string; name: string }>;
	title: string;
	xAxisKey: string;
}

export function MultiLineChart({ data, lines, title, xAxisKey }: MultiLineChartProps) {
	return (
		<Card className="p-4">
			<h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
			<ResponsiveContainer width="100%" height={350}>
				<LineChart data={data}>
					<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
					<XAxis dataKey={xAxisKey} stroke="#6b7280" />
					<YAxis stroke="#6b7280" />
					<Tooltip
						contentStyle={{
							backgroundColor: "#1f2937",
							border: "1px solid #374151",
							borderRadius: "8px",
						}}
						labelStyle={{ color: "#f3f4f6" }}
					/>
					<Legend />
					{lines.map((line) => (
						<Line
							key={line.dataKey}
							type="monotone"
							dataKey={line.dataKey}
							stroke={line.strokeColor}
							name={line.name}
							dot={{ r: 3 }}
							activeDot={{ r: 5 }}
							strokeWidth={2}
						/>
					))}
				</LineChart>
			</ResponsiveContainer>
		</Card>
	);
}

interface GroupedBarChartProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Record<string, any>[];
	bars: Array<{ dataKey: string; fillColor: string; name: string }>;
	title: string;
	xAxisKey: string;
}

export function GroupedBarChart({ data, bars, title, xAxisKey }: GroupedBarChartProps) {
	return (
		<Card className="p-4">
			<h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
			<ResponsiveContainer width="100%" height={350}>
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
					<XAxis dataKey={xAxisKey} stroke="#6b7280" />
					<YAxis stroke="#6b7280" />
					<Tooltip
						contentStyle={{
							backgroundColor: "#1f2937",
							border: "1px solid #374151",
							borderRadius: "8px",
						}}
						labelStyle={{ color: "#f3f4f6" }}
					/>
					<Legend />
					{bars.map((bar) => (
						<Bar
							key={bar.dataKey}
							dataKey={bar.dataKey}
							fill={bar.fillColor}
							name={bar.name}
							radius={[8, 8, 0, 0]}
						/>
					))}
				</BarChart>
			</ResponsiveContainer>
		</Card>
	);
}

interface SimplePieChartProps {
	data: Array<{ name: string; value: number }>;
	title: string;
	colors?: string[];
}

const DEFAULT_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function SimplePieChart({ data, title, colors = DEFAULT_COLORS }: SimplePieChartProps) {
	return (
		<Card className="p-4">
			<h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
			<ResponsiveContainer width="100%" height={300}>
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						labelLine={true}
						label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
						outerRadius={80}
						fill="#8884d8"
						dataKey="value"
					>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
						))}
					</Pie>
					<Tooltip
						formatter={(value) => {
							const total = data.reduce((sum, d) => sum + d.value, 0);
							const percent = ((value as number) / total * 100).toFixed(1);
							return `${value} (${percent}%)`;
						}}
						contentStyle={{
							backgroundColor: "#1f2937",
							border: "1px solid #374151",
							borderRadius: "8px",
							color: "#f3f4f6",
						}}
					/>
				</PieChart>
			</ResponsiveContainer>
		</Card>
	);
}

interface MetricCardProps {
	label: string;
	value: string | number;
	unit?: string;
	icon?: React.ReactNode;
	color?: string;
	trend?: { value: number; isPositive: boolean };
}

export function MetricCard({ label, value, unit, icon, color = "blue", trend }: MetricCardProps) {
	const colorClasses = {
		blue: "bg-blue-50 text-blue-900 border-blue-200",
		green: "bg-green-50 text-green-900 border-green-200",
		orange: "bg-orange-50 text-orange-900 border-orange-200",
		red: "bg-red-50 text-red-900 border-red-200",
		purple: "bg-purple-50 text-purple-900 border-purple-200",
	};

	return (
		<Card className={`p-4 border border-gray-200 ${colorClasses[color as keyof typeof colorClasses]}`}>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<p className="text-xs font-medium text-gray-600 mb-1">{label}</p>
					<div className="flex items-baseline gap-1">
						<span className="text-2xl font-bold">{value}</span>
						{unit && <span className="text-sm text-gray-500">{unit}</span>}
					</div>
					{trend && (
						<p className={`text-xs font-medium mt-2 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
							{trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
						</p>
					)}
				</div>
				{icon && <div className="text-2xl">{icon}</div>}
			</div>
		</Card>
	);
}
