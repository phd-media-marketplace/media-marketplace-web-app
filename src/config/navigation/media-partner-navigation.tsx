import type { NavigationItem } from "@/types/index";
import {
  LayoutDashboard,
  DollarSign,
  BarChart3,
  CreditCard,
  BellRing,
  Package,
  FileCheck,
  User,
  Users,
} from "lucide-react";

export const mediaPartnerNavigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/media-partner/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Rate Cards",
    icon: CreditCard,
    items: [
      { title: "All Rate Cards", url: "/media-partner/rate-cards" },
      { title: "Create New", url: "/media-partner/rate-cards/create" },
    ],
  },
  {
    title: "Packages",
    icon: Package,
    items: [
      { title: "All Packages", url: "/media-partner/packages" },
      { title: "Create Package", url: "/media-partner/packages/create" },
    ],
  },
  {    title: "Work Orders",
    url: "/media-partner/work-orders",
    icon: FileCheck,
  },
  {
    title: "Billing",
    url: "/media-partner/billing",
    icon: DollarSign,
  },
  {
    title: "Reporting",
    url: "/media-partner/reporting",
    icon: BarChart3,
  },
  {
    title: "Notifications",
    url: "/media-partner/notifications",
    icon: BellRing,
  },
];

export const mediaPartnerSettingsNavigationItems: NavigationItem[] = [
  {
    title: "Profile",
    url: "/media-partner/settings/profile",
    icon: User,
  },
  {
    title: "Teams",
    url: "/media-partner/settings/teams",
    icon: Users,
  },
  {
    title: "Notifications",
    url: "/media-partner/settings/notifications",
    icon: BellRing,
  },
];
