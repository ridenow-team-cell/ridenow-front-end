"use client"
import React, { useState } from 'react';
import { ChevronDown, Activity, Briefcase, Coffee, Umbrella, Power, AlertCircle } from 'lucide-react';
import BaseModal from './BaseModal';

interface ChangeStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (status: string) => void;
    currentStatus: string;
}

const statusOptions = [
    {
        value: 'Active',
        label: 'Active',
        description: 'Driver is available for duty',
        icon: Activity,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
    },
    {
        value: 'Inactive',
        label: 'Inactive',
        description: 'Driver is not available',
        icon: Power,
        color: 'text-red-600',
        bgColor: 'bg-red-100'
    },
    {
        value: 'OnDuty',
        label: 'On Duty',
        description: 'Driver is currently working',
        icon: Briefcase,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
    },
    {
        value: 'OffDuty',
        label: 'Off Duty',
        description: 'Driver is not scheduled to work',
        icon: Power,
        color: 'text-gray-600',
        bgColor: 'bg-gray-100'
    },
    {
        value: 'OnBreak',
        label: 'On Break',
        description: 'Driver is taking a short break',
        icon: Coffee,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
    },
    {
        value: 'OnLeave',
        label: 'On Leave',
        description: 'Driver is on vacation or leave',
        icon: Umbrella,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
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
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleConfirm = () => {
        if (selectedStatus === 'Inactive') {
            setShowConfirmation(true);
        } else {
            onConfirm(selectedStatus);
        }
    };

    const handleFinalConfirm = () => {
        onConfirm(selectedStatus);
        setShowConfirmation(false);
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
        <>
            <BaseModal
                isOpen={isOpen && !showConfirmation}
                onClose={onClose}
                title="Change Driver Status"
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
                                        <div className="font-medium">{currentStatusObj.label}</div>
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
                                                    <div className="font-medium">{option.label}</div>
                                                    <div className="text-sm text-gray-600">{option.description}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Warning for specific status changes */}
                        {selectedStatus === 'Inactive' && currentStatus !== 'Inactive' && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-yellow-800">Important Note</p>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            Setting driver to Inactive will:
                                        </p>
                                        <ul className="text-sm text-yellow-700 mt-1 list-disc pl-4 space-y-1">
                                            <li>Remove driver from all active schedules</li>
                                            <li>Unassign driver from current bus and route</li>
                                            <li>Make driver unavailable for new assignments</li>
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

            {/* Confirmation Modal for Inactive Status */}
            <BaseModal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                title="Confirm Status Change"
                size="sm"
            >
                <div className="space-y-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle size={40} className="text-red-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Set Driver to Inactive?</h3>
                        <p className="text-gray-600">
                            Are you sure you want to set this driver to Inactive? This will:
                        </p>
                        <ul className="text-sm text-gray-600 mt-2 space-y-1 text-left">
                            <li>• Remove from all active schedules</li>
                            <li>• Unassign from current bus and route</li>
                            <li>• Make unavailable for new assignments</li>
                        </ul>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => setShowConfirmation(false)}
                            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleFinalConfirm}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                            Yes, Set Inactive
                        </button>
                    </div>
                </div>
            </BaseModal>
        </>
    );
};

export default ChangeStatusModal;