import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";
import { ReceiptText, Send, Wallet } from "lucide-react";

type RecipientType = "AGENCY" | "CLIENT";
type InvoiceStatus = "PAID" | "PENDING" | "OVERDUE";

type Invoice = {
  id: string;
  recipientName: string;
  recipientType: RecipientType;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
};

const invoices: Invoice[] = [
  { id: "INV-MP-001", recipientName: "Nova Agency", recipientType: "AGENCY", amount: 38000, dueDate: "2026-04-22", status: "PAID" },
  { id: "INV-MP-002", recipientName: "City Consumer Co", recipientType: "CLIENT", amount: 22000, dueDate: "2026-04-25", status: "PENDING" },
  { id: "INV-MP-003", recipientName: "Prime Agency", recipientType: "AGENCY", amount: 46000, dueDate: "2026-04-10", status: "OVERDUE" },
  { id: "INV-MP-004", recipientName: "Vista Retail", recipientType: "CLIENT", amount: 17500, dueDate: "2026-04-28", status: "PENDING" },
];

function formatCurrency(value: number): string {
  return `GHc ${value.toLocaleString()}`;
}

export default function MediaPartnerBillingPage() {
  const [recipientType, setRecipientType] = useState<"ALL" | RecipientType>("ALL");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");

  const filteredInvoices = useMemo(() => {
    if (recipientType === "ALL") return invoices;
    return invoices.filter((invoice) => invoice.recipientType === recipientType);
  }, [recipientType]);

  const summary = useMemo(() => {
    const totalInvoiced = filteredInvoices.reduce((sum, item) => sum + item.amount, 0);
    const totalReceived = filteredInvoices
      .filter((item) => item.status === "PAID")
      .reduce((sum, item) => sum + item.amount, 0);
    const totalOutstanding = filteredInvoices
      .filter((item) => item.status !== "PAID")
      .reduce((sum, item) => sum + item.amount, 0);
    return { totalInvoiced, totalReceived, totalOutstanding };
  }, [filteredInvoices]);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Billing</h2>
        <p className="mt-1 text-sm text-gray-500">Send invoices to agencies/clients and monitor receivables.</p>
      </div>

      <Card className="border border-violet-100">
        <CardHeader>
          <CardTitle className="text-primary">Send Invoice</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Recipient name" className="input-field" />
          <Select value={recipientType} onValueChange={(value) => setRecipientType(value as "ALL" | RecipientType)}>
            <SelectTrigger className="w-full input-field"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-white border-none">
              <SelectItem value="ALL">All recipient types</SelectItem>
              <SelectItem value="AGENCY">Agency</SelectItem>
              <SelectItem value="CLIENT">Client</SelectItem>
            </SelectContent>
          </Select>
          <Input value={invoiceAmount} onChange={(e) => setInvoiceAmount(e.target.value)} placeholder="Amount" type="number" className="input-field" />
          <Button className="bg-primary text-white hover:bg-primary/90">
            <Send className="mr-2 h-4 w-4" />
            Send Invoice
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border border-primary/10"><CardContent className="p-4"><p className="text-xs text-gray-500">Total Invoiced</p><p className="mt-1 text-xl font-bold text-primary">{formatCurrency(summary.totalInvoiced)}</p><ReceiptText className="mt-2 h-4 w-4 text-primary" /></CardContent></Card>
        <Card className="border border-primary/10"><CardContent className="p-4"><p className="text-xs text-gray-500">Total Received</p><p className="mt-1 text-xl font-bold text-green-700">{formatCurrency(summary.totalReceived)}</p><Wallet className="mt-2 h-4 w-4 text-green-700" /></CardContent></Card>
        <Card className="border border-primary/10"><CardContent className="p-4"><p className="text-xs text-gray-500">Outstanding</p><p className="mt-1 text-xl font-bold text-red-700">{formatCurrency(summary.totalOutstanding)}</p><ReceiptText className="mt-2 h-4 w-4 text-red-700" /></CardContent></Card>
      </div>

      <Card className="border border-violet-100">
        <CardHeader>
          <CardTitle className="text-primary">Invoices Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div>
                <p className="font-medium text-gray-900">{invoice.id} • {invoice.recipientName}</p>
                <p className="text-xs text-gray-500">{invoice.recipientType} • Due {invoice.dueDate}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">{formatCurrency(invoice.amount)}</p>
                <p className={`text-xs ${invoice.status === "PAID" ? "text-green-600" : invoice.status === "OVERDUE" ? "text-red-600" : "text-amber-600"}`}>{invoice.status}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
