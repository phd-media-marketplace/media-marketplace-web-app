import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ReceiptText, Wallet } from "lucide-react";

const invoiceSummary = [
  { label: "Total Due", value: "GHc 124,500", icon: Wallet },
  { label: "Paid This Month", value: "GHc 67,200", icon: CreditCard },
  { label: "Open Invoices", value: "12", icon: ReceiptText },
];

const invoices = [
  { id: "INV-2026-011", client: "Acme Beverages", amount: "GHc 12,000", status: "Paid" },
  { id: "INV-2026-012", client: "City Telecom", amount: "GHc 8,500", status: "Pending" },
  { id: "INV-2026-013", client: "Sunrise Bank", amount: "GHc 21,000", status: "Overdue" },
];

export default function BillingPage() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Billing</h2>
          <p className="mt-1 text-sm text-gray-500">Manage invoices, track payments, and monitor account balances.</p>
        </div>
        <Button className="bg-primary text-white hover:bg-primary/90">Create Invoice</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {invoiceSummary.map((item) => (
          <Card key={item.label} className="border border-primary/10">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
                <p className="mt-1 text-xl font-bold text-primary">{item.value}</p>
              </div>
              <item.icon className="h-5 w-5 text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-violet-100">
        <CardHeader>
          <CardTitle className="text-primary">Invoice List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div>
                <p className="font-medium text-gray-900">{invoice.id}</p>
                <p className="text-xs text-gray-500">{invoice.client}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">{invoice.amount}</p>
                <p className={`text-xs ${invoice.status === "Paid" ? "text-green-600" : invoice.status === "Overdue" ? "text-red-600" : "text-amber-600"}`}>
                  {invoice.status}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
