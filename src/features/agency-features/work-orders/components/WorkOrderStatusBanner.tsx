import { Card, CardContent } from "@/components/ui/card";
import type { WorkOrderStatus } from "../types";
import { WorkOrderStatusBadge } from "./WorkOrderStatusBadge";

interface WorkOrderStatusBannerProps {
  status: WorkOrderStatus;
  approvalDate?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

/**
 * WorkOrderStatusBanner Component
 * Displays status information with approval or rejection details
 */
export function WorkOrderStatusBanner({
  status,
  approvalDate,
  approvedBy,
  rejectionReason,
}: WorkOrderStatusBannerProps) {
  const backgroundStyles = {
    APPROVED: 'border-green-300 bg-green-50',
    REJECTED: 'border-red-300 bg-red-50',
    PENDING: 'border-yellow-300 bg-yellow-50',
    REVISED: 'border-blue-300 bg-blue-50',
  };

  return (
    <Card className={backgroundStyles[status]}>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold">Status:</div>
            <WorkOrderStatusBadge status={status} />
          </div>
          {status === 'APPROVED' && approvalDate && (
            <div className="text-sm text-gray-600">
              Approved on {new Date(approvalDate).toLocaleDateString()} by {approvedBy}
            </div>
          )}
          {status === 'REJECTED' && rejectionReason && (
            <div className="text-sm text-red-600 max-w-md">
              <strong>Reason:</strong> {rejectionReason}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
