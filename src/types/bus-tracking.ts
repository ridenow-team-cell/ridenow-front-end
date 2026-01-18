export interface BusTracking {
    id: string;
    busId: string;
    routeId?: string;
    scheduleId?: string;
    driverId?: string;
    latitude: number;
    longitude: number;
    speed: number;
    heading: number;
    status: 'Tracking' | 'Stopped' | 'Parked' | 'Offline' | 'Maintenance';
    timestamp: string;
    nextStopId?: string;
    estimatedArrivalAtNextStop?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BusTrackingDetails extends BusTracking {
    bus: {
        id: string;
        name: string;
        registrationName: string;
        model: string;
        color: string;
        totalSeats: number;
    };
    route?: {
        id: string;
        name: string;
        description: string;
        stops: Array<{
            id: string;
            name: string;
            address: string;
            latitude: number;
            longitude: number;
            order: number;
            estimatedArrivalTimeOffset: string;
        }>;
    };
    schedule?: {
        id: string;
        departureTime: string;
        arrivalTime: string;
        daysOfWeek: string[];
        status: string;
    };
    driver?: {
        id: string;
        name: string;
        phoneNumber: string;
    };
    nextStop?: {
        id: string;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        order: number;
    };
}

export interface LiveBusStatus {
    busId: string;
    busName: string;
    registrationName: string;
    latitude: number;
    longitude: number;
    speed: number;
    heading: number;
    status: string;
    lastUpdated: string;
    routeName?: string;
    driverName?: string;
    nextStopName?: string;
    estimatedArrival?: string;
    passengersOnBoard: number;
    totalSeats: number;
}

export interface BusTrackingQueryParams {
    page?: number;
    pageSize?: number;
    busId?: string;
    routeId?: string;
    driverId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    date?: string;
    limit?: number;
}

export interface UpdateTrackingStatusRequest {
    status: string;
}

export interface UpdateLocationRequest {
    latitude: number;
    longitude: number;
    speed?: number;
    heading?: number;
    status?: string;
    nextStopId?: string;
    estimatedArrivalAtNextStop?: string;
}

export interface CreateTrackingRequest {
    busId: string;
    routeId?: string;
    scheduleId?: string;
    latitude: number;
    longitude: number;
    speed: number;
    heading: number;
    status: string;
    timestamp?: string;
    nextStopId?: string;
    estimatedArrivalAtNextStop?: string;
}

export interface TrackingStatistics {
    totalTrackingRecords: number;
    activeBuses: number;
    stoppedBuses: number;
    parkedBuses: number;
    offlineBuses: number;
    averageSpeed: number;
    totalDistanceToday: number;
    busesByStatus: Record<string, number>;
    routesWithActiveBuses: number;
}