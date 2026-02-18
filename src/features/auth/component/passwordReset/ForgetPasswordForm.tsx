import { Controller, useForm } from 'react-hook-form';
import { LockKeyhole, User } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ForgetPasswordFormData } from '../../types';

export default function ForgetPasswordForm() {
    const { control, handleSubmit, formState: { errors } } = useForm<ForgetPasswordFormData>({
        defaultValues: {
            email: ''
        }
    });

    const onSubmit = (data: ForgetPasswordFormData) => {
        console.log(data);
        // Add your password reset logic here
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
                <h1 className="text-3xl font-bold text-black mb-2 tracking-li">Forgot Your Password?</h1>
                <p className="text-black/50 mb-6">Enter your email to receive a password reset link.</p>
            </motion.div>

            {/* form */}
            <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <div className="block">
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: {value: true, message: 'Email is required'}, 
                            pattern: {value: /^\S+@\S+$/i, message: 'Invalid email address'}
                        }}
                        render={({ field }) => (
                            <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#C8F526]">
                                <User className="w-6 h-6 text-accent"/>
                                <input
                                    {...field}
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full focus:outline-none"
                                />
                            </div>
                        )}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-linear-to-br bg-secondary font-semibold py-3 rounded-lg hover:bg-secondary transition-colors"
                >
                    Send Reset Link
                </button>
            </motion.form>
        </div>
    </div>
  )
}

