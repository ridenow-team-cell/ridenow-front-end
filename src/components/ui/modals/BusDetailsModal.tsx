"use client"
import React from 'react';
import { Bus, Clock, MapPin, Users, Calendar, Wrench, Route, User } from 'lucide-react';
import SideModal from './SideModal';
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
        <SideModal
            isOpen={isOpen}
            onClose={onClose}
            title="Bus Details"
        >
            <div className="space-y-6 pb-6">
                {/* Header Information */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${bus.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {bus.status}
                            </span>
                            <h3 className="text-xl font-bold text-gray-900">{bus.name}</h3>
                            <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                                <Bus size={14} />
                                {bus.model} • {bus.make} • {bus.year}
                            </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${bus.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {bus.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </div>
                    </div>
                </div>

                {/* Key Specifications Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Users size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Capacity</span>
                        </div>
                        <p className="text-lg font-bold text-gray-800">{bus.totalSeats} Seats</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <MapPin size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Registration</span>
                        </div>
                        <p className="text-lg font-bold text-gray-800">{bus.registrationName}</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: bus.color.toLowerCase() }}></div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Color</span>
                        </div>
                        <p className="text-lg font-bold text-gray-800">{bus.color}</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Calendar size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Added On</span>
                        </div>
                        <p className="text-lg font-bold text-gray-800">{busService.formatDate(bus.createdAt)}</p>
                    </div>
                </div>

                {/* Performance Stats */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Operational Performance</h4>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{utilization.totalTrips}</p>
                            <p className="text-[10px] text-gray-500 font-medium">Total Trips</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">{utilization.completedTrips}</p>
                            <p className="text-[10px] text-gray-500 font-medium">Completed</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-600">{utilization.activeTrips}</p>
                            <p className="text-[10px] text-gray-500 font-medium">Active Now</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-purple-600">{(utilization.seatUtilization * 100).toFixed(0)}%</p>
                            <p className="text-[10px] text-gray-500 font-medium">Efficiency</p>
                        </div>
                    </div>
                </div>

                {/* Assignment Details */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Current Assignment</h4>
                    
                    {/* Driver Card */}
                    <div className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                                <User size={18} />
                            </div>
                            <h5 className="font-bold text-gray-800">Driver</h5>
                        </div>
                        {driver ? (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                    {driver.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{driver.name}</p>
                                    <p className="text-xs text-gray-500">{driver.phoneNo}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">No driver assigned</p>
                        )}
                    </div>

                    {/* Route Card */}
                    <div className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-1.5 bg-green-50 text-green-600 rounded-lg">
                                <Route size={18} />
                            </div>
                            <h5 className="font-bold text-gray-800">Active Route</h5>
                        </div>
                        {route ? (
                            <div>
                                <p className="text-sm font-bold text-gray-900">{route.name}</p>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{route.description}</p>
                                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded">
                                    <MapPin size={12} />
                                    <span>{route.stops.length} STOPS</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">No route assigned</p>
                        )}
                    </div>
                </div>

                {/* Schedules */}
                {activeSchedules.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Upcoming Schedule</h4>
                        {activeSchedules.map((schedule) => (
                            <div key={schedule.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-gray-400" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">
                                            {busService.formatTime(schedule.departureTime)} - {busService.formatTime(schedule.arrivalTime)}
                                        </p>
                                        <p className="text-[10px] text-gray-500">
                                            {schedule.daysOfWeek.join(', ')}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-blue-600">{schedule.numberOfAvailableSeats} seats left</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SideModal>
    );
};

export default BusDetailsModal;