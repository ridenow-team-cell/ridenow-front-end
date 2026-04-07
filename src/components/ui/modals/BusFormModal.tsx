"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import SideModal from './SideModal';
import { useCheckBusExists } from '@/hooks/use-bus';
import { busService } from '@/services/bus-service';

interface BusFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: BusFormData) => void;
    initialData?: BusFormData;
    isEdit?: boolean;
}

interface BusFormData {
    name: string;
    model: string;
    make: string;
    registrationName: string;
    color: string;
    year: number | string;
    status: string;
    totalSeats: number | string;
    isActive: boolean;
}

const BusFormModal: React.FC<BusFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isEdit = false
}) => {
    const [formData, setFormData] = useState<BusFormData>(
        initialData || {
            name: '',
            model: '',
            make: '',
            registrationName: '',
            color: 'Yellow',
            year: new Date().getFullYear(),
            status: 'Available',
            totalSeats: 40,
            isActive: true
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showColorDropdown, setShowColorDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    const checkBusExists = useCheckBusExists();
    const colorOptions = busService.getColorOptions();
    const yearOptions = busService.getYearOptions();
    const statusOptions = busService.getStatusOptions();

    useEffect(() => {
        if (isEdit && initialData) {
            setFormData(initialData);
        }
    }, [isEdit, initialData]);

    const validateForm = async (): Promise<boolean> => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Bus name is required';
        }

        if (!formData.model.trim()) {
            newErrors.model = 'Model is required';
        }

        if (!formData.make.trim()) {
            newErrors.make = 'Make is required';
        }

        if (!formData.registrationName.trim()) {
            newErrors.registrationName = 'Registration name is required';
        }

        if (!formData.color) {
            newErrors.color = 'Color is required';
        }

        if (!formData.year) {
            newErrors.year = 'Year is required';
        } else if (Number(formData.year) < 2000 || Number(formData.year) > new Date().getFullYear() + 1) {
            newErrors.year = 'Please enter a valid year';
        }

        if (!formData.totalSeats) {
            newErrors.totalSeats = 'Total seats is required';
        } else if (Number(formData.totalSeats) < 1 || Number(formData.totalSeats) > 100) {
            newErrors.totalSeats = 'Seats must be between 1 and 100';
        }

        // Check if bus exists by registration
        if (!isEdit && formData.registrationName) {
            try {
                const response = await checkBusExists.mutateAsync(formData.registrationName);
                if (response.exists) {
                    newErrors.registrationName = 'Registration number already exists';
                }
            } catch (error) {
                console.error('Error checking bus existence:', error);
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

    const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = value === '' ? '' : Number(value);
        setFormData(prev => ({
            ...prev,
            [name]: numValue
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

    const handleSelectChange = (name: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <SideModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Bus' : 'Add Bus'}
        >
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">
                            Bus Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter bus name"
                            className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">
                            Model *
                        </label>
                        <input
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleInputChange}
                            placeholder="Enter model"
                            className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.model ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.model && (
                            <p className="text-red-500 text-sm mt-1">{errors.model}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">
                            Make *
                        </label>
                        <input
                            type="text"
                            name="make"
                            value={formData.make}
                            onChange={handleInputChange}
                            placeholder="Enter make"
                            className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.make ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.make && (
                            <p className="text-red-500 text-sm mt-1">{errors.make}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">
                            Registration Name *
                        </label>
                        <input
                            type="text"
                            name="registrationName"
                            value={formData.registrationName}
                            onChange={handleInputChange}
                            placeholder="Enter registration number"
                            className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.registrationName ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.registrationName && (
                            <p className="text-red-500 text-sm mt-1">{errors.registrationName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">
                            Color *
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowColorDropdown(!showColorDropdown)}
                                className={`w-full px-4 py-3 border rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] ${errors.color ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: formData.color.toLowerCase() }}
                                        ></div>
                                        <span>{formData.color}</span>
                                    </div>
                                    <ChevronDown size={20} className="text-[#0066CC]" />
                                </div>
                            </button>
                            {showColorDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowColorDropdown(false)}
                                    />
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {colorOptions.map(option => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    handleSelectChange('color', option.value);
                                                    setShowColorDropdown(false);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                                            >
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: option.value.toLowerCase() }}
                                                ></div>
                                                <span>{option.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        {errors.color && (
                            <p className="text-red-500 text-sm mt-1">{errors.color}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">
                            Year *
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowYearDropdown(!showYearDropdown)}
                                className={`w-full px-4 py-3 border rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] ${errors.year ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{formData.year}</span>
                                    <ChevronDown size={20} className="text-[#0066CC]" />
                                </div>
                            </button>
                            {showYearDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowYearDropdown(false)}
                                    />
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {yearOptions.map(option => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    handleSelectChange('year', option.value);
                                                    setShowYearDropdown(false);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-500"
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        {errors.year && (
                            <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">
                            Status *
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                className={`w-full px-4 py-3 border rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] ${errors.status ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{formData.status}</span>
                                    <ChevronDown size={20} className="text-[#0066CC]" />
                                </div>
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
                                                onClick={() => {
                                                    handleSelectChange('status', option.value);
                                                    setShowStatusDropdown(false);
                                                }}
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

                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">
                            Total Seats *
                        </label>
                        <input
                            type="number"
                            name="totalSeats"
                            value={formData.totalSeats}
                            onChange={handleNumberInputChange}
                            placeholder="Enter total seats"
                            min="1"
                            max="100"
                            className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.totalSeats ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.totalSeats && (
                            <p className="text-red-500 text-sm mt-1">{errors.totalSeats}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="rounded border-gray-300"
                            />
                            <span className="text-gray-800">Active Bus</span>
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
                        disabled={checkBusExists.isPending}
                    >
                        {checkBusExists.isPending ? 'Checking...' : isEdit ? 'Save Changes' : 'Add Bus'}
                    </button>
                </div>
            </form>
        </SideModal>
    );
};

export default BusFormModal;