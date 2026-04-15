export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type Duration = '10_SECS' | '15_SECS' | '20_SECS' | '25_SECS' | '30_SECS' | '35_SECS' | '40_SECS' | '45_SECS' | '50_SECS' | '55_SECS' | '60_SECS';

export type ProductPlacementDuration = '20_MINS' | '30_MINS' | '1_HOUR';

export type InterviewDuration = '10_MINS' | '15_MINS' | '30_MINS' | '45_MINS' | '60_MINS';
export type IntervalType = 'PREMIUM' | 'TIME_INTERVAL';

export type AdType = 'COMMERCIAL' | 'SOCIAL';

export type MediaTypeForVideo = 'MUSIC_VIDEOS' | 'SOUNDTRACKS' | 'MOVIE_PROMO';

export interface TimeInterval {
  startTime: string;
  endTime: string;
}

export type AnnouncementType = 'COMMERCIAL/PRODUCTS' | 'POLICE_EXTRACT' | 'FUNERAL' | 'SOCIAL' | 'PROMOTIONS' | 'OTHER';

export type FMSegmentType = 'ANNOUNCEMENTS' | 'INTERVIEWS' | 'LIVE_PRESENTER_MENTIONS' | 'JINGLES' | 'NEWS_COVERAGE';

export type SpotAdvertType = "DURATION_BASED" | "CRAWLERS" | "SQUEEZE_BACK" | "LOGO_DISPLAY" |"PRODUCT_PLACEMENT" | "PRE_PROMOS" | "PRODUCT_ENDORSEMENT" | "OPEN_OR_CLOSE_LIGHT"| "POP_UPS";

export type TvSegmentType = 'SPOT_ADVERTS' | 'DOCUMENTARY' | 'ANNOUNCEMENTS' | 'NEWS_COVERAGE' | 'EXECUTIVE_INTERVIEW' | 'PREACHING' | 'AIRTIME_SALE' | 'MEDIA';

// Import and re-export RadioMetadata and TVMetadata from the new types file
import type { RadioMetadata, TVMetadata } from "../../src/features/media-partner-features/rate-cards/types";
export type { RadioMetadata, TVMetadata };

// Main Rate Card Types - Updated to use RadioMetadata and TVMetadata from types copy
export type RateCardMetadata = RadioMetadata | TVMetadata | OOHMetadata | DIGITALMetadata;


// FM Radio Types
export interface Announcement {
  announcementType: AnnouncementType;
  timeInterval: TimeInterval;
  rate: number;
  day: DayOfWeek[];
}

export interface Interview {
  timeInterval: TimeInterval;
  durationSeconds: InterviewDuration;
  rate: number;
  day: DayOfWeek[];
}

export interface LivePresenterMention {
  mentionType: "LIVE_PRESENTER_MENTION"|"SPONSORSHIP_MENTION";
  timeInterval: TimeInterval;
  rate: number;
  day: DayOfWeek[];
}


export interface Jingle {
  timeInterval: TimeInterval;
  duration: Duration; 
  rate: number;
  day: DayOfWeek[];
}

export interface NewsCoverageRadio {
  location: string;
  rate: number;
  day: DayOfWeek[];
}


export interface FMSegment {
  segmentName?: string; // Optional custom segment name e.g., "Prime Time Package", "Weekend Special"
  segmentType: FMSegmentType; // Primary segment type - one of FMSegmentType
  enabledTypes: FMSegmentType[]; // Track which content types are enabled for this segment
  announcements?: Announcement[];
  interviews?: Interview[];
  livePresenterMentions?: LivePresenterMention[];
  jingles?: Jingle[];
  newsCoverage?: NewsCoverageRadio[];
}

export interface FMMetadata {
  mediaType: 'FM';
  segments: FMSegment[];
}



export interface ProductPlacement {
  duration: ProductPlacementDuration;
  rate: number;
}

export interface DurationBasedAdvert {
  duration: Duration;
  rate: number;
}

export interface SpotAdvert {
  intervalType: IntervalType;
  spotAdvertType: SpotAdvertType;
  programmeType?: string;
  timeInterval?: TimeInterval;
  duration?: Duration;
  rate: number;
  day: DayOfWeek[];
  durationBasedAdvert?: DurationBasedAdvert;
  productPlacement?: ProductPlacement;
  otherSportAdvertTypeRate?: number; // For non-duration based adverts, if needed
}


export interface Documentary {
  documentaryType: "COMMERCIAL" | "SOCIAL";
  durationMinutes: InterviewDuration;
  timeInterval: TimeInterval;
  rate: number;
  day: DayOfWeek[];
}

export interface TVAnnouncement {
  announcementType: AnnouncementType;
  rate: number;
  day: DayOfWeek[];
}

export interface NewsCoverageTV {
  location: string;
  adType: AdType;
  rate: number;
  day: DayOfWeek[];
}

export interface ExecutiveInterview {
  durationMinutes: InterviewDuration;
  rate: number;
  day: DayOfWeek[];
}

export interface Preaching {
  durationMinutes: InterviewDuration;
  timeInterval: TimeInterval;
  rate: number;
  day: DayOfWeek[];
}

export interface AirtimeSale {
  durationMinutes: InterviewDuration;
  timeInterval: TimeInterval;
  rate: number;
  day: DayOfWeek[];
}

export interface Media {
  mediaType: MediaTypeForVideo;
  durationSeconds: number;
  rate: number;
  day: DayOfWeek[];
}



// Old TV types kept for backwards compatibility if needed
export interface OldTVSegment {
  segmentName?: string;
  segmentType: TvSegmentType;
  enabledTypes: TvSegmentType[];
  spotAdverts?: SpotAdvert[];
  documentary?: Documentary[];
  announcements?: TVAnnouncement[];
  newsCoverage?: NewsCoverageTV[];
  executiveInterview?: ExecutiveInterview[];
  preaching?: Preaching[];
  airtimeSale?: AirtimeSale[];
  media?: Media[];
}

export interface OldTVMetadata {
  mediaType: 'TV';
  segments: OldTVSegment[];
}

// New TVMetadata is now imported from "types copy"

// OOH (Out-of-Home) Types
export interface OOHMetadata {
  mediaType: 'OOH';
  name?: string;
  placement?: string;
  format?: string;
  dimensions?: string;
  duration?: number;
  unit?: string;
  baseRate?: number;
  currency?: string;
  validFrom?: string;
  validTo?: string;
  minimumSpend?: number;
  notes?: string;
  // Add OOH specific fields as needed
}

// Digital Types
export interface DIGITALMetadata {
  mediaType: 'DIGITAL';
  // Add Digital specific fields as needed
}


export interface RateCardBase {
  mediaPartnerId: string;
  mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
  isActive?: boolean;
  metadata: RateCardMetadata;
}

export interface RateCard extends RateCardBase {
  id: string;
  mediaPartnerName: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateRateCardRequest = RateCardBase;

export type BulkUploadRateCard = Omit<RateCardBase, 'mediaPartnerId'>;

export interface BulkUploadRequest {
  mediaPartnerId: string;
  rateCards: BulkUploadRateCard[];
}

export interface BulkUploadResponse {
  created: number;
  errors: Array<{
    index: number;
    error: string;
  }>;
}

export interface RateCardListResponse {
  rateCards: RateCard[];
  total: number;
  page: number;
  limit: number;
}
