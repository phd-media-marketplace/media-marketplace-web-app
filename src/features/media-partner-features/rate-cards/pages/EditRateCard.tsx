import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import type { CreateRateCardRequest, RadioMetadata, TVMetadata } from "../types";
import { getRateCard, updateRateCard } from "../api";
import { toast } from "sonner";
import FMRateCardForm from "../components/FMRateCardForm";
import TVRateCardForm from "../components/TVRateCardForm";
import { getFormErrorMessage } from "@/utils/error-handler";
import { sanitizePayload } from "@/utils/Sanitizer";
import Header from "@/components/universal/Header";
import InvalidID from "@/components/universal/InvalidID";
import Loader from "@/components/universal/Loader";
import LoadingError from "@/components/universal/LoadingError";
import NoDataCard from "@/components/universal/NoDataCard";

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

  const { control, setValue, handleSubmit } = useForm<CreateRateCardRequest>({
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

  const mediaType = useWatch({ control, name: 'mediaType' });
  const metadata = useWatch({ control, name: 'metadata' });

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
      <InvalidID
        title="Invalid Rate Card"
        message="A valid rate card ID is required to edit."
        redirectPath="/media-partner/rate-cards"
      />
    );
  }

  if (rateCardQuery.isLoading) {
    return (
      <Loader
        title="Loading Rate Card..."
        message="Fetching existing rate card details."
      />
    );
  }

  if (rateCardQuery.isError) {
    return (
      <LoadingError
        title="Unable to load rate card"
        message={getFormErrorMessage(rateCardQuery.error)}
        OnReturn={() => navigate('/media-partner/rate-cards')}
        onRetry={() => rateCardQuery.refetch()}
        returnBtnText="Back to Rate Cards"
      />
    );
  }

  if (!existingRateCard) {
    return (
      <NoDataCard
        title="Rate Card Not Found"
        message="The requested rate card could not be found."
        redirectFunc={() => navigate('/media-partner/rate-cards')}
        btnText="Back to Rate Cards"
      />
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <Header
        title="Edit Rate Card"
        description="Update your existing rate card"
        returnTofunc={() => navigate('/media-partner/rate-cards')}
       />

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
