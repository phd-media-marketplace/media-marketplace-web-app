import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PerformanceTrendChartProps {
  data: Array<{
    date: string;
    impressions: number;
    reach: number;
    clicks?: number;
  }>;
}

/**
 * PerformanceTrendChart Component
 * Shows campaign performance trends over time
 */
export function PerformanceTrendChart({ data }: PerformanceTrendChartProps) {
  const hasClicks = data.some(d => d.clicks && d.clicks > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="impressions"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Impressions"
            />
            <Line
              type="monotone"
              dataKey="reach"
              stroke="#10b981"
              strokeWidth={2}
              name="Reach"
            />
            {hasClicks && (
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Clicks"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
