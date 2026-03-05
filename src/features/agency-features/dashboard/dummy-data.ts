import type { MediaType } from "@/types/api";
export interface CampaignChannel {
  id: string;
  name: string;
  reach: number;
  impressions: number;
  spend: number;
  icon: string;
  status: 'active' | 'paused' | 'completed';
  trend: 'up' | 'down' | 'stable';
  mediaType: MediaType;
}

export interface RecommendedPackage {
  id: string;
  title: string;
  mediaType: MediaType;
  channel: string;
  cost: number;
  discount?: number;
  spotTime: string;
  duration: string;
  reach: string;
  location?: string;
  demographics?: string;
  badge?: string;
  packageduration?: number; // Duration in days for OOH packages
}

export interface Campaign {
    campaignName: string;
    channel: string[];
    metrics: {
        reach: number;
        impressions: number;
        clicks?: number;
        AvgFrequency: number;
        cpc?: number;
        ctr?: number;

    };
    budget: number;
    spend: number;
    status: 'active' | 'paused' | 'completed';
}

export const campaignChannels: CampaignChannel[] = [
  {
    id: '1',
    name: 'Adom TV',
    reach: 2500000,
    impressions: 8500000,
    spend: 125000,
    icon: '📺',
    status: 'active',
    trend: 'up',
    mediaType: 'TV'
  },
  {
    id: '2',
    name: 'Ghanaweb',
    reach: 1800000,
    impressions: 12000000,
    spend: 45000,
    icon: '💻',
    status: 'active',
    trend: 'up',
    mediaType: 'DIGITAL'
  },
  {
    id: '3',
    name: 'Citi FM',
    reach: 1200000,
    impressions: 4200000,
    spend: 32000,
    icon: '📻',
    status: 'active',
    trend: 'down',
    mediaType: 'RADIO'
  },
  {
    id: '4',
    name: 'DD Billboards',
    reach: 3200000,
    impressions: 15000000,
    spend: 58000,
    icon: '📱',
    status: 'active',
    trend: 'up',
    mediaType: 'OOH'
  },
  {
    id: '5',
    name: 'Gerfix Billboards',
    reach: 850000,
    impressions: 2800000,
    spend: 28000,
    icon: '📍',
    status: 'active',
    trend: 'down',
    mediaType: 'OOH'
  }
];

export const CampaignsData: Campaign[] = [
    {
        campaignName: 'Summer Sale',
        channel: ['Adom TV', 'Ghanaweb'],
        metrics: {
            reach: 2500000,
            impressions: 8500000,
            AvgFrequency: 3.4
        },
        budget: 50000,
        spend: 30000,
        status: 'active'
    },
    {
        campaignName: 'Back to School',
        channel: ['Citi FM', 'DD Billboards'],
        metrics: {
            reach: 1200000,
            impressions: 4200000,
            AvgFrequency: 2.8
        },
        budget: 40000,
        spend: 15000,
        status: 'paused'
    },
    {
        campaignName: 'Holiday Specials',
        channel: ['Gerfix Billboards'],
        metrics: {
            reach: 850000,
            impressions: 2800000,
            AvgFrequency: 3.3
        },
        budget: 20000,
        spend: 20000,
        status: 'completed'
    },
    {
        campaignName: 'New Year Blast',
        channel: ['Adom TV', 'Citi FM', 'Ghanaweb'],
        metrics: {
            reach: 3000000,
            impressions: 10000000,
            AvgFrequency: 3.2
        },
        budget: 30000,
        spend: 10000,
        status: 'active'
    }
]

export const recommendedPackages: RecommendedPackage[] = [
  {
    id: '1',
    title: 'Prime Time TV Bundle',
    mediaType: 'TV',
    channel: 'Adom TV',
    cost: 45000,
    spotTime: '7:00 PM - 10:00 PM',
    duration: '30 seconds',
    reach: '2.5M',
    location: 'Major Cities',
    demographics: '18-45, Urban',
    packageduration: 1, // Duration in months for OOH packages
    badge: 'Popular'
  },
  {
    id: '2',
    title: 'Digital Display Premium',
    mediaType: 'DIGITAL',
    channel: 'Ghanaweb',
    cost: 12000,
    discount: 20, // 20% discount
    spotTime: 'All Day',
    duration: '15 seconds',
    reach: '1.8M',
    demographics: '18-45, Urban',
    packageduration: 1, // Duration in months for OOH packages
    badge: 'Best Value'
  },
  {
    id: '3',
    title: 'Drive Time Radio',
    mediaType: 'RADIO',
    channel: 'Adom FM',
    cost: 8500,
    discount: 10, // 10% discount
    spotTime: '6:00 AM - 9:00 AM, 4:00 PM - 7:00 PM',
    duration: '30 seconds',
    reach: '1.2M',
    demographics: '25-54, Commuters',
    packageduration: 1, // Duration in months for OOH packages
    badge: 'Recommended'
  },
  {
    id: '4',
    title: 'Billboard Premium Locations',
    mediaType: 'OOH',
    channel: 'DD Billboards',
    cost: 25000,
    spotTime: '24/7',
    duration: '30 days',
    reach: '850K',
    location: 'High-traffic areas in Accra',
    demographics: '18-45, Urban',
    packageduration: 1, // Duration in months for OOH packages
  },
  {
    id: '5',
    title: 'Highway Billboards',
    mediaType: 'OOH',
    channel: 'Primetime Outdoor',
    cost: 35000,
    discount: 15, // 15% discount
    spotTime: '24/7',
    duration: '30 days',
    reach: '1.5M',
    location: 'Accra-Tema Highway',
    demographics: 'Adults 25-54',
    packageduration: 1, // Duration in months for OOH packages
    badge: 'Trending'
  },
  {
    id: '6',
    title: 'Social Media Blitz',
    mediaType: 'DIGITAL',
    channel: 'Multi-platform',
    cost: 18000,
    discount: 25, // 25% discount
    spotTime: 'All Day',
    duration: '30 days campaign',
    reach: '3.2M',
    location: 'Nationwide',
    demographics: '18-35, Tech-savvy',
    packageduration: 1,
    badge: 'Hot Deal'
  }
];

