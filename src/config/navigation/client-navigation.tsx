import type { NavigationItem } from "@/types/index";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  CreditCard,
  BarChart3,
  Megaphone,
} from "lucide-react";

export const clientNavigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/client/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Marketplace",
    icon: ShoppingCart,
    items: [
      { title: "Browse Media", url: "/client/marketplace" },
      { title: "My Orders", url: "/client/marketplace/orders" },
    ],
  },{
    title: "Media Plans",
    icon: FileText,
    items: [
      { title: "Media Analysis", url: "/client/media-planning/media-analysis" },
      { title: "Planner", url: "/client/media-planning/create" },
      {title: "Schedules", url: "/client/media-planning/schedules"}
    ],

  },
  {
    title: "Campaigns",
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
