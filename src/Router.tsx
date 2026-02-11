import {createBrowserRouter } from 'react-router-dom';
import Login from './features/auth/Pages/Login';
import SignUp from './features/auth/Pages/SignUp';
import RegisterNewTenant from './features/auth/Pages/RegisterNewTenant';
import ForgetPassword from './features/auth/Pages/ForgetPassword';
import ResetPassword from './features/auth/Pages/ResetPassword';

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