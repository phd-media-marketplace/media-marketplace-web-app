import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkOrderApprovalDetailsProps {
  approvedBy?: string;
  approvedByTitle?: string;
  approvalDate?: string;
}

/**
 * WorkOrderApprovalDetails Component
 * Displays approval information for approved work orders
 */
export function WorkOrderApprovalDetails({
  approvedBy,
  approvedByTitle,
  approvalDate,
}: WorkOrderApprovalDetailsProps) {
  return (
    <Card className="border-green-300">
      <CardHeader>
        <CardTitle className="text-green-700">Approval Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Approved By</label>
            <div className="text-lg font-semibold">{approvedBy}</div>
            <div className="text-sm text-gray-600">{approvedByTitle}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Approval Date</label>
            <div className="text-lg font-semibold">
              {approvalDate && new Date(approvalDate).toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
