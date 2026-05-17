import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { Coins } from "lucide-react";

interface BudgetSummaryProps {
    totalBudget: number;
    totalAllocated: number;
    remainingBudget: number;
    startDate: string;
    endDate: string;
    discount?: number; // Discount percentage from segments
    discountAmount?: number; // Total discount amount in currency
    className?: string;
}

export default function BudgetSummary({ 
    totalBudget, 
    totalAllocated, 
    remainingBudget,
    startDate,
    endDate,
    discount = 0, // Default to 0% if not provided
    discountAmount = 0, // Default to 0 if not provided
    className = "border border-violet-100 bg-linear-to-r from-purple-50 to-blue-50"
}: BudgetSummaryProps) {
    const campaignWeeks = Math.ceil(
        ((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) + 1) / 7
    );
    const subtotal = totalAllocated - discountAmount;
    const vat = subtotal * 0.15; // 15% VAT
    const nhis = subtotal * 0.05; // 5% NHIS
    const getFund = subtotal * 0.05; // 5% GETFund
    const finalPrice = subtotal + vat + nhis + getFund;

    return (
        <>
            <Card className={className}>
                <CardHeader className="lg:px-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-lg font-bold">
                        <Coins className="w-5 h-5 mr-2" />
                        Budget Summary
                    </CardTitle>
                    <p className="text-xs text-gray-500">Summary of your campaign budget and cost breakdown for the {campaignWeeks} period</p>
                </CardHeader>
                <CardContent className="space-y-2 lg:px-4">
                    <div className="flex justify-between items-center">
                        <span className="text-base text-gray-700 font-semibold">Campaign Budget:</span>
                        <span className="text-base font-semibold text-gray-900">{formatCurrency(totalBudget)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-sm text-gray-700">Amount Utilized:</span>
                        <span className=" text-sm font-semibold text-gray-900">{formatCurrency(totalAllocated)}</span>
                    </div>
                    <div className="flex justify-between items-center text-green-700">
                        <span className="text-sm">Segment Discount ({discount}%):</span>
                        <span className=" text-sm font-semibold">- {formatCurrency(discountAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                        <span className="text-base font-bold text-gray-900">Subtotal:</span>
                        <span className="text-base font-bold text-primary">GH₵ {subtotal?.toLocaleString()}</span>
                    </div>
                    
                    <p className="text-xs text-gray-500">Taxes</p>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">VAT (15%):</span>
                        <span className="text-sm font-semibold text-gray-900">{vat}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">NHIS (5%):</span>
                        <span className="text-sm font-semibold text-gray-900">{nhis}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">GETFund (5%):</span>
                        <span className="text-sm font-semibold text-gray-900">{getFund}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                        <span className="text-lg font-bold text-gray-900">Final Cost:</span>
                        <span className="text-xl font-bold text-primary">GH₵ {finalPrice?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className={`text-sm font-semibold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>Remaining:</span>
                        <span className={`text-sm font-semibold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(remainingBudget)}</span>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
