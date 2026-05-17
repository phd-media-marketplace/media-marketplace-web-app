import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Plus } from "lucide-react";
import type { CreatePackageRequest } from "../types";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { toast } from "sonner";
import { listRateCards } from "../../rate-cards/api";
import type { RateCard, RadioMetadata, TVMetadata } from "../../rate-cards/types";
import PackageBasicInfo from "../components/PackageBasicInfo";
import PackageItem from "../components/PackageItem";
import PricingSummary from "../components/PricingSummary";
import Header from "@/components/universal/Header";
import AssetPreviewCard from "@/components/universal/AssetPreviewCard";
import { createPackage } from "../api";
import { getFormErrorMessage } from "@/utils/error-handler";
import { sanitizePayload } from "@/utils/Sanitizer";

function isRadioRateCardMediaType(mediaType: string): boolean {
  return mediaType === "FM";
}

// Helper function to get available ad types for a media type
function getAdTypesForMediaType(rateCards: RateCard[], mediaType: CreatePackageRequest['mediaType']): string[] {
  const targetMediaType = mediaType === 'FM' ? 'FM' : mediaType;
  const adTypes = new Set<string>();

  rateCards
    .filter((rateCard) => {
      const rateCardMediaType = String(rateCard.mediaType);
      return targetMediaType === 'FM'
        ? isRadioRateCardMediaType(rateCardMediaType) && rateCard.isActive
        : rateCardMediaType === targetMediaType && rateCard.isActive;
    })
    .forEach((rateCard) => {
      if (targetMediaType === 'FM' && rateCard.metadata?.mediaType === 'FM') {
        const metadata = rateCard.metadata as RadioMetadata;
        metadata.adTypeRates.forEach((atr) => adTypes.add(atr.adType));
      } else if (targetMediaType === 'TV' && rateCard.metadata?.mediaType === 'TV') {
        const metadata = rateCard.metadata as TVMetadata;
        metadata.adTypeRates.forEach((atr) => adTypes.add(atr.adType));
      }
    });

  return Array.from(adTypes);
}

// Helper function to get segments for a specific ad type and media type
function getSegmentsForAdType(
  rateCards: RateCard[],
  mediaType: CreatePackageRequest['mediaType'],
  adType: string
): Array<{ class: string; className: string; unitRate: number; rateCardId: string }> {
  const targetMediaType = mediaType === 'FM' ? 'FM' : mediaType;
  const segments: Array<{ class: string; className: string; unitRate: number; rateCardId: string }> = [];

  rateCards
    .filter((rateCard) => {
      const rateCardMediaType = String(rateCard.mediaType);
      return targetMediaType === 'FM'
        ? isRadioRateCardMediaType(rateCardMediaType) && rateCard.isActive
        : rateCardMediaType === targetMediaType && rateCard.isActive;
    })
    .forEach((rateCard) => {
      if (targetMediaType === 'FM' && rateCard.metadata?.mediaType === 'FM') {
        const metadata = rateCard.metadata as RadioMetadata;
        const adTypeRate = metadata.adTypeRates.find((atr) => atr.adType === adType);
        if (adTypeRate) {
          adTypeRate.RadioSegment.filter((seg) => seg.isActive).forEach((seg) => {
            segments.push({
              class: seg.Class,
              className: seg.ClassName || seg.Class,
              unitRate: seg.UnitRate,
              rateCardId: rateCard.id,
            });
          });
        }
      } else if (targetMediaType === 'TV' && rateCard.metadata?.mediaType === 'TV') {
        const metadata = rateCard.metadata as TVMetadata;
        const adTypeRate = metadata.adTypeRates.find((atr) => atr.adType === adType);
        if (adTypeRate) {
          adTypeRate.TVSegment.filter((seg) => seg.isActive).forEach((seg) => {
            segments.push({
              class: seg.Class,
              className: seg.ClassName || seg.Class,
              unitRate: seg.UnitRate,
              rateCardId: rateCard.id,
            });
          });
        }
      }
    });

  return segments;
}

export default function CreatePackage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const rateCardsQuery = useQuery({
    queryKey: ["rateCards", "create-package"],
    queryFn: async () => {
      const [radioRateCards, tvRateCards] = await Promise.all([
        listRateCards({ mediaType: "FM", limit: 1000 }),
        listRateCards({ mediaType: "TV", limit: 1000 }),
      ]);

      return [...radioRateCards.rateCards, ...tvRateCards.rateCards];
    },
    staleTime: 60 * 1000,
  });

  const { control, register, setValue, handleSubmit, formState: { errors } } = useForm<CreatePackageRequest>({
    defaultValues: {
      mediaPartnerId: user?.tenantId || '',
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

  const items = useWatch({ control, name: 'items' }) || [];
  const discount = useWatch({ control, name: 'discount' }) || 0;
  const mediaType = useWatch({ control, name: 'mediaType' });
  const metadata = useWatch({ control, name: 'metadata' }) || {};
  const attachments = Array.isArray((useWatch({ control, name: 'attachments' }) || [])) ? useWatch({ control, name: 'attachments' }) || [] : [];
  const packageImages = attachments.length > 0 ? attachments : (Array.isArray(metadata.packageImages) ? metadata.packageImages : []);
  const rateCards = useMemo(() => rateCardsQuery.data ?? [], [rateCardsQuery.data]);

  // Get available ad types for current media type
  const availableAdTypes = useMemo(
    () => getAdTypesForMediaType(rateCards, mediaType),
    [rateCards, mediaType]
  );

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
    const segments = getSegmentsForAdType(rateCards, mediaType, item.adType);
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

  const createMutation = useMutation({
    mutationFn: createPackage,
    onSuccess:() => {
      queryClient.invalidateQueries({queryKey: ['packages']});
      toast.success('Package created successfully');
      navigate('/media-partner/packages');
    },
    onError: (error: unknown) => {
      const errorMessage = getFormErrorMessage(error);
      toast.error(errorMessage);
    }
  });

  const onSubmit = handleSubmit((data) => {
    try {
      // Ensure media partner ID is included
      if (!user?.mediaPartner?.id) {
        toast.error('Media partner ID not found. Please log in again or Check with your administrator.');
        return;
      }
      //
      const packageData: CreatePackageRequest = {
        ...data,
        mediaPartnerId: user.mediaPartner.id,
        mediaPartnerName: user.mediaPartner.name, // Include media partner name for better context in backend
      };
      // Sanitize payload to remove any undefined or null values before sending to backend
      const sanitizedPackageData = sanitizePayload(packageData);
      // Create the package using the mutation
      createMutation.mutate(sanitizedPackageData);
    } catch (error) {
      const errorMessage = getFormErrorMessage(error);
      toast.error(errorMessage); 
    }
  });

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <Header
        mediaType={mediaType}
        title="Create Package"
        description="Bundle rate cards into attractive packages"
        returnTofunc={() => navigate('/media-partner/packages')}
      />

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
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
                      segments={getSegmentsForAdType(rateCards, mediaType, item.adType)}
                      onAdTypeChange={handleAdTypeChange}
                      onSegmentClassChange={handleSegmentClassChange}
                      onUpdate={updateItem}
                      onRemove={removeItem}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pricing Summary */}
          <div className="lg:col-span-1">
            <PricingSummary 
              totalPrice={totalPrice} 
              discount={discount} 
              finalPrice={finalPrice} 
              IsPreviewView={false} 
            />

            <AssetPreviewCard
              className="mt-6"
              title="Package Assets"
              description="Preview images or flyers for this package"
              assets={packageImages}
              emptyMessage="Upload package flyers or preview images to see them here."
            />
          </div>

        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-6 border-t border-primary/20">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/media-partner/packages')}
            className="border-secondary hover:bg-secondary"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-primary text-white hover:bg-primary/90"
            disabled={createMutation.isPending || items.length === 0}
          >
            <Save className="w-4 h-4 mr-2" />
            {createMutation.isPending ? 'Creating...' : 'Create Package'}
          </Button>
        </div>
      </form>
    </div>
  );
}
