"use client"
import React from 'react';
import { Bus, Clock, MapPin, Users, Calendar, Wrench, Route, User } from 'lucide-react';
import BaseModal from './BaseModal';
import { BusDetails } from '@/types/bus';
import { busService } from '@/services/bus-service';

interface BusDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    busDetails: BusDetails | null;
}

const BusDetailsModal: React.FC<BusDetailsModalProps> = ({
    isOpen,
    onClose,
    busDetails
}) => {
    if (!busDetails) return null;

    const { bus, driver, route, activeSchedules, utilization } = busDetails;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Bus Details"
            size="xl"
        >
            <div className="space-y-6">
                {/* Bus Basic Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{bus.name}</h3>
                            <p className="text-sm text-gray-600">{bus.model} • {bus.make} • {bus.year}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${busService.getStatusColor(bus.status)}`}>
                                {bus.status}
                            </span>
                            <span className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${bus.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {bus.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Bus className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Registration</p>
                                <p className="font-medium text-gray-400">{bus.registrationName}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: bus.color.toLowerCase() }}></div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Color</p>
                                <p className="font-medium text-gray-400">{bus.color}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <Users className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Seats</p>
                                <p className="font-medium text-gray-400">{bus.totalSeats}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Added On</p>
                                <p className="font-medium text-gray-400">{busService.formatDate(bus.createdAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Driver & Route Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Driver Info */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <User className="w-5 h-5 text-gray-600" />
                            <h4 className="font-semibold text-gray-800">Assigned Driver</h4>
                        </div>
                        {driver ? (
                            <div className="space-y-2">
                                <p className="font-medium text-gray-400">{driver.fullName}</p>
                                <p className="text-sm text-gray-600">{driver.email}</p>
                                <p className="text-sm text-gray-600">{driver.phoneNumber}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No driver assigned</p>
                        )}
                    </div>

                    {/* Route Info */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <Route className="w-5 h-5 text-gray-600" />
                            <h4 className="font-semibold text-gray-800">Current Route</h4>
                        </div>
                        {route ? (
                            <div className="space-y-2">
                                <p className="font-medium text-gray-400">{route.name}</p>
                                <p className="text-sm text-gray-600">{route.description}</p>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        {route.stops.length} stops
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No route assigned</p>
                        )}
                    </div>
                </div>

                {/* Utilization Stats */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Utilization Statistics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-800">{utilization.totalTrips}</p>
                            <p className="text-sm text-gray-600">Total Trips</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{utilization.completedTrips}</p>
                            <p className="text-sm text-gray-600">Completed</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{utilization.activeTrips}</p>
                            <p className="text-sm text-gray-600">Active</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">
                                {(utilization.seatUtilization * 100).toFixed(1)}%
                            </p>
                            <p className="text-sm text-gray-600">Seat Utilization</p>
                        </div>
                    </div>
                </div>

                {/* Active Schedules */}
                {activeSchedules.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <Clock className="w-5 h-5 text-gray-600" />
                            <h4 className="font-semibold text-gray-800">Active Schedules</h4>
                        </div>
                        <div className="space-y-3">
                            {activeSchedules.map((schedule) => (
                                <div key={schedule.id} className="border border-gray-100 rounded p-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-gray-400">
                                                {busService.formatTime(schedule.departureTime)} - {busService.formatTime(schedule.arrivalTime)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {schedule.daysOfWeek.join(', ')}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                {schedule.numberOfAvailableSeats} seats available
                                            </span>
                                            <span className={`px-2 py-1 text-xs rounded ${schedule.status === 'Scheduled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {schedule.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Maintenance Status */}
                {bus.status === 'Maintenance' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <Wrench className="w-5 h-5 text-yellow-600" />
                            <h4 className="font-semibold text-yellow-800">Maintenance Note</h4>
                        </div>
                        <p className="text-sm text-yellow-700 mt-2">
                            This bus is currently under maintenance. Expected return to service: Soon
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052a3] transition-colors"
                >
                    Close
                </button>
            </div>
        </BaseModal>
    );
};

export default BusDetailsModal;