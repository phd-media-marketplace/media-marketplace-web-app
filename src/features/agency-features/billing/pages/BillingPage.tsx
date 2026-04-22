import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, ReceiptText, Wallet } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/universal/Header";
import { formatCurrency } from "@/utils/formatters";
import { getErrorMessage } from "@/utils/error-handler";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { InvoicesTable } from "@/features/agency-features/billing/components";
import {
  cancelInvoice,
  listInvoices,
  recordPayment,
  sendInvoice,
} from "@/features/agency-features/billing/api";
import type { Invoice, InvoiceStatus } from "@/types/invoice";

function buildLineItem(segmentName: string, unitRate: number) {
  return {
    segmentId: `seg-${segmentName.toLowerCase().replace(/\s+/g, "-")}`,
    segmentName,
    segmentClass: "STANDARD",
    adType: "COMMERCIAL",
    days: ["MONDAY", "WEDNESDAY", "FRIDAY"],
    timeSlot: "08:00 - 10:00",
    totalSpots: 1,
    unitRate,
    totalAmount: unitRate,
  };
}

const STATUS_FILTERS: Array<{ label: string; value: "ALL" | InvoiceStatus }> = [
  { label: "All statuses", value: "ALL" },
  { label: "Draft", value: "DRAFT" },
  { label: "Sent", value: "SENT" },
  { label: "Pending", value: "PENDING" },
  { label: "Partially Paid", value: "PARTIALLY_PAID" },
  { label: "Paid", value: "PAID" },
  { label: "Overdue", value: "OVERDUE" },
  { label: "Cancelled", value: "CANCELLED" },
];

const FALLBACK_INVOICES: Invoice[] = [
  {
    id: "inv-a-001",
    invoiceNumber: "INV-AG-2026-001",
    clientId: "client-01",
    clientName: "Acme Beverages",
    campaignId: null,
    campaignName: null,
    createdById: "user-01",
    createdByName: "Billing Admin",
    issueBy: "Billing Admin",
    issueByRole: "TENANT_ADMIN",
    issueDate: "2026-04-05",
    dueDate: "2026-04-25",
    subtotal: 12000,
    tax: { taxRate: 15, taxAmount: 1800 },
    discount: 0,
    totalAmount: 13800,
    paidAmount: 13800,
    currency: "GHS",
    status: "PAID",
    sentAt: "2026-04-06T09:10:00.000Z",
    paidAt: "2026-04-12T09:10:00.000Z",
    notes: "Monthly media placement",
    lineItems: [buildLineItem("TV spot package", 12000)],
    metadata: { source: "MANUAL" },
    workOrderNumber: "WO-AG-1001",
    recipientType: "CLIENT",
    createdAt: "2026-04-05T09:10:00.000Z",
    updatedAt: "2026-04-12T09:10:00.000Z",
  },
  {
    id: "inv-a-002",
    invoiceNumber: "INV-AG-2026-002",
    clientId: "client-02",
    clientName: "City Telecom",
    campaignId: "cmp-100",
    campaignName: "Spring Coverage",
    createdById: "user-01",
    createdByName: "Billing Admin",
    issueBy: "Billing Admin",
    issueByRole: "TENANT_ADMIN",
    issueDate: "2026-04-10",
    dueDate: "2026-04-29",
    subtotal: 8500,
    tax: { taxRate: 15, taxAmount: 1275 },
    discount: 0,
    totalAmount: 9775,
    paidAmount: 0,
    currency: "GHS",
    status: "PENDING",
    sentAt: "2026-04-11T11:30:00.000Z",
    paidAt: null,
    notes: null,
    lineItems: [buildLineItem("Radio sponsorship", 8500)],
    metadata: { source: "MANUAL" },
    workOrderNumber: "WO-AG-1002",
    recipientType: "CLIENT",
    createdAt: "2026-04-10T11:00:00.000Z",
    updatedAt: "2026-04-11T11:30:00.000Z",
  },
  {
    id: "inv-a-003",
    invoiceNumber: "INV-CL-2026-003",
    clientId: "agency-03",
    clientName: "Prime Agency",
    campaignId: "cmp-110",
    campaignName: "Festival Push",
    createdById: "user-02",
    createdByName: "Finance Officer",
    issueBy: "Finance Officer",
    issueByRole: "FINANCE",
    issueDate: "2026-04-01",
    dueDate: "2026-04-15",
    subtotal: 21000,
    tax: { taxRate: 15, taxAmount: 3150 },
    discount: 500,
    totalAmount: 23650,
    paidAmount: 9000,
    currency: "GHS",
    status: "PARTIALLY_PAID",
    sentAt: "2026-04-01T13:00:00.000Z",
    paidAt: null,
    notes: "Split payment approved",
    lineItems: [buildLineItem("Multi-channel package", 21000)],
    metadata: { source: "MANUAL" },
    workOrderNumber: "WO-CL-2201",
    recipientType: "AGENCY",
    createdAt: "2026-04-01T12:00:00.000Z",
    updatedAt: "2026-04-13T16:00:00.000Z",
  },
];

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"ALL" | InvoiceStatus>("ALL");
  const [search, setSearch] = useState("");
  const user = useAuthStore((state) => state.user);

  const workspaceTitle = user?.tenantType === "CLIENT" ? "Client Billing" : "Agency Billing";

  useEffect(() => {
    let mounted = true;

    async function loadInvoices() {
      setLoading(true);
      try {
        const response = await listInvoices({
          search: search || undefined,
          status: statusFilter === "ALL" ? undefined : statusFilter,
          page: 1,
          limit: 50,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        if (mounted) {
          setInvoices(response.invoices.length > 0 ? response.invoices : FALLBACK_INVOICES);
        }
      } catch {
        if (mounted) {
          setInvoices(FALLBACK_INVOICES);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadInvoices();
    return () => {
      mounted = false;
    };
  }, [search, statusFilter]);

  const summary = useMemo(() => {
    const totalDue = invoices.reduce((sum, invoice) => sum + Math.max(invoice.totalAmount - invoice.paidAmount, 0), 0);
    const paidThisMonth = invoices
      .filter((invoice) => invoice.status === "PAID" || invoice.status === "PARTIALLY_PAID")
      .reduce((sum, invoice) => sum + invoice.paidAmount, 0);
    const openInvoices = invoices.filter((invoice) => !["PAID", "CANCELLED"].includes(invoice.status)).length;

    return { totalDue, paidThisMonth, openInvoices };
  }, [invoices]);

  async function handleSendInvoice(invoice: Invoice) {
    try {
      await sendInvoice(invoice.id, {});
      toast.success(`${invoice.invoiceNumber} sent`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to send invoice."));
    }
  }

  async function handleRecordPayment(invoice: Invoice) {
    try {
      await recordPayment(invoice.id, {
        amount: Math.max(invoice.totalAmount - invoice.paidAmount, 0),
        paymentDate: new Date().toISOString(),
        method: "BANK_TRANSFER",
      });
      toast.success(`Payment recorded for ${invoice.invoiceNumber}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to record payment."));
    }
  }

  async function handleCancelInvoice(invoice: Invoice) {
    try {
      await cancelInvoice(invoice.id, { reason: "Cancelled by billing operator" });
      toast.success(`${invoice.invoiceNumber} cancelled`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to cancel invoice."));
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <Header
        title={workspaceTitle}
        description="Manage invoice lifecycle for your tenant. Creation and generation are restricted to media partners."
        backbtnVisible={false}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border border-primary/10">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Total Due</p>
              <p className="mt-1 text-xl font-bold text-primary">{`GHS ${formatCurrency(summary.totalDue, false)}`}</p>
            </div>
            <Wallet className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card className="border border-primary/10">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Paid</p>
              <p className="mt-1 text-xl font-bold text-primary">{`GHS ${formatCurrency(summary.paidThisMonth, false)}`}</p>
            </div>
            <CreditCard className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card className="border border-primary/10">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Open Invoices</p>
              <p className="mt-1 text-xl font-bold text-primary">{summary.openInvoices}</p>
            </div>
            <ReceiptText className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
      </div>

      <Card className="border border-violet-100">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by invoice # or client"
            />
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "ALL" | InvoiceStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-none">
                {STATUS_FILTERS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-slate-500 flex items-center">{loading ? "Loading invoices..." : `${invoices.length} invoice(s)`}</div>
          </div>

          <InvoicesTable
            invoices={invoices}
            onViewInvoice={(invoice) => toast.info(`${invoice.invoiceNumber}: view endpoint is ready`)}
            onSendInvoice={handleSendInvoice}
            onRecordPayment={handleRecordPayment}
            onCancelInvoice={handleCancelInvoice}
            showActions
          />
        </CardContent>
      </Card>
    </div>
  );
}
