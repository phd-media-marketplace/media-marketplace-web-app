import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Mail } from "lucide-react";
import { MediaPartnerWorkOrderActions } from "../components";
import {
  WorkOrderStatusBanner,
  WorkOrderInfoCard,
  WorkOrderSegmentsTable,
  WorkOrderFinancialSummary,
  WorkOrderApprovalDetails,
} from "@/features/agency-features/work-orders/components";
import { dummyWorkOrders } from "@/features/agency-features/work-orders/dummy-data";
import { toast } from "sonner";

/**
 * MediaPartnerViewWorkOrder Component
 * Detailed view of a work order for media partner with approve/reject actions
 */
export default function MediaPartnerViewWorkOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the work order by ID
  const workOrder = dummyWorkOrders.find(wo => wo.id === id);

  if (!workOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">Work Order Not Found</h2>
        <p className="text-gray-500">The work order you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/media-partner/work-orders')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Work Orders
        </Button>
      </div>
    );
  }

  const handleApprove = (workOrderId: string) => {
    // TODO: Call API to approve work order
    toast.success(`Work Order ${workOrder.workOrderNumber} approved successfully!`);
    console.log('Approving work order:', workOrderId);
  };

  const handleReject = (workOrderId: string, reason: string) => {
    // TODO: Call API to reject work order with reason
    toast.error(`Work Order ${workOrder.workOrderNumber} rejected.`);
    console.log('Rejecting work order:', workOrderId, 'Reason:', reason);
  };

  const handleDownload = () => {
    // TODO: Download work order PDF
    toast.info('Downloading work order PDF...');
  };

  const handleSendEmail = () => {
    // TODO: Send work order via email
    toast.info('Sending work order via email...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/media-partner/work-orders')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Work Orders
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">
              {workOrder.workOrderNumber}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {workOrder.header.brandName} • {workOrder.header.campaignName}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleSendEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      <WorkOrderStatusBanner 
        status={workOrder.status}
        rejectionReason={workOrder.rejectionReason}
      />

      {/* Action Buttons for Pending/Revised Orders */}
      {(workOrder.status === 'PENDING' || workOrder.status === 'REVISED') && (
        <div className="flex justify-end">
          <MediaPartnerWorkOrderActions
            workOrder={workOrder}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      )}

      {/* Work Order Information */}
      <WorkOrderInfoCard
        header={workOrder.header}
        mediaPartnerName={workOrder.mediaPartnerName}
        channelName={workOrder.channelName}
        preparedBy={workOrder.preparedBy}
        preparedByTitle={workOrder.preparedByTitle}
      />

      {/* Segments Table */}
      <WorkOrderSegmentsTable segments={workOrder.segments} />

      {/* Financial Summary */}
      <WorkOrderFinancialSummary
        subtotal={workOrder.subtotal}
        tax={workOrder.tax}
        totalAmount={workOrder.totalAmount}
      />

      {/* Approval Details (if approved) */}
      {workOrder.status === 'APPROVED' && workOrder.approvedBy && (
        <WorkOrderApprovalDetails
          approvedBy={workOrder.approvedBy}
          approvedByTitle={workOrder.approvedByTitle || ''}
          approvalDate={workOrder.approvalDate || ''}
        />
      )}
    </div>
  );
}
