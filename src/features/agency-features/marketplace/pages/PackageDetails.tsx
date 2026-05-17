import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle2,
    Heart,
    MapPin,
    Share2,
    Star,
    Target,
    TrendingUp,
    Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyMediaPackages } from "../dummy-data";
import { getCardColors } from "@/utils/customColors";
import { formatNumber, formatCurrency } from "@/utils/formatters";
import { useAuthStore } from "@/features/auth/store/auth-store";
import PackageItem from "../components/PackageItem";
import AddToPlanDialog from "../components/AddToPlanDialog";

export default function PackageDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);
    const user = useAuthStore((state) => state.user);

    const mediaPackage = dummyMediaPackages.find((pkg) => pkg.id === id);
    const packageAssets = Array.isArray(mediaPackage?.metadata?.packageImages)
        ? mediaPackage.metadata.packageImages.filter((asset: unknown): asset is string => typeof asset === "string" && asset.trim().length > 0)
        : [];
    const primaryAsset = packageAssets[0] ?? null;
    const hasVideoAsset = primaryAsset ? /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(primaryAsset) : false;

    if (!mediaPackage) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
                <div className="text-center">
                    <h2 className="mb-2 text-2xl font-bold text-gray-900">Package Not Found</h2>
                    <p className="mb-4 text-gray-600">The package you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate("/agency/marketplace") }>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Marketplace
                    </Button>
                </div>
            </div>
        );
    }

    const displayPrice = mediaPackage.finalPrice;
    const originalPrice = mediaPackage.totalPrice;
    const hasDiscount = Boolean(mediaPackage.discount && mediaPackage.discount > 0);
    const savings = hasDiscount ? originalPrice - displayPrice : 0;

    const audienceSegments = Array.isArray(mediaPackage.demographics)
        ? mediaPackage.demographics
        : [mediaPackage.demographics].filter(Boolean);

    const packageHighlights = [
        { label: "Reach", value: formatNumber(mediaPackage.reach), icon: TrendingUp },
        {
            label: "Duration",
            value: `${mediaPackage.packageDurationValue} ${mediaPackage.packageDurationUnit.toLowerCase()}`,
            icon: Zap,
        },
        { label: "Audience", value: audienceSegments.join(", "), icon: Target },
        { label: "Location", value: mediaPackage.location || "Nationwide", icon: MapPin },
    ];

    const handleShare = async () => {
        const shareUrl = window.location.href;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: mediaPackage.packageName,
                    text: mediaPackage.description || mediaPackage.packageName,
                    url: shareUrl,
                });
                return;
            }

            await navigator.clipboard.writeText(shareUrl);
        } catch {
            // Share is best-effort; ignore platform-specific failures.
        }
    };

    const handleBack = () => {
        if (user?.tenantType === "AGENCY") {
            navigate("/agency/marketplace");
        } else if (user?.tenantType === "CLIENT") {
            navigate("/client/marketplace");
        } else {
            navigate("/marketplace");
        }
    };

    return (
        <div className="space-y-6 pb-10">
            <Button variant="ghost" onClick={handleBack} className="text-primary hover:bg-gray-100">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Marketplace
            </Button>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card className="overflow-hidden border-slate-200 bg-slate-950 text-white shadow-[0_8px_8px_rgba(15,23,42,0.28)]">
                        <div className="relative h-120">
                            {primaryAsset && hasVideoAsset && (
                                <video
                                    src={primaryAsset}
                                    className="h-full w-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                />
                            )}
                            {primaryAsset && !hasVideoAsset && (
                                <img
                                    src={primaryAsset}
                                    alt={mediaPackage.packageName}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            )}
                            {!primaryAsset && (
                                <div className="h-120 bg-linear-to-br from-slate-900 via-slate-800 to-slate-950" />
                            )}

                            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/65 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-slate-950/95 via-slate-950/65 to-transparent" />

                            <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-4">
                                <div className="flex flex-wrap gap-2">
                                    <Badge className={`${getCardColors(mediaPackage.mediaType).badge} border-0 text-sm font-medium shadow-sm`}>
                                        {mediaPackage.mediaType.replace("_", " ")}
                                    </Badge>
                                    {mediaPackage.mediaPartnerName && (
                                        <Badge className="border border-white/10 bg-black/30 text-sm font-medium text-white backdrop-blur-md">
                                            {mediaPackage.mediaPartnerName}
                                        </Badge>
                                    )}
                                    {mediaPackage.isActive && (
                                        <Badge className="border-0 bg-emerald-500/90 text-sm font-medium text-white shadow-sm">
                                            Available
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`border-white/10 bg-black/30 text-white backdrop-blur-md hover:bg-black/45 ${isFavorite ? "text-rose-400" : ""}`}
                                    >
                                        <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleShare}
                                        className="border-white/10 bg-black/30 text-white backdrop-blur-md hover:bg-black/45"
                                    >
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
                                        {mediaPackage.mediaType.replace("_", " ")}
                                    </p>
                                    <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                                        {mediaPackage.packageName}
                                    </h1>
                                    <p className="max-w-2xl text-sm leading-relaxed text-white/78 sm:text-base">
                                        {mediaPackage.description || "A curated package designed to help you launch with clarity, reach, and measurable impact."}
                                    </p>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <Badge className="border-white/10 bg-white/10 text-xs font-medium text-white backdrop-blur-md">
                                            {mediaPackage.metadata?.rating ? `${mediaPackage.metadata.rating}` : "Unrated"}
                                            {mediaPackage.metadata?.rating && <Star className="ml-1 h-3 w-3 text-yellow-400" />}
                                        </Badge>
                                        <Badge className="border-white/10 bg-white/10 text-xs font-medium text-white backdrop-blur-md">
                                            {mediaPackage.metadata?.popularityScore ? `Popularity: ${mediaPackage.metadata.popularityScore}` : "Popularity unknown"}
                                        </Badge>
                                        <Badge className="border-white/10 bg-white/10 text-xs font-medium text-white backdrop-blur-md">
                                            {mediaPackage.items.length} {mediaPackage.items.length === 1 ? "placement" : "placements"}
                                        </Badge>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </Card>

                    <Card className="border border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/80 pb-4">
                            <CardTitle className="pt-2 text-base font-semibold uppercase tracking-[0.16em] text-slate-900">
                                Package Details
                            </CardTitle>
                            <p className="text-sm text-slate-500">Important details about this package at a glance.</p>
                        </CardHeader>

                        <CardContent className="pt-6">
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {packageHighlights.map((highlight) => {
                                    const Icon = highlight.icon;

                                    return (
                                        <div key={highlight.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Icon className="h-4 w-4" />
                                                <span className="text-xs font-semibold uppercase tracking-[0.16em]">{highlight.label}</span>
                                            </div>
                                            <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-900">
                                                {highlight.value}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>

                        <CardContent>
                            {mediaPackage.items.length > 0 && <PackageItem packageData={mediaPackage} />}
                        </CardContent>

                        <CardContent className="space-y-4 lg:px-4">
                            <div>
                                <h4 className="mb-2 text-sm font-semibold text-slate-900">Why choose this package?</h4>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {[
                                        "Professional media placement",
                                        "Performance tracking and reporting",
                                        "Dedicated account support",
                                        "Campaign optimization assistance",
                                    ].map((benefit) => (
                                        <div key={benefit} className="flex items-start gap-2 rounded-xl border border-slate-100 bg-white p-3">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                                            <span className="text-sm text-slate-700">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-4">
                        <Card className="border border-slate-200 bg-white/90 shadow-lg backdrop-blur-xl">
                            <CardHeader className="space-y-3 pb-4">
                                <div className="flex items-center justify-between gap-3">
                                    <CardTitle className="text-lg font-semibold text-slate-900">Package Price</CardTitle>
                                    {hasDiscount && <Badge className="bg-emerald-100 text-emerald-700">Save {mediaPackage.discount}%</Badge>}
                                </div>

                                <div>
                                    <div className="flex items-end gap-3">
                                        <span className="text-3xl font-bold tracking-tight text-slate-950">
                                            {formatCurrency(displayPrice)}
                                        </span>
                                        {hasDiscount && <span className="text-base text-slate-400 line-through">{formatCurrency(originalPrice)}</span>}
                                    </div>
                                    {hasDiscount && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <Badge className="bg-emerald-100 text-emerald-700">{mediaPackage.discount}% Discount</Badge>
                                            <span className="text-sm text-slate-600">({formatCurrency(savings)} off)</span>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4 pt-0">
                                <AddToPlanDialog
                                    mediaPackage={mediaPackage}
                                    triggerClassName="w-full rounded-full bg-secondary text-sm font-semibold text-primary transition-colors hover:bg-secondary/90"
                                />

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-slate-500">Status</span>
                                            <Badge className="bg-emerald-100 text-emerald-700">Available</Badge>
                                        </div>
                                        {mediaPackage.mediaPartnerName && (
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-slate-500">Provider</span>
                                                <span className="font-medium text-slate-900">{mediaPackage.mediaPartnerName}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-slate-200 bg-linear-to-br from-slate-50 to-white shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-slate-900">Best for</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 pt-0">
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    Brand awareness campaigns
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    Reach-driven launches
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    Teams that need a quick shortlist
                                </div>
                            </CardContent>
                        </Card>

                        {packageAssets.length > 0 && (
                            <Card className="overflow-hidden border border-slate-200 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-semibold text-slate-900">Preview assets</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="grid grid-cols-2 gap-3">
                                        {packageAssets.slice(0, 4).map((asset, index) => (
                                            <div key={`${asset}-${index}`} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                                {/\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(asset) ? (
                                                    <video src={asset} className="h-28 w-full object-cover" muted loop playsInline autoPlay preload="metadata" />
                                                ) : (
                                                    <img src={asset} alt={`${mediaPackage.packageName} preview ${index + 1}`} className="h-28 w-full object-cover" loading="lazy" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}