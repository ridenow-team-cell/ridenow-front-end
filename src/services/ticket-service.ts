import { axiosInstance } from '@/utils/axios';
import {
    Ticket,
    TicketDetails,
    TicketQueryParams,
    CreateTicketRequest,
    UpdateTicketRequest,
    TicketStatistics,
    RevenueReport
} from '@/types/ticket';

export const ticketService = {
    // Get all tickets with pagination
    getTickets: async (params?: TicketQueryParams): Promise<{ data: Ticket[]; total: number; page: number; pageSize: number }> => {
        const response = await axiosInstance.get('/admin/tickets', { params });
        return response.data;
    },

    // Get ticket by ID
    getTicketById: async (id: string): Promise<Ticket> => {
        const response = await axiosInstance.get(`/admin/tickets/${id}`);
        return response.data;
    },

    // Get ticket details
    getTicketDetails: async (id: string): Promise<TicketDetails> => {
        const response = await axiosInstance.get(`/admin/tickets/${id}/details`);
        return response.data;
    },

    // Get ticket by number
    getTicketByNumber: async (ticketNumber: string): Promise<Ticket> => {
        const response = await axiosInstance.get(`/admin/tickets/number/${ticketNumber}`);
        return response.data;
    },

    // Create ticket
    createTicket: async (ticketData: CreateTicketRequest): Promise<Ticket> => {
        const response = await axiosInstance.post('/admin/tickets', ticketData);
        return response.data;
    },

    // Update ticket
    updateTicket: async (id: string, ticketData: UpdateTicketRequest): Promise<Ticket> => {
        const response = await axiosInstance.put(`/admin/tickets/${id}`, ticketData);
        return response.data;
    },

    // Delete ticket
    deleteTicket: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.delete(`/admin/tickets/${id}`);
        return response.data;
    },

    // Cancel ticket
    cancelTicket: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/tickets/${id}/cancel`);
        return response.data;
    },

    // Refund ticket
    refundTicket: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/tickets/${id}/refund`);
        return response.data;
    },

    // Check in ticket
    checkInTicket: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/tickets/${id}/checkin`);
        return response.data;
    },

    // Complete ticket
    completeTicket: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/tickets/${id}/complete`);
        return response.data;
    },

    // Generate QR code
    generateQRCode: async (id: string): Promise<{ qrCodeUrl: string }> => {
        const response = await axiosInstance.post(`/admin/tickets/${id}/generate-qrcode`);
        return response.data;
    },

    // Get tickets by user
    getTicketsByUser: async (userId: string): Promise<Ticket[]> => {
        const response = await axiosInstance.get(`/admin/tickets/user/${userId}`);
        return response.data;
    },

    // Get tickets by schedule
    getTicketsBySchedule: async (scheduleId: string): Promise<Ticket[]> => {
        const response = await axiosInstance.get(`/admin/tickets/schedule/${scheduleId}`);
        return response.data;
    },

    // Get tickets by bus
    getTicketsByBus: async (busId: string): Promise<Ticket[]> => {
        const response = await axiosInstance.get(`/admin/tickets/bus/${busId}`);
        return response.data;
    },

    // Get tickets by route
    getTicketsByRoute: async (routeId: string): Promise<Ticket[]> => {
        const response = await axiosInstance.get(`/admin/tickets/route/${routeId}`);
        return response.data;
    },

    // Get ticket statistics
    getTicketStatistics: async (params?: { startDate?: string; endDate?: string }): Promise<TicketStatistics> => {
        const response = await axiosInstance.get('/admin/tickets/statistics', { params });
        return response.data;
    },

    // Get upcoming tickets
    getUpcomingTickets: async (params?: { fromDate?: string }): Promise<Ticket[]> => {
        const response = await axiosInstance.get('/admin/tickets/upcoming', { params });
        return response.data;
    },

    // Get today's tickets
    getTodayTickets: async (): Promise<Ticket[]> => {
        const response = await axiosInstance.get('/admin/tickets/today');
        return response.data;
    },

    // Get tickets for specific date
    getTicketsForDate: async (date: string): Promise<Ticket[]> => {
        const response = await axiosInstance.get(`/admin/tickets/date/${date}`);
        return response.data;
    },

    // Search tickets
    searchTickets: async (term: string): Promise<Ticket[]> => {
        const response = await axiosInstance.get('/admin/tickets/search', {
            params: { term }
        });
        return response.data;
    },

    // Get revenue report
    getRevenueReport: async (params: { startDate: string; endDate: string }): Promise<RevenueReport> => {
        const response = await axiosInstance.get('/admin/tickets/revenue-report', { params });
        return response.data;
    },

    // Update ticket status
    updateTicketStatus: async (id: string, status: string): Promise<{ message: string }> => {
        const response = await axiosInstance.put(`/admin/tickets/${id}/status`, { status });
        return response.data;
    },

    // Update payment status
    updatePaymentStatus: async (id: string, paymentStatus: string): Promise<{ message: string }> => {
        const response = await axiosInstance.put(`/admin/tickets/${id}/payment-status`, { paymentStatus });
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

    formatPrice: (price: number): string => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    },

    getStatusColor: (status: string): string => {
        switch (status) {
            case 'Booked': return 'bg-blue-100 text-blue-800';
            case 'CheckedIn': return 'bg-green-100 text-green-800';
            case 'Completed': return 'bg-gray-100 text-gray-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            case 'NoShow': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    },

    getPaymentStatusColor: (status: string): string => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Refunded': return 'bg-purple-100 text-purple-800';
            case 'Failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    },

    generateTicketNumber: (): string => {
        const prefix = 'TICKET';
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}${year}${month}${day}${random}`;
    }
};