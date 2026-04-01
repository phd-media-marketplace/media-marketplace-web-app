import { Card, CardContent } from "@/components/ui/card";

interface WorkOrdersSummaryCardsProps {
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

/**
 * WorkOrdersSummaryCards Component
 * Displays summary statistics for work orders
 */
export function WorkOrdersSummaryCards({
  totalCount,
  pendingCount,
  approvedCount,
  rejectedCount,
}: WorkOrdersSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-primary">{totalCount}</div>
          <p className="text-xs text-gray-500 mt-1">Total Work Orders</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          <p className="text-xs text-gray-500 mt-1">Pending Approval</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          <p className="text-xs text-gray-500 mt-1">Approved</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
          <p className="text-xs text-gray-500 mt-1">Rejected</p>
        </CardContent>
      </Card>
    </div>
  );
}
