export interface RouteStop {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    order: number;
    isPickupPoint: boolean;
    isDropoffPoint: boolean;
    estimatedArrivalTimeOffset: string;
}

export interface Route {
    id: string;
    name: string;
    description: string;
    stops: RouteStop[];
    status: 'Active' | 'Inactive' | 'Suspended';
    isActive: boolean;
    estimatedDuration: string;
    distance: number;
    createdAt: string;
    updatedAt: string;
}

// Update your types/route.ts to include the new response format
export interface RouteDetailsResponse {
    route: Route;
    assignedBuses: Array<{
        id: string;
        name: string;
        model: string;
        make: string;
        registrationName: string;
        color: string;
        year: number;
        status: string;
        isActive: boolean;
        totalSeats: number;
        createdAt: string;
        updatedAt: string;
        driverId: string | null;
        currentRouteId: string | null;
    }>;
    activeSchedules: Array<{
        id: string;
        routeId: string;
        busId: string;
        driverId: string;
        departureTime: string;
        arrivalTime: string;
        daysOfWeek: string[];
        numberOfAvailableSeats: number;
        seats: Array<{
            seatNumber: string;
            isBooked: boolean;
            ticketId: string | null;
            status: string;
        }>;
        stops: Array<{
            name: string;
            address: string;
            latitude: number;
            longitude: number;
            order: number;
            estimatedArrivalTime: string;
            estimatedDepartureTime: string;
        }>;
        status: string;
        isActive: boolean;
        startDate: string;
        endDate: string;
        recurring: boolean;
        createdAt: string;
        updatedAt: string;
    }>;
    statistics: {
        totalRoutes: number;
        activeRoutes: number;
        inactiveRoutes: number;
        underReviewRoutes: number;
        seasonalRoutes: number;
        averageStops: number;
        totalStops: number;
        totalSchedules: number;
        completedSchedules: number;
        upcomingSchedules: number;
        activeSchedules: number;
        averageRating: number;
        totalReviews: number;
        totalStopsOnRoute: number;
        pickupStops: number;
        dropoffStops: number;
    };
}

export interface RouteQueryParams {
    status?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    search?: string;
}

export interface CreateRouteRequest {
    name: string;
    description: string;
    stops: Omit<RouteStop, 'order'>[];
    status?: string;
    isActive?: boolean;
    estimatedDuration: string;
    distance: number;
}

export interface UpdateRouteRequest {
    name?: string;
    description?: string;
    stops?: RouteStop[];
    status?: string;
    isActive?: boolean;
    estimatedDuration?: string;
    distance?: number;
}

export interface LocationSuggestion {
    place_id: string;
    description: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
}