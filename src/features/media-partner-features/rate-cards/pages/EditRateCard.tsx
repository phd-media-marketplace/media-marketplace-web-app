import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import type { CreateRateCardRequest, RadioMetadata, TVMetadata } from "../types";
import { getRateCard, updateRateCard } from "../api";
import { toast } from "sonner";
import FMRateCardForm from "../components/FMRateCardForm";
import TVRateCardForm from "../components/TVRateCardForm";
import { getFormErrorMessage } from "@/utils/error-handler";
import { sanitizePayload } from "@/utils/Sanitizer";

export default function EditRateCard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const rateCardQuery = useQuery({
    queryKey: ['rateCards', id],
    queryFn: () => getRateCard(id as string),
    enabled: Boolean(id),
  });

  const existingRateCard = rateCardQuery.data;

  const { watch, setValue, handleSubmit } = useForm<CreateRateCardRequest>({
    defaultValues: existingRateCard || {
      mediaPartnerId: '',
      mediaType: 'FM',
      isActive: true,
      metadata: {
        mediaType: 'FM',
        adTypeRates: [],
      } as RadioMetadata,
    }
  });

  const mediaType = watch('mediaType');
  const metadata = watch('metadata');

  useEffect(() => {
    if (existingRateCard) {
      setValue('mediaPartnerId', existingRateCard.mediaPartnerId);
      setValue('mediaType', existingRateCard.mediaType);
      setValue('isActive', existingRateCard.isActive ?? true);
      setValue('metadata', existingRateCard.metadata);
    }
  }, [existingRateCard, setValue]);

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<CreateRateCardRequest>) =>
      updateRateCard(id as string, payload),
    onSuccess: () => {
      toast.success('Rate card updated successfully');
      queryClient.invalidateQueries({ queryKey: ['rateCards'] });
      queryClient.invalidateQueries({ queryKey: ['rateCards', id] });
      navigate('/media-partner/rate-cards');
    },
    onError: (error: unknown) => {
      toast.error(getFormErrorMessage(error));
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (!id) {
      toast.error('Rate card ID is missing.');
      return;
    }

    setIsLoading(true);

    const sanitizedData = sanitizePayload(data);
    updateMutation.mutate(sanitizedData);
  });

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Invalid Rate Card</h2>
        <p className="text-gray-500">A valid rate card ID is required.</p>
        <Button onClick={() => navigate('/media-partner/rate-cards')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Rate Cards
        </Button>
      </div>
    );
  }

  if (rateCardQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Loading Rate Card...</h2>
        <p className="text-gray-500">Fetching existing rate card details.</p>
      </div>
    );
  }

  if (rateCardQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Unable to load rate card</h2>
        <p className="text-gray-500">{getFormErrorMessage(rateCardQuery.error)}</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => rateCardQuery.refetch()}>
            Retry
          </Button>
          <Button onClick={() => navigate('/media-partner/rate-cards')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Rate Cards
          </Button>
        </div>
      </div>
    );
  }

  if (!existingRateCard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Rate Card Not Found</h2>
        <p className="text-gray-500">The requested rate card could not be found.</p>
        <Button onClick={() => navigate('/media-partner/rate-cards')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Rate Cards
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary tracking-tight">Edit Rate Card</h2>
          <p className="text-sm text-gray-500 mt-1">Update your existing rate card</p>
        </div>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => navigate('/media-partner/rate-cards')}
          className="border-secondary hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Media Type Info */}
        <Card className="border border-violet-100">
          <CardHeader>
            <CardTitle className="text-primary text-lg font-bold">Media Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900">
                {mediaType === 'FM' ? '📻 FM Radio' : '📺 TV'}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Media type cannot be changed after creation
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Media Type Specific Forms */}
        {mediaType === 'FM' ? (
          <FMRateCardForm 
            metadata={metadata as RadioMetadata} 
            setMetadata={(data) => setValue('metadata', data)} 
          />
        ) : mediaType === 'TV' ? (
          <TVRateCardForm 
            metadata={metadata as TVMetadata} 
            setMetadata={(data) => setValue('metadata', data)} 
          />
        ) : null}

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-6 border-t border-primary/20">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/media-partner/rate-cards')}
            className="border-secondary hover:bg-secondary"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-primary text-white hover:bg-primary/90"
            disabled={isLoading || updateMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading || updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
