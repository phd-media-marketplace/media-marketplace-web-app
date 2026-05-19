import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CampaignChannelPerformance } from "../../types";

interface ChannelPerformanceChartProps {
  channels: CampaignChannelPerformance[];
}

/**
 * ChannelPerformanceChart Component
 * Bar chart comparing performance metrics across different channels
 */
export function ChannelPerformanceChart({ channels }: ChannelPerformanceChartProps) {
  // TODO: Integrate with recharts
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Channel Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center text-gray-500">
            <p className="font-semibold mb-2">Channel Comparison Chart</p>
            <p className="text-sm">Bar chart comparing impressions, reach, and spend across channels</p>
            <p className="text-xs mt-2 text-gray-400">
              {channels.length} channels • Recharts integration pending
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
