import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { dummyCampaigns } from "../dummy-data";
import {
  SpendVsReachChart,
  ChannelComparisonChart,
  PerformanceTrendChart,
  BudgetAllocationChart,
  MediaTypePerformanceChart,
  ROITrendChart,
} from "../components/charts";

/**
 * ViewCampaignCharts Component
 * Comprehensive charts and visualizations for campaign performance analysis
 */
export default function ViewCampaignCharts() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Find the campaign by ID
  const campaign = dummyCampaigns.find(c => c.id === id);

  // Generate dummy trend data based on period (memoized to avoid re-renders)
  const trendData = useMemo(() => {
    if (!campaign) return [];
    
    const dataPoints = period === 'daily' ? 30 : period === 'weekly' ? 12 : 6;
    const data = [];
    
    // Use a seeded random for consistent results during the same render
    const seed = campaign.id.charCodeAt(0);
    const seededRandom = (index: number) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };
    
    for (let i = 0; i < dataPoints; i++) {
      const date = new Date();
      if (period === 'daily') {
        date.setDate(date.getDate() - (dataPoints - i));
      } else if (period === 'weekly') {
        date.setDate(date.getDate() - (dataPoints - i) * 7);
      } else {
        date.setMonth(date.getMonth() - (dataPoints - i));
      }
      
      const progress = (i + 1) / dataPoints;
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        spend: Math.floor(campaign.totalSpent * progress),
        reach: Math.floor(campaign.overallMetrics.reach * progress),
        impressions: Math.floor(campaign.overallMetrics.impressions * progress),
        clicks: campaign.overallMetrics.clicks 
          ? Math.floor(campaign.overallMetrics.clicks * progress)
          : undefined,
        roi: 100 + seededRandom(i) * 50,
        cpm: 15 + seededRandom(i + 100) * 10,
      });
    }
    
    return data;
  }, [campaign, period]);

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">Campaign Not Found</h2>
        <p className="text-gray-500">The campaign you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/agency/campaigns')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Button>
      </div>
    );
  }

  // Generate channel comparison data
  const channelComparisonData = campaign.channels.map(channel => ({
    channel: channel.channelName,
    impressions: channel.metrics.impressions,
    reach: channel.metrics.reach,
    spend: channel.spent,
  }));

  // Generate budget allocation data
  const budgetAllocationData = campaign.channels.map(channel => ({
    name: `${channel.channelName} (${channel.mediaType})`,
    value: channel.budget,
  }));

  // Generate media type performance data
  const mediaTypePerformance = campaign.channels.reduce((acc, channel) => {
    const existing = acc.find(item => item.mediaType === channel.mediaType);
    if (existing) {
      existing.budget += channel.budget;
      existing.spent += channel.spent;
      existing.impressions += channel.metrics.impressions;
    } else {
      acc.push({
        mediaType: channel.mediaType,
        budget: channel.budget,
        spent: channel.spent,
        impressions: channel.metrics.impressions,
      });
    }
    return acc;
  }, [] as Array<{ mediaType: string; budget: number; spent: number; impressions: number }>);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/agency/campaigns/${campaign.id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaign
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">
              Campaign Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {campaign.campaignName} • {campaign.campaignCode}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={period} onValueChange={(value) => setPeriod(value as 'daily' | 'weekly' | 'monthly')}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Charts
          </Button>
        </div>
      </div>

      {/* Spend vs Reach */}
      <SpendVsReachChart data={trendData} />

      {/* Performance Trends */}
      <PerformanceTrendChart data={trendData} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Comparison */}
        <ChannelComparisonChart data={channelComparisonData} />

        {/* Budget Allocation */}
        <BudgetAllocationChart data={budgetAllocationData} />
      </div>

      {/* Media Type Performance */}
      <MediaTypePerformanceChart data={mediaTypePerformance} />

      {/* ROI Trends */}
      <ROITrendChart data={trendData} />

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Chart data is dynamically generated based on campaign performance. 
          Toggle between daily, weekly, and monthly views to analyze trends at different time scales.
        </p>
      </div>
    </div>
  );
}
