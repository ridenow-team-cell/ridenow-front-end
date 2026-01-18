export interface Review {
    id: string;
    userId: string;
    tripId: string;
    routeId: string;
    busId: string;
    driverId: string;
    overallRating: number;
    punctualityRating: number;
    comfortRating: number;
    safetyRating: number;
    driverRating: number;
    comment: string;
    response?: string;
    respondedBy?: string;
    responseDate?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    isApproved: boolean;
    isFeatured: boolean;
    likes: number;
    createdAt: string;
    updatedAt: string;
}

export interface ReviewDetails extends Review {
    user: {
        id: string;
        name: string;
        email: string;
        photoUrl?: string;
        userType: string;
    };
    trip: {
        id: string;
        scheduleId: string;
        startTime: string;
        endTime: string;
        status: string;
    };
    route: {
        id: string;
        name: string;
        description: string;
    };
    bus: {
        id: string;
        name: string;
        registrationName: string;
    };
    driver: {
        id: string;
        name: string;
        licenseNumber: string;
    };
}

export interface ReviewQueryParams {
    status?: string;
    isApproved?: boolean;
    minRating?: number;
    maxRating?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    search?: string;
    userId?: string;
    routeId?: string;
    busId?: string;
    driverId?: string;
    isFeatured?: boolean;
}

export interface ReviewResponse {
    reviews: Review[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface RespondToReviewRequest {
    response: string;
}

export interface UpdateReviewStatusRequest {
    status: 'Approved' | 'Rejected';
    isApproved: boolean;
}

export interface ReviewStatistics {
    totalReviews: number;
    approvedReviews: number;
    pendingReviews: number;
    rejectedReviews: number;
    averageRating: number;
    ratingDistribution: {
        rating: number;
        count: number;
        percentage: number;
    }[];
    recentReviews: number;
    featuredReviews: number;
}

export interface ReviewAnalytics {
    byRoute: Array<{
        routeId: string;
        routeName: string;
        averageRating: number;
        totalReviews: number;
    }>;
    byDriver: Array<{
        driverId: string;
        driverName: string;
        averageRating: number;
        totalReviews: number;
    }>;
    byBus: Array<{
        busId: string;
        busName: string;
        averageRating: number;
        totalReviews: number;
    }>;
    trends: {
        daily: Array<{
            date: string;
            count: number;
            averageRating: number;
        }>;
        weekly: Array<{
            week: string;
            count: number;
            averageRating: number;
        }>;
    };
}