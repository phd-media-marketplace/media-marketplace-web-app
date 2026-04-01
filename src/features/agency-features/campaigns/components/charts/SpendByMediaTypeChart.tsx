import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CampaignChannelPerformance } from "../../types";
import { formatCurrency } from "@/utils/formatters";

interface SpendByMediaTypeChartProps {
  channels: CampaignChannelPerformance[];
}

/**
 * SpendByMediaTypeChart Component
 * Pie/Donut chart showing budget allocation across media types
 */
export function SpendByMediaTypeChart({ channels }: SpendByMediaTypeChartProps) {
  // Calculate spend by media type
  const spendByType = channels.reduce((acc, channel) => {
    const type = channel.mediaType;
    acc[type] = (acc[type] || 0) + channel.spent;
    return acc;
  }, {} as Record<string, number>);

  const totalSpent = Object.values(spendByType).reduce((sum, val) => sum + val, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Media Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center text-gray-500">
            <p className="font-semibold mb-2">Media Type Distribution</p>
            <p className="text-sm">Donut chart showing spend allocation across media types</p>
            <p className="text-xs mt-2 text-gray-400">
              Total: {formatCurrency(totalSpent)} • Recharts integration pending
            </p>
          </div>
          
          {/* Temporary breakdown */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {Object.entries(spendByType).map(([type, amount]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  type === 'FM' ? 'bg-purple-500' :
                  type === 'TV' ? 'bg-blue-500' :
                  type === 'DIGITAL' ? 'bg-pink-500' :
                  'bg-orange-500'
                }`} />
                <span className="font-medium">{type}:</span>
                <span className="text-gray-600">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
