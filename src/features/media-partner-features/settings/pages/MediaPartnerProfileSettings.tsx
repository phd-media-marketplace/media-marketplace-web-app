import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import UserProfileCard from "../component/UserProfileCard";
import CompanyProfile from "../component/CompanyProfile";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, UserCircle2, Building2 } from "lucide-react";
import Header from "@/components/universal/Header";

type ProfileSettingsTab = "user-profile" | "company-profile";
const TAB_PARAM_KEY = "tab";

export default function MediaPartnerProfileSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();

  const canViewCompanyProfile = useMemo(() => {
    const roles = user?.roles ?? [];
    const isTenantAdmin = roles.includes("TENANT_ADMIN");
    return isTenantAdmin && Boolean(user?.mediaPartner);
  }, [user?.mediaPartner, user?.roles]);

  const requestedTab = searchParams.get(TAB_PARAM_KEY);
  const resolvedActiveTab: ProfileSettingsTab =
    requestedTab === "company-profile" && canViewCompanyProfile ? "company-profile" : "user-profile";

  const setActiveTab = (tab: ProfileSettingsTab) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(TAB_PARAM_KEY, tab);
      return next;
    }, { replace: true });
  };

  return (
    <div className="space-y-6 pb-10">
      <Header
        title="Profile "
        description="Manage your media partner profile and business details."
        backbtnVisible={false}
      />

      <Tabs value={resolvedActiveTab} onValueChange={(value) => setActiveTab(value as ProfileSettingsTab)} className="space-y-6">
        <TabsList className="inline-flex h-auto rounded-xl border border-primary/15 bg-white p-1 shadow-sm">
          <TabsTrigger value="user-profile" className="gap-2 rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <UserCircle2 className="h-4 w-4" />
            User Profile
          </TabsTrigger>
          {canViewCompanyProfile ? (
            <TabsTrigger value="company-profile" className="gap-2 rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Building2 className="h-4 w-4" />
              Company Profile
            </TabsTrigger>
          ) : null}
        </TabsList>

        <TabsContent value="user-profile" className="mt-0">
          <UserProfileCard />
        </TabsContent>

        {canViewCompanyProfile ? (
          <TabsContent value="company-profile" className="mt-0">
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              Company profile is visible because you are a tenant admin and your account is linked to a media partner.
            </div>
            <CompanyProfile />
          </TabsContent>
        ) : null}
      </Tabs>
    </div>
  );
}
