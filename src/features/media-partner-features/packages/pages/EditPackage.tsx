import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import type { UpdatePackageRequest, PackageItem } from "../types";
import { dummyPackages } from "../dummy-data";
import { toast } from "sonner";
import { dummyRateCards } from "../../rate-cards/dummy-data";
import type { RadioMetadata, TVMetadata } from "../../rate-cards/types";

// Helper function to get available ad types for a media type
function getAdTypesForMediaType(mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL'): string[] {
  const rateCards = dummyRateCards.filter(rc => rc.mediaType === mediaType && rc.isActive);
  const adTypes = new Set<string>();
  
  rateCards.forEach(rc => {
    if (mediaType === 'FM' && rc.metadata?.mediaType === 'FM') {
      const metadata = rc.metadata as RadioMetadata;
      metadata.adTypeRates.forEach(atr => adTypes.add(atr.adType));
    } else if (mediaType === 'TV' && rc.metadata?.mediaType === 'TV') {
      const metadata = rc.metadata as TVMetadata;
      metadata.adTypeRates.forEach(atr => adTypes.add(atr.adType));
    }
  });
  
  return Array.from(adTypes);
}

// Helper function to get segments for a specific ad type and media type
function getSegmentsForAdType(mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL', adType: string): Array<{ class: string; className: string; unitRate: number; rateCardId: string }> {
  const rateCards = dummyRateCards.filter(rc => rc.mediaType === mediaType && rc.isActive);
  const segments: Array<{ class: string; className: string; unitRate: number; rateCardId: string }> = [];
  
  rateCards.forEach(rc => {
    if (mediaType === 'FM' && rc.metadata?.mediaType === 'FM') {
      const metadata = rc.metadata as RadioMetadata;
      const adTypeRate = metadata.adTypeRates.find(atr => atr.adType === adType);
      if (adTypeRate) {
        adTypeRate.RadioSegment.filter(seg => seg.isActive).forEach(seg => {
          segments.push({
            class: seg.Class,
            className: seg.ClassName || seg.Class,
            unitRate: seg.UnitRate,
            rateCardId: rc.id
          });
        });
      }
    } else if (mediaType === 'TV' && rc.metadata?.mediaType === 'TV') {
      const metadata = rc.metadata as TVMetadata;
      const adTypeRate = metadata.adTypeRates.find(atr => atr.adType === adType);
      if (adTypeRate) {
        adTypeRate.TVSegment.filter(seg => seg.isActive).forEach(seg => {
          segments.push({
            class: seg.Class,
            className: seg.ClassName || seg.Class,
            unitRate: seg.UnitRate,
            rateCardId: rc.id
          });
        });
      }
    }
  });
  
  return segments;
}

type PackageFormData = {
  packageName: string;
  description?: string;
  mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
  items: Omit<PackageItem, 'totalPrice'>[];
  discount: number;
  reach: number;
  demographics: string[];
  location?: string;
  packageDurationValue: number;
  packageDurationUnit: string;
  isActive: boolean;
};

export default function EditPackage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const existingPackage = dummyPackages.find((pkg) => pkg.id === id);

  const { register, watch, setValue, handleSubmit, formState: { errors } } = useForm<PackageFormData>({
    defaultValues: {
      packageName: '',
      description: '',
      mediaType: 'FM',
      items: [],
      discount: 0,
      reach: 0,
      demographics: [],
      location: '',
      packageDurationValue: 1,
      packageDurationUnit: 'DAYS',
      isActive: true,
    }
  });

  useEffect(() => {
    if (existingPackage) {
      setValue('packageName', existingPackage.packageName);
      setValue('description', existingPackage.description || '');
      setValue('mediaType', existingPackage.mediaType);
      setValue('discount', existingPackage.discount || 0);
      setValue('reach', existingPackage.reach || 0);
      setValue('demographics', existingPackage.demographics || []);
      setValue('location', existingPackage.location || '');
      setValue('packageDurationValue', existingPackage.packageDurationValue || 1);
      setValue('packageDurationUnit', existingPackage.packageDurationUnit || 'DAYS');
      setValue('isActive', existingPackage.isActive);
      
      // Convert items to form format (without totalPrice)
      const formItems = existingPackage.items.map((item) => ({
        rateCardId: item.rateCardId,
        adType: item.adType,
        segmentId: item.segmentId,
        segmentClass: item.segmentClass,
        quantity: item.quantity,
        unitRate: item.unitRate,
      }));
      setValue('items', formItems);
    }
  }, [existingPackage, setValue]);

  const items = watch('items') || [];
  const discount = watch('discount') || 0;
  const mediaType = watch('mediaType');

  // Get available ad types for current media type
  const availableAdTypes = useMemo(() => getAdTypesForMediaType(mediaType), [mediaType]);

  const addItem = () => {
    setValue('items', [
      ...items,
      {
        rateCardId: '',
        adType: '',
        segmentId: '',
        segmentClass: '',
        quantity: 1,
        unitRate: 0,
      }
    ]);
  };

  const removeItem = (index: number) => {
    setValue('items', items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setValue('items', newItems);
  };

  // Handle ad type selection - reset dependent fields
  const handleAdTypeChange = (index: number, adType: string) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      adType,
      segmentClass: '',
      segmentId: '',
      rateCardId: '',
      unitRate: 0,
    };
    setValue('items', newItems);
  };

  // Handle segment class selection - auto-populate unit rate and rate card ID
  const handleSegmentClassChange = (index: number, segmentClass: string) => {
    const item = items[index];
    const segments = getSegmentsForAdType(mediaType, item.adType);
    const selectedSegment = segments.find(seg => seg.class === segmentClass);
    
    if (selectedSegment) {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        segmentClass,
        segmentId: `${selectedSegment.rateCardId}-${segmentClass}`,
        rateCardId: selectedSegment.rateCardId,
        unitRate: selectedSegment.unitRate,
      };
      setValue('items', newItems);
    }
  };

  const calculateTotals = () => {
    const totalPrice = items.reduce((sum, item) => sum + (item.quantity * item.unitRate), 0);
    const discountAmount = (totalPrice * discount) / 100;
    const finalPrice = totalPrice - discountAmount;
    return { totalPrice, discountAmount, finalPrice };
  };

  const { totalPrice, finalPrice } = calculateTotals();

  const onSubmit = handleSubmit((data) => {
    if (!id) {
      toast.error('Package ID not found');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updateData: UpdatePackageRequest = {
        id,
        ...data,
      };
      console.log('Package updated:', updateData);
      toast.success('Package updated successfully');
      setIsLoading(false);
      navigate(`/media-partner/packages/${id}`);
    }, 1000);
  });

  if (!existingPackage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Package Not Found</h3>
          <p className="text-sm text-gray-500 mt-1">The package you're trying to edit doesn't exist.</p>
        </div>
        <Button onClick={() => navigate('/media-partner/packages')}>
          Back to Packages
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary tracking-tight">Edit Package</h2>
          <p className="text-sm text-gray-500 mt-1">Update package details and items</p>
        </div>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => navigate(`/media-partner/packages/${id}`)}
          className="border-secondary hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="border border-violet-100">
          <CardHeader>
            <CardTitle className="text-primary text-lg font-bold">Package Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-primary font-medium mb-1">
                  Package Name <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('packageName', { required: 'Package name is required' })}
                  placeholder="e.g., Prime Time Bundle"
                  className={errors.packageName ? 'border-red-500' : ''}
                />
                {errors.packageName && (
                  <p className="text-xs text-red-500 mt-1">{errors.packageName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-primary font-medium mb-1">
                  Media Type <span className="text-red-500">*</span>
                </label>
                <Select value={watch('mediaType')} onValueChange={(value) => setValue('mediaType', value as 'FM' | 'TV' | 'OOH' | 'DIGITAL')}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FM">📻 FM Radio</SelectItem>
                    <SelectItem value="TV">📺 TV</SelectItem>
                    <SelectItem value="OOH">🏙️ Out-of-Home</SelectItem>
                    <SelectItem value="DIGITAL">💻 Digital</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-primary font-medium mb-1">Description</label>
              <Textarea
                {...register('description')}
                placeholder="Describe your package..."
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-primary font-medium mb-1">
                  Estimated Reach <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  {...register('reach', { required: 'Reach is required', min: 0, valueAsNumber: true })}
                  placeholder="e.g., 1000000"
                  className={errors.reach ? 'border-red-500' : ''}
                />
                {errors.reach && (
                  <p className="text-xs text-red-500 mt-1">{errors.reach.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Number of people this package can reach</p>
              </div>

              <div>
                <label className="block text-sm text-primary font-medium mb-1">Location</label>
                <Input
                  {...register('location')}
                  placeholder="e.g., Greater Accra, Ghana"
                />
                <p className="text-xs text-gray-500 mt-1">Geographic coverage area</p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-primary font-medium mb-1">
                Target Demographics
              </label>
              <Input
                value={watch('demographics')?.join(', ') || ''}
                placeholder="e.g., Adults 25-45, Urban Youth (comma separated)"
                onChange={(e) => {
                  const demographics = e.target.value.split(',').map(d => d.trim()).filter(d => d);
                  setValue('demographics', demographics);
                }}
              />
              <p className="text-xs text-gray-500 mt-1">Enter demographics separated by commas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-primary font-medium mb-1">
                  Package Duration <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  {...register('packageDurationValue', { required: true, min: 1, valueAsNumber: true })}
                  placeholder="1"
                  min="1"
                  className={errors.packageDurationValue ? 'border-red-500' : ''}
                />
              </div>

              <div>
                <label className="block text-sm text-primary font-medium mb-1">
                  Duration Unit <span className="text-red-500">*</span>
                </label>
                <Select 
                  value={watch('packageDurationUnit')} 
                  onValueChange={(value) => setValue('packageDurationUnit', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAYS">Days</SelectItem>
                    <SelectItem value="WEEKS">Weeks</SelectItem>
                    <SelectItem value="MONTHS">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm text-primary font-medium mb-1">Discount (%)</label>
                <Input
                  type="number"
                  {...register('discount', { min: 0, max: 100, valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Package Items */}
        <Card className="border border-violet-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-primary text-lg font-bold">Package Items</CardTitle>
            <Button 
              type="button" 
              onClick={addItem}
              size="sm"
              variant="outline"
              className="border-secondary hover:bg-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                No items added yet. Click "Add Item" to get started.
              </p>
            ) : (
              items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Item {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">
                        Ad Type <span className="text-red-500">*</span>
                      </label>
                      <Select 
                        value={item.adType} 
                        onValueChange={(value) => handleAdTypeChange(index, value)}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select ad type" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableAdTypes.length === 0 ? (
                            <SelectItem value="none" disabled>No ad types available</SelectItem>
                          ) : (
                            availableAdTypes.map(adType => (
                              <SelectItem key={adType} value={adType}>
                                {adType.replace(/_/g, ' ')}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">
                        Segment Class <span className="text-red-500">*</span>
                      </label>
                      <Select 
                        value={item.segmentClass || ''} 
                        onValueChange={(value) => handleSegmentClassChange(index, value)}
                        disabled={!item.adType}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select segment" />
                        </SelectTrigger>
                        <SelectContent>
                          {!item.adType ? (
                            <SelectItem value="none" disabled>Select ad type first</SelectItem>
                          ) : (
                            getSegmentsForAdType(mediaType, item.adType).map(segment => (
                              <SelectItem key={segment.class} value={segment.class}>
                                {segment.class} - {segment.className}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Quantity</label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                        className="text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Unit Rate (GH₵)</label>
                      <Input
                        type="number"
                        value={item.unitRate}
                        disabled
                        className="text-sm bg-gray-50 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Auto-populated from rate card</p>
                    </div>

                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Total</label>
                      <div className="h-9 px-3 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-md border border-violet-200 font-semibold text-sm text-primary">
                        GH₵ {(item.quantity * item.unitRate).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Price Summary */}
        <Card className="border border-violet-100 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-primary text-lg font-bold">Price Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-900">GH₵ {totalPrice.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between items-center text-green-700">
                <span>Discount ({discount}%):</span>
                <span className="font-semibold">- GH₵ {((totalPrice * discount) / 100).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
              <span className="text-lg font-bold text-gray-900">Final Price:</span>
              <span className="text-2xl font-bold text-primary">GH₵ {finalPrice.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/media-partner/packages/${id}`)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Package
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
