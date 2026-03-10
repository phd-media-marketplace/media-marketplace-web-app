import type { Control, UseFormWatch, UseFormSetValue, UseFieldArrayAppend, UseFieldArrayRemove, FieldValues } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";
import BudgetSummary from "./BudgetSummary";
import ChannelCard from "./ChannelCard";

interface ChannelsStepProps {
    control: Control<FieldValues>;
    watch: UseFormWatch<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channelFields: Array<Record<string, any>>;
    appendChannel: UseFieldArrayAppend<FieldValues>;
    removeChannel: UseFieldArrayRemove;
    totalBudget: number;
    totalAllocated: number;
    remainingBudget: number;
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

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
        >
            {/* Budget Summary */}
            <BudgetSummary
                totalBudget={totalBudget}
                totalAllocated={totalAllocated}
                remainingBudget={remainingBudget}
                startDate={startDate}
                endDate={endDate}
            />

            {/* Channels */}
            <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {channelFields.map((channel: Record<string, any>, channelIndex: number) => (
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

            <div className="flex justify-between">
                <Button type="button" onClick={onPrevious} variant="outline" className="border-secondary text-primary hover:bg-secondary/90">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>
                <Button type="button" onClick={onNext} className="bg-primary text-white hover:bg-primary/90">
                    Review Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </motion.div>
    );
}
