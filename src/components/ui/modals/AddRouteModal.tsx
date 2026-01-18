"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Plus, Trash2, Clock, X, Loader2, Route as RouteIcon, Calendar, Navigation } from 'lucide-react';
import BaseModal from './BaseModal';
import { useCreateRoute, useUpdateRoute } from '@/hooks/use-routes';
import { routeService } from '@/services/route-service';
import { CreateRouteRequest, UpdateRouteRequest, RouteStop } from '@/types/route';
import { toast } from 'react-hot-toast';

interface AddRouteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: {
        id?: string;
        name: string;
        description: string;
        stops: RouteStop[];
        status: string;
        isActive: boolean;
        estimatedDuration: string;
        distance: number;
    };
    isEdit?: boolean;
}

const AddRouteModal: React.FC<AddRouteModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isEdit = false
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        stops: [] as Omit<RouteStop, 'order'>[],
        status: 'Active',
        isActive: true,
        estimatedDuration: '01:00:00',
        distance: 0
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form data for edit
    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description,
                stops: initialData.stops.map(stop => ({
                    name: stop.name,
                    address: stop.address,
                    latitude: stop.latitude,
                    longitude: stop.longitude,
                    isPickupPoint: stop.isPickupPoint,
                    isDropoffPoint: stop.isDropoffPoint,
                    estimatedArrivalTimeOffset: stop.estimatedArrivalTimeOffset
                })),
                status: initialData.status,
                isActive: initialData.isActive,
                estimatedDuration: initialData.estimatedDuration,
                distance: initialData.distance
            });
        } else if (!isEdit) {
            // Reset form for create
            setFormData({
                name: '',
                description: '',
                stops: [],
                status: 'Active',
                isActive: true,
                estimatedDuration: '01:00:00',
                distance: 0
            });
        }
    }, [isEdit, initialData, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Route name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (formData.stops.length < 2) {
            newErrors.stops = 'At least 2 stops are required';
        }

        // Validate each stop
        formData.stops.forEach((stop, index) => {
            if (!stop.name.trim()) {
                newErrors[`stop_${index}_name`] = `Stop ${index + 1} name is required`;
            }
            if (!stop.address.trim()) {
                newErrors[`stop_${index}_address`] = `Stop ${index + 1} address is required`;
            }
            if (stop.latitude === 0 && stop.longitude === 0) {
                newErrors[`stop_${index}_location`] = `Stop ${index + 1} location is required`;
            }
        });

        if (!formData.estimatedDuration) {
            newErrors.estimatedDuration = 'Estimated duration is required';
        }

        if (!formData.distance || formData.distance <= 0) {
            newErrors.distance = 'Distance must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const addStop = () => {
        setFormData(prev => ({
            ...prev,
            stops: [...prev.stops, {
                name: '',
                address: '',
                latitude: 0,
                longitude: 0,
                isPickupPoint: true,
                isDropoffPoint: false,
                estimatedArrivalTimeOffset: '00:00:00'
            }]
        }));
    };

    const removeStop = (index: number) => {
        if (formData.stops.length <= 2) {
            toast.error('Route must have at least 2 stops');
            return;
        }
        setFormData(prev => ({
            ...prev,
            stops: prev.stops.filter((_, i) => i !== index)
        }));
    };

    const updateStop = (index: number, field: keyof RouteStop, value: any) => {
        const updatedStops = [...formData.stops];
        updatedStops[index] = { ...updatedStops[index], [field]: value };
        setFormData(prev => ({ ...prev, stops: updatedStops }));

        // Clear errors for this field
        const errorKey = `stop_${index}_${field}`;
        if (errors[errorKey]) {
            setErrors(prev => ({ ...prev, [errorKey]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        try {
            const routeData = {
                ...formData,
                stops: formData.stops.map((stop, index) => ({
                    ...stop,
                    order: index + 1
                }))
            };

            // Call the onSubmit callback with appropriate data
            if (isEdit && initialData?.id) {
                onSubmit({
                    id: initialData.id,
                    data: routeData
                });
            } else {
                onSubmit(routeData);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to submit form');
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateDistance = () => {
        if (formData.stops.length < 2) {
            toast.error('Need at least 2 stops to calculate distance');
            return;
        }

        let totalDistance = 0;
        for (let i = 0; i < formData.stops.length - 1; i++) {
            const stop1 = formData.stops[i];
            const stop2 = formData.stops[i + 1];

            // Check if both stops have valid coordinates
            if (stop1.latitude === 0 || stop1.longitude === 0 ||
                stop2.latitude === 0 || stop2.longitude === 0) {
                toast.error(`Stop ${i + 1} or Stop ${i + 2} missing coordinates`);
                return;
            }

            const distance = routeService.calculateDistance(
                stop1.latitude,
                stop1.longitude,
                stop2.latitude,
                stop2.longitude
            );
            totalDistance += distance;
        }

        setFormData(prev => ({
            ...prev,
            distance: parseFloat(totalDistance.toFixed(2))
        }));
        toast.success(`Distance calculated: ${totalDistance.toFixed(2)} km`);
    };

    const calculateDuration = () => {
        if (formData.distance <= 0) {
            toast.error('Please enter a valid distance first');
            return;
        }

        // Simple calculation: 2 minutes per km
        const minutesPerKm = 2;
        const totalMinutes = Math.round(formData.distance * minutesPerKm);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

        setFormData(prev => ({
            ...prev,
            estimatedDuration: formattedDuration
        }));
        toast.success(`Duration calculated: ${hours}h ${minutes}m`);
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Route' : 'Add New Route'}
            size="xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
                {/* Route Basic Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <RouteIcon className="w-5 h-5 text-gray-600" />
                        Route Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Route Name */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Route Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter route name"
                                className={`w-full px-4 py-2 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-[#0066CC]"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe the route, including key landmarks and purpose..."
                                rows={2}
                                className={`w-full px-4 py-2 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.description ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Route Stops */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-600" />
                            Route Stops *
                        </h3>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={calculateDistance}
                                disabled={formData.stops.length < 2}
                                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg text-sm hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Calculate Distance
                            </button>
                            <button
                                type="button"
                                onClick={addStop}
                                className="flex items-center gap-2 px-3 py-1 bg-[#0066CC] text-white rounded-lg text-sm hover:bg-[#0055AA] transition-colors"
                            >
                                <Plus size={16} />
                                Add Stop
                            </button>
                        </div>
                    </div>

                    {errors.stops && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{errors.stops}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {formData.stops.map((stop, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#E7A533] rounded-full flex items-center justify-center">
                                            <span className="text-white font-medium">{index + 1}</span>
                                        </div>
                                        <span className="font-medium text-gray-800">Stop {index + 1}</span>
                                    </div>
                                    {formData.stops.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removeStop(index)}
                                            className="p-1 text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>

                                {/* Stop Details Grid */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Stop Name *</label>
                                        <input
                                            type="text"
                                            value={stop.name}
                                            onChange={(e) => updateStop(index, 'name', e.target.value)}
                                            placeholder="e.g., Main Terminal, City Center, etc."
                                            className={`w-full px-3 py-1.5 border rounded-lg text-gray-800 text-sm ${errors[`stop_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors[`stop_${index}_name`] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[`stop_${index}_name`]}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Address *</label>
                                        <input
                                            type="text"
                                            value={stop.address}
                                            onChange={(e) => updateStop(index, 'address', e.target.value)}
                                            placeholder="Full address including city and country"
                                            className={`w-full px-3 py-1.5 border rounded-lg text-gray-800 text-sm ${errors[`stop_${index}_address`] ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors[`stop_${index}_address`] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[`stop_${index}_address`]}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Time Offset</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={stop.estimatedArrivalTimeOffset}
                                                    onChange={(e) => updateStop(index, 'estimatedArrivalTimeOffset', e.target.value)}
                                                    placeholder="HH:MM:SS"
                                                    className="w-full px-3 py-1.5 pl-9 border border-gray-300 rounded-lg text-gray-800 text-sm"
                                                />
                                                <Clock size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Stop Type</label>
                                            <div className="flex gap-3">
                                                <label className="flex items-center gap-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={stop.isPickupPoint}
                                                        onChange={(e) => updateStop(index, 'isPickupPoint', e.target.checked)}
                                                        className="rounded"
                                                    />
                                                    <span className="text-xs text-gray-700">Pickup</span>
                                                </label>
                                                <label className="flex items-center gap-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={stop.isDropoffPoint}
                                                        onChange={(e) => updateStop(index, 'isDropoffPoint', e.target.checked)}
                                                        className="rounded"
                                                    />
                                                    <span className="text-xs text-gray-700">Dropoff</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Latitude *</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={stop.latitude}
                                                onChange={(e) => updateStop(index, 'latitude', parseFloat(e.target.value) || 0)}
                                                placeholder="e.g., 40.7128"
                                                className={`w-full px-3 py-1.5 border rounded-lg text-gray-800 text-sm ${errors[`stop_${index}_location`] ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Longitude *</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={stop.longitude}
                                                onChange={(e) => updateStop(index, 'longitude', parseFloat(e.target.value) || 0)}
                                                placeholder="e.g., -74.0060"
                                                className={`w-full px-3 py-1.5 border rounded-lg text-gray-800 text-sm ${errors[`stop_${index}_location`] ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                    {errors[`stop_${index}_location`] && (
                                        <p className="text-red-500 text-xs mt-1">Coordinates are required for distance calculation</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Duration and Distance */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Navigation className="w-5 h-5 text-gray-600" />
                        Route Metrics
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Distance (km) *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="distance"
                                    value={formData.distance}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    min="0"
                                    placeholder="Enter distance or calculate"
                                    className={`w-full px-4 py-2 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.distance ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={calculateDuration}
                                    disabled={!formData.distance || formData.distance <= 0}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Calc Duration
                                </button>
                            </div>
                            {errors.distance && (
                                <p className="text-red-500 text-xs mt-1">{errors.distance}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Estimated Duration *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="estimatedDuration"
                                    value={formData.estimatedDuration}
                                    onChange={handleInputChange}
                                    placeholder="HH:MM:SS"
                                    className={`w-full px-4 py-2 pl-10 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.estimatedDuration ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            {errors.estimatedDuration && (
                                <p className="text-red-500 text-xs mt-1">{errors.estimatedDuration}</p>
                            )}
                        </div>

                        <div className="flex items-end">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                    className="rounded"
                                />
                                <span className="text-gray-700 text-sm">Active Route</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Route Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{formData.stops.length}</div>
                            <div className="text-xs text-blue-800">Total Stops</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{formData.distance.toFixed(1)}</div>
                            <div className="text-xs text-green-800">Distance (km)</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {formData.estimatedDuration.split(':')[0]}h {formData.estimatedDuration.split(':')[1]}m
                            </div>
                            <div className="text-xs text-purple-800">Duration</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#E7A533]">
                                {formData.stops.filter(s => s.isPickupPoint).length}
                            </div>
                            <div className="text-xs text-[#E7A533]">Pickup Points</div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-[#E7A533] text-gray-800 rounded-lg text-sm font-medium hover:bg-[#d69420] transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-[#0066CC] text-white rounded-lg text-sm font-medium hover:bg-[#0055AA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {isEdit ? 'Updating...' : 'Creating...'}
                            </span>
                        ) : isEdit ? 'Update Route' : 'Create Route'}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

export default AddRouteModal;