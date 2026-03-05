import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    ArrowLeft, 
    Clock, 
    MapPin, 
    User, 
    Zap, 
    Calendar,
    TrendingUp,
    Tag,
    CheckCircle2,
    Share2,
    Heart,
    ShoppingCart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import { dummyMediaPackages } from "../dummy-data";
import { getCardColors, getDayColor } from "@/utils/customColors";
import { formatNumber, formatCurrency } from "@/utils/formatters";
import { useAuthStore } from "@/features/auth/store/auth-store";

export default function PackageDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);
    const user = useAuthStore((state) => state.user);

    const mediaPackage = dummyMediaPackages.find((pkg) => pkg.id === id);


    if (!mediaPackage) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Package Not Found</h2>
                    <p className="text-gray-600 mb-4">The package you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate("/agency/marketplace")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Marketplace
                    </Button>
                </div>
            </div>
        );
    }

    const finalCost = mediaPackage.discount 
        ? mediaPackage.cost * (1 - mediaPackage.discount / 100) 
        : mediaPackage.cost;

    const savings = mediaPackage.discount 
        ? mediaPackage.cost - finalCost 
        : 0;

    const handleBack = () => {
      if (user?.tenantType === "AGENCY") {
        navigate("/agency/marketplace");
      } else if (user?.tenantType === "CLIENT") {
        navigate("/client/marketplace");
      }
    }

    return (
        <div className="space-y-6 pb-8">
            {/* Back Button */}
            <Button 
                variant="ghost" 
                onClick={handleBack}
                className=" text-primary hover:bg-gray-100"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Marketplace
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Card */}
                    <Card className="p-6 space-y-4 border border-purple-100">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className={`${getCardColors(mediaPackage.mediaType).badge} text-sm font-medium`}>
                                        {mediaPackage.mediaType.replace('_', ' ')}
                                    </Badge>
                                    <span className="text-sm text-gray-500">{mediaPackage.channel}</span>
                                    {mediaPackage.isActive && (
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                            Active
                                        </Badge>
                                    )}
                                </div>
                                <motion.h1 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-3xl font-bold text-gray-900"
                                >
                                    {mediaPackage.title}
                                </motion.h1>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className={isFavorite ? "text-red-500 border-red-500" : ""}
                                >
                                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                >
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-600">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <User className="w-4 h-4" />
                                    <span className="text-xs font-medium">Reach</span>
                                </div>
                                <p className="text-lg font-bold text-gray-900">
                                    {formatNumber(mediaPackage.reach)}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Zap className="w-4 h-4" />
                                    <span className="text-xs font-medium">Duration</span>
                                </div>
                                <p className="text-lg font-bold text-gray-900">
                                    {mediaPackage.packageDurationValue} {mediaPackage.packageDurationUnit.toLowerCase()}
                                </p>
                            </div>
                            {mediaPackage.numberOfSpots && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-xs font-medium">Spots</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">
                                        {mediaPackage.numberOfSpots}
                                    </p>
                                </div>
                            )}
                            {mediaPackage.spotDurationSeconds && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-xs font-medium">Spot Length</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">
                                        {mediaPackage.spotDurationSeconds}s
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Package Details Card */}
                    <Card className="p-6 space-y-6 border border-purple-100">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Package Details</h2>
                            <div className="grid gap-4">
                                {mediaPackage.location && (
                                    <div className="flex items-start gap-3">
                                        <div className="border border-purple-100 bg-purple-100 p-2 rounded-md">
                                          <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Location</p>
                                            <p className="text-gray-600">{mediaPackage.location}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                  <div className="border border-purple-100 bg-purple-100 p-2 rounded-md">
                                    <User className="w-5 h-5 text-primary mt-0.5" />
                                  </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Target Demographics</p>
                                        <p className="text-gray-600">{mediaPackage.demographics}</p>
                                    </div>
                                </div>

                                {mediaPackage.timeOfDay && (
                                    <div className="flex items-start gap-3">
                                        <div className="border border-purple-100 bg-purple-100 p-2 rounded-md">
                                            <Clock className="w-5 h-5 text-primary mt-0.5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Time Slot</p>
                                            <p className="text-gray-600">{mediaPackage.timeOfDay}</p>
                                        </div>
                                    </div>
                                )}

                                {mediaPackage.segment && (
                                    <div className="flex items-start gap-3">
                                        <div className="border border-purple-100 bg-purple-100 p-2 rounded-md">
                                            <Tag className="w-5 h-5 text-primary mt-0.5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Segment</p>
                                            <p className="text-gray-600">{mediaPackage.segment}</p>
                                        </div>
                                    </div>
                                )}

                                {mediaPackage.daysOfAllocation && mediaPackage.daysOfAllocation.length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <div className="border border-purple-100 bg-purple-100 p-2 rounded-md">
                                            <Calendar className="w-5 h-5 text-primary mt-0.5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Days of Allocation</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {mediaPackage.daysOfAllocation.map((day) => (
                                                    <Badge key={day} className={`text-xs ${getDayColor(day)}`}>
                                                        {day}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {mediaPackage.notes && (
                            <>
                                {/* <Separator /> */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Additional Information</h3>
                                    <p className="text-gray-600 leading-relaxed">{mediaPackage.notes}</p>
                                </div>
                            </>
                        )}

                        {/* Benefits Section */}
                        {/* <Separator /> */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">What's Included</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    <span>Professional media placement</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    <span>Performance tracking and reporting</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    <span>Dedicated account support</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    <span>Campaign optimization assistance</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar - Right Column */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-4">
                        {/* Pricing Card */}
                        <Card className="p-6 space-y-1 border border-purple-100">
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Package Price</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-primary">
                                        {formatCurrency(finalCost)}
                                    </span>
                                    {mediaPackage.discount && (
                                        <span className="text-md text-gray-400 line-through">
                                            {formatCurrency(mediaPackage.cost)}
                                        </span>
                                    )}
                                </div>
                                {mediaPackage.discount && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className="bg-green-100 text-green-700">
                                            Save {mediaPackage.discount}%
                                        </Badge>
                                        <span className="text-sm text-gray-600">
                                                ({formatCurrency(savings)} off)
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* <Separator /> */}

                            {/* Action Buttons */}
                            <div className="space-y-1">
                                <Button className="w-full bg-secondary hover:bg-transparent hover:border hover:border-secondary text-purple transition-colors duration-300" size="lg">
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Add to Plan
                                </Button>
                                {/* <Button variant="outline" className="w-full" size="lg">
                                    Request Quote
                                </Button> */}
                            </div>

                            {/* <Separator /> */}

                            {/* Additional Info */}
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Status</span>
                                    <Badge className="bg-green-100 text-green-700">
                                        Available
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Provider</span>
                                    <span className="font-medium text-gray-900">{mediaPackage.channel}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Contact Card */}
                        <Card className="p-6 bg-linear-to-br from-primary/5 to-secondary/5 border border-purple-100">
                            <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Our media specialists are here to help you find the perfect package for your campaign.
                            </p>
                            <Button variant="outline" className="w-full border-secondary text-primary hover:bg-secondary/10" size="lg">
                                Contact Support
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
