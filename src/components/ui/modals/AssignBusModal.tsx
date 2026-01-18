"use client"
import React, { useState } from 'react';
import { ChevronDown, Car } from 'lucide-react';
import BaseModal from './BaseModal';

interface AssignBusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (busId: string) => void;
    currentBusId?: string;
    buses: Array<{
        id: string;
        name: string;
        registrationName: string;
        status: string;
    }>;
}

const AssignBusModal: React.FC<AssignBusModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    currentBusId = '',
    buses
}) => {
    const [selectedBusId, setSelectedBusId] = useState<string>(currentBusId);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleConfirm = () => {
        onConfirm(selectedBusId);
    };

    const handleBusSelect = (busId: string) => {
        setSelectedBusId(busId);
        setShowDropdown(false);
    };

    const getCurrentBusName = () => {
        if (!selectedBusId) return 'Select Bus';
        const bus = buses.find(b => b.id === selectedBusId);
        return bus ? `${bus.name} (${bus.registrationName})` : 'Select Bus';
    };

    const availableBuses = buses.filter(bus => bus.status === 'Available');

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Assign Bus to Driver"
            size="md"
        >
            <div className="space-y-6">
                <div>
                    <p className="text-gray-600 mb-4">
                        {currentBusId
                            ? 'Change the bus assigned to this driver'
                            : 'Assign a bus to this driver'
                        }
                    </p>

                    <label className="block text-gray-800 text-base font-medium mb-3">
                        Select Bus *
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <Car size={20} className="text-gray-400" />
                                <span>{getCurrentBusName()}</span>
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
                                    {/* Option to remove bus assignment */}
                                    <button
                                        type="button"
                                        onClick={() => handleBusSelect('')}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-500"
                                    >
                                        <Car size={20} />
                                        <div>
                                            <div className="font-medium text-gray-400">No Bus</div>
                                            <div className="text-sm">Remove bus assignment</div>
                                        </div>
                                    </button>

                                    {/* Available buses */}
                                    {availableBuses.map(bus => (
                                        <button
                                            key={bus.id}
                                            type="button"
                                            onClick={() => handleBusSelect(bus.id)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                                        >
                                            <Car size={20} className="text-blue-600" />
                                            <div>
                                                <div className="font-medium text-gray-400">{bus.name}</div>
                                                <div className="text-sm text-gray-600">
                                                    Registration: {bus.registrationName}
                                                </div>
                                            </div>
                                        </button>
                                    ))}

                                    {availableBuses.length === 0 && (
                                        <div className="px-4 py-3 text-gray-500 text-center">
                                            No available buses
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Bus Status Summary */}
                    {availableBuses.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <span className="font-medium">{availableBuses.length}</span> bus{availableBuses.length !== 1 ? 'es' : ''} available for assignment
                            </p>
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
                        disabled={selectedBusId === currentBusId}
                    >
                        {currentBusId ? 'Update Assignment' : 'Assign Bus'}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default AssignBusModal;