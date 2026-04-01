import { Badge } from "@/components/ui/badge";
import type { CampaignStatus } from "../types";

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
}

/**
 * CampaignStatusBadge Component
 * Displays color-coded status badge for campaigns
 */
export function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const styles = {
    PLANNING: "bg-gray-100 text-gray-800 border-gray-300",
    ONGOING: "bg-blue-100 text-blue-800 border-blue-300",
    COMPLETED: "bg-green-100 text-green-800 border-green-300",
    PAUSED: "bg-yellow-100 text-yellow-800 border-yellow-300",
    CANCELLED: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <Badge className={`${styles[status]} border`}>
      {status}
    </Badge>
  );
}
