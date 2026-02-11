import { Building2Icon, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegistrationModalProps {
    onClose: () => void;
}

export default function RegistrationModal({ onClose }: RegistrationModalProps) {
    const navigate = useNavigate();
    const [accountType, setAccountType] = useState('');

    const handleContinue = () => {
        if (accountType === 'newTenant') {
            onClose();
            navigate('/register-tenant');
        } else if (accountType === 'existingTenant') {
            onClose();
            navigate('/signup');
        }
    };

    const handleClose = () => {
        setAccountType('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-slideUp">
                {/* Header with close button */}
                <div className="relative px-8 pt-8 pb-2">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                        aria-label="Close modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-linear-to-br from-[#1a0633] via-[#2D0A4E] to-[#3d1166] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg> */}
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Account</h2>
                        <p className="text-gray-500 text-sm">Get started by choosing your account type</p>
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 py-6">
                    <p className="text-gray-700 font-medium mb-4">Select your account type:</p>
                    <div className="flex flex-col gap-3">
                        {/* New Tenant Option */}
                        <label 
                            htmlFor="newTenant" 
                            className={`
                                flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                                ${accountType === 'newTenant' 
                                    ? 'border-purple-600 bg-purple-50 shadow-md' 
                                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                                }
                            `}
                        >
                            <div className="flex items-center h-6">
                                <input
                                    type="radio"
                                    id="newTenant"
                                    name="accountType"
                                    value="newTenant"
                                    checked={accountType === 'newTenant'}
                                    onChange={(e) => setAccountType(e.target.value)}
                                    className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2 cursor-pointer"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-gray-900 mb-1">Create New Organization</div>
                                <div className="text-sm text-gray-600">Set up a new company or organization account</div>
                            </div>
                            <div className="flex items-center">
                                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg> */}
                                <Building2Icon className="h-6 w-6 text-purple-600" />
                            </div>
                        </label>

                        {/* Existing Tenant Option */}
                        <label 
                            htmlFor="existingTenant" 
                            className={`
                                flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                                ${accountType === 'existingTenant' 
                                    ? 'border-purple-600 bg-purple-50 shadow-md' 
                                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                                }
                            `}
                        >
                            <div className="flex items-center h-6">
                                <input
                                    type="radio"
                                    id="existingTenant"
                                    name="accountType"
                                    value="existingTenant"
                                    checked={accountType === 'existingTenant'}
                                    onChange={(e) => setAccountType(e.target.value)}
                                    className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2 cursor-pointer"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-gray-900 mb-1">Join Existing Organization</div>
                                <div className="text-sm text-gray-600">Join a company or organization with an invitation code</div>
                            </div>
                            <div className="flex items-center">
                                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg> */}
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 pb-8">
                    <button
                        onClick={handleContinue}
                        disabled={!accountType}
                        className={`
                            w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform
                            ${accountType 
                                ? 'bg-linear-to-r from-[#1a0633] via-[#2D0A4E] to-[#3d1166] hover:to-[#4a1a7e] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]' 
                                : 'bg-gray-300 cursor-not-allowed'
                            }
                        `}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}