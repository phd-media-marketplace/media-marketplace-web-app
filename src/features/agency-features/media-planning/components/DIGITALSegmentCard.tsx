import { Controller } from "react-hook-form";
import type { Control, UseFieldArrayRemove, FieldValues, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import type { DayOfWeek } from "../types";
import { dummyRateCards } from "@/features/media-partner-features/rate-cards";

interface DIGITALSegmentCardProps {
    channelIndex: number;
    segmentIndex: number;
    control: Control<FieldValues>;
    removeSegment: UseFieldArrayRemove;
    watch: UseFormWatch<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
}

export default function DIGITALSegmentCard({ 
    channelIndex, 
    segmentIndex, 
    control, 
    removeSegment,
    watch
}: DIGITALSegmentCardProps) {
    const channelName = watch(`channels.${channelIndex}.channelName`);
    
    // Check if the selected channel has a DIGITAL rate card
    const hasRateCard = channelName ? 
        dummyRateCards.some(card => card.mediaPartnerName === channelName && card.mediaType === 'DIGITAL') 
        : false;

    // Get available days - DIGITAL campaigns are typically available all days
    const availableDays: DayOfWeek[] = channelName ? 
        ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] 
        : [];

    return (
        <div className="border border-primary/20 rounded-lg shadow-md p-4 space-y-4 bg-gray-50">
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-700">Digital Campaign {segmentIndex + 1}</p>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeSegment(segmentIndex)}
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            {!hasRateCard && channelName && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                    <p className="text-sm text-yellow-800">
                        ⚠️ No digital rate card available for {channelName}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Campaign Name</label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.programName`}
                        control={control}
                        render={({ field }) => (
                            <Input 
                                {...field} 
                                placeholder="e.g., Social Media Campaign" 
                                className="w-full input-field"
                                disabled={!hasRateCard}
                            />
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Platform</label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.platform`}
                        control={control}
                        render={({ field }) => (
                            <Select 
                                onValueChange={(value) => field.onChange(value)} 
                                value={field.value}
                                disabled={!hasRateCard}
                            >
                                <SelectTrigger className="w-full input-field">
                                    <SelectValue placeholder={!hasRateCard ? "No rate card available" : "Select platform"} />
                                </SelectTrigger>
                                <SelectContent className="w-full bg-white border-primary/10">
                                    <SelectItem value="FACEBOOK">Facebook</SelectItem>
                                    <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                                    <SelectItem value="TWITTER">Twitter/X</SelectItem>
                                    <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                                    <SelectItem value="TIKTOK">TikTok</SelectItem>
                                    <SelectItem value="YOUTUBE">YouTube</SelectItem>
                                    <SelectItem value="WEBSITE">Website</SelectItem>
                                    <SelectItem value="EMAIL">Email</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Ad Format</label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.adFormat`}
                        control={control}
                        render={({ field }) => (
                            <Select 
                                onValueChange={(value) => field.onChange(value)} 
                                value={field.value}
                                disabled={!hasRateCard}
                            >
                                <SelectTrigger className="w-full input-field">
                                    <SelectValue placeholder={!hasRateCard ? "No rate card available" : "Select format"} />
                                </SelectTrigger>
                                <SelectContent className="w-full bg-white border-primary/10">
                                    <SelectItem value="BANNER">Banner Ad</SelectItem>
                                    <SelectItem value="VIDEO">Video Ad</SelectItem>
                                    <SelectItem value="SPONSORED_POST">Sponsored Post</SelectItem>
                                    <SelectItem value="STORY">Story Ad</SelectItem>
                                    <SelectItem value="CAROUSEL">Carousel Ad</SelectItem>
                                    <SelectItem value="NATIVE">Native Ad</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Impressions</label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.impressions`}
                        control={control}
                        render={({ field }) => (
                            <Input 
                                {...field} 
                                type="number" 
                                placeholder="0"
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                className="w-full input-field"
                                disabled={!hasRateCard}
                            />
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Rate (GHS)</label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.unitRate`}
                        control={control}
                        render={({ field }) => (
                            <Input 
                                {...field} 
                                type="number" 
                                placeholder="0"
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                className="w-full input-field"
                                disabled={!hasRateCard}
                            />
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Duration (Days)</label>
                    <Controller
                        name={`channels.${channelIndex}.segments.${segmentIndex}.duration`}
                        control={control}
                        render={({ field }) => (
                            <Input 
                                {...field} 
                                type="number" 
                                placeholder="0"
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                className="w-full input-field"
                                disabled={!hasRateCard}
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
                                                className={hasRateCard ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
                                                onClick={() => {
                                                    if (!hasRateCard) return;
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
