import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Plus } from "lucide-react";
import type { UpdatePackageRequest, PackageItem as PackageItemType } from "../types";
import { dummyPackages } from "../dummy-data";
import { toast } from "sonner";
import { dummyRateCards } from "../../rate-cards/dummy-data";
import type { RadioMetadata, TVMetadata } from "../../rate-cards/types";
import PackageBasicInfo from "../components/PackageBasicInfo";
import PackageItem from "../components/PackageItem";
import PricingSummary from "../components/PricingSummary";
import NoDataCard from "@/components/universal/NoDataCard";

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
  items: Omit<PackageItemType, 'totalPrice'>[];
  discount: number;
  reach: number;
  demographics: string[];
  location?: string;
  packageDurationValue: number;
  packageDurationUnit: string;
  isActive: boolean;
  metadata: Record<string, unknown>;
};

export default function EditPackage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const existingPackage = dummyPackages.find((pkg) => pkg.id === id);

  const { control, register, setValue, handleSubmit, formState: { errors } } = useForm<PackageFormData>({
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
      metadata: {},
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
      setValue('metadata', existingPackage.metadata || {});
      
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

  const items = useWatch({ control, name: 'items' }) || [];
  const discount = useWatch({ control, name: 'discount' }) || 0;
  const mediaType = useWatch({ control, name: 'mediaType' });

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
      <NoDataCard
        title="Package Not Found"
        message = "The package you're trying to edit doesn't exist."
        btnText = "Back to Packages"
        redirectFunc = {() => navigate('/media-partner/packages')}
      />
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
        <PackageBasicInfo control={control} register={register} setValue={setValue} errors={errors} />

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
                <PackageItem
                  key={index}
                  item={item}
                  index={index}
                  availableAdTypes={availableAdTypes}
                  segments={getSegmentsForAdType(mediaType, item.adType)}
                  onAdTypeChange={handleAdTypeChange}
                  onSegmentClassChange={handleSegmentClassChange}
                  onUpdate={updateItem}
                  onRemove={removeItem}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Price Summary */}
        <PricingSummary totalPrice={totalPrice} discount={discount} finalPrice={finalPrice} />

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
