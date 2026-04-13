import type { NavigationItem } from "@/types/index";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  CreditCard,
  BarChart3,
  Megaphone,
  FileCheck,
} from "lucide-react";

export const clientNavigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/client/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Marketplace",
    url: "/client/marketplace",
    icon: ShoppingCart,
  },{
    title: "Media Planning",
    icon: FileText,
    items: [
      { title: "Media Analysis", url: "/client/media-planning/media-analysis" },
      { title: "Media Planner", url: "/client/media-planning/create" },
      { title: "My Plans", url: "/client/media-planning/plans" },
      // { title: "Schedules", url: "/client/media-planning/schedules" }
    ],

  },
  {    title: "Work Orders",
    url: "/client/work-orders",
    icon: FileCheck,
  },
  {    title: "Campaigns",
    icon: Megaphone,
    url: "/client/campaigns",
  },
  {
    title: "Reports",
    url: "/client/reporting",
    icon: BarChart3,
  },
  {
    title: "Billing",
    url: "/client/billing",
    icon: CreditCard,
  },
];
