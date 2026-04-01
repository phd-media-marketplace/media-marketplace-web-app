import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { CampaignChannelPerformance } from "../types";
import { formatCurrency } from "@/utils/formatters";
import { MediaTypeBadge } from "../../work-orders/components/MediaTypeBadge";

interface CampaignChannelsTableProps {
  channels: CampaignChannelPerformance[];
}

/**
 * CampaignChannelsTable Component
 * Displays channel performance details in a table
 */
export function CampaignChannelsTable({ channels }: CampaignChannelsTableProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const getChannelStatusBadge = (status: CampaignChannelPerformance['status']) => {
    const styles = {
      PENDING: "bg-gray-100 text-gray-800 border-gray-300",
      ACTIVE: "bg-blue-100 text-blue-800 border-blue-300",
      COMPLETED: "bg-green-100 text-green-800 border-green-300",
      PAUSED: "bg-yellow-100 text-yellow-800 border-yellow-300",
    };

    return (
      <Badge className={`${styles[status]} border text-xs`}>
        {status}
      </Badge>
    );
  };

  if (channels.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Channel Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            No channels configured for this campaign
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Channel Performance</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Media Partner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="text-right">Spent</TableHead>
              <TableHead className="text-right">Impressions</TableHead>
              <TableHead className="text-right">Reach</TableHead>
              <TableHead className="text-right">Avg. Freq.</TableHead>
              {channels.some(c => c.metrics.ctr) && (
                <TableHead className="text-right">CTR</TableHead>
              )}
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels.map((channel) => {
              const spentPercentage = channel.budget > 0 
                ? (channel.spent / channel.budget) * 100 
                : 0;

              return (
                <TableRow key={channel.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{channel.mediaPartnerName}</div>
                      <div className="text-xs text-gray-500">{channel.channelName}</div>
                      <div className="text-xs text-gray-400">{channel.workOrderNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <MediaTypeBadge mediaType={channel.mediaType} />
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(channel.budget)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <div className="font-medium">{formatCurrency(channel.spent)}</div>
                      <div className="text-xs text-gray-500">
                        {spentPercentage.toFixed(0)}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatNumber(channel.metrics.impressions)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(channel.metrics.reach)}
                  </TableCell>
                  <TableCell className="text-right">
                    {channel.metrics.avgFrequency.toFixed(2)}
                  </TableCell>
                  {channels.some(c => c.metrics.ctr) && (
                    <TableCell className="text-right">
                      {channel.metrics.ctr 
                        ? `${channel.metrics.ctr.toFixed(2)}%` 
                        : '-'}
                    </TableCell>
                  )}
                  <TableCell>
                    {getChannelStatusBadge(channel.status)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
