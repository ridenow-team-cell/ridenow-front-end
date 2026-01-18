"use client"
import React from 'react';
import { MapPin, Users, Calendar, Clock, Route as RouteIcon, User, Phone, Mail, Car, Award, Star, Shield, TrendingUp, Clock as ClockIcon, CheckCircle, AlertCircle } from 'lucide-react';
import BaseModal from './BaseModal';
import { useDriverDetails } from '@/hooks/use-drivers';
import { driverService } from '@/services/driver-service';

interface DriverDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    driverId: string;
}

const DriverDetailsModal: React.FC<DriverDetailsModalProps> = ({
    isOpen,
    onClose,
    driverId
}) => {
    const { data: driverDetails, isLoading, error } = useDriverDetails(driverId);

    if (isLoading) {
        return (
            <BaseModal isOpen={isOpen} onClose={onClose} title="Driver Details" size="xl">
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC]"></div>
                </div>
            </BaseModal>
        );
    }

    if (error || !driverDetails) {
        return (
            <BaseModal isOpen={isOpen} onClose={onClose} title="Driver Details" size="xl">
                <div className="text-center p-8">
                    <p className="text-red-500">Failed to load driver details</p>
                </div>
            </BaseModal>
        );
    }

    // Access the nested driver data from API response
    const driver = driverDetails.driver || driverDetails;
    const bus = driverDetails.bus;
    const route = driverDetails.route;
    const statistics = driverDetails.statistics || {};
    const activeSchedules = driverDetails.activeSchedules || [];

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Driver Details" size="xl">
            <div className="space-y-6">
                {/* Driver Profile Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {driver.photoUrl ? (
                                <img
                                    src={driver.photoUrl}
                                    alt={driver.fullName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-3xl text-gray-600 font-bold">
                                        {driver.fullName?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                        <span className={`absolute -top-1 -right-1 px-2 py-1 rounded-full text-xs font-medium ${driverService.getStatusColor(driver.status)}`}>
                            {driverService.getStatusBadge(driver.status)}
                        </span>
                    </div>

                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800">{driver.fullName}</h2>
                        <div className="flex flex-wrap gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <Mail size={16} className="text-gray-400" />
                                <span className="text-gray-600">{driver.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={16} className="text-gray-400" />
                                <span className="text-gray-600">{driver.phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award size={16} className="text-gray-400" />
                                <span className="text-gray-600">{driver.licenseNumber}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Driver Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Full Name:</span>
                                <span className="font-medium text-gray-800">{driver.fullName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Email:</span>
                                <span className="font-medium text-gray-800">{driver.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Phone:</span>
                                <span className="font-medium text-gray-800">{driver.phoneNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">License Number:</span>
                                <span className="font-medium text-gray-800">{driver.licenseNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Active Status:</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${driver.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {driver.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Joined Date:</span>
                                <span className="font-medium text-gray-800">
                                    {driverService.formatDate(driver.createdAt)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Last Active:</span>
                                <span className="font-medium text-gray-800">
                                    {driver.lastActiveAt ? driverService.formatDate(driver.lastActiveAt) : 'Never'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Assignments</h3>
                        <div className="space-y-4">
                            {/* Bus Assignment */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <Car size={20} className="text-blue-600" />
                                    <span className="font-medium text-gray-700">Assigned Bus</span>
                                </div>
                                {bus ? (
                                    <div className="pl-8">
                                        <div className="font-medium text-gray-800">{bus.name}</div>
                                        <div className="text-sm text-gray-600">
                                            Model: {bus.model} • Registration: {bus.registrationName}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            Status: <span className={`px-1 rounded ${bus.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {bus.status}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="pl-8 text-gray-500 italic">No bus assigned</div>
                                )}
                            </div>

                            {/* Route Assignment */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <RouteIcon size={20} className="text-green-600" />
                                    <span className="font-medium text-gray-700">Assigned Route</span>
                                </div>
                                {route ? (
                                    <div className="pl-8">
                                        <div className="font-medium text-gray-800">{route.name}</div>
                                        <div className="text-sm text-gray-600">
                                            {route.description}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            Status: <span className={`px-1 rounded ${route.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {route.status}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="pl-8 text-gray-500 italic">No route assigned</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Schedules */}
                {activeSchedules.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Schedules ({activeSchedules.length})</h3>
                        <div className="space-y-3">
                            {activeSchedules.slice(0, 3).map((schedule: any, index: number) => (
                                <div key={schedule.id || index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="font-medium text-gray-800">Schedule #{index + 1}</div>
                                            <div className="text-sm text-gray-600">{schedule.routeId || 'Unknown Route'}</div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${schedule.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                                            schedule.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {schedule.status || 'Unknown'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <ClockIcon size={14} />
                                            <span>{schedule.departureTime || '--:--'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users size={14} />
                                            <span>{schedule.numberOfAvailableSeats || 0} seats</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {activeSchedules.length > 3 && (
                                <div className="text-center pt-2">
                                    <span className="text-sm text-gray-500">
                                        +{activeSchedules.length - 3} more schedules
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Performance Statistics */}
                {statistics && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">{statistics.totalTrips || 0}</div>
                                <div className="text-sm text-blue-800">Total Trips</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">{statistics.activeTrips || 0}</div>
                                <div className="text-sm text-green-800">Active Trips</div>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {(statistics.averageRating || 0).toFixed(1)}/5.0
                                </div>
                                <div className="flex justify-center mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={`${i < Math.floor(statistics.averageRating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {(statistics.safetyRating * 100 || 0).toFixed(0)}%
                                </div>
                                <div className="text-sm text-purple-800">Safety Rating</div>
                            </div>
                        </div>

                        {/* Additional Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle size={18} className="text-green-600" />
                                    <span className="font-medium text-gray-700">On-Time Rate</span>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-800">
                                        {(statistics.onTimeRate * 100 || 0).toFixed(1)}%
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">Punctuality Score</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield size={18} className="text-blue-600" />
                                    <span className="font-medium text-gray-700">Safety Metrics</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Safety Rating:</span>
                                        <span className="font-medium text-gray-800">
                                            {(statistics.safetyRating * 100 || 0).toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Reviews:</span>
                                        <span className="font-medium text-gray-800">
                                            {statistics.totalReviews || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp size={18} className="text-orange-600" />
                                    <span className="font-medium text-gray-700">Performance</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Average Rating:</span>
                                        <span className="font-medium text-gray-800">
                                            {(statistics.averageRating || 0).toFixed(1)}/5.0
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Active Trips:</span>
                                        <span className="font-medium text-gray-800">
                                            {statistics.activeTrips || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Statistics Message */}
                {(!statistics || Object.keys(statistics).length === 0) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle size={24} className="text-yellow-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-yellow-800">No Performance Data Available</h4>
                                <p className="text-sm text-yellow-700 mt-1">
                                    This driver has not completed any trips yet. Performance statistics will be available after the driver starts working.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {

                            onClose();
                        }}
                        className="px-6 py-2 bg-[#0066CC] text-white rounded-lg font-medium hover:bg-[#0055AA] transition-colors"
                    >
                        Edit Driver
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default DriverDetailsModal;