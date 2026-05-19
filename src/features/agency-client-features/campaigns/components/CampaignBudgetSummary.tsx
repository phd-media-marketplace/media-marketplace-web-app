import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Calendar } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface CampaignBudgetSummaryProps {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  daysRemaining?: number;
}

/**
 * CampaignBudgetSummary Component
 * Displays campaign budget and timeline information
 */
export function CampaignBudgetSummary({
  totalBudget,
  totalSpent,
  remainingBudget,
  daysRemaining,
}: CampaignBudgetSummaryProps) {
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Budget */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(totalBudget)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Total Budget</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* Spent & Progress */}
      <Card>
        <CardContent className="pt-6">
          <div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(totalSpent)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Spent ({spentPercentage.toFixed(1)}%)
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${
                  spentPercentage > 90 ? 'bg-red-500' :
                  spentPercentage > 75 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(spentPercentage, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remaining */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(remainingBudget)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Remaining Budget</p>
              {daysRemaining !== undefined && (
                <p className="text-xs text-gray-400 mt-1">
                  {daysRemaining} days left
                </p>
              )}
            </div>
            <Calendar className="w-8 h-8 text-green-500 opacity-20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
