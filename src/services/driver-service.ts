import { axiosInstance } from '@/utils/axios';
import {
    Driver,
    DriverDetails,
    DriverQueryParams,
    CreateDriverRequest,
    UpdateDriverRequest,
    AssignBusRequest,
    AssignRouteRequest,
    ChangeStatusRequest,
    DriverStatistics
} from '@/types/driver';

export const driverService = {
    // Get all drivers
    getDrivers: async (params?: DriverQueryParams): Promise<Driver[]> => {
        const response = await axiosInstance.get('/admin/drivers');
        return response.data;
    },

    // Get drivers with pagination
    getDriversPaged: async (params?: DriverQueryParams): Promise<{ data: Driver[]; total: number; page: number; pageSize: number }> => {
        const response = await axiosInstance.get('/admin/drivers/paged', { params });
        return response.data;
    },

    // Get driver by ID
    getDriverById: async (id: string): Promise<Driver> => {
        const response = await axiosInstance.get(`/admin/drivers/${id}`);
        return response.data;
    },

    // Get driver details
    getDriverDetails: async (id: string): Promise<DriverDetails> => {
        const response = await axiosInstance.get(`/admin/drivers/${id}/details`);
        return response.data;
    },

    // Get driver by license
    getDriverByLicense: async (licenseNumber: string): Promise<Driver> => {
        const response = await axiosInstance.get(`/admin/drivers/license/${licenseNumber}`);
        return response.data;
    },

    // Get driver by phone
    getDriverByPhone: async (phoneNumber: string): Promise<Driver> => {
        const response = await axiosInstance.get(`/admin/drivers/phone/${phoneNumber}`);
        return response.data;
    },

    // Create driver
    createDriver: async (driverData: CreateDriverRequest): Promise<Driver> => {
        const response = await axiosInstance.post('/admin/drivers', driverData);
        return response.data;
    },

    // Update driver
    updateDriver: async (id: string, driverData: UpdateDriverRequest): Promise<Driver> => {
        const response = await axiosInstance.put(`/admin/drivers/${id}`, driverData);
        return response.data;
    },

    // Delete driver
    deleteDriver: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.delete(`/admin/drivers/${id}`);
        return response.data;
    },

    // Activate driver
    activateDriver: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/drivers/${id}/activate`);
        return response.data;
    },

    // Deactivate driver
    deactivateDriver: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/drivers/${id}/deactivate`);
        return response.data;
    },

    // Assign driver to bus
    assignBus: async (id: string, busData: AssignBusRequest): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/drivers/${id}/assign/bus`, busData);
        return response.data;
    },

    // Unassign driver from bus
    unassignBus: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/drivers/${id}/unassign/bus`);
        return response.data;
    },

    // Assign driver to route
    assignRoute: async (id: string, routeData: AssignRouteRequest): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/drivers/${id}/assign/route`, routeData);
        return response.data;
    },

    // Change driver status
    changeDriverStatus: async (id: string, statusData: ChangeStatusRequest): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/drivers/${id}/status`, statusData);
        return response.data;
    },

    // Get driver statistics
    getDriverStatistics: async (): Promise<DriverStatistics> => {
        const response = await axiosInstance.get('/admin/drivers/statistics');
        return response.data;
    },

    // Get available drivers
    getAvailableDrivers: async (): Promise<Driver[]> => {
        const response = await axiosInstance.get('/admin/drivers/available');
        return response.data;
    },

    // Get drivers by status
    getDriversByStatus: async (status: string): Promise<Driver[]> => {
        const response = await axiosInstance.get(`/admin/drivers/status/${status}`);
        return response.data;
    },

    // Check if driver exists
    checkDriverExists: async (licenseNumber?: string, phone?: string): Promise<{ exists: boolean }> => {
        const response = await axiosInstance.get('/admin/drivers/exists', {
            params: { licenseNumber, phone }
        });
        return response.data;
    },

    // Search drivers
    searchDrivers: async (term: string): Promise<Driver[]> => {
        const response = await axiosInstance.get('/admin/drivers/search', {
            params: { term }
        });
        return response.data;
    },

    // Get driver count
    getDriverCount: async (params?: { status?: string }): Promise<{ count: number }> => {
        const response = await axiosInstance.get('/admin/drivers/count', { params });
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

    getStatusColor: (status: string): string => {
        switch (status) {
            case 'Active':
            case 'OnDuty':
                return 'bg-green-100 text-green-800';
            case 'OffDuty':
            case 'OnBreak':
                return 'bg-blue-100 text-blue-800';
            case 'OnLeave':
                return 'bg-yellow-100 text-yellow-800';
            case 'Inactive':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    },

    getStatusBadge: (status: string): string => {
        switch (status) {
            case 'Active': return 'Active';
            case 'Inactive': return 'Inactive';
            case 'OnDuty': return 'On Duty';
            case 'OffDuty': return 'Off Duty';
            case 'OnBreak': return 'On Break';
            case 'OnLeave': return 'On Leave';
            default: return status;
        }
    }
};