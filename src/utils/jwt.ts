import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    sub: string;
    email: string;
    tenantId: string;
    roles: string[];
    permissions: string[];
    exp: number;
}

export const decodeToken = (token: string): JwtPayload | null => {
    try {
        return jwtDecode<JwtPayload>(token);
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}