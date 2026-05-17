import { useState } from "react";
import type { UseFormWatch, FieldValues } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card,CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { 
    ArrowLeft, 
    Save, 
    // Radio, 
    // Tv, 
    // Monitor, 
    // Building2 
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type { DayOfWeek } from "../types";
import { formatDate} from "@/utils/formatters";
import BudgetSummary from "./BudgetSummary";
import { DataTable } from "@/components/universal/DataTable";
import type { UniversalDataTableColumn } from "@/components/universal/DataTable";
import type { Channel, Segment } from "../types";
import type { ChannelFormData, SegmentFormData } from "../types";
import NoDataCard from "@/components/universal/NoDataCard";
import ApprovalConfirmationDialogBox from "@/components/universal/ApprovalConfirmationDialogBox";
import { calculateAggregatedDiscount,campaignWeeks } from "../helperFunction";

type SpotsPerDay = Partial<Record<DayOfWeek, number>>;

interface ReviewRow {
    channelName: string;
    mediaType?: string;
    programName: string;
    timeSlot: string;
    duration: string;
    days?: DayOfWeek[];
    totalSpots: number;
    unitRate: number;
    grossTotal: number;
    discount?: number;
    netTotal: number;
    spotsPerDay?: SpotsPerDay;
    volumeDiscountPercent?: number;
    totalRateCardValue?: number;
    totalNegotiatedValue?: number;
}

// const mediaIcons = {
//     FM: Radio,
//     TV: Tv,
//     OOH: Building2,
//     DIGITAL: Monitor
// };

interface ReviewStepProps {
    watch: UseFormWatch<FieldValues>;
    totalBudget: number;
    totalAllocated: number;
    remainingBudget: number;
    startDate: string;
    endDate: string;
    channels: (Channel | ChannelFormData)[];
    discount?: number;
    isAdmin: boolean;
    onSaveDraft: () => void;
    onSendForApproval: () => void;
    onProceedToPayment: () => void;
    onPrevious: () => void;
    isEditing?: boolean;
    isSaveAsNew?: boolean;
}

export default function ReviewStep({
    watch,
    totalBudget,
    totalAllocated,
    remainingBudget,
    startDate,
    endDate,
    channels,
    isAdmin,
    onSaveDraft,
    onSendForApproval,
    onProceedToPayment,
    onPrevious,
    isEditing = false,
    isSaveAsNew = false
}: ReviewStepProps) {
    const [confirmationAction, setConfirmationAction] = useState<"draft" | "approval" | "payment" | null>(null);

    const campaignWeeksValue = campaignWeeks(new Date(startDate), new Date(endDate));

    // Calculate aggregated discount from all segments
    const { totalDiscountAmount, effectiveDiscountPercent } = calculateAggregatedDiscount(channels);

    // channels.forEach((ch: Channel | ChannelFormData) => {
    //     (ch.segments || []).forEach((segment: Segment | SegmentFormData) => {
    //         const unitRate = Number(segment.unitRate) || 0;
    //         const totalSpots = Number(segment.totalSpots) || 0;
    //         const segmentDiscount = 'discount' in segment ? (segment.discount ?? 0) : 0;
    //         const grossTotal = unitRate * totalSpots;
    //         const discountAmount = (segmentDiscount / 100) * grossTotal;

    //         totalGrossFromSegments += grossTotal;
    //         totalDiscountAmount += discountAmount;
    //     });
    // });

    // const effectiveDiscountPercent = totalGrossFromSegments > 0 
    //     ? Math.round((totalDiscountAmount / totalGrossFromSegments) * 100)
    //     : 0;

    const getDraftTitle = () => {
        if (isSaveAsNew) return "Save this completed plan as a new draft?";
        if (isEditing) return "Update and save this plan as a draft?";
        return "Save this plan as a draft?";
    };

    const getDraftDescription = () => {
        if (isSaveAsNew) return "This will create a new draft plan based on the completed plan with your changes.";
        if (isEditing) return "This will update the existing media plan and save it as a draft.";
        return "This will save the current media plan without sending it for approval or payment.";
    };

    const getApprovalTitle = () => {
        if (isSaveAsNew) return "Cannot send as new";
        if (isEditing) return "Update and send this plan for approval?";
        return "Send this plan for internal approval?";
    };

    const getApprovalDescription = () => {
        if (isSaveAsNew) return "New plans must be saved as drafts first and cannot be sent directly for approval.";
        if (isEditing) return "This will update the existing media plan and submit it for approval.";
        return "This will submit the plan for approval since the current user is not an admin.";
    };

    const confirmationConfig = confirmationAction === "draft"
        ? {
            title: getDraftTitle(),
            description: getDraftDescription(),
            confirmText: isSaveAsNew ? "Save as New Draft" : (isEditing ? "Update Draft" : "Save Draft"),
            onConfirm: onSaveDraft,
        }
        : confirmationAction === "approval"
            ? {
                title: getApprovalTitle(),
                description: getApprovalDescription(),
                confirmText: isEditing ? "Update and Send" : "Send for Approval",
                onConfirm: onSendForApproval,
                disabled: isSaveAsNew,
            }
            : {
                title: isEditing ? "Update and proceed to payment?" : "Proceed to payment?",
                description: isEditing 
                    ? "This will update the existing media plan and mark it ready for payment." 
                    : "This will mark the plan ready for payment since the current user is an admin.",
                confirmText: isEditing ? "Update and Proceed" : "Proceed to Payment",
                onConfirm: onProceedToPayment,
            };

    const closeConfirmation = () => setConfirmationAction(null);

    const handleConfirm = () => {
        confirmationConfig.onConfirm();
        closeConfirmation();
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 p-6 border border-primary/10 bg-gray-50 rounded-lg shadow-md"
            >
                <h3 className="px-6 py-2 text-2xl font-bold text-primary text-center">Campaign Plan Review</h3>
                <Card className="px-2">
                    <CardHeader className="border-b border-violet-100 [.border-b]:pb-1 lg:px-2 ">
                        <CardTitle className="text-primary text-lg font-bold">Campaign Summary</CardTitle>
                    </CardHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <div className="rounded-md bg-violet-50/30 p-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-700/80">Campaign Title:</p>
                            <p className="mt-1 break-all font-medium text-violet-950">{watch('campaignName')}</p>
                        </div>
                        <div className="rounded-md bg-indigo-50/30 p-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-700/80">Brand/Client:</p>
                            <p className="mt-1 break-all font-medium text-indigo-950">{watch('clientName')}</p>
                        </div>
                        <div className="rounded-md bg-green-50/30 p-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-700/80">Campaign Period:</p>
                            <p className="mt-1 break-all font-medium text-green-950">
                                {`${formatDate(watch('expectedStartDate'))} - ${formatDate(watch('expectedEndDate'))}`}
                            </p>
                        </div>
                        <div className="rounded-md bg-blue-50/30 p-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700/80">Duration:</p>
                            <p className="mt-1 break-all font-medium text-blue-950">{campaignWeeksValue} weeks</p>
                        </div>
                        {watch('campaignObjective') && (
                            <div className="rounded-md bg-cyan-50/30 p-2">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-700/80">Objective:</p>
                                <p className="mt-1 break-all font-medium text-cyan-950">{String(watch('campaignObjective') || '')}</p>
                            </div>
                        )}
                        {watch('targetAudience') && (
                            <div className="rounded-md bg-amber-50/30 p-2">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-700/80">Target Audience:</p>
                                <p className="mt-1 break-all font-medium text-amber-950">{String(watch('targetAudience') || '')}</p>
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="p-4 space-y-4 border border-primary/5 rounded-sm shadow-none bg-gray-50">
                    <CardHeader className="border-b border-violet-100 [.border-b]:pb-1 lg:px-2 ">
                        <CardTitle className="text-primary text-lg font-bold">Channels & Segments ({channels.length})</CardTitle>
                    </CardHeader>
                    {/* Build flattened rows from channels */}
                    {(() => {
                        const rows: ReviewRow[] = [];

                        channels.forEach((ch: Channel | ChannelFormData) => {
                            const channelName = ch.channelName;
                            const mediaType = ch.mediaType;

                            (ch.segments || []).forEach((segment: Segment | SegmentFormData) => {
                                const unitRate = Number(segment.unitRate) || 0;
                                const totalSpots = Number(segment.totalSpots) || 0;
                                const segmentDiscount = 'discount' in segment ? (segment.discount ?? 0) : 0;
                                const grossTotal = unitRate * totalSpots;
                                const discountAmount = (segmentDiscount / 100) * grossTotal;
                                const netTotal = grossTotal - discountAmount;

                                const programName = segment.programName || '';
                                const timeSlot = 'timeSlot' in segment && segment.timeSlot
                                    ? segment.timeSlot
                                    : 'startTime' in segment && segment.startTime
                                        ? `${(segment as SegmentFormData).startTime} - ${(segment as SegmentFormData).endTime}`
                                        : '';

                                const duration = 'duration' in segment && segment.duration
                                    ? segment.duration
                                    : 'durationSeconds' in segment && (segment as SegmentFormData).durationSeconds
                                        ? `${(segment as SegmentFormData).durationSeconds} seconds`
                                        : '';

                                rows.push({
                                    channelName,
                                    mediaType,
                                    programName,
                                    timeSlot,
                                    duration,
                                    days: segment.days || [],
                                    totalSpots,
                                    unitRate,
                                    grossTotal,
                                    discount: segmentDiscount,
                                    netTotal,
                                    spotsPerDay: 'spotsPerDay' in segment ? segment.spotsPerDay : {},
                                });
                            });
                        });

                        const columns: UniversalDataTableColumn<ReviewRow>[] = [
                            { 
                                id: 'program', 
                                header: 'Programme/Station',
                                accessor: 'programName', 
                                sticky: true, 
                                stickyLeft: 0, 
                                widthPx: 320, 
                                headerClassName: 'whitespace-nowrap',
                                cellClassName: 'whitespace-nowrap' 
                            },
                            { 
                                id: 'time', 
                                header: 'Prog Time', 
                                accessor: 'timeSlot', 
                                widthPx: 140, 
                                headerClassName: 
                                'whitespace-nowrap', 
                                cellClassName: 'whitespace-nowrap' 
                            },
                            { 
                                id: 'duration', 
                                header: 'Duration', 
                                accessor: 'duration', 
                                widthPx: 120, 
                                headerClassName: 'whitespace-nowrap', 
                                cellClassName: 'whitespace-nowrap' 
                            },
                            { 
                                id: 'days', 
                                header: 'Prog. Day', 
                                cell: (row) => (row.days || []).map((d: DayOfWeek) => d.substring(0,3)).join(', '), 
                                widthPx: 160, 
                                headerClassName: 'whitespace-nowrap', 
                                cellClassName: 'whitespace-nowrap' 
                            },
                            { 
                                id: 'spots', 
                                header: 'Spots', 
                                accessor: 'totalSpots', 
                                align: 'right', widthPx: 80, 
                                headerClassName: 'whitespace-nowrap', 
                                cellClassName: 'whitespace-nowrap' 
                            },
                            { 
                                id: 'unitRate', 
                                header: 'Unit Rate (Rate Card)', 
                                cell: (row) => formatCurrency(row.unitRate), 
                                align: 'right', 
                                widthPx: 120, 
                                headerClassName: 'whitespace-nowrap', 
                                cellClassName: 'whitespace-nowrap' 
                            },
                            { 
                                id: 'gross', 
                                header: 'Gross Total', 
                                cell: (row) => formatCurrency(row.grossTotal), 
                                align: 'right', widthPx: 120, 
                                headerClassName: 'whitespace-nowrap', 
                                cellClassName: 'whitespace-nowrap' 
                            },
                            { 
                                id: 'Disc',
                                header: 'Disc. %', 
                                cell: (row) => `${row.discount}%`, 
                                align: 'right', 
                                widthPx: 90, 
                                headerClassName: 'whitespace-nowrap', 
                                cellClassName: 'whitespace-nowrap' 
                            },
                            { 
                                id: 'netTotal', 
                                header: 'Net Total', cell: (row) => formatCurrency(row.netTotal), 
                                align: 'right', 
                                widthPx: 120, 
                                headerClassName: 'whitespace-nowrap', 
                                cellClassName: 'whitespace-nowrap' },
                            {
                                id: 'mon', 
                                header: 'Mon', 
                                cell: (row) => (row.spotsPerDay?.MONDAY ? (row.spotsPerDay.MONDAY) : ''), 
                                align: 'center', 
                                widthPx: 70, 
                                headerClassName: 'whitespace-nowrap', 
                                cellClassName: 'whitespace-nowrap' },
                            { 
                                id: 'tue', 
                                header: 'Tue', 
                                cell: (row) => (row.spotsPerDay?.TUESDAY ? (row.spotsPerDay.TUESDAY) : ''), 
                                align: 'center', 
                                widthPx: 70, 
                                headerClassName: 'whitespace-nowrap', 
                                cellClassName: 'whitespace-nowrap' },
                            { 
                                id: 'wed', 
                                header: 'Wed', 
                                cell: (row) => (row.spotsPerDay?.WEDNESDAY ? (row.spotsPerDay.WEDNESDAY) : ''), 
                                align: 'center', 
                                widthPx: 70, 
                                headerClassName: 'whitespace-nowrap', 
                                cellClassName: 'whitespace-nowrap' },
                            { 
                                id: 'thu', 
                                header: 'Thu', 
                                cell: (row) => (row.spotsPerDay?.THURSDAY ? (row.spotsPerDay.THURSDAY) : ''), 
                                align: 'center', 
                                widthPx: 70, 
                                headerClassName: 'whitespace-nowrap', 
                                cellClassName: 'whitespace-nowrap' },
                            { 
                                id: 'fri', 
                                header: 'Fri', 
                                cell: (row) => (row.spotsPerDay?.FRIDAY ? (row.spotsPerDay.FRIDAY) : ''), 
                                align: 'center', 
                                widthPx: 70, 
                                headerClassName: 'whitespace-nowrap', 
                                cellClassName: 'whitespace-nowrap' },
                            { 
                                id: 'sat', 
                                header: 'Sat', 
                                cell: (row) => (row.spotsPerDay?.SATURDAY ? (row.spotsPerDay.SATURDAY) : ''), 
                                align: 'center', 
                                widthPx: 70, 
                                headerClassName: 'whitespace-nowrap', 
                                cellClassName: 'whitespace-nowrap' },
                            { 
                                id: 'sun', 
                                header: 'Sun', 
                                cell: (row) => (row.spotsPerDay?.SUNDAY ? (row.spotsPerDay.SUNDAY) : ''), 
                                align: 'center', 
                                widthPx: 70, 
                                headerClassName: 'whitespace-nowrap', 
                                cellClassName: 'whitespace-nowrap' },
                        ];

                        return (
                            <DataTable
                                rows={rows}
                                columns={columns}
                                rowKey={(r, i) => `${r.channelName}-${r.programName}-${i}`}
                                containerClassName=""
                                minTableWidthClassName="min-w-[1600px]"
                                tableClassName=""
                                emptyState={
                                    <NoDataCard
                                        title="No segments added"
                                        message="Add media channels and segments in the previous steps to see the campaign summary here."
                                    />
                                }
                            />
                        );
                    })()}
                </Card>

                <div className="pt-6">

                    <BudgetSummary 
                        totalBudget={totalBudget}
                        totalAllocated={totalAllocated}
                        remainingBudget={remainingBudget}
                        startDate={startDate}
                        endDate={endDate}
                        discount={effectiveDiscountPercent}
                        discountAmount={totalDiscountAmount}
                        className="bg-slate-50 rounded-none"
                    />
                </div>

            </motion.div>
            <div className="flex justify-between">
                <Button type="button" onClick={onPrevious} variant="outline" className="border-secondary text-primary hover:bg-secondary/90">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="border-slate-300 text-slate-700 hover:bg-slate-100"
                        onClick={() => setConfirmationAction("draft")}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaveAsNew ? "Save as New Draft" : (isEditing ? "Update Draft" : "Save Draft")}
                    </Button>
                    <Button
                        type="button"
                        className="bg-primary text-white hover:bg-primary/90"
                        disabled={remainingBudget < 0 || isSaveAsNew}
                        onClick={() => setConfirmationAction(isAdmin ? "payment" : "approval")}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isAdmin 
                            ? (isEditing ? "Update and Proceed to Payment" : "Proceed to Payment")
                            : (isEditing ? "Update and Send for Approval" : "Send for Approval")
                        }
                    </Button>
                </div>
            </div>

            <ApprovalConfirmationDialogBox
                open={confirmationAction !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        closeConfirmation();
                    }
                }}
                title={confirmationConfig.title}
                description={confirmationConfig.description}
                confirmText={confirmationConfig.confirmText}
                onConfirm={handleConfirm}
                onCancel={closeConfirmation}
            />
        </>
    );
}
