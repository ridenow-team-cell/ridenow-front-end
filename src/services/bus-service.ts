import { axiosInstance } from '@/utils/axios';
import {
    Bus,
    BusDetails,
    BusQueryParams,
    CreateBusRequest,
    UpdateBusRequest,
    AssignDriverRequest,
    AssignRouteRequest,
    ChangeStatusRequest
} from '@/types/bus';

export const busService = {
    // Get all buses with filters
    getBuses: async (params?: BusQueryParams): Promise<Bus[]> => {
        const response = await axiosInstance.get('/admin/buses', { params });
        return response.data;
    },

    // Get bus by ID
    getBusById: async (id: string): Promise<Bus> => {
        const response = await axiosInstance.get(`/admin/buses/${id}`);
        return response.data;
    },

    // Get bus details with additional info
    getBusDetails: async (id: string): Promise<BusDetails> => {
        const response = await axiosInstance.get(`/admin/buses/${id}/details`);
        return response.data;
    },

    // Get bus by registration number
    getBusByRegistration: async (registration: string): Promise<Bus> => {
        const response = await axiosInstance.get(`/admin/buses/registration/${registration}`);
        return response.data;
    },

    // Create new bus
    createBus: async (busData: CreateBusRequest): Promise<Bus> => {
        const response = await axiosInstance.post('/admin/buses', busData);
        return response.data;
    },

    // Update bus
    updateBus: async (id: string, busData: UpdateBusRequest): Promise<Bus> => {
        const response = await axiosInstance.put(`/admin/buses/${id}`, busData);
        return response.data;
    },

    // Delete bus
    deleteBus: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.delete(`/admin/buses/${id}`);
        return response.data;
    },

    // Activate bus
    activateBus: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/buses/${id}/activate`);
        return response.data;
    },

    // Deactivate bus
    deactivateBus: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/buses/${id}/deactivate`);
        return response.data;
    },

    // Assign driver to bus
    assignDriver: async (id: string, driverData: AssignDriverRequest): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/buses/${id}/assign/driver`, driverData);
        return response.data;
    },

    // Unassign driver from bus
    unassignDriver: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/buses/${id}/unassign/driver`);
        return response.data;
    },

    // Assign route to bus
    assignRoute: async (id: string, routeData: AssignRouteRequest): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/buses/${id}/assign/route`, routeData);
        return response.data;
    },

    // Change bus status
    changeStatus: async (id: string, statusData: ChangeStatusRequest): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/buses/${id}/status`, statusData);
        return response.data;
    },

    // Get available buses
    getAvailableBuses: async (): Promise<Bus[]> => {
        const response = await axiosInstance.get('/admin/buses/available');
        return response.data;
    },

    // Get buses by status
    getBusesByStatus: async (status: string): Promise<Bus[]> => {
        const response = await axiosInstance.get(`/admin/buses/status/${status}`);
        return response.data;
    },

    // Search buses
    searchBuses: async (term: string): Promise<Bus[]> => {
        const response = await axiosInstance.get('/admin/buses/search', {
            params: { term }
        });
        return response.data;
    },

    // Check if bus exists by registration
    checkBusExists: async (registration: string): Promise<{ exists: boolean }> => {
        const response = await axiosInstance.get('/admin/buses/exists', {
            params: { registration }
        });
        return response.data;
    },

    // Helper functions
    formatDate: (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    },

    formatTime: (timeString: string): string => {
        return timeString.substring(0, 5); // Format HH:MM
    },

    getStatusColor: (status: string): string => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-800';
            case 'OnRoute': return 'bg-blue-100 text-blue-800';
            case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
            case 'OutOfService': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    },

    getStatusOptions: () => [
        { value: 'Available', label: 'Available' },
        { value: 'OnRoute', label: 'On Route' },
        { value: 'Maintenance', label: 'Maintenance' },
        { value: 'OutOfService', label: 'Out of Service' }
    ],

    getColorOptions: () => [
        { value: 'Yellow', label: 'Yellow' },
        { value: 'Blue', label: 'Blue' },
        { value: 'Red', label: 'Red' },
        { value: 'Green', label: 'Green' },
        { value: 'White', label: 'White' },
        { value: 'Black', label: 'Black' },
        { value: 'Silver', label: 'Silver' },
        { value: 'Gray', label: 'Gray' }
    ],

    getYearOptions: () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i >= currentYear - 20; i--) {
            years.push({ value: i, label: i.toString() });
        }
        return years;
    }
};