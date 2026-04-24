import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Mail, ShieldCheck, UserPlus } from "lucide-react";
import { useEffect } from "react";

export interface InviteTeamMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (email: string, role: string) => void;
    inviteRoleOptions: { label: string; value: string }[];
    mode?: "invite" | "edit";
    initialValues?: InviteTeamMemberFormData;
    emailDisabled?: boolean;
    title?: string;
    description?: string;
    submitLabel?: string;
}
export interface InviteTeamMemberFormData {
    email: string;
    role: string;
}

// const INVITE_ROLE_OPTIONS = [
//     { label: "Admin", value: "ADMIN" },
//     { label: "Campaign Manager", value: "CAMPAIGN_MANAGER" },
//     { label: "Analyst", value: "ANALYST" },
//     { label: "Viewer", value: "VIEWER" },
// ];

export default function InviteTeamMemberDialog({
    open,
    onOpenChange,
    onSubmit,
    inviteRoleOptions,
    mode = "invite",
    initialValues,
    emailDisabled = false,
    title,
    description,
    submitLabel,
}: InviteTeamMemberDialogProps) {
    const resolvedTitle = title ?? (mode === "edit" ? "Edit Team Member" : "Invite Team Member");
    const resolvedDescription =
        description ??
        (mode === "edit"
            ? "Update this team member's details and access role."
            : "Send an invite to onboard someone into your media partner workspace.");
    const resolvedSubmitLabel = submitLabel ?? (mode === "edit" ? "Save Changes" : "Send Invite");

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<InviteTeamMemberFormData>({
        defaultValues: {
            email: "",
            role: "VIEWER",
        },
    });

    useEffect(() => {
        if (!open) {
            return;
        }

        reset({
            email: initialValues?.email ?? "",
            role: initialValues?.role ?? "VIEWER",
        });
    }, [initialValues?.email, initialValues?.role, open, reset]);

    const handleInvite = (email: string, role: string) => {
        onSubmit(email, role);
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    reset();
                }
                onOpenChange(nextOpen);
            }}

        >
            <DialogContent className="gap-0 overflow-hidden rounded-2xl border border-primary/10 bg-linear-to-b from-white to-slate-50/60 p-0 sm:max-w-xl">
                <DialogHeader className="bg-white/90 px-6 py-4 text-left">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <UserPlus className="h-5 w-5" />
                    </div>
                    <DialogTitle className="text-xl font-semibold text-slate-900">{resolvedTitle}</DialogTitle>
                    <DialogDescription className="max-w-md text-sm text-slate-600">
                        {resolvedDescription}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit((data: InviteTeamMemberFormData) => handleInvite(data.email, data.role))}
                    className="space-y-5 px-6 pt-3 pb-4"
                >
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-800">Email Address</label>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter a valid email address",
                                },
                            }}
                            render={({ field }) => (
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        type="email"
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        placeholder="name@company.com"
                                        className="filter-input-field"
                                        disabled={emailDisabled}
                                    />
                                </div>
                            )}
                        />
                        {errors.email ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-800">Role</label>
                        <Controller
                            name="role"
                            control={control}
                            rules={{ required: "Role is required" }}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full input-field">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-none">
                                        {inviteRoleOptions.map((roleOption) => (
                                            <SelectItem key={roleOption.value} value={roleOption.value}>
                                                {roleOption.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.role ? <p className="text-xs text-red-600">{errors.role.message}</p> : null}
                    </div>

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            Invited members get email instructions and can be managed anytime from settings.
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" className="rounded-lg border-red-500 text-red-500 hover:bg-red-100" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="rounded-lg bg-primary text-white hover:bg-primary/90" disabled={isSubmitting}>
                            {resolvedSubmitLabel}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
