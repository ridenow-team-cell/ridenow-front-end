"use client"
import React, { useState } from 'react';
import { ChevronDown, Route as RouteIcon } from 'lucide-react';
import BaseModal from './BaseModal';

interface AssignRouteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (routeId: string) => void;
    currentRouteId?: string;
    routes: Array<{
        id: string;
        name: string;
        description: string;
        status: string;
        stops: number;
        distance: number;
    }>;
}

const AssignRouteModal: React.FC<AssignRouteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    currentRouteId = '',
    routes
}) => {
    const [selectedRouteId, setSelectedRouteId] = useState<string>(currentRouteId);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleConfirm = () => {
        onConfirm(selectedRouteId);
    };

    const handleRouteSelect = (routeId: string) => {
        setSelectedRouteId(routeId);
        setShowDropdown(false);
    };

    const getCurrentRouteName = () => {
        if (!selectedRouteId) return 'Select Route';
        const route = routes.find(r => r.id === selectedRouteId);
        return route ? route.name : 'Select Route';
    };

    const activeRoutes = routes.filter(route => route.status === 'Active');

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Assign Route to Driver"
            size="md"
        >
            <div className="space-y-6">
                <div>
                    <p className="text-gray-600 mb-4">
                        {currentRouteId
                            ? 'Change the route assigned to this driver'
                            : 'Assign a route to this driver'
                        }
                    </p>

                    <label className="block text-gray-800 text-base font-medium mb-3">
                        Select Route *
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <RouteIcon size={20} className="text-gray-400" />
                                <span>{getCurrentRouteName()}</span>
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
                                    {/* Option to remove route assignment */}
                                    <button
                                        type="button"
                                        onClick={() => handleRouteSelect('')}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-500"
                                    >
                                        <RouteIcon size={20} />
                                        <div>
                                            <div className="font-medium text-gray-400">No Route</div>
                                            <div className="text-sm">Remove route assignment</div>
                                        </div>
                                    </button>

                                    {/* Active routes */}
                                    {activeRoutes.map(route => (
                                        <button
                                            key={route.id}
                                            type="button"
                                            onClick={() => handleRouteSelect(route.id)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                                        >
                                            <RouteIcon size={20} className="text-green-600" />
                                            <div>
                                                <div className="font-medium text-gray-400">{route.name}</div>
                                                <div className="text-sm text-gray-600">
                                                    {route.stops} stops • {route.distance} km
                                                </div>
                                            </div>
                                        </button>
                                    ))}

                                    {activeRoutes.length === 0 && (
                                        <div className="px-4 py-3 text-gray-500 text-center">
                                            No active routes available
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Route Details Preview */}
                    {selectedRouteId && activeRoutes.find(r => r.id === selectedRouteId) && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-2">Route Details</h4>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Stops:</span>
                                    <span>{activeRoutes.find(r => r.id === selectedRouteId)?.stops}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Distance:</span>
                                    <span>{activeRoutes.find(r => r.id === selectedRouteId)?.distance} km</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Status:</span>
                                    <span className="text-green-600 font-medium">Active</span>
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
                        disabled={selectedRouteId === currentRouteId}
                    >
                        {currentRouteId ? 'Update Assignment' : 'Assign Route'}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default AssignRouteModal;