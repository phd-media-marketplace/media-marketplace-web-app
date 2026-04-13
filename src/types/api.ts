
export type TenantType = 'AGENCY' | 'CLIENT' | 'MEDIA_PARTNER';
export type MediaType = "TV" | "RADIO" | "TV_RADIO" | "OOH" | "DIGITAL";

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    tenantName: string; 
    tenantSlug?: string;
    tenantType: TenantType 
    phoneNumber?: string;
    mediaType?: MediaType;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface ChangePassword {
    currentPassword: string;
    newPassword: string;
    userID: string;
    email: string;
    tenantId: string;
    roles: string[];
    permissions: string[];
}

export interface ForgotPasswordData {
    email: string;
}

export interface AuthResponse {
    user:{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        tenantId: string;
    };
    accesstoken: string;
    refreshToken: string;
}


export interface User {
    id: string;
    userID: string;
    email: string;
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
    