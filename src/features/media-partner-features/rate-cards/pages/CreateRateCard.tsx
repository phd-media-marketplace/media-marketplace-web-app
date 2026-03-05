import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { createRateCard } from "../api";
import type { CreateRateCardRequest, FMMetadata, TVMetadata, OOHMetadata, DIGITALMetadata } from "../types";
import { toast } from "sonner";
import FMRateCardForm from "../components/FMRateCardForm";
import TVRateCardForm from "../components/TVRateCardForm";
import OOHRateCardForm from "../components/OOHRateCardForm";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { getFormErrorMessage } from "@/utils/error-handler";

/**
 * CreateRateCard Component
 * Handles creation of new rate cards for media partners
 * Each media type manages its own fields through dedicated form components
 */
export default function CreateRateCard() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { watch, setValue, handleSubmit } = useForm<CreateRateCardRequest>({
    defaultValues: {
      mediaPartnerId: user?.tenantId || '',
      mediaType: 'FM',
      isActive: true,
      metadata: {
        mediaType: 'FM',
        segments: [],
      } as FMMetadata,
    }
  });

  const mediaType = watch('mediaType');
  const metadata = watch('metadata');

  /**
   * Mutation for creating a new rate card
   * Invalidates cache and navigates on success
   */
  const createMutation = useMutation({
    mutationFn: createRateCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rateCards'] });
      toast.success('Rate card created successfully');
      navigate('/media-partner/rate-cards');
    },
    onError: (error: unknown) => {
      const errorMessage = getFormErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  /**
   * Form submission handler
   * Uses react-hook-form to manage form data
   */
  const onSubmit = handleSubmit((data) => {
    if (!user?.tenantId) {
      toast.error('Media partner ID not found');
      return;
    }

    const rateCardData: CreateRateCardRequest = {
      ...data,
      mediaPartnerId: user.tenantId,
    };

    createMutation.mutate(rateCardData);
  });

  /**
   * Handles media type change and resets metadata accordingly
   */
  const handleMediaTypeChange = (value: 'FM' | 'TV' | 'OOH' | 'DIGITAL') => {
    setValue('mediaType', value);
    
    // Reset metadata based on media type
    if (value === 'FM') {
      setValue('metadata', { mediaType: 'FM', segments: [] } as FMMetadata);
    } else if (value === 'TV') {
      setValue('metadata', { mediaType: 'TV', segments: [] } as TVMetadata);
    } else if (value === 'OOH') {
      setValue('metadata', { mediaType: 'OOH' } as OOHMetadata);
    } else {
      setValue('metadata', { mediaType: 'DIGITAL' } as DIGITALMetadata);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary tracking-tight">Create Rate Card</h2>
          <p className="text-sm text-gray-500 mt-1">Add a new rate card for your media offerings</p>
        </div>
        <Button 
          size="sm" 
          onClick={() => navigate('/media-partner/rate-cards')}
          className="border border-secondary bg-transparent hover:bg-secondary transition-colors transform-border duration-5"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Form for creating rate card */}
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Media Type Selection */}
        <Card className="border border-violet-100">
          <CardHeader>
            <CardTitle className="text-primary text-lg font-bold">Media Type and Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <label className="block text-sm text-primary font-medium mb-1">Select Media Type <span className="text-red-500">*</span></label>
              <p className="text-xs text-gray-500 mb-2">
                Choose the advertising medium for this rate card
              </p>
              <Select value={mediaType} onValueChange={handleMediaTypeChange}>
                <SelectTrigger className="w-full border border-gray-300 bg-white hover:bg-gray-50 focus:ring-1 focus:ring-secondary focus:outline-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-violet-100">
                  <SelectItem value="FM">📻 FM Radio</SelectItem>
                  <SelectItem value="TV">📺 TV</SelectItem>
                  <SelectItem value="OOH">🏙️ Out-of-Home (OOH)</SelectItem>
                  <SelectItem value="DIGITAL">💻 Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Media Type Specific Forms */}
            {mediaType === 'FM' ? (
              <FMRateCardForm 
                metadata={metadata as FMMetadata} 
                setMetadata={(data) => setValue('metadata', data)} 
              />
            ) : mediaType === 'TV' ? (
              <TVRateCardForm 
                metadata={metadata as TVMetadata} 
                setMetadata={(data) => setValue('metadata', data)} 
              />
            ) : mediaType === 'OOH' ? (
              <OOHRateCardForm 
                metadata={metadata as OOHMetadata} 
                setMetadata={(data) => setValue('metadata', data)} 
              />
            ) : (
              <Card className="border border-primary/5 text-center">
                <CardHeader>
                  <CardTitle>Digital Advertising Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-sm">Digital rate card form coming soon...</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>


        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/media-partner/rate-cards')}
            className="border border-secondary hover:bg-secondary"
            >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createMutation.isPending} 
            className="bg-primary text-white hover:bg-transparent hover:text-primary border border-primary transition-colors transform-border duration-300"
          >
            <Save className="w-4 h-4 mr-2" />
            {createMutation.isPending ? 'Creating...' : 'Create Rate Card'}
          </Button>
        </div>
      </form>
    </div>
  );
}
