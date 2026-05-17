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
import { formatAdType } from "@/utils/formatters";
import type { MediaPlanFormData } from "../types";

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
                            name="campaignName"
                            control={control}
                            rules={{ required: "Campaign title is required" }}
                            render={({ field }) => (
                                <Input {...field} placeholder="Enter campaign title" className="w-full input-field" />
                            )}
                        />
                        {errors.campaignName && (
                            <p className="text-sm text-red-500">{errors.campaignName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Client/Brand Name <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="clientName"
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
                        {errors.clientName && (
                            <p className="text-sm text-red-500">{errors.clientName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Start Date <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="expectedStartDate"
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
                        {errors.expectedStartDate && (
                            <p className="text-sm text-red-500">{errors.expectedStartDate.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            End Date <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="expectedEndDate"
                            control={control}
                            rules={{ 
                                required: "End date is required",
                                validate: (value) => {
                                    const startDate = watch('expectedStartDate') as string;
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
                        {errors.expectedEndDate && (
                            <p className="text-sm text-red-500">{errors.expectedEndDate.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Coins className="w-4 h-4 inline mr-1" />
                            Total Budget (GHS) <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="totalBudget"
                            control={control}
                            rules={{ required: "Total budget is required" }}
                            render={({ field }) => (
                                <Input {...field} type="number" min={0} className="w-full input-field" placeholder="Enter total budget" />
                            )}
                        />
                        {errors.totalBudget && (
                            <p className="text-sm text-red-500">{errors.totalBudget.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Target className="w-4 h-4 inline mr-1" />
                            Campaign Objective <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="campaignObjective"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value as string}>
                                    <SelectTrigger className="w-full input-field">
                                        <SelectValue placeholder="Select objective" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full bg-white border-primary/10">
                                        {CAMPAIGN_OBJECTIVES.map(obj => (
                                            <SelectItem key={obj} value={obj}>{formatAdType(obj)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Users className="w-4 h-4 inline mr-1" />
                            Target Audience <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="targetAudience"
                            control={control}
                            render={({ field }) => (
                                <Textarea 
                                    {...field} 
                                    placeholder="Describe your target audience... e.g., Adults 25-45, Urban dwellers, Tech enthusiasts, etc."
                                    className="w-full min-h-25 input-field"
                                />
                            )}
                        />
                        {errors.targetAudience && (
                            <p className="text-sm text-red-500">{errors.targetAudience.message}</p>
                        )}
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
