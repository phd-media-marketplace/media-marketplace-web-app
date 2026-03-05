export interface ActiveCampaignProps {
  id: string;
  title: string;
  clientName: string;
  agencyName?: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'active' | 'paused' | 'completed';
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export const dummyActiveCampaigns: ActiveCampaignProps[] = [
  {
    id: '1',
    title: 'Spring Sale Campaign',
    clientName: 'Acme Corp',
    agencyName: 'Bright Media',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    budget: 5000,
    status: 'active',
  },
  {
    id: '2',
    title: 'Summer Promotion Campaign',
    clientName: 'Beta Inc',
    agencyName: 'Creative Agency',
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    budget: 7000,
    status: 'paused',
  },
  {
    id: '3',
    title: 'Fall Discount Campaign',
    clientName: 'Gamma LLC',
    agencyName: 'Innovative Media',
    startDate: '2024-09-01',
    endDate: '2024-09-30',
    budget: 6000,
    status: 'completed',
  },
];

export const dummyRevenueData: RevenueDataPoint[] = [
  { date: '2024-01-01', revenue: 1000 },
  { date: '2024-02-01', revenue: 1500 },
  { date: '2024-03-01', revenue: 2000 },
  { date: '2024-04-01', revenue: 2500 },
  { date: '2024-05-01', revenue: 3000 },
  { date: '2024-06-01', revenue: 3500 },
];
