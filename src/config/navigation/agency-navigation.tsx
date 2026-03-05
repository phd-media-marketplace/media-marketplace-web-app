import type { NavigationItem } from "@/types/index";
import {
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  FileText,
  CreditCard,
  ClipboardCheck,
} from "lucide-react";

export const agencyNavigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/agency/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Marketplace",
    icon: ShoppingCart,
    items: [
      { title: "Browse Media", url: "/agency/marketplace" },
    ],
  },
  {
    title: "Planning",
    icon: FileText,
    items: [
      { title: "Create Plan", url: "/agency/media-planning/create" },
      { title: "View Schedules", url: "/agency/media-planning/schedules" },
      { title: "Analytics", url: "/agency/buying/analytics" },
    ],
  },
  {
    title: "Buying",
    icon: TrendingUp,
    items: [
      { title: "Campaigns", url: "/agency/buying/campaigns" },
      { title: "My Orders", url: "/agency/marketplace/orders" },
    ],
  },
  {
    title: "Compliance",
    icon: ClipboardCheck,
    items: [
      { title: "Approvals", url: "/agency/compliance/approvals" },
      { title: "Reports", url: "/agency/compliance/reports" },
    ],
  },
  {
    title: "Billing",
    url: "/agency/billing",
    icon: CreditCard,
  },
  {
    title: "Reporting",
    url: "/agency/reporting",
    icon: FileText,
  },
];
