import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import type { CreateRateCardRequest, RadioMetadata, TVMetadata } from "../types";
import { dummyRateCards } from "../dummy-data";
import { toast } from "sonner";
import FMRateCardForm from "../components/FMRateCardForm";
import TVRateCardForm from "../components/TVRateCardForm";

export default function EditRateCard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Find rate card by ID
  const existingRateCard = dummyRateCards.find(card => card.id === id);

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
      setValue('isActive', existingRateCard.isActive || true);
      setValue('metadata', existingRateCard.metadata);
    }
  }, [existingRateCard, setValue]);

  const onSubmit = handleSubmit((data) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Updated rate card:', data);
      toast.success('Rate card updated successfully');
      setIsLoading(false);
      navigate('/media-partner/rate-cards');
    }, 1000);
  });

  if (!existingRateCard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
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
        <div className="flex justify-end gap-3 pt-6 border-t">
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
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
