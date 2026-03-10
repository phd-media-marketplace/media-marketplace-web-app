import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Target, Users, ArrowRight, Coins } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";
import { CAMPAIGN_OBJECTIVES } from "@/features/media-partner-features/rate-cards/constant";

interface MediaPlanFormData {
    CampaignTitle: string;
    client: string;
    objective: string;
    targetAudience: string;
    startDate: string;
    endDate: string;
    budget: number;
    channels: unknown[];
}

interface BasicInfoStepProps {
    control: Control<MediaPlanFormData>;
    errors: FieldErrors<MediaPlanFormData>;
    watch: (name: keyof MediaPlanFormData) => string | number;
    onNext: () => void;
}

export default function BasicInfoStep({ control, errors, watch, onNext }: BasicInfoStepProps) {
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
        >
            <Card className="p-6 space-y-6 border border-primary/10 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-primary">Campaign Information</h2>
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
                                <Input {...field} placeholder="Enter campaign title" className="w-full input-field" />
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
                                <Input 
                                    {...field} 
                                    placeholder="Enter client name" 
                                    className="w-full input-field" 
                                />
                            )}
                        />
                        {errors.client && (
                            <p className="text-sm text-red-500">{errors.client.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Start Date <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="startDate"
                            control={control}
                            rules={{ 
                                required: "Start date is required",
                                validate: (value) => {
                                    const selectedDate = new Date(value);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    selectedDate.setHours(0, 0, 0, 0);
                                    
                                    if (selectedDate <= today) {
                                        return "Start date must be in the future";
                                    }
                                    return true;
                                }
                            }}
                            render={({ field }) => (
                                <Input 
                                    {...field} 
                                    type="date" 
                                    className="w-full input-field"
                                    min={getTomorrowDate()}
                                />
                            )}
                        />
                        {errors.startDate && (
                            <p className="text-sm text-red-500">{errors.startDate.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            End Date <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="endDate"
                            control={control}
                            rules={{ 
                                required: "End date is required",
                                validate: (value) => {
                                    const startDate = watch('startDate') as string;
                                    if (!startDate) {
                                        return "Please select start date first";
                                    }
                                    
                                    const selectedEndDate = new Date(value);
                                    const selectedStartDate = new Date(startDate);
                                    const today = new Date();
                                    
                                    today.setHours(0, 0, 0, 0);
                                    selectedEndDate.setHours(0, 0, 0, 0);
                                    selectedStartDate.setHours(0, 0, 0, 0);
                                    
                                    if (selectedEndDate <= today) {
                                        return "End date must be in the future";
                                    }
                                    
                                    if (selectedEndDate <= selectedStartDate) {
                                        return "End date must be after start date";
                                    }
                                    
                                    return true;
                                }
                            }}
                            render={({ field }) => (
                                <Input 
                                    {...field} 
                                    type="date" 
                                    className="w-full input-field"
                                    min={getTomorrowDate()}
                                />
                            )}
                        />
                        {errors.endDate && (
                            <p className="text-sm text-red-500">{errors.endDate.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Coins className="w-4 h-4 inline mr-1" />
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
                                    className="w-full input-field"
                                />
                            )}
                        />
                        {errors.budget && (
                            <p className="text-sm text-red-500">{errors.budget.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Target className="w-4 h-4 inline mr-1" />
                            Campaign Objective
                        </label>
                        <Controller
                            name="objective"
                            control={control}
                            render={({ field }) => (
                                // <Input {...field} placeholder="e.g., Brand Awareness" className="w-full input-field" />
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full input-field">
                                        <SelectValue placeholder="Select campaign objective" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full bg-white border-primary/10">
                                        {CAMPAIGN_OBJECTIVES.map((objective) => (
                                            <SelectItem key={objective} value={objective}>
                                                {objective.replace(/_/g, " ").charAt(0).toUpperCase() + objective.replace(/_/g, " ").slice(1).toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
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
                                    className="w-full min-h-25 input-field"
                                />
                            )}
                        />
                    </div>
                </div>
            </Card>

            <div className="flex justify-end">
                <Button type="button" onClick={onNext} className="bg-primary text-white hover:opacity-90 transition-opacity">
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </motion.div>
    );
}
