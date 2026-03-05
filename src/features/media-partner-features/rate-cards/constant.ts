import type { DayOfWeek, Duration, IntervalType, InterviewDuration, ProductPlacementDuration, SpotAdvertType } from "./types";

// Constants

export const DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const JINGLE_DURATIONS: Duration[] = ['10_SECS', '15_SECS', '20_SECS', '25_SECS', '30_SECS', '35_SECS', '40_SECS', '45_SECS', '50_SECS', '55_SECS', '60_SECS'];

export const INTERVIEW_DURATIONS: InterviewDuration[] = ['10_MINS', '15_MINS', '30_MINS', '45_MINS', '60_MINS'];

export const INTERVAL_TYPES: IntervalType[] = ['PREMIUM', 'TIME_INTERVAL'];
export const SPOT_ADVERT_TYPES: SpotAdvertType[] = ['DURATION_BASED', 'CRAWLERS', 'SQUEEZE_BACK', 'LOGO_DISPLAY', 'PRODUCT_PLACEMENT', 'PRE_PROMOS', 'PRODUCT_ENDORSEMENT', 'OPEN_OR_CLOSE_LIGHT', 'POP_UPS'];
export const PRODUCT_PLACEMENT_DURATIONS: ProductPlacementDuration[] = ['20_MINS', '30_MINS', '1_HOUR'];
