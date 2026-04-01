import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkOrderHeader } from "../types";

interface WorkOrderInfoCardProps {
  header: WorkOrderHeader;
  mediaPartnerName: string;
  channelName: string;
  preparedBy: string;
  preparedByTitle: string;
}

/**
 * WorkOrderInfoCard Component
 * Displays work order header information (client, brand, campaign, etc.)
 */
export function WorkOrderInfoCard({
  header,
  mediaPartnerName,
  channelName,
  preparedBy,
  preparedByTitle,
}: WorkOrderInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Media Partner</label>
              <div className="text-lg font-semibold">{mediaPartnerName}</div>
              <div className="text-sm text-gray-600">{channelName}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                {header.clientType === 'AGENCY' ? 'Agency' : 'Client'}
              </label>
              <div className="text-lg font-semibold">
                {header.clientType === 'AGENCY' ? header.agencyName : header.clientName}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Brand</label>
              <div className="text-lg font-semibold">{header.brandName}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Campaign</label>
              <div className="text-lg font-semibold">{header.campaignName}</div>
              <div className="text-sm text-gray-600">Objective: {header.campaignObjective}</div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">PO Number</label>
              <div className="text-lg font-semibold">{header.poNumber}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">MPO Number</label>
              <div className="text-lg font-semibold">{header.mpoNumber}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Campaign Period</label>
              <div className="text-lg font-semibold">
                {new Date(header.startDate).toLocaleDateString()} - {new Date(header.endDate).toLocaleDateString()}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Prepared By</label>
              <div className="text-lg font-semibold">{preparedBy}</div>
              <div className="text-sm text-gray-600">{preparedByTitle}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
