import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/features/auth/store/auth-store";
import {Controller, useForm} from "react-hook-form"
import type { UserProfile } from "../types";
import { formatRole } from "@/utils/formatters";
import { 
    Avatar, 
    AvatarBadge,
    AvatarFallback,
    AvatarImage, 
} from "@/components/ui/avatar";
import { Camera, Save,} from "lucide-react";

export default function UserProfileCard() {
    const { firstName, lastName, email, tenantId, tenantName, roles, phoneNumber, profilePictureUrl } = useAuthStore((state) => state.user) ?? {};

    const { control, handleSubmit } = useForm<UserProfile>({
    defaultValues: {
            firstName: firstName ?? "",
            lastName: lastName ?? "",
            email: email ?? "",
            tenantId: tenantId ?? "",
            tenantName: tenantName ?? "",
            roles: roles ?? [],
            phoneNumber: phoneNumber ?? "",
            profilePictureUrl: profilePictureUrl ?? "",
    },
  });

  return (
    <Card className="border border-violet-100">
            <CardHeader>
                <CardTitle className="text-primary text-2xl font-bold">User Profile</CardTitle>
                <p className="text-sm text-slate-500">Manage your personal details and contact information.</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit((data) => console.log(data))} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2 flex items-center gap-4 rounded-xl border border-primary/15 bg-primary/5 p-4">
                        <Avatar className="h-24 w-24 overflow-visible border-4 border-white shadow-lg ring-2 ring-primary/20">
                            <AvatarImage src={profilePictureUrl} alt={`${firstName} ${lastName}`} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                                {firstName?.charAt(0)}{lastName?.charAt(0)}
                            </AvatarFallback>
                            <AvatarBadge className="size-8! -bottom-1 -right-1 rounded-full bg-primary ring-2 ring-white [&>svg]:size-4!">
                                <Camera className="text-white" />
                            </AvatarBadge>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="truncate text-base font-semibold text-slate-900">{firstName} {lastName}</p>
                            <p className="truncate text-sm text-slate-500">{email || "No email"}</p>
                            <p className="mt-1 text-xs text-primary/80">Profile photo coming soon</p>
                        </div>
                    </div>
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <label className="mb-1 block text-sm font-medium text-primary">First Name</label>
                                <Input 
                                    value={field.value || ""} 
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="input-field" 
                                    />
                            </div>
                        )}
                    />
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <label className="mb-1 block text-sm font-medium text-primary">Last Name</label>
                                <Input 
                                    value={field.value || ""} 
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="input-field" 
                                />
                            </div>
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-primary">Email</label>
                                <Input 
                                    value={field.value || ""} 
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="input-field" 
                                />
                            </div>
                        )}
                    />
                    <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                            <div className="">
                                <label className="mb-1 block text-sm font-medium text-primary">Phone Number</label>
                                <Input 
                                    value={field.value || ""} 
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="input-field" 
                                />
                            </div>
                        )}
                    />
                    <Controller
                        name="tenantName"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <label className="mb-1 block text-sm font-medium text-primary">Tenant Name</label>
                                <Input 
                                    value={field.value || "N/A"}
                                    className="input-field cursor-not-allowed bg-slate-50 text-slate-700"
                                    readOnly
                                />
                            </div>
                        )}
                    />
                    <Controller
                        name="roles"
                        control={control}
                        render={({ field }) => (
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-primary">Roles</label>
                                <div className="flex min-h-10 flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                                    {(field.value ?? []).length > 0 ? (
                                        (field.value ?? []).map((role) => (
                                            <Badge key={role} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">
                                                {formatRole(role)}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-slate-500">No role assigned</span>
                                    )}
                                </div>
                            </div>
                        )}
                    />
                </form>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-slate-100 px-6 py-4">
                <Button 
                    className="bg-primary text-white hover:bg-primary/90" 
                    onClick={handleSubmit((data) => console.log(data))}
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </CardFooter>
          </Card>
  )
}
