import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const teamMembers = [
  { name: "Ama Boateng", role: "Campaign Manager", email: "ama@company.com" },
  { name: "Kojo Mensah", role: "Planner", email: "kojo@company.com" },
  { name: "Naa Adjei", role: "Analyst", email: "naa@company.com" },
];

export default function TeamSettingsPage() {
  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Teams</h2>
        <p className="mt-1 text-sm text-gray-500">Invite team members, assign roles, and manage workspace access.</p>
      </div>

      <Card className="border border-violet-100">
        <CardHeader>
          <CardTitle className="text-primary">Invite Member</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input placeholder="Member email" className="input-field" />
          <Input placeholder="Role (e.g. Planner)" className="input-field" />
          <Button className="bg-primary text-white hover:bg-primary/90">Send Invite</Button>
        </CardContent>
      </Card>

      <Card className="border border-violet-100">
        <CardHeader>
          <CardTitle className="text-primary">Current Team</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {teamMembers.map((member) => (
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
