"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, Upload, X } from 'lucide-react';
import BaseModal from './BaseModal';
import { useCheckDriverExists } from '@/hooks/use-drivers';
import { useBuses } from '@/hooks/use-bus'; // Fixed import
import { useRoutes } from '@/hooks/use-routes'; // Add routes hook

interface DriverFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: DriverFormData) => void;
    initialData?: DriverFormData;
    isEdit?: boolean;
}

interface DriverFormData {
    fullName: string;
    phoneNumber: string;
    email: string;
    photoUrl?: string;
    licenseNumber: string;
    busId: string;
    routeId: string;
    status: string;
    isActive: boolean;
    password: string;
    confirmPassword: string;
}

const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'OnDuty', label: 'On Duty' },
    { value: 'OffDuty', label: 'Off Duty' },
    { value: 'OnBreak', label: 'On Break' },
    { value: 'OnLeave', label: 'On Leave' }
];

const DriverFormModal: React.FC<DriverFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isEdit = false
}) => {
    const [formData, setFormData] = useState<DriverFormData>(
        initialData || {
            fullName: '',
            phoneNumber: '',
            email: '',
            licenseNumber: '',
            busId: '',
            routeId: '',
            status: 'Active',
            isActive: true,
            password: '',
            confirmPassword: '',
            photoUrl: ""
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.photoUrl || null);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showBusDropdown, setShowBusDropdown] = useState(false);
    const [showRouteDropdown, setShowRouteDropdown] = useState(false);

    // Fetch buses and routes
    const { data: busesData, isLoading: isLoadingBuses } = useBuses({


    });

    const { data: routesData, isLoading: isLoadingRoutes } = useRoutes({
        status: 'Active',
        isActive: true
    });

    const checkDriverExists = useCheckDriverExists();

    useEffect(() => {
        if (isEdit && initialData) {
            setFormData(initialData);
            setImagePreview(initialData.photoUrl || null);
        }
    }, [isEdit, initialData]);

    const validateForm = async (): Promise<boolean> => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\+?[\d\s\-()]+$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Invalid phone number format';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.licenseNumber.trim()) {
            newErrors.licenseNumber = 'License number is required';
        }

        if (!isEdit && !formData.password) {
            newErrors.password = 'Password is required';
        } else if (!isEdit && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isEdit && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.status) {
            newErrors.status = 'Status is required';
        }

        // Check if driver exists
        if (!isEdit && (formData.email || formData.phoneNumber || formData.licenseNumber)) {
            try {
                const response = await checkDriverExists.mutateAsync({
                    licenseNumber: formData.licenseNumber,
                    phone: formData.phoneNumber
                });
                if (response.exists) {
                    if (response.licenseNumber === formData.licenseNumber) {
                        newErrors.licenseNumber = 'License number already exists';
                    }
                    if (response.phone === formData.phoneNumber) {
                        newErrors.phoneNumber = 'Phone number already exists';
                    }
                }
            } catch (error) {
                console.error('Error checking driver existence:', error);
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setFormData(prev => ({ ...prev, photoUrl: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = await validateForm();
        if (isValid) {
            const submitData = { ...formData };

            // Remove confirmPassword for API
            const { confirmPassword, ...apiData } = submitData;

            // If no image file but we have a photoUrl from initial data, keep it
            if (!imageFile && initialData?.photoUrl) {
                apiData.photoUrl = initialData.photoUrl;
            }

            onSubmit(apiData as DriverFormData);
        }
    };

    const handleStatusSelect = (status: string) => {
        setFormData(prev => ({ ...prev, status }));
        setShowStatusDropdown(false);
        if (errors.status) {
            setErrors(prev => ({ ...prev, status: '' }));
        }
    };

    const handleBusSelect = (busId: string) => {
        setFormData(prev => ({ ...prev, busId }));
        setShowBusDropdown(false);
    };

    const handleRouteSelect = (routeId: string) => {
        setFormData(prev => ({ ...prev, routeId }));
        setShowRouteDropdown(false);
    };

    const buses = busesData || [];
    const routes = routesData || [];

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Driver' : 'Add Driver'}
            size="xl"
        >
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* Upload Image Section */}
                    <div className="flex flex-col items-center justify-center mb-4">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Driver preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Upload className="w-12 h-12 text-gray-400" />
                                )}
                            </div>
                            <input
                                type="file"
                                id="image-upload"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="image-upload"
                                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer"
                            >
                                <div className="bg-[#0066CC] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0055AA] transition-colors">
                                    {imagePreview ? 'Change Image' : 'Upload Image'}
                                </div>
                            </label>
                            {imagePreview && (
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Upload driver photo
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter full name"
                                className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="Enter phone number (e.g., +1234567890)"
                                className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-2">
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

                        {/* License Number */}
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-2">
                                License Number *
                            </label>
                            <input
                                type="text"
                                name="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={handleInputChange}
                                placeholder="Enter license number"
                                className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.licenseNumber && (
                                <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-2">
                                Status *
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                    className={`w-full px-4 py-3 border rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] ${errors.status ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    {statusOptions.find(s => s.value === formData.status)?.label || 'Select Status'}
                                    <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0066CC]" />
                                </button>
                                {showStatusDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowStatusDropdown(false)}
                                        />
                                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {statusOptions.map(option => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => handleStatusSelect(option.value)}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-500"
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            {errors.status && (
                                <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                            )}
                        </div>

                        {/* Allocate Bus */}
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-2">
                                Allocate Bus (Optional)
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowBusDropdown(!showBusDropdown)}
                                    disabled={isLoadingBuses}
                                    className={`w-full px-4 py-3 border rounded-lg text-left focus:outline-none focus:border-[#0066CC] flex items-center justify-between ${isLoadingBuses ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-gray-800 border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {isLoadingBuses ? (
                                            <span>Loading buses...</span>
                                        ) : formData.busId && buses.find(b => b.id === formData.busId) ? (
                                            <>
                                                <span className="font-medium">
                                                    {buses.find(b => b.id === formData.busId)?.name}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    ({buses.find(b => b.id === formData.busId)?.registrationName})
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-gray-500">Select Bus</span>
                                        )}
                                    </div>
                                    <ChevronDown size={20} className="text-[#0066CC]" />
                                </button>
                                {showBusDropdown && !isLoadingBuses && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowBusDropdown(false)}
                                        />
                                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            <button
                                                type="button"
                                                onClick={() => handleBusSelect('')}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-500"
                                            >
                                                <div className="font-medium">No Bus</div>
                                                <div className="text-sm">Remove bus assignment</div>
                                            </button>
                                            {buses.length > 0 ? (
                                                buses.map(bus => (
                                                    <button
                                                        key={bus.id}
                                                        type="button"
                                                        onClick={() => handleBusSelect(bus.id)}
                                                        className="w-full text-left px-4 py-3 hover:bg-gray-50"
                                                    >
                                                        <div className="font-medium">{bus.name}</div>
                                                        <div className="text-sm text-gray-600">
                                                            Registration: {bus.registrationName} • Seats: {bus.totalSeats}
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-4 py-3 text-gray-500 text-center">
                                                    No available buses
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Assign Route */}
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-2">
                                Assign Route (Optional)
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowRouteDropdown(!showRouteDropdown)}
                                    disabled={isLoadingRoutes}
                                    className={`w-full px-4 py-3 border rounded-lg text-left focus:outline-none focus:border-[#0066CC] flex items-center justify-between ${isLoadingRoutes ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-gray-800 border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {isLoadingRoutes ? (
                                            <span>Loading routes...</span>
                                        ) : formData.routeId && routes.find(r => r.id === formData.routeId) ? (
                                            <>
                                                <span className="font-medium">
                                                    {routes.find(r => r.id === formData.routeId)?.name}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    ({routes.find(r => r.id === formData.routeId)?.stops?.length || 0} stops)
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-gray-500">Select Route</span>
                                        )}
                                    </div>
                                    <ChevronDown size={20} className="text-[#0066CC]" />
                                </button>
                                {showRouteDropdown && !isLoadingRoutes && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowRouteDropdown(false)}
                                        />
                                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            <button
                                                type="button"
                                                onClick={() => handleRouteSelect('')}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-500"
                                            >
                                                <div className="font-medium">No Route</div>
                                                <div className="text-sm">Remove route assignment</div>
                                            </button>
                                            {routes.length > 0 ? (
                                                routes.map(route => (
                                                    <button
                                                        key={route.id}
                                                        type="button"
                                                        onClick={() => handleRouteSelect(route.id)}
                                                        className="w-full text-left px-4 py-3 hover:bg-gray-50"
                                                    >
                                                        <div className="font-medium">{route.name}</div>
                                                        <div className="text-sm text-gray-600">
                                                            {route.description} • {route.stops?.length || 0} stops
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-4 py-3 text-gray-500 text-center">
                                                    No active routes
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {!isEdit && (
                            <>
                                {/* Password */}
                                <div>
                                    <label className="block text-gray-800 text-base font-medium mb-2">
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter password (min. 6 characters)"
                                        className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-gray-800 text-base font-medium mb-2">
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

                        {/* Active Status */}
                        <div className="md:col-span-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-gray-800">Active Driver</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
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
                        disabled={checkDriverExists.isPending || isLoadingBuses || isLoadingRoutes}
                    >
                        {checkDriverExists.isPending ? 'Checking...' :
                            isLoadingBuses || isLoadingRoutes ? 'Loading...' :
                                isEdit ? 'Save Changes' : 'Add Driver'}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

export default DriverFormModal;