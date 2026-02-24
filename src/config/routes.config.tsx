import Dashboard from "@/features/agency-features/dashboard/pages/Dashboard";
import MediaPartnerDashboard from "@/features/media-partner-features/dashboard/pages/MediaPartnerDashboard";
import { RateCardsList, CreateRateCard } from "@/features/media-partner-features/rate-cards";

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
  //   element: <Marketplace />,
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
    // Agency-specific routes will be added here
  ],
  CLIENT: [
    {
      path: "/client/dashboard",
      element: <Dashboard />,
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
