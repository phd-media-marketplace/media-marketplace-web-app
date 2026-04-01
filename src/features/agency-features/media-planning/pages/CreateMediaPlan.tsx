import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { mediaPlan, DayOfWeek } from "../types";
import ProgressSteps from "../components/ProgressSteps";
import BasicInfoStep from "../components/BasicInfoStep";
import ChannelsStep from "../components/ChannelsStep";
import ReviewStep from "../components/ReviewStep";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth-store";

interface MediaPlanFormData extends Omit<mediaPlan, 'Channels'> {
    channels: ChannelFormData[];
}

interface ChannelFormData {
    mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
    channelName: string;
    segments: SegmentFormData[];
}

interface SegmentFormData {
    segmentType: string;
    programName: string;
    startTime: string;
    endTime: string;
    days: DayOfWeek[];
    unitRate: number;
    totalSpots: number;
    durationSeconds: number;
}

export default function CreateMediaPlan() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const { user } = useAuthStore();
    const clientName = user?.tenantName || "";
    
    const { control, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<MediaPlanFormData>({
        defaultValues: {
            CampaignTitle: '',
            client: '',
            objective: '',
            targetAudience: '',
            startDate: '',
            endDate: '',
            budget: 0,
            channels: []
        }
    });

    // Set client name when user data is available
    useEffect(() => {
        if (clientName) {
            setValue('client', clientName);
        }
    }, [clientName, setValue]);

    const { fields: channelFields, append: appendChannel, remove: removeChannel } = useFieldArray({
        control,
        name: "channels"
    });

    const watchedChannels = watch('channels');
    const watchedBudget = watch('budget');
    const watchedStartDate = watch('startDate');
    const watchedEndDate = watch('endDate');

    const steps = [
        { num: 1, title: "Basic Info" },
        { num: 2, title: "Channels & Segments" },
        { num: 3, title: "Review & Submit" }
    ];

    // Calculate total allocated budget from all channels
    const calculateTotalAllocated = () => {
        if (!watchedChannels) return 0;
        return watchedChannels.reduce((total, channel) => {
            const channelTotal = channel.segments?.reduce((segTotal, segment) => {
                // Check if segment has required fields
                if (watchedStartDate && watchedEndDate && segment.days && segment.days.length > 0) {
                    const unitRate = segment.unitRate || 0;
                    const totalSpots = segment.totalSpots || 0;
                    
                    if (unitRate > 0 && totalSpots > 0) {
                        const start = new Date(watchedStartDate);
                        const end = new Date(watchedEndDate);
                        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                        const weeks = Math.ceil(days / 7);
                        const sportsPerDay = Math.ceil(totalSpots / (segment.days.length * weeks));
                        const overalltotalSpots = sportsPerDay * segment.days.length * weeks;
                        return segTotal + (unitRate * overalltotalSpots);
                    }
                }
                return segTotal;
            }, 0) || 0;
            return total + channelTotal;
        }, 0);
    };

    const totalAllocated = calculateTotalAllocated();
    const remainingBudget = watchedBudget - totalAllocated;

    const onSubmit = (data: MediaPlanFormData) => {
        if (totalAllocated > watchedBudget) {
            toast.error("Total allocated budget exceeds campaign budget!");
            return;
        }

        // // Calculate total spots for a segment
        // const calculateTotalSpots = (segment: SegmentFormData, startDate: string, endDate: string) => {
        //     const start = new Date(startDate);
        //     const end = new Date(endDate);
        //     const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        //     const weeks = Math.ceil(days / 7);
        //     return segment.spotsPerDay * segment.days.length * weeks;
        // };

        // Transform data to match mediaPlan interface
        const mediaPlanData: mediaPlan = {
            CampaignTitle: data.CampaignTitle,
            client: data.client,
            objective: data.objective,
            targetAudience: data.targetAudience,
            startDate: data.startDate,
            endDate: data.endDate,
            budget: data.budget,
            Channels: data.channels.map(channel => ({
                mediaType: channel.mediaType,
                channelName: channel.channelName,
                segments: channel.segments.map(segment => ({
                    adType: segment.segmentType,
                    segmentClass: segment.programName, // Using programName as segmentClass
                    segmentName: segment.programName,
                    timeSlot: `${segment.startTime} - ${segment.endTime}`,
                    days: segment.days,
                    unitRate: segment.unitRate,
                    totalSpots: segment.totalSpots,
                    duration: `${segment.durationSeconds} seconds`
                }))
            }))
        };
        
        console.log("Media Plan Data:", mediaPlanData);
        alert("Media plan created successfully!");
        navigate("/agency/media-planning/schedules", { state: { mediaPlan: mediaPlanData } });
    };

    const nextStep = async () => {
        if (step === 1) {
            // Validate basic info using react-hook-form trigger
            const isValid = await trigger(['CampaignTitle', 'client', 'objective', 'targetAudience', 'startDate', 'endDate', 'budget']);
            
            if (!isValid) {
                toast.error("Please fill in all required fields correctly before proceeding.");
                return;
            }
        }
        if (step === 2 && (!watchedChannels || watchedChannels.length === 0)) {
            toast.error("Please add at least one channel with segments");
            return;
        }
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Create Media Plan</h1>
                    <p className="text-gray-600 mt-1">Plan your media campaign across multiple channels</p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={() => navigate(-1)}
                    className="border-secondary text-primary hover:bg-secondary"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>

            {/* Progress Steps */}
            <ProgressSteps currentStep={step} steps={steps} />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Basic Information */}
                {step === 1 && (
                    <BasicInfoStep
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        control={control as any}
                        errors={errors}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        watch={watch as any}
                        onNext={nextStep}
                    />
                )}

                {/* Step 2: Channels & Segments */}
                {step === 2 && (
                    <ChannelsStep
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        control={control as any}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        watch={watch as any}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        setValue={setValue as any}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        channelFields={channelFields as any}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        appendChannel={appendChannel as any}
                        removeChannel={removeChannel}
                        totalBudget={watchedBudget}
                        totalAllocated={totalAllocated}
                        remainingBudget={remainingBudget}
                        startDate={watchedStartDate}
                        endDate={watchedEndDate}
                        onPrevious={prevStep}
                        onNext={nextStep}
                    />
                )}

                {/* Step 3: Review & Submit */}
                {step === 3 && (
                    <ReviewStep
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        watch={watch as any}
                        totalBudget={watchedBudget}
                        totalAllocated={totalAllocated}
                        remainingBudget={remainingBudget}
                        startDate={watchedStartDate}
                        endDate={watchedEndDate}
                        channels={watchedChannels}
                        onPrevious={prevStep}
                    />
                )}
            </form>
        </div>
    );
}
