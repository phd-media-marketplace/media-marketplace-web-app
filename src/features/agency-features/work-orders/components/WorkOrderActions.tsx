import { Button } from "@/components/ui/button";
import { Download, Mail, CheckCircle, XCircle, Edit } from "lucide-react";
import type { WorkOrderStatus } from "../types";

interface WorkOrderActionsProps {
  status: WorkOrderStatus;
  onApprove?: () => void;
  onReject?: () => void;
  onRevise?: () => void;
  onDownload?: () => void;
  onEmail?: () => void;
}

/**
 * WorkOrderActions Component
 * Action buttons for work order operations (download, email, approve, reject, revise)
 */
export function WorkOrderActions({
  status,
  onApprove,
  onReject,
  onRevise,
  onDownload,
  onEmail,
}: WorkOrderActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={onDownload}>
        <Download className="w-4 h-4 mr-2" />
        Download PDF
      </Button>
      <Button variant="outline" size="sm" onClick={onEmail}>
        <Mail className="w-4 h-4 mr-2" />
        Email
      </Button>
      {status === 'PENDING' && (
        <>
          <Button 
            variant="outline" 
            size="sm"
            className="text-green-600 border-green-600 hover:bg-green-50"
            onClick={onApprove}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-600 border-red-600 hover:bg-red-50"
            onClick={onReject}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </>
      )}
      {status === 'REJECTED' && (
        <Button variant="outline" size="sm" onClick={onRevise}>
          <Edit className="w-4 h-4 mr-2" />
          Revise
        </Button>
      )}
    </div>
  );
}
