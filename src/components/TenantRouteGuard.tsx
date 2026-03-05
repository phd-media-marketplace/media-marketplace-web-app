import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { getTenantPrefix } from '@/config/routes.config';

/**
 * TenantRouteGuard ensures users are redirected to their tenant-specific routes
 * after successful authentication
 */
export function TenantRouteGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user && user.tenantType) {
      const tenantPrefix = getTenantPrefix(user.tenantType);
      const currentPath = location.pathname;

      // If user is on root or a non-tenant-prefixed route after login
      // Redirect to their tenant-specific dashboard
      if (currentPath === '/' || currentPath === '') {
        navigate(`${tenantPrefix}/dashboard`, { replace: true });
      }
      // If user is accessing a different tenant's routes, redirect to their own
      else if (!currentPath.startsWith(tenantPrefix) && !currentPath.startsWith('/unauthorized')) {
        // Check if it's a tenant route for another tenant
        const tenantPrefixes = ['/agency', '/client', '/media-partner'];
        const isOtherTenantRoute = tenantPrefixes.some(prefix => currentPath.startsWith(prefix));
        
        if (isOtherTenantRoute) {
          navigate(`${tenantPrefix}/dashboard`, { replace: true });
        }
      }
    }
  }, [user, navigate, location]);

  return null;
}
