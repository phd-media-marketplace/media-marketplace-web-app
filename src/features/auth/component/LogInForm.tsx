import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller} from "react-hook-form";
import { Link } from "react-router-dom";
import type { LogInFormData } from "../types";
import { EyeOff, LockKeyhole, User, Eye } from "lucide-react";
import RegistrationModal from "./RegistrationModal";
import { toast } from "sonner";

export default function LogInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm<LogInFormData>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = (data: LogInFormData) => {
        // TODO: Implement actual login logic here (e.g., API call)
        toast.success("Logged in successfully!");
        console.log(data);
    }

  return (
    <div
        className="w-full h-full flex flex-col items-center justify-center px-6 sm:px-10 lg:px-16 xl:px-20 py-8 overflow-y-auto"
    >
        <div className="relative w-full max-w-120 mx-auto">
            {/* header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
            >
                <h1 className="text-3xl font-bold text-black mb-2 tracking-li">Welcome Back</h1>
                <p className="text-black/50 mb-6">Log in to your account to manage your media campaigns.</p>
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
                                    className="w-full focus:outline-none bg-none"
                                />
                            </div>
                        )}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div className="block">
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: {value: true, message: 'Password is required'}, 
                            minLength: {value: 8, message: 'Password must be at least 8 characters'}
                        }}
                        render={({ field }) => (
                            <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#C8F526]">
                                <LockKeyhole className="w-6 h-6 text-accent"/>
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
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="remember" className="h-4 w-4 text-[#C8F526] focus:ring-[#C8F526] border-gray-300 rounded" />
                        <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
                    </div>
                </div>
                <Link to="/forget-password" className="text-sm text-primary hover:underline self-end">Forgot password?</Link>
                <button
                    type="submit"
                    className="w-full bg-linear-to-br bg-secondary font-semibold py-3 rounded-lg hover:bg-secondary transition-colors"
                >
                    Log In
                </button>
            </motion.form>

            {/* Divider */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center gap-4 my-7"
            >
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-300 font-medium uppercase tracking-widest">Or</span>
                <div className="flex-1 h-px bg-gray-100" />
            </motion.div>
            
            {/* social login */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex gap-3 mt-8"
            >
                <button className="flex-1 flex items-center justify-center gap-2.5 h-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Log In with Google
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm text-gray-600 mt-4 text-center"
            >
                <p className="text-sm text-gray-600 mt-4">Don't have an account? <button onClick={() => setModalOpen(true)} className="text-primary hover:underline">Sign up</button></p>
            </motion.div>

        </div>
        {modalOpen && <RegistrationModal onClose={() => setModalOpen(false)} />}
    </div>
  )
}
