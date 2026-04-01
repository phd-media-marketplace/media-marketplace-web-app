import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/formatters";

interface WorkOrderFinancialSummaryProps {
  subtotal: number;
  tax?: number;
  totalAmount: number;
}

/**
 * WorkOrderFinancialSummary Component
 * Displays financial summary with subtotal, tax, and total amount
 */
export function WorkOrderFinancialSummary({
  subtotal,
  tax,
  totalAmount,
}: WorkOrderFinancialSummaryProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-lg font-semibold">{formatCurrency(subtotal)}</span>
          </div>
          {tax && tax > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tax</span>
              <span className="text-lg">{formatCurrency(tax)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-primary">Total Amount</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
