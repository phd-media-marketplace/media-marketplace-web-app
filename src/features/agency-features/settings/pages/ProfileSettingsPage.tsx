import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/features/auth/store/auth-store";

export default function ProfileSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [companyName, setCompanyName] = useState(user?.tenantName || "");
  const [companyDescription, setCompanyDescription] = useState("");

  const isTenantAdmin = useMemo(() => {
    const roles = user?.roles || [];
    return roles.includes("TENANT_ADMIN") || roles.includes("ADMIN");
  }, [user?.roles]);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Profile</h2>
        <p className="mt-1 text-sm text-gray-500">Update personal profile details and, if authorized, company profile information.</p>
      </div>

      <Card className="border border-violet-100">
        <CardHeader>
          <CardTitle className="text-primary">Personal Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-primary">First Name</label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-primary">Last Name</label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-primary">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
          </div>
          <div className="md:col-span-2">
            <Button className="bg-primary text-white hover:bg-primary/90">Save Personal Profile</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-violet-100">
        <CardHeader>
          <CardTitle className="text-primary">Company Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isTenantAdmin ? (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-primary">Company Name</label>
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-primary">Company Description</label>
                <Textarea
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Describe your company profile"
                />
              </div>
              <Button className="bg-primary text-white hover:bg-primary/90">Save Company Profile</Button>
            </>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Only tenant admins can edit company profile settings.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
