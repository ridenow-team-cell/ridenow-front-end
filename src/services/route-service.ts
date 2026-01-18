import { axiosInstance } from '@/utils/axios';
import {
    Route,
    RouteDetailsResponse as RouteDetails,
    RouteQueryParams,
    CreateRouteRequest,
    UpdateRouteRequest,
    LocationSuggestion
} from '@/types/route';

const GOOGLE_API_KEY = 'AIzaSyBjpTeVMERj4TPGN8RU6UOmCtt6nnYVVqk';

export const routeService = {
    // Get all routes
    getRoutes: async (params?: RouteQueryParams): Promise<Route[]> => {
        const response = await axiosInstance.get('/admin/routes', { params });
        return response.data;
    },

    // Get route by ID
    getRouteById: async (id: string): Promise<Route> => {
        const response = await axiosInstance.get(`/admin/routes/${id}`);
        return response.data;
    },

    // Get route details
    getRouteDetails: async (id: string): Promise<RouteDetails> => {
        const response = await axiosInstance.get(`/admin/routes/${id}/details`);
        return response.data;
    },

    // Create route
    createRoute: async (routeData: CreateRouteRequest): Promise<Route> => {
        const response = await axiosInstance.post('/admin/routes', routeData);
        return response.data;
    },

    // Update route
    updateRoute: async (id: string, routeData: UpdateRouteRequest): Promise<Route> => {
        const response = await axiosInstance.put(`/admin/routes/${id}`, routeData);
        return response.data;
    },

    // Delete route
    deleteRoute: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.delete(`/admin/routes/${id}`);
        return response.data;
    },

    // Activate route
    activateRoute: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/routes/${id}/activate`);
        return response.data;
    },

    // Deactivate route
    deactivateRoute: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/routes/${id}/deactivate`);
        return response.data;
    },

    // Search locations using Google Places API - FIXED VERSION
    searchLocations: async (query: string): Promise<LocationSuggestion[]> => {
        try {
            // Check if query is valid
            if (!query || query.trim().length < 3) {
                return [];
            }

            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&components=country:ng`
            );

            if (!response.ok) {
                console.error('Google API error:', response.status);
                return [];
            }

            const data = await response.json();

            // Transform Google API response to our LocationSuggestion format
            const suggestions: LocationSuggestion[] = (data.predictions || []).map((prediction: any) => ({
                place_id: prediction.place_id,
                description: prediction.description,
                structured_formatting: {
                    main_text: prediction.structured_formatting?.main_text || prediction.description,
                    secondary_text: prediction.structured_formatting?.secondary_text || ''
                }
            }));

            return suggestions;
        } catch (error) {
            console.error('Error searching locations:', error);
            return [];
        }
    },

    // Get location details by place ID
    getLocationDetails: async (placeId: string): Promise<{ lat: number; lng: number; address: string }> => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}&fields=geometry,formatted_address`
            );

            if (!response.ok) {
                console.error('Google Places Details API error:', response.status);
                return { lat: 0, lng: 0, address: '' };
            }

            const data = await response.json();

            if (data.result?.geometry?.location) {
                return {
                    lat: data.result.geometry.location.lat,
                    lng: data.result.geometry.location.lng,
                    address: data.result.formatted_address || ''
                };
            }

            return { lat: 0, lng: 0, address: '' };
        } catch (error) {
            console.error('Error getting location details:', error);
            return { lat: 0, lng: 0, address: '' };
        }
    },

    // Calculate distance between two points (Haversine formula)
    calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    // Helper functions
    formatDuration: (duration: string): string => {
        const [hours, minutes] = duration.split(':');
        return `${hours}h ${minutes}m`;
    },

    formatDistance: (distance: number): string => {
        return `${distance.toFixed(1)} km`;
    },

    getStatusColor: (status: string): string => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Inactive': return 'bg-red-100 text-red-800';
            case 'Suspended': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    },

    formatDate: (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
};