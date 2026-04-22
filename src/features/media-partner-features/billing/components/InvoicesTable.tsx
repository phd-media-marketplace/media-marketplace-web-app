import { DataTable } from "@/components/universal/DataTable";
import type { UniversalDataTableColumn } from "@/components/universal/DataTable";
import { Button } from "@/components/ui/button";
import { Eye, Send, Wallet, XCircle, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { useMemo } from "react";
import type { Invoice, InvoiceStatus } from "@/types/invoice";
import { formatCurrency, formatDate } from "@/utils/formatters";
import NoDataCard from "@/components/universal/NoDataCard";

interface InvoicesTableProps {
  invoices: Invoice[];
  onViewInvoice?: (invoice: Invoice) => void;
  onSendInvoice?: (invoice: Invoice) => void;
  onRecordPayment?: (invoice: Invoice) => void;
  onCancelInvoice?: (invoice: Invoice) => void;
  showActions?: boolean;
}

function getStatusPillClasses(status: InvoiceStatus): string {
  const styles: Record<InvoiceStatus, string> = {
    DRAFT: "bg-slate-100 text-slate-700",
    SENT: "bg-indigo-100 text-indigo-700",
    PENDING: "bg-amber-100 text-amber-700",
    PARTIALLY_PAID: "bg-blue-100 text-blue-700",
    PAID: "bg-emerald-100 text-emerald-700",
    OVERDUE: "bg-rose-100 text-rose-700",
    CANCELLED: "bg-gray-100 text-gray-600",
  };

  return styles[status];
}

function formatStatus(status: InvoiceStatus): string {
  return status.replace("_", " ");
}

export function InvoicesTable({
  invoices,
  onViewInvoice,
  onSendInvoice,
  onRecordPayment,
  onCancelInvoice,
  showActions = true,
}: InvoicesTableProps) {
  const columns = useMemo<UniversalDataTableColumn<Invoice>[]>(() => {
    const baseColumns: UniversalDataTableColumn<Invoice>[] = [
      {
        id: "invoiceNumber",
        header: "Invoice #",
        accessor: "invoiceNumber",
        widthPx: 140,
        minWidthPx: 140,
        sticky: true,
        cellClassName: "font-medium text-slate-900",
      },
      {
        id: "clientName",
        header: "Client",
        accessor: "clientName",
        widthPx: 170,
        minWidthPx: 170,
        cellClassName: "font-medium text-slate-800",
      },
      {
        id: "clientEmail",
        header: "Client Email",
        accessor: "clientContactEmail",
        widthPx: 190,
        minWidthPx: 190,
        cellClassName: "text-slate-600",
      },
      {
        id: "issueDate",
        header: "Issue Date",
        cell: (invoice) => formatDate(invoice.issueDate),
        widthPx: 110,
        minWidthPx: 110,
        cellClassName: "text-slate-600",
      },
      {
        id: "dueDate",
        header: "Due Date",
        cell: (invoice) => formatDate(invoice.dueDate),
        widthPx: 110,
        minWidthPx: 110,
        cellClassName: "text-slate-600",
      },
      {
        id: "totalAmount",
        header: "Total",
        cell: (invoice) => `${invoice.currency} ${formatCurrency(invoice.totalAmount, false)}`,
        widthPx: 150,
        minWidthPx: 150,
        cellClassName: "font-semibold text-slate-900",
      },
      {
        id: "paidAmount",
        header: "Paid",
        cell: (invoice) => `${invoice.currency} ${formatCurrency(invoice.paidAmount, false)}`,
        widthPx: 150,
        minWidthPx: 150,
        cellClassName: "text-emerald-700 font-medium",
      },
      {
        id: "status",
        header: "Status",
        cell: (invoice) => (
          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusPillClasses(invoice.status)}`}>
            {formatStatus(invoice.status)}
          </span>
        ),
        widthPx: 110,
        minWidthPx: 110,
      },
    ];

    if (!showActions) {
      return baseColumns;
    }

    return [
      ...baseColumns,
      {
        id: "actions",
        header: "Actions",
        headerAlign: "center",
        align: "center",
        widthPx: 170,
        minWidthPx: 170,
        cell: (invoice) => (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-600 hover:bg-primary/10 hover:text-primary"
              onClick={() => onViewInvoice?.(invoice)}
              aria-label={`View ${invoice.invoiceNumber}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-600 hover:bg-primary/10 hover:text-primary"
              onClick={() => onSendInvoice?.(invoice)}
              aria-label={`Send ${invoice.invoiceNumber}`}
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-600 hover:bg-primary/10 hover:text-primary"
              onClick={() => onRecordPayment?.(invoice)}
              aria-label={`Record payment for ${invoice.invoiceNumber}`}
            >
              <Wallet className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-600 hover:bg-rose-100 hover:text-rose-600"
              onClick={() => onCancelInvoice?.(invoice)}
              aria-label={`Cancel ${invoice.invoiceNumber}`}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ];
  }, [onCancelInvoice, onRecordPayment, onSendInvoice, onViewInvoice, showActions]);

  return (
    <div>
      <DataTable
        rows={invoices}
        columns={columns}
        rowKey={(invoice) => invoice.id}
        containerClassName="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        minTableWidthClassName="min-w-240"
        emptyState={
          <NoDataCard
            title="No Invoices"
            message ="There are no invoices found matching your filter(s)."
          />
        }
        footerSlot={
          <div className="flex items-center justify-end gap-1 border-t border-slate-200 px-4 py-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" aria-label="First page">
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" aria-label="Previous page">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600" aria-label="Next page">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600" aria-label="Last page">
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />
    </div>
  );
}
