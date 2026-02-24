import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth-store";

interface ProtectedRouteProps {
    allowedRoles?: string[]; // Optional prop to specify allowed roles for this route
    allowedTenantTypes?: string[]; // Optional prop to specify allowed tenant types for this route
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, allowedTenantTypes }: ProtectedRouteProps) => {
    const user = useAuthStore((state) => state.user);
    const token = localStorage.getItem('accessToken');
    
    // check if user is authenticated
    if (!token) {
        return <Navigate to="/" replace />;
    }
    // If allowedRoles is provided, check if the user has at least one of the required roles
    if (allowedRoles && allowedRoles.length > 0 && user) {
        const hasAccess = allowedRoles.some(role => user.roles.includes(role));
        if (!hasAccess) {
            return <Navigate to="/unauthorized" replace />;
        }   
    }
    // If allowedTenantTypes is provided, check if the user's tenant type is allowed
    if (allowedTenantTypes && allowedTenantTypes.length > 0 && user) {
        const hasAccess = allowedTenantTypes.includes(user.tenantType);
        if (!hasAccess) {
            return <Navigate to="/unauthorized" replace />;
        }
    }
    return <Outlet />;
}