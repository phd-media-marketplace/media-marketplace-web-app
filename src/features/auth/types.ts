import type { MediaType, TenantType } from "@/types/api";

export interface User {
    id: string;
    userID: string;
    email: string;
    phoneNumber?: string;
    profilePictureUrl?: string;
    firstName: string;
    lastName: string;
    tenantId: string;
    tenantName: string;
    tenantType: "MEDIA_PARTNER" | "AGENCY" | "CLIENT";
    mediaType: "TV" | "RADIO" | "TV_RADIO" | "OOH" | "DIGITAL";
    roles: string[];
    permissions: string[];
    mediaPartner: {
        id: string;
        name: string;
        type: string | null;
        code: string | null;
        isActive: boolean;
        isShared: false
    }
}

export interface LogInFormData {
    email: string;
    password: string;
}

export interface AgencyOrIndividualFormData extends LogInFormData {
    firstName: string;
    lastName: string;
    tenantName: string; // ie, organizationName
    tenantSlug?: string;
    tenantType: TenantType 
    phoneNumber?: string;
}

export interface MediaPartnerFormData extends AgencyOrIndividualFormData {
    mediaType: MediaType; // which media type(s) the partner specializes in
}

export interface ForgetPasswordFormData {
    email: string;
}

export interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}

export  interface ChangePasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface LogOutData {
    userID: string;
    email: string;
    tenantId: string;
    roles: string[];
    permissions: string[];
}