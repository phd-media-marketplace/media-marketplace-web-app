import {
  Users,
  ChevronDown,
  Settings,
  User,
  CreditCard,
  Clock3,
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
  const isMediaPartner = user?.tenantType === "MEDIA_PARTNER";
  
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
            <p className="text-xs text-accent">{user?.tenantName} Hub</p>
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
                          className={`text-primary ${isSubItemActive(item.items) ? 'bg-primary/20' : ''}`}
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
                                className={isActive(subItem.url!) ? 'bg-primary/30 text-primary font-medium' : ''}
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
                      className={`text-primary ${isActive(item.url!) ? 'bg-primary/30 font-medium' : ''}`}
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
                  isActive={isActive(`${tenantPrefix}/settings/profile`)}
                  className={isActive(`${tenantPrefix}/settings/profile`) ? 'bg-primary/50 font-medium' : ''}
                >
                  <Link to={`${tenantPrefix}/settings/profile`}>
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive(`${tenantPrefix}/settings/teams`)}
                  className={isActive(`${tenantPrefix}/settings/teams`) ? 'bg-primary/50 font-medium' : ''}
                >
                  <Link to={`${tenantPrefix}/settings/teams`}>
                    <Users className="w-4 h-4" />
                    <span>Teams</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive(isMediaPartner ? `${tenantPrefix}/settings/time-frames` : `${tenantPrefix}/settings/preferences`)}
                  className={isActive(isMediaPartner ? `${tenantPrefix}/settings/time-frames` : `${tenantPrefix}/settings/preferences`) ? 'bg-primary/50 font-medium' : ''}
                >
                  <Link to={isMediaPartner ? `${tenantPrefix}/settings/time-frames` : `${tenantPrefix}/settings/preferences`}>
                    {isMediaPartner ? <Clock3 className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                    <span>{isMediaPartner ? "Time Frames" : "Preferences"}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {!isMediaPartner && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(`${tenantPrefix}/settings/payment`)}
                    className={isActive(`${tenantPrefix}/settings/payment`) ? 'bg-primary/50 font-medium' : ''}
                  >
                    <Link to={`${tenantPrefix}/settings/payment`}>
                      <CreditCard className="w-4 h-4" />
                      <span>Payment</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="h-20 border-t border-gray-200">
        <div className="flex items-start justify-between gap-4 px-2">
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
