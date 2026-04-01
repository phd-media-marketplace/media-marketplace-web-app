import Dashboard from "@/features/agency-features/dashboard/pages/Dashboard";
import PackageDetails from "@/features/agency-features/marketplace/pages/PackageDetails";
import Packages from "@/features/agency-features/marketplace/pages/Packages";
import CreateMediaPlan from "@/features/agency-features/media-planning/pages/CreateMediaPlan";
import MediaSchedules from "@/features/agency-features/media-planning/pages/MediaSchedules";
import MediaPlansList from "@/features/agency-features/media-planning/pages/MediaPlansList";
import ViewMediaPlan from "@/features/agency-features/media-planning/pages/ViewMediaPlan";
import WorkOrdersList from "@/features/agency-features/work-orders/pages/WorkOrdersList";
import ViewWorkOrder from "@/features/agency-features/work-orders/pages/ViewWorkOrder";
import CampaignsList from "@/features/agency-features/campaigns/pages/CampaignsList";
import ViewCampaign from "@/features/agency-features/campaigns/pages/ViewCampaign";
import ViewCampaignCharts from "@/features/agency-features/campaigns/pages/ViewCampaignCharts";
import MediaPartnerDashboard from "@/features/media-partner-features/dashboard/pages/MediaPartnerDashboard";
import { RateCardsList, CreateRateCard, ViewRateCard, EditRateCard } from "@/features/media-partner-features/rate-cards";
import { PackagesList, CreatePackage, ViewPackage, EditPackage } from "@/features/media-partner-features/packages";
import { MediaPartnerWorkOrdersList, MediaPartnerViewWorkOrder } from "@/features/media-partner-features/work-orders";

import type { TenantType } from "@/types/api";

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  roles?: string[]; // Optional roles for access control
  children?: RouteConfig[];
}

/**
 * Centralized route configuration for the application.
 * Each route can specify allowed roles for access control.
 */
export const appRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    // roles: ["TENANT_ADMIN"]
  },
  // Add more protected routes here as you build features
  // {
  //   path: "/planning",
  //   element: <Planning />,
  //   roles: ["PLANNER", "DIRECTOR"]
  // },
  // {
  //   path: "/compliance",
  //   element: <Compliance />,
  //   roles: ["QC", "DIRECTOR"]
  // },
  // {
  //   path: "/reports",
  //   element: <Reports />,
  //   roles: ["DIRECTOR"]
  // },
  // {
  //   path: "/marketplace",
  //   element: <Packages />,
  //   roles: ["PLANNER", "DIRECTOR"]
  // }
];

/**
 * Tenant-specific route configurations with prefixed paths
 */
export const tenantRoutes: Record<TenantType, RouteConfig[]> = {
  AGENCY: [
    {
      path: "/agency/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/agency/marketplace",
      element: <Packages />,
    },
    {
      path: "/agency/marketplace/:id",
      element: <PackageDetails />,
      roles: ["TENANT_ADMIN"]
    },
    {
      path: "/agency/media-planning/create",
      element: <CreateMediaPlan />,
    },
    {
      path: "/agency/media-planning/plans",
      element: <MediaPlansList />,
    },
    {
      path: "/agency/media-planning/plans/:id",
      element: <ViewMediaPlan />,
    },
    {
      path: "/agency/media-planning/schedules",
      element: <MediaSchedules />,
    },
    {
      path: "/agency/work-orders",
      element: <WorkOrdersList />,
    },
    {
      path: "/agency/work-orders/:id",
      element: <ViewWorkOrder />,
    },
    {
      path: "/agency/campaigns",
      element: <CampaignsList />,
    },
    {
      path: "/agency/campaigns/:id",
      element: <ViewCampaign />,
    },
    {
      path: "/agency/campaigns/:id/charts",
      element: <ViewCampaignCharts />,
    },
    // Agency-specific routes will be added here
  ],
  CLIENT: [
    {
      path: "/client/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/client/marketplace",
      element: <Packages />,
    },
    {
      path: "/client/marketplace/:id",
      element: <PackageDetails />,
      roles: ["TENANT_ADMIN"]
    },
    {
      path: "/client/media-planning/create",
      element: <CreateMediaPlan />,
    },
    {
      path: "/client/media-planning/plans",
      element: <MediaPlansList />,
    },
    {
      path: "/client/media-planning/plans/:id",
      element: <ViewMediaPlan />,
    },
    {
      path: "/client/media-planning/schedules",
      element: <MediaSchedules />,
    },
    {
      path: "/client/work-orders",
      element: <WorkOrdersList />,
    },
    {
      path: "/client/work-orders/:id",
      element: <ViewWorkOrder />,
    },
    {
      path: "/client/campaigns",
      element: <CampaignsList />,
    },
    {
      path: "/client/campaigns/:id",
      element: <ViewCampaign />,
    },
    {
      path: "/client/campaigns/:id/charts",
      element: <ViewCampaignCharts />,
    },
    // Client-specific routes will be added here
  ],
  MEDIA_PARTNER: [
    {
      path: "/media-partner/dashboard",
      element: <MediaPartnerDashboard />,
    },
    {
      path: "/media-partner/rate-cards",
      element: <RateCardsList />,
    },
    {
      path: "/media-partner/rate-cards/create",
      element: <CreateRateCard />,
    },
    {
      path: "/media-partner/rate-cards/:id",
      element: <ViewRateCard />,
    },
    {
      path: "/media-partner/rate-cards/:id/edit",
      element: <EditRateCard />,
    },
    {
      path: "/media-partner/packages",
      element: <PackagesList />,
    },
    {
      path: "/media-partner/packages/create",
      element: <CreatePackage />,
    },
    {
      path: "/media-partner/packages/:id",
      element: <ViewPackage />,
    },
    {
      path: "/media-partner/packages/:id/edit",
      element: <EditPackage />,
    },
    {
      path: "/media-partner/work-orders",
      element: <MediaPartnerWorkOrdersList />,
    },
    {
      path: "/media-partner/work-orders/:id",
      element: <MediaPartnerViewWorkOrder />,
    },
    // Media Partner-specific routes will be added here
  ],
};

/**
 * Get the base path prefix for a tenant type
 */
export function getTenantPrefix(tenantType: TenantType): string {
  const prefixes: Record<TenantType, string> = {
    AGENCY: '/agency',
    CLIENT: '/client',
    MEDIA_PARTNER: '/media-partner',
  };
  return prefixes[tenantType];
}
