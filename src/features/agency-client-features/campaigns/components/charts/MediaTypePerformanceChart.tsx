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

interface MediaTypePerformanceChartProps {
  data: Array<{
    mediaType: string;
    budget: number;
    spent: number;
    impressions: number;
  }>;
}

/**
 * MediaTypePerformanceChart Component
 * Shows performance metrics grouped by media type
 */
export function MediaTypePerformanceChart({ data }: MediaTypePerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by Media Type</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mediaType" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
            <Bar dataKey="spent" fill="#ef4444" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
