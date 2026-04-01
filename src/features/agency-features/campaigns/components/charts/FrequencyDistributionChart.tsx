import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FrequencyDistributionChartProps {
  frequencyData: {
    frequency: string;
    count: number;
  }[];
  avgFrequency: number;
}

/**
 * FrequencyDistributionChart Component
 * Bar chart showing distribution of ad frequency across audience
 */
export function FrequencyDistributionChart({ 
    // frequencyData, 
    avgFrequency 
}: FrequencyDistributionChartProps) {
  // TODO: Integrate with recharts
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequency Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center text-gray-500">
            <p className="font-semibold mb-2">Frequency Distribution Chart</p>
            <p className="text-sm">Histogram showing how often audience sees ads</p>
            <p className="text-xs mt-2 text-gray-400">
              Average Frequency: {avgFrequency.toFixed(2)} • Recharts integration pending
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
