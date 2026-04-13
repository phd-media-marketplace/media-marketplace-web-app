import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Eye, Radio, Tv, Calendar, Layers, DollarSign } from "lucide-react";
import { deleteRateCard, listRateCards } from "../api";
import type { RadioMetadata, TVMetadata, RadioAdType, TVAdType, RateCard } from "../types";
import { toast } from "sonner";
import { getFormErrorMessage } from "@/utils/error-handler";
import NoDataCard from "@/components/universal/NoDataCard";
import Loader from "@/components/universal/Loader";
import LoadingError from "@/components/universal/LoadingError";

interface AdTypeCard {
  id: string;
  rateCardId: string;
  mediaPartnerName: string;
  mediaType: 'FM' | 'TV';
  adType: RadioAdType | TVAdType;
  segments: number;
  minRate: number;
  maxRate: number;
  totalRates: number;
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
            totalRates: rates.length,
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
            totalRates: rates.length,
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

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'FM':
        return <Radio className="w-5 h-5" />;
      case 'TV':
        return <Tv className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary tracking-tight">Rate Cards</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your media rates grouped by ad types</p>
        </div>
        <Button 
          className="bg-primary text-white hover:bg-transparent hover:border hover:border-primary hover:text-primary" 
          onClick={() => navigate('/media-partner/rate-cards/create')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Rate Card
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
          {filteredCards.map((rCard) => (
            <Card key={rCard.id} className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
              <CardHeader className="pb-3 bg-linear-to-r from-primary/5 to-secondary/5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {getMediaIcon(rCard.mediaType)}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {formatAdType(rCard.adType)}
                      </CardTitle>
                      <p className="text-xs text-gray-500 mt-1">
                        {rCard.mediaType} - {rCard.mediaPartnerName}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={rCard.isActive ? 'default' : 'secondary'} 
                    className={`shrink-0 px-2 py-1 text-xs ${
                      rCard.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {rCard.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Statistics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                      <Layers className="w-4 h-4" />
                      <span className="text-xs font-medium">Segments</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{rCard.segments}</p>
                  </div>
                  
                  <div className="bg-green-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 mb-1">
                      <Layers className="w-4 h-4" />
                      <span className="text-xs font-medium">Time Slots</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">{rCard.totalRates}</p>
                  </div>
                </div>

                {/* Rate Range */}
                <div className="bg-purple-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-700 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs font-medium">Rate Range</span>
                  </div>
                  {rCard.totalRates > 0 ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-primary/90">
                        GH₵ {rCard.minRate.toLocaleString()}
                      </span>
                      <span className="text-gray-500">-</span>
                      <span className="text-lg font-bold text-primary/90">
                        GH₵ {rCard.maxRate.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No rates configured</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{rCard.totalRates} rate{rCard.totalRates !== 1 ? 's' : ''} configured</p>
                </div>

                {/* Timestamps */}
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-primary/20">
                  <Calendar className="w-3 h-3" />
                  <span>Updated {new Date(rCard.updatedAt).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 hover:bg-secondary text-primary border-secondary"
                    onClick={() => navigate(`/media-partner/rate-cards/${rCard.rateCardId}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1 text-white bg-primary hover:bg-primary/90"
                    onClick={() => navigate(`/media-partner/rate-cards/${rCard.rateCardId}/edit`)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(rCard.rateCardId)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    disabled={deleteMutation.isPending && deleteMutation.variables === rCard.rateCardId}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
