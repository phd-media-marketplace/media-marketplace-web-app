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
  
    <Card className="bg-green-50/30 ">
      <CardHeader >
        <CardTitle className="text-green-700 text-lg font-bold">Approval Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/30 px-4 py-2 rounded">
            <label className=" text-[11px] font-semibold uppercase tracking-[0.12em]text-sm text-gray-500">Approved By:</label>
            <div>
              <p className="text-lg font-semibold">{approvedBy}</p>
              <p className="text-sm text-gray-600">{approvedByTitle}</p>
            </div>
          </div>
          <div className="bg-white/30 px-4 py-2 rounded">
            <label className="text-[11px] font-semibold uppercase tracking-[0.12em]text-sm text-gray-500">Approval Date:</label>
            <div className="text-lg font-semibold">
              {approvalDate && new Date(approvalDate).toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
