import { useCallback, useMemo } from 'react';
import type { Channel, DayOfWeek, MediaPlan, ChannelFormData, MediaPlanFormData, SegmentFormData } from './types';
import type { Package,PackageItem } from '@/features/media-partner-features/packages';

/**
 * Convert a Segment from the API to SegmentFormData for the form
 */
export const useToSegmentFormData = () => {
  return useCallback(
    (segment: NonNullable<Channel['segments']>[number]): SegmentFormData => {
      const timeParts = segment.timeSlot?.split('-').map((part: string) => part.trim()) ?? [];
      const durationMatch = segment.duration?.match(/\d+/);

      return {
        segmentType: segment.adType,
        programName: segment.programName!,
        startTime: timeParts[0] || '09:00',
        endTime: timeParts[1] || '17:00',
        days: segment.days,
        unitRate: segment.unitRate,
        totalSpots: segment.totalSpots,
        durationSeconds: durationMatch ? Number(durationMatch[0]) : 30,
        spotsPerDay: segment.spotsPerDay,
        discount: segment.discount,
        attachmments: segment.attachmments,
      };
    },
    []
  );
};

/**
 * Convert a Channel from the API to ChannelFormData for the form
 */
export const useToChannelFormData = () => {
  const toSegmentFormData = useToSegmentFormData();

  return useCallback(
    (channel: Channel): ChannelFormData => ({
      mediaType: channel.mediaType,
      channelName: channel.channelName,
      segments: (channel.segments || []).map(toSegmentFormData),
    }),
    [toSegmentFormData]
  );
};

/**
 * Build a channel from a package (used when starting media plan from marketplace package)
 */
export const useBuildPackageChannel = () => {
  return useCallback(
    (selectedPackage: Package | null): ChannelFormData | null => {
      if (!selectedPackage) {
        return null;
      }

      const [startTime = '09:00', endTime = '17:00'] = String(selectedPackage.metadata?.timeOfDay || '')
        .split('-')
        .map((part) => part.trim());

      const packageDays = Array.isArray(selectedPackage.metadata?.daysOfAllocation)
        ? selectedPackage.metadata.daysOfAllocation.map((day: string) => day.toUpperCase() as DayOfWeek)
        : [];

      return {
        mediaType: selectedPackage.mediaType,
        channelName: selectedPackage.mediaPartnerName || selectedPackage.packageName,
        segments: selectedPackage.items.map((item: PackageItem) => ({
          segmentType: item.adType,
          programName: item.programmeName || item.segmentClass || selectedPackage.packageName,
          startTime,
          endTime,
          days: packageDays,
          unitRate: item.unitRate,
          totalSpots: item.quantity,
          durationSeconds: Number(selectedPackage.metadata?.spotDurationSeconds || 30),
          spotsPerDay: {},
          discount: 0,
          attachmments: [],
        })),
      };
    },
    []
  );
};

/**
 * Calculate total allocated budget from channels
 */
export const useCalculateTotalAllocated = (
  watchedChannels: ChannelFormData[] | undefined,
  watchedStartDate: string,
  watchedEndDate: string
) => {
  return useMemo(() => {
    if (!watchedChannels) return 0;

    return watchedChannels.reduce((total, channel) => {
      const channelTotal = channel.segments?.reduce((segTotal, segment) => {
        if (watchedStartDate && watchedEndDate && segment.days && segment.days.length > 0) {
          const unitRate = segment.unitRate || 0;
          const totalSpots = segment.totalSpots || 0;

          if (unitRate > 0 && totalSpots > 0) {
            const start = new Date(watchedStartDate);
            const end = new Date(watchedEndDate);
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const weeks = Math.ceil(days / 7);
            const spotsPerDay = Math.ceil(totalSpots / (segment.days.length * weeks));
            const overallTotalSpots = spotsPerDay * segment.days.length * weeks;
            return segTotal + unitRate * overallTotalSpots;
          }
        }
        return segTotal;
      }, 0) || 0;

      return total + channelTotal;
    }, 0);
  }, [watchedChannels, watchedStartDate, watchedEndDate]);
};

/**
 * Calculate campaign duration in weeks
 */
export const useCalculateWeeks = (startDate: string, endDate: string) => {
  return useMemo(() => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.ceil(days / 7);
  }, [startDate, endDate]);
};

/**
 * Generate date labels for each week in the campaign
 */
export const useGetWeekDates = (startDate: string) => {
  return useCallback(
    (weekNum: number) => {
      if (!startDate) return { start: '', end: '' };

      const start = new Date(startDate);
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + (weekNum - 1) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      return {
        start: weekStart.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        end: weekEnd.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      };
    },
    [startDate]
  );
};

/**
 * Transform form data to API MediaPlan format
 */
export const useTransformFormToMediaPlan = () => {
  return useCallback(
    (data: MediaPlanFormData, totalAllocated: number): MediaPlan => {
      return {
        campaignName: data.campaignName,
        clientName: data.clientName,
        campaignObjective: data.campaignObjective,
        targetAudience: data.targetAudience,
        expectedStartDate: data.expectedStartDate,
        expectedEndDate: data.expectedEndDate,
        totalBudget: data.totalBudget,
        budgetAllocated: totalAllocated,
        discount: data.discount,
        discountAmount: data.discountAmount,
        status: 'DRAFT', // Default to DRAFT on creation, can be updated on edit
        channels: data.channels.map((channel) => ({
          mediaType: channel.mediaType,
          channelName: channel.channelName,
          segments: channel.segments.map((segment) => ({
            adType: segment.segmentType,
            segmentClass: segment.programName,
            segmentName: segment.programName,
            timeSlot: `${segment.startTime} - ${segment.endTime}`,
            days: segment.days,
            unitRate: segment.unitRate,
            totalSpots: segment.totalSpots,
            duration: `${segment.durationSeconds} seconds`,
            spotsPerDay: segment.spotsPerDay,
            discount: segment.discount,
            attachmments: segment.attachmments,
          })),
        })),
      };
    },
    []
  );
};
