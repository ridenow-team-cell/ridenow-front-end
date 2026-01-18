import { axiosInstance } from '@/utils/axios';
import {
    User,
    UserQueryParams,
    CreateUserRequest,
    UpdateUserRequest,
    ChangeRoleRequest,
    PaginatedResponse
} from '@/types/admin';


export const userService = {
    // Get all users with filters and pagination
    getUsers: async (params?: UserQueryParams): Promise<User[]> => {
        const response = await axiosInstance.get('/admin/users', { params });
        // If API returns paginated response, adjust accordingly
        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
            return response.data.data; // For paginated response
        }
        return response.data; // For array response
    },

    // Get single user by ID
    getUserById: async (id: string): Promise<User> => {
        const response = await axiosInstance.get(`/admin/users/${id}`);
        return response.data;
    },

    // Get user by email
    getUserByEmail: async (email: string): Promise<User> => {
        const response = await axiosInstance.get(`/admin/users/email/${email}`);
        return response.data;
    },

    // Create new user
    createUser: async (userData: CreateUserRequest): Promise<User> => {
        const response = await axiosInstance.post('/admin/users', userData);
        return response.data;
    },

    // Update user
    updateUser: async (id: string, userData: UpdateUserRequest): Promise<User> => {
        const response = await axiosInstance.put(`/admin/users/${id}`, userData);
        return response.data;
    },

    // Delete user
    deleteUser: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.delete(`/admin/users/${id}`);
        return response.data;
    },

    // Activate user
    activateUser: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/users/${id}/activate`);
        return response.data;
    },

    // Deactivate user
    deactivateUser: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/users/${id}/deactivate`);
        return response.data;
    },

    // Change user role
    changeUserRole: async (id: string, roleData: ChangeRoleRequest): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/users/${id}/role`, roleData);
        return response.data;
    },

    // Get users by role
    getUsersByRole: async (role: string): Promise<User[]> => {
        const response = await axiosInstance.get(`/admin/users/role/${role}`);
        return response.data;
    },

    // Check if user exists
    checkUserExists: async (email?: string, phone?: string): Promise<{ exists: boolean }> => {
        const response = await axiosInstance.get('/admin/users/exists', {
            params: { email, phone }
        });
        return response.data;
    },

    // Search users
    searchUsers: async (term: string): Promise<User[]> => {
        const response = await axiosInstance.get('/admin/users/search', {
            params: { term }
        });
        return response.data;
    },

    // Format date
    formatDate: (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    },

    // Get status badge color
    getStatusColor: (status: string): string => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Inactive': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    },

    // Get role badge color
    getRoleColor: (role: string): string => {
        switch (role) {
            case 'Admin': return 'bg-blue-100 text-blue-800';
            case 'Driver': return 'bg-orange-100 text-orange-800';
            case 'Student': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
};