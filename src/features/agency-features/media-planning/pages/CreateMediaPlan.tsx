import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Calendar, 
    DollarSign, 
    Target, 
    Users, 
    Plus, 
    X, 
    ArrowLeft,
    ArrowRight,
    Save,
    Tv,
    Radio,
    Monitor,
    Building2
} from "lucide-react";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { mediaPlan, DayOfWeek } from "../types";
import { formatCurrency } from "@/utils/formatters";

const mediaTypes: Array<'FM' | 'TV' | 'OOH' | 'DIGITAL'> = ['FM', 'TV', 'OOH', 'DIGITAL'];
const daysOfWeek: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const mediaIcons = {
    FM: Radio,
    TV: Tv,
    OOH: Building2,
    DIGITAL: Monitor
};

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
    uniteRate: number;
    spotsPerDay: number;
    durationSeconds: number;
}

export default function CreateMediaPlan() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    
    const { control, handleSubmit, watch, formState: { errors } } = useForm<MediaPlanFormData>({
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

    const { fields: channelFields, append: appendChannel, remove: removeChannel } = useFieldArray({
        control,
        name: "channels"
    });

    const watchedChannels = watch('channels');
    const watchedBudget = watch('budget');
    const watchedStartDate = watch('startDate');
    const watchedEndDate = watch('endDate');

    // Calculate total allocated budget from all channels
    const calculateTotalAllocated = () => {
        if (!watchedChannels) return 0;
        return watchedChannels.reduce((total, channel) => {
            const channelTotal = channel.segments?.reduce((segTotal, segment) => {
                if (watchedStartDate && watchedEndDate && segment.days && segment.days.length > 0) {
                    const start = new Date(watchedStartDate);
                    const end = new Date(watchedEndDate);
                    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    const weeks = Math.ceil(days / 7);
                    const totalSpots = segment.spotsPerDay * segment.days.length * weeks;
                    return segTotal + (segment.uniteRate * totalSpots);
                }
                return segTotal;
            }, 0) || 0;
            return total + channelTotal;
        }, 0);
    };

    const totalAllocated = calculateTotalAllocated();
    const remainingBudget = watchedBudget - totalAllocated;

    const addChannel = () => {
        appendChannel({
            mediaType: 'FM',
            channelName: '',
            segments: []
        });
    };

    const onSubmit = (data: MediaPlanFormData) => {
        if (totalAllocated > watchedBudget) {
            alert("Total allocated budget exceeds campaign budget!");
            return;
        }

        // Transform data to match mediaPlan interface
        const mediaPlanData: mediaPlan = {
            ...data,
            Channels: data.channels.map(c => c.channelName).filter(Boolean)
        };
        
        console.log("Media Plan Data:", mediaPlanData);
        alert("Media plan created successfully!");
        navigate("/agency/media-planning/schedules", { state: { mediaPlan: data } });
    };

    const nextStep = () => {
        if (step === 1) {
            // Validate basic info
            const title = watch('CampaignTitle');
            const client = watch('client');
            const startDate = watch('startDate');
            const endDate = watch('endDate');
            const budget = watch('budget');
            
            if (!title || !client || !startDate || !endDate || !budget) {
                alert("Please fill in all required fields");
                return;
            }
        }
        if (step === 2 && (!watchedChannels || watchedChannels.length === 0)) {
            alert("Please add at least one channel with segments");
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
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>

            {/* Progress Steps */}
            <Card className="p-6">
                <div className="flex items-center justify-between">
                    {[
                        { num: 1, title: "Basic Info" },
                        { num: 2, title: "Channels & Segments" },
                        { num: 3, title: "Review & Submit" }
                    ].map((s, idx) => (
                        <div key={s.num} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                                    step >= s.num 
                                        ? 'bg-primary text-white' 
                                        : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {s.num}
                                </div>
                                <span className={`text-sm mt-2 font-medium ${
                                    step >= s.num ? 'text-primary' : 'text-gray-600'
                                }`}>
                                    {s.title}
                                </span>
                            </div>
                            {idx < 2 && (
                                <div className={`h-1 flex-1 transition-all ${
                                    step > s.num ? 'bg-primary' : 'bg-gray-200'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Basic Information */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <Card className="p-6 space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900">Campaign Information</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Campaign Title <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="CampaignTitle"
                                        control={control}
                                        rules={{ required: "Campaign title is required" }}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="Enter campaign title" className="w-full" />
                                        )}
                                    />
                                    {errors.CampaignTitle && (
                                        <p className="text-sm text-red-500">{errors.CampaignTitle.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Client <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="client"
                                        control={control}
                                        rules={{ required: "Client is required" }}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="Enter client name" className="w-full" />
                                        )}
                                    />
                                    {errors.client && (
                                        <p className="text-sm text-red-500">{errors.client.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Start Date <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="startDate"
                                        control={control}
                                        rules={{ required: "Start date is required" }}
                                        render={({ field }) => (
                                            <Input {...field} type="date" className="w-full" />
                                        )}
                                    />
                                    {errors.startDate && (
                                        <p className="text-sm text-red-500">{errors.startDate.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        End Date <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="endDate"
                                        control={control}
                                        rules={{ required: "End date is required" }}
                                        render={({ field }) => (
                                            <Input {...field} type="date" className="w-full" />
                                        )}
                                    />
                                    {errors.endDate && (
                                        <p className="text-sm text-red-500">{errors.endDate.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        <DollarSign className="w-4 h-4 inline mr-1" />
                                        Total Budget (GHS) <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="budget"
                                        control={control}
                                        rules={{ required: "Budget is required", min: 1 }}
                                        render={({ field }) => (
                                            <Input 
                                                {...field} 
                                                type="number" 
                                                placeholder="0.00"
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                className="w-full" 
                                            />
                                        )}
                                    />
                                    {errors.budget && (
                                        <p className="text-sm text-red-500">{errors.budget.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        <Target className="w-4 h-4 inline mr-1" />
                                        Campaign Objective
                                    </label>
                                    <Controller
                                        name="objective"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="e.g., Brand Awareness" className="w-full" />
                                        )}
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        <Users className="w-4 h-4 inline mr-1" />
                                        Target Audience
                                    </label>
                                    <Controller
                                        name="targetAudience"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea 
                                                {...field} 
                                                placeholder="Describe your target audience..."
                                                className="w-full min-h-25"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </Card>

                        <div className="flex justify-end">
                            <Button type="button" onClick={nextStep} className="bg-primary">
                                Next Step
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Channels & Segments */}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Budget Summary */}
                        <Card className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Total Budget</p>
                                    <p className="text-2xl font-bold text-primary">{formatCurrency(watchedBudget)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Allocated</p>
                                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalAllocated)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Remaining</p>
                                    <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(remainingBudget)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Campaign Duration</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {Math.ceil(((new Date(watchedEndDate).getTime() - new Date(watchedStartDate).getTime()) / (1000 * 60 * 60 * 24) + 1) / 7)} weeks
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Channels */}
                        <div className="space-y-4">
                            {channelFields.map((channel, channelIndex) => (
                                <ChannelCard
                                    key={channel.id}
                                    channelIndex={channelIndex}
                                    control={control}
                                    watch={watch}
                                    removeChannel={removeChannel}
                                />
                            ))}
                        </div>

                        <Button type="button" onClick={addChannel} variant="outline" className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Channel
                        </Button>

                        <div className="flex justify-between">
                            <Button type="button" onClick={prevStep} variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>
                            <Button type="button" onClick={nextStep} className="bg-primary">
                                Review Plan
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Review & Submit */}
                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <Card className="p-6 space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900">Campaign Summary</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600">Campaign Title</p>
                                    <p className="font-semibold">{watch('CampaignTitle')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Client</p>
                                    <p className="font-semibold">{watch('client')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Campaign Period</p>
                                    <p className="font-semibold">
                                        {watch('startDate')} to {watch('endDate')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Duration</p>
                                    <p className="font-semibold">{Math.ceil(((new Date(watchedEndDate).getTime() - new Date(watchedStartDate).getTime()) / (1000 * 60 * 60 * 24) + 1) / 7)} weeks</p>
                                </div>
                                {watch('objective') && (
                                    <div>
                                        <p className="text-sm text-gray-600">Objective</p>
                                        <p className="font-semibold">{watch('objective')}</p>
                                    </div>
                                )}
                                {watch('targetAudience') && (
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-gray-600">Target Audience</p>
                                        <p className="font-semibold">{watch('targetAudience')}</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="p-6 space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900">Budget Breakdown</h2>
                            
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Budget</p>
                                    <p className="text-2xl font-bold text-primary">{formatCurrency(watchedBudget)}</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Allocated</p>
                                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAllocated)}</p>
                                </div>
                                <div className={`text-center p-4 rounded-lg ${remainingBudget >= 0 ? 'bg-gray-50' : 'bg-red-50'}`}>
                                    <p className="text-sm text-gray-600">Remaining</p>
                                    <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                                        {formatCurrency(remainingBudget)}
                                    </p>
                                </div>
                            </div>

                            {remainingBudget < 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-800 font-medium">
                                        Warning: Total allocated budget exceeds campaign budget by {formatCurrency(Math.abs(remainingBudget))}
                                    </p>
                                </div>
                            )}
                        </Card>

                        <Card className="p-6 space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900">Channels & Segments ({watchedChannels.length})</h2>
                            
                            {watchedChannels.map((channel, idx) => {
                                const Icon = mediaIcons[channel.mediaType];
                                return (
                                    <div key={idx} className="border rounded-lg p-4 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="font-semibold">{channel.channelName || 'Unnamed Channel'}</p>
                                                <Badge variant="secondary">{channel.mediaType}</Badge>
                                            </div>
                                        </div>
                                        <div className="pl-8 space-y-2">
                                            {channel.segments && channel.segments.map((segment, segIdx) => (
                                                <div key={segIdx} className="text-sm bg-gray-50 p-3 rounded">
                                                    <p className="font-medium">{segment.programName || segment.segmentType}</p>
                                                    <p className="text-gray-600">
                                                        {segment.startTime} - {segment.endTime} | {segment.days.join(', ')} | 
                                                        {formatCurrency(segment.uniteRate)}/spot | {segment.spotsPerDay} spots/day
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </Card>

                        <div className="flex justify-between">
                            <Button type="button" onClick={prevStep} variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>
                            <Button type="submit" className="bg-primary" disabled={remainingBudget < 0}>
                                <Save className="w-4 h-4 mr-2" />
                                Create Media Plan
                            </Button>
                        </div>
                    </motion.div>
                )}
            </form>
        </div>
    );
}

// Channel Card Component
function ChannelCard({ 
    channelIndex, 
    control, 
    watch, 
    removeChannel 
}: { 
    channelIndex: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    watch: any;
    removeChannel: (index: number) => void;
}) {
    const { fields: segmentFields, append: appendSegment, remove: removeSegment } = useFieldArray({
        control,
        name: `channels.${channelIndex}.segments` as const
    });

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

    const channelMediaType = watch(`channels.${channelIndex}.mediaType`) as 'FM' | 'TV' | 'OOH' | 'DIGITAL';
    const Icon = mediaIcons[channelMediaType];

    return (
        <Card className="p-6 space-y-4">
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
                                <SelectTrigger>
                                    <SelectValue placeholder="Select media type" />
                                </SelectTrigger>
                                <SelectContent>
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
                            <Input {...field} placeholder="e.g., Peace FM, GTV"  />
                        )}
                    />
                </div>
            </div>

            {/* Segments */}
            <div className="space-y-3 mt-4">
                <h4 className="font-medium text-gray-900">Segments</h4>
                
                {segmentFields.map((segment, segmentIndex) => (
                    <div key={segment.id} className="border rounded-lg p-4 space-y-4 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-700">Segment {segmentIndex + 1}</p>
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
                                <label className="text-sm font-medium text-gray-700">Segment Type</label>
                                <Controller
                                    name={`channels.${channelIndex}.segments.${segmentIndex}.segmentType`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="e.g., Prime Time" />
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Program Name</label>
                                <Controller
                                    name={`channels.${channelIndex}.segments.${segmentIndex}.programName`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="e.g., Morning Show" />
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Start Time</label>
                                <Controller
                                    name={`channels.${channelIndex}.segments.${segmentIndex}.startTime`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} type="time" />
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">End Time</label>
                                <Controller
                                    name={`channels.${channelIndex}.segments.${segmentIndex}.endTime`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} type="time" />
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Rate per Spot (GHS)</label>
                                <Controller
                                    name={`channels.${channelIndex}.segments.${segmentIndex}.uniteRate`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input 
                                            {...field} 
                                            type="number" 
                                            placeholder="0.00"
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                                        />
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Duration (seconds)</label>
                                <Controller
                                    name={`channels.${channelIndex}.segments.${segmentIndex}.durationSeconds`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select 
                                            onValueChange={(value) => field.onChange(parseInt(value))} 
                                            value={field.value?.toString()}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select duration" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="15">15 seconds</SelectItem>
                                                <SelectItem value="30">30 seconds</SelectItem>
                                                <SelectItem value="60">60 seconds</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-gray-700">Days of Week</label>
                                <Controller
                                    name={`channels.${channelIndex}.segments.${segmentIndex}.days`}
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex flex-wrap gap-2">
                                            {daysOfWeek.map(day => {
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
                                            })}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <Button type="button" onClick={addSegment} variant="outline" size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Segment
                </Button>
            </div>
        </Card>
    );
}