import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, Calendar, Radio, Tv } from "lucide-react";
import { dummyRateCards } from "../dummy-data";
import type { RadioMetadata, TVMetadata } from "../types";

export default function ViewRateCard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find rate card by ID (using dummy data)
  const rateCard = dummyRateCards.find(card => card.id === id);

  if (!rateCard) {
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

  const getMediaIcon = () => {
    return rateCard.mediaType === 'FM' ? <Radio className="w-6 h-6" /> : <Tv className="w-6 h-6" />;
  };

  const formatAdType = (adType: string): string => {
    return adType
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const renderFMRates = (metadata: RadioMetadata) => {
    return (
      <div className="space-y-6">
        {metadata.adTypeRates.map((adTypeRate, rateIndex) => (
          <Card key={rateIndex} className="border-2 border-gray-200">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Radio className="w-5 h-5" />
                {formatAdType(adTypeRate.adType)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {adTypeRate.RadioSegment.map((segment, segIndex) => (
                <div key={segIndex} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h4 className="font-semibold text-gray-900 mb-3">Segment {segIndex + 1}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Class</label>
                      <p className="text-base text-gray-900 mt-1">{segment.Class}</p>
                    </div>
                    {segment.ClassName && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Class Name</label>
                        <p className="text-base text-gray-900 mt-1">{segment.ClassName}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Unit Rate</label>
                      <p className="text-base font-semibold text-green-700 mt-1">GH₵ {segment.UnitRate.toLocaleString()}</p>
                    </div>
                    {segment.Duration && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Duration</label>
                        <p className="text-base text-gray-900 mt-1">{formatAdType(segment.Duration)}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <p className="mt-1">
                        <Badge variant={segment.isActive ? 'default' : 'secondary'} className={segment.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {segment.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Time Details</h5>
                    <div className="space-y-2">
                      {segment.timeDetails.map((timeDetail, tdIndex) => (
                        <div key={tdIndex} className="bg-gray-50 p-3 rounded-md flex flex-wrap gap-4">
                          <div>
                            <span className="text-xs font-medium text-gray-600">Days:</span>
                            <span className="ml-2 text-sm text-gray-900">{timeDetail.daysOfWeek}</span>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-600">Time Intervals:</span>
                            <div className="ml-2 inline-flex flex-wrap gap-1">
                              {timeDetail.timeInterval.map((interval, iIndex) => (
                                <Badge key={iIndex} variant="outline" className="text-xs">
                                  {interval}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderTVRates = (metadata: TVMetadata) => {
    return (
      <div className="space-y-6">
        {metadata.adTypeRates.map((adTypeRate, rateIndex) => (
          <Card key={rateIndex} className="border-2 border-gray-200">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Tv className="w-5 h-5" />
                {formatAdType(adTypeRate.adType)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {adTypeRate.TVSegment.map((segment, segIndex) => (
                <div key={segIndex} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h4 className="font-semibold text-gray-900 mb-3">Segment {segIndex + 1}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Class</label>
                      <p className="text-base text-gray-900 mt-1">{segment.Class}</p>
                    </div>
                    {segment.ClassName && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Class Name</label>
                        <p className="text-base text-gray-900 mt-1">{segment.ClassName}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Unit Rate</label>
                      <p className="text-base font-semibold text-green-700 mt-1">GH₵ {segment.UnitRate.toLocaleString()}</p>
                    </div>
                    {segment.adForm && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Ad Form</label>
                        <p className="text-base text-gray-900 mt-1">{formatAdType(segment.adForm)}</p>
                      </div>
                    )}
                    {segment.Duration && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Duration</label>
                        <p className="text-base text-gray-900 mt-1">{formatAdType(segment.Duration)}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <p className="mt-1">
                        <Badge variant={segment.isActive ? 'default' : 'secondary'} className={segment.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {segment.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Time Details</h5>
                    <div className="space-y-2">
                      {segment.timeDetails.map((timeDetail, tdIndex) => (
                        <div key={tdIndex} className="bg-gray-50 p-3 rounded-md flex flex-wrap gap-4">
                          <div>
                            <span className="text-xs font-medium text-gray-600">Days:</span>
                            <span className="ml-2 text-sm text-gray-900">{timeDetail.daysOfWeek}</span>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-600">Time Intervals:</span>
                            <div className="ml-2 inline-flex flex-wrap gap-1">
                              {timeDetail.timeInterval.map((interval, iIndex) => (
                                <Badge key={iIndex} variant="outline" className="text-xs">
                                  {interval}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate('/media-partner/rate-cards')}
            className="border-secondary hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {getMediaIcon()}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-primary tracking-tight">
                  {rateCard.mediaType} Rate Card
                </h2>
                <p className="text-sm text-gray-500 mt-1">{rateCard.mediaPartnerName}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={rateCard.isActive ? 'default' : 'secondary'}
            className={`${rateCard.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {rateCard.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Button 
            onClick={() => navigate(`/media-partner/rate-cards/${id}/edit`)}
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <Card className="border border-violet-100">
        <CardHeader>
          <CardTitle className="text-primary text-lg font-bold">Card Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Created At
            </label>
            <p className="text-base text-gray-900 mt-1">{new Date(rateCard.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Updated At
            </label>
            <p className="text-base text-gray-900 mt-1">{new Date(rateCard.updatedAt).toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Rate Card ID</label>
            <p className="text-base font-mono text-gray-600 mt-1 text-xs">{rateCard.id}</p>
          </div>
        </CardContent>
      </Card>

      {/* Rates */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Ad Type Rates</h3>
        {rateCard.mediaType === 'FM' && rateCard.metadata.mediaType === 'FM' && renderFMRates(rateCard.metadata as RadioMetadata)}
        {rateCard.mediaType === 'TV' && rateCard.metadata.mediaType === 'TV' && renderTVRates(rateCard.metadata as TVMetadata)}
      </div>
    </div>
  );
}
