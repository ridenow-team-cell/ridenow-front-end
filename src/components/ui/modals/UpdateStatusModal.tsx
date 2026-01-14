"use client"
import React, { useState } from 'react';
import BaseModal from './BaseModal';

interface UpdateStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: {
        id: number;
        ticketId: string;
        status: string;
    };
    onUpdateStatus: (newStatus: string) => void;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ isOpen, onClose, ticket, onUpdateStatus }) => {
    const [selectedStatus, setSelectedStatus] = useState(ticket.status);

    const statusOptions = [
        { value: 'Open', label: 'Open', color: 'text-red-600' },
        { value: 'In-Progress', label: 'In Progress', color: 'text-yellow-600' },
        { value: 'Resolved', label: 'Resolved', color: 'text-green-600' }
    ];

    const handleSubmit = () => {
        onUpdateStatus(selectedStatus);
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Update Ticket Status" size="md">
            <div className="space-y-6">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">
                        Update status for ticket <span className="font-semibold">{ticket.ticketId}</span>
                    </p>
                </div>

                {/* Status Options */}
                <div className="space-y-3">
                    {statusOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setSelectedStatus(option.value)}
                            className={`w-full p-4 text-left rounded-lg border transition-colors ${selectedStatus === option.value
                                    ? 'border-[#0066CC] bg-blue-50'
                                    : 'border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${option.color.replace('text', 'bg')}`}></div>
                                <span className="font-medium">{option.label}</span>
                                {selectedStatus === option.value && (
                                    <div className="ml-auto w-5 h-5 bg-[#0066CC] rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Optional Notes */}
                <div>
                    <label className="text-sm text-gray-600 block mb-2">Notes (Optional)</label>
                    <textarea
                        placeholder="Add any notes about this status change..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                        rows={3}
                    />
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0055AA] transition-colors"
                    >
                        Update Status
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export { UpdateStatusModal };