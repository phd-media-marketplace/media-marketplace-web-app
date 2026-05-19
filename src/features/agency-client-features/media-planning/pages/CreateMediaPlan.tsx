import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Channel, MediaPlan, MediaType, ChannelFormData, MediaPlanFormData, SegmentFormData, DayOfWeek } from "../types";
import ProgressSteps from "../components/ProgressSteps";
import BasicInfoStep from "../components/BasicInfoStep";
import ChannelsStep from "../components/ChannelsStep";
import ReviewStep from "../components/ReviewStep";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { dummyMediaPlans } from "../dummy-data";
import { dummyMediaPackages } from "../../marketplace/dummy-data";
import { useTransformFormToMediaPlan } from "../hooks";

interface MarketplacePlanState {
    packageId: string;
    packageName: string;
    mediaType: MediaType;
    existingPlanId?: string;
}

const toSegmentFormData = (segment: NonNullable<Channel["segments"]>[number]): SegmentFormData => {
    const timeParts = segment.timeSlot?.split("-").map((part: string) => part.trim()) ?? [];
    const durationMatch = segment.duration?.match(/\d+/);

    return {
        segmentType: segment.adType,
        programName: segment.programName!, // || segment.segmentName || segment.segmentClass || "",
        startTime: timeParts[0] || "09:00",
        endTime: timeParts[1] || "17:00",
        days: segment.days,
        unitRate: segment.unitRate,
        totalSpots: segment.totalSpots,
        durationSeconds: durationMatch ? Number(durationMatch[0]) : 30,
    };
};

const toChannelFormData = (channel: Channel): ChannelFormData => ({
    mediaType: channel.mediaType,
    channelName: channel.channelName,
    segments: (channel.segments || []).map(toSegmentFormData),
});

const buildPackageChannel = (packageId: string) => {
    const selectedPackage = dummyMediaPackages.find((pkg) => pkg.id === packageId);

    if (!selectedPackage) {
        return null;
    }

    const [startTime = "09:00", endTime = "17:00"] = String(selectedPackage.metadata?.timeOfDay || "")
        .split("-")
        .map((part) => part.trim());

    const packageDays = Array.isArray(selectedPackage.metadata?.daysOfAllocation)
        ? selectedPackage.metadata.daysOfAllocation.map((day: string) => day.toUpperCase() as DayOfWeek)
        : [];

    return {
        mediaType: selectedPackage.mediaType,
        channelName: selectedPackage.mediaPartnerName || selectedPackage.packageName,
        segments: selectedPackage.items.map((item) => ({
            segmentType: item.adType,
            programName: item.programmeName || item.segmentClass || selectedPackage.packageName,
            startTime,
            endTime,
            days: packageDays,
            unitRate: item.unitRate,
            totalSpots: item.quantity,
            durationSeconds: Number(selectedPackage.metadata?.spotDurationSeconds || 30),
        })),
    } satisfies ChannelFormData;
};

export default function CreateMediaPlan() {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(1);
    const { user } = useAuthStore();
    const clientName = user?.tenantName || "";
    const isAdmin = user?.roles?.includes("ADMIN") || user?.roles?.includes("TENANT_ADMIN");
    const packageState = location.state as MarketplacePlanState | undefined;
    const transformFormToMediaPlan = useTransformFormToMediaPlan();

    const selectedPackage = packageState?.packageId
        ? dummyMediaPackages.find((pkg) => pkg.id === packageState.packageId) || null
        : null;
    const selectedExistingPlan = packageState?.existingPlanId
        ? dummyMediaPlans.find((plan) => plan.id === packageState.existingPlanId) || null
        : null;
    
    const { control, handleSubmit, watch, setValue, trigger, reset, formState: { errors } } = useForm<MediaPlanFormData>({
        defaultValues: {
            campaignName: '',
            clientName: '',
            campaignObjective: '',
            targetAudience: '',
            expectedStartDate: '',
            expectedEndDate: '',
            totalBudget: 0,
            channels: []
        }
    });

    // Set client name when user data is available
    useEffect(() => {
        if (clientName) {
            setValue('clientName', clientName);
        }
    }, [clientName, setValue]);

    const { fields: channelFields, append: appendChannel, remove: removeChannel } = useFieldArray({
        control,
        name: "channels"
    });

    useEffect(() => {
        if (!selectedPackage) {
            return;
        }

        const packageChannel = buildPackageChannel(selectedPackage.id);
        const existingChannels = selectedExistingPlan
            ? selectedExistingPlan.channels.map(toChannelFormData)
            : [];

        const channels = packageChannel
            ? [...existingChannels, packageChannel]
            : existingChannels;

        // Preload the selected package into the plan form so the buyer does not start from scratch.
        reset({
            campaignName: selectedExistingPlan?.campaignName || selectedPackage.packageName,
            clientName: selectedExistingPlan?.clientName || clientName,
            campaignObjective: selectedExistingPlan?.campaignObjective || `Purchase ${selectedPackage.mediaType} package`,
            targetAudience: selectedExistingPlan?.targetAudience || selectedPackage.demographics.join(", "),
            expectedStartDate: selectedExistingPlan?.expectedStartDate || '',
            expectedEndDate: selectedExistingPlan?.expectedEndDate || '',
            totalBudget: (selectedExistingPlan?.totalBudget || 0) + selectedPackage.finalPrice,
            channels,
        });
    }, [clientName, reset, selectedExistingPlan, selectedPackage]);

    const watchedChannels = useWatch({ control, name: "channels" });
    const watchedBudget = useWatch({ control, name: "totalBudget" }) || 0;
    const watchedStartDate = useWatch({ control, name: "expectedStartDate" }) || "";
    const watchedEndDate = useWatch({ control, name: "expectedEndDate" }) || "";

    const steps = [
        { num: 1, title: "Basic Info" },
        { num: 2, title: "Channels & Segments" },
        { num: 3, title: "Review & Submit" }
    ];

    // Calculate gross allocated and total discount from all channels (accounting for occurrences over campaign period)
    const calculateAllocationAndDiscount = () => {
        let grossAllocated = 0;
        let totalDiscountAmt = 0;

        if (!watchedChannels) return { grossAllocated: 0, totalDiscountAmt: 0 };

        watchedChannels.forEach((channel) => {
            (channel.segments || []).forEach((segment) => {
                if (watchedStartDate && watchedEndDate && segment.days && segment.days.length > 0) {
                    const unitRate = segment.unitRate || 0;
                    const totalSpots = segment.totalSpots || 0;

                    if (unitRate > 0 && totalSpots > 0) {
                        const start = new Date(watchedStartDate);
                        const end = new Date(watchedEndDate);
                        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                        const weeks = Math.ceil(days / 7);
                        const spotsPerDay = Math.ceil(totalSpots / (segment.days.length * weeks));
                        const overalltotalSpots = spotsPerDay * segment.days.length * weeks;

                        const gross = unitRate * overalltotalSpots;
                        const segDiscountPercent = typeof segment.discount === 'number' ? segment.discount : (segment.discount ? Number(segment.discount) : 0);
                        const discountAmt = (segDiscountPercent / 100) * gross;

                        grossAllocated += gross;
                        totalDiscountAmt += discountAmt;
                    }
                }
            });
        });

        return { grossAllocated, totalDiscountAmt };
    };

    const { grossAllocated, totalDiscountAmt } = calculateAllocationAndDiscount();
    const totalAllocated = grossAllocated; // gross before discounts
    const remainingBudget = watchedBudget - (grossAllocated - totalDiscountAmt); // after discounts
    const effectiveDiscountPercent = grossAllocated > 0 ? Math.round((totalDiscountAmt / grossAllocated) * 100) : 0;

    const submitMediaPlan = (status: string, successMessage: string) =>
        handleSubmit((data: MediaPlanFormData) => {
            const netAllocated = grossAllocated - totalDiscountAmt;
            if (netAllocated > watchedBudget) {
                toast.error("Total allocated budget (after discounts) exceeds campaign budget!");
                return;
            }

            const temp: unknown = {
                ...transformFormToMediaPlan(data, netAllocated),
                status,
                createdBy: user?.id,
                approvedBy: String(status).toUpperCase() === "APPROVED" ? user?.id : undefined,
            };
            const mediaPlanData: MediaPlan = temp as MediaPlan;

            console.log("Media Plan Data:", mediaPlanData);
            toast.success(successMessage);
            navigate(`/${user?.tenantType}/media-planning/plans`, { state: { mediaPlan: mediaPlanData } });
        });

    const handleSaveDraft = submitMediaPlan("DRAFT", "Draft saved successfully.");
    const handleSendForApproval = submitMediaPlan("PENDING_APPROVAL", "Media plan sent for internal approval.");
    const handleProceedToPayment = submitMediaPlan("APPROVED", "Media plan approved and ready for payment.");

    const nextStep = async () => {
        if (step === 1) {
            // Validate basic info using react-hook-form trigger
            const isValid = await trigger(['campaignName', 'clientName', 'campaignObjective', 'targetAudience', 'expectedStartDate', 'expectedEndDate', 'totalBudget']);
            
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
            {selectedPackage && (
                <Card className="border border-slate-200 bg-slate-50">
                    <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-full bg-white p-2 shadow-sm">
                            <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900">
                                {selectedPackage.packageName}
                                {selectedExistingPlan ? ` will be added to ${selectedExistingPlan.campaignName}` : " will start a new plan"}
                            </p>
                            <p className="text-xs text-slate-500">
                                {selectedExistingPlan
                                    ? "We loaded the selected draft plan and appended this package into the planning flow."
                                    : "We loaded the package data so you can continue building the plan with its details in place."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

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

            <form onSubmit={(event) => event.preventDefault()} className="space-y-6">
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
                    <div>
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
                            discount={effectiveDiscountPercent}
                            discountAmount={totalDiscountAmt}
                            startDate={watchedStartDate}
                            endDate={watchedEndDate}
                            onPrevious={prevStep}
                            onNext={nextStep}
                        />

                    </div>
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
                        isAdmin={Boolean(isAdmin)}
                        onSaveDraft={handleSaveDraft}
                        onSendForApproval={handleSendForApproval}
                        onProceedToPayment={handleProceedToPayment}
                        onPrevious={prevStep}
                    />
                )}
            </form>
        </div>
    );
}
