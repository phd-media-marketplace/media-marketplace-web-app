import type { NavigationItem } from "@/types/index";
import {
  LayoutDashboard,
  Package,
  FileText,
  DollarSign,
  BarChart3,
  Radio,
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
    title: "Inventory",
    icon: Package,
    items: [
      { title: "All Inventory", url: "/media-partner/inventory/all" },
      { title: "Add New", url: "/media-partner/inventory/add" },
      { title: "Availability", url: "/media-partner/inventory/availability" },
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
    title: "Media Management",
    icon: Radio,
    items: [
      { title: "Channels", url: "/media-partner/media/channels" },
      { title: "Programs", url: "/media-partner/media/programs" },
    ],
  },
  {
    title: "Revenue",
    url: "/media-partner/revenue",
    icon: DollarSign,
  },
  {
    title: "Analytics",
    url: "/media-partner/analytics",
    icon: BarChart3,
  },
];
