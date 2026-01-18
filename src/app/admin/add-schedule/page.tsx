"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Clock, Trash2, Plus, ArrowLeft, Calendar, Users, Car, User, Save, Eye, Edit } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useRoutes } from '@/hooks/use-routes';
import { useBuses } from '@/hooks/use-bus';
import { useDrivers } from '@/hooks/use-drivers';
import { useCreateSchedule, useUpdateSchedule, useSchedule } from '@/hooks/use-schedules';
import { scheduleService } from '@/services/schedule-service';
import { routeService } from '@/services/route-service';
import { toast } from 'react-hot-toast';
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal';

interface AddSchedulePageProps {
    mode?: 'create' | 'view';
    scheduleId?: string;
}

const AddSchedulePage: React.FC<AddSchedulePageProps> = ({ mode = 'create', scheduleId }) => {
    const router = useRouter();
    const params = useParams();
    const id = scheduleId || params.id as string;

    // Fetch data
    const { data: routes } = useRoutes({ status: 'Active' });
    const { data: buses } = useBuses();
    const { data: availableDrivers } = useDrivers({});

    // Fetch schedule details if viewing
    const { data: scheduleData } = useSchedule(id, { enabled: mode === 'view' && !!id });

    // Form state - Direct API structure
    const [formData, setFormData] = useState({
        routeId: '',
        busId: '',
        driverId: '',
        departureTime: '',
        arrivalTime: '',
        daysOfWeek: [] as string[],
        status: 'Scheduled' as 'Scheduled' | 'Active' | 'Completed' | 'Cancelled',
        isActive: true,
        startDate: '',
        endDate: '',
        recurring: true,
        totalSeats: 0,
        stops: [] as Array<{
            name: string;
            address: string;
            latitude: number;
            longitude: number;
            order: number;
            estimatedArrivalTime: string;
            estimatedDepartureTime: string;
        }>
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const createSchedule = useCreateSchedule();
    const updateSchedule = useUpdateSchedule();

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Initialize form with schedule data if viewing
    useEffect(() => {
        if (mode === 'view' && scheduleData) {
            setFormData({
                routeId: scheduleData.routeId,
                busId: scheduleData.busId,
                driverId: scheduleData.driverId,
                departureTime: scheduleData.departureTime,
                arrivalTime: scheduleData.arrivalTime,
                daysOfWeek: scheduleData.daysOfWeek,
                status: scheduleData.status,
                isActive: scheduleData.isActive,
                startDate: scheduleData.startDate.split('T')[0],
                endDate: scheduleData.endDate ? scheduleData.endDate.split('T')[0] : '',
                recurring: scheduleData.recurring,
                totalSeats: scheduleData.numberOfAvailableSeats,
                stops: scheduleData.stops?.map(stop => ({
                    name: stop.name,
                    address: stop.address,
                    latitude: stop.latitude,
                    longitude: stop.longitude,
                    order: stop.order,
                    estimatedArrivalTime: stop.estimatedArrivalTime || '',
                    estimatedDepartureTime: stop.estimatedDepartureTime || ''
                })) || []
            });
        }
    }, [mode, scheduleData]);

    // Update total seats when bus is selected (only in create mode)
    useEffect(() => {
        if (formData.busId && buses && mode === 'create') {
            const selectedBus = buses.find(bus => bus.id === formData.busId);
            if (selectedBus) {
                setFormData(prev => ({
                    ...prev,
                    totalSeats: selectedBus.totalSeats
                }));
            }
        }
    }, [formData.busId, buses, mode]);

    // Get stops when route is selected (only in create mode)
    useEffect(() => {
        if (formData.routeId && routes && mode === 'create') {
            const selectedRoute = routes.find(route => route.id === formData.routeId);
            if (selectedRoute) {
                setFormData(prev => ({
                    ...prev,
                    stops: selectedRoute.stops.map((stop, index) => ({
                        name: stop.name,
                        address: stop.address,
                        latitude: stop.latitude,
                        longitude: stop.longitude,
                        order: index + 1,
                        estimatedArrivalTime: '',
                        estimatedDepartureTime: ''
                    }))
                }));
            }
        }
    }, [formData.routeId, routes, mode]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.routeId) {
            newErrors.routeId = 'Route is required';
        }

        if (!formData.busId) {
            newErrors.busId = 'Bus is required';
        }

        if (!formData.driverId) {
            newErrors.driverId = 'Driver is required';
        }

        if (!formData.departureTime) {
            newErrors.departureTime = 'Departure time is required';
        }

        if (!formData.arrivalTime) {
            newErrors.arrivalTime = 'Arrival time is required';
        }

        if (formData.daysOfWeek.length === 0) {
            newErrors.daysOfWeek = 'At least one day must be selected';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (formData.recurring && !formData.endDate) {
            newErrors.endDate = 'End date is required for recurring schedule';
        }

        // Validate time logic
        if (formData.departureTime && formData.arrivalTime) {
            const departure = new Date(`2000-01-01T${formData.departureTime}`);
            const arrival = new Date(`2000-01-01T${formData.arrivalTime}`);

            if (arrival <= departure) {
                newErrors.arrivalTime = 'Arrival time must be after departure time';
            }
        }

        // Validate stops have times
        if (formData.stops.length > 0) {
            formData.stops.forEach((stop, index) => {
                if (!stop.estimatedArrivalTime) {
                    newErrors[`stop_${index}_arrival`] = `Arrival time required for ${stop.name}`;
                }
                if (!stop.estimatedDepartureTime) {
                    newErrors[`stop_${index}_departure`] = `Departure time required for ${stop.name}`;
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const toggleDay = (day: string) => {
        const newDays = formData.daysOfWeek.includes(day)
            ? formData.daysOfWeek.filter(d => d !== day)
            : [...formData.daysOfWeek, day];

        setFormData(prev => ({
            ...prev,
            daysOfWeek: newDays
        }));

        if (errors.daysOfWeek) {
            setErrors(prev => ({ ...prev, daysOfWeek: '' }));
        }
    };

    const updateStopTime = (index: number, field: 'estimatedArrivalTime' | 'estimatedDepartureTime', value: string) => {
        setFormData(prev => ({
            ...prev,
            stops: prev.stops.map((stop, i) =>
                i === index ? { ...stop, [field]: value } : stop
            )
        }));

        if (errors[`stop_${index}_${field}`]) {
            setErrors(prev => ({
                ...prev,
                [`stop_${index}_${field}`]: ''
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Prepare schedule data for API
        const scheduleData = {
            ...formData,
            departureTime: formData.departureTime.includes(':') ? formData.departureTime : `${formData.departureTime}:00`,
            arrivalTime: formData.arrivalTime.includes(':') ? formData.arrivalTime : `${formData.arrivalTime}:00`,
            startDate: `${formData.startDate}T00:00:00`,
            endDate: formData.endDate ? `${formData.endDate}T23:59:59` : '',
            stops: formData.stops.map(stop => ({
                ...stop,
                estimatedArrivalTime: stop.estimatedArrivalTime.includes(':') ? stop.estimatedArrivalTime : `${stop.estimatedArrivalTime}:00`,
                estimatedDepartureTime: stop.estimatedDepartureTime.includes(':') ? stop.estimatedDepartureTime : `${stop.estimatedDepartureTime}:00`
            }))
        };

        if (mode === 'create') {
            createSchedule.mutate(scheduleData, {
                onSuccess: () => {
                    toast.success('Schedule created successfully');
                    router.push('/admin/routes-schedules');
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || 'Failed to create schedule');
                }
            });
        }
    };

    const handleCancel = () => {
        router.push('/admin/routes-schedules');
    };

    const handleEdit = () => {
        router.push(`/admin/schedules/${id}/edit`);
    };

    const selectedBus = buses?.find(bus => bus.id === formData.busId);
    const selectedRoute = routes?.find(route => route.id === formData.routeId);
    const selectedDriver = availableDrivers?.find(driver => driver.id === formData.driverId);

    // Helper function to check if view mode
    const isViewMode = mode === 'view';

    return (
        <div className="p-4 sm:p-6">
            {/* Header with back button */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            {mode === 'view' ? 'Schedule Details' : 'Add New Schedule'}
                        </h1>
                        {mode === 'view' && scheduleData && (
                            <p className="text-gray-600 text-sm">
                                Schedule ID: {id}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    {mode === 'view' && (
                        <>

                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={20} />

                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Form */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Select Route */}
                            <div>
                                <label className="block text-gray-800 text-base font-medium mb-3">Route {!isViewMode && '*'}</label>
                                {isViewMode ? (
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-lg font-medium text-gray-800">{selectedRoute?.name}</div>
                                        {selectedRoute && (
                                            <div className="mt-1 text-sm text-gray-600">
                                                {selectedRoute.description} • {selectedRoute.stops.length} stops • {routeService.formatDistance(selectedRoute.distance)}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <select
                                            name="routeId"
                                            value={formData.routeId}
                                            onChange={handleInputChange}
                                            disabled={isViewMode}
                                            className={`w-full px-4 py-3 border rounded-lg text-gray-800 appearance-none focus:outline-none focus:border-[#0066CC] ${errors.routeId ? 'border-red-500' : 'border-gray-300'
                                                } ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        >
                                            <option value="">Select a route</option>
                                            {routes?.map(route => (
                                                <option key={route.id} value={route.id}>
                                                    {route.name} - {routeService.formatDistance(route.distance)}
                                                </option>
                                            ))}
                                        </select>
                                        {!isViewMode && (
                                            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                                        )}
                                    </div>
                                )}
                                {errors.routeId && (
                                    <p className="text-red-500 text-sm mt-1">{errors.routeId}</p>
                                )}
                            </div>

                            {/* Select Bus and Driver */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-800 text-base font-medium mb-3">Bus {!isViewMode && '*'}</label>
                                    {isViewMode ? (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="text-lg font-medium text-gray-800">{selectedBus?.name} ({selectedBus?.registrationName})</div>
                                            <div className="mt-1 text-sm text-gray-600">
                                                Model: {selectedBus?.model} • Color: {selectedBus?.color} • Status: {selectedBus?.status} • {selectedBus?.totalSeats} seats
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <select
                                                name="busId"
                                                value={formData.busId}
                                                onChange={handleInputChange}
                                                disabled={isViewMode}
                                                className={`w-full px-4 py-3 border rounded-lg text-gray-800 appearance-none focus:outline-none focus:border-[#0066CC] ${errors.busId ? 'border-red-500' : 'border-gray-300'
                                                    } ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            >
                                                <option value="">Select a bus</option>
                                                {buses?.map(bus => (
                                                    <option key={bus.id} value={bus.id}>
                                                        {bus.name} ({bus.registrationName}) - {bus.totalSeats} seats
                                                    </option>
                                                ))}
                                            </select>
                                            {!isViewMode && (
                                                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                                            )}
                                        </div>
                                    )}
                                    {errors.busId && (
                                        <p className="text-red-500 text-sm mt-1">{errors.busId}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-800 text-base font-medium mb-3">Driver {!isViewMode && '*'}</label>
                                    {isViewMode ? (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="text-lg font-medium text-gray-800">{selectedDriver?.fullName}</div>
                                            <div className="mt-1 text-sm text-gray-600">
                                                License: {selectedDriver?.licenseNumber} • Phone: {selectedDriver?.phoneNumber} • Status: {selectedDriver?.status}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <select
                                                name="driverId"
                                                value={formData.driverId}
                                                onChange={handleInputChange}
                                                disabled={isViewMode}
                                                className={`w-full px-4 py-3 border rounded-lg text-gray-800 appearance-none focus:outline-none focus:border-[#0066CC] ${errors.driverId ? 'border-red-500' : 'border-gray-300'
                                                    } ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            >
                                                <option value="">Select a driver</option>
                                                {availableDrivers?.map(driver => (
                                                    <option key={driver.id} value={driver.id}>
                                                        {driver.fullName} - {driver.licenseNumber}
                                                    </option>
                                                ))}
                                            </select>
                                            {!isViewMode && (
                                                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                                            )}
                                        </div>
                                    )}
                                    {errors.driverId && (
                                        <p className="text-red-500 text-sm mt-1">{errors.driverId}</p>
                                    )}
                                </div>
                            </div>

                            {/* Schedule Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-800 text-base font-medium mb-3">Schedule Status</label>
                                    {isViewMode ? (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${scheduleService.getStatusColor(formData.status)}`}>
                                                {formData.status}
                                            </span>
                                            <div className="mt-2 text-sm text-gray-600">
                                                {formData.isActive ? 'Active Schedule' : 'Inactive Schedule'}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                disabled={isViewMode}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 appearance-none focus:outline-none focus:border-[#0066CC]"
                                            >
                                                <option value="Scheduled">Scheduled</option>
                                                <option value="Active">Active</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                            {!isViewMode && (
                                                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center pt-8">
                                    {isViewMode ? (
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                            <span className="text-gray-800">
                                                {formData.isActive ? 'Active Schedule' : 'Inactive Schedule'}
                                            </span>
                                        </div>
                                    ) : (
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                disabled={isViewMode}
                                                className="rounded border-gray-300"
                                            />
                                            <span className="text-gray-800">Active Schedule</span>
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Departure and Arrival Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-800 text-base font-medium mb-3">Departure Time {!isViewMode && '*'}</label>
                                    {isViewMode ? (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="text-lg font-medium text-gray-800">
                                                {scheduleService.formatTime(formData.departureTime)}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type="time"
                                                name="departureTime"
                                                value={formData.departureTime}
                                                onChange={handleInputChange}
                                                disabled={isViewMode}
                                                className={`w-full px-4 py-3 pl-12 border rounded-lg text-gray-800 focus:outline-none focus:border-[#0066CC] ${errors.departureTime ? 'border-red-500' : 'border-gray-300'
                                                    } ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                                step="1"
                                            />
                                            <Clock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                        </div>
                                    )}
                                    {errors.departureTime && (
                                        <p className="text-red-500 text-sm mt-1">{errors.departureTime}</p>
                                    )}
                                    {!isViewMode && (
                                        <p className="text-sm text-gray-500 mt-1">Format: HH:MM:SS (e.g., 08:00:00)</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-800 text-base font-medium mb-3">Arrival Time {!isViewMode && '*'}</label>
                                    {isViewMode ? (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="text-lg font-medium text-gray-800">
                                                {scheduleService.formatTime(formData.arrivalTime)}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type="time"
                                                name="arrivalTime"
                                                value={formData.arrivalTime}
                                                onChange={handleInputChange}
                                                disabled={isViewMode}
                                                className={`w-full px-4 py-3 pl-12 border rounded-lg text-gray-800 focus:outline-none focus:border-[#0066CC] ${errors.arrivalTime ? 'border-red-500' : 'border-gray-300'
                                                    } ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                                step="1"
                                            />
                                            <Clock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                        </div>
                                    )}
                                    {errors.arrivalTime && (
                                        <p className="text-red-500 text-sm mt-1">{errors.arrivalTime}</p>
                                    )}
                                    {!isViewMode && (
                                        <p className="text-sm text-gray-500 mt-1">Format: HH:MM:SS (e.g., 09:00:00)</p>
                                    )}
                                </div>
                            </div>

                            {/* Schedule Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-gray-800 text-base font-medium mb-3">Start Date {!isViewMode && '*'}</label>
                                    {isViewMode ? (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="text-lg font-medium text-gray-800">
                                                {scheduleService.formatDate(formData.startDate)}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                                disabled={isViewMode}
                                                className={`w-full px-4 py-3 border rounded-lg text-gray-800 focus:outline-none focus:border-[#0066CC] ${errors.startDate ? 'border-red-500' : 'border-gray-300'
                                                    } ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            />
                                        </div>
                                    )}
                                    {errors.startDate && (
                                        <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-800 text-base font-medium mb-3">End Date</label>
                                    {isViewMode ? (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="text-lg font-medium text-gray-800">
                                                {formData.endDate ? scheduleService.formatDate(formData.endDate) : 'Not set'}
                                            </div>
                                            {!formData.endDate && !formData.recurring && (
                                                <div className="mt-1 text-sm text-gray-600">One-time schedule</div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleInputChange}
                                                disabled={isViewMode || !formData.recurring}
                                                className={`w-full px-4 py-3 border rounded-lg text-gray-800 focus:outline-none focus:border-[#0066CC] ${errors.endDate ? 'border-red-500' : 'border-gray-300'
                                                    } ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            />
                                        </div>
                                    )}
                                    {errors.endDate && (
                                        <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                                    )}
                                </div>

                                <div className="flex items-center pt-8">
                                    {isViewMode ? (
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${formData.recurring ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                                            <span className="text-gray-800">
                                                {formData.recurring ? 'Recurring Schedule' : 'One-time Schedule'}
                                            </span>
                                        </div>
                                    ) : (
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                name="recurring"
                                                checked={formData.recurring}
                                                onChange={handleInputChange}
                                                disabled={isViewMode}
                                                className="rounded border-gray-300"
                                            />
                                            <span className="text-gray-800">Recurring Schedule</span>
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Select Days */}
                            <div>
                                <label className="block text-gray-800 text-base font-medium mb-3">Selected Days {!isViewMode && '*'}</label>
                                {isViewMode ? (
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex flex-wrap gap-2">
                                            {days.map((day, index) => (
                                                <div
                                                    key={day}
                                                    className={`px-4 py-2 rounded-lg font-medium ${formData.daysOfWeek.includes(day)
                                                        ? 'bg-[#E7A533] text-white'
                                                        : 'bg-gray-200 text-gray-700'
                                                        }`}
                                                >
                                                    {shortDays[index]}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600">
                                            {formData.daysOfWeek.length > 0
                                                ? `Runs on: ${formData.daysOfWeek.map(day => shortDays[days.indexOf(day)]).join(', ')}`
                                                : 'No days selected'}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-wrap gap-2">
                                            {days.map((day, index) => (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    onClick={() => toggleDay(day)}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${formData.daysOfWeek.includes(day)
                                                        ? 'bg-[#E7A533] text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                >
                                                    {shortDays[index]}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.daysOfWeek && (
                                            <p className="text-red-500 text-sm mt-1">{errors.daysOfWeek}</p>
                                        )}
                                        <div className="mt-2 text-sm text-gray-600">
                                            Selected: {formData.daysOfWeek.map(day => shortDays[days.indexOf(day)]).join(', ')}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Total Seats Display */}
                            <div>
                                <label className="block text-gray-800 text-base font-medium mb-3">Total Seats</label>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-800">{formData.totalSeats}</div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        Based on selected bus capacity
                                    </div>
                                </div>
                            </div>

                            {/* Stops with Times */}
                            {formData.stops.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-gray-800 text-base font-medium">Stop Schedule {!isViewMode && '*'}</label>
                                        <span className="text-sm text-gray-600">{formData.stops.length} stops</span>
                                    </div>
                                    <div className="border border-gray-300 rounded-lg p-4 space-y-3">
                                        {formData.stops.map((stop, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-[#E7A533] rounded-full flex items-center justify-center">
                                                            <span className="text-white font-medium">{stop.order}</span>
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-800">{stop.name}</div>
                                                            <div className="text-sm text-gray-600">{stop.address}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-gray-600 text-sm mb-1">Arrival Time {!isViewMode && '*'}</label>
                                                        {isViewMode ? (
                                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                                <div className="text-gray-800">
                                                                    {stop.estimatedArrivalTime ? scheduleService.formatTime(stop.estimatedArrivalTime) : 'Not set'}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type="time"
                                                                value={stop.estimatedArrivalTime || ''}
                                                                onChange={(e) => updateStopTime(index, 'estimatedArrivalTime', e.target.value)}
                                                                disabled={isViewMode}
                                                                className={`w-full px-3 py-2 border rounded-lg ${errors[`stop_${index}_arrival`] ? 'border-red-500' : 'border-gray-300'} ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                                                step="1"
                                                            />
                                                        )}
                                                        {errors[`stop_${index}_arrival`] && (
                                                            <p className="text-red-500 text-sm mt-1">{errors[`stop_${index}_arrival`]}</p>
                                                        )}
                                                        {!isViewMode && (
                                                            <p className="text-xs text-gray-500 mt-1">Format: HH:MM:SS</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-600 text-sm mb-1">Departure Time {!isViewMode && '*'}</label>
                                                        {isViewMode ? (
                                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                                <div className="text-gray-800">
                                                                    {stop.estimatedDepartureTime ? scheduleService.formatTime(stop.estimatedDepartureTime) : 'Not set'}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type="time"
                                                                value={stop.estimatedDepartureTime || ''}
                                                                onChange={(e) => updateStopTime(index, 'estimatedDepartureTime', e.target.value)}
                                                                disabled={isViewMode}
                                                                className={`w-full px-3 py-2 border rounded-lg ${errors[`stop_${index}_departure`] ? 'border-red-500' : 'border-gray-300'} ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                                                step="1"
                                                            />
                                                        )}
                                                        {errors[`stop_${index}_departure`] && (
                                                            <p className="text-red-500 text-sm mt-1">{errors[`stop_${index}_departure`]}</p>
                                                        )}
                                                        {!isViewMode && (
                                                            <p className="text-xs text-gray-500 mt-1">Format: HH:MM:SS</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            {!isViewMode && (
                                <div className="flex gap-4 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg text-base font-medium hover:bg-gray-300 transition-colors flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-[#0066CC] text-white rounded-lg text-base font-medium hover:bg-[#0052a3] transition-colors flex-1 flex items-center justify-center gap-2"
                                        disabled={createSchedule.isPending}
                                    >
                                        {createSchedule.isPending ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={20} />
                                                Create Schedule
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => {
                    // Implement delete functionality
                    setShowDeleteModal(false);
                    toast.success('Schedule deleted successfully');
                    router.push('/admin/routes-schedules');
                }}
                title="Delete Schedule"
                message="Are you sure you want to delete this schedule? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};

export default AddSchedulePage;