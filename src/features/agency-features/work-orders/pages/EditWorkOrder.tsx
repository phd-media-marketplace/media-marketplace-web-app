import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Mail, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { dummyWorkOrders } from "../dummy-data";
import { WorkOrderStatusBanner } from "../components/WorkOrderStatusBanner";
import { WorkOrderInfoCard } from "../components/WorkOrderInfoCard";
import { WorkOrderSegmentsTable } from "../components/WorkOrderSegmentsTable";
import { WorkOrderFinancialSummary } from "../components/WorkOrderFinancialSummary";
import Header from "@/components/universal/Header";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { toast } from "sonner";

export default function EditWorkOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [revisionNote, setRevisionNote] = useState("");

  const workOrder = useMemo(() => dummyWorkOrders.find((wo) => wo.id === id), [id]);

  if (!workOrder) {
    return (
      <div className="flex flex-col items-center justify-center gap-4" style={{ minHeight: 400 }}>
        <h2 className="text-2xl font-semibold text-gray-900">Work Order Not Found</h2>
        <p className="text-gray-500">The work order you're trying to revise does not exist.</p>
        <Button onClick={() => navigate(`/${user?.tenantType?.toLowerCase() || "agency"}/work-orders`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Work Orders
        </Button>
      </div>
    );
  }

  if (workOrder.status === "APPROVED") {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/${user?.tenantType?.toLowerCase() || "agency"}/work-orders/${workOrder.id}`)}
          className="mb-4 text-primary transition-colors duration-100 hover:bg-primary hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Work Order
        </Button>

        <Card className="border border-yellow-200 bg-yellow-50">
          <CardContent className="space-y-3 p-6">
            <div className="text-lg font-semibold text-gray-900">This work order is approved</div>
            <p className="text-sm text-gray-600">
              Approved work orders can be stopped, but they cannot be revised from this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDownload = () => {
    toast.info("Downloading work order PDF...");
  };

  const handleEmail = () => {
    toast.info("Sending work order email...");
  };

  const handleSaveRevision = () => {
    toast.success(`Revision saved for ${workOrder.workOrderNumber}`);
    navigate(`/${user?.tenantType?.toLowerCase() || "agency"}/work-orders/${workOrder.id}`);
  };

  const handleSubmitRevision = () => {
    if (!revisionNote.trim()) {
      toast.error("Please add a revision note before submitting.");
      return;
    }
    toast.success(`Revision submitted for ${workOrder.workOrderNumber}`);
    navigate(`/${user?.tenantType?.toLowerCase() || "agency"}/work-orders/${workOrder.id}`);
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/${user?.tenantType?.toLowerCase() || "agency"}/work-orders/${workOrder.id}`)}
        className="mb-4 text-primary transition-colors duration-100 hover:bg-primary hover:text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Work Order
      </Button>

      <Header
        title={`Revise ${workOrder.workOrderNumber}`}
        description={`${workOrder.header.brandName} • ${workOrder.header.campaignName}`}
        returnTofunc={handleDownload}
        backbtnText="Download"
        backIcon={Download}
        ctaFunc={handleEmail}
        ctaIcon={Mail}
        ctabtnText="Email"
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

      {workOrder.status === "REJECTED" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">Revision Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              placeholder="Describe the changes you made to this work order..."
              className="min-h-32"
            />
            <div className="flex flex-col justify-end gap-3 sm:flex-row">
              <Button variant="outline" onClick={handleSaveRevision}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button onClick={handleSubmitRevision} className="bg-primary text-white hover:bg-primary/90">
                <Send className="mr-2 h-4 w-4" />
                Submit Revision
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}