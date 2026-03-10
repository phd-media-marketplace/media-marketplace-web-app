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
    TVMetadata, 
    AnnouncementType,
    SpotAdvert,
    Documentary,
    TVAnnouncement,
    SpotAdvertType,
    NewsCoverageTV,
    AdType,
    Preaching,
    AirtimeSale,
    Media,
    MediaTypeForVideo,
    InterviewDuration,
    ProductPlacementDuration
} from "@/features/media-partner-features/rate-cards/types";
import { useMemo, useEffect } from "react";

interface TVSegmentCardProps {
    channelIndex: number;
    segmentIndex: number;
    control: Control<FieldValues>;
    removeSegment: UseFieldArrayRemove;
    watch: UseFormWatch<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
}

export default function TVSegmentCard({ 
    channelIndex, 
    segmentIndex, 
    control, 
    removeSegment,
    watch,
    setValue
}: TVSegmentCardProps) {
    // Watch relevant fields
    const channelName = watch(`channels.${channelIndex}.channelName`);
    const segmentType = watch(`channels.${channelIndex}.segments.${segmentIndex}.segmentType`);
    const timeSlot = watch(`channels.${channelIndex}.segments.${segmentIndex}.timeSlot`);
    const announcementType = watch(`channels.${channelIndex}.segments.${segmentIndex}.announcementType`);
    const spotAdvertType = watch(`channels.${channelIndex}.segments.${segmentIndex}.spotAdvertType`);
    const documentaryType = watch(`channels.${channelIndex}.segments.${segmentIndex}.documentaryType`);
    const interviewDuration = watch(`channels.${channelIndex}.segments.${segmentIndex}.interviewDuration`);
    const newsCoverageLocation = watch(`channels.${channelIndex}.segments.${segmentIndex}.newsCoverageLocation`);
    const newsCoverageAdType = watch(`channels.${channelIndex}.segments.${segmentIndex}.newsCoverageAdType`);
    const preachingDuration = watch(`channels.${channelIndex}.segments.${segmentIndex}.preachingDuration`);
    const airtimeSaleDuration = watch(`channels.${channelIndex}.segments.${segmentIndex}.airtimeSaleDuration`);
    const mediaType = watch(`channels.${channelIndex}.segments.${segmentIndex}.mediaType`);
    const mediaDuration = watch(`channels.${channelIndex}.segments.${segmentIndex}.mediaDuration`);
    const productPlacementDuration = watch(`channels.${channelIndex}.segments.${segmentIndex}.productPlacementDuration`);

    // Get available segment types for the selected channel
    const availableSegmentTypes = useMemo(() => {
        if (!channelName) return [];

        const rateCard = dummyRateCards.find(card => card.mediaPartnerName === channelName && card.mediaType === 'TV');
        if (!rateCard) return [];

        const metadata = rateCard.metadata as TVMetadata;
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

    // Get the selected rate card and extract available options based on segment type
    const { timeSlots, announcementTypes, spotAdvertTypes, documentaryDurations, interviewDurations, newsCoverageLocations, newsCoverageAdTypes, preachingDurations, airtimeSaleDurations, mediaTypes, productPlacementDurations } = useMemo(() => {
        if (!channelName || !segmentType) {
            return { 
                timeSlots: [], 
                announcementTypes: [], 
                spotAdvertTypes: [],
                documentaryDurations: [],
                interviewDurations: [],
                newsCoverageLocations: [],
                newsCoverageAdTypes: [],
                preachingDurations: [],
                airtimeSaleDurations: [],
                mediaTypes: [],
                productPlacementDurations: []
            };
        }

        const rateCard = dummyRateCards.find(card => card.mediaPartnerName === channelName && card.mediaType === 'TV');
        if (!rateCard) {
            return { 
                timeSlots: [], 
                announcementTypes: [], 
                spotAdvertTypes: [],
                documentaryDurations: [],
                interviewDurations: [],
                newsCoverageLocations: [],
                newsCoverageAdTypes: [],
                preachingDurations: [],
                airtimeSaleDurations: [],
                mediaTypes: [],
                productPlacementDurations: []
            };
        }

        const metadata = rateCard.metadata as TVMetadata;
        const segments = metadata.segments || [];
        
        const matchingSegments = segments.filter((seg) => seg.segmentType === segmentType);
        
        const slotsSet = new Set<string>();
        const announcements: AnnouncementType[] = [];
        const spotTypes: SpotAdvertType[] = [];
        const docDurations = new Set<string>();
        const intDurations = new Set<string>();
        const newsCoverageLocationsSet = new Set<string>();
        const newsCoverageAdTypesSet = new Set<AdType>();
        const preachDurations = new Set<InterviewDuration>();
        const airtimeDurations = new Set<InterviewDuration>();
        const mediaTypesSet = new Set<MediaTypeForVideo>();
        const productPlacementDurationsSet = new Set<ProductPlacementDuration>();

        matchingSegments.forEach((seg) => {
            if (segmentType === 'SPOT_ADVERTS' && 'spotAdverts' in seg && seg.spotAdverts) {
                seg.spotAdverts.forEach((spot: SpotAdvert) => {
                    if (spot.timeInterval) {
                        slotsSet.add(`${spot.timeInterval.startTime} - ${spot.timeInterval.endTime}`);
                    }
                    if (spot.spotAdvertType && !spotTypes.includes(spot.spotAdvertType)) {
                        spotTypes.push(spot.spotAdvertType);
                    }
                    // Handle PRODUCT_PLACEMENT within SPOT_ADVERTS
                    if (spot.productPlacement && spot.productPlacement.duration) {
                        productPlacementDurationsSet.add(spot.productPlacement.duration);
                    }
                });
            } else if (segmentType === 'DOCUMENTARY' && 'documentary' in seg && seg.documentary) {
                seg.documentary.forEach((doc: Documentary) => {
                    if (doc.timeInterval) {
                        slotsSet.add(`${doc.timeInterval.startTime} - ${doc.timeInterval.endTime}`);
                    }
                    if (doc.durationMinutes) {
                        docDurations.add(doc.durationMinutes);
                    }
                });
            } else if (segmentType === 'ANNOUNCEMENTS' && 'announcements' in seg && seg.announcements) {
                seg.announcements.forEach((ann: TVAnnouncement) => {
                    if (ann.announcementType && !announcements.includes(ann.announcementType)) {
                        announcements.push(ann.announcementType);
                    }
                });
            } else if (segmentType === 'EXECUTIVE_INTERVIEW' && 'executiveInterview' in seg && seg.executiveInterview) {
                seg.executiveInterview.forEach((interview) => {
                    if (interview.durationMinutes) {
                        intDurations.add(interview.durationMinutes);
                    }
                });
            } else if (segmentType === 'NEWS_COVERAGE' && 'newsCoverage' in seg && seg.newsCoverage) {
                seg.newsCoverage.forEach((nc: NewsCoverageTV) => {
                    if (nc.location) {
                        newsCoverageLocationsSet.add(nc.location);
                    }
                    if (nc.adType) {
                        newsCoverageAdTypesSet.add(nc.adType);
                    }
                });
            } else if (segmentType === 'PREACHING' && 'preaching' in seg && seg.preaching) {
                seg.preaching.forEach((preach: Preaching) => {
                    if (preach.timeInterval) {
                        slotsSet.add(`${preach.timeInterval.startTime} - ${preach.timeInterval.endTime}`);
                    }
                    if (preach.durationMinutes) {
                        preachDurations.add(preach.durationMinutes);
                    }
                });
            } else if (segmentType === 'AIRTIME_SALE' && 'airtimeSale' in seg && seg.airtimeSale) {
                seg.airtimeSale.forEach((airtime: AirtimeSale) => {
                    if (airtime.timeInterval) {
                        slotsSet.add(`${airtime.timeInterval.startTime} - ${airtime.timeInterval.endTime}`);
                    }
                    if (airtime.durationMinutes) {
                        airtimeDurations.add(airtime.durationMinutes);
                    }
                });
            } else if (segmentType === 'MEDIA' && 'media' in seg && seg.media) {
                seg.media.forEach((mediaItem: Media) => {
                    if (mediaItem.mediaType) {
                        mediaTypesSet.add(mediaItem.mediaType);
                    }
                });
            }
        });

        return { 
            timeSlots: Array.from(slotsSet), 
            announcementTypes: announcements,
            spotAdvertTypes: spotTypes,
            documentaryDurations: Array.from(docDurations),
            interviewDurations: Array.from(intDurations),
            newsCoverageLocations: Array.from(newsCoverageLocationsSet),
            newsCoverageAdTypes: Array.from(newsCoverageAdTypesSet),
            preachingDurations: Array.from(preachDurations),
            airtimeSaleDurations: Array.from(airtimeDurations),
            mediaTypes: Array.from(mediaTypesSet),
            productPlacementDurations: Array.from(productPlacementDurationsSet)
        };
    }, [channelName, segmentType]);

    // Get available days based on selections
    const availableDays = useMemo(() => {
        if (!channelName || !segmentType) return [];

        const rateCard = dummyRateCards.find(card => card.mediaPartnerName === channelName && card.mediaType === 'TV');
        if (!rateCard) return [];

        const metadata = rateCard.metadata as TVMetadata;
        const segments = metadata.segments || [];
        const matchingSegments = segments.filter((seg) => seg.segmentType === segmentType);

        const daysSet = new Set<DayOfWeek>();

        matchingSegments.forEach((seg) => {
            if (segmentType === 'SPOT_ADVERTS' && 'spotAdverts' in seg && seg.spotAdverts) {
                seg.spotAdverts.forEach((spot: SpotAdvert) => {
                    // Filter by time slot if selected
                    if (timeSlot) {
                        const [startTime, endTime] = timeSlot.split(' - ');
                        const matchesTimeSlot = spot.timeInterval?.startTime === startTime && spot.timeInterval?.endTime === endTime;
                        if (!matchesTimeSlot) return;
                    }
                    // Filter by spot advert type if selected
                    if (spotAdvertType && spot.spotAdvertType !== spotAdvertType) return;
                    
                    // Add days from this matching spot advert
                    if (spot.day && Array.isArray(spot.day)) {
                        spot.day.forEach((d) => daysSet.add(d as DayOfWeek));
                    }
                });
            } else if (segmentType === 'DOCUMENTARY' && 'documentary' in seg && seg.documentary) {
                seg.documentary.forEach((doc: Documentary) => {
                    if (timeSlot) {
                        const [startTime, endTime] = timeSlot.split(' - ');
                        const matchesTimeSlot = doc.timeInterval?.startTime === startTime && doc.timeInterval?.endTime === endTime;
                        if (!matchesTimeSlot) return;
                    }
                    if (documentaryType && doc.documentaryType !== documentaryType) return;
                    if (interviewDuration && doc.durationMinutes !== interviewDuration) return;
                    
                    if (doc.day && Array.isArray(doc.day)) {
                        doc.day.forEach((d) => daysSet.add(d as DayOfWeek));
                    }
                });
            } else if (segmentType === 'ANNOUNCEMENTS' && 'announcements' in seg && seg.announcements) {
                seg.announcements.forEach((ann: TVAnnouncement) => {
                    if (announcementType && ann.announcementType !== announcementType) return;
                    
                    if (ann.day && Array.isArray(ann.day)) {
                        ann.day.forEach((d) => daysSet.add(d as DayOfWeek));
                    }
                });
            } else if (segmentType === 'EXECUTIVE_INTERVIEW' && 'executiveInterview' in seg && seg.executiveInterview) {
                seg.executiveInterview.forEach((interview) => {
                    if (interviewDuration && interview.durationMinutes !== interviewDuration) return;
                    
                    if (interview.day && Array.isArray(interview.day)) {
                        interview.day.forEach((d) => daysSet.add(d as DayOfWeek));
                    }
                });
            } else if (segmentType === 'NEWS_COVERAGE' && 'newsCoverage' in seg && seg.newsCoverage) {
                seg.newsCoverage.forEach((nc: NewsCoverageTV) => {
                    // Filter by location if selected
                    if (newsCoverageLocation && nc.location !== newsCoverageLocation) return;
                    // Filter by ad type if selected
                    if (newsCoverageAdType && nc.adType !== newsCoverageAdType) return;
                    
                    if (nc.day && Array.isArray(nc.day)) {
                        nc.day.forEach((d) => daysSet.add(d as DayOfWeek));
                    }
                });
            } else if (segmentType === 'PREACHING' && 'preaching' in seg && seg.preaching) {
                seg.preaching.forEach((preach: Preaching) => {
                    if (timeSlot) {
                        const [startTime, endTime] = timeSlot.split(' - ');
                        const matchesTimeSlot = preach.timeInterval?.startTime === startTime && preach.timeInterval?.endTime === endTime;
                        if (!matchesTimeSlot) return;
                    }
                    if (preachingDuration && preach.durationMinutes !== preachingDuration) return;
                    
                    if (preach.day && Array.isArray(preach.day)) {
                        preach.day.forEach((d) => daysSet.add(d as DayOfWeek));
                    }
                });
            } else if (segmentType === 'AIRTIME_SALE' && 'airtimeSale' in seg && seg.airtimeSale) {
                seg.airtimeSale.forEach((airtime: AirtimeSale) => {
                    if (timeSlot) {
                        const [startTime, endTime] = timeSlot.split(' - ');
                        const matchesTimeSlot = airtime.timeInterval?.startTime === startTime && airtime.timeInterval?.endTime === endTime;
                        if (!matchesTimeSlot) return;
                    }
                    if (airtimeSaleDuration && airtime.durationMinutes !== airtimeSaleDuration) return;
                    
                    if (airtime.day && Array.isArray(airtime.day)) {
                        airtime.day.forEach((d) => daysSet.add(d as DayOfWeek));
                    }
                });
            } else if (segmentType === 'MEDIA' && 'media' in seg && seg.media) {
                seg.media.forEach((mediaItem: Media) => {
                    if (mediaType && mediaItem.mediaType !== mediaType) return;
                    if (mediaDuration && mediaItem.durationSeconds !== parseInt(mediaDuration)) return;
                    
                    if (mediaItem.day && Array.isArray(mediaItem.day)) {
                        mediaItem.day.forEach((d) => daysSet.add(d as DayOfWeek));
                    }
                });
            }
        });

        return Array.from(daysSet);
    }, [channelName, segmentType, timeSlot, announcementType, spotAdvertType, documentaryType, interviewDuration, newsCoverageLocation, newsCoverageAdType, preachingDuration, airtimeSaleDuration, mediaType, mediaDuration]);

    // Auto-populate rate based on selected properties
    useEffect(() => {
        if (!channelName || !segmentType) return;
        
        // NEWS_COVERAGE doesn't require timeSlot, uses location and adType
        if (segmentType !== 'NEWS_COVERAGE' && segmentType !== 'ANNOUNCEMENTS' && segmentType !== 'EXECUTIVE_INTERVIEW' && !timeSlot) return;

        const rateCard = dummyRateCards.find(card => card.mediaPartnerName === channelName && card.mediaType === 'TV');
        if (!rateCard) return;

        const metadata = rateCard.metadata as TVMetadata;
        const segments = metadata.segments || [];

        let foundRate: number | null = null;

        // Handle NEWS_COVERAGE separately (no time slot required)
        if (segmentType === 'NEWS_COVERAGE') {
            if (!newsCoverageLocation || !newsCoverageAdType) return;
            
            for (const seg of segments) {
                if (seg.segmentType !== 'NEWS_COVERAGE') continue;
                
                if ('newsCoverage' in seg && seg.newsCoverage) {
                    const match = seg.newsCoverage.find((nc: NewsCoverageTV) => {
                        return nc.location === newsCoverageLocation && nc.adType === newsCoverageAdType;
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

        // Parse time slot if present (for segment types that use it)
        let startTime: string | undefined;
        let endTime: string | undefined;
        if (timeSlot) {
            const parts = timeSlot.split(' - ');
            startTime = parts[0];
            endTime = parts[1];
        }

        for (const seg of segments) {
            if (seg.segmentType !== segmentType) continue;

            if (segmentType === 'SPOT_ADVERTS' && 'spotAdverts' in seg && seg.spotAdverts) {
                const match = seg.spotAdverts.find((spot: SpotAdvert) => {
                    const matchesTimeSlot = !timeSlot || 
                        (spot.timeInterval?.startTime === startTime && spot.timeInterval?.endTime === endTime);
                    const matchesType = !spotAdvertType || spot.spotAdvertType === spotAdvertType;
                    
                    // For PRODUCT_PLACEMENT, also check the duration
                    if (spotAdvertType === 'PRODUCT_PLACEMENT' && productPlacementDuration) {
                        const matchesDuration = spot.productPlacement?.duration === productPlacementDuration;
                        return matchesTimeSlot && matchesType && matchesDuration;
                    }
                    
                    return matchesTimeSlot && matchesType;
                });
                if (match) {
                    // For PRODUCT_PLACEMENT, use the rate from productPlacement object
                    if (spotAdvertType === 'PRODUCT_PLACEMENT' && match.productPlacement) {
                        foundRate = match.productPlacement.rate;
                    } else {
                        foundRate = match.rate;
                    }
                    break;
                }
            }
            else if (segmentType === 'DOCUMENTARY' && 'documentary' in seg && seg.documentary) {
                const match = seg.documentary.find((doc: Documentary) => {
                    const matchesTimeSlot = !timeSlot || 
                        (doc.timeInterval?.startTime === startTime && doc.timeInterval?.endTime === endTime);
                    const matchesType = !documentaryType || doc.documentaryType === documentaryType;
                    const matchesDuration = !interviewDuration || doc.durationMinutes === interviewDuration;
                    return matchesTimeSlot && matchesType && matchesDuration;
                });
                if (match) {
                    foundRate = match.rate;
                    break;
                }
            }
            else if (segmentType === 'ANNOUNCEMENTS' && 'announcements' in seg && seg.announcements) {
                const match = seg.announcements.find((ann: TVAnnouncement) => {
                    const matchesType = !announcementType || ann.announcementType === announcementType;
                    return matchesType;
                });
                if (match) {
                    foundRate = match.rate;
                    break;
                }
            }
            else if (segmentType === 'PREACHING' && 'preaching' in seg && seg.preaching) {
                const match = seg.preaching.find((preach: Preaching) => {
                    const matchesTimeSlot = !timeSlot || 
                        (preach.timeInterval?.startTime === startTime && preach.timeInterval?.endTime === endTime);
                    const matchesDuration = !preachingDuration || preach.durationMinutes === preachingDuration;
                    return matchesTimeSlot && matchesDuration;
                });
                if (match) {
                    foundRate = match.rate;
                    break;
                }
            }
            else if (segmentType === 'AIRTIME_SALE' && 'airtimeSale' in seg && seg.airtimeSale) {
                const match = seg.airtimeSale.find((airtime: AirtimeSale) => {
                    const matchesTimeSlot = !timeSlot || 
                        (airtime.timeInterval?.startTime === startTime && airtime.timeInterval?.endTime === endTime);
                    const matchesDuration = !airtimeSaleDuration || airtime.durationMinutes === airtimeSaleDuration;
                    return matchesTimeSlot && matchesDuration;
                });
                if (match) {
                    foundRate = match.rate;
                    break;
                }
            }
            else if (segmentType === 'MEDIA' && 'media' in seg && seg.media) {
                const match = seg.media.find((mediaItem: Media) => {
                    const matchesType = !mediaType || mediaItem.mediaType === mediaType;
                    const matchesDuration = !mediaDuration || mediaItem.durationSeconds === parseInt(mediaDuration);
                    return matchesType && matchesDuration;
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
    }, [channelName, segmentType, timeSlot, announcementType, spotAdvertType, documentaryType, interviewDuration, newsCoverageLocation, newsCoverageAdType, preachingDuration, airtimeSaleDuration, mediaType, mediaDuration, productPlacementDuration, channelIndex, segmentIndex, setValue]);

    return (
        <div className="border border-primary/20 rounded-lg p-4 space-y-4 bg-gray-50">
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-700">TV Segment {segmentIndex + 1}</p>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeSegment(segmentIndex)}
                    className="bg-red-50 hover:bg-red-200"
                >
                    <X className="w-4 h-4 text-red-600" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Program Name</label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.programName`}
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="e.g., Evening News" className="w-full input-field" />
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

                {/* Spot Advert Type - Only for SPOT_ADVERTS */}
                {segmentType === 'SPOT_ADVERTS' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Spot Advert Type</label>
                        <Controller
                            name={`channels.${channelIndex}.segments.${segmentIndex}.spotAdvertType`}
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    onValueChange={(value) => field.onChange(value)} 
                                    value={field.value}
                                    disabled={spotAdvertTypes.length === 0}
                                >
                                    <SelectTrigger className="w-full input-field">
                                        <SelectValue placeholder="Select spot advert type" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full bg-white border-primary/10">
                                        {spotAdvertTypes.map(type => (
                                            <SelectItem key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase().replace(/_/g, ' ')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                )}

                {/* Documentary Type - Only for DOCUMENTARY */}
                {segmentType === 'DOCUMENTARY' && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Documentary Type</label>
                            <Controller
                                name={`channels.${channelIndex}.segments.${segmentIndex}.documentaryType`}
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                                        <SelectTrigger className="w-full input-field">
                                            <SelectValue placeholder="Select documentary type" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full bg-white border-primary/10">
                                            <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                                            <SelectItem value="SOCIAL">Social</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Duration</label>
                            <Controller
                                name={`channels.${channelIndex}.segments.${segmentIndex}.interviewDuration`}
                                control={control}
                                render={({ field }) => (
                                    <Select 
                                        onValueChange={(value) => field.onChange(value)} 
                                        value={field.value}
                                        disabled={documentaryDurations.length === 0}
                                    >
                                        <SelectTrigger className="w-full input-field">
                                            <SelectValue placeholder={
                                                documentaryDurations.length === 0 
                                                    ? "No durations available for this channel" 
                                                    : "Select duration"
                                            } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {documentaryDurations.map(duration => (
                                                <SelectItem key={duration} value={duration}>
                                                    {duration.replace('_', ' ').toLowerCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </>
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
                                        <SelectValue placeholder={
                                            announcementTypes.length === 0 
                                                ? "No announcement types available for this channel" 
                                                : "Select announcement type"
                                        } />
                                    </SelectTrigger>
                                    <SelectContent className="w-full bg-white border-primary/10">
                                        {announcementTypes.map(type => (
                                            <SelectItem key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase().replace(/_/g, ' ')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                )}

                {/* Executive Interview Duration */}
                {segmentType === 'EXECUTIVE_INTERVIEW' && (
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

                {/* Preaching Duration - Only for PREACHING */}
                {segmentType === 'PREACHING' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Duration</label>
                        <Controller
                            name={`channels.${channelIndex}.segments.${segmentIndex}.preachingDuration`}
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    onValueChange={(value) => field.onChange(value)} 
                                    value={field.value}
                                    disabled={preachingDurations.length === 0}
                                >
                                    <SelectTrigger className="w-full input-field">
                                        <SelectValue placeholder={
                                            preachingDurations.length === 0 
                                                ? "No durations available" 
                                                : "Select duration"
                                        } />
                                    </SelectTrigger>
                                    <SelectContent className="w-full bg-white border-primary/10">
                                        {preachingDurations.map(duration => (
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

                {/* Airtime Sale Duration - Only for AIRTIME_SALE */}
                {segmentType === 'AIRTIME_SALE' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Duration</label>
                        <Controller
                            name={`channels.${channelIndex}.segments.${segmentIndex}.airtimeSaleDuration`}
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    onValueChange={(value) => field.onChange(value)} 
                                    value={field.value}
                                    disabled={airtimeSaleDurations.length === 0}
                                >
                                    <SelectTrigger className="w-full input-field">
                                        <SelectValue placeholder={
                                            airtimeSaleDurations.length === 0 
                                                ? "No durations available" 
                                                : "Select duration"
                                        } />
                                    </SelectTrigger>
                                    <SelectContent className="w-full bg-white border-primary/10">
                                        {airtimeSaleDurations.map(duration => (
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

                {/* Media Type - Only for MEDIA */}
                {segmentType === 'MEDIA' && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Media Type</label>
                            <Controller
                                name={`channels.${channelIndex}.segments.${segmentIndex}.mediaType`}
                                control={control}
                                render={({ field }) => (
                                    <Select 
                                        onValueChange={(value) => field.onChange(value)} 
                                        value={field.value}
                                        disabled={mediaTypes.length === 0}
                                    >
                                        <SelectTrigger className="w-full input-field">
                                            <SelectValue placeholder={
                                                mediaTypes.length === 0 
                                                    ? "No media types available" 
                                                    : "Select media type"
                                            } />
                                        </SelectTrigger>
                                        <SelectContent className="w-full bg-white border-primary/10">
                                            {mediaTypes.map(type => (
                                                <SelectItem key={type} value={type}>
                                                    {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase().replace(/_/g, ' ')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Duration (seconds)</label>
                            <Controller
                                name={`channels.${channelIndex}.segments.${segmentIndex}.mediaDuration`}
                                control={control}
                                render={({ field }) => (
                                    <Input 
                                        {...field} 
                                        type="number" 
                                        placeholder="Enter duration in seconds"
                                        className="w-full input-field"
                                    />
                                )}
                            />
                        </div>
                    </>
                )}

                {/* Product Placement Duration - For SPOT_ADVERTS with PRODUCT_PLACEMENT type */}
                {segmentType === 'SPOT_ADVERTS' && spotAdvertType === 'PRODUCT_PLACEMENT' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Product Placement Duration</label>
                        <Controller
                            name={`channels.${channelIndex}.segments.${segmentIndex}.productPlacementDuration`}
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    onValueChange={(value) => field.onChange(value)} 
                                    value={field.value}
                                    disabled={productPlacementDurations.length === 0}
                                >
                                    <SelectTrigger className="w-full input-field">
                                        <SelectValue placeholder={
                                            productPlacementDurations.length === 0 
                                                ? "No durations available" 
                                                : "Select duration"
                                        } />
                                    </SelectTrigger>
                                    <SelectContent className="w-full bg-white border-primary/10">
                                        {productPlacementDurations.map(duration => (
                                            <SelectItem key={duration} value={duration}>
                                                {duration.replace(/_/g, ' ').toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                )}

                {/* Time Slot - For segment types that have time intervals */}
                {(segmentType === 'SPOT_ADVERTS' || segmentType === 'DOCUMENTARY' || segmentType === 'PREACHING' || segmentType === 'AIRTIME_SALE') && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Time Slot</label>
                        <Controller
                            name={`channels.${channelIndex}.segments.${segmentIndex}.timeSlot`}
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    onValueChange={(value) => field.onChange(value)} 
                                    value={field.value}
                                    disabled={timeSlots.length === 0}
                                >
                                    <SelectTrigger className="w-full input-field">
                                        <SelectValue placeholder={
                                            timeSlots.length === 0 
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
                                                ? "No locations available" 
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

                {/* Ad Type - Only for NEWS_COVERAGE */}
                {segmentType === 'NEWS_COVERAGE' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Ad Type</label>
                        <Controller
                            name={`channels.${channelIndex}.segments.${segmentIndex}.newsCoverageAdType`}
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    onValueChange={(value) => field.onChange(value)} 
                                    value={field.value}
                                    disabled={newsCoverageAdTypes.length === 0}
                                >
                                    <SelectTrigger className="w-full input-field">
                                        <SelectValue placeholder={
                                            newsCoverageAdTypes.length === 0 
                                                ? "No ad types available" 
                                                : "Select ad type"
                                        } />
                                    </SelectTrigger>
                                    <SelectContent className="w-full bg-white border-primary/10">
                                        {newsCoverageAdTypes.map(adType => (
                                            <SelectItem key={adType} value={adType}>
                                                {adType}
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
                        <span className="text-xs text-gray-500 ml-2">(Auto-calculated)</span>
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
