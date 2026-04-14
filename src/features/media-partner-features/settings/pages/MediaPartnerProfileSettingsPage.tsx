import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth-store";

export default function MediaPartnerProfileSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [businessName, setBusinessName] = useState(user?.tenantName || "");
  const [businessBio, setBusinessBio] = useState("");

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Profile</h2>
        <p className="mt-1 text-sm text-gray-500">Manage your media partner profile and business details.</p>
      </div>

      <Card className="border border-violet-100">
        <CardHeader><CardTitle className="text-primary">User Profile</CardTitle></CardHeader>
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
            <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="input-field" />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-violet-100">
        <CardHeader><CardTitle className="text-primary">Business Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-primary">Business Name</label>
            <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-primary">Business Description</label>
            <Textarea value={businessBio} onChange={(e) => setBusinessBio(e.target.value)} rows={4} className="input-field resize-none" />
          </div>
          <Button className="bg-primary text-white hover:bg-primary/90">Save Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
