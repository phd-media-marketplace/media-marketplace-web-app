import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { Coins } from "lucide-react";

interface WorkOrderFinancialSummaryProps {
  subtotal: number;
  tax?: number;
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
          {tax && tax > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Tax:</span>
              <span className="text-lg font-semibold">GH{formatCurrency(tax)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-gray-300">
            <span className="text-lg font-bold text-primary">Total Amount</span>
            <span className="text-xl font-bold text-primary">GH{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
