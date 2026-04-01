import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReachImpressionsChartProps {
  metricsData: {
    date: string;
    reach: number;
    impressions: number;
  }[];
}

/**
 * ReachImpressionsChart Component
 * Dual-axis chart showing reach and impressions over time
 */
export function ReachImpressionsChart({ metricsData }: ReachImpressionsChartProps) {
  // TODO: Integrate with recharts
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reach & Impressions Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center text-gray-500">
            <p className="font-semibold mb-2">Reach & Impressions Chart</p>
            <p className="text-sm">Dual-axis line chart showing audience reach and total impressions</p>
            <p className="text-xs mt-2 text-gray-400">
              {metricsData.length} data points • Recharts integration pending
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
