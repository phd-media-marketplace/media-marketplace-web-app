import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Target, Eye, MousePointer } from "lucide-react";
import type { CampaignMetrics } from "../types";

interface CampaignMetricsCardsProps {
  metrics: CampaignMetrics;
}

/**
 * CampaignMetricsCards Component
 * Displays key campaign metrics in a card grid
 */
export function CampaignMetricsCards({ metrics }: CampaignMetricsCardsProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Impressions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">
                {formatNumber(metrics.impressions)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Total Impressions</p>
            </div>
            <Eye className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* Reach */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">
                {formatNumber(metrics.reach)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Total Reach</p>
            </div>
            <Target className="w-8 h-8 text-green-500 opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* Average Frequency */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">
                {metrics.avgFrequency.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Avg. Frequency</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500 opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* CTR (if available) */}
      {metrics.ctr !== undefined && metrics.ctr > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {metrics.ctr.toFixed(2)}%
                </div>
                <p className="text-xs text-gray-500 mt-1">Click-Through Rate</p>
              </div>
              <MousePointer className="w-8 h-8 text-orange-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clicks (if CTR not available but clicks are) */}
      {metrics.clicks !== undefined && metrics.clicks > 0 && (metrics.ctr === undefined || metrics.ctr === 0) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {formatNumber(metrics.clicks)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Total Clicks</p>
              </div>
              <MousePointer className="w-8 h-8 text-orange-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
