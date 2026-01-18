import { axiosInstance } from '@/utils/axios';
import {
    BusTracking,
    BusTrackingDetails,
    LiveBusStatus,
    BusTrackingQueryParams,
    UpdateTrackingStatusRequest,
    UpdateLocationRequest,
    CreateTrackingRequest,
    TrackingStatistics
} from '@/types/bus-tracking';

export const busTrackingService = {
    // Get all tracking records with pagination
    getTrackingRecords: async (params?: BusTrackingQueryParams): Promise<{ data: BusTracking[]; total: number; page: number; pageSize: number }> => {
        const response = await axiosInstance.get('/admin/bus-tracking', { params });
        return response.data;
    },

    // Get tracking record by ID
    getTrackingById: async (id: string): Promise<BusTracking> => {
        const response = await axiosInstance.get(`/admin/bus-tracking/${id}`);
        return response.data;
    },

    // Get tracking record with details
    getTrackingDetails: async (id: string): Promise<BusTrackingDetails> => {
        const response = await axiosInstance.get(`/admin/bus-tracking/${id}/details`);
        return response.data;
    },

    // Get latest tracking for a bus
    getLatestTrackingByBus: async (busId: string): Promise<BusTracking> => {
        const response = await axiosInstance.get(`/admin/bus-tracking/bus/${busId}/latest`);
        return response.data;
    },

    // Get bus tracking history
    getBusTrackingHistory: async (busId: string, params?: { startDate?: string; endDate?: string; limit?: number }): Promise<BusTracking[]> => {
        const response = await axiosInstance.get(`/admin/bus-tracking/bus/${busId}/history`, { params });
        return response.data;
    },

    // Get active bus tracking (last 15 minutes)
    getActiveTracking: async (): Promise<BusTracking[]> => {
        const response = await axiosInstance.get('/admin/bus-tracking/active');
        return response.data;
    },

    // Get live bus status
    getLiveBusStatus: async (): Promise<LiveBusStatus[]> => {
        const response = await axiosInstance.get('/admin/bus-tracking/live-status');
        return response.data;
    },

    // Update tracking status
    updateTrackingStatus: async (id: string, statusData: UpdateTrackingStatusRequest): Promise<{ message: string }> => {
        const response = await axiosInstance.put(`/admin/bus-tracking/${id}/status`, statusData);
        return response.data;
    },

    // Update bus location
    updateBusLocation: async (busId: string, locationData: UpdateLocationRequest): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/bus-tracking/bus/${busId}/location`, locationData);
        return response.data;
    },

    // Get tracking by route
    getTrackingByRoute: async (routeId: string, params?: { date?: string }): Promise<BusTracking[]> => {
        const response = await axiosInstance.get(`/admin/bus-tracking/route/${routeId}`, { params });
        return response.data;
    },

    // Get tracking by driver
    getTrackingByDriver: async (driverId: string, params?: { date?: string }): Promise<BusTracking[]> => {
        const response = await axiosInstance.get(`/admin/bus-tracking/driver/${driverId}`, { params });
        return response.data;
    },

    // Get tracking statistics
    getTrackingStatistics: async (): Promise<TrackingStatistics> => {
        const response = await axiosInstance.get('/admin/bus-tracking/statistics');
        return response.data;
    },

    // Delete tracking record
    deleteTrackingRecord: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.delete(`/admin/bus-tracking/${id}`);
        return response.data;
    },

    // Create tracking record (admin)
    createTrackingRecord: async (trackingData: CreateTrackingRequest): Promise<BusTracking> => {
        const response = await axiosInstance.post('/admin/bus-tracking', trackingData);
        return response.data;
    },

    // Helper functions
    formatDate: (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatTime: (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    getStatusColor: (status: string): string => {
        switch (status) {
            case 'Tracking':
                return 'bg-green-100 text-green-800';
            case 'Stopped':
                return 'bg-yellow-100 text-yellow-800';
            case 'Parked':
                return 'bg-blue-100 text-blue-800';
            case 'Offline':
                return 'bg-gray-100 text-gray-800';
            case 'Maintenance':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    },

    getStatusBadge: (status: string): string => {
        switch (status) {
            case 'Tracking': return 'Active';
            case 'Stopped': return 'Stopped';
            case 'Parked': return 'Parked';
            case 'Offline': return 'Offline';
            case 'Maintenance': return 'Maintenance';
            default: return status;
        }
    },

    calculateTimeAgo: (timestamp: string): string => {
        const now = new Date();
        const past = new Date(timestamp);
        const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    },

    formatSpeed: (speed: number): string => {
        return `${speed.toFixed(1)} km/h`;
    },

    getDirectionIcon: (heading: number): string => {
        if (heading >= 337.5 || heading < 22.5) return '↑'; // North
        if (heading >= 22.5 && heading < 67.5) return '↗'; // Northeast
        if (heading >= 67.5 && heading < 112.5) return '→'; // East
        if (heading >= 112.5 && heading < 157.5) return '↘'; // Southeast
        if (heading >= 157.5 && heading < 202.5) return '↓'; // South
        if (heading >= 202.5 && heading < 247.5) return '↙'; // Southwest
        if (heading >= 247.5 && heading < 292.5) return '←'; // West
        return '↖'; // Northwest
    }
};