import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CTRTrendChartProps {
  ctrData: {
    date: string;
    ctr: number;
    clicks: number;
  }[];
}

/**
 * CTRTrendChart Component
 * Line chart showing click-through rate trends over time (for digital campaigns)
 */
export function CTRTrendChart({ ctrData }: CTRTrendChartProps) {
  // TODO: Integrate with recharts
  
  const avgCTR = ctrData.length > 0
    ? (ctrData.reduce((sum, d) => sum + d.ctr, 0) / ctrData.length).toFixed(2)
    : '0.00';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Click-Through Rate Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center text-gray-500">
            <p className="font-semibold mb-2">CTR Trend Chart</p>
            <p className="text-sm">Line chart showing click-through rate over time</p>
            <p className="text-xs mt-2 text-gray-400">
              Average CTR: {avgCTR}% • {ctrData.length} data points • Recharts integration pending
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
