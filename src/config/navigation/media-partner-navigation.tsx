import type { NavigationItem } from "@/types/index";
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  BarChart3,
  CreditCard,
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
    title: "Orders",
    icon: FileText,
    items: [
      { title: "Pending", url: "/media-partner/orders/pending" },
      { title: "Active", url: "/media-partner/orders/active" },
      { title: "Completed", url: "/media-partner/orders/completed" },
    ],
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
];
