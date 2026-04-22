import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileText, Wallet, BanknoteX, TrendingUp, BanknoteArrowDown } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/universal/Header";
import { formatCurrency } from "@/utils/formatters";
import { getErrorMessage } from "@/utils/error-handler";
import type { Invoice, InvoiceRecipientType, InvoiceStatus } from "@/types/invoice";
import {
  cancelInvoice,
  createInvoice,
  generateInvoice,
  recordPayment,
  sendInvoice,
} from "@/features/media-partner-features/billing/api";
import { InvoiceCreatePanel, InvoiceFilters, InvoicesTable } from "@/features/media-partner-features/billing/components";
import { buildLineItem, sampleInvoices } from "@/features/media-partner-features/billing/dummy-data";
import SummaryCards from "@/components/universal/SummaryCards";
import type { SummaryCardsProps } from "@/components/universal/SummaryCards";


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

const FALLBACK_INVOICES: Invoice[] = sampleInvoices;

export default function MediaPartnerBillingPage() {
  const navigate = useNavigate();

  // filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | InvoiceStatus>("ALL");
  const [creating, setCreating] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [createPopupOpen, setCreatePopupOpen] = useState(false);

  // Media partner only controls for create/generate.
  const [recipientType, setRecipientType] = useState<InvoiceRecipientType>("AGENCY");
  const [recipientId, setRecipientId] = useState("");
  const [workOrderNumber, setWorkOrderNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const filteredInvoices = useMemo(() => {
    const basedFiltered = FALLBACK_INVOICES.filter((invoice) => {
      if (statusFilter !== "ALL") {
        return invoice.status === statusFilter;
      }

      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesClient = invoice.clientName.toLowerCase().includes(query);
        const matchesInvoiceNumber = invoice.invoiceNumber.toLowerCase().includes(query);

        if (!matchesClient && !matchesInvoiceNumber) {
          return false;
        }
      }

      return true;
    });

    return basedFiltered;
  }, [search, statusFilter]);

  const summary = useMemo(() => {
    const totalInvoiced = filteredInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
    const totalReceived = filteredInvoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0);
    const totalOutstanding = Math.max(totalInvoiced - totalReceived, 0);
    const sentCount = filteredInvoices.filter((invoice) => invoice.status === "SENT").length;

    return {
      totalInvoices: filteredInvoices.length,
      totalInvoiced,
      totalReceived,
      totalOutstanding,
      sentCount,
    };
  }, [filteredInvoices]);

  const billingSummaryCardsData = useMemo<SummaryCardsProps[]>(() => {
    return [
      {
        title: "Total Invoices",
        value: summary.totalInvoices,
        icon: FileText,
        change: '12%',
        trendIcon: TrendingUp,
        footerText: "Matching current filters",
        bgColor: "from-indigo-500 to-blue-700",
      },
      {
        title: "Total Invoiced",
        value: `GHS ${formatCurrency(summary.totalInvoiced, false)}`,
        icon: Wallet,
        footerText: "Gross billed amount",
        change: '12%',
        trendIcon: TrendingUp,
        bgColor: "from-amber-500 to-orange-700",
      },
      {
        title: "Total Received",
        value: `GHS ${formatCurrency(summary.totalReceived, false)}`,
        icon: BanknoteArrowDown,
        footerText: "Payments recorded",
        change: '12%',
        trendIcon: TrendingUp,
        bgColor: "from-emerald-500 to-green-700",
      },
      {
        title: "Outstanding",
        value: `GHS ${formatCurrency(summary.totalOutstanding, false)}`,
        icon: BanknoteX,
        footerText: `${summary.sentCount} sent invoice(s)`,
        change: '12%',
        trendIcon: TrendingUp,
        bgColor: "from-rose-500 to-red-700",
      },
    ];
  }, [summary]);


  async function handleCreateInvoice() {
    setCreating(true);
    try {
      await createInvoice({
        clientId: recipientId,
        workOrderNumber,
        issueDate: new Date().toISOString(),
        dueDate,
        lineItems: [
          buildLineItem(`Manual invoice for ${workOrderNumber}`, Number(amount)),
        ],
        tax: { taxRate: 0, taxAmount: 0 },
        discount: 0,
        currency: "GHS",
        recipientType,
        metadata: { source: "MANUAL" },
      });

      toast.success("Invoice created successfully");
      setRecipientId("");
      setWorkOrderNumber("");
      setAmount("");
      setDueDate("");
      setCreatePopupOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to create invoice."));
    } finally {
      setCreating(false);
    }
  }

  async function handleGenerateInvoice() {
    setGenerating(true);
    try {
      await generateInvoice({
        workOrderNumber,
        dueDate: dueDate || undefined,
        currency: "GHS",
      });
      toast.success("Invoice generated successfully");
      setCreatePopupOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to generate invoice."));
    } finally {
      setGenerating(false);
    }
  }

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
        title="Media Partner Billing"
        description="Create, generate, send, and track invoices across agency and direct clients."
        backbtnVisible={true}
        ctaFunc={() => setCreatePopupOpen(true)}
        ctabtnText="Generate New Invoice"
        ctaIcon={Plus}

      />

      <InvoiceCreatePanel
        open={createPopupOpen}
        onOpenChange={setCreatePopupOpen}
        recipientType={recipientType}
        recipientId={recipientId}
        workOrderNumber={workOrderNumber}
        amount={amount}
        dueDate={dueDate}
        onRecipientTypeChange={setRecipientType}
        onRecipientIdChange={setRecipientId}
        onWorkOrderNumberChange={setWorkOrderNumber}
        onAmountChange={setAmount}
        onDueDateChange={setDueDate}
        onCreateInvoice={handleCreateInvoice}
        onGenerateInvoice={handleGenerateInvoice}
        creating={creating}
        generating={generating}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {billingSummaryCardsData.map((card, index) => (
          <SummaryCards key={index} {...card} />
        ))}
      </div>


      <Card className="border border-violet-100">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <InvoiceFilters
            searchQuery={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            statusOptions={STATUS_FILTERS}
            resultsCount={filteredInvoices.length}
          />

          <InvoicesTable
            invoices={filteredInvoices}
            onViewInvoice={(invoice: Invoice) => navigate(`/media-partner/billing/${invoice.id}`)}
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
