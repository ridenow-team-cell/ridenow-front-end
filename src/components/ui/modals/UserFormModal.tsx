"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import SideModal from './SideModal';
import { useCheckUserExists } from '@/hooks/use-users';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UserFormData) => void;
    initialData?: UserFormData;
    isEdit?: boolean;
    defaultRole?: string;
}

interface UserFormData {
    name: string;
    email: string;
    schoolId: string;
    role: string;
    phoneNo: string;
    password: string;
    confirmPassword: string;
    isActive: boolean;
}

const roles = ['Student', 'Driver', 'Admin', 'Super Admin'];

const UserFormModal: React.FC<UserFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isEdit = false,
    defaultRole
}) => {
    const [formData, setFormData] = useState<UserFormData>(
        initialData || {
            name: '',
            email: '',
            schoolId: '',
            role: defaultRole || 'Student',
            phoneNo: '',
            password: '',
            confirmPassword: '',
            isActive: true
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const checkUserExists = useCheckUserExists();

    useEffect(() => {
        if (isEdit && initialData) {
            setFormData(initialData);
        }
    }, [isEdit, initialData]);

    const validateForm = async (): Promise<boolean> => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!isEdit && !formData.password) {
            newErrors.password = 'Password is required';
        } else if (!isEdit && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isEdit && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.phoneNo.trim()) {
            newErrors.phoneNo = 'Phone number is required';
        }

        if (!formData.role) {
            newErrors.role = 'Role is required';
        }

        // Check if user exists
        if (!isEdit && (formData.email || formData.phoneNo)) {
            try {
                const exists = await checkUserExists.mutateAsync({
                    email: formData.email,
                    phone: formData.phoneNo
                });
                if (exists && (exists as any).exists) {
                    if ((exists as any).email === formData.email) {
                        newErrors.email = 'Email already exists';
                    }
                    if ((exists as any).phone === formData.phoneNo) {
                        newErrors.phoneNo = 'Phone number already exists';
                    }
                }
            } catch (error) {
                console.error('Error checking user existence:', error);
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = await validateForm();
        if (isValid) {
            onSubmit(formData);
        }
    };

    const handleRoleSelect = (role: string) => {
        setFormData(prev => ({ ...prev, role }));
        setShowRoleDropdown(false);
        if (errors.role) {
            setErrors(prev => ({ ...prev, role: '' }));
        }
    };

    return (
        <SideModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit User' : 'Add User'}
        >
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter full name"
                            className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email address"
                            className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">
                            School ID
                        </label>
                        <input
                            type="text"
                            name="schoolId"
                            value={formData.schoolId}
                            onChange={handleInputChange}
                            placeholder="Enter school ID (optional)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC]"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">
                            Role *
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                                className={`w-full px-4 py-3 border rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] ${errors.role ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                {formData.role || 'Select role'}
                                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0066CC]" />
                            </button>
                            {showRoleDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowRoleDropdown(false)}
                                    />
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                                        {roles.map(role => (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => handleRoleSelect(role)}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-500"
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        {errors.role && (
                            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            name="phoneNo"
                            value={formData.phoneNo}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                            className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.phoneNo ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.phoneNo && (
                            <p className="text-red-500 text-sm mt-1">{errors.phoneNo}</p>
                        )}
                    </div>

                    {!isEdit && (
                        <>
                            <div>
                                <label className="block text-gray-800 text-base font-medium mb-3">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter password"
                                    className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-800 text-base font-medium mb-3">
                                    Confirm Password *
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm password"
                                    className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </>
                    )}

                    <div className="md:col-span-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="rounded border-gray-300"
                            />
                            <span className="text-gray-800">Active User</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 bg-[#E7A533] text-gray-800 rounded-lg text-base font-medium hover:bg-[#d69420] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-[#0066CC] text-white rounded-lg text-base font-medium hover:bg-[#0052a3] transition-colors"
                        disabled={checkUserExists.isPending}
                    >
                        {checkUserExists.isPending ? 'Checking...' : isEdit ? 'Save Changes' : 'Add User'}
                    </button>
                </div>
            </form>
        </SideModal>
    );
};

export default UserFormModal;