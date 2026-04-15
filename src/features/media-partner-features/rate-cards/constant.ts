
import type { ReactNode } from "react";
import { Building2, Calendar, CircleCheck, Hash, Layers, Radio, Tv } from "lucide-react";
import type { 
    DayOfWeek,
    DurationInSec,
    DurationInMin,
} from "./types";

// Note: Some types are imported from docs for backward compatibility
import type {
    IntervalType, 
    ProductPlacementDuration, 
    FMSegmentType, 
    TvSegmentType, 
    SpotAdvertType,
    AnnouncementType,
} from "../../../../docs/archive/types";

// Constants

export const DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const JINGLE_DURATIONS: DurationInSec[] = ['10_SECS', '15_SECS', '20_SECS', '25_SECS', '30_SECS', '35_SECS', '40_SECS', '45_SECS', '50_SECS', '55_SECS', '60_SECS'];

export const INTERVIEW_DURATIONS: DurationInMin[] = ['10_MINS', '15_MINS', '30_MINS', '45_MINS', '60_MINS'];

export const INTERVAL_TYPES: IntervalType[] = ['PREMIUM', 'TIME_INTERVAL'];

export const SPOT_ADVERT_TYPES: SpotAdvertType[] = ['DURATION_BASED', 'CRAWLERS', 'SQUEEZE_BACK', 'LOGO_DISPLAY', 'PRODUCT_PLACEMENT', 'PRE_PROMOS', 'PRODUCT_ENDORSEMENT', 'OPEN_OR_CLOSE_LIGHT', 'POP_UPS'];
export const PRODUCT_PLACEMENT_DURATIONS: ProductPlacementDuration[] = ['20_MINS', '30_MINS', '1_HOUR'];

export const CAMPAIGN_OBJECTIVES = ['BRAND_AWARENESS', 'TRAFFIC', 'ENGAGEMENT','LEAD_GENERATION', 'SALES_CONVERSION'];

export const FM_SEGMENT_TYPES:FMSegmentType[] = ['ANNOUNCEMENTS', 'INTERVIEWS', 'LIVE_PRESENTER_MENTIONS', 'JINGLES', 'NEWS_COVERAGE'];

export const TV_SEGMENT_TYPES:TvSegmentType[] = ['SPOT_ADVERTS', 'DOCUMENTARY', 'ANNOUNCEMENTS', 'NEWS_COVERAGE', 'EXECUTIVE_INTERVIEW', 'PREACHING', 'AIRTIME_SALE', 'MEDIA'] as const;

export const LIVE_PRESENTER_MENTION_TYPES = ['LIVE_PRESENTER_MENTION', 'SPONSORSHIP_MENTION'];

export const ANNOUNCEMENT_TYPES: AnnouncementType[] = ['COMMERCIAL/PRODUCTS', 'POLICE_EXTRACT', 'FUNERAL', 'SOCIAL', 'PROMOTIONS', 'OTHER'] as const;


/**
 * Available time intervals
 */
export const TIME_INTERVAL_OPTIONS = [
  { value: '00:00 - 05:00', label: '00:00 - 05:00' },
  { value: '05:00 - 10:00', label: '05:00 - 10:00' },
  { value: '10:00 - 12:00', label: '10:00 - 12:00' },
  { value: '12:00 - 14:00', label: '12:00 - 14:00' },
  { value: '14:00 - 19:00', label: '14:00 - 19:00' },
  { value: '19:00 - 00:00', label: '19:00 - 00:00' },
  { value: '05:00 - 20:00', label: '05:00 - 20:00' },
  { value: '20:00 - 00:00', label: '20:00 - 00:00' },
] as const;

export interface RateCardSummaryItem {
  label: string;
  value: string | number;
  icon: React.ElementType;
  cardClass: string;
  iconClass: string;
  valueClass: string;
}

export interface RateCardMetadataItem {
  key: string;
  label: string;
  icon?: React.ElementType;
  value: ReactNode;
  valueClass: string;
}

export const buildRateCardSummaryItems = (params: {
  mediaPartnerName: string;
  mediaType: 'FM' | 'TV';
  adTypeCount: number;
  segmentCount: number;
}): RateCardSummaryItem[] => ([
  {
    label: 'Media Partner',
    value: params.mediaPartnerName,
    icon: Building2,
    cardClass: 'border-sky-200/70 bg-linear-to-br from-sky-50 to-white hover:border-sky-300',
    iconClass: 'bg-sky-100 text-sky-700',
    valueClass: 'text-sky-900',
  },
  {
    label: 'Media Type',
    value: params.mediaType === 'FM' ? 'Radio' : 'TV',
    icon: params.mediaType === 'FM' ? Radio : Tv,
    cardClass: 'border-indigo-200/70 bg-linear-to-br from-indigo-50 to-white hover:border-indigo-300',
    iconClass: 'bg-indigo-100 text-indigo-700',
    valueClass: 'text-indigo-900',
  },
  {
    label: 'Ad Types',
    value: params.adTypeCount,
    icon: Layers,
    cardClass: 'border-emerald-200/70 bg-linear-to-br from-emerald-50 to-white hover:border-emerald-300',
    iconClass: 'bg-emerald-100 text-emerald-700',
    valueClass: 'text-emerald-900',
  },
  {
    label: 'Segments',
    value: params.segmentCount,
    icon: Hash,
    cardClass: 'border-amber-200/70 bg-linear-to-br from-amber-50 to-white hover:border-amber-300',
    iconClass: 'bg-amber-100 text-amber-700',
    valueClass: 'text-amber-900',
  },
]);

export const buildRateCardMetadataItems = (params: {
  rateCardId: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}): RateCardMetadataItem[] => ([
  {
    key: 'id',
    label: 'Rate Card ID',
    value: params.rateCardId,
    valueClass: 'font-mono text-gray-600',
  },
  {
    key: 'createdAt',
    label: 'Created At',
    icon: Calendar,
    value: new Date(params.createdAt).toLocaleString(),
    valueClass: 'text-gray-600',
  },
  {
    key: 'updatedAt',
    label: 'Last Updated',
    icon: Calendar,
    value: new Date(params.updatedAt).toLocaleString(),
    valueClass: 'text-gray-600',
  },
  {
    key: 'status',
    label: 'Status',
    icon: CircleCheck,
    value: params.isActive ? 'Active' : 'Inactive',
    valueClass: params.isActive ? 'text-green-700 font-medium' : 'text-red-700 font-medium',
  },
]);