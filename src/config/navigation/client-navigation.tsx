import type { NavigationItem } from "@/types/index";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  CreditCard,
  BarChart3,
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
      { title: "Browse Media", url: "/client/marketplace/browse" },
      { title: "My Orders", url: "/client/marketplace/orders" },
    ],
  },
  {
    title: "Campaigns",
    icon: FileText,
    items: [
      { title: "Active", url: "/client/campaigns/active" },
      { title: "Archived", url: "/client/campaigns/archived" },
    ],
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
