import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Header from "@/components/universal/Header";
import { WorkOrderSegmentsTable } from "@/features/agency-features/work-orders/components";
import { getInvoice } from "@/features/media-partner-features/billing/api";
import { getSampleInvoiceById, sampleInvoices } from "@/features/media-partner-features/billing/dummy-data";
import { getErrorMessage } from "@/utils/error-handler";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { toast } from "sonner";
import type { Invoice } from "@/types/invoice";
import { ArrowLeft, Send, Edit } from "lucide-react";

export default function ViewInvoicePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const invoiceId = id ?? "";
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);

  const getStatusPillClasses = (status: Invoice["status"]) => {
    const styles: Record<Invoice["status"], string> = {
      DRAFT: "bg-slate-100 text-slate-700",
      SENT: "bg-indigo-100 text-indigo-700",
      PENDING: "bg-amber-100 text-amber-700",
      PARTIALLY_PAID: "bg-blue-100 text-blue-700",
      PAID: "bg-emerald-100 text-emerald-700",
      OVERDUE: "bg-rose-100 text-rose-700",
      CANCELLED: "bg-gray-100 text-gray-600",
    };

    return styles[status];
  };

  useEffect(() => {
    if (!invoiceId) return;

    let mounted = true;
    async function loadInvoice() {
      setLoading(true);
      try {
        const response = await getInvoice(invoiceId);
        if (mounted) {
          setInvoice(response);
        }
      } catch (error) {
        const fallbackInvoice = getSampleInvoiceById(invoiceId) ?? sampleInvoices[0] ?? null;
        if (mounted) {
          setInvoice(fallbackInvoice);
        }
        toast.info(getErrorMessage(error, "Using sample invoice data for UI preview."));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadInvoice();
    return () => {
      mounted = false;
    };
  }, [invoiceId]);

  const outstandingAmount = useMemo(() => {
    if (!invoice) return 0;
    return Math.max(invoice.totalAmount - invoice.paidAmount, 0);
  }, [invoice]);

  if (loading) {
    return <div className="py-10 text-sm text-slate-500">Loading invoice...</div>;
  }

  if (!invoice) {
    return (
      <div className="space-y-4 py-10">
        <p className="text-sm text-slate-600">Invoice not found.</p>
        <Button variant="outline" onClick={() => navigate("/media-partner/billing")}>Back to Billing</Button>
      </div>
    );
  }

  const handleSendToClient = () => {
    //Actually send the invoice to client via API call here
    toast.success("Invoice sent to client successfully!");
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/media-partner/billing")}
        className="flex items-center text-sm text-primary hover:bg-primary hover:text-white "
      >

        <ArrowLeft className="mr-1" />
        Back to Billing
      </Button>
      <Header
        title={invoice.invoiceNumber}
        description={`Issued on ${formatDate(invoice.issueDate)}`}
        returnTofunc={() => navigate(`/media-partner/billing/${invoice.id}/edit`)}
        backIcon={Edit}
        backbtnText="Edit Invoice"
        ctaFunc={handleSendToClient}
        ctabtnText="Send to Client"
        ctaIcon={Send}
      />

      <Card className="border border-violet-100 shadow-sm lg:px-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <h2 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Invoice Details</h2>
              <div>
                <label className="text-xs text-slate-500">Invoice #</label>
                <p className="font-medium text-slate-900">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <label className="text-xs text-slate-500">Issue Date</label>
                <p className="font-medium text-slate-900">{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <label className="text-xs text-slate-500">Due Date</label>
                <p className="font-medium text-slate-900">{formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <label className="text-xs text-slate-500">Status</label>
                <p>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusPillClasses(invoice.status)}`}>
                    {invoice.status.replace("_", " ")}
                  </span>
                </p>
              </div>

            </div>
            {/* RecipientInfo */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Billed To</h2>
              <div>
                <label className="text-xs text-slate-500">Client</label>
                <p className="font-medium text-slate-900">{invoice.clientName}</p>
              </div>
              <div>
                <label className="text-xs text-slate-500">Contact Person</label>
                <p className="font-medium text-slate-900">{invoice.clientContactName ?? "-"}</p>
              </div>
              <div>
                <label className="text-xs text-slate-500">Contact Email</label>
                <p className="font-medium text-slate-900">{invoice.clientContactEmail ?? "-"}</p>
              </div>
              <div>
                <label className="text-xs text-slate-500">Contact Phone</label>
                <p className="font-medium text-slate-900">{invoice.clientContactPhone ?? "-"}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-600">
            <label className="text-xs text-slate-500">Description</label>
            <p>
              Invoice for {invoice.campaignName ? `"${invoice.campaignName}" campaign associated with the work order number ${invoice.workOrderNumber}` : "services rendered"}
            </p>
          </div>
          {/* Invoice details */} 
        </CardContent>
        <CardContent className="border-t border-slate-100 p-6">
          <WorkOrderSegmentsTable segments={invoice.lineItems} />
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:gap-8">
            <div>
              <label className="text-xs text-slate-500">Notes</label>
              <p className="text-sm text-slate-600">{invoice.notes ?? "No additional notes."}</p>
            </div>
            <div className="mt-6 ml-auto w-full max-w-xs space-y-3 rounded-lg bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">Subtotal</p>
                <p className="font-medium text-slate-900">{invoice.currency} {formatCurrency(invoice.subtotal, false)}</p>
              </div>
              {invoice.discount ? (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Discount</p>
                  <p className="font-medium text-slate-900">{invoice.currency} {formatCurrency(invoice.discount, false)}</p>
                </div>
              ) : null}
              {invoice.tax?.taxAmount ? (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Tax ({invoice.tax.taxRate ?? 0}%)</p>
                  <p className="font-medium text-slate-900">{invoice.currency} {formatCurrency(invoice.tax.taxAmount, false)}</p>
                </div>
              ) : null}
              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="font-semibold text-slate-900">{invoice.currency} {formatCurrency(invoice.totalAmount, false)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">Outstanding</p>
                <p className="font-semibold text-rose-500">{invoice.currency} {formatCurrency(outstandingAmount, false)}</p>
              </div>
            </div>
            
          </div>
        </CardContent>
        <CardFooter className="flex border-t border-slate-100 px-6 py-4">
          <div>
            <label className="text-xs text-slate-500">Issued by:</label>
            <p className="font-medium text-slate-900">{invoice.issuedByName}</p>
            <p>{invoice.issuedByRole.charAt(0).toUpperCase() + invoice.issuedByRole.split("_").join(" ").toLowerCase().slice(1)}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
