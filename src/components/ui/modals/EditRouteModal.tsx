"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Plus, Trash2, Search, Clock, X, Loader2 } from 'lucide-react';
import BaseModal from './BaseModal';
import { useUpdateRoute, useSearchLocations } from '@/hooks/use-routes';
import { routeService } from '@/services/route-service';
import { UpdateRouteRequest, RouteStop } from '@/types/route';
import { toast } from 'react-hot-toast';

interface EditRouteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    routeId: string;
    initialData: {
        id: string;
        name: string;
        description: string;
        stops: RouteStop[];
        status: string;
        isActive: boolean;
        estimatedDuration: string;
        distance: number;
        createdAt: string;
        updatedAt: string;
    };
}

const EditRouteModal: React.FC<EditRouteModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    routeId,
    initialData
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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStopIndex, setSelectedStopIndex] = useState<number | null>(null);
    const [originalStops, setOriginalStops] = useState<RouteStop[]>([]);

    // FIXED: Now properly using the hook
    const { data: locationSuggestions = [], isLoading: searching } = useSearchLocations(searchQuery);

    const updateRoute = useUpdateRoute();

    useEffect(() => {
        if (initialData) {
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
            setOriginalStops(initialData.stops);
        }
    }, [initialData]);

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

    const handleStopSearch = async (value: string) => {
        setSearchQuery(value);
    };

    const handleSelectLocation = async (suggestion: any, index: number) => {
        try {
            const locationDetails = await routeService.getLocationDetails(suggestion.place_id);

            const updatedStops = [...formData.stops];
            if (index >= updatedStops.length) {
                // Add new stop
                updatedStops.push({
                    name: suggestion.structured_formatting.main_text,
                    address: suggestion.description,
                    latitude: locationDetails.lat,
                    longitude: locationDetails.lng,
                    isPickupPoint: true,
                    isDropoffPoint: false,
                    estimatedArrivalTimeOffset: '00:00:00'
                });
            } else {
                // Update existing stop
                updatedStops[index] = {
                    ...updatedStops[index],
                    name: suggestion.structured_formatting.main_text,
                    address: suggestion.description,
                    latitude: locationDetails.lat,
                    longitude: locationDetails.lng
                };
            }

            setFormData(prev => ({ ...prev, stops: updatedStops }));
            setSearchQuery('');
            setSelectedStopIndex(null);
        } catch (error) {
            console.error('Error getting location details:', error);
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
            toast.error('A route must have at least 2 stops');
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
    };

    const moveStopUp = (index: number) => {
        if (index === 0) return;

        const updatedStops = [...formData.stops];
        [updatedStops[index], updatedStops[index - 1]] = [updatedStops[index - 1], updatedStops[index]];
        setFormData(prev => ({ ...prev, stops: updatedStops }));
    };

    const moveStopDown = (index: number) => {
        if (index === formData.stops.length - 1) return;

        const updatedStops = [...formData.stops];
        [updatedStops[index], updatedStops[index + 1]] = [updatedStops[index + 1], updatedStops[index]];
        setFormData(prev => ({ ...prev, stops: updatedStops }));
    };

    const calculateDistance = () => {
        if (formData.stops.length < 2) return 0;

        let totalDistance = 0;
        for (let i = 0; i < formData.stops.length - 1; i++) {
            const stop1 = formData.stops[i];
            const stop2 = formData.stops[i + 1];
            const distance = routeService.calculateDistance(
                stop1.latitude,
                stop1.longitude,
                stop2.latitude,
                stop2.longitude
            );
            totalDistance += distance;
        }

        setFormData(prev => ({ ...prev, distance: parseFloat(totalDistance.toFixed(1)) }));
        toast.success(`Distance calculated: ${totalDistance.toFixed(1)} km`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const routeData: UpdateRouteRequest = {
            name: formData.name,
            description: formData.description,
            stops: formData.stops.map((stop, index) => ({
                ...stop,
                order: index + 1
            })),
            status: formData.status,
            isActive: formData.isActive,
            estimatedDuration: formData.estimatedDuration,
            distance: formData.distance
        };

        updateRoute.mutate({ id: routeId, data: routeData }, {
            onSuccess: () => {
                toast.success('Route updated successfully');
                onSubmit();
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to update route');
            }
        });
    };

    const hasChanges = () => {
        // Check if form data differs from initial data
        if (!initialData) return true;

        const stopsChanged = formData.stops.length !== initialData.stops.length ||
            formData.stops.some((stop, index) => {
                const originalStop = initialData.stops[index];
                return !originalStop ||
                    stop.name !== originalStop.name ||
                    stop.address !== originalStop.address ||
                    stop.latitude !== originalStop.latitude ||
                    stop.longitude !== originalStop.longitude ||
                    stop.isPickupPoint !== originalStop.isPickupPoint ||
                    stop.isDropoffPoint !== originalStop.isDropoffPoint ||
                    stop.estimatedArrivalTimeOffset !== originalStop.estimatedArrivalTimeOffset;
            });

        return stopsChanged ||
            formData.name !== initialData.name ||
            formData.description !== initialData.description ||
            formData.status !== initialData.status ||
            formData.isActive !== initialData.isActive ||
            formData.estimatedDuration !== initialData.estimatedDuration ||
            formData.distance !== initialData.distance;
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Route"
            size="xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Route Info Header */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-sm text-gray-600">Route ID</div>
                            <div className="font-medium text-gray-800">{routeId}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600">Last Updated</div>
                            <div className="font-medium text-gray-800">
                                {routeService.formatDate(initialData?.updatedAt || '')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Route Name */}
                <div>
                    <label className="block text-gray-800 text-base font-medium mb-2">
                        Route Name *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter route name"
                        className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-gray-800 text-base font-medium mb-2">
                        Description *
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe the route..."
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.description ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                </div>

                {/* Stops */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <label className="block text-gray-800 text-base font-medium">
                                Stops *
                            </label>
                            <p className="text-sm text-gray-600">
                                {formData.stops.length} stops configured
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={calculateDistance}
                                className="px-4 py-2 bg-[#E7A533] text-gray-800 rounded-lg hover:bg-[#d69420] transition-colors"
                            >
                                Calculate Distance
                            </button>
                            <button
                                type="button"
                                onClick={addStop}
                                className="flex items-center gap-2 px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0055AA] transition-colors"
                            >
                                <Plus size={20} />
                                Add Stop
                            </button>
                        </div>
                    </div>

                    {errors.stops && (
                        <p className="text-red-500 text-sm mb-2">{errors.stops}</p>
                    )}

                    <div className="space-y-4">
                        {formData.stops.map((stop, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-center">
                                            <button
                                                type="button"
                                                onClick={() => moveStopUp(index)}
                                                disabled={index === 0}
                                                className="p-1 disabled:opacity-50"
                                            >
                                                ↑
                                            </button>
                                            <div className="w-8 h-8 bg-[#E7A533] rounded-full flex items-center justify-center">
                                                <span className="text-white font-medium">{index + 1}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => moveStopDown(index)}
                                                disabled={index === formData.stops.length - 1}
                                                className="p-1 disabled:opacity-50"
                                            >
                                                ↓
                                            </button>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-800">Stop {index + 1}</span>
                                            <div className="flex gap-2 mt-1">
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
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {formData.stops.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => removeStop(index)}
                                                className="p-1 text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Stop Search */}
                                <div className="relative mb-3">
                                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
                                        <Search size={20} className="text-gray-400" />
                                        <input
                                            type="text"
                                            value={selectedStopIndex === index ? searchQuery : stop.name}
                                            onChange={(e) => {
                                                setSelectedStopIndex(index);
                                                handleStopSearch(e.target.value);
                                            }}
                                            placeholder="Search for location..."
                                            className="flex-1 border-none outline-none text-gray-800 bg-transparent"
                                        />
                                        {searching && selectedStopIndex === index && (
                                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                        )}
                                    </div>

                                    {/* Search Results */}
                                    {selectedStopIndex === index && locationSuggestions.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {locationSuggestions.map((suggestion, idx) => (
                                                <button
                                                    key={suggestion.place_id}
                                                    type="button"
                                                    onClick={() => handleSelectLocation(suggestion, index)}
                                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                                >
                                                    <div className="font-medium text-gray-800">
                                                        {suggestion.structured_formatting.main_text}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {suggestion.structured_formatting.secondary_text}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Stop Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Address</label>
                                        <input
                                            type="text"
                                            value={stop.address}
                                            onChange={(e) => updateStop(index, 'address', e.target.value)}
                                            placeholder="Address"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Time Offset</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={stop.estimatedArrivalTimeOffset}
                                                onChange={(e) => updateStop(index, 'estimatedArrivalTimeOffset', e.target.value)}
                                                placeholder="HH:MM:SS"
                                                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg text-gray-800"
                                            />
                                            <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Stop Type */}
                                <div className="flex gap-4 mt-3">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={stop.isPickupPoint}
                                            onChange={(e) => updateStop(index, 'isPickupPoint', e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm text-gray-700">Pickup Point</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={stop.isDropoffPoint}
                                            onChange={(e) => updateStop(index, 'isDropoffPoint', e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm text-gray-700">Dropoff Point</span>
                                    </label>
                                </div>

                                {/* Coordinates */}
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Latitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={stop.latitude}
                                            onChange={(e) => updateStop(index, 'latitude', parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Longitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={stop.longitude}
                                            onChange={(e) => updateStop(index, 'longitude', parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Duration and Distance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-2">
                            Estimated Duration *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="estimatedDuration"
                                value={formData.estimatedDuration}
                                onChange={handleInputChange}
                                placeholder="HH:MM:SS"
                                className={`w-full px-4 py-3 pl-12 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.estimatedDuration ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            <Clock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        {errors.estimatedDuration && (
                            <p className="text-red-500 text-sm mt-1">{errors.estimatedDuration}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-2">
                            Distance (km) *
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                name="distance"
                                value={formData.distance}
                                onChange={handleInputChange}
                                step="0.1"
                                min="0"
                                placeholder="Enter distance in kilometers"
                                className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.distance ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={calculateDistance}
                                className="px-3 py-3 bg-[#E7A533] text-gray-800 rounded-lg hover:bg-[#d69420] transition-colors whitespace-nowrap"
                            >
                                Calculate
                            </button>
                        </div>
                        {errors.distance && (
                            <p className="text-red-500 text-sm mt-1">{errors.distance}</p>
                        )}
                    </div>
                </div>

                {/* Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-[#0066CC]"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-2">
                            Active Status
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="rounded"
                            />
                            <label htmlFor="isActive" className="text-gray-800">
                                {formData.isActive ? 'Route is active' : 'Route is inactive'}
                            </label>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        {hasChanges() ? 'You have unsaved changes' : 'No changes made'}
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg text-base font-medium hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updateRoute.isPending || !hasChanges()}
                            className="px-6 py-3 bg-[#0066CC] text-white rounded-lg text-base font-medium hover:bg-[#0052a3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updateRoute.isPending ? 'Updating...' : 'Update Route'}
                        </button>
                    </div>
                </div>
            </form>
        </BaseModal>
    );
};

export default EditRouteModal;