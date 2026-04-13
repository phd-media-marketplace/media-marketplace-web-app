
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
} from "../../../../docs/types";

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