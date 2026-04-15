import { useState, useEffect, useRef, useMemo } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import type { Control, UseFormWatch, FieldValues, UseFormSetValue } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Radio, Tv, Monitor, Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SegmentCard from "./SegmentCard";
import { listRateCards } from "@/features/media-partner-features/rate-cards/api";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"

const mediaTypes: Array<'FM' | 'TV' | 'OOH' | 'DIGITAL'> = ['FM', 'TV', 'OOH', 'DIGITAL'];

const mediaIcons = {
    FM: Radio,
    TV: Tv,
    OOH: Building2,
    DIGITAL: Monitor
};

interface ChannelCardProps {
    channelIndex: number;
    control: Control<FieldValues>;
    watch: UseFormWatch<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
    removeChannel: (index: number) => void;
}

export default function ChannelCard({ 
    channelIndex, 
    control, 
    watch, 
    setValue,
    removeChannel 
}: ChannelCardProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const previousMediaTypeRef = useRef<'FM' | 'TV' | 'OOH' | 'DIGITAL' | null>(null);
    
    const { fields: segmentFields, append: appendSegment, remove: removeSegment } = useFieldArray({
        control,
        name: `channels.${channelIndex}.segments` as const
    });

    const channelMediaType = watch(`channels.${channelIndex}.mediaType`) as 'FM' | 'TV' | 'OOH' | 'DIGITAL';
    
    // Fetch rate cards from API
    const { data: rateCardsData } = useQuery({
        queryKey: ['rateCards', channelMediaType],
        queryFn: () => listRateCards(channelMediaType && ['FM', 'TV'].includes(channelMediaType) ? { mediaType: channelMediaType as 'FM' | 'TV' } : undefined),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const Icon = mediaIcons[channelMediaType];

    const addSegment = () => {
        appendSegment({
            segmentType: '',
            programName: '',
            startTime: '06:00',
            endTime: '07:00',
            days: [],
            uniteRate: 0,
            spotsPerDay: 0,
            durationSeconds: 30
        });
    };

    // Clear channel name when media type changes
    useEffect(() => {
        if (previousMediaTypeRef.current !== null && previousMediaTypeRef.current !== channelMediaType) {
            setValue(`channels.${channelIndex}.channelName`, '');
        }
        previousMediaTypeRef.current = channelMediaType;
    }, [channelMediaType, channelIndex, setValue]);

    // Filter channels by media type and search query
    const filteredChannels = useMemo(() => {
        const rateCards = rateCardsData?.rateCards || [];
        const channels = rateCards
            .filter(card => {
                // For FM and TV, use the actual mediaType from API
                if (['FM', 'TV'].includes(channelMediaType)) {
                    return card.mediaType.trim() === channelMediaType.trim();
                }
                // For OOH and DIGITAL, include all for now (API doesn't support these yet)
                return true;
            })
            .map(card => card.mediaPartnerName);
        
        const uniqueChannels = Array.from(new Set(channels));
        
        // Filter by search query
        return searchQuery
            ? uniqueChannels.filter(name => 
                name.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : uniqueChannels;
    }, [rateCardsData, channelMediaType, searchQuery]);

    return (
        <Card className="p-6 space-y-2 border border-primary/20 rounded-lg shadow-md bg-gray-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-primary" />
                    <h3 className="text-lg font-semibold">Channel {channelIndex + 1}</h3>
                </div>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeChannel(channelIndex)}
                >
                    <X className="w-4 h-4 text-red-600" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Media Type</label>
                    <Controller
                        name={`channels.${channelIndex}.mediaType`}
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="w-full input-field">
                                    <SelectValue placeholder="Select media type" />
                                </SelectTrigger>
                                <SelectContent className="w-full bg-white border-primary/10">
                                    {mediaTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Channel Name</label>
                    <Controller
                        name={`channels.${channelIndex}.channelName`}
                        control={control}
                        render={({ field }) => (
                            <Combobox 
                                value={field.value || ''} 
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    setSearchQuery('');
                                }}
                            >
                                <ComboboxInput 
                                    className="w-full input-field" 
                                    placeholder="e.g., Peace FM, GTV"
                                    showTrigger={true}
                                    showClear={!!field.value}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <ComboboxContent className="bg-white">
                                    <ComboboxList>
                                        <ComboboxEmpty>No channel found.</ComboboxEmpty>
                                        {filteredChannels.map((name) => (
                                            <ComboboxItem key={name} value={name} className="text-black">
                                                {name}
                                            </ComboboxItem>
                                        ))}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        )}
                    />
                </div>
            </div>

            {/* Segments */}
            <div className="space-y-3 ">
                <h4 className="font-medium text-gray-900">Segments</h4>
                
                {segmentFields.map((segment, segmentIndex) => (
                    <SegmentCard
                        key={segment.id}
                        channelIndex={channelIndex}
                        segmentIndex={segmentIndex}
                        control={control}
                        removeSegment={removeSegment}
                        mediaType={channelMediaType}
                        watch={watch}
                        setValue={setValue}
                    />
                ))}

                <Button 
                    type="button" 
                    onClick={addSegment} 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-secondary text-primary hover:bg-secondary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Segment
                </Button>
            </div>
        </Card>
    );
}
