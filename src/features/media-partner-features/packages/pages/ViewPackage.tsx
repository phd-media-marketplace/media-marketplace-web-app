import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Package2, DollarSign, CalendarDays } from "lucide-react";
import { dummyPackages } from "../dummy-data";

export default function ViewPackage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const packageData = dummyPackages.find((pkg) => pkg.id === id);

  if (!packageData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Package2 className="w-16 h-16 text-gray-300" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Package Not Found</h3>
          <p className="text-sm text-gray-500 mt-1">The package you're looking for doesn't exist.</p>
        </div>
        <Button onClick={() => navigate('/media-partner/packages')}>
          Back to Packages
        </Button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'FM': return '📻';
      case 'TV': return '📺';
      case 'OOH': return '🏙️';
      case 'DIGITAL': return '💻';
      default: return '📦';
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate('/media-partner/packages')}
            className="border-secondary hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold text-primary tracking-tight">
                {packageData.packageName}
              </h2>
              <Badge variant={packageData.isActive ? "default" : "secondary"}>
                {packageData.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">Package Details</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate(`/media-partner/packages/${id}/edit`)}
          className="bg-primary hover:bg-primary/90"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Package
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="border border-violet-100">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-3">
              <CardTitle className="text-primary text-lg font-bold">Package Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Package ID</label>
                  <p className="text-sm font-mono text-gray-900 mt-1">{packageData.id}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Media Type</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {getMediaTypeIcon(packageData.mediaType)} {packageData.mediaType}
                  </p>
                </div>
              </div>

              {packageData.description && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Description</label>
                  <p className="text-sm text-gray-700 mt-1">{packageData.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Created</label>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(packageData.createdAt)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Last Updated</label>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(packageData.updatedAt)}</p>
                </div>
              </div>

              {(packageData.validFrom || packageData.validTo) && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <label className="text-xs font-medium text-gray-500 uppercase">Validity Period</label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {packageData.validFrom && (
                      <div>
                        <label className="text-xs text-gray-500">From</label>
                        <p className="text-sm text-gray-900 font-medium">{formatDate(packageData.validFrom)}</p>
                      </div>
                    )}
                    {packageData.validTo && (
                      <div>
                        <label className="text-xs text-gray-500">To</label>
                        <p className="text-sm text-gray-900 font-medium">{formatDate(packageData.validTo)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Package Items */}
          <Card className="border border-violet-100">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-3">
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
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {item.adType.replace(/_/g, ' ')}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Rate Card: {item.rateCardId}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm">
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
        </div>

        {/* Pricing Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border border-violet-200 bg-gradient-to-br from-purple-50 to-blue-50 sticky top-6">
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
          </Card>
        </div>
      </div>
    </div>
  );
}
