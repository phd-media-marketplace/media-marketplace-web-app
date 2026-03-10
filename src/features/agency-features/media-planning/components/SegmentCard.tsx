import type { Control, UseFieldArrayRemove, FieldValues, UseFormWatch, UseFormSetValue } from "react-hook-form";
import FMSegmentCard from "./FMSegmentCard";
import TVSegmentCard from "./TVSegmentCard";
import OOHSegmentCard from "./OOHSegmentCard";
import DIGITALSegmentCard from "./DIGITALSegmentCard";

interface SegmentCardProps {
    channelIndex: number;
    segmentIndex: number;
    control: Control<FieldValues>;
    removeSegment: UseFieldArrayRemove;
    mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
    watch: UseFormWatch<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
}

/**
 * SegmentCard - Router component that delegates to media-type-specific components
 * This provides better code structure by separating concerns based on media type
 */
export default function SegmentCard({ 
    channelIndex, 
    segmentIndex, 
    control, 
    removeSegment,
    mediaType,
    watch,
    setValue
}: SegmentCardProps) {
    // Route to the appropriate media-type-specific component
    switch (mediaType) {
        case 'FM':
            return (
                <FMSegmentCard
                    channelIndex={channelIndex}
                    segmentIndex={segmentIndex}
                    control={control}
                    removeSegment={removeSegment}
                    watch={watch}
                    setValue={setValue}
                />
            );
        case 'TV':
            return (
                <TVSegmentCard
                    channelIndex={channelIndex}
                    segmentIndex={segmentIndex}
                    control={control}
                    removeSegment={removeSegment}
                    watch={watch}
                    setValue={setValue}
                />
            );
        case 'OOH':
            return (
                <OOHSegmentCard
                    channelIndex={channelIndex}
                    segmentIndex={segmentIndex}
                    control={control}
                    removeSegment={removeSegment}
                    watch={watch}
                    setValue={setValue}
                />
            );
        case 'DIGITAL':
            return (
                <DIGITALSegmentCard
                    channelIndex={channelIndex}
                    segmentIndex={segmentIndex}
                    control={control}
                    removeSegment={removeSegment}
                    watch={watch}
                    setValue={setValue}
                />
            );
        default:
            return <div>Unsupported media type: {mediaType}</div>;
    }
}
