import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/utils/formatters"
import { getAdTypeColors } from "@/utils/customColors"

import type { MediaPackageItem as PackageItemType } from "../types"

interface PackageItemProps {
  packageData: {
    items: PackageItemType[];
  };
}

export default function PackageItem({ packageData }: PackageItemProps) {
  return (
    <Card className="border border-primary/5">
        <CardHeader className="bg-linear-to-r from-purple-50 to-blue-50 pb-3">
            <CardTitle className="text-primary text-lg font-bold">
                Package Items ({packageData.items.length})
            </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
            <div className="space-y-3">
            {packageData.items.map((item, index) => (
                <div 
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="text-xs text-gray-500">
                        <span className="font-medium">Rate Card:</span> {item.rateCardId}
                        </h4>
                        <Badge variant="outline" className={`text-xs border-0 ${getAdTypeColors(item.adType).bg} ${getAdTypeColors(item.adType).text} ${getAdTypeColors(item.adType).hover}`}>
                        {item.adType.replace(/_/g, ' ')}
                        </Badge>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-[auto_1fr_1fr_1fr_1fr] lg:grid-cols-[auto_1fr_1fr_1fr_1fr] gap-3 text-sm">
                        <div>
                        <label className="text-xs text-gray-500 pr-4">Segment</label>
                        <p className="font-semibold text-gray-900">{item.segmentClass}</p>
                        </div>
                        <div>
                        <label className="text-xs text-gray-500">Programme Name</label>
                        <p className="font-semibold text-gray-900">{item.programmeName}</p>
                        </div>
                        <div>
                        <label className="text-xs text-gray-500">Quantity</label>
                        <p className="font-semibold text-gray-900">{item.quantity} spots</p>
                        </div>
                        <div>
                        <label className="text-xs text-gray-500">Unit Rate</label>
                        <p className="font-semibold text-gray-900">{formatCurrency(item.unitRate)}</p>
                        </div>
                        <div>
                        <label className="text-xs text-gray-500">Total</label>
                        <p className="font-bold text-primary">{formatCurrency(item.totalPrice)}</p>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </CardContent>
    </Card>
  )
}
