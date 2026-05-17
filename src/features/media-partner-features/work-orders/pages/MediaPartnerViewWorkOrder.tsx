import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Send } from "lucide-react";
import { MediaPartnerWorkOrderActions } from "../components";
import {
  WorkOrderStatusBanner,
  WorkOrderInfoCard,
  WorkOrderSegmentsTable,
  WorkOrderFinancialSummary,
  WorkOrderApprovalDetails,
} from "@/features/agency-features/work-orders/components";
import { toast } from "sonner";
import Header from "@/components/universal/Header";
import { generateInvoice, listInvoices } from "@/features/media-partner-features/billing/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { respondToWorkOrder, getMediaPartnerWorkOrder } from "../api";
import Loader from "@/components/universal/Loader";
import LoadingError from "@/components/universal/LoadingError";
import InvalidID from "@/components/universal/InvalidID";

/**
 * MediaPartnerViewWorkOrder Component
 * Detailed view of a work order for media partner with approve/reject actions
 */
export default function MediaPartnerViewWorkOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoiceCheckLoading, setInvoiceCheckLoading] = useState(false);
  const [invoiceGenerating, setInvoiceGenerating] = useState(false);
  const [generatedInvoiceId, setGeneratedInvoiceId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch the work order by ID from API
  const workOrderQuery = useQuery({
    queryKey: ['media-partner-work-order', id],
    queryFn: () => getMediaPartnerWorkOrder(id || ''),
    enabled: !!id,
  });

  const workOrder = workOrderQuery.data;

  // Define mutation before any conditional returns (React Hooks Rule)
  const workOrderResponseMutation = useMutation({
    mutationFn: ({ accepted, rejectionReason }: { accepted: boolean; rejectionReason?: string }) => 
      respondToWorkOrder(workOrder?.id || '', accepted, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-partner-work-orders"] });
    },
    onError: (error) => {
      toast.error("An error occurred while responding to the work order. Please try again.");
      console.error("Error responding to work order:", error);
    }
  });

  useEffect(() => {
    if (!workOrder || workOrder.status !== "APPROVED") return;
    const workOrderNumber = workOrder.workOrderNumber;

    let mounted = true;

    async function checkExistingInvoice() {
      setInvoiceCheckLoading(true);
      try {
        const response = await listInvoices({
          search: workOrderNumber,
          page: 1,
          limit: 20,
        });

        if (!mounted) return;
        const existing = response.invoices.find((invoice) => invoice.workOrderNumber === workOrderNumber);
        setGeneratedInvoiceId(existing?.id ?? null);
      } catch {
        if (mounted) {
          setGeneratedInvoiceId(null);
        }
      } finally {
        if (mounted) {
          setInvoiceCheckLoading(false);
        }
      }
    }

    checkExistingInvoice();

    return () => {
      mounted = false;
    };
  }, [workOrder]);

  if(!id) {
    return (
      <InvalidID
        title="Invalid Work Order ID"
        message="The provided work order ID is invalid."
        btnText="Back to Work Orders"
        redirectPath="/media-partner/work-orders"
      />
    );
  }

  // Show loading state
  if (workOrderQuery.isLoading) {
    return <Loader
      message="Loading work order details..."
      className="min-h-100"

     />;
  }

  // Show error state
  if (workOrderQuery.isError) {
    return (
      <LoadingError
        message="Failed to load work order"
        onRetry={() => workOrderQuery.refetch()}
        OnReturn={() => navigate("/media-partner/work-orders")}
        returnBtnText="Back to Work Orders"
      />
    );
  }

  // Show not found state
  if (!workOrder) {
    return (
      <InvalidID
        title="Work Order Not Found"
        message="The requested work order does not exist."
        btnText="Back to Work Orders"
        redirectPath="/media-partner/work-orders"
      />
    );
  }

  const handleApprove = () => {
    workOrderResponseMutation.mutate({ accepted: true });
  };

  const handleReject = (reason: string) => {
    workOrderResponseMutation.mutate({ accepted: false, rejectionReason: reason });
  };

  const handleDownload = () => {
    // TODO: Download work order PDF
    toast.info('Downloading work order PDF...');
  };

  const handleSendEmail = () => {
    // TODO: Send work order via email
    toast.info('Sending work order via email...');
  };

  async function handleGenerateInvoice() {
    if (!workOrder) return;

    setInvoiceGenerating(true);
    try {
      const invoice = await generateInvoice({
        workOrderNumber: workOrder.workOrderNumber,
        currency: "GHS",
      });

      setGeneratedInvoiceId(invoice.id);
      toast.success(`Invoice ${invoice.invoiceNumber} generated`);
    } catch {
      toast.error("Unable to generate invoice for this work order.");
    } finally {
      setInvoiceGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => navigate('/media-partner/work-orders')}
        className="mb-4 text-primary hover:bg-primary hover:text-white transition-colors duration-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Work Orders
      </Button>
      <Header
        title={workOrder.workOrderNumber}
        description={`${workOrder.header.brandName} • ${workOrder.header.campaignName}`}
        returnTofunc={handleDownload}
        backbtnText="Download PDF"
        backIcon={Download}
        ctaFunc={handleSendEmail}
        ctabtnText="Email"
        ctaIcon={Send}
      />
      <div className="space-y-4 lg:space-y-6 p-6 bg-white rounded-lg shadow">
        {/* Status Banner */}
        <WorkOrderStatusBanner 
          status={workOrder.status}
          rejectionReason={workOrder.rejectionReason}
        />


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
        {/* Action Buttons for Pending/Revised Orders */}
      </div>

      {(workOrder.status === 'PENDING' || workOrder.status === 'REVISED') && (
        <div className="flex justify-end">
          <MediaPartnerWorkOrderActions
            workOrder={workOrder}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      )}

      {workOrder.status === "APPROVED" && (
        <div className="flex justify-end">
          {invoiceCheckLoading ? (
            <p className="text-sm text-slate-500">Checking invoice status...</p>
          ) : generatedInvoiceId ? (
            <Button variant="outline" onClick={() => navigate(`/media-partner/billing/${generatedInvoiceId}`)}>
              View Generated Invoice
            </Button>
          ) : (
            <Button
              className="bg-primary text-white hover:bg-primary/90"
              onClick={handleGenerateInvoice}
              disabled={invoiceGenerating}
            >
              {invoiceGenerating ? "Generating..." : "Generate Invoice"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
