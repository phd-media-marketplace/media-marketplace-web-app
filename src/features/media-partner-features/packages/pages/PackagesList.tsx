import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Eye, Radio, Tv, Calendar, Package as PackageIcon, DollarSign, Percent } from "lucide-react";
import { dummyPackages } from "../dummy-data";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function PackagesList() {
  const [selectedMediaType, setSelectedMediaType] = useState<'FM' | 'TV' | 'ALL'>('ALL');
  const navigate = useNavigate();

  // Filter packages by media type
  const filteredPackages = selectedMediaType === 'ALL'
    ? dummyPackages
    : dummyPackages.filter(pkg => pkg.mediaType === selectedMediaType);

  const handleDelete = (id: string) => {
    console.log('Delete package:', id);
    if (window.confirm('Are you sure you want to delete this package?')) {
      toast.info('Delete functionality will be implemented with API integration');
    }
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'FM':
        return <Radio className="w-5 h-5" />;
      case 'TV':
        return <Tv className="w-5 h-5" />;
      default:
        return <PackageIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary tracking-tight">Packages</h2>
          <p className="text-sm text-gray-500 mt-1">Create and manage advertising packages for your clients</p>
        </div>
        <Button 
          className="bg-primary text-white hover:bg-transparent hover:border hover:border-primary hover:text-primary" 
          onClick={() => navigate('/media-partner/packages/create')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Package
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={selectedMediaType === 'ALL' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedMediaType('ALL')}
          className={selectedMediaType === 'ALL' ? 'bg-primary text-white' : 'border-secondary hover:bg-secondary'}
        >
          All
        </Button>
        <Button
          variant={selectedMediaType === 'FM' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedMediaType('FM')}
          className={selectedMediaType === 'FM' ? 'bg-primary text-white' : 'border-secondary hover:bg-secondary'}
        >
          <Radio className="w-4 h-4 mr-2" />
          FM Radio
        </Button>
        <Button
          variant={selectedMediaType === 'TV' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedMediaType('TV')}
          className={selectedMediaType === 'TV' ? 'bg-primary text-white' : 'border-secondary hover:bg-secondary'}
        >
          <Tv className="w-4 h-4 mr-2" />
          TV
        </Button>
      </div>

      {/* Packages Grid */}
      {filteredPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
              <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {getMediaIcon(pkg.mediaType)}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {pkg.packageName}
                      </CardTitle>
                      <p className="text-xs text-gray-500 mt-1">
                        {pkg.mediaType} Package
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={pkg.isActive ? 'default' : 'secondary'} 
                    className={`shrink-0 px-2 py-1 text-xs ${
                      pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {pkg.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4 space-y-4">
                {/* Description */}
                {pkg.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{pkg.description}</p>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                      <PackageIcon className="w-4 h-4" />
                      <span className="text-xs font-medium">Items</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{pkg.items.length}</p>
                  </div>
                  
                  {pkg.discount && pkg.discount > 0 && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700 mb-1">
                        <Percent className="w-4 h-4" />
                        <span className="text-xs font-medium">Discount</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900">{pkg.discount}%</p>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-700 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs font-medium">Package Price</span>
                  </div>
                  <div className="space-y-1">
                    {pkg.discount && pkg.discount > 0 && (
                      <p className="text-sm text-gray-500 line-through">
                        GH₵ {pkg.totalPrice.toLocaleString()}
                      </p>
                    )}
                    <p className="text-2xl font-bold text-purple-900">
                      GH₵ {pkg.finalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Validity */}
                {pkg.validFrom && pkg.validTo && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Valid: {new Date(pkg.validFrom).toLocaleDateString()} - {new Date(pkg.validTo).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/media-partner/packages/${pkg.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/media-partner/packages/${pkg.id}/edit`)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(pkg.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-primary/50 text-center">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <motion.div
              className="flex items-center justify-center mb-1"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="p-4 bg-gradient-to-br from-primary/50 to-secondary/50 rounded-full mb-4">
                <PackageIcon className="w-8 h-8 text-primary/90" />
              </div>
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No packages found</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first package to get started</p>
            <Button 
              className="bg-primary text-white hover:bg-transparent hover:border hover:border-primary hover:text-primary"
              onClick={() => navigate('/media-partner/packages/create')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Package
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
