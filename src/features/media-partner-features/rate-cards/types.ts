// UUID type alias for better type documentation
export type UUID = string;

export type RadioSegmentClass = 'A1' | 'B' | 'C' | 'P2' | 'A' | 'P' | 'P1' | 'OTHERS';
export type RadioSegmentAnnouncementClass = 'COMMERCIAL/PRODUCTS' | 'POLICE_EXTRACT' | 'FUNERAL' | 'SOCIAL' | 'PROMOTIONS' | 'OTHER';
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
export type DaysOfWeekRange = 'MONDAY - FRIDAY' | 'SATURDAY - SUNDAY';
export type TimeInterval = '00:00 - 01:00' | '01:00 - 02:00' | '02:00 - 03:00' | '03:00 - 04:00' | '04:00 - 05:00' | '05:00 - 06:00' | '06:00 - 07:00' | '07:00 - 08:00' | '08:00 - 09:00' | '09:00 - 10:00' | '10:00 - 11:00' | '11:00 - 12:00' | '12:00 - 13:00' | '13:00 - 14:00' | '14:00 - 15:00' | '15:00 - 16:00' | '16:00 - 17:00' | '17:00 - 18:00' | '18:00 - 19:00' | '19:00 - 20:00' | '20:00 - 21:00' | '21:00 - 22:00' | '22:00 - 23:00' | '23:00 - 00:00'
export type DurationInSec = '10_SECS' | '15_SECS' | '20_SECS' | '25_SECS' | '30_SECS' | '35_SECS' | '40_SECS' | '45_SECS' | '50_SECS' | '55_SECS' | '60_SECS';
export type DurationInMin = '10_MINS' | '15_MINS' | '30_MINS' | '45_MINS' | '60_MINS';
export type RadioAdType = 'ANNOUNCEMENTS' | 'INTERVIEWS' | 'LIVE_PRESENTER_MENTIONS' | 'JINGLES' | 'NEWS_COVERAGE';

export interface TimeDetails {
  programName?: string;
  daysOfWeek: DaysOfWeekRange,
  timeInterval: TimeInterval[] | string[],
}

export interface RadioSegment {
  Class: RadioSegmentClass,
  ClassName?: string,
  timeDetails: TimeDetails[],
  Duration?: DurationInSec | DurationInMin;
  UnitRate: number;
  isActive: boolean;
}

export interface RadioRate {
  adType: RadioAdType;
  RadioSegment: RadioSegment[];
  // Duration?: DurationInSec | DurationInMin;
  // UnitRate: number;
  // isActive: boolean;
}

export interface RadioMetadata {
  mediaType: 'FM';
  adTypeRates: RadioRate[];
}

export type TVSegmentClass = 'PREMIUM' | 'M1' | 'M2' | 'M3' | 'M4' | 'OTHERS';
export type TVAdType = 'SPOT_ADVERTS' | 'DOCUMENTARY' | 'ANNOUNCEMENTS' | 'NEWS_COVERAGE' | 'EXECUTIVE_INTERVIEW' | 'PREACHING' | 'AIRTIME_SALE' | 'MEDIA';
export type SpotAdvertForm = "15_SECS" | "30_SECS"| "45_SECS" | "60_SECS" | "LPMS_LESS_THAN_60_WORDS" | "CRAWLERS" | "SQUEEZE_BACK" | "LOGO_DISPLAY" |"PRODUCT_PLACEMENT" | "PRE_PROMOS" | "PRODUCT_ENDORSEMENT" | "OPEN_OR_CLOSE_SLIDEs"| "POP_UPS";
export type TVTimeInterval = '4:00 - 6:00' | '6:00 - 10:00' | '16:00 - 22:00' | '10:00 - 16:00' | '12:00 - 14:00' | '05:00 - 10:00' | '14:00 - 19:00' | '05:00 - 20:00' | '20:00 - 00:00' | '00:00 - 05:00';
export type OtherAdvertForm = 'COMMERCIAL' | 'SOCIAL';

export interface TVSegment {
  Class: TVSegmentClass;
  ClassName?: string;
  timeDetails: TimeDetails[];
  adForm?: SpotAdvertForm | OtherAdvertForm;
  Duration?: DurationInSec | DurationInMin;
  UnitRate: number;
  isActive: boolean;
}

export interface TVRate {
  adType: TVAdType;
  TVSegment: TVSegment[];
}

export interface TVMetadata {
  mediaType: 'TV';
  adTypeRates: TVRate[];
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


export type RateCardMetadata = RadioMetadata | TVMetadata | OOHMetadata | DIGITALMetadata;
// Digital Types
export interface DIGITALMetadata {
  mediaType: 'DIGITAL';
  // Add Digital specific fields as needed
}


export interface RateCardBase {
  mediaPartnerId: UUID;
  mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
  isActive?: boolean;
  metadata: RateCardMetadata;
}

export interface RateCard extends RateCardBase {
  id: UUID;
  mediaPartnerName: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateRateCardRequest = RateCardBase;

export type BulkUploadRateCard = Omit<RateCardBase, 'mediaPartnerId'>;

export interface BulkUploadRequest {
  mediaPartnerId: UUID;
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