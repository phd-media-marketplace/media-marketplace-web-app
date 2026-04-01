import type { NavigationItem } from "@/types/index";
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  BarChart3,
  CreditCard,
  Package,
  FileCheck,
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
  {    title: "Orders",
    icon: FileText,
    items: [
      { title: "All Orders", url: "/media-partner/work-orders" },
      // { title: "Pending", url: "/media-partner/orders/pending" },
      // { title: "Active", url: "/media-partner/orders/active" },
      // { title: "Completed", url: "/media-partner/orders/completed" },
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
