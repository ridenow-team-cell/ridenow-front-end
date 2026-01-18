export interface ScheduleSeat {
    seatNumber: string;
    isBooked: boolean;
    ticketId: string | null;
    status: string;
}

export interface ScheduleStop {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    order: number;
    estimatedArrivalTime: string;
    estimatedDepartureTime: string;
}

export interface Schedule {
    id: string;
    routeId: string;
    busId: string;
    driverId: string;
    departureTime: string;
    arrivalTime: string;
    daysOfWeek: string[];
    numberOfAvailableSeats: number;
    seats: ScheduleSeat[];
    stops: ScheduleStop[];
    status: 'Scheduled' | 'Active' | 'Completed' | 'Cancelled';
    isActive: boolean;
    startDate: string;
    endDate: string;
    recurring: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ScheduleDetails extends Schedule {
    route: {
        id: string;
        name: string;
        description: string;
    };
    bus: {
        id: string;
        name: string;
        registrationName: string;
        totalSeats: number;
    };
    driver: {
        id: string;
        name: string;
        phoneNumber: string;
    };
    bookings: Array<{
        id: string;
        passengerName: string;
        seatNumber: string;
        status: string;
    }>;
}

export interface ScheduleQueryParams {
    status?: string;
    isActive?: boolean;
    routeId?: string;
    busId?: string;
    driverId?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface CreateScheduleRequest {
    routeId: string;
    busId: string;
    driverId: string;
    departureTime: string;
    arrivalTime: string;
    daysOfWeek: string[];
    startDate: string;
    endDate?: string;
    recurring: boolean;
    seats?: ScheduleSeat[];
}

export interface UpdateScheduleRequest {
    departureTime?: string;
    arrivalTime?: string;
    daysOfWeek?: string[];
    status?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
    recurring?: boolean;
}