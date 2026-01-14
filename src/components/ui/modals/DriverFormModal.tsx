"use client"
import React, { useState } from 'react';
import { X, Upload, ChevronDown } from 'lucide-react';
import BaseModal from './BaseModal';

interface DriverFormData {
    fullname: string;
    phoneNumber: string;
    allocatedBus: string;
    assignedRoute: string;
    image?: File | null;
}

interface DriverFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: DriverFormData) => void;
    initialData?: DriverFormData;
    isEdit?: boolean;
}

const DriverFormModal: React.FC<DriverFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isEdit = false
}) => {
    const [formData, setFormData] = useState<DriverFormData>(
        initialData || {
            fullname: '',
            phoneNumber: '',
            allocatedBus: '',
            assignedRoute: ''
        }
    );
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Sample data for dropdowns (you can replace with actual data)
    const busOptions = ['Bus 01', 'Bus 02', 'Bus 03', 'Bus 04', 'Bus 05'];
    const routeOptions = ['Route 1', 'Route 2', 'Route 3', 'Route 4', 'Route 5'];

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
                    <div className="flex flex-col items-start justify-center">
                        <div className="relative mb-4">
                            <div className="w-32 h-32 rounded-full border-2 border-dashed border-[#D0D5DD] flex items-center justify-center overflow-hidden bg-gray-50">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Driver preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Upload className="w-8 h-8 text-[#667085]" />
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
                                <div className="bg-[#0066CC] text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-[#0055AA] transition-colors">
                                    Upload Image
                                </div>
                            </label>
                        </div>
                        <p className="text-sm text-[#667085] text-center">
                            Click the button to upload driver photo
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Fullname */}
                        <div>
                            <label className="block text-[#344054] text-sm font-medium mb-2">
                                Fullname
                            </label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleInputChange}
                                placeholder="Type full name"
                                className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg text-[#344054] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-[#344054] text-sm font-medium mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="Type Phone Number"
                                className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg text-[#344054] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Allocate Bus */}
                        <div>
                            <label className="block text-[#344054] text-sm font-medium mb-2">
                                Allocate Bus
                            </label>
                            <div className="relative">
                                <select
                                    name="allocatedBus"
                                    value={formData.allocatedBus}
                                    onChange={(e) => setFormData({ ...formData, allocatedBus: e.target.value })}
                                    className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg text-[#344054] appearance-none focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                                >
                                    <option value="">Select Bus</option>
                                    {busOptions.map((bus) => (
                                        <option key={bus} value={bus}>
                                            {bus}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={20}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#667085] pointer-events-none"
                                />
                            </div>
                            <button
                                type="button"
                                className="mt-2 text-[#0066CC] text-sm font-medium hover:text-[#0055AA] transition-colors"
                                onClick={() => {
                                    // Handle allocate action
                                    console.log('Allocate bus clicked');
                                }}
                            >
                                Allocate
                            </button>
                        </div>

                        {/* Assign Route */}
                        <div>
                            <label className="block text-[#344054] text-sm font-medium mb-2">
                                Assign Route
                            </label>
                            <div className="relative">
                                <select
                                    name="assignedRoute"
                                    value={formData.assignedRoute}
                                    onChange={(e) => setFormData({ ...formData, assignedRoute: e.target.value })}
                                    className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg text-[#344054] appearance-none focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                                >
                                    <option value="">Select Route</option>
                                    {routeOptions.map((route) => (
                                        <option key={route} value={route}>
                                            {route}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={20}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#667085] pointer-events-none"
                                />
                            </div>
                            <button
                                type="button"
                                className="mt-2 text-[#0066CC] text-sm font-medium hover:text-[#0055AA] transition-colors"
                                onClick={() => {
                                    // Handle assign route action
                                    console.log('Assign route clicked');
                                }}
                            >
                                Assign Routes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-[#EAECF0]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 bg-[#E7A533]  text-[#010237] rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-[#0066CC] text-white rounded-lg font-medium hover:bg-[#0055AA] transition-colors"
                    >
                        {isEdit ? 'Save & Update' : 'Add Driver'}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

export default DriverFormModal;