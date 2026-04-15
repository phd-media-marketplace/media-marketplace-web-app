// Media plan types(DTOs)

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type JingleDuration = '10_SECS' | '15_SECS' | '20_SECS' | '25_SECS' | '30_SECS' | '35_SECS' | '40_SECS' | '45_SECS' | '50_SECS' | '55_SECS' | '60_SECS';

export type ProductPlacementDuration = '20_MINS' | '30_MINS' | '1_HOUR';

export type IntervalType = 'PREMIUM' | 'TIME_INTERVAL';

export type AdType = 'COMMERCIAL' | 'SOCIAL';

export type MediaTypeForVideo = 'MUSIC_VIDEOS' | 'SOUNDTRACKS' | 'MOVIE_PROMO';

export interface TimeInterval {
  startTime: string;
  endTime: string;
}
// Media plan and Campaign summary types(DTOs)


// Media plan that includes campaign details, target audience, channels, and budget. This structure allows for comprehensive planning and execution of marketing campaigns across multiple media types.
export interface mediaPlan {
  CampaignTitle: string;
  client: string;
  objective: string;
  targetAudience: string;
  Channels: Channel[];
  startDate: string;
  endDate: string;
  budget: number;
}

// The Channel interface represents the different media channels used in a campaign, including the media type and segments for each channel. This allows for detailed tracking and management of campaign performance across various media platforms.
export interface Channel {
  mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
  channelName: string;
  segments?: Segment[];
}

//(work order) The Segment interface represents specific segments within a media channel, including the segment type, time slot, days of the week, rates, and optional details such as duration and various segment-specific configurations.
export interface Segment {
  // Common fields for all segments
  segmentType: string;
  programName?: string;
  timeSlot?: string; // e.g., "06:00 - 08:00"
  days: DayOfWeek[];
  unitRate: number;
  spotsPerDay: number;
  
  // FM-specific fields
  announcementType?: string;
  jingleDuration?: JingleDuration;
  interviewDuration?: string;
  livePresenterMentionType?: string;
  newsCoverageLocation?: string;
  
  // TV-specific fields
  spotAdvertType?: string;
  documentaryType?: 'COMMERCIAL' | 'SOCIAL';
  newsCoverageAdType?: AdType;
  preachingDuration?: string;
  airtimeSaleDuration?: string;
  mediaType?: MediaTypeForVideo;
  mediaDuration?: number;
  productPlacementDuration?: ProductPlacementDuration;
  
  // OOH-specific fields
  placementType?: string;
  location?: string;
  dimensions?: string;
  
  // DIGITAL-specific fields
  platform?: string;
  adFormat?: string;
  targeting?: string;
  
  // Optional legacy fields
  startTime?: string;
  endTime?: string;
  durationSeconds?: number;
  startDate?: string;
  endDate?: string;
}



//Rate card types(DTOs)

export type Duration = '10_SECS' | '15_SECS' | '20_SECS' | '25_SECS' | '30_SECS' | '35_SECS' | '40_SECS' | '45_SECS' | '50_SECS' | '55_SECS' | '60_SECS';


export type InterviewDuration = '10_MINS' | '15_MINS' | '30_MINS' | '45_MINS' | '60_MINS';


export interface TimeInterval {
  startTime: string;
  endTime: string;
}

export type AnnouncementType = 'COMMERCIAL/PRODUCTS' | 'POLICE_EXTRACT' | 'FUNERAL' | 'SOCIAL' | 'PROMOTIONS' | 'OTHER';

export type FMSegmentType = 'ANNOUNCEMENTS' | 'INTERVIEWS' | 'LIVE_PRESENTER_MENTIONS' | 'JINGLES' | 'NEWS_COVERAGE';

export type SpotAdvertType = "DURATION_BASED" | "CRAWLERS" | "SQUEEZE_BACK" | "LOGO_DISPLAY" |"PRODUCT_PLACEMENT" | "PRE_PROMOS" | "PRODUCT_ENDORSEMENT" | "OPEN_OR_CLOSE_LIGHT"| "POP_UPS";

export type TvSegmentType = 'SPOT_ADVERTS' | 'DOCUMENTARY' | 'ANNOUNCEMENTS' | 'NEWS_COVERAGE' | 'EXECUTIVE_INTERVIEW' | 'PREACHING' | 'AIRTIME_SALE' | 'MEDIA';

// Main Rate Card Types
export type RateCardMetadata = FMMetadata | TVMetadata | OOHMetadata | DIGITALMetadata;


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



export interface TVSegment {
  segmentName?: string; // Optional custom segment name e.g., "Prime Time Advertising", "Special Programs"
  segmentType: TvSegmentType; // Primary segment type - one of TvSegmentType
  enabledTypes: TvSegmentType[]; // Track which content types are enabled for this segment
  spotAdverts?: SpotAdvert[];
  documentary?: Documentary[];
  announcements?: TVAnnouncement[];
  newsCoverage?: NewsCoverageTV[];
  executiveInterview?: ExecutiveInterview[];
  preaching?: Preaching[];
  airtimeSale?: AirtimeSale[];
  media?: Media[];
}

export interface TVMetadata {
  mediaType: 'TV';
  segments: TVSegment[];
}

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


