import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ROITrendChartProps {
  data: Array<{
    date: string;
    roi: number;
    cpm: number;
  }>;
}

/**
 * ROITrendChart Component
 * Shows ROI and CPM trends over time
 */
export function ROITrendChart({ data }: ROITrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ROI & Cost Efficiency Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="roi"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="ROI (%)"
            />
            <Area
              type="monotone"
              dataKey="cpm"
              stackId="2"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              name="CPM (GHS)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
