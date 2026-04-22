import { Tv } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAdType } from "@/utils/formatters";
import type { TVMetadata } from "../types";

export default function TVRateCardView({ metadata }: { metadata: TVMetadata }) {
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
                  <h4 className="font-semibold text-primary mb-3">Segment {segIndex + 1}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Class</label>
                      <p className="text-base text-gray-600 mt-1">{segment.Class}</p>
                    </div>
                    {segment.ClassName && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Class Name</label>
                        <p className="text-base text-gray-600 mt-1">{segment.ClassName}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Unit Rate</label>
                      <p className="text-base font-semibold text-green-700 mt-1">GH₵ {segment.UnitRate.toLocaleString()}</p>
                    </div>
                    {segment.adForm && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Ad Form</label>
                        <p className="text-base text-gray-600 mt-1">{formatAdType(segment.adForm)}</p>
                      </div>
                    )}
                    {segment.Duration && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Duration</label>
                        <p className="text-base text-gray-600 mt-1">{formatAdType(segment.Duration)}</p>
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
                          {timeDetail.programName && (
                            <div>
                              <span className="text-xs font-medium text-gray-900">Programme Name</span>
                              <span className="ml-2 text-sm text-gray-600">{timeDetail.programName}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-xs font-medium text-gray-900">Days:</span>
                            <span className="ml-2 text-sm text-gray-600">{timeDetail.daysOfWeek}</span>
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