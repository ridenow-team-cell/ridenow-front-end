import { axiosInstance } from '@/utils/axios';
import {
    Review,
    ReviewDetails,
    ReviewQueryParams,
    ReviewResponse,
    RespondToReviewRequest,
    UpdateReviewStatusRequest,
    ReviewStatistics,
    ReviewAnalytics
} from '@/types/review';

export const reviewService = {
    // Get all reviews with filters
    getReviews: async (params?: ReviewQueryParams): Promise<ReviewResponse> => {
        const response = await axiosInstance.get('/admin/reviews', { params });
        return response.data;
    },

    // Get review by ID
    getReviewById: async (id: string): Promise<Review> => {
        const response = await axiosInstance.get(`/admin/reviews/${id}`);
        return response.data;
    },

    // Get review details
    getReviewDetails: async (id: string): Promise<ReviewDetails> => {
        const response = await axiosInstance.get(`/admin/reviews/${id}/details`);
        return response.data;
    },

    // Get approved reviews
    getApprovedReviews: async (limit?: number): Promise<Review[]> => {
        const response = await axiosInstance.get('/admin/reviews/approved', {
            params: { limit }
        });
        return response.data;
    },

    // Get pending reviews
    getPendingReviews: async (limit?: number): Promise<Review[]> => {
        const response = await axiosInstance.get('/admin/reviews/pending', {
            params: { limit }
        });
        return response.data;
    },

    // Get reviews by route
    getReviewsByRoute: async (routeId: string, limit?: number): Promise<Review[]> => {
        const response = await axiosInstance.get(`/admin/reviews/route/${routeId}`, {
            params: { limit }
        });
        return response.data;
    },

    // Get reviews by bus
    getReviewsByBus: async (busId: string, limit?: number): Promise<Review[]> => {
        const response = await axiosInstance.get(`/admin/reviews/bus/${busId}`, {
            params: { limit }
        });
        return response.data;
    },

    // Get reviews by driver
    getReviewsByDriver: async (driverId: string, limit?: number): Promise<Review[]> => {
        const response = await axiosInstance.get(`/admin/reviews/driver/${driverId}`, {
            params: { limit }
        });
        return response.data;
    },

    // Get high rating reviews (4-5 stars)
    getHighRatingReviews: async (limit?: number): Promise<Review[]> => {
        const response = await axiosInstance.get('/admin/reviews/high-rating', {
            params: { limit }
        });
        return response.data;
    },

    // Get low rating reviews (1-2 stars)
    getLowRatingReviews: async (limit?: number): Promise<Review[]> => {
        const response = await axiosInstance.get('/admin/reviews/low-rating', {
            params: { limit }
        });
        return response.data;
    },

    // Get recent reviews (last 30 days)
    getRecentReviews: async (limit?: number): Promise<Review[]> => {
        const response = await axiosInstance.get('/admin/reviews/recent', {
            params: { limit }
        });
        return response.data;
    },

    // Respond to review
    respondToReview: async (id: string, responseData: RespondToReviewRequest): Promise<Review> => {
        const response = await axiosInstance.post(`/admin/reviews/${id}/respond`, responseData);
        return response.data;
    },

    // Approve review
    approveReview: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/reviews/${id}/approve`);
        return response.data;
    },

    // Reject review
    rejectReview: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/reviews/${id}/reject`);
        return response.data;
    },

    // Update review status
    updateReviewStatus: async (id: string, statusData: UpdateReviewStatusRequest): Promise<Review> => {
        const response = await axiosInstance.put(`/admin/reviews/${id}/status`, statusData);
        return response.data;
    },

    // Toggle featured status
    toggleFeatured: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/reviews/${id}/toggle-featured`);
        return response.data;
    },

    // Delete review
    deleteReview: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.delete(`/admin/reviews/${id}`);
        return response.data;
    },

    // Get review statistics
    getReviewStatistics: async (): Promise<ReviewStatistics> => {
        const response = await axiosInstance.get('/admin/reviews/statistics');
        return response.data;
    },

    // Get review analytics
    getReviewAnalytics: async (): Promise<ReviewAnalytics> => {
        const response = await axiosInstance.get('/admin/reviews/analytics');
        return response.data;
    },

    // Search reviews
    searchReviews: async (term: string): Promise<Review[]> => {
        const response = await axiosInstance.get('/admin/reviews/search', {
            params: { term }
        });
        return response.data;
    },

    // Export reviews
    exportReviews: async (params?: ReviewQueryParams): Promise<Blob> => {
        const response = await axiosInstance.get('/admin/reviews/export', {
            params,
            responseType: 'blob'
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
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    },

    getStatusBadge: (status: string): string => {
        switch (status) {
            case 'Approved': return 'Approved';
            case 'Pending': return 'Pending Review';
            case 'Rejected': return 'Rejected';
            default: return status;
        }
    },

    calculateAverageRating: (ratings: { overallRating: number }[]): number => {
        if (ratings.length === 0) return 0;
        const total = ratings.reduce((sum, review) => sum + review.overallRating, 0);
        return total / ratings.length;
    },

    generateRatingStars: (rating: number, maxStars: number = 5): string[] => {
        const stars = [];
        for (let i = 1; i <= maxStars; i++) {
            stars.push(i <= Math.floor(rating) ? '★' : '☆');
        }
        return stars;
    }
};