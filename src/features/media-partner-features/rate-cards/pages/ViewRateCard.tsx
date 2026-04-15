import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRateCard } from "../api";
import type { RadioMetadata, TVMetadata } from "../types";
import { getFormErrorMessage } from "@/utils/error-handler";
import InvalidID from "@/components/universal/InvalidID";
import Loader from "@/components/universal/Loader";
import LoadingError from "@/components/universal/LoadingError";
import RadioRateCardView from "../components/RadioRateCardView";
import TVRateCardView from "../components/TVRateCardView";
import { buildRateCardMetadataItems, buildRateCardSummaryItems } from "../constant";
import Header from "@/components/universal/Header";
import { Edit } from "lucide-react";

export default function ViewRateCard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const rateCardQuery = useQuery({
    queryKey: ['rateCards', id],
    queryFn: () => getRateCard(id as string),
    enabled: Boolean(id),
  });

  const rateCard = rateCardQuery.data;

  if (!id) {
      return (
      <InvalidID
        title="Invalid Rate Card"
        message="A valid rate card ID is required."
        btnText="Back to Rate Cards"
        redirectPath="/media-partner/rate-cards"
      />
    );
  }
  
  if (rateCardQuery.isLoading) {
    return (
      <Loader
        title="Loading Rate Card..."
        message="Fetching rate card details from the server."
        className="flex items-center justify-center py-20"
      />
    );
  }

  if (rateCardQuery.isError) {
    return (
      <LoadingError
        title="Unable to Load Rate Card"
        message={getFormErrorMessage(rateCardQuery.error)}
        onRetry={() => rateCardQuery.refetch()}
        OnReturn={() => navigate("/media-partner/rate-cards")}
        returnBtnText="Back to Rate Cards"
      />
    );
  }

  if (!rateCard) {
    return (
      <InvalidID
        title="Rate Card Not Found"
        message="The requested rate card does not exist."
        btnText="Back to Rate Cards"
        redirectPath="/media-partner/rate-cards"
      />
    );
  }

  const adTypeCount =
    rateCard.mediaType === 'FM' && rateCard.metadata.mediaType === 'FM'
      ? rateCard.metadata.adTypeRates.length
      : rateCard.mediaType === 'TV' && rateCard.metadata.mediaType === 'TV'
        ? rateCard.metadata.adTypeRates.length
        : 0;

  const segmentCount =
    rateCard.mediaType === 'FM' && rateCard.metadata.mediaType === 'FM'
      ? rateCard.metadata.adTypeRates.reduce((count, adTypeRate) => count + adTypeRate.RadioSegment.length, 0)
      : rateCard.mediaType === 'TV' && rateCard.metadata.mediaType === 'TV'
        ? rateCard.metadata.adTypeRates.reduce((count, adTypeRate) => count + adTypeRate.TVSegment.length, 0)
        : 0;

  const summaryItems = buildRateCardSummaryItems({
    mediaPartnerName: rateCard.mediaPartnerName,
    mediaType: rateCard.mediaType === 'FM' ? 'FM' : 'TV',
    adTypeCount,
    segmentCount,
  });

  const metadataItems = buildRateCardMetadataItems({
    rateCardId: rateCard.id,
    createdAt: rateCard.createdAt,
    updatedAt: rateCard.updatedAt,
    isActive: rateCard.isActive ?? false,
  });


  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <Header
        mediaType={rateCard.mediaType}
        title={`${rateCard.mediaType === 'FM' ? 'Radio' : 'TV'} Rate Card`}
        description="Detailed view of the selected rate card"
        backbtnVisible={true}
        returnTofunc={() => navigate('/media-partner/rate-cards')}
        ctaFunc={()=> navigate(`/media-partner/rate-cards/${id}/edit`)}
        ctabtnText="Edit Rate Card"
        ctaIcon={Edit}
      />
      
      {/* Card Details */}
      <div className="relative overflow-hidden space-y-5 rounded-2xl border border-primary/15 bg-linear-to-br from-white via-primary/5 to-secondary/10 p-6 shadow-sm">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-secondary/10 blur-2xl" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {summaryItems.map((item) => (
            <div key={item.label} className={`rounded-xl border p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${item.cardClass}`}>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">{item.label}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`rounded-md p-1.5 ${item.iconClass}`}>
                  <item.icon className="h-4 w-4" />
                </span>
                <p className={`text-sm font-semibold truncate ${item.valueClass}`}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Metadata */}
        <Card className="border border-primary/10 bg-white/90 shadow-xs">
          <CardHeader>
            <CardTitle className="text-primary text-lg font-bold">Card Information</CardTitle>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Overview and lifecycle metadata</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_1fr] gap-4">
            {metadataItems.map((item) => (
              <div key={item.key}>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  {item.icon ? <item.icon className="w-4 h-4" /> : null}
                  {item.label}
                </label>
                {item.key === 'status' ? (
                  <p className="mt-1 flex items-center pl-3 gap-2">
                    <Badge variant={rateCard.isActive ? 'default' : 'secondary'} className={rateCard.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {rateCard.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </p>
                ) : (
                  <p className={`mt-1 text-sm ${item.valueClass}`}>{item.value}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Rates */}
        <div>
          <h3 className="text-xl font-bold text-primary mb-4">Ad Type Rates</h3>
              {rateCard.mediaType === 'FM' && rateCard.metadata.mediaType === 'FM' && <RadioRateCardView metadata={rateCard.metadata as RadioMetadata} />}
          {rateCard.mediaType === 'TV' && rateCard.metadata.mediaType === 'TV' && <TVRateCardView metadata={rateCard.metadata as TVMetadata} />}
        </div>
      </div>

    </div>

  );
}
