/**
 * Campaigns Feature Exports
 * Campaign performance tracking and metrics
 */

// Types
export type {
  Campaign,
  CampaignStatus,
  CampaignMetrics,
  CampaignChannelPerformance,
  CampaignListItem,
  CampaignFilters,
} from './types';

// API
export * from './api';

// Components
export * from './components';

// Dummy Data (for development)
export { dummyCampaigns, dummyCampaignListItems } from './dummy-data';

// Pages
export { default as CampaignsList } from './pages/CampaignsList';
export { default as ViewCampaign } from './pages/ViewCampaign';
