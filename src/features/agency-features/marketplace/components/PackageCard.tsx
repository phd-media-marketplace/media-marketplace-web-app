import { Badge } from "@/components/ui/badge"
import type { MediaPackage } from "../types"
import { getCardColors } from "@/utils/customColors"
import { Clock, MapPin, User, Zap } from "lucide-react"
import { formatNumber, formatCurrency } from "@/utils/formatters"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/features/auth/store/auth-store"

interface PackageCardProps {
  mediaPackage: MediaPackage;
}

export default function PackageCard({ mediaPackage }: PackageCardProps) {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    
    const handleViewDetails = () => {
        if (user?.tenantType === "AGENCY") {
            navigate(`/agency/marketplace/${mediaPackage.id}`);
        } else if (user?.tenantType === "CLIENT") {
            navigate(`/client/marketplace/${mediaPackage.id}`);
        }
    };

    const finalCost = mediaPackage.discount 
        ? mediaPackage.cost * (1 - mediaPackage.discount / 100) 
        : mediaPackage.cost;
    
    return (
        <div className="group relative overflow-hidden rounded-xl bg-white p-5 shadow-md transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-gray-100">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/5 to-secondary/5 rounded-full -mr-16 -mt-16" />
            
            {/* Discount Badge */}
            {mediaPackage.discount && (
                <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 shadow-sm">
                        {mediaPackage.discount}% OFF
                    </Badge>
                </div>
            )}
            
            <div className="relative space-y-4">
                {/* Header Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Badge className={`${getCardColors(mediaPackage.mediaType).badge} text-xs font-medium`}>
                            {mediaPackage.mediaType.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-gray-500">{mediaPackage.channel}</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2 min-h-12">
                        {mediaPackage.title}
                    </h3>
                </div>

                {/* Price Section */}
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(finalCost)}
                    </span>
                    {mediaPackage.discount && (
                        <span className="text-sm text-gray-400 line-through">
                            {formatCurrency(mediaPackage.cost)}
                        </span>
                    )}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-gray-600">
                            <User className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium">{formatNumber(mediaPackage.reach)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                            <Zap className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium">
                                {mediaPackage.packageDurationValue} {mediaPackage.packageDurationUnit.toLowerCase()}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {mediaPackage.location && (
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-xs font-medium line-clamp-1">{mediaPackage.location}</span>
                            </div>
                        )}
                        {mediaPackage.timeOfDay && (
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-xs font-medium line-clamp-1">{mediaPackage.timeOfDay}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Demographics */}
                <div className="pt-2">
                    <p className="text-xs text-gray-500">
                        <span className="font-medium">Target:</span> {mediaPackage.demographics}
                    </p>
                </div>

                {/* Action Button */}
                <Button 
                    onClick={handleViewDetails}
                    className="w-full bg-primary hover:opacity-90 transition-opacity text-white font-medium"
                    size="sm"
                >
                    View Details
                </Button>
            </div>
        </div>
    );
}
