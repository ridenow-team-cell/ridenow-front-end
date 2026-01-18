import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportService } from '@/services/support-sevice';
import { SupportTicketQueryParams, CreateSupportTicketRequest, UpdateTicketStatusRequest, AddCommentRequest, AssignTicketRequest } from '@/types/support';
import { toast } from 'react-hot-toast';

export const supportKeys = {
    all: ['support-tickets'] as const,
    lists: () => [...supportKeys.all, 'list'] as const,
    list: (params: SupportTicketQueryParams) => [...supportKeys.lists(), params] as const,
    details: () => [...supportKeys.all, 'detail'] as const,
    detail: (id: string) => [...supportKeys.details(), id] as const,
    byNumber: (number: string) => [...supportKeys.all, 'number', number] as const,
    byStatus: (status: string) => [...supportKeys.all, 'status', status] as const,
    byCategory: (category: string) => [...supportKeys.all, 'category', category] as const,
    byPriority: (priority: string) => [...supportKeys.all, 'priority', priority] as const,
    open: () => [...supportKeys.all, 'open'] as const,
    recent: () => [...supportKeys.all, 'recent'] as const,
    statistics: () => [...supportKeys.all, 'statistics'] as const,
    search: (term: string) => [...supportKeys.all, 'search', term] as const,
};

export const useTickets = (params?: SupportTicketQueryParams) => {
    return useQuery({
        queryKey: supportKeys.list(params || {}),
        queryFn: () => supportService.getTickets(params),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
    });
};

export const useTicketsPaged = (params?: SupportTicketQueryParams) => {
    return useQuery({
        queryKey: [...supportKeys.list(params || {}), 'paged'],
        queryFn: () => supportService.getTicketsPaged(params),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
    });
};

export const useTicket = (id: string) => {
    return useQuery({
        queryKey: supportKeys.detail(id),
        queryFn: () => supportService.getTicketById(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });
};

export const useTicketDetails = (id: string) => {
    return useQuery({
        queryKey: [...supportKeys.detail(id), 'details'],
        queryFn: () => supportService.getTicketDetails(id),
        enabled: !!id,
        staleTime: 1 * 60 * 1000,
    });
};

export const useCreateTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ticketData: CreateSupportTicketRequest) => supportService.createTicket(ticketData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: supportKeys.lists() });
            toast.success('Support ticket created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create support ticket');
        },
    });
};

export const useUpdateTicketStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            supportService.updateTicketStatus(id, { status }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: supportKeys.lists() });
            queryClient.invalidateQueries({ queryKey: supportKeys.detail(variables.id) });
            toast.success('Ticket status updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update ticket status');
        },
    });
};

export const useAssignTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, userId }: { id: string; userId: string }) =>
            supportService.assignTicket(id, { assignedToUserId: userId }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: supportKeys.lists() });
            queryClient.invalidateQueries({ queryKey: supportKeys.detail(variables.id) });
            toast.success('Ticket assigned successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to assign ticket');
        },
    });
};

export const useAddComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, comment, isInternal }: { id: string; comment: string; isInternal?: boolean }) =>
            supportService.addComment(id, { comment, isInternal }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [...supportKeys.detail(variables.id), 'details'] });
            toast.success('Comment added successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add comment');
        },
    });
};

export const useSupportStatistics = () => {
    return useQuery({
        queryKey: supportKeys.statistics(),
        queryFn: () => supportService.getStatistics(),
        staleTime: 5 * 60 * 1000,
    });
};

export const useOpenTickets = () => {
    return useQuery({
        queryKey: supportKeys.open(),
        queryFn: () => supportService.getOpenTickets(),
        staleTime: 2 * 60 * 1000,
    });
};

export const useRecentTickets = () => {
    return useQuery({
        queryKey: supportKeys.recent(),
        queryFn: () => supportService.getRecentTickets(),
        staleTime: 2 * 60 * 1000,
    });
};

export const useSearchTickets = (term: string) => {
    return useQuery({
        queryKey: supportKeys.search(term),
        queryFn: () => supportService.searchTickets(term),
        enabled: !!term && term.length >= 2,
        staleTime: 2 * 60 * 1000,
    });
};