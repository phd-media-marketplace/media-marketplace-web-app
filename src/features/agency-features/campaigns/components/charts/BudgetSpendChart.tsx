import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BudgetSpendChartProps {
  budgetData: {
    date: string;
    budget: number;
    spent: number;
  }[];
}

/**
 * BudgetSpendChart Component
 * Line chart showing budget vs actual spend over time
 */
export function BudgetSpendChart({ budgetData }: BudgetSpendChartProps) {
  // TODO: Integrate with recharts or similar charting library
  // For now, showing placeholder structure
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Spend Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center text-gray-500">
            <p className="font-semibold mb-2">Budget vs Spend Chart</p>
            <p className="text-sm">Line chart showing planned budget vs actual spend over time</p>
            <p className="text-xs mt-2 text-gray-400">
              {budgetData.length} data points • Recharts integration pending
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
