import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import  { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMe } from "@/features/auth/hooks/useMe";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useEffect, useMemo } from "react";
import { getTenantConfig } from "@/config/tenant.config";

export function MainLayout() {
  const user = useAuthStore((state) => state.user);
  const { data: userData, isLoading, error } = useMe();

  // Get tenant-specific configuration
  const tenantConfig = useMemo(() => {
    return getTenantConfig(user?.tenantType);
  }, [user?.tenantType]);

  // Log for debugging
  useEffect(() => {
    console.log('MainLayout - User from store:', user);
    console.log('MainLayout - User from query:', userData);
    console.log('MainLayout - Loading:', isLoading);
    console.log('MainLayout - Error:', error);
    console.log('MainLayout - Tenant Config:', tenantConfig);
  }, [user, userData, isLoading, error, tenantConfig]);

  // Get user display name
  const getUserName = () => {
    if (!user) return "User";
    return `${user.firstName?.split('@')[0] || ""} ${user.lastName?.split('@')[0] || ""}`.trim() || "User";
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user?.email) return "U";
    const name = getUserName();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <SidebarProvider>
      <AppSidebar 
        navigationItems={tenantConfig.navigation}
        branding={tenantConfig.branding}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-none bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-6" />
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-primary">
                  Welcome, {getUserName()} 👋
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <div>
                    <Bell className="w-5 h-5 text-primary text-shadow-accent" />
                </div>
                <div className="flex items-center gap-1">
                    <Avatar className="bg-primary/50 w-10 h-10">
                        <AvatarImage src="/path/to/avatar.jpg" alt="User Avatar" />
                        <AvatarFallback className="text-white font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                    </Avatar>
                    <p className="hidden md:block lg:block font-semibold">
                      {user ? getUserName() : 'Loading...'}
                    </p>
                </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
