import type { NavigationItem } from "@/types/index";
import {
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  FileText,
  CreditCard,
  ClipboardCheck,
  Package,
  FileCheck,
  BarChart3,
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
      { title: "Packages", url: "/agency/packages" },
    ],
  },
  {
    title: "Planning",
    icon: FileText,
    items: [
      { title: "Create Plan", url: "/agency/media-planning/create" },
      { title: "My Plans", url: "/agency/media-planning/plans" },
      { title: "View Schedules", url: "/agency/media-planning/schedules" },
      { title: "Analytics", url: "/agency/buying/analytics" },
    ],
  },
  {
    title: "Work Orders",
    url: "/agency/work-orders",
    icon: FileCheck,
  },
  {
    title: "Campaigns",
    url: "/agency/campaigns",
    icon: BarChart3,
  },
  {
    title: "Buying",
    icon: TrendingUp,
    items: [
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
