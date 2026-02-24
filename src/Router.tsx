import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import ForgetPassword from './features/auth/pages/ForgetPassword';
import ResetPassword from './features/auth/pages/ResetPassword';
import { MainLayout } from './components/layout/MainLayout';
import AgencyOrIndividualRegister from './features/auth/pages/AgencyOrIndividualRegister';
import MediaPartnerRegister from './features/auth/pages/MediaPartnerRegister';
import { ProtectedRoute } from './components/ProtectedRoute';
import { tenantRoutes } from './config/routes.config';
import { TenantRouteGuard } from './components/TenantRouteGuard';
import type { TenantType } from './types/api';

// Helper function to create tenant-specific protected routes
function createTenantRoutes(tenantType: TenantType): RouteObject[] {
  const routes = tenantRoutes[tenantType];
  
  return routes.map((route) => ({
    path: route.path,
    element: <ProtectedRoute allowedRoles={route.roles} allowedTenantTypes={[tenantType]} />,
    children: [
      {
        index: true,
        element: route.element
      }
    ]
  } as RouteObject));
}

export const router = createBrowserRouter([
    // Public auth routes (no sidebar, no protection)
    {
        path: '/',
        element: <Login />
    },
    {
        path: '/register-media-partner',
        element: <MediaPartnerRegister />
    },
    {
        path: '/register-agency-or-individual',
        element: <AgencyOrIndividualRegister />
    },
    {
        path: '/forget-password',
        element: <ForgetPassword/>
    },
    {
        path: '/reset-password',
        element: <ResetPassword/>
    },
    {
        path: '/unauthorized',
        element: <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Unauthorized</h1>
                <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
            </div>
        </div>
    },
    // Protected app routes with tenant prefixes
    {
        element: (
            <>
                <TenantRouteGuard />
                <MainLayout />
            </>
        ),
        children: [
            // Agency routes
            ...createTenantRoutes('AGENCY'),
            // Client routes
            ...createTenantRoutes('CLIENT'),
            // Media Partner routes
            ...createTenantRoutes('MEDIA_PARTNER'),
        ]
    }
]);