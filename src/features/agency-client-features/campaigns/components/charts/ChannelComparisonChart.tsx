import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChannelComparisonChartProps {
  data: Array<{
    channel: string;
    impressions: number;
    reach: number;
    spend: number;
  }>;
}

/**
 * ChannelComparisonChart Component
 * Compares performance metrics across different channels
 */
export function ChannelComparisonChart({ data }: ChannelComparisonChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Channel Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="channel" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="impressions" fill="#3b82f6" name="Impressions" />
            <Bar dataKey="reach" fill="#10b981" name="Reach" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
