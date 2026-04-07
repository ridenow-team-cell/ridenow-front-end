"use client"
import React from 'react';
import { MapPin, Users, Calendar, Clock, Route as RouteIcon, User, Phone, Mail, Car, Award, Star, Shield, TrendingUp, Clock as ClockIcon, CheckCircle, AlertCircle } from 'lucide-react';
import SideModal from './SideModal';
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
            <SideModal isOpen={isOpen} onClose={onClose} title="Driver Details">
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC]"></div>
                </div>
            </SideModal>
        );
    }

    if (error || !driverDetails) {
        return (
            <SideModal isOpen={isOpen} onClose={onClose} title="Driver Details">
                <div className="text-center p-8">
                    <p className="text-red-500">Failed to load driver details</p>
                </div>
            </SideModal>
        );
    }

    // Access the nested driver data from API response
    const driver = (driverDetails as any).driver || driverDetails;
    const bus = driverDetails.bus;
    const route = driverDetails.route;
    const statistics = driverDetails.statistics || {
        totalTrips: 0,
        completedTrips: 0,
        activeTrips: 0,
        averageRating: 0,
        safetyRating: 0,
        onTimeRate: 0,
        totalReviews: 0
    };
    const activeSchedules = driverDetails.activeSchedules || [];

    return (
        <SideModal isOpen={isOpen} onClose={onClose} title="Driver Details">
            <div className="space-y-6 pb-6">
                {/* Driver Profile Header */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full border-2 border-white overflow-hidden bg-white flex items-center justify-center shadow-sm">
                                {driver.photoUrl ? (
                                    <img
                                        src={driver.photoUrl}
                                        alt={driver.fullName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-gray-400">{driver.fullName?.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
                                <div className={`w-3 h-3 rounded-full ${driver.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900">{driver.fullName}</h2>
                            <div className="flex flex-col gap-1 text-sm text-gray-500 mt-1 font-medium">
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-gray-400" />
                                    <span>{driver.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-gray-400" />
                                    <span>{driver.phoneNumber}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Identity Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Shield size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">License Num</span>
                        </div>
                        <p className="text-lg font-bold text-gray-800">{driver.licenseNumber}</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Calendar size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Member Since</span>
                        </div>
                        <p className="text-lg font-bold text-gray-800">{driverService.formatDate(driver.createdAt)}</p>
                    </div>
                </div>

                {/* Performance Analytics */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Performance Metrics</h4>
                        <div className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-bold text-gray-700">{(statistics.averageRating || 0).toFixed(1)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{statistics.totalTrips || 0}</p>
                            <p className="text-[10px] text-gray-500 font-medium">Total Trips</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">{(statistics.onTimeRate * 100 || 0).toFixed(0)}%</p>
                            <p className="text-[10px] text-gray-500 font-medium">Punctuality</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-600">{statistics.activeTrips || 0}</p>
                            <p className="text-[10px] text-gray-500 font-medium">Active Now</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-purple-600">{(statistics.safetyRating * 100 || 0).toFixed(0)}%</p>
                            <p className="text-[10px] text-gray-500 font-medium">Safety Score</p>
                        </div>
                    </div>
                </div>

                {/* Assignments */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Active Duty</h4>
                    
                    {/* Bus Assignment */}
                    <div className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-1.5 bg-gray-50 text-gray-600 rounded-lg">
                                <Car size={18} />
                            </div>
                            <h5 className="font-bold text-gray-800">Vehicle Assignment</h5>
                        </div>
                        {bus ? (
                            <div>
                                <p className="text-sm font-bold text-gray-900">{bus.name}</p>
                                <p className="text-xs text-gray-500">Model: {bus.model} • Reg: {bus.registrationName}</p>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">No vehicle assigned</p>
                        )}
                    </div>

                    {/* Route Assignment */}
                    <div className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-1.5 bg-gray-50 text-gray-600 rounded-lg">
                                <RouteIcon size={18} />
                            </div>
                            <h5 className="font-bold text-gray-800">Assigned Route</h5>
                        </div>
                        {route ? (
                            <div>
                                <p className="text-sm font-bold text-gray-900">{route.name}</p>
                                <p className="text-xs text-gray-500 line-clamp-1">{route.description}</p>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">No route assigned</p>
                        )}
                    </div>
                </div>

                {/* Shifts */}
                {activeSchedules.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Upcoming Shifts</h4>
                        {activeSchedules.slice(0, 3).map((schedule: any, index: number) => (
                            <div key={schedule.id || index} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <ClockIcon size={16} className="text-gray-400" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{schedule.departureTime || '--:--'}</p>
                                        <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Next Departure</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${schedule.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {schedule.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SideModal>
    );
};

export default DriverDetailsModal;