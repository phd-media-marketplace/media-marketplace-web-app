export interface LogInFormData {
    email: string;
    password: string;
}

export interface SignUpFormData extends LogInFormData {
    fName: string;
    lName: string;
    tenantSlug?: string;
    phoneNumber?: string;
}

export interface TentantRegistrationData {
    tenantName: string;
    tenantSlug: string;
    adminEmail: string;
    adminPassword: string;
    adminFName: string;
    adminLName: string;
    adminPhoneNumber?: string;
}

export interface ForgetPasswordFormData {
    email: string;
}

export interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}