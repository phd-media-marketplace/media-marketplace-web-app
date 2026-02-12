import { useSearchParams, Navigate } from 'react-router-dom';
import ResetPasswordForm from '../component/passwordReset/ResetPasswordForm';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // If no token is present, redirect to forgot password page
  if (!token) {
    return <Navigate to="/forget-password" replace />;
  }

  return (
    <div className="w-full h-full bg-linear-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center px-6 sm:px-10 lg:px-16 xl:px-20 py-8 overflow-y-auto">
      <ResetPasswordForm token={token} />
    </div>
  );
}
