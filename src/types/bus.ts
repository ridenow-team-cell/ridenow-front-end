export interface Bus {
    id: string;
    name: string;
    model: string;
    make: string;
    registrationName: string;
    color: string;
    year: number;
    status: 'Available' | 'OnRoute' | 'Maintenance' | 'OutOfService';
    isActive: boolean;
    totalSeats: number;
    createdAt: string;
    updatedAt: string;
    driverId: string | null;
    currentRouteId: string | null;
}

export interface BusDetails {
    bus: Bus;
    driver: {
        id: string;
        name: string;
        email: string;
        phoneNo: string;
    } | null;
    route: {
        id: string;
        name: string;
        description: string;
        status: string;
        stops: Array<{
            name: string;
            address: string;
            order: number;
            isPickupPoint: boolean;
            isDropoffPoint: boolean;
        }>;
    } | null;
    activeSchedules: Array<{
        id: string;
        departureTime: string;
        arrivalTime: string;
        daysOfWeek: string[];
        status: string;
        numberOfAvailableSeats: number;
    }>;
    utilization: {
        totalTrips: number;
        completedTrips: number;
        activeTrips: number;
        seatUtilization: number;
    };
}

export interface BusQueryParams {
    status?: string;
    isActive?: boolean;
    minSeats?: number;
    maxSeats?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    search?: string;
}

export interface CreateBusRequest {
    name: string;
    model: string;
    make: string;
    registrationName: string;
    color: string;
    year: number;
    status?: string;
    isActive?: boolean;
    totalSeats: number;
}

export interface UpdateBusRequest {
    name?: string;
    model?: string;
    make?: string;
    registrationName?: string;
    color?: string;
    year?: number;
    status?: string;
    totalSeats?: number;
}

export interface AssignDriverRequest {
    driverId: string;
}

export interface AssignRouteRequest {
    routeId: string;
}

export interface ChangeStatusRequest {
    status: string;
}