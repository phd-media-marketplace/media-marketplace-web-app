import {
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  FileText,
  CreditCard,
  Settings,
  Users,
  ChevronDown,
  BarChart3,
  LogOut,
  Sun, Moon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Link, useLocation } from "react-router-dom";
import type { NavigationItem } from "../../types/index"
import { Button } from "@/components/ui/button";

// Navigation items
const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Marketplace",
    icon: ShoppingCart,
    items: [
      { title: "Browse Media", url: "/marketplace/browse" },
      { title: "My Orders", url: "/marketplace/orders" },
    ],
  },
  {
    title: "Buying",
    icon: TrendingUp,
    items: [
      { title: "Campaigns", url: "/buying/campaigns" },
      { title: "Analytics", url: "/buying/analytics" },
    ],
  },
  {
    title: "Planning",
    icon: FileText,
    items: [
      { title: "Media Plans", url: "/planning/plans" },
      { title: "Schedule", url: "/planning/schedule" },
    ],
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
  {
    title: "Reporting",
    url: "/reporting",
    icon: FileText,
  },
];

export function AppSidebar() {
  const location = useLocation();
  
  const isActive = (url: string) => location.pathname === url;
  const isSubItemActive = (items?: { url?: string }[]) => {
    return items?.some(item => item.url && location.pathname === item.url);
  };

  return (
    <Sidebar className="bg-white border-r border-gray-200 rounded-l-md" >
      <SidebarHeader className="border-b border-gray-200">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="w-9 h-9 rounded-lg bg-[#C8F526] flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-[#2D0A4E]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary">Media Marketplace</h2>
            {/* Agency name should be dynamic */}
            <p className="text-xs text-accent">Agency Workspace</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-accent">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible defaultOpen className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          className={`text-primary ${isSubItemActive(item.items) ? 'bg-secondary/30' : ''}`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="text-gray-700">
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild
                                isActive={isActive(subItem.url!)}
                                className={isActive(subItem.url!) ? 'bg-secondary/50 text-primary font-medium' : ''}
                              >
                                <Link to={subItem.url!}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.url!)}
                      className={`text-primary ${isActive(item.url!) ? 'bg-secondary/50 font-medium' : ''}`}
                    >
                      <Link to={item.url!}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-accent">Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive('/settings/team')}
                  className={isActive('/settings/team') ? 'bg-secondary/50 font-medium' : ''}
                >
                  <Link to="/settings/team">
                    <Users className="w-4 h-4" />
                    <span>Team</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive('/settings/preferences')}
                  className={isActive('/settings/preferences') ? 'bg-secondary/50 font-medium' : ''}
                >
                  <Link to="/settings/preferences">
                    <Settings className="w-4 h-4" />
                    <span>Preferences</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="h-20 border-t border-gray-200">
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-700 font-semibold text-xs"><LogOut/></span>
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium">Log Out</span>
            </div>
            </div>
            <Button variant="ghost" size="icon" aria-label="Toggle theme">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
