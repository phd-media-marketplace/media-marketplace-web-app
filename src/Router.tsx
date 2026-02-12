import {createBrowserRouter } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import SignUp from './features/auth/pages/SignUp';
import RegisterNewTenant from './features/auth/pages/RegisterNewTenant';
import ForgetPassword from './features/auth/pages/ForgetPassword';
import ResetPassword from './features/auth/pages/ResetPassword';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />
    },
    {
        path: '/signup',
        element: <SignUp />
    },
    {
        path: '/register-tenant',
        element: <RegisterNewTenant />
    },
    {
        path: '/forget-password',
        element: <ForgetPassword/>
    },
    {
        path: '/reset-password',
        element: <ResetPassword/>
    }
]);