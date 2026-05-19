import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { Coins } from "lucide-react";
import type { TaxDetails } from "@/types/invoice";

interface WorkOrderFinancialSummaryProps {
  subtotal: number;
  tax?: TaxDetails;
  discount?: number;
  totalAmount: number;
}

/**
 * WorkOrderFinancialSummary Component
 * Displays financial summary with subtotal, tax, and total amount
 */
export function WorkOrderFinancialSummary({
  subtotal,
  tax,
  discount,
  totalAmount,
}: WorkOrderFinancialSummaryProps) {
  const vat = subtotal * 0.15;
  const nhis = subtotal * 0.05;
  const getFund = subtotal * 0.05;
  const derivedTaxTotal = vat + nhis + getFund;
  const totalTax = tax?.taxAmount ?? derivedTaxTotal;

  return (
    <Card className="py-3">
      <CardHeader className="border-b border-violet-100 [.border-b]:pb-1">
        <CardTitle className="flex items-center gap-2 text-primary text-lg font-bold">
          <Coins className="w-5 h-5 mr-2" />
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 lg:px-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Subtotal:</span>
            <span className="text-lg font-semibold">GH{formatCurrency(subtotal)}</span>
          </div>
          {discount && discount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Discount:</span>
              <span className="text-lg font-semibold">GH{formatCurrency(discount)}</span>
            </div>
          )}
          <>
            <div className="pt-2 border-t border-gray-200" />
            <p className="text-xs text-gray-500">Taxes</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">VAT (15%):</span>
              <span className="text-sm font-semibold text-gray-900">GH{formatCurrency(vat)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">NHIS (5%):</span>
              <span className="text-sm font-semibold text-gray-900">GH{formatCurrency(nhis)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">GETFund (5%):</span>
              <span className="text-sm font-semibold text-gray-900">GH{formatCurrency(getFund)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Tax:</span>
              <span className="text-lg font-semibold">GH{formatCurrency(totalTax)}</span>
            </div>
          </>
          <div className="flex justify-between items-center pt-2 border-t border-gray-300">
            <span className="text-lg font-bold text-primary">Total Amount</span>
            <span className="text-xl font-bold text-primary">GH{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
