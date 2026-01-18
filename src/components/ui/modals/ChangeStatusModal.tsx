"use client"
import React, { useState } from 'react';
import { ChevronDown, AlertCircle, CheckCircle, Clock, XCircle, PlayCircle } from 'lucide-react';
import BaseModal from './BaseModal';

interface ChangeStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (status: string) => void;
    currentStatus: string;
}

const statusOptions = [
    {
        value: 'Open',
        label: 'Open',
        description: 'Ticket is newly created and awaiting assignment',
        icon: AlertCircle,
        color: 'text-gray-600',
        bgColor: 'bg-gray-100'
    },
    {
        value: 'In Progress',
        label: 'In Progress',
        description: 'Ticket is being worked on by staff',
        icon: PlayCircle,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
    },
    {
        value: 'Resolved',
        label: 'Resolved',
        description: 'Ticket has been resolved successfully',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
    },
    {
        value: 'Closed',
        label: 'Closed',
        description: 'Ticket is closed (usually after resolution)',
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-100'
    }
];

const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    currentStatus
}) => {
    const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleConfirm = () => {
        onConfirm(selectedStatus);
    };

    const handleStatusSelect = (status: string) => {
        setSelectedStatus(status);
        setShowDropdown(false);
    };

    const getCurrentStatus = () => {
        const status = statusOptions.find(s => s.value === selectedStatus);
        return status || statusOptions[0];
    };

    const currentStatusObj = getCurrentStatus();

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Change Ticket Status"
            size="md"
        >
            <div className="space-y-6">
                <div>
                    <p className="text-gray-600 mb-4">
                        Current status: <span className="font-medium">{currentStatus}</span>
                    </p>

                    <label className="block text-gray-800 text-base font-medium mb-3">
                        Select New Status *
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${currentStatusObj.bgColor}`}>
                                    <currentStatusObj.icon size={20} className={currentStatusObj.color} />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-400">{currentStatusObj.label}</div>
                                    <div className="text-sm text-gray-600">{currentStatusObj.description}</div>
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
                                    {statusOptions.map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleStatusSelect(option.value)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                                        >
                                            <div className={`p-2 rounded-lg ${option.bgColor}`}>
                                                <option.icon size={20} className={option.color} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-400">{option.label}</div>
                                                <div className="text-sm text-gray-600">{option.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Status Change Notes */}
                    {selectedStatus === 'Closed' && currentStatus !== 'Closed' && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-yellow-800">Closing Ticket</p>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Closing a ticket will:
                                    </p>
                                    <ul className="text-sm text-yellow-700 mt-1 list-disc pl-4 space-y-1">
                                        <li>Mark the ticket as completed</li>
                                        <li>Stop notifications for this ticket</li>
                                        <li>Archive the ticket for record keeping</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
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
                        disabled={selectedStatus === currentStatus}
                    >
                        Change Status
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default ChangeStatusModal;