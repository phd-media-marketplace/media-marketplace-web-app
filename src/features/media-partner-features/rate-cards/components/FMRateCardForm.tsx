import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { 
  RadioMetadata, 
  RadioRate, 
  RadioSegment, 
  TimeDetails,
  RadioAdType,
  RadioSegmentClass,
  // DayOfWeek,
  DaysOfWeekRange,
  TimeInterval,
  DurationInSec,
  DurationInMin,
  RadioSegmentAnnouncementClass
} from "../types";
import TimeIntervalCombobox from "./TimeIntervalCombobox";
import { TIME_INTERVAL_OPTIONS } from "../constant";
import AdTypeSelectionDialog from "./AdTypeSelectionDialog";

interface RadioRateCardFormProps {
  metadata: RadioMetadata;
  setMetadata: (metadata: RadioMetadata) => void;
}


/**
 * Available ad types for FM radio
 */
const AD_TYPE_OPTIONS: { value: RadioAdType; label: string }[] = [
  { value: 'ANNOUNCEMENTS', label: 'Announcements' },
  { value: 'INTERVIEWS', label: 'Interviews' },
  { value: 'LIVE_PRESENTER_MENTIONS', label: 'Live Presenter Mentions' },
  { value: 'JINGLES', label: 'Jingles' },
  { value: 'NEWS_COVERAGE', label: 'News Coverage' },
];

/**
 * Available segment classes for FM radio
 */
const SEGMENT_CLASS_OPTIONS: { value: RadioSegmentClass; label: string }[] = [
  { value: 'A1', label: 'A1' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'P', label: 'P' },
  { value: 'P1', label: 'P1' },
  { value: 'P2', label: 'P2' },
  { value: 'OTHERS', label: 'Others' },
];

const ANNOUNCEMENT_SEGMENT_OPTIONS: { value: RadioSegmentAnnouncementClass; label: string }[] = [
  { value: 'COMMERCIAL/PRODUCTS', label: 'Commercial/Products' },
  { value: 'POLICE_EXTRACT', label: 'Police Extract' },
  { value: 'FUNERAL', label: 'Funeral' },
  { value: 'SOCIAL', label: 'Social' },
  { value: 'PROMOTIONS', label: 'Promotions' },
  { value: 'OTHER', label: 'Other' },
];

/**
 * Available day ranges
 */
const DAY_OPTIONS: { value: DaysOfWeekRange; label: string }[] = [
  { value: 'MONDAY - FRIDAY', label: 'Monday - Friday' },
  { value: 'SATURDAY - SUNDAY', label: 'Saturday - Sunday' },
];


/**
 * Duration options for different ad types
 */
const JINGLE_DURATIONS: { value: DurationInSec; label: string }[] = [
  { value: '10_SECS', label: '10 seconds' },
  { value: '15_SECS', label: '15 seconds' },
  { value: '20_SECS', label: '20 seconds' },
  { value: '25_SECS', label: '25 seconds' },
  { value: '30_SECS', label: '30 seconds' },
  { value: '35_SECS', label: '35 seconds' },
  { value: '40_SECS', label: '40 seconds' },
  { value: '45_SECS', label: '45 seconds' },
  { value: '50_SECS', label: '50 seconds' },
  { value: '55_SECS', label: '55 seconds' },
  { value: '60_SECS', label: '60 seconds' },
];

const INTERVIEW_DURATIONS: { value: DurationInMin; label: string }[] = [
  { value: '10_MINS', label: '10 minutes' },
  { value: '15_MINS', label: '15 minutes' },
  { value: '30_MINS', label: '30 minutes' },
  { value: '45_MINS', label: '45 minutes' },
  { value: '60_MINS', label: '60 minutes' },
];

/**
 * FM Rate Card Form Component
 * Manages the creation and editing of FM radio rate cards using the new RadioMetadata structure
 * Each ad type can have multiple rate configurations with class-based segments and time details
 */
export default function FMRateCardForm({ metadata, setMetadata }: RadioRateCardFormProps) {
  // Track which rate card is currently expanded for better UX
  const [expandedRate, setExpandedRate] = useState<number | null>(null);
  
  // Dialog state for ad type selection
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAdType, setSelectedAdType] = useState<RadioAdType | null>(null);

  /**
   * Opens dialog for selecting ad type
   */
  const openAddRateDialog = () => {
    setSelectedAdType(null);
    setIsDialogOpen(true);
  };

  /**
   * Adds a new rate configuration for the selected ad type
   */
  const addRateConfiguration = () => {
    if (!selectedAdType) return;

    const newSegment: RadioSegment = {
      Class: 'A1',
      ClassName: '',
      timeDetails: [
        {
          daysOfWeek: 'MONDAY - FRIDAY',
          timeInterval: [],
        }
      ],
      UnitRate: 0,
      isActive: true,
      // Add Duration only for ad types that need it
      ...(selectedAdType === 'JINGLES' && { Duration: '30_SECS' as DurationInSec }),
      ...(selectedAdType === 'INTERVIEWS' && { Duration: '10_MINS' as DurationInMin }),
    };

    const newRate: RadioRate = {
      adType: selectedAdType,
      RadioSegment: [newSegment],
    };

    setMetadata({
      ...metadata,
      adTypeRates: [...metadata.adTypeRates, newRate],
    });
    
    setExpandedRate(metadata.adTypeRates.length);
    setIsDialogOpen(false);
    setSelectedAdType(null);
  };

  /**
   * Removes a rate configuration
   */
  const removeRateConfiguration = (rateIndex: number) => {
    setMetadata({
      ...metadata,
      adTypeRates: metadata.adTypeRates.filter((_, i) => i !== rateIndex),
    });
  };

  /**
   * Adds a new segment to a rate configuration
   */
  const addSegment = (rateIndex: number) => {
    const newRates = [...metadata.adTypeRates];
    const currentRate = newRates[rateIndex];
    
    const newSegment: RadioSegment = {
      Class: 'A1',
      ClassName: '',
      timeDetails: [
        {
          daysOfWeek: 'MONDAY - FRIDAY',
          timeInterval: [],
        }
      ],
      UnitRate:0,
      isActive: true,
      // Add Duration only for ad types that need it
      ...(currentRate.adType === 'JINGLES' && { Duration: '30_SECS' as DurationInSec }),
      ...(currentRate.adType === 'INTERVIEWS' && { Duration: '10_MINS' as DurationInMin }),
    };
    newRates[rateIndex].RadioSegment.push(newSegment);
    setMetadata({ ...metadata, adTypeRates: newRates });
  };

  /**
   * Removes a segment from a rate configuration
   */
  const removeSegment = (rateIndex: number, segmentIndex: number) => {
    const newRates = [...metadata.adTypeRates];
    newRates[rateIndex].RadioSegment.splice(segmentIndex, 1);
    setMetadata({ ...metadata, adTypeRates: newRates });
  };

  /**
   * Updates a segment field
   */
  const updateSegment = (
    rateIndex: number,
    segmentIndex: number,
    field: keyof RadioSegment,
    value: string | number | boolean | RadioSegmentClass | TimeDetails[] | DurationInSec | DurationInMin
  ) => {
    const newRates = [...metadata.adTypeRates];
    newRates[rateIndex].RadioSegment[segmentIndex] = {
      ...newRates[rateIndex].RadioSegment[segmentIndex],
      [field]: value,
    };
    setMetadata({ ...metadata, adTypeRates: newRates });
  };

  /**
   * Adds a new time detail to a segment
   */
  const addTimeDetail = (rateIndex: number, segmentIndex: number) => {
    const newRates = [...metadata.adTypeRates];
    const newTimeDetail: TimeDetails = {
      programName: '',
      daysOfWeek: 'MONDAY - FRIDAY',
      timeInterval: [],
    };
    newRates[rateIndex].RadioSegment[segmentIndex].timeDetails.push(newTimeDetail);
    setMetadata({ ...metadata, adTypeRates: newRates });
  };

  /**
   * Removes a time detail from a segment
   */
  const removeTimeDetail = (
    rateIndex: number,
    segmentIndex: number,
    timeDetailIndex: number
  ) => {
    const newRates = [...metadata.adTypeRates];
    newRates[rateIndex].RadioSegment[segmentIndex].timeDetails.splice(timeDetailIndex, 1);
    setMetadata({ ...metadata, adTypeRates: newRates });
  };

  /**
   * Updates a time detail field
   */
  const updateTimeDetail = <T extends keyof TimeDetails>(
    rateIndex: number,
    segmentIndex: number,
    timeDetailIndex: number,
    field: T,
    value: TimeDetails[T]
  ) => {
    const newRates = [...metadata.adTypeRates];
    newRates[rateIndex].RadioSegment[segmentIndex].timeDetails[timeDetailIndex] = {
      ...newRates[rateIndex].RadioSegment[segmentIndex].timeDetails[timeDetailIndex],
      [field]: value,
    };
    setMetadata({ ...metadata, adTypeRates: newRates });
  };

  /**
   * Updates time intervals for a time detail (for multi-select)
   */
  const updateTimeIntervals = (
    rateIndex: number,
    segmentIndex: number,
    timeDetailIndex: number,
    intervals: string[]
  ) => {
    const newRates = [...metadata.adTypeRates];
    newRates[rateIndex].RadioSegment[segmentIndex].timeDetails[timeDetailIndex].timeInterval = intervals as TimeInterval[];
    setMetadata({ ...metadata, adTypeRates: newRates });
  };

  return (
    <Card className="border border-primary/5 text-primary">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-primary text-md font-semibold">FM Radio Rate Configurations</CardTitle>
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
                      {rate.RadioSegment.length} segment{rate.RadioSegment.length !== 1 ? 's added' : ' added'}
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
                  {/* Segments Section */}
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
                      {rate.RadioSegment.map((segment, segmentIndex) => (
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

                              {/* Segment Class and Name */}
                              <div className={`space-y-3 md:space-y-4 mb-4 pb-3 border-b border-gray-300`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-sm text-gray-700 mb-1 block">Segment Class</label>
                                    <Select
                                      value={segment.Class}
                                      onValueChange={(value) => updateSegment(rateIndex, segmentIndex, 'Class', value as RadioSegmentClass)}
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
                                    <label className="text-sm text-gray-700 mb-1 block">
                                      {rate.adType === 'ANNOUNCEMENTS' ? 'Announcement Type' : 'Class Name (Optional)'}
                                    </label>
                                    {rate.adType === 'ANNOUNCEMENTS' ? (
                                      <Select
                                        value={segment.ClassName || ''}
                                        onValueChange={(value) => updateSegment(rateIndex, segmentIndex, 'ClassName', value)}
                                      >
                                        <SelectTrigger className="w-full input-field">
                                          <SelectValue placeholder="Select announcement type" />
                                        </SelectTrigger>
                                        <SelectContent className="border-none bg-white">
                                          {ANNOUNCEMENT_SEGMENT_OPTIONS.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                              {opt.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <Input
                                        type="text"
                                        value={segment.ClassName || ''}
                                        onChange={(e) => updateSegment(rateIndex, segmentIndex, 'ClassName', e.target.value)}
                                        placeholder="e.g., Prime Time"
                                        className="input-field"
                                      />
                                    )}
                                  </div>
                                </div>

                                {/* Unit Rate and Duration */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="w-full">
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

                                  {/* Duration field for JINGLES and INTERVIEWS */}
                                  {(rate.adType === 'JINGLES' || rate.adType === 'INTERVIEWS') && (
                                    <div>
                                      <label className="text-sm text-gray-700 mb-1 block">Duration</label>
                                      <Select
                                        value={segment.Duration as string || ''}
                                        onValueChange={(value) => updateSegment(rateIndex, segmentIndex, 'Duration', value)}
                                      >
                                        <SelectTrigger className="w-full input-field text-sm">
                                          <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-none">
                                          {(rate.adType === 'JINGLES' ? JINGLE_DURATIONS : INTERVIEW_DURATIONS).map(duration => (
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
                                      <div 
                                        key={timeDetailIndex} 
                                        className={`bg-white border border-gray-200 rounded-md p-3 space-y-2 md:space-y-0 md:grid ${rate.adType === 'ANNOUNCEMENTS' ? 'md:grid-cols-[1fr_1fr_auto]' : 'md:grid-cols-[1fr_1fr_1fr_auto]'} md:gap-2 md:items-end'}`}
                                      >
                                        {rate.adType !== 'ANNOUNCEMENTS' && (

                                          <div className="full">
                                            <label className="text-xs text-gray-700 mb-1 block">Programme Name</label>
                                            <Input
                                              type="text"
                                              value={timeDetail.programName || ''}
                                              onChange={(e) => updateTimeDetail(rateIndex, segmentIndex, timeDetailIndex, 'programName', e.target.value)}
                                              placeholder="Optional programme name"
                                              className="input-field text-sm"
                                            />
                                          </div>
                                        )}

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
                                            selectedIntervals={timeDetail.timeInterval as TimeInterval[]}
                                            onIntervalsChange={(intervals) => updateTimeIntervals(rateIndex, segmentIndex, timeDetailIndex, intervals)}
                                            timeIntervalOptions= {TIME_INTERVAL_OPTIONS}
                                          />
                                        </div>

                                        <div className={rate.adType === 'ANNOUNCEMENTS' ? 'flex justify-end items-center lg:mt-3' : 'flex items-end justify-end md:justify-start'}>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeTimeDetail(rateIndex, segmentIndex, timeDetailIndex)}
                                            className="px-2 text-center text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
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
