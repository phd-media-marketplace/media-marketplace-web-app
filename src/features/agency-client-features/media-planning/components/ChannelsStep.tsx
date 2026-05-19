import type { Control, UseFormWatch, UseFormSetValue, UseFieldArrayAppend, UseFieldArrayRemove, FieldValues } from "react-hook-form";
import { useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";
import BudgetSummary from "./BudgetSummary";
import ChannelCard from "./ChannelCard";
import type { ChannelFormData, SegmentFormData } from "../types";

interface ChannelsStepProps {
    control: Control<FieldValues>;
    watch: UseFormWatch<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
    channelFields: ChannelFormData[];
    appendChannel: UseFieldArrayAppend<FieldValues>;
    removeChannel: UseFieldArrayRemove;
    totalBudget: number;
    totalAllocated: number;
    remainingBudget: number;
    discount?: number;
    discountAmount?: number;
    startDate: string;
    endDate: string;
    onPrevious: () => void;
    onNext: () => void;
}

export default function ChannelsStep({
    control,
    watch,
    setValue,
    channelFields,
    appendChannel,
    removeChannel,
    totalBudget,
    totalAllocated,
    remainingBudget,
    startDate,
    endDate,
    discount,
    discountAmount,
    onPrevious,
    onNext
}: ChannelsStepProps) {
    const addChannel = () => {
        appendChannel({
            mediaType: 'FM',
            channelName: '',
            segments: []
        });
    };

    // Use ref to track if we've already initialized to prevent double initialization in StrictMode
    const initializedRef = useRef(false);

    // Auto-populate with two empty channels on first mount if none exist
    // This keeps the Add Channel button functional for more channels
    useEffect(() => {
        // Only run once to prevent double initialization in React StrictMode
        if (initializedRef.current) {
            return;
        }

        try {
            if (!channelFields || channelFields.length === 0) {
                appendChannel({ mediaType: 'FM', channelName: '', segments: [] });
                appendChannel({ mediaType: 'TV', channelName: '', segments: [] });
                initializedRef.current = true;
            }
        } catch (e) {
            // swallow errors - appendChannel might not be ready in some edge cases
            const errorMessage = e instanceof Error ? e.message : String(e);
            console.error("Error auto-populating channels:", errorMessage);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Aggregate segment-level discounts to pass to BudgetSummary (only if a discountAmount isn't provided)
    let totalGrossFromSegments = 0;
    let computedTotalDiscountAmount = 0;

    // channelFields are form entries; iterate safely
    (channelFields || []).forEach((ch) => {
        const segments = ch?.segments || [];
        (segments || []).forEach((segment: SegmentFormData) => {
            const unitRate = Number(segment?.unitRate) || 0;
            const totalSpots = Number(segment?.totalSpots) || 0;
            const segDiscount = typeof segment?.discount === 'number' ? segment.discount : (segment?.discount ? Number(segment.discount) : 0);
            const gross = unitRate * totalSpots;
            const discountAmt = (segDiscount / 100) * gross;
            totalGrossFromSegments += gross;
            computedTotalDiscountAmount += discountAmt;
        });
    });

    const effectiveDiscountPercent = totalGrossFromSegments > 0
        ? Math.round((computedTotalDiscountAmount / totalGrossFromSegments) * 100)
        : 0;

    // If parent provided a discount amount, prefer that for accurate budget calculation
    const totalDiscountAmountToUse = typeof discountAmount === 'number' ? discountAmount : computedTotalDiscountAmount;
    const discountPercentToUse = typeof discount === 'number' ? discount : effectiveDiscountPercent;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Channels */}
                <div className="lg:col-span-2 xl:col-span-3">
                    <div className="space-y-4">
                        {channelFields.map((channel: ChannelFormData, channelIndex: number) => (
                            <ChannelCard
                                key={channel.id as string}
                                channelIndex={channelIndex}
                                control={control}
                                watch={watch}
                                setValue={setValue}
                                removeChannel={removeChannel}
                            />
                        ))}
                    </div>

                    <Button type="button" onClick={addChannel} variant="outline" className="w-full bg-primary/10 text-primary hover:bg-primary/20">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Channel
                    </Button>
                </div>

                {/* Budget Summary */}
                <div>
                    <BudgetSummary
                        totalBudget={totalBudget}
                        totalAllocated={totalAllocated}
                        remainingBudget={remainingBudget}
                        startDate={startDate}
                        endDate={endDate}
                        discount={discountPercentToUse}
                        discountAmount={totalDiscountAmountToUse}
                    />
                </div>
            </div>

            <div className="flex justify-between">
                <Button type="button" onClick={onPrevious} variant="outline" className="border-secondary text-primary hover:bg-secondary/90">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>
                <Button
                    type="button"
                    onClick={() => {
                        if (remainingBudget < 0) {
                            toast.error('Budget exceeded: adjust allocations or increase campaign budget before reviewing.');
                            return;
                        }
                        onNext();
                    }}
                    className="bg-primary text-white hover:bg-primary/90"
                >
                    Review Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </motion.div>
    );
}
