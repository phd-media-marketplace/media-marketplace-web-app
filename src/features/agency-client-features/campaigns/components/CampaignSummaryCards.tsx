import { Card, CardContent } from "@/components/ui/card";

interface CampaignSummaryCardsProps {
  totalCount: number;
  ongoingCount: number;
  completedCount: number;
  planningCount: number;
}

/**
 * CampaignSummaryCards Component
 * Displays summary statistics for campaigns
 */
export function CampaignSummaryCards({
  totalCount,
  ongoingCount,
  completedCount,
  planningCount,
}: CampaignSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-primary">{totalCount}</div>
          <p className="text-xs text-gray-500 mt-1">Total Campaigns</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-blue-600">{ongoingCount}</div>
          <p className="text-xs text-gray-500 mt-1">Ongoing</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          <p className="text-xs text-gray-500 mt-1">Completed</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-gray-600">{planningCount}</div>
          <p className="text-xs text-gray-500 mt-1">Planning</p>
        </CardContent>
      </Card>
    </div>
  );
}
