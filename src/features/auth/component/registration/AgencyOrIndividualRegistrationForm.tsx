import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller} from "react-hook-form";
import type { AgencyOrIndividualFormData } from "../../types";
import { Building, LockKeyhole, Mail, Phone, User, EyeOff, Eye, Briefcase, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { useRegister } from "../../hooks/useRegister";
import { useNavigate} from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { slugify } from "../../auth-helper";

export default function AgencyOrIndividualRegistrationForm() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [tenantSlug, setTenantSlug] = useState('');
    const [countryCode, setCountryCode] = useState('+233'); // default country code: Ghana (+233)
    const { control, handleSubmit, formState: { errors } } = useForm<AgencyOrIndividualFormData>({
        defaultValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            tenantName: '',
            tenantSlug: '',
            tenantType: 'CLIENT', // default to CLIENT, can be changed to AGENCY or MEDIA_PARTNER based on user selection
        }
    });

    // Generate tenant slug from tenant name
    const handleTenantNameChange = (value: string) => {
        const slug = slugify(value);
        setTenantSlug(slug);
    }

    const {mutate, isPending} = useRegister();

    const onSubmit = (data: AgencyOrIndividualFormData) => {
        // Combine country code with phone number before submitting
        const formattedData = {
            ...data,
            phoneNumber: data.phoneNumber ? `${countryCode}${data.phoneNumber}` : '',
            tenantSlug
        };

        mutate(formattedData, {
            onSuccess: () => {
                toast.success(`${data.tenantType} created successfully! Please check your email for further instructions.`); // Show success message
                navigate("/dashboard"); // Redirect to dashboard page after successful registration
            },
            onError: (error) => {
                toast.error("Registration failed. Please try again."); // Show error message
                console.error("Registration error:", error);
            }
        });
    };

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
                <h1 className="text-3xl font-bold text-black mb-2 tracking-li">Create an Account</h1>
                <p className="text-black/50 mb-6">Sign up to start managing your media campaigns.</p>
            </motion.div>


            {/* form */}
            <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <div>
                    <Controller 
                        name = "tenantType"
                        control = {control}
                        render={({ field }) => (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">I am signing up as:</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label 
                                        className={`
                                            relative flex flex-col items-center gap-3 p-2 border-2 rounded-xl cursor-pointer transition-all duration-200
                                            ${field.value === 'AGENCY' 
                                                ? 'border-purple-600 bg-purple-50 shadow-md' 
                                                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        <input
                                            {...field}
                                            type="radio"
                                            value="AGENCY"
                                            checked={field.value === 'AGENCY'}
                                            className="sr-only"
                                        />
                                        <Briefcase className={`w-8 h-8 ${field.value === 'AGENCY' ? 'text-purple-600' : 'text-gray-400'}`} />
                                        <div className="text-center">
                                            <div className="font-semibold text-gray-900">Agency</div>
                                            <div className="text-xs text-gray-600 mt-1">Professional media agency</div>
                                        </div>
                                        {field.value === 'AGENCY' && (
                                            <div className="absolute top-2 right-2">
                                                <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </label>
                                    
                                    <label 
                                        className={`
                                            relative flex flex-col items-center gap-3 p-2 border-2 rounded-xl cursor-pointer transition-all duration-200
                                            ${field.value === 'CLIENT' 
                                                ? 'border-purple-600 bg-purple-50 shadow-md' 
                                                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        <input
                                            {...field}
                                            type="radio"
                                            value="CLIENT"
                                            checked={field.value === 'CLIENT'}
                                            className="sr-only"
                                        />
                                        <UserCircle className={`w-8 h-8 ${field.value === 'CLIENT' ? 'text-purple-600' : 'text-gray-400'}`} />
                                        <div className="text-center">
                                            <div className="font-semibold text-gray-900">Individual</div>
                                            <div className="text-xs text-gray-600 mt-1">Individual advertiser</div>
                                        </div>
                                        {field.value === 'CLIENT' && (
                                            <div className="absolute top-2 right-2">
                                                <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>
                        )}
                    />
                </div>
                <div>
                    <Controller
                        name="tenantName"
                        control={control}
                        rules={{
                            required: {value: true, message: 'Organization name is required'}, 
                            minLength: {value: 2, message: 'Organization name must be at least 2 characters'},    
                            maxLength: {value: 200, message: 'Organization name must be at most 200 characters'}
                        }}
                        render={({ field }) => (
                            <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#C8F526]">
                                <Building className="w-6 h-6 text-accent"/>
                                <input
                                    {...field}
                                    type="text"
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleTenantNameChange(e.target.value);
                                    }}
                                    placeholder="Enter your organization name"
                                    className="w-full focus:outline-none"
                                />
                            </div>
                        )}
                    />
                    {errors.tenantName && <p className="text-red-500 text-sm mt-1">{errors.tenantName.message}</p>}
                </div>
                <div className="flex flex-row gap-4">
                    <div>
                        <Controller
                            name="firstName"
                            control={control}
                            rules={{
                                required: {value: true, message: 'First name is required'}, 
                            }}
                            render={({ field }) => (
                                <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#C8F526]">
                                    <User className="w-6 h-6 text-accent"/>
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="First Name"
                                        className="w-full focus:outline-none"
                                    />
                                </div>
                            )}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                        <Controller
                            name="lastName"
                            control={control}
                            rules={{
                                required: {value: true, message: 'Last name is required'}, 
                            }}
                            render={({ field }) => (
                                <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#C8F526]">
                                    <User className="w-6 h-6 text-accent"/>
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Last Name"
                                        className="w-full focus:outline-none"
                                    />
                                </div>
                            )}
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                    </div>
                </div>
                {/* <div className="flex flex-row gap-4"> */}
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
                                <Mail className="w-6 h-6 text-accent"/>
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
                <div className="block">
                    <Controller
                        name="phoneNumber"
                        control={control}
                        rules={{
                            required: false, 
                            minLength: {value: 7, message: 'Phone number must be at least 7 digits'},
                            maxLength: {value: 15, message: 'Phone number must be at most 15 digits'},
                            pattern: {value: /^[0-9]+$/, message: 'Phone number must contain only digits'}
                        }}
                        render={({ field }) => (
                            <div className="flex items-center gap-2 px-4 py-1 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#C8F526]">
                                <Phone className="w-6 h-6 text-accent"/>
                                <Select onValueChange={(value) => setCountryCode(value)} defaultValue={countryCode}>
                                    <SelectTrigger className="w-20 focus:outline-none bg-transparent border-none">
                                        <SelectValue placeholder={countryCode} className="focus:outline-none text-gray-700" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-none text-accent focus:bg-transparent">
                                        <SelectItem value="+1">+1</SelectItem>
                                        <SelectItem value="+44">+44</SelectItem>
                                        <SelectItem value="+91">+91</SelectItem>
                                        <SelectItem value="+86">+86</SelectItem>
                                        <SelectItem value="+81">+81</SelectItem>
                                        <SelectItem value="+49">+49</SelectItem>
                                        <SelectItem value="+33">+33</SelectItem>
                                        <SelectItem value="+39">+39</SelectItem>
                                        <SelectItem value="+34">+34</SelectItem>
                                        <SelectItem value="+61">+61</SelectItem>
                                        <SelectItem value="+233">+233</SelectItem>
                                        <SelectItem value="+254">+254</SelectItem>
                                        <SelectItem value="+27">+27</SelectItem>
                                    </SelectContent>
                                </Select>   
                                <span className="text-gray-300">|</span>
                                <input
                                    {...field}
                                    type="tel"
                                    placeholder="Phone number"
                                    className="w-full focus:outline-none"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        field.onChange(value);
                                    }}
                                />
                            </div>
                        )}
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
                </div>
                {/* </div> */}
                <div className="block">
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: {value: true, message: 'Password is required'}, 
                            minLength: {value: 8, message: 'Password must be at least 8 characters'},
                            validate: {
                                containsUpperCase: (value) => /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
                                containsLowerCase: (value) => /[a-z]/.test(value) || 'Password must contain at least one lowercase letter',
                                containsNumber: (value) => /\d/.test(value) || 'Password must contain at least one number',
                                containsSpecialChar: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Password must contain at least one special character',
                            }
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
                <button
                    type="submit"
                    disabled={isPending}
                    className={`w-full bg-linear-to-br ${isPending ? 'bg-gray-400' : 'bg-secondary'} font-semibold py-3 rounded-lg hover:bg-secondary transition-colors`}
                >
                    {isPending ? "Creating account..." : "Sign Up"}
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
                    Sign Up with Google
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm text-gray-600 mt-4 text-center"
            >
                <p className="text-sm text-gray-600 mt-4">Already have an account? <a href="/" className="text-primary hover:underline">Log in</a></p>
            </motion.div>

        </div>
    </div>
  )
}
