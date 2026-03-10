import { Controller } from "react-hook-form";
import type { Control, UseFieldArrayRemove, FieldValues, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import type { DayOfWeek } from "../types";
import { dummyRateCards } from "@/features/media-partner-features/rate-cards";
import type { 
    FMMetadata, 
    AnnouncementType,
    Interview,
    Jingle,
    LivePresenterMention,
    TimeInterval,
    NewsCoverageRadio
} from "@/features/media-partner-features/rate-cards/types";
import { useMemo, useEffect } from "react";

interface FMSegmentCardProps {
    channelIndex: number;
    segmentIndex: number;
    control: Control<FieldValues>;
    removeSegment: UseFieldArrayRemove;
    watch: UseFormWatch<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
}

export default function FMSegmentCard({ 
    channelIndex, 
    segmentIndex, 
    control, 
    removeSegment,
    watch,
    setValue
}: FMSegmentCardProps) {
    // Watch relevant fields
    const channelName = watch(`channels.${channelIndex}.channelName`);
    const segmentType = watch(`channels.${channelIndex}.segments.${segmentIndex}.segmentType`);
    const timeSlot = watch(`channels.${channelIndex}.segments.${segmentIndex}.timeSlot`);
    const announcementType = watch(`channels.${channelIndex}.segments.${segmentIndex}.announcementType`);
    const jingleDuration = watch(`channels.${channelIndex}.segments.${segmentIndex}.jingleDuration`);
    const interviewDuration = watch(`channels.${channelIndex}.segments.${segmentIndex}.interviewDuration`);
    const livePresenterMentionType = watch(`channels.${channelIndex}.segments.${segmentIndex}.livePresenterMentionType`);
    const newsCoverageLocation = watch(`channels.${channelIndex}.segments.${segmentIndex}.newsCoverageLocation`);

    // Get available segment types for the selected channel
    const availableSegmentTypes = useMemo(() => {
        if (!channelName) return [];

        const rateCard = dummyRateCards.find(card => card.mediaPartnerName === channelName && card.mediaType === 'FM');
        if (!rateCard) return [];

        const metadata = rateCard.metadata as FMMetadata;
        const segments = metadata.segments || [];
        
        // Extract unique segment types from the rate card
        const segmentTypesSet = new Set<string>();
        segments.forEach(seg => {
            if (seg.segmentType) {
                segmentTypesSet.add(seg.segmentType);
            }
        });
        
        return Array.from(segmentTypesSet);
    }, [channelName]);

    // Get the selected rate card and extract time slots/options based on segment type
    const { timeSlots, announcementTypes, livePresenterMentionTypes, jingleDurations, interviewDurations, newsCoverageLocations } = useMemo(() => {
        if (!channelName || !segmentType) {
            return { timeSlots: [], announcementTypes: [], livePresenterMentionTypes: [], jingleDurations: [], interviewDurations: [], newsCoverageLocations: [] };
        }

        const rateCard = dummyRateCards.find(card => card.mediaPartnerName === channelName && card.mediaType === 'FM');
        if (!rateCard) {
            return { timeSlots: [], announcementTypes: [], livePresenterMentionTypes: [], jingleDurations: [], interviewDurations: [], newsCoverageLocations: [] };
        }

        const metadata = rateCard.metadata as FMMetadata;
        const segments = metadata.segments || [];
        
        const matchingSegments = segments.filter((seg) => seg.segmentType === segmentType);
        
        const slotsSet = new Set<string>();
        const announcements: AnnouncementType[] = [];
        const livePresenterMentionTypesSet = new Set<string>();
        const jingleDurationsSet = new Set<string>();
        const interviewDurationsSet = new Set<string>();
        const newsCoverageLocationsSet = new Set<string>();

        matchingSegments.forEach((seg) => {
            if (segmentType === 'ANNOUNCEMENTS' && 'announcements' in seg && seg.announcements) {
                seg.announcements.forEach((ann) => {
                    if ('timeInterval' in ann && ann.timeInterval && typeof ann.timeInterval === 'object') {
                        const interval = ann.timeInterval as TimeInterval;
                        slotsSet.add(`${interval.startTime} - ${interval.endTime}`);
                    }
                    if (ann.announcementType && !announcements.includes(ann.announcementType)) {
                        announcements.push(ann.announcementType);
                    }
                });
            } else if (segmentType === 'INTERVIEWS' && 'interviews' in seg && seg.interviews) {
                seg.interviews.forEach((int: Interview) => {
                    if (int.timeInterval) {
                        slotsSet.add(`${int.timeInterval.startTime} - ${int.timeInterval.endTime}`);
                    }
                    if (int.durationSeconds) {
                        interviewDurationsSet.add(int.durationSeconds);
                    }
                });
            } else if (segmentType === 'JINGLES' && 'jingles' in seg && seg.jingles) {
                seg.jingles.forEach((jing: Jingle) => {
                    if (jing.timeInterval) {
                        slotsSet.add(`${jing.timeInterval.startTime} - ${jing.timeInterval.endTime}`);
                    }
                    if (jing.duration) {
                        jingleDurationsSet.add(jing.duration);
                    }
                });
            } else if (segmentType === 'LIVE_PRESENTER_MENTIONS' && 'livePresenterMentions' in seg && seg.livePresenterMentions) {
                seg.livePresenterMentions.forEach((lpm: LivePresenterMention) => {
                    if (lpm.timeInterval) {
                        slotsSet.add(`${lpm.timeInterval.startTime} - ${lpm.timeInterval.endTime}`);
                    }
                    if (lpm.mentionType) {
                        livePresenterMentionTypesSet.add(lpm.mentionType);
                    }
                });
            } else if (segmentType === 'NEWS_COVERAGE' && 'newsCoverage' in seg && seg.newsCoverage) {
                seg.newsCoverage.forEach((nc: NewsCoverageRadio) => {
                    if (nc.location) {
                        newsCoverageLocationsSet.add(nc.location);
                    }
                });
            }
        });

        return { 
            timeSlots: Array.from(slotsSet), 
            announcementTypes: announcements,
            livePresenterMentionTypes: Array.from(livePresenterMentionTypesSet),
            jingleDurations: Array.from(jingleDurationsSet),
            interviewDurations: Array.from(interviewDurationsSet),
            newsCoverageLocations: Array.from(newsCoverageLocationsSet)
        };
    }, [channelName, segmentType]);

    // Get available days based on selections
    const availableDays = useMemo(() => {
        if (!channelName || !segmentType) return [];

        const rateCard = dummyRateCards.find(card => card.mediaPartnerName === channelName && card.mediaType === 'FM');
        if (!rateCard) return [];

        const metadata = rateCard.metadata as FMMetadata;
        const segments = metadata.segments || [];
        const matchingSegments = segments.filter((seg) => seg.segmentType === segmentType);

        const daysSet = new Set<DayOfWeek>();

        matchingSegments.forEach((seg) => {
            if (segmentType === 'ANNOUNCEMENTS' && 'announcements' in seg && seg.announcements) {
                seg.announcements.forEach((ann) => {
                    // Filter by time slot if selected
                    if (timeSlot) {
                        const [startTime, endTime] = timeSlot.split(' - ');
                        const matchesTimeSlot = ann.timeInterval?.startTime === startTime && ann.timeInterval?.endTime === endTime;
                        if (!matchesTimeSlot) return;
                    }
                    // Filter by announcement type if selected
                    if (announcementType && ann.announcementType !== announcementType) return;
                    
                    // Add days from this matching announcement
                    if (ann.day && Array.isArray(ann.day)) {
                        ann.day.forEach((d) => daysSet.add(d as DayOfWeek));
                    }
                });
            } else if (segmentType === 'INTERVIEWS' && 'interviews' in seg && seg.interviews) {
                seg.interviews.forEach((int: Interview) => {
                    if (timeSlot) {
                        const [startTime, endTime] = timeSlot.split(' - ');
                        const matchesTimeSlot = int.timeInterval?.startTime === startTime && int.timeInterval?.endTime === endTime;
                        if (!matchesTimeSlot) return;
                    }
                    if (interviewDuration && int.durationSeconds !== interviewDuration) return;
                    
                    if (int.day && Array.isArray(int.day)) {
                        int.day.forEach((d) => daysSet.add(d as DayOfWeek));
                    }
                });
            } else if (segmentType === 'JINGLES' && 'jingles' in seg && seg.jingles) {
                seg.jingles.forEach((jing: Jingle) => {
                    if (timeSlot) {
                        const [startTime, endTime] = timeSlot.split(' - ');
                        const matchesTimeSlot = jing.timeInterval?.startTime === startTime && jing.timeInterval?.endTime === endTime;
                        if (!matchesTimeSlot) return;
                    }
                    if (jingleDuration && jing.duration !== jingleDuration) return;
                    
                    if (jing.day && Array.isArray(jing.day)) {
                        jing.day.forEach((d) => daysSet.add(d as DayOfWeek));
                    }
                });
            } else if (segmentType === 'LIVE_PRESENTER_MENTIONS' && 'livePresenterMentions' in seg && seg.livePresenterMentions) {
                seg.livePresenterMentions.forEach((lpm: LivePresenterMention) => {
                    if (timeSlot) {
                        const [startTime, endTime] = timeSlot.split(' - ');
                        const matchesTimeSlot = lpm.timeInterval?.startTime === startTime && lpm.timeInterval?.endTime === endTime;
                        if (!matchesTimeSlot) return;
                    }
                    if (livePresenterMentionType && lpm.mentionType !== livePresenterMentionType) return;
                    
                    if (lpm.day && Array.isArray(lpm.day)) {
                        lpm.day.forEach((d) => daysSet.add(d as DayOfWeek));
                    }
                });
            } else if (segmentType === 'NEWS_COVERAGE' && 'newsCoverage' in seg && seg.newsCoverage) {
                seg.newsCoverage.forEach((nc: NewsCoverageRadio) => {
                    // Filter by location if selected
                    if (newsCoverageLocation && nc.location !== newsCoverageLocation) return;
                    
                    if (nc.day && Array.isArray(nc.day)) {
                        nc.day.forEach((d) => daysSet.add(d as DayOfWeek));
                    }
                });
            }
        });

        return Array.from(daysSet);
    }, [channelName, segmentType, timeSlot, announcementType, jingleDuration, interviewDuration, livePresenterMentionType, newsCoverageLocation]);

    // Auto-populate rate based on selected properties
    useEffect(() => {
        if (!channelName || !segmentType) return;
        
        // NEWS_COVERAGE doesn't require timeSlot, use location instead
        if (segmentType !== 'NEWS_COVERAGE' && !timeSlot) return;

        const rateCard = dummyRateCards.find(card => card.mediaPartnerName === channelName && card.mediaType === 'FM');
        if (!rateCard) return;

        const metadata = rateCard.metadata as FMMetadata;
        const segments = metadata.segments || [];

        let foundRate: number | null = null;

        // Handle NEWS_COVERAGE separately (no time slot required)
        if (segmentType === 'NEWS_COVERAGE') {
            if (!newsCoverageLocation) return;
            
            for (const seg of segments) {
                if (seg.segmentType !== 'NEWS_COVERAGE') continue;
                
                if ('newsCoverage' in seg && seg.newsCoverage) {
                    const match = seg.newsCoverage.find((nc: NewsCoverageRadio) => {
                        return nc.location === newsCoverageLocation;
                    });
                    if (match) {
                        foundRate = match.rate;
                        break;
                    }
                }
            }
            
            if (foundRate !== null) {
                setValue(`channels.${channelIndex}.segments.${segmentIndex}.unitRate`, foundRate);
            }
            return;
        }

        // For other segment types, require time slot
        if (!timeSlot) return;

        const [startTime, endTime] = timeSlot.split(' - ');
        if (!startTime || !endTime) return;

        for (const seg of segments) {
            if (seg.segmentType !== segmentType) continue;

            if (segmentType === 'ANNOUNCEMENTS' && 'announcements' in seg && seg.announcements) {
                const match = seg.announcements.find(ann => {
                    if ('timeInterval' in ann && ann.timeInterval && typeof ann.timeInterval === 'object') {
                        const interval = ann.timeInterval as TimeInterval;
                        const matchesTimeSlot = interval.startTime === startTime && interval.endTime === endTime;
                        const matchesType = !announcementType || ann.announcementType === announcementType;
                        return matchesTimeSlot && matchesType;
                    }
                    return false;
                });
                if (match) {
                    foundRate = match.rate;
                    break;
                }
            }
            else if (segmentType === 'INTERVIEWS' && 'interviews' in seg && seg.interviews) {
                const match = seg.interviews.find((int: Interview) => {
                    const matchesTimeSlot = int.timeInterval?.startTime === startTime && 
                        int.timeInterval?.endTime === endTime;
                    const matchesDuration = !interviewDuration || int.durationSeconds === interviewDuration;
                    return matchesTimeSlot && matchesDuration;
                });
                if (match) {
                    foundRate = match.rate;
                    break;
                }
            }
            else if (segmentType === 'JINGLES' && 'jingles' in seg && seg.jingles) {
                const match = seg.jingles.find((jing: Jingle) => {
                    const matchesTimeSlot = jing.timeInterval?.startTime === startTime && 
                        jing.timeInterval?.endTime === endTime;
                    const matchesDuration = !jingleDuration || jing.duration === jingleDuration;
                    return matchesTimeSlot && matchesDuration;
                });
                if (match) {
                    foundRate = match.rate;
                    break;
                }
            }
            else if (segmentType === 'LIVE_PRESENTER_MENTIONS' && 'livePresenterMentions' in seg && seg.livePresenterMentions) {
                const match = seg.livePresenterMentions.find((lpm: LivePresenterMention) => {
                    const matchesTimeSlot = lpm.timeInterval?.startTime === startTime && 
                        lpm.timeInterval?.endTime === endTime;
                    const matchesType = !livePresenterMentionType || lpm.mentionType === livePresenterMentionType;
                    return matchesTimeSlot && matchesType;
                });
                if (match) {
                    foundRate = match.rate;
                    break;
                }
            }
        }

        if (foundRate !== null) {
            setValue(`channels.${channelIndex}.segments.${segmentIndex}.unitRate`, foundRate);
        }
    }, [channelName, segmentType, timeSlot, announcementType, jingleDuration, interviewDuration, livePresenterMentionType, newsCoverageLocation, channelIndex, segmentIndex, setValue]);

    return (
        <div className="border border-primary/10 rounded-lg shadow-md p-4 space-y-4 bg-gray-50">
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-700">FM Segment {segmentIndex + 1}</p>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeSegment(segmentIndex)}
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Program Name</label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.programName`}
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="e.g., Morning Show" className="w-full input-field" />
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Segment Type</label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.segmentType`}
                        control={control}
                        render={({ field }) => (
                            <Select 
                                onValueChange={(value) => field.onChange(value)} 
                                value={field.value}
                                disabled={!channelName || availableSegmentTypes.length === 0}
                            >
                                <SelectTrigger className="w-full input-field">
                                    <SelectValue placeholder={
                                        !channelName 
                                            ? "Select channel first" 
                                            : availableSegmentTypes.length === 0 
                                                ? "No segment types available for this channel" 
                                                : "Select segment type"
                                    } />
                                </SelectTrigger>
                                <SelectContent className="w-full bg-white border-primary/10">
                                    {availableSegmentTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase().replace(/_/g, ' ')}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Time Slot - For all except NEWS_COVERAGE */}
                {segmentType !== 'NEWS_COVERAGE' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Time Slot</label>
                        <Controller
                            name={`channels.${channelIndex}.segments.${segmentIndex}.timeSlot`}
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    onValueChange={(value) => field.onChange(value)} 
                                    value={field.value}
                                    disabled={!segmentType || timeSlots.length === 0}
                                >
                                    <SelectTrigger className="w-full input-field">
                                        <SelectValue placeholder={
                                            !segmentType 
                                                ? "Select segment type first" 
                                                : timeSlots.length === 0 
                                                    ? "No time slots available" 
                                                    : "Select time slot"
                                        } />
                                    </SelectTrigger>
                                    <SelectContent className="w-full bg-white border-primary/10">
                                        {timeSlots.map((slot) => (
                                            <SelectItem key={slot} value={slot}>
                                                {slot}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                )}

                {/* Location - Only for NEWS_COVERAGE */}
                {segmentType === 'NEWS_COVERAGE' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <Controller
                            name={`channels.${channelIndex}.segments.${segmentIndex}.newsCoverageLocation`}
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    onValueChange={(value) => field.onChange(value)} 
                                    value={field.value}
                                    disabled={newsCoverageLocations.length === 0}
                                >
                                    <SelectTrigger className="w-full input-field">
                                        <SelectValue placeholder={
                                            newsCoverageLocations.length === 0 
                                                ? "No locations available for this channel" 
                                                : "Select location"
                                        } />
                                    </SelectTrigger>
                                    <SelectContent className="w-full bg-white border-primary/10">
                                        {newsCoverageLocations.map(location => (
                                            <SelectItem key={location} value={location}>
                                                {location}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                )}

                {/* Announcement Type - Only for ANNOUNCEMENTS */}
                {segmentType === 'ANNOUNCEMENTS' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Announcement Type</label>
                        <Controller
                            name={`channels.${channelIndex}.segments.${segmentIndex}.announcementType`}
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    onValueChange={(value) => field.onChange(value)} 
                                    value={field.value}
                                    disabled={announcementTypes.length === 0}
                                >
                                    <SelectTrigger className="w-full input-field">
                                        <SelectValue placeholder="Select announcement type" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full bg-white border-primary/10">
                                        {announcementTypes.map(type => (
                                            <SelectItem key={type} value={type}>
                                                {type.toLowerCase().replace(/_/g, ' ')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                )}

                {/* Jingle Duration - Only for JINGLES */}
                {segmentType === 'JINGLES' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Jingle Duration</label>
                        <Controller
                            name={`channels.${channelIndex}.segments.${segmentIndex}.jingleDuration`}
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    onValueChange={(value) => field.onChange(value)} 
                                    value={field.value}
                                    disabled={jingleDurations.length === 0}
                                >
                                    <SelectTrigger className="w-full input-field">
                                        <SelectValue placeholder={
                                            jingleDurations.length === 0 
                                                ? "No jingle durations available for this channel" 
                                                : "Select duration"
                                        } />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jingleDurations.map(duration => (
                                            <SelectItem key={duration} value={duration}>
                                                {duration.replace('_', ' ').toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                )}

                {/* Interview Duration - Only for INTERVIEWS */}
                {segmentType === 'INTERVIEWS' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Interview Duration</label>
                        <Controller
                            name={`channels.${channelIndex}.segments.${segmentIndex}.interviewDuration`}
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    onValueChange={(value) => field.onChange(value)} 
                                    value={field.value}
                                    disabled={interviewDurations.length === 0}
                                >
                                    <SelectTrigger className="w-full input-field">
                                        <SelectValue placeholder={
                                            interviewDurations.length === 0 
                                                ? "No interview durations available for this channel" 
                                                : "Select duration"
                                        } />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {interviewDurations.map(duration => (
                                            <SelectItem key={duration} value={duration}>
                                                {duration.replace('_', ' ').toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                )}

                {/* Live Presenter Mention Type - Only for LIVE_PRESENTER_MENTIONS */}
                {segmentType === 'LIVE_PRESENTER_MENTIONS' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Mention Type</label>
                        <Controller
                            name={`channels.${channelIndex}.segments.${segmentIndex}.livePresenterMentionType`}
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    onValueChange={(value) => field.onChange(value)} 
                                    value={field.value}
                                    disabled={livePresenterMentionTypes.length === 0}
                                >
                                    <SelectTrigger className="w-full input-field">
                                        <SelectValue placeholder={
                                            livePresenterMentionTypes.length === 0 
                                                ? "No mention types available for this channel" 
                                                : "Select mention type"
                                        } />
                                    </SelectTrigger>
                                    <SelectContent className="w-full bg-white border-primary/10">
                                        {livePresenterMentionTypes.map(type => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                )}

                {/* Rate per Spot - Auto-calculated */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Rate per Spot (GHS)
                        <span className="text-xs text-gray-500 ml-2">(Auto-populated)</span>
                    </label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.unitRate`}
                        control={control}
                        render={({ field }) => (
                            <Input 
                                {...field} 
                                type="number" 
                                placeholder="Select properties to see rate"
                                readOnly
                                className="w-full input-field bg-gray-50 cursor-not-allowed"
                            />
                        )}
                    />
                </div>

                {/* Spots per Day */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Spots per Day</label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.spotsPerDay`}
                        control={control}
                        render={({ field }) => (
                            <Input 
                                {...field} 
                                type="number" 
                                placeholder="0"
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                className="w-full input-field"
                            />
                        )}
                    />
                </div>

                {/* Days of Week */}
                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Days of Week</label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.days`}
                        control={control}
                        render={({ field }) => (
                            <div className="flex flex-wrap gap-2">
                                {availableDays.length === 0 ? (
                                    <p className="text-sm text-gray-500">Select segment details to see available days</p>
                                ) : (
                                    availableDays.map(day => {
                                        const isSelected = field.value?.includes(day);
                                        return (
                                            <Badge
                                                key={day}
                                                 variant={isSelected ? "default" : "outline"}
                                                className={`cursor-pointer ${isSelected ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
                                                onClick={() => {
                                                    const currentDays = field.value || [];
                                                    if (isSelected) {
                                                        field.onChange(currentDays.filter((d: DayOfWeek) => d !== day));
                                                    } else {
                                                        field.onChange([...currentDays, day]);
                                                    }
                                                }}
                                            >
                                                {day.substring(0, 3)}
                                            </Badge>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
