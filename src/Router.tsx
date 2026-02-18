import {createBrowserRouter } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import ForgetPassword from './features/auth/pages/ForgetPassword';
import ResetPassword from './features/auth/pages/ResetPassword';
import { MainLayout } from './components/layout/MainLayout';
import Dashboard from './features/agency-features/dashboard/pages/Dashboard';
import AgencyOrIndividualRegister from './features/auth/pages/AgencyOrIndividualRegister';
import MediaPartnerRegister from './features/auth/pages/MediaPartnerRegister';

export const router = createBrowserRouter([
    // Auth routes (no sidebar)
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
    // App routes (with sidebar)
    {
        path: '/dashboard',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            // Add more routes here as you build features
            // {
            //     path: 'marketplace/browse',
            //     element: <BrowseMarketplace />
            // },
        ]
    }
]);