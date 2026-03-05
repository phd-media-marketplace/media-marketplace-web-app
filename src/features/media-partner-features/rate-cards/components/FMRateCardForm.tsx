import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { FMMetadata, FMSegment, FMSegmentType, Duration, DayOfWeek, AnnouncementType, InterviewDuration} from "../types";
import {
  SectionHeader,
  EmptyState,
  DeleteButton,
  DaysSelector,
  TimeIntervalFields,
  FormRow,
  RateInput,
  DurationSelect,
} from "./FormFields";
import { JINGLE_DURATIONS, INTERVIEW_DURATIONS } from "../constant";
import SegmentSelectionDialog from "./SegmentSelectionDialog";

interface FMRateCardFormProps {
  metadata: FMMetadata;
  setMetadata: (metadata: FMMetadata) => void;
}


/**
 * Available segment types for FM radio
 */
const SEGMENT_TYPE_OPTIONS: { value: FMSegmentType; label: string }[] = [
  { value: 'ANNOUNCEMENTS', label: 'Announcements' },
  { value: 'INTERVIEWS', label: 'Interviews' },
  { value: 'LIVE_PRESENTER_MENTIONS', label: 'Live Presenter Mentions' },
  { value: 'JINGLES', label: 'Jingles' },
  { value: 'NEWS_COVERAGE', label: 'News Coverage' },
];

/**
 * FM Rate Card Form Component
 * Manages the creation and editing of FM radio rate card segments
 * Supports announcements, interviews, jingles, live presenter mentions, and news coverage
 */
export default function FMRateCardForm({ metadata, setMetadata }: FMRateCardFormProps) {
  // Track which segment is currently expanded for better UX
  const [expandedSegment, setExpandedSegment] = useState<number | null>(null);
  
  // Dialog state for segment type selection
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<FMSegmentType[]>([]);

  /**
   * Opens dialog for selecting segment types
   */
  const openSegmentDialog = () => {
    setSelectedTypes([]);
    setIsDialogOpen(true);
  };

  /**
   * Toggles a segment type in the selection
   */
  const toggleSegmentType = (type: FMSegmentType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  /**
   * Adds new segments - creates a separate segment card for each selected type
   */
  const addSegment = () => {
    if (selectedTypes.length === 0) {
      return; // Don't add segment if no types selected
    }

    // Create a separate segment for each selected type
    const newSegments: FMSegment[] = selectedTypes.map(type => {
      const label = SEGMENT_TYPE_OPTIONS.find(opt => opt.value === type)?.label || type;
      
      return {
        segmentsTypes: label,
        enabledTypes: [type], // Each segment has only one type
        // Initialize arrays for this specific type only
        ...(type === 'ANNOUNCEMENTS' && { announcements: [] }),
        ...(type === 'INTERVIEWS' && { interviews: [] }),
        ...(type === 'LIVE_PRESENTER_MENTIONS' && { livePresenterMentions: [] }),
        ...(type === 'JINGLES' && { jingles: [] }),
        ...(type === 'NEWS_COVERAGE' && { newsCoverage: [] }),
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

  /**
   * Removes a segment from the rate card
   * @param index - Index of the segment to remove
   */
  const removeSegment = (index: number) => {
    setMetadata({
      ...metadata,
      segments: metadata.segments.filter((_, i) => i !== index),
    });
  };

  /**
   * Adds a new announcement to a specific segment
   * @param segmentIndex - Index of the segment to add announcement to
   */
  const addAnnouncement = (segmentIndex: number) => {
    const newSegments = [...metadata.segments];
    const segment = newSegments[segmentIndex];
    
    // Ensure announcements array exists
    if (!segment.announcements) {
      segment.announcements = [];
    }
    
    segment.announcements.push({
      announcementType: 'COMMERCIAL/PRODUCTS', // Default type
      timeInterval: { startTime: '', endTime: '' },
      rate: 0,
      day: ['MONDAY'], // Default to Monday in array format
    });
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  /**
   * Updates an announcement field value
   * Handles both top-level and nested fields (like timeInterval.startTime) in a type-safe manner
   * @param segmentIndex - Index of the segment
   * @param announcementIndex - Index of the announcement within the segment
   * @param field - Field to update
   * @param value - New value
   */
  const updateAnnouncement = (
    segmentIndex: number,
    announcementIndex: number,
    field: string,
    value: string | number | string[]
  ) => {
    const newSegments = [...metadata.segments];
    const announcement = newSegments[segmentIndex].announcements?.[announcementIndex];
    
    if (!announcement) return;
    
    // Handle nested fields (e.g., timeInterval.startTime)
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'timeInterval' && announcement.timeInterval) {
        // Type-safe update for timeInterval nested object
        announcement.timeInterval = {
          ...announcement.timeInterval,
          [child]: value as string,
        };
      }
    } else {
      // Handle top-level fields in a type-safe manner
      switch (field) {
        case 'announcementType':
          announcement.announcementType = value as AnnouncementType;
          break;
        case 'rate':
          announcement.rate = value as number;
          break;
        case 'day':
          announcement.day = value as DayOfWeek[];
          break;
      }
    }
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  /**
   * Removes an announcement from a segment
   * @param segmentIndex - Index of the segment
   * @param announcementIndex - Index of the announcement to remove
   */
  const removeAnnouncement = (segmentIndex: number, announcementIndex: number) => {
    const newSegments = [...metadata.segments];
    newSegments[segmentIndex].announcements?.splice(announcementIndex, 1);
    setMetadata({ ...metadata, segments: newSegments });
  };

  /**
   * Adds a new jingle to a specific segment
   * @param segmentIndex - Index of the segment to add jingle to
   */
  const addJingle = (segmentIndex: number) => {
    const newSegments = [...metadata.segments];
    const segment = newSegments[segmentIndex];
    
    // Ensure jingles array exists
    if (!segment.jingles) {
      segment.jingles = [];
    }
    
    segment.jingles.push({
      timeInterval: { startTime: '', endTime: '' },
      duration: '30_SECS',
      rate: 0,
      day: ['MONDAY'], // Default to Monday in array format
    });
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  /**
   * Updates a jingle field value
   * Handles both top-level and nested fields (like timeInterval.startTime) in a type-safe manner
   * @param segmentIndex - Index of the segment
   * @param jingleIndex - Index of the jingle within the segment
   * @param field - Field to update
   * @param value - New value
   */
  const updateJingle = (
    segmentIndex: number,
    jingleIndex: number,
    field: string,
    value: string | number | Duration | string[]
  ) => {
    const newSegments = [...metadata.segments];
    const jingle = newSegments[segmentIndex].jingles?.[jingleIndex];
    
    if (!jingle) return;
    
    // Handle nested fields (e.g., timeInterval.startTime)
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'timeInterval' && jingle.timeInterval) {
        // Type-safe update for timeInterval nested object
        jingle.timeInterval = {
          ...jingle.timeInterval,
          [child]: value as string,
        };
      }
    } else {
      // Handle top-level fields in a type-safe manner
      switch (field) {
        case 'duration':
          jingle.duration = value as Duration;
          break;
        case 'rate':
          jingle.rate = value as number;
          break;
        case 'day':
          jingle.day = value as DayOfWeek[];
          break;
      }
    }
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  /**
   * Removes a jingle from a segment
   * @param segmentIndex - Index of the segment
   * @param jingleIndex - Index of the jingle to remove
   */
  const removeJingle = (segmentIndex: number, jingleIndex: number) => {
    const newSegments = [...metadata.segments];
    newSegments[segmentIndex].jingles?.splice(jingleIndex, 1);
    setMetadata({ ...metadata, segments: newSegments });
  };

  /**
   * Adds a new interview to a specific segment
   * @param segmentIndex - Index of the segment to add interview to
   */
  const addInterview = (segmentIndex: number) => {
    const newSegments = [...metadata.segments];
    const segment = newSegments[segmentIndex];
    
    if (!segment.interviews) {
      segment.interviews = [];
    }
    
    segment.interviews.push({
      timeInterval: { startTime: '', endTime: '' },
      durationSeconds: '10_MINS', // Default duration
      rate: 0,
      day: ['MONDAY'],
    });
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  /**
   * Updates an interview field value
   */
  const updateInterview = (
    segmentIndex: number,
    interviewIndex: number,
    field: string,
    value: string | number | string[]
  ) => {
    const newSegments = [...metadata.segments];
    const interview = newSegments[segmentIndex].interviews?.[interviewIndex];
    
    if (!interview) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'timeInterval' && interview.timeInterval) {
        interview.timeInterval = {
          ...interview.timeInterval,
          [child]: value as string,
        };
      }
    } else {
      switch (field) {
        case 'durationSeconds':
          interview.durationSeconds = value as InterviewDuration;
          break;
        case 'rate':
          interview.rate = value as number;
          break;
        case 'day':
          interview.day = value as DayOfWeek[];
          break;
      }
    }
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  /**
   * Removes an interview from a segment
   */
  const removeInterview = (segmentIndex: number, interviewIndex: number) => {
    const newSegments = [...metadata.segments];
    newSegments[segmentIndex].interviews?.splice(interviewIndex, 1);
    setMetadata({ ...metadata, segments: newSegments });
  };

  /**
   * Adds a new live presenter mention to a specific segment
   * @param segmentIndex - Index of the segment to add live presenter mention to
   */
  const addLivePresenterMention = (segmentIndex: number) => {
    const newSegments = [...metadata.segments];
    const segment = newSegments[segmentIndex];
    
    if (!segment.livePresenterMentions) {
      segment.livePresenterMentions = [];
    }
    
    segment.livePresenterMentions.push({
      mentionType: 'LIVE_PRESENTER_MENTION',
      timeInterval: { startTime: '', endTime: '' },
      rate: 0,
      day: ['MONDAY'], // Default to Monday in array format
    });
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  /**
   * Updates a live presenter mention field value
   */
  const updateLivePresenterMention = (
    segmentIndex: number,
    mentionIndex: number,
    field: string,
    value: string | number | string[]
  ) => {
    const newSegments = [...metadata.segments];
    const mention = newSegments[segmentIndex].livePresenterMentions?.[mentionIndex];
    
    if (!mention) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'timeInterval' && mention.timeInterval) {
        mention.timeInterval = {
          ...mention.timeInterval,
          [child]: value as string,
        };
      }
    } else {
      switch (field) {
        case 'mentionType':
          mention.mentionType = value as 'LIVE_PRESENTER_MENTION' | 'SPONSORSHIP_MENTION';
          break;
        case 'rate':
          mention.rate = value as number;
          break;
        case 'day':
          mention.day = value as DayOfWeek[];
          break;
      }
    }
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  /**
   * Removes a live presenter mention from a segment
   */
  const removeLivePresenterMention = (segmentIndex: number, mentionIndex: number) => {
    const newSegments = [...metadata.segments];
    newSegments[segmentIndex].livePresenterMentions?.splice(mentionIndex, 1);
    setMetadata({ ...metadata, segments: newSegments });
  };

  /**
   * Adds a new news coverage item to a specific segment
   * @param segmentIndex - Index of the segment to add news coverage to
   */
  const addNewsCoverage = (segmentIndex: number) => {
    const newSegments = [...metadata.segments];
    const segment = newSegments[segmentIndex];
    
    if (!segment.newsCoverage) {
      segment.newsCoverage = [];
    }
    
    segment.newsCoverage.push({
      location: '',
      rate: 0,
      day: ['MONDAY'],
    });
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  /**
   * Updates a news coverage field value
   */
  const updateNewsCoverage = (
    segmentIndex: number,
    coverageIndex: number,
    field: string,
    value: string | number | string[]
  ) => {
    const newSegments = [...metadata.segments];
    const coverage = newSegments[segmentIndex].newsCoverage?.[coverageIndex];
    
    if (!coverage) return;
    
    switch (field) {
      case 'location':
        coverage.location = value as string;
        break;
      case 'rate':
        coverage.rate = value as number;
        break;
      case 'day':
        coverage.day = value as DayOfWeek[];
        break;
    }
    
    setMetadata({ ...metadata, segments: newSegments });
  };

  /**
   * Removes a news coverage item from a segment
   */
  const removeNewsCoverage = (segmentIndex: number, coverageIndex: number) => {
    const newSegments = [...metadata.segments];
    newSegments[segmentIndex].newsCoverage?.splice(coverageIndex, 1);
    setMetadata({ ...metadata, segments: newSegments });
  };

  return (
    <>
      <Card className="border border-primary/5 text-primary">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-primary text-md font-semibold">FM Radio Segments</CardTitle>
          <Button 
            type="button" 
            onClick={openSegmentDialog} 
            size="sm" 
            variant="outline"
            className="border-secondary hover:bg-secondary hover:text-primary"
            disabled={metadata.segments.length >= SEGMENT_TYPE_OPTIONS.length} // Disable if all segment types are already added
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Segment
          </Button>
        </CardHeader>
      <CardContent className="space-y-4">
        {metadata.segments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No segments added yet. Click "Add Segment" to get started.</p>
          </div>
        ) : (
          metadata.segments.map((segment, segmentIndex) => (
            <Card key={segmentIndex} className="border-2 border-gray-200">
              <CardHeader className="bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      Segment {segmentIndex + 1}: {segment.segmentsTypes || 'Untitled'}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="hover:bg-primary/10"
                      onClick={() => setExpandedSegment(expandedSegment === segmentIndex ? null : segmentIndex)}
                    >
                      {expandedSegment === segmentIndex ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSegment(segmentIndex)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedSegment === segmentIndex && (
                <CardContent className="space-y-4 pt-4">
                  {/* Announcements Section - Only show if enabled */}
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
                            <FormRow >
                              <div>
                                <label className="text-sm text-gray-900 mb-1 block">Announcement Type</label>
                                <Select
                                  value={announcement.announcementType}
                                  onValueChange={(value) => updateAnnouncement(segmentIndex, announcementIndex, 'announcementType', value)}
                                >
                                  <SelectTrigger className="w-full border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border border-violet-100">
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
                              
                              
                              <TimeIntervalFields
                                startTime={announcement.timeInterval.startTime}
                                endTime={announcement.timeInterval.endTime}
                                onStartTimeChange={(value) => updateAnnouncement(segmentIndex, announcementIndex, 'timeInterval.startTime', value)}
                                onEndTimeChange={(value) => updateAnnouncement(segmentIndex, announcementIndex, 'timeInterval.endTime', value)}
                                showDeleteButton
                                onDelete={() => removeAnnouncement(segmentIndex, announcementIndex)}
                              />
                              
                              <DaysSelector
                                selectedDays={announcement.day}
                                onChange={(days) => updateAnnouncement(segmentIndex, announcementIndex, 'day', days)}
                              />
                            </FormRow>
                          </div>
                        ))
                      ) : (
                        <EmptyState message="No announcements added yet" />
                      )}
                    </div>
                  )}

                  {/* Jingles Section - Only show if enabled */}
                  {segment.enabledTypes?.includes('JINGLES') && (
                    <div className="border-t border-primary/5 pt-4">
                      <SectionHeader 
                        title="Jingles" 
                        onAdd={() => addJingle(segmentIndex)} 
                      />
                      {segment.jingles && segment.jingles.length > 0 ? (
                        segment.jingles.map((jingle, jingleIndex) => (
                          <div key={jingleIndex} className="border border-gray-300 bg-white shadow-sm p-4 rounded-lg relative mb-3 hover:shadow-md transition-shadow">
                            <div className="absolute -top-2 -right-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                              {jingleIndex + 1}
                            </div>
                          <FormRow key={jingleIndex}>
                            <DurationSelect<Duration>
                              value={jingle.duration}
                              options={JINGLE_DURATIONS}
                              onChange={(value) => updateJingle(segmentIndex, jingleIndex, 'duration', value)}
                            />
                            
                            <RateInput
                              value={jingle.rate}
                              onChange={(value) => updateJingle(segmentIndex, jingleIndex, 'rate', value)}
                            />
                            
                            <TimeIntervalFields
                              startTime={jingle.timeInterval.startTime}
                              endTime={jingle.timeInterval.endTime}
                              onStartTimeChange={(value) => updateJingle(segmentIndex, jingleIndex, 'timeInterval.startTime', value)}
                              onEndTimeChange={(value) => updateJingle(segmentIndex, jingleIndex, 'timeInterval.endTime', value)}
                              showDeleteButton
                              onDelete={() => removeJingle(segmentIndex, jingleIndex)}
                            />
                            
                            <DaysSelector
                              selectedDays={jingle.day}
                              onChange={(days) => updateJingle(segmentIndex, jingleIndex, 'day', days)}
                            />
                          </FormRow>
                        </div>
                        ))
                      ) : (
                        <EmptyState message="No jingles added yet" />
                      )}
                    </div>
                  )}

                  {/* Interviews Section - Only show if enabled */}
                  {segment.enabledTypes?.includes('INTERVIEWS') && (
                    <div className="border-t border-primary/5 pt-4">
                      <SectionHeader 
                        title="Interviews" 
                        onAdd={() => addInterview(segmentIndex)} 
                      />
                      {segment.interviews && segment.interviews.length > 0 ? (
                        segment.interviews.map((interview, interviewIndex) => (
                          <div key={interviewIndex} className="border border-gray-300 bg-white shadow-sm p-4 rounded-lg relative mb-3 hover:shadow-md transition-shadow">
                            <div className="absolute -top-2 -right-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                              {interviewIndex + 1}
                            </div>
                            <FormRow >
                              {/* <Input
                                type="number"
                                placeholder="Duration (seconds)"
                                value={interview.durationSeconds}
                                onChange={(e) => updateInterview(segmentIndex, interviewIndex, 'durationSeconds', Number(e.target.value))}
                              /> */}
                              <DurationSelect
                                value={interview.durationSeconds}
                                options={INTERVIEW_DURATIONS}
                                onChange={(value) => updateInterview(segmentIndex, interviewIndex, 'durationSeconds', value)}
                              />
                              
                              <RateInput
                                value={interview.rate}
                                onChange={(value) => updateInterview(segmentIndex, interviewIndex, 'rate', value)}
                              />
                              
                              <TimeIntervalFields
                                startTime={interview.timeInterval.startTime}
                                endTime={interview.timeInterval.endTime}
                                onStartTimeChange={(value) => updateInterview(segmentIndex, interviewIndex, 'timeInterval.startTime', value)}
                                onEndTimeChange={(value) => updateInterview(segmentIndex, interviewIndex, 'timeInterval.endTime', value)}
                                showDeleteButton
                                onDelete={() => removeInterview(segmentIndex, interviewIndex)}
                              />
                              
                              <DaysSelector
                                selectedDays={interview.day}
                                onChange={(days) => updateInterview(segmentIndex, interviewIndex, 'day', days)}
                              />
                            </FormRow>
                          </div>
                        ))
                      ) : (
                        <EmptyState message="No interviews added yet" />
                      )}
                    </div>
                  )}

                  {/* Live Presenter Mentions Section - Only show if enabled */}
                  {segment.enabledTypes?.includes('LIVE_PRESENTER_MENTIONS') && (
                    <div className="border-t border-primary/5 pt-4">
                      <SectionHeader 
                        title="Live Presenter Mentions" 
                        onAdd={() => addLivePresenterMention(segmentIndex)} 
                      />
                      {segment.livePresenterMentions && segment.livePresenterMentions.length > 0 ? (
                        segment.livePresenterMentions.map((mention, mentionIndex) => (
                          <div key={mentionIndex} className="border border-gray-300 bg-white shadow-sm p-4 rounded-lg relative mb-3 hover:shadow-md transition-shadow">
                            <div className="absolute -top-2 -right-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                              {mentionIndex + 1}
                            </div>

                            <FormRow>
                              <div>
                                <label className="text-sm text-gray-900 mb-1 block">Mention Type</label>
                                <Select
                                  value={mention.mentionType}
                                  onValueChange={(value) => updateLivePresenterMention(segmentIndex, mentionIndex, 'mentionType', value)}
                                >
                                  <SelectTrigger className="w-full border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none ">
                                    <SelectValue placeholder="Mention Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="LIVE_PRESENTER_MENTION">Live Presenter Mention</SelectItem>
                                    <SelectItem value="SPONSORSHIP_MENTION">Sponsorship Mention</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <RateInput
                                value={mention.rate}
                                onChange={(value) => updateLivePresenterMention(segmentIndex, mentionIndex, 'rate', value)}
                              />

                              <TimeIntervalFields
                                startTime={mention.timeInterval.startTime}
                                endTime={mention.timeInterval.endTime}
                                onStartTimeChange={(value) => updateLivePresenterMention(segmentIndex, mentionIndex, 'timeInterval.startTime', value)}
                                onEndTimeChange={(value) => updateLivePresenterMention(segmentIndex, mentionIndex, 'timeInterval.endTime', value)}
                                showDeleteButton
                                onDelete={() => removeLivePresenterMention(segmentIndex, mentionIndex)}
                              />
                              
                              <DaysSelector
                                selectedDays={mention.day}
                                onChange={(days) => updateLivePresenterMention(segmentIndex, mentionIndex, 'day', days)}
                              />
                            </FormRow>
                          </div>
                        ))
                      ) : (
                        <EmptyState message="No live presenter mentions added yet" />
                      )}
                    </div>
                  )}

                  {/* News Coverage Section - Only show if enabled */}
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
                            <FormRow key={coverageIndex} columns={3}>
                              <div>
                                <label className="text-sm text-gray-900 mb-1 block">Location</label>
                                <Input
                                  placeholder="Location"
                                  value={coverage.location}
                                  onChange={(e) => updateNewsCoverage(segmentIndex, coverageIndex, 'location', e.target.value)}
                                />
                              </div>
                              
                              <RateInput
                                value={coverage.rate}
                                onChange={(value) => updateNewsCoverage(segmentIndex, coverageIndex, 'rate', value)}
                              />
                              <div className="flex items-start justify-end">
                                <DeleteButton onDelete={() => removeNewsCoverage(segmentIndex, coverageIndex)} />
                              </div>
                              
                              
                              <DaysSelector
                                selectedDays={coverage.day}
                                onChange={(days) => updateNewsCoverage(segmentIndex, coverageIndex, 'day', days)}
                              />
                            </FormRow>
                          </div>
                        ))
                      ) : (
                        <EmptyState message="No news coverage items added yet" />
                      )}
                    </div>
                  )}
                  {/* End of segment type sections */}
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
