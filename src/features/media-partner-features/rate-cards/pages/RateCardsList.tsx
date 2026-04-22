import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Radio, Tv, Layers} from "lucide-react";
import ListCard, { type StatItem } from "@/features/media-partner-features/Common-Components/ListCard";
import { deleteRateCard, listRateCards } from "../api";
import type { RadioMetadata, TVMetadata, RadioAdType, TVAdType, RateCard } from "../types";
import { toast } from "sonner";
import { getFormErrorMessage } from "@/utils/error-handler";
import NoDataCard from "@/components/universal/NoDataCard";
import Loader from "@/components/universal/Loader";
import LoadingError from "@/components/universal/LoadingError";
import {formatDate} from "@/utils/formatters";
import Header from "@/components/universal/Header";

interface AdTypeCard {
  id: string;
  rateCardId: string;
  mediaPartnerName: string;
  mediaType: 'FM' | 'TV';
  adType: RadioAdType | TVAdType;
  segments: number;
  minRate: number;
  maxRate: number;
  // totalRates: number;
  timeSlots: number;
  isActive: boolean;
  updatedAt: string;
}

export default function RateCardsList() {
  const [selectedMediaType, setSelectedMediaType] = useState<'FM' | 'TV' | 'ALL'>('ALL');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const rateCardsQuery = useQuery({
    queryKey: ['rateCards', selectedMediaType],
    queryFn: () =>
      listRateCards(
        selectedMediaType === 'ALL' ? undefined : { mediaType: selectedMediaType }
      ),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRateCard,
    onSuccess: () => {
      toast.success('Rate card deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['rateCards'] });
    },
    onError: (error: unknown) => {
      toast.error(getFormErrorMessage(error));
    },
  });

  // Transform rate cards into ad type cards
  const getAdTypeCards = (rateCards: RateCard[]): AdTypeCard[] => {
    const adTypeCards: AdTypeCard[] = [];

    rateCards.forEach((rateCard) => {
      if (rateCard.mediaType === 'FM' && rateCard.metadata.mediaType === 'FM') {
        const metadata = rateCard.metadata as RadioMetadata;
        
        metadata.adTypeRates.forEach((adTypeRate, index) => {
          const rates: number[] = [];
          
          // Collect all unit rates from segments
          adTypeRate.RadioSegment.forEach(segment => {
            if (segment.UnitRate) {
              rates.push(segment.UnitRate);
            }
          });

          adTypeCards.push({
            id: `${rateCard.id}-${adTypeRate.adType}-${index}`,
            rateCardId: rateCard.id,
            mediaPartnerName: rateCard.mediaPartnerName,
            mediaType: 'FM',
            adType: adTypeRate.adType,
            segments: adTypeRate.RadioSegment.length,
            minRate: rates.length > 0 ? Math.min(...rates) : 0,
            maxRate: rates.length > 0 ? Math.max(...rates) : 0,
            // totalRates: rates.length,
            timeSlots: adTypeRate.RadioSegment.reduce((acc, segment) => acc + (segment.timeDetails?.length ?? 0), 0),
            isActive: rateCard.isActive || false,
            updatedAt: rateCard.updatedAt,
          });
        });
      } else if (rateCard.mediaType === 'TV' && rateCard.metadata.mediaType === 'TV') {
        const metadata = rateCard.metadata as TVMetadata;
        
        metadata.adTypeRates.forEach((adTypeRate, index) => {
          const rates: number[] = [];
          
          // Collect all unit rates from segments
          adTypeRate.TVSegment.forEach(segment => {
            if (segment.UnitRate) {
              rates.push(segment.UnitRate);
            }
          });

          adTypeCards.push({
            id: `${rateCard.id}-${adTypeRate.adType}-${index}`,
            rateCardId: rateCard.id,
            mediaPartnerName: rateCard.mediaPartnerName,
            mediaType: 'TV',
            adType: adTypeRate.adType,
            segments: adTypeRate.TVSegment.length,
            minRate: rates.length > 0 ? Math.min(...rates) : 0,
            maxRate: rates.length > 0 ? Math.max(...rates) : 0,
            // totalRates: rates.length,
            timeSlots: adTypeRate.TVSegment.reduce((acc, segment) => acc + (segment.timeDetails?.length ?? 0), 0),
            isActive: rateCard.isActive || false,
            updatedAt: rateCard.updatedAt,
          });
        });
      }
    });

    return adTypeCards;
  };

  const adTypeCards = useMemo(
    () => getAdTypeCards(rateCardsQuery.data?.rateCards ?? []),
    [rateCardsQuery.data?.rateCards]
  );

  // Filter by media type
  const filteredCards = selectedMediaType === 'ALL'
    ? adTypeCards
    : adTypeCards.filter(card => card.mediaType === selectedMediaType);

  const handleDelete = (rateCardId: string) => {
    if (window.confirm('Are you sure you want to delete this rate card?')) {
      deleteMutation.mutate(rateCardId);
    }
  };

  // Helper to create media type icon component
  const createMediaTypeIconComponent = (mediaType: string) => {
    function MediaTypeIcon({ className }: { className?: string }) {
      switch (mediaType) {
        case 'FM':
          return <Radio className={className} />;
        case 'TV':
          return <Tv className={className} />;
        default:
          return <Layers className={className} />;
      }
    }
    return MediaTypeIcon;
  };

  const formatAdType = (adType: string): string => {
    return adType
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header
        title="Rate Cards"
        description="Manage your media rates grouped by ad types"
        backbtnVisible={false}
        ctaFunc={() => navigate('/media-partner/rate-cards/create')}
        ctabtnText="Create Rate Card"
        ctaIcon={Plus}
      />

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

      {/* Cards Grid */}
      {rateCardsQuery.isLoading ? (
        <Loader
          title="Loading Rate Cards..."
          message="Fetching the latest rates."
        />
      ) : rateCardsQuery.isError ? (
        <LoadingError
          title="Unable to load rate cards"
          message={getFormErrorMessage(rateCardsQuery.error)}
          onRetry={() => rateCardsQuery.refetch()}
          OnReturn={() => navigate("/media-partner/rate-cards")}
          returnBtnText="Back to Rate Cards"
          className="w-full"
        />

      ) : filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((rCard) => {
            // Build stats array
            const stats: StatItem[] = [
              {
                icon: Layers,
                label: "Segments",
                value: rCard.segments,
                bgColor: "bg-blue-50",
                textColor: "text-blue-700",
              },
              {
                icon: Layers,
                label: "Time Slots",
                value: rCard.timeSlots,
                bgColor: "bg-green-50",
                textColor: "text-green-700",
              },
            ];

            return (
              <ListCard
                key={rCard.id}
                id={rCard.id}
                title={formatAdType(rCard.adType)}
                subtitle={`${rCard.mediaType} - ${rCard.mediaPartnerName}`}
                isActive={rCard.isActive}
                mediaIcon={createMediaTypeIconComponent(rCard.mediaType)}
                stats={stats}
                updatedAt={`Last Updated: ${formatDate(rCard.updatedAt)}`}
                onView={() => navigate(`/media-partner/rate-cards/${rCard.rateCardId}`)}
                onEdit={() => navigate(`/media-partner/rate-cards/${rCard.rateCardId}/edit`)}
                onDelete={() => handleDelete(rCard.rateCardId)}
              />
            );
          })}
        </div>
      ) : (
        <NoDataCard
          title="No Rate Cards Found"
          message="You haven't created any rate cards yet or for the selected Media Type. Start by creating a new rate card to manage your media rates."
          btnText="Create Rate Card"
          redirectFunc={() => navigate('/media-partner/rate-cards/create')}
          className="w-full lg:h-155 flex items-center justify-center"
        />

      )}
    </div>
  );
}
