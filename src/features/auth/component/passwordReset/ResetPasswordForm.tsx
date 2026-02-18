import { useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import { LockKeyhole, User, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ResetPasswordFormData } from '../../types';
import { toast } from "sonner";

interface ResetPasswordFormProps {
    token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { control, handleSubmit, getValues, formState: { errors } } = useForm<ResetPasswordFormData>({
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = (data: ResetPasswordFormData) => {
        // console.log('Reset token:', token);
        // console.log('New password data:', data);
        // Add your password reset API call here with token and new password
        // Example: await resetPassword({ token, password: data.password });
        toast.success("Password reset successfully!");
        const resetData = {
            token,
            newPassword: data.password
        }
        console.log(resetData);
    }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 sm:px-10 lg:px-16 xl:px-20 py-8 overflow-y-auto">
        <div className="relative w-full max-w-120 mx-auto bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">
            {/* header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
            >
                <div className="w-16 h-16 bg-linear-to-br from-primary via-[#2D0A4E] to-[#3d1166] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <LockKeyhole className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-black mb-2 tracking-li">Reset Your Password</h1>
                <p className="text-black/50 mb-6">Enter your new password below.</p>
            </motion.div>

            {/* form */}
            <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <div className="block">
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: {value: true, message: 'Password is required'}, 
                            minLength: {value: 8, message: 'Password must be at least 8 characters'},
                            validate:{
                                containsUpperCase: (value) => /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
                                containsLowerCase: (value) => /[a-z]/.test(value) || 'Password must contain at least one lowercase letter',
                                containsNumber: (value) => /\d/.test(value) || 'Password must contain at least one number',
                                // containsSpecialChar: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Password must contain at least one special character',
                            
                            }
                        }}
                        render={({ field }) => (
                            <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#C8F526]">
                                <User className="w-6 h-6 text-accent"/>
                                <div className="relative w-full">
                                    <input
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="w-full focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 p-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        )}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>
                <div className="block">
                    <Controller
                        name="confirmPassword"
                        control={control}
                        rules={{
                            required: {value: true, message: 'Please confirm your password'}, 
                            validate: (value) => value === getValues('password') || 'Passwords do not match'
                        }}
                        render={({ field }) => (
                            <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#C8F526]">
                                <User className="w-6 h-6 text-accent"/>
                                <input
                                    {...field}
                                    type="password"
                                    placeholder="Confirm your password"
                                    className="w-full focus:outline-none"
                                />
                            </div>
                        )}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-linear-to-br bg-secondary font-semibold py-3 rounded-lg hover:bg-secondary transition-colors"
                >
                    Reset Password
                </button>
            </motion.form>
        </div>
    </div>
  )
}

