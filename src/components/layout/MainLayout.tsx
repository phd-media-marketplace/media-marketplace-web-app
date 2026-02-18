import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import  { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-none bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-6" />
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-primary">Welcome, John 👋</h1>
            </div>
            <div className="flex items-center gap-4">
                <div>
                    <Bell className="w-5 h-5 text-primary text-shadow-accent" />
                </div>
                <div className="flex items-center gap-1">
                    <Avatar className="bg-primary/50 w-10 h-10">
                        <AvatarImage src="/path/to/avatar.jpg" alt="User Avatar" />
                        <AvatarFallback className="text-white font-semibold">JD</AvatarFallback>
                    </Avatar>
                    <p className="hidden md:block lg:block font-semibold">John Doe</p>
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
