import type { NavigationItem } from "@/types/index";
import type { TenantType } from "@/types/api";
import { agencyNavigationItems } from "./navigation/agency-navigation";
import { clientNavigationItems } from "./navigation/client-navigation";
import { mediaPartnerNavigationItems } from "./navigation/media-partner-navigation";

export interface TenantBranding {
  workspaceName: string;
  logoColor: string;
  accentColor: string;
}

export interface TenantConfig {
  navigation: NavigationItem[];
  branding: TenantBranding;
}

const tenantConfigurations: Record<TenantType, TenantConfig> = {
  AGENCY: {
    navigation: agencyNavigationItems,
    branding: {
      workspaceName: "Agency Workspace",
      logoColor: "#C8F526", // Lime green
      accentColor: "#2D0A4E", // Purple
    },
  },
  CLIENT: {
    navigation: clientNavigationItems,
    branding: {
      workspaceName: "Client Portal",
      logoColor: "#3B82F6", // Blue
      accentColor: "#1E40AF", // Dark blue
    },
  },
  MEDIA_PARTNER: {
    navigation: mediaPartnerNavigationItems,
    branding: {
      workspaceName: "Media Partner Hub",
      logoColor: "#10B981", // Emerald green
      accentColor: "#065F46", // Dark green
    },
  },
};

/**
 * Get the configuration (navigation and branding) for a specific tenant type
 * @param tenantType - The type of tenant (AGENCY, CLIENT, MEDIA_PARTNER)
 * @returns Tenant-specific configuration with navigation items and branding
 */
export function getTenantConfig(tenantType: TenantType | undefined): TenantConfig {
  // Default to AGENCY if no tenant type is provided
  return tenantConfigurations[tenantType || 'AGENCY'];
}
