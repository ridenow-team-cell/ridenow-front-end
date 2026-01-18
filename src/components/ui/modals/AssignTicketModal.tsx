"use client"
import React, { useState } from 'react';
import { ChevronDown, User, Users } from 'lucide-react';
import BaseModal from './BaseModal';
import { useUsers } from '@/hooks/use-users';

interface AssignTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (userId: string) => void;
    currentAssignee?: string;
}



const AssignTicketModal: React.FC<AssignTicketModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    currentAssignee
}) => {
    const [selectedUserId, setSelectedUserId] = useState<string>(currentAssignee || 'unassigned');
    const [showDropdown, setShowDropdown] = useState(false);
    const { data: staffUsers } = useUsers({ role: 'Admin' });
    const handleConfirm = () => {
        onConfirm(selectedUserId === 'unassigned' ? '' : selectedUserId);
    };

    const handleUserSelect = (userId: string) => {
        setSelectedUserId(userId);
        setShowDropdown(false);
    };


    const getCurrentUser = () => {
        if (selectedUserId === 'unassigned') {
            return { name: 'Unassigned', role: 'Not assigned', email: '' };
        }
        return staffUsers?.find(user => user.id === selectedUserId) || staffUsers[0];
    };

    const currentUser = getCurrentUser();

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Assign Ticket to Staff"
            size="md"
        >
            <div className="space-y-6">
                <div>
                    <p className="text-gray-600 mb-4">
                        {currentAssignee
                            ? 'Reassign this ticket to another staff member'
                            : 'Assign this ticket to a staff member for handling'
                        }
                    </p>

                    <label className="block text-gray-800 text-base font-medium mb-3">
                        Select Staff Member *
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User size={20} className="text-gray-600" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-400">{currentUser.name}</div>
                                    <div className="text-sm text-gray-600">{currentUser.role}</div>
                                </div>
                            </div>
                            <ChevronDown size={20} className="text-[#0066CC]" />
                        </button>
                        {showDropdown && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowDropdown(false)}
                                />
                                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {staffUsers.map(user => (
                                        <button
                                            key={user.id}
                                            type="button"
                                            onClick={() => handleUserSelect(user.id)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                <User size={16} className="text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-400">{user.name}</div>
                                                <div className="text-sm text-gray-600">{user.role}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Staff Summary */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-blue-600" />
                            <span className="text-sm text-blue-800">
                                {staffUsers.length - 1} staff members available for assignment
                            </span>
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
                        type="button"
                        onClick={handleConfirm}
                        className="px-6 py-3 bg-[#0066CC] text-white rounded-lg text-base font-medium hover:bg-[#0052a3] transition-colors"
                        disabled={selectedUserId === currentAssignee}
                    >
                        {currentAssignee ? 'Reassign' : 'Assign Ticket'}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default AssignTicketModal;