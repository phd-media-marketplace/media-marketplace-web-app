import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Mail, Edit } from "lucide-react";
import { dummyWorkOrders } from "../dummy-data";
import { WorkOrderStatusBanner } from "../components/WorkOrderStatusBanner";
import { WorkOrderInfoCard } from "../components/WorkOrderInfoCard";
import { WorkOrderSegmentsTable } from "../components/WorkOrderSegmentsTable";
import { WorkOrderFinancialSummary } from "../components/WorkOrderFinancialSummary";
import { WorkOrderApprovalDetails } from "../components/WorkOrderApprovalDetails";
import Header from "@/components/universal/Header";
import { useAuthStore } from "@/features/auth/store/auth-store";
import RejectionConfirmationDialogBox from "@/components/universal/RejectionConfirmationDialogBox";
import { toast } from "sonner";

/**
 * ViewWorkOrder Component
 * Displays complete work order details including header info, segments table, and totals.
 */
export default function ViewWorkOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [stopReason, setStopReason] = useState("");

  const workOrder = dummyWorkOrders.find((wo) => wo.id === id);

  if (!workOrder) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">Work Order Not Found</h2>
        <p className="text-gray-500">The work order you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(`/${user?.tenantType?.toLowerCase() || "agency"}/work-orders`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Work Orders
        </Button>
      </div>
    );
  }

  const handleDownload = () => {
    alert("Download PDF functionality (Demo - actual implementation pending)");
  };

  const handleEmail = () => {
    alert("Send Email functionality (Demo - actual implementation pending)");
  };

  const handleRevise = () => {
    navigate(`/${user?.tenantType?.toLowerCase() || "agency"}/work-orders/${workOrder.id}/edit`);
  };

  const handleStopOrder = () => {
    if (!stopReason.trim()) return;
    toast.success(`Stop order submitted for ${workOrder.workOrderNumber}`);
    setShowStopDialog(false);
    setStopReason("");
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/${user?.tenantType?.toLowerCase() || "agency"}/work-orders`)}
        className="mb-4 text-primary transition-colors duration-100 hover:bg-primary hover:text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Work Orders
      </Button>

      <Header
        title={workOrder.workOrderNumber}
        description={`${workOrder.header.brandName} • ${workOrder.header.campaignName}`}
        returnTofunc={handleDownload}
        backbtnText="Download"
        backIcon={Download}
        ctaFunc={workOrder.status === "REJECTED" ? handleRevise : handleEmail}
        ctaIcon={workOrder.status === "REJECTED" ? Edit : Mail}
        ctabtnText={workOrder.status === "REJECTED" ? "Revise" : "Email"}
      />

      <WorkOrderStatusBanner
        status={workOrder.status}
        approvalDate={workOrder.approvalDate}
        approvedBy={workOrder.approvedBy}
        rejectionReason={workOrder.rejectionReason}
      />

      <WorkOrderInfoCard
        header={workOrder.header}
        mediaPartnerName={workOrder.mediaPartnerName}
        channelName={workOrder.channelName}
        preparedBy={workOrder.preparedBy}
        preparedByTitle={workOrder.preparedByTitle}
      />

      <WorkOrderSegmentsTable segments={workOrder.segments} />

      <WorkOrderFinancialSummary
        subtotal={workOrder.subtotal}
        tax={workOrder.tax}
        totalAmount={workOrder.totalAmount}
      />

      {workOrder.status === "APPROVED" && (
        <WorkOrderApprovalDetails
          approvedBy={workOrder.approvedBy}
          approvedByTitle={workOrder.approvedByTitle}
          approvalDate={workOrder.approvalDate}
        />
      )}

      {workOrder.status === "APPROVED" && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50"
            onClick={() => setShowStopDialog(true)}
          >
            Stop Order
          </Button>
        </div>
      )}

      <RejectionConfirmationDialogBox
        open={showStopDialog}
        onOpenChange={setShowStopDialog}
        title="Stop Order"
        description={
          <>
            Provide a reason for stopping work order <strong>{workOrder.workOrderNumber}</strong>. The media partner will be notified.
          </>
        }
        content={{
          contentLabel: "Stop Order Reason",
          contentPlaceholder: "Enter the reason for stopping this work order...",
          contentValue: stopReason,
          setContentValue: setStopReason,
        }}
        confirmText="Confirm Stop Order"
        cancelText="Cancel"
        onConfirm={handleStopOrder}
        confirmVariant="destructive"
      />
    </div>
  );
}
