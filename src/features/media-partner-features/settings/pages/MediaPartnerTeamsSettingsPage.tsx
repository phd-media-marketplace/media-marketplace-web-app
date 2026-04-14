import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const members = [
  { name: "Grace Ofori", role: "Sales Lead", email: "grace@mediapartner.com" },
  { name: "Kofi Nkrumah", role: "Operations", email: "kofi@mediapartner.com" },
  { name: "Yaw Asare", role: "Finance", email: "yaw@mediapartner.com" },
];

export default function MediaPartnerTeamsSettingsPage() {
  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Teams</h2>
        <p className="mt-1 text-sm text-gray-500">Manage internal team members and their access levels.</p>
      </div>

      <Card className="border border-violet-100">
        <CardHeader><CardTitle className="text-primary">Invite Team Member</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input placeholder="Team member email" className="input-field" />
          <Input placeholder="Role" className="input-field" />
          <Button className="bg-primary text-white hover:bg-primary/90">Send Invite</Button>
        </CardContent>
      </Card>

      <Card className="border border-violet-100">
        <CardHeader><CardTitle className="text-primary">Current Team</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {members.map((member) => (
            <div key={member.email} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div>
                <p className="font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">{member.email}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{member.role}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
