import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";
import { useState } from "react";
import type { WorkOrder } from "@/features/agency-features/work-orders/types";

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
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Approve Work Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve work order <strong>{workOrder.workOrderNumber}</strong>?
              This action will notify the {workOrder.header.clientType === 'AGENCY' ? 'agency' : 'client'}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleApprove}
            >
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Reject Work Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting work order <strong>{workOrder.workOrderNumber}</strong>.
              The {workOrder.header.clientType === 'AGENCY' ? 'agency' : 'client'} will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Rejection Reason *
            </label>
            <Textarea
              placeholder="Enter the reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
