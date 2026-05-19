import { Badge } from "@/components/ui/badge";
import type { WorkOrderStatus } from "@/types/work-order";

interface WorkOrderStatusBadgeProps {
  status: WorkOrderStatus;
}

/**
 * WorkOrderStatusBadge Component
 * Displays color-coded status badge for work orders
 */
export function WorkOrderStatusBadge({ status }: WorkOrderStatusBadgeProps) {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    APPROVED: "bg-green-100 text-green-800 border-green-300",
    REJECTED: "bg-red-100 text-red-800 border-red-300",
    REVISED: "bg-blue-100 text-blue-800 border-blue-300",
    PAUSED: "bg-gray-100 text-gray-800 border-gray-300",
  };

  return (
    <Badge className={`${styles[status]} border`}>
      {status.replace('_', ' ')}
    </Badge>
  );
}
