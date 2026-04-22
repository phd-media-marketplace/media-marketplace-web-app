import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";
import type { Package } from "../types";


export interface PricingSummaryProps {
  totalPrice: number;
  discount?: number; // Optional discount percentage
  finalPrice?: number; // Optional final price after discount
  IsPreviewView: boolean; // Flag to indicate if it's a preview view
  packageData?: Package; // Optional package data for displaying benefits in preview
}
export default function PricingSummary({ totalPrice, discount, finalPrice, IsPreviewView = false, packageData }: PricingSummaryProps) {
  return (
    <Card className="border border-violet-100 bg-linear-to-r from-purple-50 to-blue-50">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary text-lg font-bold">
                <Coins className="w-5 h-5 mr-2" />
                Price Summary
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 lg:px-4">
            <div className="flex justify-between items-center">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-semibold text-gray-900">GH₵ {totalPrice.toLocaleString()}</span>
            </div>
            {discount?.toFixed(2) !== '0.00' && (
                <div className="flex justify-between items-center text-green-700">
                <span>Discount ({discount}%):</span>
                <span className="font-semibold">- GH₵ {((totalPrice * discount!) / 100).toLocaleString()}</span>
                </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                <span className="text-lg font-bold text-gray-900">Final Price:</span>
                <span className="text-2xl font-bold text-primary">GH₵ {finalPrice?.toLocaleString()}</span>
            </div>
            {IsPreviewView === true && (
                <div className="pt-4 border-t border-violet-200">
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">💡 Package Benefits</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>✓ {packageData?.items.length} ad type{packageData!.items.length > 1 ? 's' : ''} included</li>
                    {packageData?.discount && packageData.discount > 0 && (
                      <li>✓ Save {packageData.discount}% on bundle</li>
                    )}
                    <li>✓ Flexible scheduling</li>
                    <li>✓ Priority support</li>
                  </ul>
                </div>
              </div>
            )}
        </CardContent>
    </Card>
  )
}
