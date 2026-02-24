import {
  Users,
  ChevronDown,
  Settings,
  BarChart3,
  LogOut,
  Sun,
  Moon
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
// import { useAuthStore } from "@/features/auth/store/auth-store";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { toast } from "sonner";
import type { TenantBranding } from "@/config/tenant.config";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { getTenantPrefix } from "@/config/routes.config";

// Navigation items

interface AppSidebarProps {
  navigationItems: NavigationItem[];
  branding: TenantBranding;
}

export function AppSidebar({ navigationItems, branding }: AppSidebarProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  
  // Get tenant prefix for settings routes
  const tenantPrefix = user?.tenantType ? getTenantPrefix(user.tenantType) : '';
  
  const isActive = (url: string) => location.pathname === url;
  const isSubItemActive = (items?: { url?: string }[]) => {
    return items?.some(item => item.url && location.pathname === item.url);
  };

  const handleLogout = () => {
    toast.loading('Logging out...');
    logout();
  };

  return (
    <Sidebar className="bg-white border-r border-gray-200 rounded-l-md" >
      <SidebarHeader className="border-b border-gray-200">
        <div className="flex items-center gap-2 px-4 py-2">
          <div 
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: branding.logoColor }}
          >
            <BarChart3 
              className="w-5 h-5" 
              style={{ color: branding.accentColor }}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary">Media Marketplace</h2>
            <p className="text-xs text-accent">{branding.workspaceName}</p>
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
                  isActive={isActive(`${tenantPrefix}/settings/team`)}
                  className={isActive(`${tenantPrefix}/settings/team`) ? 'bg-secondary/50 font-medium' : ''}
                >
                  <Link to={`${tenantPrefix}/settings/team`}>
                    <Users className="w-4 h-4" />
                    <span>Team</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive(`${tenantPrefix}/settings/preferences`)}
                  className={isActive(`${tenantPrefix}/settings/preferences`) ? 'bg-secondary/50 font-medium' : ''}
                >
                  <Link to={`${tenantPrefix}/settings/preferences`}>
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
        <div className="flex items-start justify-between gap-4 px-2">
            {/* <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <span className="text-purple-700 font-semibold text-sm">
                  {getUserInitials()}
                </span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium text-primary truncate">
                  {user?.email || 'User'}
                </span>
                <span className="text-xs text-accent truncate">
                  {user?.roles?.[0] || 'Member'}
                </span>
              </div>
            </div> */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Logout"
              className="shrink-0 hover:bg-red-50 hover:text-red-600 w-2/3 justify-start"
            >
              <div className="flex items-center justify-center p-2 text-red-600 bg-red-50 rounded-full">
                <LogOut className="h-5 w-5" />
              </div>
              Logout
            </Button>
            <div className=" ">
              <Button variant="ghost" size="icon" className="shrink-0 hover:bg-gray-50">
                {/* Theme toggle - can be implemented later */}
                <div>
                <Sun className="h-5 w-5 hidden" />
                <Moon className="h-5 w-5" />
                </div>
              </Button>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
