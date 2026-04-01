import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, BarChart3 } from "lucide-react";
import type { CampaignListItem } from "../types";
import { CampaignStatusBadge } from "./CampaignStatusBadge";
import { formatCurrency } from "@/utils/formatters";

interface CampaignsTableProps {
  campaigns: CampaignListItem[];
}

/**
 * CampaignsTable Component
 * Displays campaigns in a sortable table
 */
export function CampaignsTable({ campaigns }: CampaignsTableProps) {
  const navigate = useNavigate();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  if (campaigns.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No campaigns found matching your filters
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campaign</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Client</TableHead>
          <TableHead className="text-right">Budget</TableHead>
          <TableHead className="text-right">Spent</TableHead>
          <TableHead className="text-right">Impressions</TableHead>
          <TableHead className="text-right">Reach</TableHead>
          <TableHead className="text-center">Channels</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => (
          <TableRow
            key={campaign.id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => navigate(`/agency/campaigns/${campaign.id}`)}
          >
            <TableCell>
              <div>
                <div className="font-medium">{campaign.campaignName}</div>
                <div className="text-xs text-gray-500">{campaign.campaignCode}</div>
              </div>
            </TableCell>
            <TableCell className="font-medium">{campaign.brandName}</TableCell>
            <TableCell>{campaign.clientName}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(campaign.totalBudget)}
            </TableCell>
            <TableCell className="text-right">
              <div>
                <div className="font-medium">{formatCurrency(campaign.totalSpent)}</div>
                <div className="text-xs text-gray-500">
                  {campaign.spentPercentage.toFixed(0)}%
                </div>
              </div>
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatNumber(campaign.impressions)}
            </TableCell>
            <TableCell className="text-right">
              {formatNumber(campaign.reach)}
            </TableCell>
            <TableCell className="text-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                {campaign.channelCount}
              </span>
            </TableCell>
            <TableCell>
              <CampaignStatusBadge status={campaign.status} />
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/agency/campaigns/${campaign.id}`)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
