"use client"
import React from 'react';
import { ChevronDown } from 'lucide-react';
import BaseModal from './BaseModal';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UserFormData) => void;
    initialData?: UserFormData;
    isEdit?: boolean;
}

interface UserFormData {
    name: string;
    model: string;
    make: string;
    registrationName: string;
    colour: string;
    year: string;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isEdit = false
}) => {
    const [formData, setFormData] = React.useState<UserFormData>(
        initialData || {
            name: '',
            model: '',
            make: '',
            registrationName: '',
            colour: '',
            year: ''
        }
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit User' : 'Add User'}
            size="xl"
        >
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Type Vehicle Name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">Model</label>
                        <input
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleInputChange}
                            placeholder="Type Model"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">Make</label>
                        <input
                            type="text"
                            name="make"
                            value={formData.make}
                            onChange={handleInputChange}
                            placeholder="Type make"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">Registration Name</label>
                        <input
                            type="text"
                            name="registrationName"
                            value={formData.registrationName}
                            onChange={handleInputChange}
                            placeholder="Type Registration Name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">Colour</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="colour"
                                value={formData.colour}
                                onChange={handleInputChange}
                                placeholder="Type Colour"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC]"
                                required
                            />
                            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0066CC]" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">Year</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="year"
                                value={formData.year}
                                onChange={handleInputChange}
                                placeholder="DD/MM/YYYY"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC]"
                                required
                            />
                            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0066CC]" />
                        </div>
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
                    >
                        {isEdit ? 'Save & Update' : 'Add User'}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

export default UserFormModal;