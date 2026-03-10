
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

// The CampaignSummary interface represents a comprehensive overview of a marketing campaign, including its title, client, objective, target audience, average performance metrics across all channels, detailed channel information, campaign duration, budget, and current status. This structure allows for a holistic view of the campaign's performance and effectiveness across different media types and channels.
export interface CampaignSummary {
  campaignTitle: string;
  client: string;
  objective: string;
  targetAudience: string;
  Avgmetrics: MetricsArray; // Average metrics across all channels
  channels: Channel[]; // Detailed channel information
  startDate: string;
  endDate: string;
  budget: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
}

// channel-specific performance data structure, it includes the media type, media partner name, key performance metrics (reach, frequency, impressions, clicks, CTR, CPC), budget, spend, and optional status. This structure allows for detailed tracking and analysis of each channel's contribution to the overall campaign performance.
export interface CampaignChannel {
  mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
  mediaPartnerName: string;
  metrics: MetricsArray;
  budget: number;
  spend: number;
  status?: 'active' | 'paused' | 'completed' | 'cancelled';
}
// Metrics array for campaign performance, it can be assigned to both individual channels and the overall campaign summary. It includes key performance indicators such as reach, frequency, impressions, clicks, CTR, and CPC. This allows for a comprehensive analysis of campaign effectiveness across different media types and channels.
export interface MetricsArray {
  reach: number;
  avgFrequency: number;
  impressions: number;
  clicks?: number;
  ctr?: number; // Click-through rate
  cpc?: number; // Cost per click
}