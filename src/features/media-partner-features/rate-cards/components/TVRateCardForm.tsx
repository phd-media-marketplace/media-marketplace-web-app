import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { 
  TVMetadata, 
  TVRate, 
  TVSegment, 
  TimeDetails,
  TVAdType,
  TVSegmentClass,
  // DayOfWeek,
  DaysOfWeekRange,
  TVTimeInterval,
  DurationInMin,
  SpotAdvertForm,
  OtherAdvertForm
} from "../types";
import TimeIntervalCombobox from "./TimeIntervalCombobox";
import AdTypeSelectionDialog from "./AdTypeSelectionDialog";

interface TVRateCardFormProps {
  metadata: TVMetadata;
  setMetadata: (metadata: TVMetadata) => void;
}

/**
 * Available ad types for TV
 */
const AD_TYPE_OPTIONS: { value: TVAdType; label: string }[] = [
  { value: 'SPOT_ADVERTS', label: 'Spot Adverts' },
  { value: 'DOCUMENTARY', label: 'Documentary' },
  { value: 'ANNOUNCEMENTS', label: 'Announcements' },
  { value: 'NEWS_COVERAGE', label: 'News Coverage' },
  { value: 'EXECUTIVE_INTERVIEW', label: 'Executive Interview' },
  { value: 'PREACHING', label: 'Preaching' },
  { value: 'AIRTIME_SALE', label: 'Airtime Sale' },
  { value: 'MEDIA', label: 'Media (Music Videos, Soundtracks)' },
];

/**
 * Available segment classes for TV
 */
const SEGMENT_CLASS_OPTIONS: { value: TVSegmentClass; label: string }[] = [
  { value: 'PREMIUM', label: 'Premium' },
  { value: 'M1', label: 'M1' },
  { value: 'M2', label: 'M2' },
  { value: 'M3', label: 'M3' },
  { value: 'M4', label: 'M4' },
  { value: 'OTHERS', label: 'Others' },
];

/**
 * Available day ranges
 */
const DAY_OPTIONS: { value: DaysOfWeekRange; label: string }[] = [
  { value: 'MONDAY - FRIDAY', label: 'Monday - Friday' },
  { value: 'SATURDAY - SUNDAY', label: 'Saturday - Sunday' },
];

/**
 * Available time intervals for TV
 */
const TIME_INTERVAL_OPTIONS = [
  { value: '4:00 - 6:00', label: '04:00 - 06:00' },
  { value: '6:00 - 10:00', label: '06:00 - 10:00' },
  { value: '10:00 - 16:00', label: '10:00 - 16:00' },
  { value: '12:00 - 14:00', label: '12:00 - 14:00' },
  { value: '14:00 - 19:00', label: '14:00 - 19:00' },
  { value: '16:00 - 22:00', label: '16:00 - 22:00' },
  { value: '19:00 - 00:00', label: '19:00 - 00:00' },
  { value: '20:00 - 00:00', label: '20:00 - 00:00' },
  { value: '00:00 - 05:00', label: '00:00 - 05:00' },
  { value: '05:00 - 10:00', label: '05:00 - 10:00' },
  { value: '05:00 - 20:00', label: '05:00 - 20:00' },
] as const;

/**
 * Spot Advert Form options
 */
const SPOT_ADVERT_FORM_OPTIONS: { value: SpotAdvertForm; label: string }[] = [
  { value: '15_SECS', label: '15 seconds' },
  { value: '30_SECS', label: '30 seconds' },
  { value: '45_SECS', label: '45 seconds' },
  { value: '60_SECS', label: '60 seconds' },
  { value: 'LPMS_LESS_THAN_60_WORDS', label: 'LPMS (Less than 60 words)' },
  { value: 'CRAWLERS', label: 'Crawlers' },
  { value: 'SQUEEZE_BACK', label: 'Squeeze Back' },
  { value: 'LOGO_DISPLAY', label: 'Logo Display' },
  { value: 'PRODUCT_PLACEMENT', label: 'Product Placement' },
  { value: 'PRE_PROMOS', label: 'Pre Promos' },
  { value: 'PRODUCT_ENDORSEMENT', label: 'Product Endorsement' },
  { value: 'OPEN_OR_CLOSE_SLIDEs', label: 'Open or Close Slides' },
  { value: 'POP_UPS', label: 'Pop Ups' },
];

/**
 * Other Advert Form options (for ANNOUNCEMENTS)
 */
const OTHER_ADVERT_FORM_OPTIONS: { value: OtherAdvertForm; label: string }[] = [
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'SOCIAL', label: 'Social' },
];

/**
 * Duration options for different ad types
 */
const DURATION_MINS_OPTIONS: { value: DurationInMin; label: string }[] = [
  { value: '10_MINS', label: '10 minutes' },
  { value: '15_MINS', label: '15 minutes' },
  { value: '30_MINS', label: '30 minutes' },
  { value: '45_MINS', label: '45 minutes' },
  { value: '60_MINS', label: '60 minutes' },
];

/**
 * TV Rate Card Form Component
 * Manages the creation and editing of TV rate cards using TVMetadata structure
 */
export default function TVRateCardForm({ metadata, setMetadata }: TVRateCardFormProps) {
  const [expandedRate, setExpandedRate] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAdType, setSelectedAdType] = useState<TVAdType | null>(null);

  const openAddRateDialog = () => {
    setSelectedAdType(null);
    setIsDialogOpen(true);
  };

  const addRateConfiguration = () => {
    if (!selectedAdType) return;

    const newSegment: TVSegment = {
      Class: 'PREMIUM',
      ClassName: '',
      timeDetails: [
        {
          daysOfWeek: 'MONDAY - FRIDAY',
          timeInterval: [],
        }
      ],
      UnitRate: 0,
      isActive: true,
      // Add adForm for SPOT_ADVERTS and ANNOUNCEMENTS/DOCUMENTARY
      ...(selectedAdType === 'SPOT_ADVERTS' && { adForm: '30_SECS' as SpotAdvertForm }),
      ...(['ANNOUNCEMENTS', 'DOCUMENTARY'].includes(selectedAdType) && { adForm: 'COMMERCIAL' as OtherAdvertForm }),
      // Add Duration for specific types
      ...(['DOCUMENTARY', 'EXECUTIVE_INTERVIEW', 'PREACHING', 'AIRTIME_SALE'].includes(selectedAdType) && 
        { Duration: '30_MINS' as DurationInMin }),
    };

    const newRate: TVRate = {
      adType: selectedAdType,
      TVSegment: [newSegment],
    };

    setMetadata({
      ...metadata,
      adTypeRates: [...metadata.adTypeRates, newRate],
    });
    
    setExpandedRate(metadata.adTypeRates.length);
    setIsDialogOpen(false);
    setSelectedAdType(null);
  };

  const removeRateConfiguration = (rateIndex: number) => {
    setMetadata({
      ...metadata,
      adTypeRates: metadata.adTypeRates.filter((_, i) => i !== rateIndex),
    });
  };

  const addSegment = (rateIndex: number) => {
    const newRates = [...metadata.adTypeRates];
    const currentRate = newRates[rateIndex];
    
    const newSegment: TVSegment = {
      Class: 'PREMIUM',
      ClassName: '',
      timeDetails: [
        {
          daysOfWeek: 'MONDAY - FRIDAY',
          timeInterval: [],
        }
      ],
      UnitRate: 0,
      isActive: true,
      ...(currentRate.adType === 'SPOT_ADVERTS' && { adForm: '30_SECS' as SpotAdvertForm }),
      ...(['ANNOUNCEMENTS', 'DOCUMENTARY'].includes(currentRate.adType) && { adForm: 'COMMERCIAL' as OtherAdvertForm }),
      ...(['DOCUMENTARY', 'EXECUTIVE_INTERVIEW', 'PREACHING', 'AIRTIME_SALE'].includes(currentRate.adType) && 
        { Duration: '30_MINS' as DurationInMin }),
    };
    newRates[rateIndex].TVSegment.push(newSegment);
    setMetadata({ ...metadata, adTypeRates: newRates });
  };

  const removeSegment = (rateIndex: number, segmentIndex: number) => {
    const newRates = [...metadata.adTypeRates];
    newRates[rateIndex].TVSegment.splice(segmentIndex, 1);
    setMetadata({ ...metadata, adTypeRates: newRates });
  };

  const updateSegment = (
    rateIndex: number,
    segmentIndex: number,
    field: keyof TVSegment,
    value: string | number | boolean | TVSegmentClass | TimeDetails[] | DurationInMin | SpotAdvertForm | OtherAdvertForm
  ) => {
    const newRates = [...metadata.adTypeRates];
    newRates[rateIndex].TVSegment[segmentIndex] = {
      ...newRates[rateIndex].TVSegment[segmentIndex],
      [field]: value,
    };
    setMetadata({ ...metadata, adTypeRates: newRates });
  };

  const addTimeDetail = (rateIndex: number, segmentIndex: number) => {
    const newRates = [...metadata.adTypeRates];
    const newTimeDetail: TimeDetails = {
      daysOfWeek: 'MONDAY - FRIDAY',
      timeInterval: [],
    };
    newRates[rateIndex].TVSegment[segmentIndex].timeDetails.push(newTimeDetail);
    setMetadata({ ...metadata, adTypeRates: newRates });
  };

  const removeTimeDetail = (
    rateIndex: number,
    segmentIndex: number,
    timeDetailIndex: number
  ) => {
    const newRates = [...metadata.adTypeRates];
    newRates[rateIndex].TVSegment[segmentIndex].timeDetails.splice(timeDetailIndex, 1);
    setMetadata({ ...metadata, adTypeRates: newRates });
  };

  const updateTimeDetail = (
    rateIndex: number,
    segmentIndex: number,
    timeDetailIndex: number,
    field: keyof TimeDetails,
    value: DaysOfWeekRange | TVTimeInterval[] | string[]
  ) => {
    const newRates = [...metadata.adTypeRates];
    newRates[rateIndex].TVSegment[segmentIndex].timeDetails[timeDetailIndex] = {
      ...newRates[rateIndex].TVSegment[segmentIndex].timeDetails[timeDetailIndex],
      [field]: value,
    };
    setMetadata({ ...metadata, adTypeRates: newRates });
  };

  const updateTimeIntervals = (
    rateIndex: number,
    segmentIndex: number,
    timeDetailIndex: number,
    intervals: string[]
  ) => {
    const newRates = [...metadata.adTypeRates];
    newRates[rateIndex].TVSegment[segmentIndex].timeDetails[timeDetailIndex].timeInterval = intervals as TVTimeInterval[];
    setMetadata({ ...metadata, adTypeRates: newRates });
  };

  return (
    <Card className="border border-primary/5 text-primary">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-primary text-md font-semibold">TV Rate Configurations</CardTitle>
        <Button 
          type="button" 
          onClick={openAddRateDialog} 
          size="sm" 
          variant="outline"
          className="border-secondary hover:bg-secondary hover:text-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Rate
        </Button> 
      </CardHeader>

      <CardContent className="space-y-4">
        {metadata.adTypeRates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No Ad Rates added yet. Click "Add Rate" to add a new rate for various Ad types.</p>
          </div>
        ) : (
          metadata.adTypeRates.map((rate, rateIndex) => (
            <Card key={rateIndex} className="border-2 border-gray-200">
              <CardHeader className="bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      Ad Type {rateIndex + 1} {' - '} {AD_TYPE_OPTIONS.find(opt => opt.value === rate.adType)?.label || rate.adType}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {rate.TVSegment.length} segment{rate.TVSegment.length !== 1 ? 's added' : ' added'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="hover:bg-primary/10"
                      onClick={() => setExpandedRate(expandedRate === rateIndex ? null : rateIndex)}
                    >
                      {expandedRate === rateIndex ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRateConfiguration(rateIndex)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedRate === rateIndex && (
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">Segments & Time Details</h5>
                      <Button
                        type="button"
                        onClick={() => addSegment(rateIndex)}
                        size="sm"
                        variant="outline"
                        className="border-primary hover:bg-primary/10"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Segment
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {rate.TVSegment.map((segment, segmentIndex) => (
                          <div key={segmentIndex} className="border-2 border-gray-200 rounded-lg p-3 md:p-4 bg-gray-50">
                              <div className="flex items-start justify-between mb-3">
                                <h6 className="font-medium text-gray-800">
                                  Segment {segmentIndex + 1}
                                </h6>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSegment(rateIndex, segmentIndex)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-100 -mt-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>

                              {/* Segment Class and Fields */}
                              <div className="space-y-3 md:space-y-4 mb-4 pb-3 border-b border-gray-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-sm text-gray-700 mb-1 block">Segment</label>
                                    <Select
                                      value={segment.Class}
                                      onValueChange={(value) => updateSegment(rateIndex, segmentIndex, 'Class', value as TVSegmentClass)}
                                    >
                                      <SelectTrigger className="w-full input-field">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="border-none bg-white">
                                        {SEGMENT_CLASS_OPTIONS.map(opt => (
                                          <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-700 mb-1 block">Segment Name (Optional)</label>
                                    <Input
                                      type="text"
                                      value={segment.ClassName || ''}
                                      onChange={(e) => updateSegment(rateIndex, segmentIndex, 'ClassName', e.target.value)}
                                      placeholder="e.g., Prime Time"
                                      className="input-field"
                                    />
                                  </div>
                                </div>

                                <div className={`grid grid-cols-1 ${rate.adType === 'ANNOUNCEMENTS' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-3`}>
                                  <div>
                                    <label className="text-sm text-gray-700 mb-1 block">Unit Rate (GH₵)</label>
                                    <Input
                                      type="number"
                                      // value={segment.UnitRate}
                                      value={segment.UnitRate === 0 ? '' : segment.UnitRate}
                                      onChange={(e) => updateSegment(rateIndex, segmentIndex, 'UnitRate', Number(e.target.value))}
                                      placeholder="Enter unit rate"
                                      className="input-field"
                                      min="0"
                                    />
                                  </div>

                                  {/* Ad Form for SPOT_ADVERTS */}
                                  {rate.adType === 'SPOT_ADVERTS' && (
                                    <div>
                                      <label className="text-sm text-gray-700 mb-1 block">Advert Form</label>
                                      <Select
                                        value={segment.adForm as string || ''}
                                        onValueChange={(value) => updateSegment(rateIndex, segmentIndex, 'adForm', value as SpotAdvertForm)}
                                      >
                                        <SelectTrigger className="w-full border border-gray-300">
                                          <SelectValue placeholder="Select form" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-none">
                                          {SPOT_ADVERT_FORM_OPTIONS.map(form => (
                                            <SelectItem key={form.value} value={form.value}>
                                              {form.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}

                                  {/* Ad Form for ANNOUNCEMENTS and DOCUMENTARY */}
                                  {(rate.adType === 'ANNOUNCEMENTS' || rate.adType === 'DOCUMENTARY') && (
                                    <div>
                                      <label className="text-sm text-gray-700 mb-1 block">
                                        {AD_TYPE_OPTIONS.find(opt => opt.value === rate.adType)?.label || rate.adType} Type
                                      </label>
                                      <Select
                                        value={segment.adForm as string || ''}
                                        onValueChange={(value) => updateSegment(rateIndex, segmentIndex, 'adForm', value as OtherAdvertForm)}
                                      >
                                        <SelectTrigger className="w-full border border-gray-300">
                                          <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-none">
                                          {OTHER_ADVERT_FORM_OPTIONS.map(form => (
                                            <SelectItem key={form.value} value={form.value}>
                                              {form.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}

                                  {/* Duration for specific ad types */}
                                  {['DOCUMENTARY', 'EXECUTIVE_INTERVIEW', 'PREACHING', 'AIRTIME_SALE'].includes(rate.adType) && (
                                    <div>
                                      <label className="text-sm text-gray-700 mb-1 block">Duration</label>
                                      <Select
                                        value={segment.Duration as string || ''}
                                        onValueChange={(value) => updateSegment(rateIndex, segmentIndex, 'Duration', value as DurationInMin)}
                                      >
                                        <SelectTrigger className="w-full input-field text-sm">
                                          <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-none">
                                          {DURATION_MINS_OPTIONS.map(duration => (
                                            <SelectItem key={duration.value} value={duration.value}>
                                              {duration.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Time Details */}
                              <div className="mt-3">
                                <div className="flex items-center justify-between mb-3">
                                  <label className="text-sm font-medium text-gray-700">Time Details</label>
                                  <Button
                                    type="button"
                                    onClick={() => addTimeDetail(rateIndex, segmentIndex)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-xs hover:bg-primary/5"
                                  >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Add Time
                                  </Button>
                                </div>
                                  <div className="space-y-3">
                                    {segment.timeDetails.map((timeDetail, timeDetailIndex) => (
                                      <div key={timeDetailIndex} className="bg-white border border-gray-200 rounded-md p-3 space-y-2 md:space-y-0 md:grid md:grid-cols-[1fr_1fr_auto] md:gap-2 md:items-end">
                                        <div className="w-full">
                                          <label className="text-xs text-gray-700 mb-1 block">Days</label>
                                          <Select
                                            value={timeDetail.daysOfWeek}
                                            onValueChange={(value) => updateTimeDetail(rateIndex, segmentIndex, timeDetailIndex, 'daysOfWeek', value as DaysOfWeekRange)}
                                          >
                                            <SelectTrigger className="w-full input-field text-sm">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-none">
                                              {DAY_OPTIONS.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                  {opt.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        <div className="w-full">
                                          <label className="text-xs text-gray-700 mb-1 block">Time Intervals</label>
                                          <TimeIntervalCombobox
                                              selectedIntervals={timeDetail.timeInterval as TVTimeInterval[]}
                                              onIntervalsChange={(intervals) => updateTimeIntervals(rateIndex, segmentIndex, timeDetailIndex, intervals)}
                                              timeIntervalOptions= {TIME_INTERVAL_OPTIONS}
                                            />
                                        </div>

                                        <div className="flex items-end justify-end md:justify-start">
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeTimeDetail(rateIndex, segmentIndex, timeDetailIndex)}
                                            className="px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                              </div>
                          </div>
                        ))}
                      </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </CardContent>

      {/* Ad Type Selection Dialog */}
      <AdTypeSelectionDialog
        AD_TYPE_OPTIONS={AD_TYPE_OPTIONS}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedAdType={selectedAdType}
        setSelectedAdType={setSelectedAdType}
        addRateConfiguration={addRateConfiguration}
      />
    </Card>
  );
}
