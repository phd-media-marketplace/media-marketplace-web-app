import { Controller } from "react-hook-form";
import type { Control, UseFieldArrayRemove, FieldValues, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import type { DayOfWeek } from "../types";
import { dummyRateCards } from "@/features/media-partner-features/rate-cards";
import type { OOHMetadata } from "@/features/media-partner-features/rate-cards/types";
import { useMemo, useEffect } from "react";

interface OOHSegmentCardProps {
    channelIndex: number;
    segmentIndex: number;
    control: Control<FieldValues>;
    removeSegment: UseFieldArrayRemove;
    watch: UseFormWatch<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
}

export default function OOHSegmentCard({ 
    channelIndex, 
    segmentIndex, 
    control, 
    removeSegment,
    watch,
    setValue
}: OOHSegmentCardProps) {
    // Watch relevant fields
    const channelName = watch(`channels.${channelIndex}.channelName`);
    const selectedPlacement = watch(`channels.${channelIndex}.segments.${segmentIndex}.programName`);

    // Get the selected rate card and extract placement options
    const placements = useMemo(() => {
        if (!channelName) return [];

        const rateCards = dummyRateCards.filter(
            card => card.mediaPartnerName === channelName && card.mediaType === 'OOH'
        );
        
        return rateCards.map(card => {
            const metadata = card.metadata as OOHMetadata;
            return {
                name: metadata.name || 'Unnamed Placement',
                placement: metadata.placement,
                format: metadata.format,
                dimensions: metadata.dimensions,
                duration: metadata.duration,
                baseRate: metadata.baseRate,
                notes: metadata.notes,
            };
        });
    }, [channelName]);

    // Get available days - OOH placements are typically available all days
    const availableDays: DayOfWeek[] = useMemo(() => {
        // OOH placements don't have day restrictions in rate cards
        // Return all days if channel is selected
        if (!channelName) return [];
        return ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    }, [channelName]);

    // Auto-populate fields when a placement is selected
    useEffect(() => {
        if (!selectedPlacement || placements.length === 0) return;

        const placement = placements.find(p => p.name === selectedPlacement);
        if (!placement) return;

        // Auto-populate format, dimensions, rate, and duration from the rate card
        if (placement.format) {
            setValue(`channels.${channelIndex}.segments.${segmentIndex}.format`, placement.format);
        }
        if (placement.dimensions) {
            setValue(`channels.${channelIndex}.segments.${segmentIndex}.dimensions`, placement.dimensions);
        }
        if (placement.baseRate) {
            setValue(`channels.${channelIndex}.segments.${segmentIndex}.unitRate`, placement.baseRate);
        }
        if (placement.duration) {
            setValue(`channels.${channelIndex}.segments.${segmentIndex}.duration`, placement.duration);
        }
    }, [selectedPlacement, placements, channelIndex, segmentIndex, setValue]);

    return (
        <div className="border border-primary/20 rounded-lg shadow-md p-4 space-y-4 bg-gray-50">
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-700">OOH Placement {segmentIndex + 1}</p>
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
                    <label className="text-sm font-medium text-gray-700">Placement Name</label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.programName`}
                        control={control}
                        render={({ field }) => (
                            <Select 
                                onValueChange={(value) => field.onChange(value)} 
                                value={field.value}
                                disabled={!channelName || placements.length === 0}
                            >
                                <SelectTrigger className="w-full input-field">
                                    <SelectValue placeholder={
                                        !channelName 
                                            ? "Select channel first" 
                                            : placements.length === 0 
                                                ? "No placements available" 
                                                : "Select placement"
                                    } />
                                </SelectTrigger>
                                <SelectContent className="w-full bg-white border-primary/10">
                                    {placements.map((placement) => (
                                        <SelectItem key={placement.name} value={placement.name}>
                                            {placement.name} - {placement.placement}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Format
                        <span className="text-xs text-gray-500 ml-2">(From rate card)</span>
                    </label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.format`}
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="e.g., Billboard, Transit Ad" className="w-full input-field bg-gray-50" readOnly />
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Dimensions
                        <span className="text-xs text-gray-500 ml-2">(From rate card)</span>
                    </label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.dimensions`}
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="e.g., 48x14 feet" className="w-full input-field bg-gray-50" readOnly />
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Rate (GHS)
                        <span className="text-xs text-gray-500 ml-2">(From rate card)</span>
                    </label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.unitRate`}
                        control={control}
                        render={({ field }) => (
                            <Input 
                                {...field} 
                                type="number" 
                                placeholder="Select placement to see rate"
                                readOnly
                                className="w-full input-field bg-gray-50 cursor-not-allowed"
                            />
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Duration (Days)
                        <span className="text-xs text-gray-500 ml-2">(From rate card)</span>
                    </label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.duration`}
                        control={control}
                        render={({ field }) => (
                            <Input 
                                {...field} 
                                type="number" 
                                placeholder="Select placement to see duration"
                                readOnly
                                className="w-full input-field bg-gray-50 cursor-not-allowed"
                            />
                        )}
                    />
                </div>

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
                                    <p className="text-sm text-gray-500">Select channel first</p>
                                ) : (
                                    availableDays.map(day => {
                                        const isSelected = field.value?.includes(day);
                                        return (
                                            <Badge
                                                key={day}
                                                variant={isSelected ? "default" : "outline"}
                                                className="cursor-pointer"
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
