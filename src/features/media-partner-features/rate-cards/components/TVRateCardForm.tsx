import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { TVMetadata, TVSegment, TvSegmentType, Duration, ProductPlacementDuration, InterviewDuration } from "../types";
import { JINGLE_DURATIONS, SPOT_ADVERT_TYPES, INTERVAL_TYPES, PRODUCT_PLACEMENT_DURATIONS, INTERVIEW_DURATIONS } from "../constant";
import {
  SectionHeader,
  EmptyState,
  DeleteButton,
  DaysSelector,
  FormRow,
  RateInput,
  DurationSelect,
} from "./FormFields";
import SegmentSelectionDialog from "./SegmentSelectionDialog";

interface TVRateCardFormProps {
  metadata: TVMetadata;
  setMetadata: (metadata: TVMetadata) => void;
}


/**
 * Available segment types for TV
 */
const SEGMENT_TYPE_OPTIONS: { value: TvSegmentType; label: string }[] = [
  { value: 'SPOT_ADVERTS', label: 'Spot Adverts' },
  { value: 'DOCUMENTARY', label: 'Documentary' },
  { value: 'ANNOUNCEMENTS', label: 'Announcements' },
  { value: 'NEWS_COVERAGE', label: 'News Coverage' },
  { value: 'EXECUTIVE_INTERVIEW', label: 'Executive Interview' },
  { value: 'PREACHING', label: 'Preaching' },
  { value: 'AIRTIME_SALE', label: 'Airtime Sale' },
  { value: 'MEDIA', label: 'Media (Music Videos, Soundtracks)' },
];

export default function TVRateCardForm({ metadata, setMetadata }: TVRateCardFormProps) {
  const [expandedSegment, setExpandedSegment] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<TvSegmentType[]>([]);

  const openSegmentDialog = () => {
    setSelectedTypes([]);
    setIsDialogOpen(true);
  };

  const toggleSegmentType = (type: TvSegmentType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const addSegment = () => {
    if (selectedTypes.length === 0) return;

    // Create a separate segment for each selected type
    const newSegments: TVSegment[] = selectedTypes.map(type => {
      const label = SEGMENT_TYPE_OPTIONS.find(opt => opt.value === type)?.label || type;
      
      return {
        segmentType: label,
        enabledTypes: [type], // Each segment has only one type
        // Initialize arrays for this specific type only
        ...(type === 'SPOT_ADVERTS' && { spotAdverts: [] }),
        ...(type === 'DOCUMENTARY' && { documentary: [] }),
        ...(type === 'ANNOUNCEMENTS' && { announcements: [] }),
        ...(type === 'NEWS_COVERAGE' && { newsCoverage: [] }),
        ...(type === 'EXECUTIVE_INTERVIEW' && { executiveInterview: [] }),
        ...(type === 'PREACHING' && { preaching: [] }),
        ...(type === 'AIRTIME_SALE' && { airtimeSale: [] }),
        ...(type === 'MEDIA' && { media: [] }),
      };
    });

    setMetadata({
      ...metadata,
      segments: [...metadata.segments, ...newSegments],
    });
    // Expand the first newly added segment
    setExpandedSegment(metadata.segments.length);
    setIsDialogOpen(false);
    setSelectedTypes([]);
  };

  const removeSegment = (index: number) => {
    setMetadata({
      ...metadata,
      segments: metadata.segments.filter((_, i) => i !== index),
    });
  };

  // Spot Adverts
  const addSpotAdvert = (segmentIndex: number) => {
    const newSegments = [...metadata.segments];
    const segment = newSegments[segmentIndex];
    
    if (!segment.spotAdverts) segment.spotAdverts = [];
    
    segment.spotAdverts.push({
      intervalType: 'PREMIUM',
      spotAdvertType: 'DURATION_BASED',
      programmeType: '',
      timeInterval: { startTime: '', endTime: '' },
      rate: 0,
      day: ['MONDAY'],
      durationBasedAdvert: {
        duration: '30_SECS',
        rate: 0,
      },
    });
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateSpotAdvert = (segmentIndex: number, advertIndex: number, field: string, value: any) => {
    const newSegments = [...metadata.segments];
    const advert = newSegments[segmentIndex].spotAdverts?.[advertIndex];
    
    if (!advert) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'timeInterval' && advert.timeInterval) {
        advert.timeInterval = { ...advert.timeInterval, [child]: value };
      } else if (parent === 'durationBasedAdvert' && advert.durationBasedAdvert) {
        advert.durationBasedAdvert = { ...advert.durationBasedAdvert, [child]: value };
      } else if (parent === 'productPlacement' && advert.productPlacement) {
        advert.productPlacement = { ...advert.productPlacement, [child]: value };
      }
    } else {
      // Handle spot advert type changes
      if (field === 'spotAdvertType') {
        advert.spotAdvertType = value;
        // Initialize appropriate nested structures based on type
        if (value === 'DURATION_BASED') {
          advert.durationBasedAdvert = { duration: '30_SECS', rate: 0 };
          delete advert.productPlacement;
          delete advert.otherSportAdvertTypeRate;
        } else if (value === 'PRODUCT_PLACEMENT') {
          advert.productPlacement = { duration: '20_MINS', rate: 0 };
          delete advert.durationBasedAdvert;
          delete advert.otherSportAdvertTypeRate;
        } else {
          // For other types (CRAWLERS, SQUEEZE_BACK, etc.)
          advert.otherSportAdvertTypeRate = 0;
          delete advert.durationBasedAdvert;
          delete advert.productPlacement;
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (advert as any)[field] = value;
      }
    }
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  const removeSpotAdvert = (segmentIndex: number, advertIndex: number) => {
    const newSegments = [...metadata.segments];
    newSegments[segmentIndex].spotAdverts?.splice(advertIndex, 1);
    setMetadata({ ...metadata, segments: newSegments });
  };

  // Announcements
  const addAnnouncement = (segmentIndex: number) => {
    const newSegments = [...metadata.segments];
    const segment = newSegments[segmentIndex];
    
    if (!segment.announcements) segment.announcements = [];
    
    segment.announcements.push({
      announcementType: "COMMERCIAL/PRODUCTS",
      rate: 0,
      day: ['MONDAY'],
    });
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateAnnouncement = (segmentIndex: number, announcementIndex: number, field: string, value: any) => {
    const newSegments = [...metadata.segments];
    const announcement = newSegments[segmentIndex].announcements?.[announcementIndex];
    if (!announcement) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (announcement as any)[field] = value;
    setMetadata({ ...metadata, segments: newSegments });
  };

  const removeAnnouncement = (segmentIndex: number, announcementIndex: number) => {
    const newSegments = [...metadata.segments];
    newSegments[segmentIndex].announcements?.splice(announcementIndex, 1);
    setMetadata({ ...metadata, segments: newSegments });
  };

  //Documentary
  const addDocumentary = (segmentIndex: number) => {
    const newSegments = [...metadata.segments];
    const segment = newSegments[segmentIndex];

    if (!segment.documentary) segment.documentary = [];

    segment.documentary.push({
      documentaryType: "COMMERCIAL",
      durationMinutes: '30_MINS',
      timeInterval: { startTime: '', endTime: '' },
      rate: 0,
      day: ['MONDAY'],
    });
    setMetadata({ ...metadata, segments: newSegments });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateDocumentary = (segmentIndex: number, documentaryIndex: number, field: string, value: any) => {
    const newSegments = [...metadata.segments];
    const documentary = newSegments[segmentIndex].documentary?.[documentaryIndex];
    if (!documentary) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (documentary as any)[field] = value;
    setMetadata({ ...metadata, segments: newSegments });
  };


  const removeDocumentary = (segmentIndex: number, documentaryIndex: number) => {
    const newSegments = [...metadata.segments];
    newSegments[segmentIndex].documentary?.splice(documentaryIndex, 1);
    setMetadata({ ...metadata, segments: newSegments });
  };

  // News Coverage
  const addNewsCoverage = (segmentIndex: number) => {
    const newSegments = [...metadata.segments];
    const segment = newSegments[segmentIndex];
    
    if (!segment.newsCoverage) segment.newsCoverage = [];
    
    segment.newsCoverage.push({
      location: '',
      adType: 'COMMERCIAL',
      rate: 0,
      day: ['MONDAY'],
    });
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateNewsCoverage = (segmentIndex: number, coverageIndex: number, field: string, value: any) => {
    const newSegments = [...metadata.segments];
    const coverage = newSegments[segmentIndex].newsCoverage?.[coverageIndex];
    if (!coverage) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (coverage as any)[field] = value;
    setMetadata({ ...metadata, segments: newSegments });
  };

  const removeNewsCoverage = (segmentIndex: number, coverageIndex: number) => {
    const newSegments = [...metadata.segments];
    newSegments[segmentIndex].newsCoverage?.splice(coverageIndex, 1);
    setMetadata({ ...metadata, segments: newSegments });
  };

  // Executive Interview
  const addExecutiveInterview = (segmentIndex: number) => {
    const newSegments = [...metadata.segments];
    const segment = newSegments[segmentIndex];
    
    if (!segment.executiveInterview) segment.executiveInterview = [];
    
    segment.executiveInterview.push({
      durationMinutes: '30_MINS',
      rate: 0,
      day: ['MONDAY'],
    });
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateExecutiveInterview = (segmentIndex: number, interviewIndex: number, field: string, value: any) => {
    const newSegments = [...metadata.segments];
    const interview = newSegments[segmentIndex].executiveInterview?.[interviewIndex];
    if (!interview) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (interview as any)[field] = value;
    setMetadata({ ...metadata, segments: newSegments });
  };

  const removeExecutiveInterview = (segmentIndex: number, interviewIndex: number) => {
    const newSegments = [...metadata.segments];
    newSegments[segmentIndex].executiveInterview?.splice(interviewIndex, 1);
    setMetadata({ ...metadata, segments: newSegments });
  };

  // Preaching
  const addPreaching = (segmentIndex: number) => {
    const newSegments = [...metadata.segments];
    const segment = newSegments[segmentIndex];
    
    if (!segment.preaching) segment.preaching = [];
    
    segment.preaching.push({
      durationMinutes: '30_MINS',
      timeInterval: { startTime: '', endTime: '' },
      rate: 0,
      day: ['MONDAY'],
    });
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatePreaching = (segmentIndex: number, preachingIndex: number, field: string, value: any) => {
    const newSegments = [...metadata.segments];
    const preaching = newSegments[segmentIndex].preaching?.[preachingIndex];
    if (!preaching) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'timeInterval' && preaching.timeInterval) {
        preaching.timeInterval = { ...preaching.timeInterval, [child]: value };
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (preaching as any)[field] = value;
    }
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  const removePreaching = (segmentIndex: number, preachingIndex: number) => {
    const newSegments = [...metadata.segments];
    newSegments[segmentIndex].preaching?.splice(preachingIndex, 1);
    setMetadata({ ...metadata, segments: newSegments });
  };

  // Airtime Sale
  const addAirtimeSale = (segmentIndex: number) => {
    const newSegments = [...metadata.segments];
    const segment = newSegments[segmentIndex];
    
    if (!segment.airtimeSale) segment.airtimeSale = [];
    
    segment.airtimeSale.push({
      durationMinutes: '30_MINS',
      timeInterval: { startTime: '', endTime: '' },
      rate: 0,
      day: ['MONDAY'],
    });
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateAirtimeSale = (segmentIndex: number, saleIndex: number, field: string, value: any) => {
    const newSegments = [...metadata.segments];
    const sale = newSegments[segmentIndex].airtimeSale?.[saleIndex];
    if (!sale) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'timeInterval' && sale.timeInterval) {
        sale.timeInterval = { ...sale.timeInterval, [child]: value };
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sale as any)[field] = value;
    }
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  const removeAirtimeSale = (segmentIndex: number, saleIndex: number) => {
    const newSegments = [...metadata.segments];
    newSegments[segmentIndex].airtimeSale?.splice(saleIndex, 1);
    setMetadata({ ...metadata, segments: newSegments });
  };

  // Media
  const addMedia = (segmentIndex: number) => {
    const newSegments = [...metadata.segments];
    const segment = newSegments[segmentIndex];
    
    if (!segment.media) segment.media = [];
    
    segment.media.push({
      mediaType: 'MUSIC_VIDEOS',
      durationSeconds: 0,
      rate: 0,
      day: ['MONDAY'],
    });
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateMedia = (segmentIndex: number, mediaIndex: number, field: string, value: any) => {
    const newSegments = [...metadata.segments];
    const media = newSegments[segmentIndex].media?.[mediaIndex];
    if (!media) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (media as any)[field] = value;
    setMetadata({ ...metadata, segments: newSegments });
  };

  const removeMedia = (segmentIndex: number, mediaIndex: number) => {
    const newSegments = [...metadata.segments];
    newSegments[segmentIndex].media?.splice(mediaIndex, 1);
    setMetadata({ ...metadata, segments: newSegments });
  };

  return (
    <>
      <Card className="border border-violet-100 mt-2 text-primary">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-primary text-md font-semibold">TV Segments</CardTitle>
            <p className="text-xs text-gray-500 mt-1">Organize your TV rate card by segments</p>
          </div>
          <Button 
            type="button" 
            onClick={openSegmentDialog} 
            size="sm" 
            variant="outline"
            className="border-secondary hover:bg-secondary hover:text-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Segment
          </Button>
        </CardHeader>
        <CardContent>
          {metadata.segments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">No segments added yet</p>
              <p className="text-sm mt-1">Click "Add Segment" to get started</p>
            </div>
          ) : (
            metadata.segments.map((segment, segmentIndex) => (
              <Card key={segmentIndex} className="mb-4 border border-primary/10">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedSegment(expandedSegment === segmentIndex ? null : segmentIndex)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">
                      Segment {segmentIndex + 1}: {segment.segmentType || 'Untitled'}
                    </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSegment(segmentIndex);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                      {expandedSegment === segmentIndex ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {expandedSegment === segmentIndex && (
                  <CardContent className="space-y-4 pt-4">
                    {/* Spot Adverts Section */}
                    {segment.enabledTypes?.includes('SPOT_ADVERTS') && (
                      <div className="border-t border-primary/5 pt-4">
                        <SectionHeader 
                          title="Spot Adverts" 
                          onAdd={() => addSpotAdvert(segmentIndex)} 
                        />
                        {segment.spotAdverts && segment.spotAdverts.length > 0 ? (
                          segment.spotAdverts.map((advert, advertIndex) => (
                            <div key={advertIndex} className="border border-gray-300 bg-white shadow-sm p-4 rounded-lg relative mb-3 hover:shadow-md transition-shadow">
                            <div className="absolute -top-2 -right-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                              {advertIndex + 1}
                            </div>
                            <FormRow>
                              <div>
                                <label className="text-sm text-gray-900 mb-1 block">Advert Type</label>
                                <Select
                                  value={advert.spotAdvertType}
                                  onValueChange={(value) => updateSpotAdvert(segmentIndex, advertIndex, 'spotAdvertType', value)}
                                >
                                  <SelectTrigger className="w-full border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none">
                                    <SelectValue placeholder="Advert Type" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border-none">
                                    {SPOT_ADVERT_TYPES.map((type) => (
                                      <SelectItem key={type} value={type}>{type.replace(/_/g, ' ').charAt(0).toUpperCase() + type.replace(/_/g, ' ').slice(1).toLowerCase()}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Duration-Based Advert Fields */}
                              {advert.spotAdvertType === 'DURATION_BASED' && advert.durationBasedAdvert && (
                                <>
                                  <DurationSelect<Duration>
                                    value={advert.durationBasedAdvert.duration}
                                    options={JINGLE_DURATIONS}
                                    onChange={(value) => updateSpotAdvert(segmentIndex, advertIndex, 'durationBasedAdvert.duration', value)}
                                    placeholder="Duration"
                                  />
                                  <RateInput
                                    value={advert.durationBasedAdvert.rate}
                                    onChange={(value) => updateSpotAdvert(segmentIndex, advertIndex, 'durationBasedAdvert.rate', value)}
                                  />
                                </>
                              )}

                              {/* Product Placement Fields */}
                              {advert.spotAdvertType === 'PRODUCT_PLACEMENT' && advert.productPlacement && (
                                <>
                                  <DurationSelect<ProductPlacementDuration>
                                    value={advert.productPlacement.duration}
                                    options={PRODUCT_PLACEMENT_DURATIONS}
                                    onChange={(value) => updateSpotAdvert(segmentIndex, advertIndex, 'productPlacement.duration', value)}
                                    placeholder="Duration"
                                  />
                                  <RateInput
                                    value={advert.productPlacement.rate}
                                    onChange={(value) => updateSpotAdvert(segmentIndex, advertIndex, 'productPlacement.rate', value)}
                                  />
                                </>
                              )}

                              {/* Other Advert Types */}
                              {!['DURATION_BASED', 'PRODUCT_PLACEMENT'].includes(advert.spotAdvertType) && (
                                <RateInput
                                  value={advert.otherSportAdvertTypeRate || 0}
                                  onChange={(value) => updateSpotAdvert(segmentIndex, advertIndex, 'otherSportAdvertTypeRate', value)}
                                />
                              )}

                              <div className="">
                                <label className="text-sm text-gray-900 mb-1 block">Interval Type</label>
                                <Select
                                  value={advert.intervalType}
                                  onValueChange={(value) => updateSpotAdvert(segmentIndex, advertIndex, 'intervalType', value)}
                                >
                                  <SelectTrigger className="w-full border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border-none">
                                    {INTERVAL_TYPES.map((type) => (
                                      <SelectItem key={type} value={type}>{type.replace(/_/g, ' ').charAt(0).toUpperCase() + type.replace(/_/g, ' ').slice(1).toLowerCase()}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {advert.intervalType === 'PREMIUM' && (
                                <div>
                                  <label className="text-sm text-gray-900 mb-1 block">Programme Type</label>
                                  <Input
                                    placeholder="Programme type"
                                    value={advert.programmeType || ''}
                                    onChange={(e) => updateSpotAdvert(segmentIndex, advertIndex, 'programmeType', e.target.value)}
                                    className="border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none"
                                  />
                                </div>
                              )}

                              {advert.intervalType === 'TIME_INTERVAL' && advert.timeInterval && (
                                <>
                                  <div>
                                    <label className="text-sm text-gray-900 mb-1 block">Start Time</label>
                                    <Input
                                      type="time"
                                      value={advert.timeInterval.startTime}
                                      onChange={(e) => updateSpotAdvert(segmentIndex, advertIndex, 'timeInterval.startTime', e.target.value)}
                                      className="border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-900 mb-1 block">End Time</label>
                                    <Input
                                      type="time"
                                      value={advert.timeInterval.endTime}
                                      onChange={(e) => updateSpotAdvert(segmentIndex, advertIndex, 'timeInterval.endTime', e.target.value)}
                                      className="border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none"
                                    />
                                  </div>
                                </>
                              )}
                              
                              
                              <DaysSelector
                                selectedDays={advert.day}
                                onChange={(days) => updateSpotAdvert(segmentIndex, advertIndex, 'day', days)}
                              />
                            </FormRow>
                            <div className="flex justify-end">
                              <DeleteButton onDelete={() => removeSpotAdvert(segmentIndex, advertIndex)} />
                            </div>
                            </div>
                          ))
                        ) : (
                          <EmptyState message="No spot adverts added yet" />
                        )}
                      </div>
                    )}

                    {/* Announcements Section */}
                    {segment.enabledTypes?.includes('ANNOUNCEMENTS') && (
                      <div className="border-t border-primary/5 pt-4">
                        <SectionHeader 
                          title="Announcements" 
                          onAdd={() => addAnnouncement(segmentIndex)} 
                        />
                        {segment.announcements && segment.announcements.length > 0 ? (
                          segment.announcements.map((announcement, announcementIndex) => (
                            <div key={announcementIndex} className="border border-gray-300 bg-white shadow-sm p-4 rounded-lg relative mb-3 hover:shadow-md transition-shadow">
                              <div className="absolute -top-2 -right-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                                {announcementIndex + 1}
                              </div>
                              <FormRow columns={3}>
                                <div>
                                  <label className="text-sm text-gray-900 mb-1 block">Announcement Type</label>
                                  <Select
                                    value={announcement.announcementType}
                                    onValueChange={(value) => updateAnnouncement(segmentIndex, announcementIndex, 'announcementType', value)}
                                  >
                                    <SelectTrigger className="w-full border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-none">
                                      <SelectItem value="COMMERCIAL/PRODUCTS">Commercial/Products</SelectItem>
                                      <SelectItem value="POLICE_EXTRACT">Police Extract</SelectItem>
                                      <SelectItem value="FUNERAL">Funeral</SelectItem>
                                      <SelectItem value="SOCIAL">Social</SelectItem>
                                      <SelectItem value="PROMOTIONS">Promotions</SelectItem>
                                      <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <RateInput
                                  value={announcement.rate}
                                  onChange={(value) => updateAnnouncement(segmentIndex, announcementIndex, 'rate', value)}
                                />

                                <DaysSelector
                                  selectedDays={announcement.day}
                                  onChange={(days) => updateAnnouncement(segmentIndex, announcementIndex, 'day', days)}
                                />
                              </FormRow>
                              <div className="flex justify-end">
                                <DeleteButton onDelete={() => removeAnnouncement(segmentIndex, announcementIndex)} />
                              </div>
                            </div>
                          ))
                        ) : (
                          <EmptyState message="No announcements added yet" />
                        )}
                      </div>
                    )}

                    {/* Documentary Section */}
                    {segment.enabledTypes?.includes('DOCUMENTARY') && (
                      <div className="border-t border-primary/5 pt-4">
                        <SectionHeader 
                          title="Documentary" 
                          onAdd={() => addDocumentary(segmentIndex)} 
                        />
                        {segment.documentary && segment.documentary.length > 0 ? (
                          segment.documentary.map((documentary, documentaryIndex) => (
                            <div key={documentaryIndex} className="border border-gray-300 bg-white shadow-sm p-4 rounded-lg relative mb-3 hover:shadow-md transition-shadow">
                              <div className="absolute -top-2 -right-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                                {documentaryIndex + 1}
                              </div>
                              <FormRow>
                                <div>
                                  <label className="text-sm text-gray-900 mb-1 block">Documentary Type</label>
                                  <Select
                                    value={documentary.documentaryType}
                                    onValueChange={(value) => updateDocumentary(segmentIndex, documentaryIndex, 'documentaryType', value)}
                                  >
                                    <SelectTrigger className="w-full border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-none">
                                      <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                                      <SelectItem value="SOCIAL">Social</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <DurationSelect<InterviewDuration>
                                  value={documentary.durationMinutes}
                                  options={INTERVIEW_DURATIONS}
                                  onChange={(value) => updateDocumentary(segmentIndex, documentaryIndex, 'durationMinutes', value)}
                                  placeholder="Duration"
                                />

                                <RateInput
                                  value={documentary.rate}
                                  onChange={(value) => updateDocumentary(segmentIndex, documentaryIndex, 'rate', value)}
                                />

                                <div>
                                  <label className="text-sm text-gray-900 mb-1 block">Start Time</label>
                                  <Input
                                    type="time"
                                    value={documentary.timeInterval.startTime}
                                    onChange={(e) => updateDocumentary(segmentIndex, documentaryIndex, 'timeInterval.startTime', e.target.value)}
                                    className="border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-gray-900 mb-1 block">End Time</label>
                                  <Input
                                    type="time"
                                    value={documentary.timeInterval.endTime}
                                    onChange={(e) => updateDocumentary(segmentIndex, documentaryIndex, 'timeInterval.endTime', e.target.value)}
                                    className="border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none"
                                  />
                                </div>

                                <DaysSelector
                                  selectedDays={documentary.day}
                                  onChange={(days) => updateDocumentary(segmentIndex, documentaryIndex, 'day', days)}
                                />
                              </FormRow>
                              <div className="flex justify-end">
                                <DeleteButton onDelete={() => removeDocumentary(segmentIndex, documentaryIndex)} />
                              </div>
                            </div>
                          ))
                        ) : (
                          <EmptyState message="No documentaries added yet" />
                        )}
                      </div>
                    )}

                    {/* News Coverage Section */}
                    {segment.enabledTypes?.includes('NEWS_COVERAGE') && (
                      <div className="border-t border-primary/5 pt-4">
                        <SectionHeader 
                          title="News Coverage" 
                          onAdd={() => addNewsCoverage(segmentIndex)} 
                        />
                        {segment.newsCoverage && segment.newsCoverage.length > 0 ? (
                          segment.newsCoverage.map((coverage, coverageIndex) => (
                            <div key={coverageIndex} className="border border-gray-300 bg-white shadow-sm p-4 rounded-lg relative mb-3 hover:shadow-md transition-shadow">
                              <div className="absolute -top-2 -right-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                                {coverageIndex + 1}
                              </div>
                              <FormRow columns={3}>
                                <div>
                                  <label className="text-sm text-gray-900 mb-1 block">Location</label>
                                  <Input
                                    placeholder="Location"
                                    value={coverage.location}
                                    onChange={(e) => updateNewsCoverage(segmentIndex, coverageIndex, 'location', e.target.value)}
                                    className="border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="text-sm text-gray-900 mb-1 block">Ad Type</label>
                                  <Select
                                    value={coverage.adType}
                                    onValueChange={(value) => updateNewsCoverage(segmentIndex, coverageIndex, 'adType', value)}
                                  >
                                    <SelectTrigger className="w-full border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-none">
                                      <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                                      <SelectItem value="SOCIAL">Social</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <RateInput
                                  value={coverage.rate}
                                  onChange={(value) => updateNewsCoverage(segmentIndex, coverageIndex, 'rate', value)}
                                />

                                <DaysSelector
                                  selectedDays={coverage.day}
                                  onChange={(days) => updateNewsCoverage(segmentIndex, coverageIndex, 'day', days)}
                                />
                              </FormRow>
                              <div className="flex justify-end">
                                <DeleteButton onDelete={() => removeNewsCoverage(segmentIndex, coverageIndex)} />
                              </div>
                            </div>
                          ))
                        ) : (
                          <EmptyState message="No news coverage added yet" />
                        )}
                      </div>
                    )}

                    {/* Executive Interview Section */}
                    {segment.enabledTypes?.includes('EXECUTIVE_INTERVIEW') && (
                      <div className="border-t border-primary/5 pt-4">
                        <SectionHeader 
                          title="Executive Interview" 
                          onAdd={() => addExecutiveInterview(segmentIndex)} 
                        />
                        {segment.executiveInterview && segment.executiveInterview.length > 0 ? (
                          segment.executiveInterview.map((interview, interviewIndex) => (
                            <div key={interviewIndex} className="border border-gray-300 bg-white shadow-sm p-4 rounded-lg relative mb-3 hover:shadow-md transition-shadow">
                              <div className="absolute -top-2 -right-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                                {interviewIndex + 1}
                              </div>
                              <FormRow columns={3}>
                                <DurationSelect<InterviewDuration>
                                  value={interview.durationMinutes}
                                  options={INTERVIEW_DURATIONS}
                                  onChange={(value) => updateExecutiveInterview(segmentIndex, interviewIndex, 'durationMinutes', value)}
                                  placeholder="Duration"
                                />

                                <RateInput
                                  value={interview.rate}
                                  onChange={(value) => updateExecutiveInterview(segmentIndex, interviewIndex, 'rate', value)}
                                />

                                <DaysSelector
                                  selectedDays={interview.day}
                                  onChange={(days) => updateExecutiveInterview(segmentIndex, interviewIndex, 'day', days)}
                                />
                              </FormRow>
                              <div className="flex justify-end">
                                <DeleteButton onDelete={() => removeExecutiveInterview(segmentIndex, interviewIndex)} />
                              </div>
                            </div>
                          ))
                        ) : (
                          <EmptyState message="No executive interviews added yet" />
                        )}
                      </div>
                    )}

                    {/* Preaching Section */}
                    {segment.enabledTypes?.includes('PREACHING') && (
                      <div className="border-t border-primary/5 pt-4">
                        <SectionHeader 
                          title="Preaching" 
                          onAdd={() => addPreaching(segmentIndex)} 
                        />
                        {segment.preaching && segment.preaching.length > 0 ? (
                          segment.preaching.map((preaching, preachingIndex) => (
                            <div key={preachingIndex} className="border border-gray-300 bg-white shadow-sm p-4 rounded-lg relative mb-3 hover:shadow-md transition-shadow">
                              <div className="absolute -top-2 -right-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                                {preachingIndex + 1}
                              </div>
                              <FormRow>
                                <DurationSelect<InterviewDuration>
                                  value={preaching.durationMinutes}
                                  options={INTERVIEW_DURATIONS}
                                  onChange={(value) => updatePreaching(segmentIndex, preachingIndex, 'durationMinutes', value)}
                                  placeholder="Duration"
                                />

                                <RateInput
                                  value={preaching.rate}
                                  onChange={(value) => updatePreaching(segmentIndex, preachingIndex, 'rate', value)}
                                />

                                <div>
                                  <label className="text-sm text-gray-900 mb-1 block">Start Time</label>
                                  <Input
                                    type="time"
                                    value={preaching.timeInterval.startTime}
                                    onChange={(e) => updatePreaching(segmentIndex, preachingIndex, 'timeInterval.startTime', e.target.value)}
                                    className="border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-gray-900 mb-1 block">End Time</label>
                                  <Input
                                    type="time"
                                    value={preaching.timeInterval.endTime}
                                    onChange={(e) => updatePreaching(segmentIndex, preachingIndex, 'timeInterval.endTime', e.target.value)}
                                    className="border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none"
                                  />
                                </div>

                                <DaysSelector
                                  selectedDays={preaching.day}
                                  onChange={(days) => updatePreaching(segmentIndex, preachingIndex, 'day', days)}
                                />
                              </FormRow>
                              <div className="flex justify-end">
                                <DeleteButton onDelete={() => removePreaching(segmentIndex, preachingIndex)} />
                              </div>
                            </div>
                          ))
                        ) : (
                          <EmptyState message="No preaching added yet" />
                        )}
                      </div>
                    )}

                    {/* Airtime Sale Section */}
                    {segment.enabledTypes?.includes('AIRTIME_SALE') && (
                      <div className="border-t border-primary/5 pt-4">
                        <SectionHeader 
                          title="Airtime Sale" 
                          onAdd={() => addAirtimeSale(segmentIndex)} 
                        />
                        {segment.airtimeSale && segment.airtimeSale.length > 0 ? (
                          segment.airtimeSale.map((sale, saleIndex) => (
                            <div key={saleIndex} className="border border-gray-300 bg-white shadow-sm p-4 rounded-lg relative mb-3 hover:shadow-md transition-shadow">
                              <div className="absolute -top-2 -right-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                                {saleIndex + 1}
                              </div>
                              <FormRow>
                                <DurationSelect<InterviewDuration>
                                  value={sale.durationMinutes}
                                  options={INTERVIEW_DURATIONS}
                                  onChange={(value) => updateAirtimeSale(segmentIndex, saleIndex, 'durationMinutes', value)}
                                  placeholder="Duration"
                                />

                                <RateInput
                                  value={sale.rate}
                                  onChange={(value) => updateAirtimeSale(segmentIndex, saleIndex, 'rate', value)}
                                />

                                <div>
                                  <label className="text-sm text-gray-900 mb-1 block">Start Time</label>
                                  <Input
                                    type="time"
                                    value={sale.timeInterval.startTime}
                                    onChange={(e) => updateAirtimeSale(segmentIndex, saleIndex, 'timeInterval.startTime', e.target.value)}
                                    className="border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-gray-900 mb-1 block">End Time</label>
                                  <Input
                                    type="time"
                                    value={sale.timeInterval.endTime}
                                    onChange={(e) => updateAirtimeSale(segmentIndex, saleIndex, 'timeInterval.endTime', e.target.value)}
                                    className="border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none"
                                  />
                                </div>

                                <DaysSelector
                                  selectedDays={sale.day}
                                  onChange={(days) => updateAirtimeSale(segmentIndex, saleIndex, 'day', days)}
                                />
                              </FormRow>
                              <div className="flex justify-end">
                                <DeleteButton onDelete={() => removeAirtimeSale(segmentIndex, saleIndex)} />
                              </div>
                            </div>
                          ))
                        ) : (
                          <EmptyState message="No airtime sales added yet" />
                        )}
                      </div>
                    )}

                    {/* Media Section */}
                    {segment.enabledTypes?.includes('MEDIA') && (
                      <div className="border-t border-primary/5 pt-4">
                        <SectionHeader 
                          title="Media (Music Videos, Soundtracks)" 
                          onAdd={() => addMedia(segmentIndex)} 
                        />
                        {segment.media && segment.media.length > 0 ? (
                          segment.media.map((media, mediaIndex) => (
                            <div key={mediaIndex} className="border border-gray-300 bg-white shadow-sm p-4 rounded-lg relative mb-3 hover:shadow-md transition-shadow">
                              <div className="absolute -top-2 -right-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                                {mediaIndex + 1}
                              </div>
                              <FormRow>
                                <div>
                                  <label className="text-sm text-gray-900 mb-1 block">Media Type</label>
                                  <Select
                                    value={media.mediaType}
                                    onValueChange={(value) => updateMedia(segmentIndex, mediaIndex, 'mediaType', value)}
                                  >
                                    <SelectTrigger className="w-full border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-none">
                                      <SelectItem value="MUSIC_VIDEOS">Music Videos</SelectItem>
                                      <SelectItem value="SOUNDTRACKS">Soundtracks</SelectItem>
                                      <SelectItem value="MOVIE_PROMO">Movie Promo</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <label className="text-sm text-gray-900 mb-1 block">Duration (seconds)</label>
                                  <Input
                                    type="number"
                                    placeholder="Duration in seconds"
                                    value={media.durationSeconds}
                                    onChange={(e) => updateMedia(segmentIndex, mediaIndex, 'durationSeconds', Number(e.target.value))}
                                    className="border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none"
                                  />
                                </div>

                                <RateInput
                                  value={media.rate}
                                  onChange={(value) => updateMedia(segmentIndex, mediaIndex, 'rate', value)}
                                />

                                <DaysSelector
                                  selectedDays={media.day}
                                  onChange={(days) => updateMedia(segmentIndex, mediaIndex, 'day', days)}
                                />
                              </FormRow>
                              <div className="flex justify-end">
                                <DeleteButton onDelete={() => removeMedia(segmentIndex, mediaIndex)} />
                              </div>
                            </div>
                          ))
                        ) : (
                          <EmptyState message="No media items added yet" />
                        )}
                      </div>
                    )}

                  </CardContent>
                )}
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Segment Type Selection Dialog */}
      <SegmentSelectionDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpenValuefunc={setIsDialogOpen}
          selectedTypes={selectedTypes}
          toggleSegmentTypefunc={toggleSegmentType}
          addSegment={addSegment}
          SEGMENT_TYPE_OPTIONS={SEGMENT_TYPE_OPTIONS}
      />
    </>
  );
}
