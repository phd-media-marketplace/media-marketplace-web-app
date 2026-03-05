
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
  Channels: string[];
  startDate: string;
  endDate: string;
  budget: number;
}
// The Channels interface represents the different media channels used in a campaign, including the media type and optional segments for each channel. This allows for detailed tracking and management of campaign performance across various media platforms.
export interface Channels {
  mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
  Segments?: Segment[];
}
//(work order) The Segment interface represents specific segments within a media channel, including the segment type, time interval, days of the week, rates, and optional details such as duration and start/end dates. This structure allows for granular tracking and analysis of campaign performance within each media channel.
export interface Segment {
  segmentType: string;
  timeInterval: TimeInterval;
  days: DayOfWeek[];
  uniteRate: number;
  totalRate: number;
  TotalSpots: number;
  spot:sportArray[];
  durationSeconds?: number;
  startDate?: string;
  endDate?: string;
}
// The sportArray interface represents the number of spots for a specific day of the week, allowing for detailed tracking of advertising placements across different days. This structure can be used within the Segment interface to manage and analyze the distribution of advertising spots throughout the campaign duration.
export interface sportArray {
  day: DayOfWeek;
  NumOfSpots: number;
}

// The CampaignSummary interface represents a comprehensive overview of a marketing campaign, including its title, client, objective, target audience, average performance metrics across all channels, detailed channel information, campaign duration, budget, and current status. This structure allows for a holistic view of the campaign's performance and effectiveness across different media types and channels.
export interface CampaignSummary {
  campaignTitle: string;
  client: string;
  objective: string;
  targetAudience: string;
  Avgmetrics: MetricsArray; // Average metrics across all channels
  channels: Channels[]; // Detailed channel information
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