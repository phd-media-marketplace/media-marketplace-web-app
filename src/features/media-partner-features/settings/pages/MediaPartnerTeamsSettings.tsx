import { useCallback, useMemo, useState } from "react";
import { Edit, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import InviteTeamMemberDialog from "@/components/universal/InviteTeamMemberDialog";
import Header from "@/components/universal/Header";
import { toast } from "sonner";
import type { TeamMember } from "../types";
import { DataTable, type UniversalDataTableColumn } from "@/components/universal/DataTable";
import NoDataCard from "@/components/universal/NoDataCard";

const INITIAL_MEMBERS: TeamMember[] = [
  { firstName: "Grace", lastName: "Ofori", role: "Admin", email: "grace@mediapartner.com", status: "ACTIVE" },
  { firstName: "Kofi", lastName: "Nkrumah", role: "Sales Associate", email: "kofi@mediapartner.com", status: "ACTIVE" },
  { firstName: "Yaw", lastName: "Asare", role: "Finance", email: "yaw@mediapartner.com", status: "INACTIVE" },
];

const INVITE_ROLE_OPTIONS = [
  { label: "Admin", value: "ADMIN" },
  { label: "Sales Associate", value: "SALES_ASSOCIATE" },
  { label: "Finance", value: "FINANCE" },
];

const STATUS_STYLES: Record<TeamMember["status"], string> = {
  ACTIVE: "bg-green-300 text-green-900 border-green-200",
  INACTIVE: "bg-red-100 text-red-700 border-red-200",
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
};

function toNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "";
  const normalized = localPart
    .replace(/[._-]+/g, " ")
    .trim();
  const words = normalized.length > 0 ? normalized.split(/\s+/) : ["New", "Member"];
  const firstName = words[0]?.charAt(0).toUpperCase() + (words[0]?.slice(1) ?? "");
  const lastName = words[1]?.charAt(0).toUpperCase() + (words[1]?.slice(1) ?? "");

  return {
    firstName: firstName || "New",
    lastName: lastName || "Member",
  };
}

export default function MediaPartnerTeamsSettingsPage() {
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);

  const roleLabelByValue = useMemo(
    () =>
      INVITE_ROLE_OPTIONS.reduce<Record<string, string>>((acc, option) => {
        acc[option.value] = option.label;
        return acc;
      }, {}),
    [],
  );

  const roleValueByLabel = useMemo(
    () =>
      INVITE_ROLE_OPTIONS.reduce<Record<string, string>>((acc, option) => {
        acc[option.label] = option.value;
        return acc;
      }, {}),
    [],
  );

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return members;
    }

    return members.filter((member) => {
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      return (
        fullName.includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.status.toLowerCase().includes(query)
      );
    });
  }, [members, searchQuery]);

  const handleInvite = (email: string, role: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const duplicate = members.some((member) => member.email.toLowerCase() === normalizedEmail);

    if (duplicate) {
      toast.error("This team member already exists.");
      return;
    }

    const { firstName, lastName } = toNameFromEmail(normalizedEmail);
    const newMember: TeamMember = {
      firstName,
      lastName,
      email: normalizedEmail,
      role: roleLabelByValue[role] ?? role,
      status: "PENDING",
    };

    setMembers((prev) => [newMember, ...prev]);
    toast.success(`Invitation sent to ${normalizedEmail}.`);
  };

  const toggleMemberStatus = (email: string) => {
    setMembers((prev) =>
      prev.map((member) => {
        if (member.email !== email) {
          return member;
        }

        if (member.status === "PENDING") {
          return { ...member, status: "ACTIVE" };
        }

        return {
          ...member,
          status: member.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
        };
      }),
    );
  };

  const openMemberEditDialog = useCallback((member: TeamMember) => {
    setEditingMember(member);
    setOpenEditDialog(true);
  }, []);

  const handleEditMember = (email: string, role: string) => {
    if (!editingMember) {
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const duplicate = members.some(
      (member) =>
        member.email.toLowerCase() === normalizedEmail &&
        member.email.toLowerCase() !== editingMember.email.toLowerCase(),
    );

    if (duplicate) {
      toast.error("Another team member already uses this email.");
      return;
    }

    setMembers((prev) =>
      prev.map((member) =>
        member.email === editingMember.email
          ? {
              ...member,
              email: normalizedEmail,
              role: roleLabelByValue[role] ?? role,
            }
          : member,
      ),
    );

    setOpenEditDialog(false);
    setEditingMember(null);
    toast.success("Team member updated successfully.");
  };

  const handleDeactivateMember = useCallback((email: string) => {
    toggleMemberStatus(email);
    toast.success(`Team member ${members.find((m) => m.email === email)?.status === "ACTIVE" ? "deactivated" : "activated"} successfully.`);
  }, [members]);

  const teamTableColumns = useMemo<UniversalDataTableColumn<TeamMember>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        cell: (member) => (
            <span className="font-medium text-slate-900">{`${member.firstName} ${member.lastName}`}</span>
        ),
        widthPx: 280,
        minWidthPx: 220,
        widthClassName: "w-70",
        minWidthClassName: "min-w-56",
        sticky: true,
        headerClassName: "px-0 pl-4 pr-3",
        cellClassName: "px-0 pl-4 pr-3",
      },
      {
        id: "email",
        header: "Email",
        cell: (member) => <span className="text-sm text-slate-700">{member.email}</span>,
        widthPx: 200,
        minWidthPx: 170,
        widthClassName: "w-50",
        minWidthClassName: "min-w-36",
      },
      {
        id: "role",
        header: "Role",
        cell: (member) => <span className="text-sm text-slate-700">{member.role}</span>,
        widthPx: 170,
        minWidthPx: 140,
        widthClassName: "w-42",
        minWidthClassName: "min-w-36",
      },
      {
        id: "status",
        header: "Status",
        cell: (member) => (
          <Badge
            variant="outline"
            className={`rounded-md border px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[member.status]}`}
          >
            {member.status}
          </Badge>
        ),
        widthPx: 140,
        minWidthPx: 120,
        widthClassName: "w-35",
        minWidthClassName: "min-w-30",
      },
      {
        id: "actions",
        header: "Actions",
        headerAlign: "center",
        cell: (member) => (
          <div className="flex items-center justify-evenly gap-2">
            <div className="flex items-center justify-center">
                <Button
                type="button"
                variant="ghost"
                size="sm"
                className={`h-8 rounded-md border ${member.status === "ACTIVE" ? "text-red-500 hover:bg-red-100 border-red-200" : "text-green-500 hover:bg-green-100 border-green-200"}`}
                onClick={() => handleDeactivateMember(member.email)}
                >
                {member.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </Button>
            </div>
            <div className="flex items-center justify-center">
                <Button
                type="button"
                variant="default"
                size="sm"
                className="h-8 rounded-md text-white hover:bg-primary/10 border-primary/20"
                onClick={() => openMemberEditDialog(member)}
                >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                </Button>
            </div>
          </div>
        ),
        widthPx: 220,
        minWidthPx: 180,
        widthClassName: "w-56",
        minWidthClassName: "min-w-44",
      },
    ],
    [handleDeactivateMember, openMemberEditDialog],
  );

  const headerSlot = (
    <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-slate-800">Team Members</h3>
        <Badge variant="outline" className="text-xs">
          {filteredMembers.length}
        </Badge>
      </div>

      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by name, email, role..."
          className="filter-input-field"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      <Header
        title="Teams"
        description="Manage your internal team members and their access levels."
        backbtnVisible={false}
        ctaIcon={Plus}
        ctabtnText="Add Team Member"
        ctaFunc={() => setOpenInviteDialog(true)}
      />

      <InviteTeamMemberDialog
        open={openInviteDialog}
        onOpenChange={setOpenInviteDialog}
        onSubmit={handleInvite}
        inviteRoleOptions={INVITE_ROLE_OPTIONS}
        mode="invite"
      />

      <InviteTeamMemberDialog
        open={openEditDialog}
        onOpenChange={(nextOpen) => {
          setOpenEditDialog(nextOpen);
          if (!nextOpen) {
            setEditingMember(null);
          }
        }}
        onSubmit={handleEditMember}
        inviteRoleOptions={INVITE_ROLE_OPTIONS}
        mode="edit"
        title="Edit Team Member"
        description="Adjust team member access and email details."
        submitLabel="Save Changes"
        initialValues={{
          email: editingMember?.email ?? "",
          role: editingMember ? roleValueByLabel[editingMember.role] ?? editingMember.role : "",
        }}
      />
        <div>
          <DataTable
            rows={filteredMembers}
            columns={teamTableColumns}
            rowKey={(member) => member.email}
            containerClassName="overflow-hidden rounded-xl border border-slate-200 bg-white"
            headerSlot={headerSlot}
            minTableWidthClassName="min-w-220"
            emptyState={
              <NoDataCard
                title="No team members yet"
                message="Invite team members to collaborate on your media partner account."
                btnText="Invite Team Member"
                redirectFunc={() => setOpenInviteDialog(true)}
                className="mx-auto max-w-xl"
              />
            }
          />
        </div>
        
    </div>
  );
}
