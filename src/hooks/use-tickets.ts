import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '@/services/ticket-service';
import { TicketQueryParams, CreateTicketRequest, UpdateTicketRequest } from '@/types/ticket';
import { toast } from 'react-hot-toast';

export const ticketKeys = {
    all: ['tickets'] as const,
    lists: () => [...ticketKeys.all, 'list'] as const,
    list: (params: TicketQueryParams) => [...ticketKeys.lists(), params] as const,
    details: () => [...ticketKeys.all, 'detail'] as const,
    detail: (id: string) => [...ticketKeys.details(), id] as const,
    byNumber: (number: string) => [...ticketKeys.all, 'number', number] as const,
    byUser: (userId: string) => [...ticketKeys.all, 'user', userId] as const,
    bySchedule: (scheduleId: string) => [...ticketKeys.all, 'schedule', scheduleId] as const,
    byBus: (busId: string) => [...ticketKeys.all, 'bus', busId] as const,
    byRoute: (routeId: string) => [...ticketKeys.all, 'route', routeId] as const,
    statistics: (params?: { startDate?: string; endDate?: string }) => [...ticketKeys.all, 'statistics', params] as const,
    upcoming: (params?: { fromDate?: string }) => [...ticketKeys.all, 'upcoming', params] as const,
    today: () => [...ticketKeys.all, 'today'] as const,
    byDate: (date: string) => [...ticketKeys.all, 'date', date] as const,
    search: (term: string) => [...ticketKeys.all, 'search', term] as const,
    revenueReport: (params: { startDate: string; endDate: string }) => [...ticketKeys.all, 'revenue', params] as const,
};

export const useTickets = (params?: TicketQueryParams) => {
    return useQuery({
        queryKey: ticketKeys.list(params || {}),
        queryFn: () => ticketService.getTickets(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
};

export const useTicket = (id: string) => {
    return useQuery({
        queryKey: ticketKeys.detail(id),
        queryFn: () => ticketService.getTicketById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useTicketDetails = (id: string) => {
    return useQuery({
        queryKey: [...ticketKeys.detail(id), 'details'],
        queryFn: () => ticketService.getTicketDetails(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });
};

export const useCreateTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ticketData: CreateTicketRequest) => ticketService.createTicket(ticketData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ticketKeys.statistics() });
            toast.success('Ticket created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create ticket');
        },
    });
};

export const useUpdateTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTicketRequest }) =>
            ticketService.updateTicket(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ticketKeys.detail(variables.id) });
            toast.success('Ticket updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update ticket');
        },
    });
};

export const useDeleteTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ticketService.deleteTicket(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ticketKeys.statistics() });
            toast.success('Ticket updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete ticket');
        },
    });
};

export const useCancelTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ticketService.cancelTicket(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ticketKeys.detail(variables) });
            queryClient.invalidateQueries({ queryKey: ticketKeys.statistics() });
            toast.success('Ticket cancelled successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to cancel ticket');
        },
    });
};

export const useRefundTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ticketService.refundTicket(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ticketKeys.detail(variables) });
            queryClient.invalidateQueries({ queryKey: ticketKeys.statistics() });
            toast.success('Ticket refunded successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to refund ticket');
        },
    });
};

export const useCheckInTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ticketService.checkInTicket(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ticketKeys.detail(variables) });
            queryClient.invalidateQueries({ queryKey: ticketKeys.statistics() });
            toast.success('Ticket checked in successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to check in ticket');
        },
    });
};

export const useCompleteTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ticketService.completeTicket(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ticketKeys.detail(variables) });
            queryClient.invalidateQueries({ queryKey: ticketKeys.statistics() });
            toast.success('Ticket marked as completed');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to complete ticket');
        },
    });
};

export const useGenerateQRCode = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ticketService.generateQRCode(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.detail(variables) });
            toast.success('QR code generated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to generate QR code');
        },
    });
};

export const useTicketStatistics = (params?: { startDate?: string; endDate?: string }) => {
    return useQuery({
        queryKey: ticketKeys.statistics(params),
        queryFn: () => ticketService.getTicketStatistics(params),
        staleTime: 2 * 60 * 1000,
    });
};

export const useUpcomingTickets = (params?: { fromDate?: string }) => {
    return useQuery({
        queryKey: ticketKeys.upcoming(params),
        queryFn: () => ticketService.getUpcomingTickets(params),
        staleTime: 2 * 60 * 1000,
    });
};

export const useTodayTickets = () => {
    return useQuery({
        queryKey: ticketKeys.today(),
        queryFn: () => ticketService.getTodayTickets(),
        staleTime: 5 * 60 * 1000,
    });
};

export const useRevenueReport = (params: { startDate: string; endDate: string }) => {
    return useQuery({
        queryKey: ticketKeys.revenueReport(params),
        queryFn: () => ticketService.getRevenueReport(params),
        staleTime: 10 * 60 * 1000,
    });
};