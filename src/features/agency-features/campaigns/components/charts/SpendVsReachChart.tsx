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

interface SpendVsReachChartProps {
  data: Array<{
    date: string;
    spend: number;
    reach: number;
  }>;
}

/**
 * SpendVsReachChart Component
 * Shows campaign spend vs reach over time
 */
export function SpendVsReachChart({ data }: SpendVsReachChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spend vs Reach Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="spend"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Spend (GHS)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="reach"
              stroke="#10b981"
              strokeWidth={2}
              name="Reach"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
