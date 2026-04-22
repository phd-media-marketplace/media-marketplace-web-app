import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState } from "react";
import type { WorkOrder } from "@/features/agency-features/work-orders/types";
import RejectionConfirmationDialogBox from "@/components/universal/RejectionConfirmationDialogBox";
import ApprovalConfirmationDialogBox from "@/components/universal/ApprovalConfirmationDialogBox";

interface MediaPartnerWorkOrderActionsProps {
  workOrder: WorkOrder;
  onApprove: (workOrderId: string) => void;
  onReject: (workOrderId: string, reason: string) => void;
}

/**
 * MediaPartnerWorkOrderActions Component
 * Accept/Reject actions for work orders (media partner only)
 */
export function MediaPartnerWorkOrderActions({
  workOrder,
  onApprove,
  onReject,
}: MediaPartnerWorkOrderActionsProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Only show actions for PENDING or REVISED work orders
  if (workOrder.status !== 'PENDING' && workOrder.status !== 'REVISED') {
    return null;
  }

  const handleApprove = () => {
    onApprove(workOrder.id);
    setShowApproveDialog(false);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      return;
    }
    onReject(workOrder.id, rejectionReason);
    setShowRejectDialog(false);
    setRejectionReason("");
  };

  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        className="border-red-500 text-red-600 hover:bg-red-50"
        onClick={() => setShowRejectDialog(true)}
      >
        <X className="w-4 h-4 mr-2" />
        Reject Work Order
      </Button>

      <Button
        className="bg-green-600 hover:bg-green-700 text-white"
        onClick={() => setShowApproveDialog(true)}
      >
        <Check className="w-4 h-4 mr-2" />
        Approve Work Order
      </Button>

      {/* Approve Confirmation Dialog */}
      <ApprovalConfirmationDialogBox
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        title="Approve Work Order"
        description={
          <>
            Are you sure you want to approve work order <strong>{workOrder.workOrderNumber}</strong>? This action will notify the {workOrder.header.clientType === "AGENCY" ? "agency" : "client"}.
          </>
        }
        confirmText="Confirm Approval"
        cancelText="Cancel"
        onConfirm={handleApprove}
      />

      {/* Reject Confirmation Dialog */}
      <RejectionConfirmationDialogBox
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        title="Reject Work Order"
        description={
          <>Please provide a reason for rejecting work order <strong>{workOrder.workOrderNumber}</strong>. The {workOrder.header.clientType === 'AGENCY' ? 'agency' : 'client'} will be notified.</>
        }
        content={{
          contentLabel: "Rejection Reason",
          contentPlaceholder: "Enter the reason for rejection...",
          contentValue: rejectionReason,
          setContentValue: setRejectionReason
        }}
        confirmText="Confirm Rejection"
        cancelText="Cancel"
        onConfirm={handleReject}
        confirmVariant="destructive"
      />
    </div>
  );
}
