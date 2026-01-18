"use client"
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import BaseModal from './BaseModal';

interface ChangeRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (newRole: string) => void;
    currentRole: string;
}

const roles = ['Student', 'Driver', 'Admin'];

const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    currentRole
}) => {
    const [newRole, setNewRole] = useState(currentRole);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleConfirm = () => {
        onConfirm(newRole);
    };

    const handleRoleSelect = (role: string) => {
        setNewRole(role);
        setShowDropdown(false);
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Change User Role"
            size="md"
        >
            <div className="space-y-6">
                <div>
                    <p className="text-gray-600 mb-4">
                        Current role: <span className="font-medium">{currentRole}</span>
                    </p>

                    <label className="block text-gray-800 text-base font-medium mb-3">
                        Select New Role *
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC]"
                        >
                            {newRole}
                            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0066CC]" />
                        </button>
                        {showDropdown && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowDropdown(false)}
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
                        type="button"
                        onClick={handleConfirm}
                        className="px-6 py-3 bg-[#0066CC] text-white rounded-lg text-base font-medium hover:bg-[#0052a3] transition-colors"
                        disabled={newRole === currentRole}
                    >
                        Change Role
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default ChangeRoleModal;