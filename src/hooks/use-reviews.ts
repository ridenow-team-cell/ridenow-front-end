import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/review-service';
import { ReviewQueryParams, RespondToReviewRequest, UpdateReviewStatusRequest } from '@/types/review';
import { toast } from 'react-hot-toast';

export const reviewKeys = {
    all: ['reviews'] as const,
    lists: () => [...reviewKeys.all, 'list'] as const,
    list: (params: ReviewQueryParams) => [...reviewKeys.lists(), params] as const,
    details: () => [...reviewKeys.all, 'detail'] as const,
    detail: (id: string) => [...reviewKeys.details(), id] as const,
    approved: () => [...reviewKeys.all, 'approved'] as const,
    pending: () => [...reviewKeys.all, 'pending'] as const,
    highRating: () => [...reviewKeys.all, 'high-rating'] as const,
    lowRating: () => [...reviewKeys.all, 'low-rating'] as const,
    recent: () => [...reviewKeys.all, 'recent'] as const,
    statistics: () => [...reviewKeys.all, 'statistics'] as const,
    analytics: () => [...reviewKeys.all, 'analytics'] as const,
    byRoute: (routeId: string) => [...reviewKeys.all, 'route', routeId] as const,
    byBus: (busId: string) => [...reviewKeys.all, 'bus', busId] as const,
    byDriver: (driverId: string) => [...reviewKeys.all, 'driver', driverId] as const,
    search: (term: string) => [...reviewKeys.all, 'search', term] as const,
};

export const useReviews = (params?: ReviewQueryParams) => {
    return useQuery({
        queryKey: reviewKeys.list(params || {}),
        queryFn: () => reviewService.getReviews(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
};

export const useReview = (id: string) => {
    return useQuery({
        queryKey: reviewKeys.detail(id),
        queryFn: () => reviewService.getReviewById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useReviewDetails = (id: string) => {
    return useQuery({
        queryKey: [...reviewKeys.detail(id), 'details'],
        queryFn: () => reviewService.getReviewDetails(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });
};

export const useApprovedReviews = (limit?: number) => {
    return useQuery({
        queryKey: [...reviewKeys.approved(), { limit }],
        queryFn: () => reviewService.getApprovedReviews(limit),
        staleTime: 5 * 60 * 1000,
    });
};

export const usePendingReviews = (limit?: number) => {
    return useQuery({
        queryKey: [...reviewKeys.pending(), { limit }],
        queryFn: () => reviewService.getPendingReviews(limit),
        staleTime: 2 * 60 * 1000,
    });
};

export const useReviewStatistics = () => {
    return useQuery({
        queryKey: reviewKeys.statistics(),
        queryFn: () => reviewService.getReviewStatistics(),
        staleTime: 5 * 60 * 1000,
    });
};

export const useReviewAnalytics = () => {
    return useQuery({
        queryKey: reviewKeys.analytics(),
        queryFn: () => reviewService.getReviewAnalytics(),
        staleTime: 10 * 60 * 1000,
    });
};

export const useRespondToReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, response }: { id: string; response: string }) =>
            reviewService.respondToReview(id, { response }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
            queryClient.invalidateQueries({ queryKey: reviewKeys.detail(variables.id) });
            toast.success('Response sent successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to respond to review');
        },
    });
};

export const useApproveReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => reviewService.approveReview(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
            queryClient.invalidateQueries({ queryKey: reviewKeys.detail(variables) });
            toast.success('Review approved successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to approve review');
        },
    });
};

export const useRejectReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => reviewService.rejectReview(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
            queryClient.invalidateQueries({ queryKey: reviewKeys.detail(variables) });
            toast.success('Review rejected successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to reject review');
        },
    });
};

export const useToggleFeaturedReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => reviewService.toggleFeatured(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
            queryClient.invalidateQueries({ queryKey: reviewKeys.detail(variables) });
            toast.success('Featured status updated');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update featured status');
        },
    });
};

export const useDeleteReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => reviewService.deleteReview(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
            toast.success('Review deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete review');
        },
    });
};

export const useExportReviews = () => {
    return useMutation({
        mutationFn: (params?: ReviewQueryParams) => reviewService.exportReviews(params),
        onSuccess: (data) => {
            // Create download link
            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reviews_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Reviews exported successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to export reviews');
        },
    });
};