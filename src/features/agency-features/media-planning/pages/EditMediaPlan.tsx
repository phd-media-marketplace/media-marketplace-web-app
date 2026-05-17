import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Channel, MediaPlan, ChannelFormData, MediaPlanFormData, SegmentFormData } from "../types";
import ProgressSteps from "../components/ProgressSteps";
import BasicInfoStep from "../components/BasicInfoStep";
import ChannelsStep from "../components/ChannelsStep";
import ReviewStep from "../components/ReviewStep";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { dummyMediaPlans } from "../dummy-data";
import { useTransformFormToMediaPlan } from "../hooks";
import LoadingError from "@/components/universal/LoadingError";
import { getStatusColor, getStatusLabel } from "../helperFunction";

const toSegmentFormData = (segment: NonNullable<Channel["segments"]>[number]): SegmentFormData => {
    const timeParts = segment.timeSlot?.split("-").map((part: string) => part.trim()) ?? [];
    const durationMatch = segment.duration?.match(/\d+/);

    return {
        segmentType: segment.adType,
        programName: segment.programName! || segment.segmentName || segment.segmentClass || "",
        startTime: timeParts[0] || "09:00",
        endTime: timeParts[1] || "17:00",
        days: segment.days,
        unitRate: segment.unitRate,
        totalSpots: segment.totalSpots,
        durationSeconds: durationMatch ? Number(durationMatch[0]) : 30,
        spotsPerDay: segment.spotsPerDay,
        discount: segment.discount,
        attachmments: segment.attachmments,
    };
};

const toChannelFormData = (channel: Channel): ChannelFormData => ({
    mediaType: channel.mediaType,
    channelName: channel.channelName,
    id: channel.mediaType,
    segments: (channel.segments || []).map(toSegmentFormData),
});


export default function EditMediaPlan() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const { user } = useAuthStore();
    const clientName = user?.tenantName || "";
    const isAdmin = user?.roles?.includes("ADMIN") || user?.roles?.includes("TENANT_ADMIN");
    const transformFormToMediaPlan = useTransformFormToMediaPlan();

    // Find the media plan by ID
    const existingPlan = dummyMediaPlans.find(plan => plan.id === id);

    // Determine if plan can be edited or only cloned
    const canEdit = existingPlan && !["APPROVED", "PENDING_APPROVAL"].includes(existingPlan.status);
    const isCompleted = existingPlan?.status === "COMPLETED";
    const canSaveAsNew = existingPlan && isCompleted;

    const { control, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<MediaPlanFormData>({
        defaultValues: {
            campaignName: '',
            clientName: clientName,
            campaignObjective: '',
            targetAudience: '',
            expectedStartDate: '',
            expectedEndDate: '',
            totalBudget: 0,
            channels: []
        }
    });

    // Initialize form with existing plan data
    useEffect(() => {
        if (existingPlan) {
            const formData: MediaPlanFormData = {
                campaignName: existingPlan.campaignName,
                clientName: existingPlan.clientName,
                campaignObjective: existingPlan.campaignObjective,
                targetAudience: existingPlan.targetAudience,
                expectedStartDate: existingPlan.expectedStartDate,
                expectedEndDate: existingPlan.expectedEndDate,
                totalBudget: existingPlan.totalBudget,
                budgetAllocated: existingPlan.budgetAllocated,
                status: canSaveAsNew ? 'DRAFT' : existingPlan.status,
                channels: existingPlan.channels.map(toChannelFormData),
                discount: existingPlan.discount,
            };
            
            // Reset form with existing plan data
            Object.keys(formData).forEach(key => {
                setValue(key as keyof MediaPlanFormData, formData[key as keyof MediaPlanFormData]);
            });
        }
    }, [existingPlan, setValue, canSaveAsNew]);

    const { fields: channelFields, append: appendChannel, remove: removeChannel } = useFieldArray({
        control,
        name: "channels"
    });

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
    const totalAllocated = grossAllocated;
    const remainingBudget = watchedBudget - (grossAllocated - totalDiscountAmt);
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
                id: canSaveAsNew ? undefined : existingPlan?.id,
                status,
                createdBy: canSaveAsNew ? user?.id : existingPlan?.createdBy,
                approvedBy: String(status).toUpperCase() === "APPROVED" ? user?.id : existingPlan?.approvedBy,
                updatedAt: new Date().toISOString(),
            };
            const mediaPlanData: MediaPlan = temp as MediaPlan;

            console.log("Updated Media Plan Data:", mediaPlanData);
            toast.success(successMessage);
            navigate(`/${user?.tenantType}/media-planning/plans`, { state: { mediaPlan: mediaPlanData } });
        });

    const handleUpdateDraft = submitMediaPlan("DRAFT", "Plan updated and saved as draft.");
    const handleUpdateAndSend = submitMediaPlan("PENDING_APPROVAL", "Plan updated and sent for approval.");
    const handleUpdateAndApprove = submitMediaPlan("APPROVED", "Plan updated and approved.");
    const handleSaveAsNew = submitMediaPlan("DRAFT", "Plan saved as new draft.");

    const nextStep = async () => {
        if (step === 1) {
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

    // Plan not found
    if (!existingPlan) {
        return (
            <LoadingError 
                title="Media Plan Not Found"
                message="The media plan you're trying to edit doesn't exist or has been removed."
                onRetry={() => navigate('/agency/media-planning/plans')}
            />
        );
    }

    // Plan cannot be edited (approved or rejected)
    if (!canEdit && !canSaveAsNew) {
        return (
            <div className="space-y-6 pb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">{existingPlan.campaignName}</h1>
                        <p className="text-gray-600 mt-1">This plan cannot be edited.</p>
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

                <Card className="border border-yellow-200 bg-yellow-50">
                    <CardContent className="p-6 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="rounded-full bg-yellow-200 p-2 mt-1">
                                <Badge className={getStatusColor(existingPlan.status)}>
                                    {getStatusLabel(existingPlan.status)}
                                </Badge>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">This plan is {getStatusLabel(existingPlan.status).toLowerCase()}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {existingPlan.status === 'APPROVED' && "Only approved plans cannot be modified. If you need to make changes, please create a new plan instead."}
                                    {existingPlan.status === 'PENDING_APPROVAL' && "Plans awaiting approval cannot be edited. Please create a new plan or contact your administrator."}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Button onClick={() => navigate('/agency/media-planning/plans')}>
                    Back to Plans
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            {/* Status Alert for Completed Plans */}
            {canSaveAsNew && (
                <Card className="border border-blue-200 bg-blue-50">
                    <CardContent className="flex items-center justify-between p-4">
                        <div>
                            <p className="font-semibold text-gray-900">Editing a Completed Plan</p>
                            <p className="text-sm text-gray-600 mt-1">
                                You're editing a completed plan. Any changes will be saved as a new draft plan.
                            </p>
                        </div>
                        <Badge className={getStatusColor(existingPlan.status)}>
                            {getStatusLabel(existingPlan.status)}
                        </Badge>
                    </CardContent>
                </Card>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">
                        {canSaveAsNew ? "Create from Completed Plan" : "Edit Media Plan"}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {canSaveAsNew 
                            ? "Modify and save this completed plan as a new draft" 
                            : "Update your media plan details"}
                    </p>
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
                        isEditing={true}
                        isSaveAsNew={canSaveAsNew}
                        onSaveDraft={canSaveAsNew ? handleSaveAsNew : handleUpdateDraft}
                        onSendForApproval={canSaveAsNew ? handleSaveAsNew : handleUpdateAndSend}
                        onProceedToPayment={handleUpdateAndApprove}
                        onPrevious={prevStep}
                    />
                )}
            </form>
        </div>
    );
}
