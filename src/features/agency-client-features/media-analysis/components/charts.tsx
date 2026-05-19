import {
	LineChart,
	Line,
	AreaChart,
	Area,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";
import { Card } from "@/components/ui/card";

function formatNumberShort(value: number) {
	if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
	if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
	return String(value);
}

function getAutoYDomain(data: Record<string, unknown>[], keys: string[]): [number, number] {
	const values = data
		.flatMap((row) => keys.map((key) => Number(row[key])))
		.filter((v) => Number.isFinite(v));

	if (values.length === 0) return [0, 5000];

	const max = Math.max(...values);
	return [0, max + 5000];
}
interface SimpleLineChartProps {
    
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Record<string, any>[];
	dataKey: string;
	title: string;
	xAxisKey: string;
	strokeColor?: string;
	xAxisInterval?: number
}

export function SimpleLineChart({
	data,
	dataKey,
	title,
	xAxisKey,
	strokeColor = "#2563eb",
	xAxisInterval = 3
	
}: SimpleLineChartProps) {
	return (
		<Card className="p-0">
			<h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
			<ResponsiveContainer width="100%" height={300} className="-mx-4">
				<LineChart data={data}>
					<CartesianGrid vertical={false} strokeDasharray="3" />
					<XAxis dataKey={xAxisKey} stroke="#6b7280" angle={-30} textAnchor="end" interval={xAxisInterval} height={60} />
					<YAxis stroke="#6b7280" tickFormatter={formatNumberShort} axisLine={false}/>
					<Tooltip
						contentStyle={{
							backgroundColor: "#2f0d68",
							border: "1px solid #2f0d68",
							borderRadius: "8px",
						}}
						labelStyle={{ color: "#f3f4f6" }}
						formatter={(value: number | string) => (typeof value === 'number' ? formatNumberShort(value) : String(value))}
					/>
					<Line
						type="monotone"
						dataKey={dataKey}
						stroke={strokeColor}
						strokeWidth={2}
						dot={false}
						isAnimationActive={false}
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
	xAxisInterval?: number;
}

export function MultiLineChart({ data, lines, title, xAxisKey, xAxisInterval = 3 }: MultiLineChartProps) {
	return (
		<Card className="p-4">
			<h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
			<ResponsiveContainer width="100%" height={350}>
				<LineChart data={data}>
					<CartesianGrid vertical={false} strokeDasharray="3" />
					<XAxis dataKey={xAxisKey} stroke="#6b7280" angle={-45} textAnchor="end" interval={xAxisInterval} height={60} />
					<YAxis stroke="#6b7280" tickFormatter={formatNumberShort}  />
					<Tooltip
						contentStyle={{
							backgroundColor: "#2f0d68",
							border: "1px solid #2f0d68",
							borderRadius: "8px",
							// color: "whitesmoke",
						}}
						labelStyle={{ color: "#ffffff" }}
						formatter={(value: number | string) => (typeof value === 'number' ? formatNumberShort(value) : String(value))}
					/>
					<Legend />
					{lines.map((line) => (
						<Line
							key={line.dataKey}
							type="monotone"
							dataKey={line.dataKey}
							stroke={line.strokeColor}
							name={line.name}
							strokeWidth={2}
							dot={false}
							isAnimationActive={false}
						/>
					))}
				</LineChart>
			</ResponsiveContainer>
		</Card>
	);
}

interface SimpleAreaChartProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Record<string, any>[];
	dataKey: string;
	title: string;
	xAxisKey: string;
	strokeColor?: string;
	fillColor?: string;
	xAxisLabel?: string;
	yAxisLabel?: string;
	autoScaleY?: boolean;
	xAxisInterval?: number
}

export function SimpleAreaChart({
	data,
	dataKey,
	title,
	xAxisKey,
	strokeColor = "#2563eb",
	fillColor = "#2563eb",
	xAxisLabel,
	yAxisLabel,
	autoScaleY = false,
	xAxisInterval = 3
}: SimpleAreaChartProps) {
	const yDomain = autoScaleY ? getAutoYDomain(data, [dataKey]) : undefined;

	return (
		<Card className="p-0">
			<h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
			<ResponsiveContainer width="100%" height={300} className="-mx-4">
				<AreaChart data={data}>
					<defs>
						<linearGradient id={`simple-area-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor={fillColor} stopOpacity={0.35} />
							<stop offset="95%" stopColor={fillColor} stopOpacity={0.05} />
						</linearGradient>
					</defs>
					<CartesianGrid vertical={false} strokeDasharray="3" />
					<XAxis
						dataKey={xAxisKey}
						stroke="#6b7280"
						angle={-30}
						textAnchor="end"
						interval={xAxisInterval}
						height={60}
						label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -8, fill: "#6b7280" } : undefined}
					/>
					<YAxis
						stroke="#6b7280"
						tickFormatter={formatNumberShort}
						axisLine={false}
						domain={yDomain}
						label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft", fill: "#6b7280" } : undefined}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: "#2f0d68",
							border: "1px solid #2f0d68",
							borderRadius: "8px",
						}}
						labelStyle={{ color: "#f3f4f6" }}
						formatter={(value: number | string) => (typeof value === 'number' ? formatNumberShort(value) : String(value))}
					/>
					<Area
						type="monotone"
						dataKey={dataKey}
						stroke={strokeColor}
						fill={`url(#simple-area-${dataKey})`}
						strokeWidth={2}
						dot={false}
						isAnimationActive={false}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</Card>
	);
}

interface MultiAreaChartProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Record<string, any>[];
	areas: Array<{ dataKey: string; strokeColor: string; fillColor?: string; name: string }>;
	title: string;
	xAxisKey: string;
	xAxisLabel?: string;
	yAxisLabel?: string;
	autoScaleY?: boolean;
	xAxisInterval?: number;
}

export function MultiAreaChart({ data, areas, title, xAxisKey, xAxisLabel, yAxisLabel, autoScaleY = true, xAxisInterval = 3 }: MultiAreaChartProps) {
	const yDomain = autoScaleY ? getAutoYDomain(data, areas.map((a) => a.dataKey)) : undefined;

	return (
		<Card className="p-4">
			<h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
			<ResponsiveContainer width="100%" height={350}>
				<AreaChart data={data}>
					<defs>
						{areas.map((area) => (
							<linearGradient key={area.dataKey} id={`multi-area-${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor={area.fillColor ?? area.strokeColor} stopOpacity={0.35} />
								<stop offset="95%" stopColor={area.fillColor ?? area.strokeColor} stopOpacity={0.05} />
							</linearGradient>
						))}
					</defs>
					<CartesianGrid vertical={false} strokeDasharray="3" />
					<XAxis
						dataKey={xAxisKey}
						stroke="#6b7280"
						angle={-30}
						textAnchor="end"
						interval={xAxisInterval}
						height={60}
						label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -8, fill: "#6b7280" } : undefined}
					/>
					<YAxis
						stroke="#6b7280"
						tickFormatter={formatNumberShort}
						domain={yDomain}
						label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft", fill: "#6b7280" } : undefined}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: "#2f0d68",
							border: "1px solid #2f0d68",
							borderRadius: "8px",
						}}
						labelStyle={{ color: "#ffffff" }}
						formatter={(value: number | string) => (typeof value === 'number' ? formatNumberShort(value) : String(value))}
					/>
					<Legend />
					{areas.map((area) => (
						<Area
							key={area.dataKey}
							type="monotone"
							dataKey={area.dataKey}
							stroke={area.strokeColor}
							fill={`url(#multi-area-${area.dataKey})`}
							fillOpacity={0.16}
							name={area.name}
							strokeWidth={2}
							dot={false}
							isAnimationActive={false}
						/>
					))}
				</AreaChart>
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
					<CartesianGrid vertical={false} strokeDasharray="3" />
					<XAxis dataKey={xAxisKey} stroke="#6b7280" angle={-30} textAnchor="end" interval={0} minTickGap={8} height={60} />
					<YAxis stroke="#6b7280" tickFormatter={formatNumberShort} />
					<Tooltip
						contentStyle={{
							backgroundColor: "#2f0d68",
							border: "1px solid #2f0d68",
							borderRadius: "8px",
						}}
						labelStyle={{ color: "#f3f4f6" }}
						formatter={(value: number | string) => (typeof value === 'number' ? formatNumberShort(value) : String(value))}
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
						innerRadius={40}
					>
						{data.map((_, index) => (
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
							backgroundColor: "#2f0d68",
							border: "1px solid #2f0d68",
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
