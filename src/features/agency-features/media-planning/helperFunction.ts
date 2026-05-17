import type { 
    Channel, 
    Segment, 
    ChannelFormData, 
    SegmentFormData,
    MediaPlan
} from './types';

export const campaignWeeks = (startDate: Date, endDate: Date) => Math.ceil(
        ((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) + 1) / 7
    );

// Calculate aggregated discount from all segments
export const calculateAggregatedDiscount = (channels: (Channel | ChannelFormData)[]) => {
    let totalGrossFromSegments = 0;
    let totalDiscountAmount = 0;

    channels.forEach((ch: Channel | ChannelFormData) => {
        (ch.segments || []).forEach((segment: Segment | SegmentFormData) => {
            const unitRate = Number(segment.unitRate) || 0;
            const totalSpots = Number(segment.totalSpots) || 0;
            const segmentDiscount = 'discount' in segment ? (segment.discount ?? 0) : 0;
            const grossTotal = unitRate * totalSpots;
            const discountAmount = (segmentDiscount / 100) * grossTotal;

            totalGrossFromSegments += grossTotal;
            totalDiscountAmount += discountAmount;
        });
    });

    const effectiveDiscountPercent = totalGrossFromSegments > 0 
        ? Math.round((totalDiscountAmount / totalGrossFromSegments) * 100)
        : 0;

    return {
        totalGrossFromSegments,
        totalDiscountAmount,
        effectiveDiscountPercent
    };
};

// Helper functions for status badges (same as MediaPlansList)
export const getStatusColor = (status: MediaPlan['status']) => {
  const colors: Record<MediaPlan['status'], string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
    REJECTED: 'bg-red-100 text-red-700',
    PENDING_APPROVAL: 'bg-purple-100 text-purple-700',
    APPROVED: 'bg-emerald-100 text-emerald-700',
    REVISED: 'bg-yellow-100 text-yellow-700',
  };
  return colors[status] || colors.DRAFT;
};

export const getStatusLabel = (status: MediaPlan['status']) => {
  const labels: Record<MediaPlan['status'], string> = {
    DRAFT: 'Draft',
    COMPLETED: 'Completed',
    REJECTED: 'Rejected',
    PENDING_APPROVAL: 'Pending Approval',
    APPROVED: 'Approved',
    REVISED: 'Revised',
  };
  return labels[status] || status;
};