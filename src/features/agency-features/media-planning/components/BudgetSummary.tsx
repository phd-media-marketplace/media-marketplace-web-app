import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";

interface BudgetSummaryProps {
    totalBudget: number;
    totalAllocated: number;
    remainingBudget: number;
    startDate: string;
    endDate: string;
}

export default function BudgetSummary({ 
    totalBudget, 
    totalAllocated, 
    remainingBudget,
    startDate,
    endDate
}: BudgetSummaryProps) {
    const campaignWeeks = Math.ceil(
        ((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) + 1) / 7
    );

    return (
        <Card className="p-6 border border-primary/20 rounded-lg shadow-md bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <p className="text-sm text-gray-600">Total Budget</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(totalBudget)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Allocated</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalAllocated)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Remaining</p>
                    <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(remainingBudget)}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Campaign Duration</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {campaignWeeks} weeks
                    </p>
                </div>
            </div>
        </Card>
    );
}
