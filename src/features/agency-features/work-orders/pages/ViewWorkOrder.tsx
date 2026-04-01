import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { dummyWorkOrders } from "../dummy-data";
import { WorkOrderStatusBanner } from "../components/WorkOrderStatusBanner";
import { WorkOrderActions } from "../components/WorkOrderActions";
import { WorkOrderInfoCard } from "../components/WorkOrderInfoCard";
import { WorkOrderSegmentsTable } from "../components/WorkOrderSegmentsTable";
import { WorkOrderFinancialSummary } from "../components/WorkOrderFinancialSummary";
import { WorkOrderApprovalDetails } from "../components/WorkOrderApprovalDetails";

/**
 * ViewWorkOrder Component
 * Displays complete work order details including header info, segments table, and totals
 * Allows media partners to approve/reject work orders
 */
export default function ViewWorkOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the work order by ID
  const workOrder = dummyWorkOrders.find(wo => wo.id === id);

  if (!workOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">Work Order Not Found</h2>
        <p className="text-gray-500">The work order you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/agency/work-orders')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Work Orders
        </Button>
      </div>
    );
  }

  // Handle approve work order
  const handleApprove = () => {
    // TODO: Implement actual API call
    alert('Work Order Approved! (Demo - actual implementation pending)');
  };

  // Handle reject work order
  const handleReject = () => {
    // TODO: Implement actual API call with rejection reason dialog
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      alert(`Work Order Rejected with reason: ${reason}\n(Demo - actual implementation pending)`);
    }
  };

  // Handle download PDF
  const handleDownload = () => {
    alert('Download PDF functionality (Demo - actual implementation pending)');
  };

  // Handle send email
  const handleEmail = () => {
    alert('Send Email functionality (Demo - actual implementation pending)');
  };

  // Handle revise work order
  const handleRevise = () => {
    alert('Revise Work Order functionality (Demo - actual implementation pending)');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/agency/work-orders')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">
              {workOrder.workOrderNumber}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Work Order Details
            </p>
          </div>
        </div>
        
        <WorkOrderActions
          status={workOrder.status}
          onApprove={handleApprove}
          onReject={handleReject}
          onRevise={handleRevise}
          onDownload={handleDownload}
          onEmail={handleEmail}
        />
      </div>

      {/* Status Banner */}
      <WorkOrderStatusBanner
        status={workOrder.status}
        approvalDate={workOrder.approvalDate}
        approvedBy={workOrder.approvedBy}
        rejectionReason={workOrder.rejectionReason}
      />

      {/* Work Order Header Information */}
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

      {/* Approval Section */}
      {workOrder.status === 'APPROVED' && (
        <WorkOrderApprovalDetails
          approvedBy={workOrder.approvedBy}
          approvedByTitle={workOrder.approvedByTitle}
          approvalDate={workOrder.approvalDate}
        />
      )}
    </div>
  );
}
