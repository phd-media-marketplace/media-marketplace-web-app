import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, CalendarDays } from "lucide-react";
import { dummyPackages } from "../dummy-data";
import NoDataCard from "@/components/universal/NoDataCard";
import { formatCurrency, formatDate, getMediaTypeIcon } from "@/utils/formatters";
import Header from "@/components/universal/Header";
import { getAdTypeColors } from "@/utils/customColors";
import AssetPreviewCard from "@/components/universal/AssetPreviewCard";
import PricingSummary from "../components/PricingSummary";

export default function ViewPackage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const packageData = dummyPackages.find((pkg) => pkg.id === id);
  if (!packageData) {
    return (
      <NoDataCard
        title="Package Not Found"
        message="The package you're looking for doesn't exist."
        btnText="Back to Packages"
        redirectFunc={() => navigate('/media-partner/packages')}
      />
    );
  }

  const packageImages = Array.isArray(packageData.metadata?.packageImages)
    ? packageData.metadata.packageImages.filter((image: unknown): image is string => typeof image === "string" && image.trim().length > 0)
    : [];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <Header 
        title={packageData.packageName}
        mediaType={packageData.mediaType}
        isActive={packageData.isActive}
        returnTofunc={() => navigate('/media-partner/packages')}
        ctaFunc={() => navigate(`/media-partner/packages/${id}/edit`)}
        ctaIcon={Edit}
        ctabtnText="Edit Package"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="overflow-hidden border border-violet-200 shadow-xs">
            <CardHeader className="border-b border-violet-100 bg-linear-to-r from-primary/5 via-indigo-50 to-secondary/5 pt-1 ">
              <CardTitle className="text-primary text-lg font-bold">Package Information</CardTitle>
              <p className="text-sm font-medium text-violet-700/80">
                Identity, timing, and lifecycle details
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="rounded bg-violet-50/30 p-4">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-700/80">Package ID</label>
                  <p className="mt-2 break-all text-sm font-mono text-violet-950">{packageData.id}</p>
                </div>
                <div className="rounded bg-cyan-50/30 p-4">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-800/80">Media Type</label>
                  <p className="mt-2 text-sm font-semibold text-cyan-950">
                    {getMediaTypeIcon(packageData.mediaType)} {packageData.mediaType}
                  </p>
                </div>
              </div>

              {packageData.description && (
                <div className="rounded bg-indigo-50/30 p-4">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-800/80">Description</label>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{packageData.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="rounded bg-white/30 p-4">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">Created</label>
                  <p className="mt-2 text-sm font-medium text-gray-900">{formatDate(packageData.createdAt)}</p>
                </div>
                <div className="rounded bg-white/30 p-4">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">Last Updated</label>
                  <p className="mt-2 text-sm font-medium text-gray-900">{formatDate(packageData.updatedAt)}</p>
                </div>
              </div>

              {(packageData.validFrom || packageData.validTo) && (
                <div className="rounded bg-primary/1 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary/80">Validity Period</label>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {packageData.validFrom && (
                      <div>
                        <label className="text-xs text-gray-500">From</label>
                        <p className="text-sm font-semibold text-gray-900">{formatDate(packageData.validFrom)}</p>
                      </div>
                    )}
                    {packageData.validTo && (
                      <div>
                        <label className="text-xs text-gray-500">To</label>
                        <p className="text-sm font-semibold text-gray-900">{formatDate(packageData.validTo)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Package Items */}
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
                            <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr] gap-3 text-sm">
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
            </CardContent>
          </Card>

        </div>

        {/* Pricing Summary Sidebar */}
        <div className="lg:col-span-1">
          <PricingSummary
            totalPrice={packageData?.totalPrice || 0}
            discount={packageData?.discount}
            finalPrice={packageData?.finalPrice}
            IsPreviewView={true}
            packageData={packageData}
          />
          {/* <Card className="border border-violet-200 bg-linear-to-br from-purple-50 to-blue-50 sticky top-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <CardTitle className="text-primary text-lg font-bold">Pricing Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-violet-200">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-base font-semibold text-gray-900">
                    {formatCurrency(packageData.totalPrice)}
                  </span>
                </div>

                {packageData.discount && packageData.discount > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-violet-200">
                    <span className="text-sm text-gray-600">Discount ({packageData.discount}%)</span>
                    <span className="text-base font-semibold text-green-600">
                      -{formatCurrency(packageData.totalPrice - packageData.finalPrice)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-bold text-gray-900">Final Price</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(packageData.finalPrice)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-violet-200">
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">💡 Package Benefits</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>✓ {packageData.items.length} ad type{packageData.items.length > 1 ? 's' : ''} included</li>
                    {packageData.discount && packageData.discount > 0 && (
                      <li>✓ Save {packageData.discount}% on bundle</li>
                    )}
                    <li>✓ Flexible scheduling</li>
                    <li>✓ Priority support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card> */}
          <AssetPreviewCard
            className="mt-6"
            assets={packageImages}
            emptyMessage = "Add package flyers or preview images from the edit screen to complete this card."
            actionHref={`/media-partner/packages/${id}/edit`}
            actionLabel="Edit Package"
          />
        </div>
      </div>
    </div>
  );
}
