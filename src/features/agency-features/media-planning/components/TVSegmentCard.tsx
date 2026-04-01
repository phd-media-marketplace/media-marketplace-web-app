import { Controller } from "react-hook-form";
import type { Control, UseFieldArrayRemove, FieldValues, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import type { DayOfWeek } from "../types";
import { dummyRateCards } from "@/features/media-partner-features/rate-cards/dummy-data";
import type { TVMetadata } from "@/features/media-partner-features/rate-cards/types";
import { useMemo, useEffect } from "react";

interface TVSegmentCardProps {
    channelIndex: number;
    segmentIndex: number;
    control: Control<FieldValues>;
    removeSegment: UseFieldArrayRemove;
    watch: UseFormWatch<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
}

const allDays: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

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
    const adType = watch(`channels.${channelIndex}.segments.${segmentIndex}.adType`);
    const segmentClass = watch(`channels.${channelIndex}.segments.${segmentIndex}.segmentClass`);
    const selectedDays = watch(`channels.${channelIndex}.segments.${segmentIndex}.days`) || [];

    // Get available ad types for the selected channel
    const availableAdTypes = useMemo(() => {
        if (!channelName) return [];

        const rateCard = dummyRateCards.find(card => 
            card.mediaPartnerName === channelName && card.mediaType === 'TV'
        );
        if (!rateCard || !rateCard.metadata) return [];

        const metadata = rateCard.metadata as TVMetadata;
        return metadata.adTypeRates.map(atr => atr.adType);
    }, [channelName]);

    // Get available segment classes for the selected ad type
    const availableSegments = useMemo(() => {
        if (!channelName || !adType) return [];

        const rateCard = dummyRateCards.find(card => 
            card.mediaPartnerName === channelName && card.mediaType === 'TV'
        );
        if (!rateCard || !rateCard.metadata) return [];

        const metadata = rateCard.metadata as TVMetadata;
        const adTypeRate = metadata.adTypeRates.find(atr => atr.adType === adType);
        if (!adTypeRate) return [];

        return adTypeRate.TVSegment.filter(seg => seg.isActive).map(seg => ({
            class: seg.Class,
            className: seg.ClassName || seg.Class,
            unitRate: seg.UnitRate,
            timeDetails: seg.timeDetails,
            adForm: seg.adForm
        }));
    }, [channelName, adType]);

    // Auto-populate segment details when segment class is selected
    useEffect(() => {
        if (!channelName || !adType || !segmentClass) return;

        const rateCard = dummyRateCards.find(card => 
            card.mediaPartnerName === channelName && card.mediaType === 'TV'
        );
        if (!rateCard || !rateCard.metadata) return;

        const metadata = rateCard.metadata as TVMetadata;
        const adTypeRate = metadata.adTypeRates.find(atr => atr.adType === adType);
        if (!adTypeRate) return;

        const segment = adTypeRate.TVSegment.find(seg => seg.Class === segmentClass);
        if (!segment) return;

        // Auto-populate unit rate
        setValue(`channels.${channelIndex}.segments.${segmentIndex}.unitRate`, segment.UnitRate);
        
        // Auto-populate segment name
        setValue(`channels.${channelIndex}.segments.${segmentIndex}.segmentName`, segment.ClassName || segment.Class);
        
        // Auto-populate rate card ID
        setValue(`channels.${channelIndex}.segments.${segmentIndex}.rateCardId`, rateCard.id);

        // Auto-populate ad form (30_SECS, 60_SECS, LIVE, SOCIAL, etc.)
        if (segment.adForm) {
            setValue(`channels.${channelIndex}.segments.${segmentIndex}.adForm`, segment.adForm);
        }

        // Format time details for display
        if (segment.timeDetails && segment.timeDetails.length > 0) {
            const timeIntervals = segment.timeDetails.flatMap(td => td.timeInterval || []).join(', ');
            setValue(`channels.${channelIndex}.segments.${segmentIndex}.timeSlot`, timeIntervals);
        }
    }, [channelName, adType, segmentClass, channelIndex, segmentIndex, setValue]);

    const toggleDay = (day: DayOfWeek) => {
        const currentDays = selectedDays || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter((d: DayOfWeek) => d !== day)
            : [...currentDays, day];
        setValue(`channels.${channelIndex}.segments.${segmentIndex}.days`, newDays);
    };

    return (
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-gray-900">Segment {segmentIndex + 1}</h5>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeSegment(segmentIndex)}
                >
                    <X className="w-4 h-4 text-red-600" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ad Type Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Ad Type <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.adType`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select 
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    // Reset segment class when ad type changes
                                    setValue(`channels.${channelIndex}.segments.${segmentIndex}.segmentClass`, '');
                                }}
                                value={field.value}
                                disabled={!channelName}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select ad type" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {availableAdTypes.length === 0 ? (
                                        <SelectItem value="none" disabled>
                                            {channelName ? 'No ad types available' : 'Select channel first'}
                                        </SelectItem>
                                    ) : (
                                        availableAdTypes.map(type => (
                                            <SelectItem key={type} value={type}>
                                                {type.replace(/_/g, ' ')}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Segment Class Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Segment Class <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.segmentClass`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select 
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!adType}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select segment class" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {availableSegments.length === 0 ? (
                                        <SelectItem value="none" disabled>
                                            {adType ? 'No segments available' : 'Select ad type first'}
                                        </SelectItem>
                                    ) : (
                                        availableSegments.map(seg => (
                                            <SelectItem key={seg.class} value={seg.class}>
                                                {seg.class} - {seg.className}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Unit Rate (Auto-populated, Read-only) */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Unit Rate (GH₵)</label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.unitRate`}
                        control={control}
                        render={({ field }) => (
                            <Input 
                                {...field}
                                type="number"
                                readOnly
                                disabled
                                className="bg-gray-50 cursor-not-allowed"
                                placeholder="Auto-populated"
                            />
                        )}
                    />
                    <p className="text-xs text-gray-500">Auto-populated from rate card</p>
                </div>

                {/* Total Spots */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Total Spots <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.totalSpots`}
                        control={control}
                        rules={{ required: true, min: 1 }}
                        render={({ field }) => (
                            <Input 
                                {...field}
                                type="number"
                                min="1"
                                placeholder="Enter number of spots"
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                        )}
                    />
                </div>

                {/* Ad Form (Auto-populated, Read-only) */}
                {segmentClass && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Ad Form</label>
                        <Controller
                            name={`channels.${channelIndex}.segments.${segmentIndex}.adForm`}
                            control={control}
                            render={({ field }) => (
                                <Input 
                                    {...field}
                                    readOnly
                                    disabled
                                    className="bg-gray-50 cursor-not-allowed"
                                    placeholder="Auto-populated"
                                />
                            )}
                        />
                        <p className="text-xs text-gray-500">Auto-populated from rate card</p>
                    </div>
                )}
            </div>

            {/* Days Selection */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    Days of Week <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                    {allDays.map(day => (
                        <Badge
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`cursor-pointer px-3 py-1.5 transition-all ${
                                selectedDays.includes(day)
                                    ? 'bg-primary text-white hover:bg-primary/90'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {day.substring(0, 3)}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Time Slot Display (Read-only) */}
            {segmentClass && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Time Slot</label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.timeSlot`}
                        control={control}
                        render={({ field }) => (
                            <Input 
                                {...field}
                                readOnly
                                disabled
                                className="bg-gray-50 cursor-not-allowed"
                                placeholder="Auto-populated"
                            />
                        )}
                    />
                    <p className="text-xs text-gray-500">Auto-populated from rate card</p>
                </div>
            )}

            {/* Optional Program Name */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Program Name (Optional)</label>
                <Controller
                    name={`channels.${channelIndex}.segments.${segmentIndex}.programName`}
                    control={control}
                    render={({ field }) => (
                        <Input 
                            {...field}
                            placeholder="e.g., Prime Time News"
                        />
                    )}
                />
            </div>
        </div>
    );
}
