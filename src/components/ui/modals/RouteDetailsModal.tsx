"use client"
import React from 'react';
import { MapPin, Clock, Route as RouteIcon, Calendar, Users, Car, Navigation, Bus, Star, TrendingUp, BarChart3, Route } from 'lucide-react';
import BaseModal from './BaseModal';
import { useRouteDetails } from '@/hooks/use-routes';
import { routeService } from '@/services/route-service';
import { scheduleService } from '@/services/schedule-service';

interface RouteDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    routeId: string;
}

const RouteDetailsModal: React.FC<RouteDetailsModalProps> = ({
    isOpen,
    onClose,
    routeId
}) => {
    const { data: routeDetails, isLoading, error } = useRouteDetails(routeId);

    if (isLoading) {
        return (
            <BaseModal isOpen={isOpen} onClose={onClose} title="Route Details" size="xl">
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC]"></div>
                </div>
            </BaseModal>
        );
    }

    if (error || !routeDetails) {
        return (
            <BaseModal isOpen={isOpen} onClose={onClose} title="Route Details" size="xl">
                <div className="text-center p-8">
                    <p className="text-red-500">Failed to load route details</p>
                </div>
            </BaseModal>
        );
    }

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Route Details" size="xl">
            <div className="space-y-6">
                {/* Route Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{routeDetails.route.name}</h2>
                        <p className="text-gray-600 mt-1">{routeDetails.route.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${routeService.getStatusColor(routeDetails.route.status)}`}>
                            {routeDetails.route.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${routeDetails.route.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {routeDetails.route.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                {/* Route Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <div>
                                <div className="text-2xl font-bold text-blue-600">{routeDetails.route.stops.length}</div>
                                <div className="text-sm text-blue-800">Stops</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Navigation className="w-5 h-5 text-green-600" />
                            <div>
                                <div className="text-2xl font-bold text-green-600">{routeService.formatDistance(routeDetails.route.distance)}</div>
                                <div className="text-sm text-green-800">Distance</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-5 h-5 text-purple-600" />
                            <div>
                                <div className="text-2xl font-bold text-purple-600">
                                    {routeService.formatDuration(routeDetails.route.estimatedDuration)}
                                </div>
                                <div className="text-sm text-purple-800">Duration</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Bus className="w-5 h-5 text-yellow-600" />
                            <div>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {routeDetails.assignedBuses?.length || 0}
                                </div>
                                <div className="text-sm text-yellow-800">Assigned Buses</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Stops and Statistics */}
                    <div className="space-y-6">
                        {/* Stops List */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <RouteIcon className="w-5 h-5 text-gray-600" />
                                Route Stops
                            </h3>
                            <div className="space-y-4">
                                {routeDetails.route.stops.map((stop, index) => (
                                    <div key={index} className="flex items-start gap-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 bg-[#E7A533] rounded-full flex items-center justify-center">
                                                <span className="text-white font-medium">{stop.order}</span>
                                            </div>
                                            {index < routeDetails.route.stops.length - 1 && (
                                                <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium text-gray-800">{stop.name}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{stop.address}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {stop.isPickupPoint && (
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                            Pickup
                                                        </span>
                                                    )}
                                                    {stop.isDropoffPoint && (
                                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                            Dropoff
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                                <div className="text-gray-500">
                                                    <span className="font-medium">Time:</span> {stop.estimatedArrivalTimeOffset}
                                                </div>
                                                <div className="text-gray-500">
                                                    <span className="font-medium">Coordinates:</span> {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Route Statistics */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-gray-600" />
                                Route Statistics
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(routeDetails.statistics).map(([key, value]) => (
                                    <div key={key} className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-sm text-gray-600 capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </div>
                                        <div className="text-xl font-bold text-gray-800 mt-1">
                                            {typeof value === 'number' ? value.toLocaleString() : value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Buses and Schedules */}
                    <div className="space-y-6">
                        {/* Assigned Buses */}
                        {routeDetails.assignedBuses && routeDetails.assignedBuses.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Bus className="w-5 h-5 text-gray-600" />
                                    Assigned Buses
                                </h3>
                                <div className="space-y-3">
                                    {routeDetails.assignedBuses.map(bus => (
                                        <div key={bus.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <Car className="w-5 h-5 text-blue-600" />
                                                    <div>
                                                        <h4 className="font-medium text-gray-800">{bus.name}</h4>
                                                        <p className="text-sm text-gray-600">{bus.registrationName}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${routeService.getStatusColor(bus.status)}`}>
                                                    {bus.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                                <div>Model: {bus.model}</div>
                                                <div>Seats: {bus.totalSeats}</div>
                                                <div>Color: {bus.color}</div>
                                                <div>Year: {bus.year}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Active Schedules */}
                        {routeDetails.activeSchedules && routeDetails.activeSchedules.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-gray-600" />
                                    Active Schedules
                                </h3>
                                <div className="space-y-3">
                                    {routeDetails.activeSchedules.map(schedule => (
                                        <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <div className="font-medium text-gray-800">
                                                        {scheduleService.formatTime(schedule.departureTime)} - {scheduleService.formatTime(schedule.arrivalTime)}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        Days: {scheduleService.formatDays(schedule.daysOfWeek)}
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${scheduleService.getStatusColor(schedule.status)}`}>
                                                    {schedule.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <div className="text-gray-600">Available Seats</div>
                                                    <div className="text-xl font-bold text-gray-800">
                                                        {schedule.numberOfAvailableSeats}/{schedule.seats.length}
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <div className="text-gray-600">Schedule Type</div>
                                                    <div className="font-medium text-gray-800">
                                                        {schedule.recurring ? 'Recurring' : 'One-time'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 text-sm text-gray-600">
                                                <div>Period: {scheduleService.formatDate(schedule.startDate)} to {scheduleService.formatDate(schedule.endDate)}</div>
                                                <div className="mt-1">Stops: {schedule.stops.length}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Route Metadata */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Route Information</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Created</span>
                                    <span className="font-medium text-gray-800">
                                        {routeService.formatDate(routeDetails.route.createdAt)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Last Updated</span>
                                    <span className="font-medium text-gray-800">
                                        {routeService.formatDate(routeDetails.route.updatedAt)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Route ID</span>
                                    <span className="font-medium text-gray-800 text-sm">{routeDetails.route.id}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Statistics */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-gray-600" />
                        Performance Statistics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-3 mb-3">
                                <Users className="w-6 h-6 text-blue-600" />
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">
                                        {routeDetails.statistics.totalSchedules}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Schedules</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-green-600">
                                    Active: {routeDetails.statistics.activeSchedules}
                                </div>
                                <div className="text-blue-600">
                                    Upcoming: {routeDetails.statistics.upcomingSchedules}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-3 mb-3">
                                <MapPin className="w-6 h-6 text-green-600" />
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">
                                        {routeDetails.statistics.pickupStops}
                                    </div>
                                    <div className="text-sm text-gray-600">Pickup Points</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-600">
                                    Dropoff: {routeDetails.statistics.dropoffStops}
                                </div>
                                <div className="text-gray-600">
                                    Total: {routeDetails.statistics.totalStops}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-3 mb-3">
                                <Star className="w-6 h-6 text-yellow-600" />
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">
                                        {routeDetails.statistics.averageRating || 0}/5.0
                                    </div>
                                    <div className="text-sm text-gray-600">Average Rating</div>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">
                                Based on {routeDetails.statistics.totalReviews || 0} reviews
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            // Handle edit route
                            onClose();
                        }}
                        className="px-6 py-2 bg-[#0066CC] text-white rounded-lg font-medium hover:bg-[#0055AA] transition-colors"
                    >
                        Edit Route
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default RouteDetailsModal;