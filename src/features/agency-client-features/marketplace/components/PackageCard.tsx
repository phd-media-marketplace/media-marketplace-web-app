import { Badge } from "@/components/ui/badge"
import type { MediaPackage } from "../types"
import { getCardColors } from "@/utils/customColors"
import { MapPin, Target, User, Zap } from "lucide-react"
import { formatNumber, formatCurrency } from "@/utils/formatters"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/features/auth/store/auth-store"

interface PackageCardProps {
  mediaPackage: MediaPackage;
}

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v", ".ogg"];

const getPackageMediaUrl = (mediaPackage: MediaPackage): string | null => {
    const possibleAssetLists = [
        mediaPackage.metadata?.packageImages,
        mediaPackage.metadata?.packageMedia,
        mediaPackage.metadata?.media,
        mediaPackage.metadata?.assets,
    ];

    for (const candidate of possibleAssetLists) {
        if (!Array.isArray(candidate)) continue;

        const firstValidAsset = candidate.find(
            (asset: unknown): asset is string => typeof asset === "string" && asset.trim().length > 0,
        );

        if (firstValidAsset) {
            return firstValidAsset;
        }
    }

    return null;
};

const isVideoAsset = (url: string): boolean => {
    const cleanUrl = url.split("?")[0].toLowerCase();
    return VIDEO_EXTENSIONS.some((ext) => cleanUrl.endsWith(ext));
};

export default function PackageCard({ mediaPackage }: PackageCardProps) {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    
    const handleViewDetails = () => {
        if (user?.tenantType === "AGENCY") {
            navigate(`/agency/marketplace/${mediaPackage.id}`);
        } else if (user?.tenantType === "CLIENT") {
            navigate(`/client/marketplace/${mediaPackage.id}`);
        } else {
            navigate(`/marketplace/${mediaPackage.id}`);
        }
    };

    const displayPrice = mediaPackage.finalPrice;
    const discountValue = Number(mediaPackage.discount ?? 0);
    const hasDiscount = discountValue > 0;
    const mediaUrl = getPackageMediaUrl(mediaPackage);
    const shouldRenderVideo = mediaUrl ? isVideoAsset(mediaUrl) : false;
    
    return (
        <div className="group relative h-120 overflow-hidden rounded-xl border border-slate-200 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer">
            <div className="relative h-full w-full overflow-hidden">
                {mediaUrl && shouldRenderVideo && (
                    <video
                        src={mediaUrl}
                        className="h-full w-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                    />
                )}
                {mediaUrl && !shouldRenderVideo && (
                    <img
                        src={mediaUrl}
                        alt={mediaPackage.packageName}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                )}
                {!mediaUrl && (
                    <div className="h-full w-full bg-linear-to-br from-slate-300 via-slate-200 to-slate-100" />
                )}

                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-slate-950/95 via-slate-950/70 to-transparent" />

                <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
                    <Badge className={`${getCardColors(mediaPackage.mediaType).badge} text-xs font-medium shadow-sm`}>
                        {mediaPackage.mediaType.replace('_', ' ')}
                    </Badge>
                </div>

                {hasDiscount && (
                    <div className="absolute right-3 top-3 z-10">
                            <Badge className="rounded-full border-0 bg-emerald-500/90 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
                            {discountValue}% OFF
                        </Badge>
                    </div>
                )}
                {/* Package Details */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-slate-950/55 p-5 pt-4 text-white backdrop-blur-xl rounded-t-2xl">
                    <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                            {mediaPackage.mediaPartnerName && (
                                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">{mediaPackage.mediaPartnerName}</p>
                            )}
                            {hasDiscount ? (
                                    <div className="shrink-0 rounded-2xl bg-white/10 px-3 py-2 text-right backdrop-blur-sm">
                                        <p className="text-[11px] text-white/55 line-through">
                                            {formatCurrency(mediaPackage.totalPrice)}
                                        </p>
                                        <p className="text-lg font-semibold leading-none text-white">
                                            {formatCurrency(displayPrice)}
                                        </p>
                                    </div>
                            ) : 
                                    <span className="shrink-0 rounded-full bg-white/10 px-3 py-2 text-lg font-semibold text-white backdrop-blur-sm">
                                {formatCurrency(displayPrice)}
                            </span>
                            }
                        </div>

                            <h4 className="line-clamp-2 text-2xl font-semibold leading-tight text-white">
                                {mediaPackage.packageName}
                            </h4>

                            <p className="line-clamp-2 text-sm leading-relaxed text-white/75">
                                {mediaPackage.description || "Explore this package and launch your campaign with premium placements."}
                            </p>
                    </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-white/90">
                                <User className="h-4 w-4 text-white" />
                                <span className="text-xs font-medium">{formatNumber(mediaPackage.reach)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-white/90">
                                <Zap className="h-4 w-4 text-white" />
                                <span className="text-xs font-medium">
                                    {mediaPackage.packageDurationValue} {mediaPackage.packageDurationUnit.toLowerCase()}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-white/90">
                                <Target className="h-4 w-4 text-white" />
                                <span className="text-xs font-medium line-clamp-1">
                                    {Array.isArray(mediaPackage.demographics) ? mediaPackage.demographics.join(', ') : mediaPackage.demographics}
                                </span>
                            </div>
                            {mediaPackage.location && (
                                <div className="flex items-center gap-1.5 text-white/90">
                                    <MapPin className="h-4 w-4 text-white" />
                                    <span className="text-xs font-medium line-clamp-1">{mediaPackage.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-5">
                        <Button 
                            onClick={handleViewDetails}
                                className="h-12 w-full rounded-full bg-white text-base font-semibold text-slate-950 shadow-lg shadow-black/20 transition-colors hover:bg-white/95"
                            size="sm"
                        >
                            Buy Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
