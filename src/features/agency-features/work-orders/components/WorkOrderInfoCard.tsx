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
      <CardHeader className="border-b border-violet-100 [.border-b]:pb-1 ">
        <CardTitle className="text-primary text-lg font-bold">Order Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="rounded-md bg-violet-50/30 p-4 h-25 ">
              <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-700/80">Media Partner</label>
              <div>
                <p className="mt-1 break-all text-lg font-semibold text-violet-950">{mediaPartnerName}</p>
                <p className="text-sm font-mono text-gray-600">{channelName}</p>
              </div>
            </div>

            <div className="rounded bg-indigo-50/30 p-4 h-25">
              <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-800/80">
                {header.clientType === 'AGENCY' ? 'Agency' : 'Client'}
              </label>
              <div className="mt-1 text-lg font-semibold text-indigo-950">
                {header.clientType === 'AGENCY' ? header.agencyName : header.clientName}
              </div>
            </div>

            <div className="rounded bg-green-50/30 p-4 h-25">
              <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-800/80">Brand</label>
              <div className="mt-1 text-lg font-semibold text-green-950">{header.brandName}</div>
            </div>

            <div className="rounded bg-blue-50/30 p-4 h-25">
              <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-800/80">Campaign</label>
              <div className="mt-1 text-lg font-semibold text-blue-950">{header.campaignName}</div>
              <div className="text-sm text-gray-600">Objective: {header.campaignObjective}</div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 ">
            <div className="rounded bg-cyan-50/30 p-4 h-25">
              <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-800/80">PO Number</label>
              <div className="mt-1 text-lg font-semibold text-cyan-950">{header.poNumber}</div>
            </div>

            <div className="rounded bg-amber-50/30 p-4 h-25">
              <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-800/80">MPO Number</label>
              <div className="mt-1 text-lg font-semibold text-amber-950">{header.mpoNumber}</div>
            </div>

            <div className="rounded bg-lime-50/30 p-4 h-25">
              <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-lime-800/80">Campaign Period</label>
              <div className="mt-1 text-lg font-semibold text-lime-950">
                {new Date(header.startDate).toLocaleDateString()} - {new Date(header.endDate).toLocaleDateString()}
              </div>
            </div>

            <div className="rounded bg-gray-50/30 p-4 h-25">
              <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-800/80">Prepared By</label>
              <div className="mt-1 text-lg font-semibold text-gray-950">{preparedBy}</div>
              <div className="text-sm text-gray-600">{preparedByTitle}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
