import { axiosInstance } from '@/utils/axios';
import {
    SupportTicket,
    SupportTicketDetails,
    SupportTicketQueryParams,
    CreateSupportTicketRequest,
    UpdateTicketStatusRequest,
    AddCommentRequest,
    AssignTicketRequest,
    SupportStatistics
} from '@/types/support';

export const supportService = {
    // Get all tickets
    getTickets: async (params?: SupportTicketQueryParams): Promise<SupportTicket[]> => {
        const response = await axiosInstance.get('/admin/support-tickets', { params });
        return response.data;
    },

    // Get tickets with pagination
    getTicketsPaged: async (params?: SupportTicketQueryParams): Promise<{ data: SupportTicket[]; total: number; page: number; pageSize: number }> => {
        const response = await axiosInstance.get('/admin/support-tickets/paged', { params });
        return response.data;
    },

    // Get ticket by ID
    getTicketById: async (id: string): Promise<SupportTicket> => {
        const response = await axiosInstance.get(`/admin/support-tickets/${id}`);
        return response.data;
    },

    // Get ticket by number
    getTicketByNumber: async (ticketNumber: string): Promise<SupportTicket> => {
        const response = await axiosInstance.get(`/admin/support-tickets/number/${ticketNumber}`);
        return response.data;
    },

    // Get ticket details
    getTicketDetails: async (id: string): Promise<SupportTicketDetails> => {
        const response = await axiosInstance.get(`/admin/support-tickets/${id}`);
        return response.data;
    },

    // Create ticket
    // Update the createTicket method to handle optional fields
    createTicket: async (ticketData: CreateSupportTicketRequest): Promise<SupportTicket> => {
        // Prepare request body with only defined fields
        const requestBody: any = {
            title: ticketData.title,
            description: ticketData.description,
            category: ticketData.category,
            priority: ticketData.priority,
            status: ticketData.status || 'Open',
            createdByUserId: ticketData.createdByUserId,
        };

        // Only include optional fields if they have values
        if (ticketData.assignedToUserId) {
            requestBody.assignedToUserId = ticketData.assignedToUserId;
        }
        if (ticketData.relatedTripId) {
            requestBody.relatedTripId = ticketData.relatedTripId;
        }
        if (ticketData.relatedBusId) {
            requestBody.relatedBusId = ticketData.relatedBusId;
        }
        if (ticketData.relatedDriverId) {
            requestBody.relatedDriverId = ticketData.relatedDriverId;
        }
        if (ticketData.attachments && ticketData.attachments.length > 0) {
            requestBody.attachments = ticketData.attachments;
        }

        const response = await axiosInstance.post('/admin/support-tickets', requestBody);
        return response.data;
    },

    // Update ticket status
    updateTicketStatus: async (id: string, statusData: UpdateTicketStatusRequest): Promise<SupportTicket> => {
        const response = await axiosInstance.put(`/admin/support-tickets/${id}/status`, statusData);
        return response.data;
    },

    // Assign ticket
    assignTicket: async (id: string, assignData: AssignTicketRequest): Promise<SupportTicket> => {
        const response = await axiosInstance.put(`/admin/support-tickets/${id}/assign`, assignData);
        return response.data;
    },

    // Add comment
    addComment: async (id: string, commentData: AddCommentRequest): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/support-tickets/${id}/comments`, commentData);
        return response.data;
    },

    // Search tickets
    searchTickets: async (term: string): Promise<SupportTicket[]> => {
        const response = await axiosInstance.get('/admin/support-tickets/search', {
            params: { term }
        });
        return response.data;
    },

    // Get tickets by status
    getTicketsByStatus: async (status: string): Promise<SupportTicket[]> => {
        const response = await axiosInstance.get(`/admin/support-tickets/status/${status}`);
        return response.data;
    },

    // Get tickets by category
    getTicketsByCategory: async (category: string): Promise<SupportTicket[]> => {
        const response = await axiosInstance.get(`/admin/support-tickets/category/${category}`);
        return response.data;
    },

    // Get tickets by priority
    getTicketsByPriority: async (priority: string): Promise<SupportTicket[]> => {
        const response = await axiosInstance.get(`/admin/support-tickets/priority/${priority}`);
        return response.data;
    },

    // Get open tickets
    getOpenTickets: async (): Promise<SupportTicket[]> => {
        const response = await axiosInstance.get('/admin/support-tickets/open');
        return response.data;
    },

    // Get recent tickets
    getRecentTickets: async (): Promise<SupportTicket[]> => {
        const response = await axiosInstance.get('/admin/support-tickets/recent');
        return response.data;
    },

    // Get statistics
    getStatistics: async (): Promise<SupportStatistics> => {
        const response = await axiosInstance.get('/admin/support-tickets/statistics');
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

    formatDateTime: (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    getStatusColor: (status: string): string => {
        switch (status) {
            case 'Open': return 'bg-[#DADADA] text-white';
            case 'In Progress': return 'bg-[#E7A53380] text-[#3F3F3F]';
            case 'Resolved': return 'bg-[#3EAE4980] text-[#010237]';
            case 'Closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    },

    getPriorityColor: (priority: string): string => {
        switch (priority) {
            case 'Critical': return 'bg-red-100 text-red-800';
            case 'High': return 'bg-orange-100 text-orange-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    },

    getCategoryColor: (category: string): string => {
        switch (category) {
            case 'Service Issues': return 'bg-blue-100 text-blue-800';
            case 'Payment': return 'bg-purple-100 text-purple-800';
            case 'Technical': return 'bg-indigo-100 text-indigo-800';
            case 'Account': return 'bg-pink-100 text-pink-800';
            case 'Other': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    },

    getStatusBadge: (status: string): string => {
        return '';
    },

    getPriorityBadge: (priority: string): string => {
        return '';
    }
};