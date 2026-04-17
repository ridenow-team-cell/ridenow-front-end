"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import SuccessModal from '@/components/ui/modals/SuccessModal';

// Type definitions
interface InputFieldProps {
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    error?: string;
}

interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    variant: 'primary' | 'secondary';
    type?: 'button' | 'submit';
    disabled?: boolean;
}

// Password Input Field Component
const PasswordInputField: React.FC<InputFieldProps> = ({
    label,
    value,
    onChange,
    placeholder,
    error
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2 text-sm">
                {label}
            </label>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-[#CBCBCB] text-[#343434] pr-12 ${error ? 'border-red-300' : ''}`}
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#343434] focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? (
                        <EyeOff size={20} className="text-gray-500" />
                    ) : (
                        <Eye size={20} className="text-gray-500" />
                    )}
                </button>
            </div>
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
};

// Regular Input Field Component
const InputField: React.FC<InputFieldProps> = ({
    label,
    type,
    value,
    onChange,
    placeholder,
    error
}) => (
    <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2 text-sm">
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-[#CBCBCB] text-[#343434] ${error ? 'border-red-300' : ''}`}
        />
        {error && (
            <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
    </div>
);

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant,
    type = 'button',
    disabled = false
}) => {
    const baseClasses = "px-8 py-3 rounded-full font-medium transition-all duration-200 min-w-[140px] w-full disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = variant === 'primary'
        ? "bg-[#0066CC] text-white hover:bg-[#0052A3] shadow-md hover:shadow-lg"
        : "bg-[#E7A533] text-black hover:bg-[#D89520] shadow-md hover:shadow-lg";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses}`}
        >
            {children}
        </button>
    );
};

// Main Component
const RideNowLogin: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Admin credentials
    const ADMIN_EMAIL = 'admin@ridenow.com';
    const ADMIN_PASSWORD = 'Ridenow#247';

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            // Check credentials
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                // Show success modal
                setShowSuccessModal(true);

                // After modal shows, redirect to admin page
                setTimeout(() => {
                    router.push('/admin');
                }, 1500);
            } else {
                setErrors({
                    email: 'Invalid credentials',
                    password: 'Invalid credentials'
                });
            }
        } catch (error) {
            setErrors({
                email: 'Login failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEmail('');
        setPassword('');
        setErrors({});
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLogin();
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">
                    <div className="relative mx-auto w-[140px] h-[40px] sm:w-[160px] sm:h-[45px] md:w-[180px] md:h-[50px] lg:w-[215px] lg:h-[60px] mb-8 sm:mb-12">
                        <img
                            src="/assets/logo.png"
                            alt="RideNow Logo Light"
                            className="absolute w-full h-auto"
                        />
                    </div>

                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl font-semibold text-[#005baf] mb-1 sm:mb-2">Admin Login</h2>
                        <p className="text-[#343434] text-sm sm:text-base">Enter your credentials to login</p>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} onKeyPress={handleKeyPress}>
                        <InputField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={setEmail}
                            placeholder="admin@example.com"
                            error={errors.email}
                        />

                        <PasswordInputField
                            label="Password"
                            value={password}
                            onChange={setPassword}
                            placeholder="Password"
                            error={errors.password}
                        />

                        {/* Demo credentials hint - uncomment if needed */}
                        {/* <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                            <p className="text-xs text-blue-800 mb-1">
                                <span className="font-medium">Hint:</span> Use admin@ridenow.com / Ridenow247
                            </p>
                        </div> */}

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                            <Button
                                variant="secondary"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleLogin}
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Logging in...
                                    </div>
                                ) : 'Login'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Login Successful!"
                message="Redirecting to admin dashboard..."
            />
        </>
    );
};

export default RideNowLogin;